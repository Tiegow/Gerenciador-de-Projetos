"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { ColumnComponent } from "./column"
import { AddColumnButton } from "./add-column-button"
import { useBoardStore } from "@/stores/board.store"
import { TaskCard } from "./task-card"
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet"

// Tipos simplificados para o cliente
type UserData = { id: string; name: string | null; image: string | null; email: string }
type TagData = { id: string; name: string; color: string; projectId: string }
type TaskTagData = { taskId: string; tagId: string; tag: TagData }

export type TaskWithDetails = {
  id: string
  title: string
  description: string | null
  order: number
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
  dueDate: Date | null
  columnId: string
  assignee: UserData | null
  tags: TaskTagData[]
}

export type ColumnWithTasks = {
  id: string
  name: string
  order: number
  color: string | null
  tasks: TaskWithDetails[]
}

// O tipo de Project que o server componente injeta
type ProjectData = {
  id: string
  columns: any[]
  tasks: any[]
}

interface BoardClientProps {
  project: ProjectData
  role: string
}

export function BoardClient({ project, role }: BoardClientProps) {
  const { columns, setColumns, moveTaskLocal, revertMove } = useBoardStore()
  const [activeTask, setActiveTask] = useState<TaskWithDetails | null>(null)
  
  const canManageColumns = role === "OWNER" || role === "ADMIN"

  // Inicializar Zustand
  useEffect(() => {
    const initialColumns: ColumnWithTasks[] = project.columns.map((col) => ({
      ...col,
      tasks: project.tasks.filter((t: any) => t.columnId === col.id).sort((a: any, b: any) => a.order - b.order),
    })).sort((a, b) => a.order - b.order)
    setColumns(initialColumns)
  }, [project, setColumns])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeData = active.data.current?.task as TaskWithDetails | undefined
    if (activeData) {
      setActiveTask(activeData)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    // Não faremos lógica complexa no over por enquanto para simplificar o drag nativo.
    // O dnd-kit tem hooks internos no SortableContext que já cuidam de boa parte da visualização.
  }

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === "Task"
    const isOverTask = over.data.current?.type === "Task"
    const isOverColumn = over.data.current?.type === "Column"

    if (isActiveTask) {
      const activeTaskData = active.data.current?.task as TaskWithDetails
      const sourceColumnId = activeTaskData.columnId

      let destColumnId = sourceColumnId
      let finalIndex = 0

      if (isOverTask) {
        const overTaskData = over.data.current?.task as TaskWithDetails
        destColumnId = overTaskData.columnId
        
        const destCol = columns.find(c => c.id === destColumnId)
        if (destCol) {
          const overTaskIndex = destCol.tasks.findIndex(t => t.id === overId)
          finalIndex = overTaskIndex >= 0 ? overTaskIndex : 0
          
          const activeTaskIndex = destCol.tasks.findIndex(t => t.id === activeId)
          if (sourceColumnId === destColumnId && activeTaskIndex >= 0) {
            // Lógica simples: se o destino estiver abaixo da origem, o splice deslocará a posição
            // O Zustand moveTaskLocal lida com splice, então o target index é o index da posição final real
          }
        }
      } else if (isOverColumn) {
        destColumnId = overId
        const destCol = columns.find(c => c.id === destColumnId)
        finalIndex = destCol ? destCol.tasks.length : 0
      }

      if (sourceColumnId === destColumnId && activeTaskData.order === finalIndex) {
        return // não mudou nada
      }

      const snapshot = JSON.parse(JSON.stringify(columns)) // deep clone
      moveTaskLocal(activeId, sourceColumnId, destColumnId, finalIndex)

      try {
        const res = await fetch(`/api/tasks/${activeId}/move`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ columnId: destColumnId, order: finalIndex })
        })
        if (!res.ok) throw new Error("Falha ao mover tarefa")
      } catch (err) {
        console.error(err)
        revertMove(snapshot)
      }
    }
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }),
  }

  if (columns.length === 0 && project.columns.length > 0) {
    return null // Evitar render com colunas vazias
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full items-start gap-4 p-6">
        <SortableContext items={columns.map(c => c.id)}>
          {columns.map((column) => (
            <ColumnComponent key={column.id} column={column} projectId={project.id} />
          ))}
        </SortableContext>

        {canManageColumns && (
          <AddColumnButton projectId={project.id} />
        )}
        
        <div className="w-4 shrink-0" />
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
           // Wrapper para não quebrar estilos ao arrastar
           <div className="w-[320px] opacity-90 rotate-2 scale-105 transition-transform cursor-grabbing">
              <TaskCard task={activeTask} />
           </div>
        ) : null}
      </DragOverlay>

      <TaskDetailSheet />
    </DndContext>
  )
}

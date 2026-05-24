"use client"

import { MoreHorizontal, Plus } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { TaskCard } from "./task-card"
import { AddTaskButton } from "./add-task-button"
import type { ColumnWithTasks } from "./board-client"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useBoardStore } from "@/stores/board.store"

interface ColumnProps {
  column: ColumnWithTasks
  projectId: string
}

export function ColumnComponent({ column, projectId }: ColumnProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const { searchQuery, priorityFilter } = useBoardStore()

  const filteredTasks = column.tasks.filter((task) => {
    const matchSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchPriority = priorityFilter ? task.priority === priorityFilter : true
    return matchSearch && matchPriority
  })

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    }
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="flex h-full w-80 shrink-0 flex-col rounded-xl border-2 border-indigo-500 bg-neutral-800/20 opacity-40" 
      />
    )
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-neutral-800/50 border border-neutral-800"
    >
      {/* Header da Coluna */}
      <div 
        className="flex items-center justify-between p-3 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-200">{column.name}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-700 text-xs font-medium text-neutral-300">
            {filteredTasks.length}
          </span>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            // Evitar que o clique no menu inicie um drag
            onPointerDown={(e) => e.stopPropagation()} 
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border border-neutral-700 bg-neutral-900 py-1 shadow-lg">
              <button className="w-full px-3 py-1.5 text-left text-sm text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800">
                Renomear coluna
              </button>
              <button className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-red-500/10 focus:bg-red-500/10">
                Excluir coluna
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 pt-0 flex flex-col gap-2 min-h-[100px]">
        <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {/* Footer / Adicionar Tarefa rápida */}
      <div className="p-3 border-t border-neutral-800/50">
        <AddTaskButton columnId={column.id} projectId={projectId} />
      </div>
    </div>
  )
}

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
  
  const [isEditing, setIsEditing] = useState(false)
  const [columnName, setColumnName] = useState(column.name)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { searchQuery, priorityFilter, renameColumnLocal, deleteColumnLocal } = useBoardStore()

  // Focar o input ao entrar em modo de edição
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Sincronizar o estado local com o prop da coluna (para atualizações otimistas e reversões)
  useEffect(() => {
    setColumnName(column.name)
  }, [column.name])

  const handleRenameSubmit = async () => {
    if (!columnName.trim() || columnName === column.name) {
      setIsEditing(false)
      setColumnName(column.name)
      return
    }

    const newName = columnName.trim()
    setIsEditing(false)
    renameColumnLocal(column.id, newName) // Optimistic

    try {
      const res = await fetch(`/api/columns/${column.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
      })
      if (!res.ok) throw new Error("Failed to rename column")
    } catch (err) {
      console.error(err)
      renameColumnLocal(column.id, column.name) // Revert
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir a coluna "${column.name}" e todas as suas tarefas?`)) return

    deleteColumnLocal(column.id) // Optimistic

    try {
      const res = await fetch(`/api/columns/${column.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete column")
    } catch (err) {
      console.error(err)
      // Idealmente, recarregaríamos as colunas do servidor para reverter a deleção caso dê erro
    }
  }

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
        className="flex items-center justify-between p-3 cursor-grab active:cursor-grabbing group"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2 flex-1 mr-2" onPointerDown={(e) => isEditing && e.stopPropagation()}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                e.stopPropagation() // Evita que o dnd-kit capture o Enter e inicie o drag pelo teclado
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleRenameSubmit()
                }
                if (e.key === "Escape") {
                  setIsEditing(false)
                  setColumnName(column.name)
                }
              }}
              className="font-semibold text-neutral-200 bg-neutral-900 border border-indigo-500 rounded px-2 py-0.5 w-full text-sm outline-none"
            />
          ) : (
            <>
              <h3 
                className="font-semibold text-neutral-200 cursor-text"
                onPointerDown={(e) => e.stopPropagation()} 
                onClick={() => setIsEditing(true)}
              >
                {column.name}
              </h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-700 text-xs font-medium text-neutral-300">
                {filteredTasks.length}
              </span>
            </>
          )}
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            // Evitar que o clique no menu inicie um drag
            onPointerDown={(e) => e.stopPropagation()} 
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
            data-state={isMenuOpen ? "open" : "closed"}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border border-neutral-700 bg-neutral-900 py-1 shadow-lg" onPointerDown={(e) => e.stopPropagation()}>
              <button 
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsEditing(true)
                }}
                className="w-full px-3 py-1.5 text-left text-sm text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800"
              >
                Renomear coluna
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false)
                  handleDelete()
                }}
                className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
              >
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

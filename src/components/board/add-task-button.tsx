"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { useBoardStore } from "@/stores/board.store"

interface AddTaskButtonProps {
  columnId: string
  projectId: string
}

export function AddTaskButton({ columnId, projectId }: AddTaskButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const addTaskLocal = useBoardStore(s => s.addTask)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId, 
          columnId, 
          title: title.trim(),
          priority: "LOW" // Prioridade padrão inicial
        })
      })

      if (!res.ok) throw new Error("Erro ao criar tarefa")
      
      const newTask = await res.json()
      
      addTaskLocal({
        ...newTask,
        tags: [],
        assignee: null
      })
      
      setTitle("")
      // Mantém aberto se quiser adicionar várias, ou fecha. Vamos fechar por padrão.
      setIsEditing(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setTitle("")
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="O que precisa ser feito?"
          className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900 p-2 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={2}
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Adicionar Card
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </form>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200 transition-colors"
    >
      <Plus className="h-4 w-4" />
      Adicionar Card
    </button>
  )
}

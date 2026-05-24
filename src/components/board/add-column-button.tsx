"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { useBoardStore } from "@/stores/board.store"

export function AddColumnButton({ projectId }: { projectId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const addColumnLocal = useBoardStore(s => s.addColumn)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/columns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() })
      })

      if (!res.ok) throw new Error("Erro ao criar coluna")
      
      const newColumn = await res.json()
      
      // Atualiza UI instantaneamente com os dados reais
      addColumnLocal({
        ...newColumn,
        tasks: []
      })
      
      setName("")
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      // Opcional: mostrar toast de erro
    } finally {
      setIsLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex h-max w-80 shrink-0 flex-col rounded-xl bg-neutral-800 border border-neutral-700 p-3 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da coluna"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Adicionar Coluna
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
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex h-max w-80 shrink-0 items-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-800/30 p-4 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300 transition-colors"
    >
      <Plus className="h-5 w-5" />
      <span className="font-medium">Adicionar Coluna</span>
    </button>
  )
}

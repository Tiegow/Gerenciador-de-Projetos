"use client"

import { Plus } from "lucide-react"
import { useUIStore } from "@/stores/ui.store"

export function NewProjectButton() {
  const { openProjectModal } = useUIStore()

  return (
    <button
      onClick={() => openProjectModal()}
      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
    >
      <Plus className="h-4 w-4" />
      Novo Projeto
    </button>
  )
}

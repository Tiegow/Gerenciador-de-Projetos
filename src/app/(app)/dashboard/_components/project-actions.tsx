"use client"

import { useState } from "react"
import { MoreVertical, Edit2, Trash2 } from "lucide-react"
import type { Project } from "@prisma/client"
import { useUIStore } from "@/stores/ui.store"

export function ProjectActions({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false)
  const { openProjectModal, openDeleteProjectModal } = useUIStore()

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    openProjectModal(project)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    openDeleteProjectModal(project)
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="rounded-md p-1 text-neutral-500 opacity-0 transition-opacity hover:bg-neutral-800 hover:text-white group-hover:opacity-100"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(false)
            }}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-neutral-800 bg-neutral-900 py-1 shadow-lg">
            <button
              onClick={handleEdit}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-neutral-800 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  )
}

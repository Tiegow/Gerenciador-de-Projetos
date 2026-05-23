"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { useUIStore } from "@/stores/ui.store"
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations/project"

const PRESET_COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#3b82f6", // Blue
]

export function ProjectModal() {
  const { isProjectModalOpen, closeProjectModal, projectToEdit } = useUIStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  
  const isEditing = !!projectToEdit

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#6366f1",
    },
  })

  const selectedColor = watch("color")

  useEffect(() => {
    if (isProjectModalOpen) {
      if (isEditing && projectToEdit) {
        reset({
          name: projectToEdit.name,
          description: projectToEdit.description || "",
          color: projectToEdit.color,
        })
      } else {
        reset({
          name: "",
          description: "",
          color: "#6366f1",
        })
      }
    }
  }, [isProjectModalOpen, isEditing, projectToEdit, reset])

  const mutation = useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const url = isEditing ? `/api/projects/${projectToEdit.id}` : "/api/projects"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Ocorreu um erro")
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      router.refresh()
      toast.success(isEditing ? "Projeto atualizado!" : "Projeto criado com sucesso!")
      closeProjectModal()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  if (!isProjectModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Projeto" : "Novo Projeto"}
          </h2>
          <button
            onClick={closeProjectModal}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-neutral-300">
              Nome do Projeto <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              {...register("name")}
              placeholder="Ex: Novo Website"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-neutral-300">
              Descrição
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Opcional: Descreva o objetivo do projeto"
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Cor do Projeto</label>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    selectedColor === color ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-neutral-900" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.color && (
              <p className="text-xs text-red-500">{errors.color.message}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={closeProjectModal}
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

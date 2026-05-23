"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUIStore } from "@/stores/ui.store"

export function DeleteProjectModal() {
  const { isDeleteProjectModalOpen, closeDeleteProjectModal, projectToDelete } = useUIStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!projectToDelete) return

      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Ocorreu um erro ao excluir o projeto")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      router.refresh()
      toast.success("Projeto excluído com sucesso!")
      closeDeleteProjectModal()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  if (!isDeleteProjectModalOpen || !projectToDelete) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">Excluir Projeto</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Tem certeza que deseja excluir o projeto <span className="font-semibold text-white">{projectToDelete.name}</span>? Esta ação não pode ser desfeita e todas as tarefas associadas serão perdidas.
          </p>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-neutral-800 pt-5">
          <button
            onClick={closeDeleteProjectModal}
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            disabled={mutation.isPending}
          >
            Cancelar
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

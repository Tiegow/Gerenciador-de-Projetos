"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { signOut } from "next-auth/react"

export function DeleteAccountZone() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao excluir a conta")
      }
      toast.success("Conta excluída com sucesso")
      await signOut({ callbackUrl: "/login" })
    } catch (error: any) {
      toast.error(error.message)
      setIsDeleting(false)
    }
  }

  return (
    <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-red-500">Zona de Perigo</h2>
          <p className="mt-1 text-sm text-neutral-400">
            A exclusão da conta é permanente e não pode ser desfeita. Todos os seus dados serão apagados.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-red-600/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-600 hover:text-white"
        >
          <Trash2 className="h-4 w-4" />
          Excluir Conta
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">Excluir Conta Definitivamente</h2>
              <p className="mt-2 text-sm text-neutral-400">
                Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão apagados.
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-neutral-800 pt-5">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

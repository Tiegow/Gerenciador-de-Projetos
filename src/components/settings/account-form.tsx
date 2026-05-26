"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, KeyRound } from "lucide-react"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirme a nova senha"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

interface AccountFormProps {
  hasPassword: boolean
}

export function AccountForm({ hasPassword }: AccountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erro ao alterar a senha")
      }
      toast.success("Senha alterada com sucesso!")
      reset()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">Segurança</h2>
      <p className="mt-1 text-sm text-neutral-400">Atualize sua senha para manter sua conta segura.</p>

      {!hasPassword ? (
        <div className="mt-6 flex max-w-xl items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/80 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800">
            <KeyRound className="h-5 w-5 text-neutral-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Login Social</p>
            <p className="mt-0.5 text-xs text-neutral-400">Sua conta foi criada através de um provedor de login (ex: Google, GitHub). A senha é gerenciada por eles.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300">Senha Atual</label>
            <input
              type="password"
              {...register("currentPassword")}
              className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Nova Senha</label>
            <input
              type="password"
              {...register("newPassword")}
              className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Confirmar Nova Senha</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar Senha"}
          </button>
        </form>
      )}
    </div>
  )
}

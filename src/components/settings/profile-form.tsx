"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(50, "O nome não pode ter mais de 50 caracteres"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { update } = useSession()

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erro ao atualizar perfil")
      }
      
      await update({ name: data.name })
      
      toast.success("Perfil atualizado com sucesso!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : user.email?.slice(0, 2).toUpperCase() || "US"

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">Perfil</h2>
      <p className="mt-1 text-sm text-neutral-400">Gerencie suas informações públicas.</p>

      <div className="mt-6 flex items-center gap-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-2xl font-bold text-white shadow-xl ring-4 ring-neutral-900">
          {user.image ? (
            <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">Foto de Perfil</p>
          <p className="mt-1 text-xs text-neutral-400">Sua foto é vinculada ao seu provedor de login ou gerada automaticamente.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300">E-mail</label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="mt-1.5 block w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-neutral-400 focus:outline-none focus:ring-0 sm:text-sm"
          />
          <p className="mt-1 text-xs text-neutral-500">O endereço de e-mail não pode ser alterado.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300">Nome Completo</label>
          <input
            type="text"
            {...register("name")}
            className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
        </button>
      </form>
    </div>
  )
}

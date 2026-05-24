"use client"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function InvitePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Se não estiver logado, redireciona para login, mas poderia salvar a intenção.
  // Por simplicidade, mandamos pro login direto.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/invite/${projectId}`)
    }
  }, [status, router, projectId])

  const handleJoin = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/projects/${projectId}/join`, {
        method: "POST"
      })
      if (!res.ok) {
        throw new Error("Não foi possível entrar no projeto. Verifique o link.")
      }
      // Sucesso! Redireciona para o board
      router.push(`/projects/${projectId}/board`)
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
          <span className="text-2xl text-indigo-400">👋</span>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-white">Convite para Projeto</h1>
        <p className="mb-8 text-neutral-400">
          Você foi convidado para colaborar em um projeto. Junte-se à equipe para visualizar as tarefas e ajudar no desenvolvimento!
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleJoin}
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Aceitar Convite e Entrar"}
          </button>
          
          <button
            onClick={() => router.push("/dashboard")}
            disabled={isLoading}
            className="w-full rounded-lg px-4 py-3 font-semibold text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

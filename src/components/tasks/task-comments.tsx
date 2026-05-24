"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useBoardStore } from "@/stores/board.store"
import { MessageSquare, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TaskComments({ taskId }: { taskId: string }) {
  const { columns, setColumns } = useBoardStore()
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeTask = columns.flatMap(c => c.tasks).find(t => t.id === taskId)
  if (!activeTask) return null

  const comments = activeTask.comments || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    const tempId = `temp-${Date.now()}`
    
    // Update Otimista
    const tempComment = {
      id: tempId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      authorId: session?.user?.id || "",
      author: {
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image
      }
    }

    const updatedComments = [...comments, tempComment]
    const newColumns = columns.map(col => ({
      ...col,
      tasks: col.tasks.map(t => t.id === taskId ? { ...t, comments: updatedComments } : t)
    }))
    setColumns(newColumns)
    setContent("")

    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tempComment.content })
      })

      if (res.ok) {
        const realComment = await res.json()
        // Buscar o estado mais recente do Zustand, pois a closure tem o antigo
        const currentColumns = useBoardStore.getState().columns

        // Trocar id temporário pelo real
        const finalColumns = currentColumns.map(col => ({
          ...col,
          tasks: col.tasks.map(t => t.id === taskId ? { 
            ...t, 
            comments: t.comments?.map((c: any) => c.id === tempId ? realComment : c) || []
          } : t)
        }))
        setColumns(finalColumns)
      }
    } catch (err) {
      console.error(err)
      // Reverteria aqui num cenário robusto
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-neutral-200 font-semibold mb-4">
        <MessageSquare className="h-5 w-5" />
        <h3>Comentários</h3>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">Nenhum comentário ainda.</p>
        ) : (
          comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 flex-none rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700">
                {comment.author?.image ? (
                  <img src={comment.author.image} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white">
                    {(comment.author?.name || comment.author?.email || "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-200">
                    {comment.author?.name || comment.author?.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-neutral-300 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Escreva um comentário..."
          className="w-full bg-neutral-900 border border-neutral-700 focus:border-indigo-500 rounded-lg p-3 pr-12 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none resize-none transition-colors"
          rows={3}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

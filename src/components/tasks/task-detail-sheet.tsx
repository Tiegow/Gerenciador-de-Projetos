"use client"

import { useEffect, useState } from "react"
import { useBoardStore } from "@/stores/board.store"
import { X, AlignLeft, Flag, User, Calendar, Tag as TagIcon, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TaskTags } from "./task-tags"
import { TaskComments } from "./task-comments"

export function TaskDetailSheet() {
  const { activeTaskId, setActiveTaskId, columns, setColumns, members } = useBoardStore()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("LOW")
  const [isSaving, setIsSaving] = useState(false)
  const [isAssigneeMenuOpen, setIsAssigneeMenuOpen] = useState(false)

  // Achar a task na store
  const activeTask = columns
    .flatMap(c => c.tasks)
    .find(t => t.id === activeTaskId)

  // Sincronizar estado local quando a task abrir
  useEffect(() => {
    if (activeTask) {
      setTitle(activeTask.title)
      setDescription(activeTask.description || "")
      setPriority(activeTask.priority)
    }
  }, [activeTask])

  if (!activeTaskId || !activeTask) return null

  const handleClose = () => {
    setActiveTaskId(null)
  }

  // Função genérica de debounce para salvar no banco
  const saveToDb = async (data: any) => {
    setIsSaving(true)
    try {
      await fetch(`/api/tasks/${activeTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    } catch (err) {
      console.error("Falha ao salvar", err)
    } finally {
      setIsSaving(false)
    }
  }

  // Atualiza store local e dispara save
  const updateTaskLocal = (changes: any) => {
    const newColumns = columns.map(col => ({
      ...col,
      tasks: col.tasks.map(t => t.id === activeTaskId ? { ...t, ...changes } : t)
    }))
    setColumns(newColumns)
    saveToDb(changes)
  }

  const handleTitleBlur = () => {
    if (title !== activeTask.title && title.trim()) {
      updateTaskLocal({ title })
    } else {
      setTitle(activeTask.title) // Reverter se vazio
    }
  }

  const handleDescriptionBlur = () => {
    if (description !== activeTask.description) {
      updateTaskLocal({ description })
    }
  }

  const handlePriorityChange = (newPriority: any) => {
    setPriority(newPriority)
    updateTaskLocal({ priority: newPriority })
  }

  const priorityColors = {
    LOW: "text-blue-400 bg-blue-500/10",
    MEDIUM: "text-emerald-400 bg-emerald-500/10",
    HIGH: "text-orange-400 bg-orange-500/10",
    URGENT: "text-red-400 bg-red-500/10",
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Painel lateral */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded">
              TASK-{activeTask.id.substring(activeTask.id.length - 4).toUpperCase()}
            </span>
            {isSaving && <span className="text-xs text-neutral-500 italic flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Salvando...
            </span>}
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo scrollável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Titulo */}
          <div>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full resize-none bg-transparent text-2xl font-bold text-white border border-transparent hover:border-neutral-700 focus:border-indigo-500 rounded-md p-2 -ml-2 focus:bg-neutral-950 focus:outline-none transition-colors"
              rows={1}
              style={{ height: "auto" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = target.scrollHeight + 'px'
              }}
            />
          </div>

          {/* Grid de Metadados Principais */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Status (simulado via coluna) */}
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-neutral-500 mt-0.5" />
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status (Coluna)</label>
                <div className="mt-1 text-sm text-neutral-200">
                  {columns.find(c => c.id === activeTask.columnId)?.name}
                </div>
              </div>
            </div>

            {/* Prioridade */}
            <div className="flex items-start gap-3">
              <Flag className="h-5 w-5 text-neutral-500 mt-0.5" />
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Prioridade</label>
                <div className="mt-1 flex gap-2">
                  {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className={`h-6 w-6 rounded flex items-center justify-center text-xs font-bold border transition-colors ${
                        priority === p ? `${priorityColors[p]} border-transparent` : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                      }`}
                      title={p}
                    >
                      {p.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Responsável */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-neutral-500 mt-0.5" />
              <div className="relative">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Responsável</label>
                <div className="mt-1 flex items-center gap-2 relative">
                  {activeTask.assignee ? (
                    <button 
                      onClick={() => setIsAssigneeMenuOpen(!isAssigneeMenuOpen)}
                      className="flex items-center gap-2 bg-neutral-800 px-2 py-1 rounded-full border border-neutral-700 cursor-pointer hover:border-neutral-600 transition-colors"
                    >
                      {activeTask.assignee.image ? (
                        <img src={activeTask.assignee.image} alt="Avatar" className="h-5 w-5 rounded-full" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">
                          {(activeTask.assignee.name || activeTask.assignee.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-neutral-200">{activeTask.assignee.name || activeTask.assignee.email}</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsAssigneeMenuOpen(!isAssigneeMenuOpen)}
                      className="text-sm cursor-pointer text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Atribuir a alguém
                    </button>
                  )}

                  {/* Dropdown de membros */}
                  {isAssigneeMenuOpen && (
                    <div className="absolute top-full mt-1 left-0 z-50 w-56 rounded-md border border-neutral-700 bg-neutral-800 py-1 shadow-lg">
                      <div className="px-3 py-1.5 text-xs font-semibold text-neutral-500 uppercase">Membros do Projeto</div>
                      {members.map((m) => (
                        <button
                          key={m.userId}
                          onClick={() => {
                            updateTaskLocal({ assigneeId: m.userId, assignee: m.user })
                            setIsAssigneeMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors"
                        >
                          {m.user.image ? (
                            <img src={m.user.image} alt="Avatar" className="h-5 w-5 rounded-full" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">
                              {(m.user.name || m.user.email).charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="truncate">{m.user.name || m.user.email}</span>
                        </button>
                      ))}
                      {activeTask.assignee && (
                        <button
                          onClick={() => {
                            updateTaskLocal({ assigneeId: null, assignee: null })
                            setIsAssigneeMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 border-t border-neutral-700 mt-1"
                        >
                          <X className="h-4 w-4" /> Remover atribuição
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Data de Vencimento */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-neutral-500 mt-0.5" />
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Vencimento</label>
                <div className="mt-1 flex items-center gap-2">
                  <div 
                    className="relative flex items-center group cursor-pointer"
                    onClick={() => {
                      const input = document.getElementById(`date-picker-${activeTask.id}`) as HTMLInputElement
                      if (input && input.showPicker) {
                        input.showPicker()
                      }
                    }}
                  >
                    {/* Renderização visual da data */}
                    {activeTask.dueDate ? (
                      <div className={`text-sm px-2 py-1 rounded border transition-colors ${
                        new Date(activeTask.dueDate) < new Date() 
                        ? "bg-red-500/10 text-red-400 border-red-500/20 group-hover:border-red-500/40 group-hover:bg-red-500/20" 
                        : "bg-neutral-800 text-neutral-200 border-neutral-700 group-hover:border-neutral-500 group-hover:bg-neutral-700"
                      }`}>
                        {format(new Date(activeTask.dueDate), "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </div>
                    ) : (
                      <div className="text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors py-1">
                        Adicionar data
                      </div>
                    )}

                    {/* Input Date Nativo e Oculto sobrepondo visual para UX ágil */}
                    <input 
                      id={`date-picker-${activeTask.id}`}
                      type="date" 
                      className="sr-only" // Fica fora da tela, mas funcional
                      style={{ colorScheme: 'dark' }} 
                      value={activeTask.dueDate ? new Date(activeTask.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value).toISOString() : null
                        updateTaskLocal({ dueDate: newDate })
                      }}
                    />
                  </div>

                  {activeTask.dueDate && (
                    <button
                      onClick={() => updateTaskLocal({ dueDate: null })}
                      className="p-1 rounded text-neutral-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Remover data"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <TaskTags taskId={activeTask.id} />
          </div>

          <hr className="border-neutral-800" />

          {/* Descrição */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-200 font-semibold">
              <AlignLeft className="h-5 w-5" />
              <h3>Descrição</h3>
            </div>
            <div className="pl-7">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                placeholder="Adicione uma descrição mais detalhada..."
                className="w-full min-h-[150px] resize-y bg-neutral-800/50 text-sm text-neutral-300 border border-neutral-700 focus:border-indigo-500 rounded-md p-3 focus:bg-neutral-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <hr className="border-neutral-800" />

          {/* Comentários */}
          <TaskComments taskId={activeTask.id} />
          
        </div>
      </div>
    </>
  )
}

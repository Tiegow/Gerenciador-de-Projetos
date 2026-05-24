"use client"

import { useState } from "react"
import { useBoardStore } from "@/stores/board.store"
import { TagIcon, Plus, X } from "lucide-react"

export function TaskTags({ taskId }: { taskId: string }) {
  const { columns, setColumns, projectTags, projectId, addProjectTag } = useBoardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Achar a task na store
  const activeTask = columns.flatMap(c => c.tasks).find(t => t.id === taskId)
  if (!activeTask) return null

  const taskTags = activeTask.tags?.map((tt: any) => tt.tag) || []

  // Cores predefinidas para novas tags
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]

  const handleToggleTag = async (tag: any) => {
    const hasTag = taskTags.some((t: any) => t.id === tag.id)
    
    // Update Otimista
    const updatedTaskTags = hasTag 
      ? activeTask.tags.filter((tt: any) => tt.tag.id !== tag.id)
      : [...(activeTask.tags || []), { taskId, tagId: tag.id, tag }]
      
    const newColumns = columns.map(col => ({
      ...col,
      tasks: col.tasks.map(t => t.id === taskId ? { ...t, tags: updatedTaskTags } : t)
    }))
    setColumns(newColumns)

    try {
      await fetch(`/api/tasks/${taskId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagId: tag.id })
      })
    } catch (err) {
      console.error("Failed to toggle tag", err)
      // O ideal seria reverter em caso de erro, mas para simplificar:
    }
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim() || isCreating) return
    setIsCreating(true)

    // Deterministic color based on the name length to satisfy React 19 purity rules
    const randomColor = colors[newTagName.trim().length % colors.length]

    try {
      const res = await fetch(`/api/projects/${projectId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim(), color: randomColor })
      })

      if (res.ok) {
        const createdTag = await res.json()
        addProjectTag(createdTag) // Adiciona nas tags do projeto
        handleToggleTag(createdTag) // Já vincula na task atual
        setNewTagName("")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex items-start gap-3">
      <TagIcon className="h-5 w-5 text-neutral-500 mt-0.5" />
      <div className="relative">
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Etiquetas</label>
        
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {taskTags.map((tag: any) => (
            <span 
              key={tag.id}
              className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-6 w-6 rounded-full border border-dashed border-neutral-600 text-neutral-400 hover:text-white hover:border-neutral-400 transition-colors"
            title="Adicionar tag"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Popover de Tags */}
        {isOpen && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-neutral-800 border border-neutral-700 rounded-md shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-700 bg-neutral-900/50">
              <span className="text-xs font-semibold text-neutral-300">Etiquetas do Projeto</span>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-neutral-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto p-2 space-y-1">
              {projectTags.length === 0 ? (
                <div className="text-xs text-neutral-500 text-center py-2">Nenhuma etiqueta criada</div>
              ) : (
                projectTags.map((tag: any) => {
                  const isSelected = taskTags.some((t: any) => t.id === tag.id)
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleToggleTag(tag)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                        <span className="text-sm text-neutral-200">{tag.name}</span>
                      </div>
                      {isSelected && <span className="text-xs text-indigo-400">Ativa</span>}
                    </button>
                  )
                })
              )}
            </div>

            <form onSubmit={handleCreateTag} className="p-2 border-t border-neutral-700 bg-neutral-900/50">
              <input
                type="text"
                placeholder="Criar nova etiqueta..."
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                disabled={isCreating}
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

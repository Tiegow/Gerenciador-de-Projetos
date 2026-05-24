"use client"

import { Clock, MessageSquare, Paperclip } from "lucide-react"
import type { TaskWithDetails } from "./board-client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useBoardStore } from "@/stores/board.store"

interface TaskCardProps {
  task: TaskWithDetails
}

export function TaskCard({ task }: TaskCardProps) {
  const setActiveTaskId = useBoardStore((s) => s.setActiveTaskId)

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: String(task.id),
    data: {
      type: "Task",
      task,
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  // Badges de prioridade
  const priorityColors = {
    LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    MEDIUM: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    URGENT: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  const priorityLabels = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    URGENT: "Urgente",
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="flex min-h-[100px] flex-col rounded-lg border-2 border-indigo-500 bg-neutral-800/50 opacity-50"
      />
    )
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setActiveTaskId(task.id)}
      className="group relative flex cursor-grab flex-col gap-3 rounded-lg border border-neutral-700 bg-neutral-800 p-3 shadow-sm hover:border-neutral-600 active:cursor-grabbing transition-colors"
    >
      
      {/* Título e Tags */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {task.tags.map((t) => (
            <span
              key={t.tagId}
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded-sm uppercase tracking-wider"
              style={{ backgroundColor: `${t.tag.color}20`, color: t.tag.color }}
            >
              {t.tag.name}
            </span>
          ))}
        </div>
        <h4 className="text-sm font-medium text-neutral-200 leading-snug">
          {task.title}
        </h4>
      </div>

      {/* Metadados e Ícones */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-3 text-neutral-500">
          {/* Prioridade */}
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>

          {/* Comentários/Anexos */}
          <div className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3 w-3" />
            <span>{task.comments?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Paperclip className="h-3 w-3" />
            <span>0</span>
          </div>
        </div>

        {/* Data e Avatar */}
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-neutral-500'}`}>
              <Clock className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), "d MMM", { locale: ptBR })}</span>
            </div>
          )}

          {task.assignee ? (
            <div 
              className="h-6 w-6 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden border border-neutral-600"
              title={task.assignee.name || task.assignee.email}
            >
              {task.assignee.image ? (
                <img src={task.assignee.image} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-white">
                  {(task.assignee.name || task.assignee.email).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full border border-dashed border-neutral-600 flex items-center justify-center" title="Sem responsável">
              <span className="text-[10px] text-neutral-500">?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

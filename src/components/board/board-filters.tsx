"use client"

import { Search, Filter, X } from "lucide-react"
import { useBoardStore } from "@/stores/board.store"

export function BoardFilters() {
  const { searchQuery, setSearchQuery, priorityFilter, setPriorityFilter } = useBoardStore()

  const priorities = [
    { value: "URGENT", label: "Urgente", color: "text-red-400 bg-red-500/10 border-red-500/20" },
    { value: "HIGH", label: "Alta", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    { value: "MEDIUM", label: "Média", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { value: "LOW", label: "Baixa", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-4 px-6 py-2 border-b border-neutral-800 bg-neutral-900/30">
      
      {/* Busca por Texto */}
      <div className="relative max-w-sm w-full md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          type="text"
          placeholder="Buscar tarefas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-1.5 border border-neutral-700 rounded-md leading-5 bg-neutral-800 text-neutral-300 placeholder-neutral-500 focus:outline-none focus:bg-neutral-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-neutral-700 hidden md:block" />

      {/* Filtros de Prioridade */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-neutral-500 mr-1" />
        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider mr-2">Prioridade</span>
        
        <div className="flex items-center gap-1.5">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriorityFilter(priorityFilter === p.value ? null : p.value)}
              className={`px-2.5 py-1 rounded border text-xs font-semibold transition-all ${
                priorityFilter === p.value
                  ? p.color // Filtro ativo (usa as cores dele com border destacada)
                  : "border-transparent bg-neutral-800/50 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

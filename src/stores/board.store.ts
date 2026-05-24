import { create } from "zustand"
import type { ColumnWithTasks, TaskWithDetails } from "@/components/board/board-client"

interface BoardStore {
  columns: ColumnWithTasks[]
  activeTaskId: string | null
  searchQuery: string
  priorityFilter: string | null
  
  setColumns: (columns: ColumnWithTasks[]) => void
  setActiveTaskId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setPriorityFilter: (priority: string | null) => void
  
  addColumn: (column: ColumnWithTasks) => void
  addTask: (task: TaskWithDetails) => void
  moveTaskLocal: (taskId: string, sourceColumnId: string, destColumnId: string, newIndex: number) => void
  revertMove: (snapshot: ColumnWithTasks[]) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  columns: [],
  activeTaskId: null,
  searchQuery: "",
  priorityFilter: null,
  
  setColumns: (columns) => set({ columns }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  
  addColumn: (column) => set((state) => ({ columns: [...state.columns, column] })),
  
  addTask: (task) => set((state) => {
    const newColumns = [...state.columns]
    const colIndex = newColumns.findIndex(c => c.id === task.columnId)
    if (colIndex === -1) return state
    
    const col = { ...newColumns[colIndex], tasks: [...newColumns[colIndex].tasks, task] }
    newColumns[colIndex] = col
    
    return { columns: newColumns }
  }),
  
  moveTaskLocal: (taskId, sourceColumnId, destColumnId, newIndex) => set((state) => {
    const newColumns = [...state.columns]
    
    const sourceColIndex = newColumns.findIndex(col => col.id === sourceColumnId)
    const destColIndex = newColumns.findIndex(col => col.id === destColumnId)
    
    if (sourceColIndex === -1 || destColIndex === -1) return state
    
    const sourceCol = { ...newColumns[sourceColIndex], tasks: [...newColumns[sourceColIndex].tasks] }
    const destCol = sourceColumnId === destColumnId 
      ? sourceCol 
      : { ...newColumns[destColIndex], tasks: [...newColumns[destColIndex].tasks] }
      
    // Encontrar a tarefa original
    const taskIndex = sourceCol.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return state
    
    const [task] = sourceCol.tasks.splice(taskIndex, 1)
    
    // Inserir na nova posição
    destCol.tasks.splice(newIndex, 0, { ...task, columnId: destColumnId })
    
    // Recalcular a ordem sequencial nas colunas afetadas (somente na UI, a persistência final fica para o backend)
    sourceCol.tasks = sourceCol.tasks.map((t, i) => ({ ...t, order: i }))
    if (sourceColumnId !== destColumnId) {
      destCol.tasks = destCol.tasks.map((t, i) => ({ ...t, order: i }))
    }
    
    newColumns[sourceColIndex] = sourceCol
    if (sourceColumnId !== destColumnId) {
      newColumns[destColIndex] = destCol
    }
    
    return { columns: newColumns }
  }),
  
  revertMove: (snapshot) => set({ columns: snapshot }),
}))

import { create } from "zustand"
import type { ColumnWithTasks, TaskWithDetails } from "@/components/board/board-client"

interface BoardStore {
  projectId: string | null
  members: any[] // Simplificando por hora
  projectTags: any[] // Tags disponíveis no projeto
  columns: ColumnWithTasks[]
  activeTaskId: string | null
  searchQuery: string
  priorityFilter: string | null
  
  setProjectInfo: (projectId: string, members: any[], projectTags?: any[]) => void
  setColumns: (columns: ColumnWithTasks[]) => void
  setActiveTaskId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setPriorityFilter: (priority: string | null) => void
  
  addColumn: (column: ColumnWithTasks) => void
  renameColumnLocal: (columnId: string, name: string) => void
  deleteColumnLocal: (columnId: string) => void
  moveColumnLocal: (columnId: string, newIndex: number) => void
  addTask: (task: TaskWithDetails) => void
  moveTaskLocal: (taskId: string, sourceColumnId: string, destColumnId: string, newIndex: number) => void
  revertMove: (snapshot: ColumnWithTasks[]) => void
  addProjectTag: (tag: any) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  projectId: null,
  members: [],
  projectTags: [],
  columns: [],
  activeTaskId: null,
  searchQuery: "",
  priorityFilter: null,
  
  setProjectInfo: (projectId, members, projectTags = []) => set({ projectId, members, projectTags }),
  setColumns: (columns) => set({ columns }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  
  addColumn: (column) => set((state) => ({ columns: [...state.columns, column] })),
  
  renameColumnLocal: (columnId, name) => set((state) => ({
    columns: state.columns.map(col => col.id === columnId ? { ...col, name } : col)
  })),

  deleteColumnLocal: (columnId) => set((state) => ({
    columns: state.columns.filter(col => col.id !== columnId)
  })),

  moveColumnLocal: (columnId, newIndex) => set((state) => {
    const newColumns = [...state.columns]
    const oldIndex = newColumns.findIndex(c => c.id === columnId)
    if (oldIndex === -1) return state
    
    const [movedCol] = newColumns.splice(oldIndex, 1)
    newColumns.splice(newIndex, 0, movedCol)
    
    // Atualiza o order de cada coluna para ficar síncrono com a indexação
    const reorderedColumns = newColumns.map((col, idx) => ({ ...col, order: idx }))
    return { columns: reorderedColumns }
  }),

  addTask: (task) => set((state) => ({
    columns: state.columns.map(col => 
      col.id === task.columnId ? { ...col, tasks: [...col.tasks, task] } : col
    )
  })),

  addProjectTag: (tag) => set((state) => ({ projectTags: [...state.projectTags, tag] })),
  
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

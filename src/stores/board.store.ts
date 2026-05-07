import { create } from "zustand"
import type {
  Column,
  Task,
  Tag,
  TaskTag,
  User,
} from "@/generated/prisma"

// ──────────────────────────────────────────────
// Tipos compostos para o Board
// ──────────────────────────────────────────────

export type TaskWithRelations = Task & {
  tags: (TaskTag & { tag: Tag })[]
  assignee: Pick<User, "id" | "name" | "image"> | null
}

export type ColumnWithTasks = Column & {
  tasks: TaskWithRelations[]
}

// ──────────────────────────────────────────────
// Board Store — estado otimista do Kanban
// ──────────────────────────────────────────────

interface BoardStore {
  columns: ColumnWithTasks[]
  setColumns: (columns: ColumnWithTasks[]) => void

  // Optimistic move: move task no estado local antes da request
  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newOrder: number
  ) => ColumnWithTasks[] // retorna snapshot para rollback

  // Rollback em caso de erro na API
  revertMove: (snapshot: ColumnWithTasks[]) => void
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  columns: [],

  setColumns: (columns) => set({ columns }),

  moveTask: (taskId, fromColumnId, toColumnId, newOrder) => {
    const snapshot = structuredClone(get().columns)

    set((state) => {
      const columns = structuredClone(state.columns)

      // Encontrar e remover a task da coluna de origem
      const fromCol = columns.find((c) => c.id === fromColumnId)
      if (!fromCol) return state

      const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return state

      const [task] = fromCol.tasks.splice(taskIndex, 1)

      // Atualizar a task
      task.columnId = toColumnId
      task.order = newOrder

      // Inserir na coluna de destino
      const toCol = columns.find((c) => c.id === toColumnId)
      if (!toCol) return state

      toCol.tasks.splice(newOrder, 0, task)

      // Reordenar todas as tasks da coluna de destino
      toCol.tasks.forEach((t, i) => {
        t.order = i
      })

      // Se mudou de coluna, reordenar a coluna de origem também
      if (fromColumnId !== toColumnId) {
        fromCol.tasks.forEach((t, i) => {
          t.order = i
        })
      }

      return { columns }
    })

    return snapshot
  },

  revertMove: (snapshot) => set({ columns: snapshot }),
}))

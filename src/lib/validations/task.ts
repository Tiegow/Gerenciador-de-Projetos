import { z } from "zod"

// ──────────────────────────────────────────────
// Criar Tarefa
// ──────────────────────────────────────────────
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(200, "O título deve ter no máximo 200 caracteres"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  columnId: z.string().cuid("ID de coluna inválido"),
  projectId: z.string().cuid("ID de projeto inválido"),
  assigneeId: z.string().cuid("ID de responsável inválido").optional(),
  dueDate: z.coerce.date().optional(),
})

// ──────────────────────────────────────────────
// Atualizar Tarefa
// ──────────────────────────────────────────────
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(200, "O título deve ter no máximo 200 caracteres")
    .optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
})

// ──────────────────────────────────────────────
// Mover Tarefa (drag-and-drop)
// ──────────────────────────────────────────────
export const moveTaskSchema = z.object({
  columnId: z.string().cuid("ID de coluna inválido"),
  order: z.number().int().min(0),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type MoveTaskInput = z.infer<typeof moveTaskSchema>

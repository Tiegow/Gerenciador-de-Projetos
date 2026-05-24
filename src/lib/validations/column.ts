import { z } from "zod"

export const createColumnSchema = z.object({
  name: z.string().min(1, "O nome da coluna é obrigatório").max(50, "O nome deve ter no máximo 50 caracteres"),
})

export const updateColumnSchema = z.object({
  name: z.string().min(1, "O nome da coluna é obrigatório").max(50, "O nome deve ter no máximo 50 caracteres").optional(),
  color: z.string().optional(),
})

export const reorderColumnsSchema = z.object({
  columns: z.array(
    z.object({
      id: z.string().cuid("ID de coluna inválido"),
      order: z.number().int().min(0),
    })
  ).min(1, "O array de colunas não pode estar vazio"),
})

export type CreateColumnInput = z.infer<typeof createColumnSchema>
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>
export type ReorderColumnsInput = z.infer<typeof reorderColumnsSchema>

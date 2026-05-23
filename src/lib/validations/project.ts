import { z } from "zod"

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do projeto deve ter no mínimo 3 caracteres")
    .max(100, "O nome do projeto deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "A descrição não pode exceder 500 caracteres").optional().nullable(),
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Cor inválida (deve ser hexadecimal, ex: #6366f1)")
    .default("#6366f1"),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z.enum(["ACTIVE", "ARCHIVED", "COMPLETED"]).optional(),
})

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

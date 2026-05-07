import { z } from "zod"

// ──────────────────────────────────────────────
// Criar / Atualizar Projeto
// ──────────────────────────────────────────────
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do projeto é obrigatório")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida")
    .default("#6366f1"),
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z.enum(["ACTIVE", "ARCHIVED", "COMPLETED"]).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

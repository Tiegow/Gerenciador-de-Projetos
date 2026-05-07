import { z } from "zod"

// ──────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(1, "A senha é obrigatória"),
})

export type LoginInput = z.infer<typeof loginSchema>

// ──────────────────────────────────────────────
// Registro
// ──────────────────────────────────────────────
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "O nome deve ter pelo menos 2 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres"),
    email: z
      .string()
      .min(1, "O e-mail é obrigatório")
      .email("E-mail inválido"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(100, "A senha deve ter no máximo 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "A senha deve conter ao menos uma letra minúscula, uma maiúscula e um número"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

import type { MemberRole } from "@prisma/client"

/**
 * Sessão do usuário retornada pelo NextAuth
 */
export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

/**
 * Resposta padrão da API para erros
 */
export type ApiError = {
  error: string
  details?: Record<string, string[]>
}

/**
 * Resposta padrão da API para sucesso
 */
export type ApiSuccess<T = void> = T extends void
  ? { success: true }
  : { success: true; data: T }

/**
 * Membro do projeto com dados do usuário
 */
export type ProjectMemberWithUser = {
  id: string
  role: MemberRole
  joinedAt: Date
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

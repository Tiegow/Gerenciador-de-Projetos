import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { reorderColumnsSchema } from "@/lib/validations/column"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o usuário é OWNER ou ADMIN
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: id,
        },
      },
    })

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = reorderColumnsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { columns } = parsed.data

    // Atualizar cada coluna em uma transação
    await prisma.$transaction(
      columns.map((col) =>
        prisma.column.update({
          where: { id: col.id, projectId: id }, // Garante que a coluna pertence ao projeto
          data: { order: col.order },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[COLUMNS_REORDER_PATCH]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createColumnSchema } from "@/lib/validations/column"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o usuário é OWNER ou ADMIN do projeto
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
    const parsed = createColumnSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Buscar a maior ordem atual para colocar a nova coluna no final
    const maxOrderColumn = await prisma.column.findFirst({
      where: { projectId: id },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const newOrder = maxOrderColumn ? maxOrderColumn.order + 1 : 0

    const column = await prisma.column.create({
      data: {
        name: parsed.data.name,
        order: newOrder,
        projectId: id,
      },
    })

    return NextResponse.json(column, { status: 201 })
  } catch (error) {
    console.error("[COLUMNS_POST]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

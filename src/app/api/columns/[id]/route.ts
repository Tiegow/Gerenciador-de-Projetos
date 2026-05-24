import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateColumnSchema } from "@/lib/validations/column"

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

    const column = await prisma.column.findUnique({
      where: { id },
      select: { projectId: true },
    })

    if (!column) {
      return NextResponse.json({ error: "Coluna não encontrada" }, { status: 404 })
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: column.projectId,
        },
      },
    })

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateColumnSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updatedColumn = await prisma.column.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(updatedColumn)
  } catch (error) {
    console.error("[COLUMN_PATCH]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    const column = await prisma.column.findUnique({
      where: { id },
      select: { projectId: true },
    })

    if (!column) {
      return NextResponse.json({ error: "Coluna não encontrada" }, { status: 404 })
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: column.projectId,
        },
      },
    })

    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    // A exclusão de coluna pode deletar em cascata as tarefas se configurado no schema
    // Se precisarmos mover as tarefas, faríamos isso aqui antes de deletar
    await prisma.column.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[COLUMN_DELETE]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

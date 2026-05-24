import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createTaskSchema } from "@/lib/validations/task"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { projectId, columnId, title, description, priority, assigneeId, dueDate } = parsed.data

    // Verificar se o usuário é membro do projeto
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId,
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    // Verificar se a coluna pertence ao projeto
    const column = await prisma.column.findUnique({
      where: { id: columnId },
    })

    if (!column || column.projectId !== projectId) {
      return NextResponse.json({ error: "Coluna inválida" }, { status: 400 })
    }

    // Buscar a maior ordem atual na coluna de destino
    const maxOrderTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const newOrder = maxOrderTask ? maxOrderTask.order + 1 : 0

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        order: newOrder,
        projectId,
        columnId,
        creatorId: session.user.id,
        assigneeId,
        dueDate,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("[TASKS_POST]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

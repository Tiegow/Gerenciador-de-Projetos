import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateTaskSchema } from "@/lib/validations/task"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, image: true, email: true } },
        assignee: { select: { id: true, name: true, image: true, email: true } },
        tags: { include: { tag: true } },
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: task.projectId,
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASK_GET]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

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

    const task = await prisma.task.findUnique({
      where: { id },
      select: { projectId: true },
    })

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: task.projectId,
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: parsed.data,
      include: {
        assignee: { select: { id: true, name: true, image: true, email: true } },
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("[TASK_PATCH]", error)
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

    const task = await prisma.task.findUnique({
      where: { id },
      select: { projectId: true, creatorId: true },
    })

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: task.projectId,
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    // Apenas OWNER, ADMIN ou o próprio criador podem excluir
    if (member.role !== "OWNER" && member.role !== "ADMIN" && task.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Sem permissão para excluir esta tarefa" }, { status: 403 })
    }

    await prisma.task.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[TASK_DELETE]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { moveTaskSchema } from "@/lib/validations/task"

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
      select: { projectId: true, columnId: true, order: true },
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
    const parsed = moveTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { columnId: newColumnId, order: newOrder } = parsed.data

    // Verificar se a nova coluna existe e pertence ao projeto
    const newColumn = await prisma.column.findUnique({
      where: { id: newColumnId },
    })

    if (!newColumn || newColumn.projectId !== task.projectId) {
      return NextResponse.json({ error: "Coluna de destino inválida" }, { status: 400 })
    }

    // Executar a atualização em uma transação para manter a integridade da ordem
    await prisma.$transaction(async (tx) => {
      if (task.columnId === newColumnId) {
        // Movendo dentro da mesma coluna
        if (task.order === newOrder) return // Nada a fazer

        if (task.order < newOrder) {
          // Movendo para baixo
          await tx.task.updateMany({
            where: {
              columnId: newColumnId,
              order: { gt: task.order, lte: newOrder },
            },
            data: { order: { decrement: 1 } },
          })
        } else {
          // Movendo para cima
          await tx.task.updateMany({
            where: {
              columnId: newColumnId,
              order: { gte: newOrder, lt: task.order },
            },
            data: { order: { increment: 1 } },
          })
        }
      } else {
        // Movendo para outra coluna
        // Abrir espaço na nova coluna
        await tx.task.updateMany({
          where: {
            columnId: newColumnId,
            order: { gte: newOrder },
          },
          data: { order: { increment: 1 } },
        })

        // Fechar o buraco na coluna antiga (opcional, mas bom para integridade)
        await tx.task.updateMany({
          where: {
            columnId: task.columnId,
            order: { gt: task.order },
          },
          data: { order: { decrement: 1 } },
        })
      }

      // Finalmente, atualizar a própria tarefa
      await tx.task.update({
        where: { id },
        data: {
          columnId: newColumnId,
          order: newOrder,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TASK_MOVE_PATCH]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

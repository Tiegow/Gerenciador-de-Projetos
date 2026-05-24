import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const { id: taskId } = await params
    const { tagId } = await req.json()

    if (!tagId) return new NextResponse("Missing tagId", { status: 400 })

    // Verifica permissão (deve ter acesso à tarefa)
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true }
    })

    if (!task) return new NextResponse("Task not found", { status: 404 })

    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: task.projectId
        }
      }
    })

    if (!membership) return new NextResponse("Forbidden", { status: 403 })

    // Toggle logic: se a relação existe, remove. Se não, cria.
    const existing = await prisma.taskTag.findUnique({
      where: {
        taskId_tagId: {
          taskId,
          tagId
        }
      }
    })

    if (existing) {
      await prisma.taskTag.delete({
        where: {
          taskId_tagId: {
            taskId,
            tagId
          }
        }
      })
      return NextResponse.json({ success: true, action: "removed" })
    } else {
      await prisma.taskTag.create({
        data: {
          taskId,
          tagId
        }
      })
      return NextResponse.json({ success: true, action: "added" })
    }

  } catch (error) {
    console.error("[TASK_TAGS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

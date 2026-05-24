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
    const { content } = await req.json()

    if (!content?.trim()) {
      return new NextResponse("Missing content", { status: 400 })
    }

    // Verifica permissão via projeto da task
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

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId,
        authorId: session.user.id
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, email: true }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("[COMMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

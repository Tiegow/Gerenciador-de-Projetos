import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: projectId } = await params

    // Verificar se o projeto existe
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true }
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    // Tentar criar a membership (se já existir, vai dar erro de chave única, tratamos isso)
    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json({ success: true, message: "Already a member" })
    }

    await prisma.projectMember.create({
      data: {
        userId: session.user.id,
        projectId: projectId,
        role: "MEMBER" // Default role for joined users
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PROJECT_JOIN_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

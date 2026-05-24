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

    const { id: projectId } = await params
    const { name, color } = await req.json()

    if (!name || !color) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    // Verifica se usuário é membro do projeto
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId
        }
      }
    })

    if (!membership) return new NextResponse("Forbidden", { status: 403 })

    // Cria a tag
    const tag = await prisma.tag.create({
      data: {
        name,
        color,
        projectId
      }
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error("[PROJECT_TAGS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

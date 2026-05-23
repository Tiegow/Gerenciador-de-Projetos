import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createProjectSchema } from "@/lib/validations/project"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[PROJECTS_GET]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createProjectSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, description, color } = parsed.data

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
        columns: {
          create: [
            { name: "A Fazer", order: 0 },
            { name: "Em Progresso", order: 1 },
            { name: "Concluído", order: 2 },
          ],
        },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("[PROJECTS_POST]", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

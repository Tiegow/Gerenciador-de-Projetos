import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BoardClient } from "@/components/board/board-client"
import { BoardFilters } from "@/components/board/board-filters"
import { Suspense } from "react"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    select: { name: true },
  })

  return {
    title: project?.name || "Board Kanban",
  }
}

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params

  // Buscar o projeto, garantindo que o usuário seja membro
  const project = await prisma.project.findUnique({
    where: {
      id,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      columns: {
        orderBy: { order: "asc" },
      },
      tasks: {
        orderBy: { order: "asc" },
        include: {
          assignee: {
            select: { id: true, name: true, image: true, email: true },
          },
          tags: {
            include: { tag: true },
          },
        },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, image: true, email: true },
          },
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Extrair o papel do usuário logado para controle de permissões no cliente
  const currentUserMember = project.members.find((m) => m.userId === session.user?.id)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header do Board */}
      <div className="flex-none border-b border-neutral-800 bg-neutral-900/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-xl font-bold text-white">{project.name}</h1>
          </div>
          {/* Opcional: Aqui entrarão os avatares dos membros e botão "Configurações" */}
          <div className="flex -space-x-2">
            {project.members.map((m) => (
              <div
                key={m.id}
                className="h-8 w-8 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-xs font-medium text-white overflow-hidden"
                title={m.user.name || m.user.email}
              >
                {m.user.image ? (
                  <img src={m.user.image} alt={m.user.name || ""} className="h-full w-full object-cover" />
                ) : (
                  (m.user.name || m.user.email).charAt(0).toUpperCase()
                )}
              </div>
            ))}
          </div>
        </div>
        {project.description && (
          <p className="mt-1 text-sm text-neutral-400">{project.description}</p>
        )}
      </div>

      <BoardFilters />

      {/* Container Principal do Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <Suspense fallback={<div className="p-6 text-neutral-500">Carregando board...</div>}>
          <BoardClient 
            project={project} 
            role={currentUserMember?.role || "MEMBER"} 
          />
        </Suspense>
      </div>
    </div>
  )
}

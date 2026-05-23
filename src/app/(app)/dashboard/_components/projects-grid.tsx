import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FolderKanban } from "lucide-react"
import { ProjectActions } from "./project-actions"

export async function ProjectsGrid() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  // Apenas simulando um delay de rede para testes de PPR
  // await new Promise((resolve) => setTimeout(resolve, 2000))

  const projects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
    include: {
      _count: {
        select: { tasks: true, members: true },
      },
      members: {
        take: 3,
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
  })

  if (projects.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20">
        <FolderKanban className="mb-2 h-8 w-8 text-neutral-600" />
        <p className="text-neutral-400">Nenhum projeto encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}/board`}
          className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm transition-all hover:border-neutral-700 hover:bg-neutral-800/50"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${project.color}20`, color: project.color }}
              >
                <FolderKanban className="h-5 w-5" />
              </div>
              <ProjectActions project={project} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{project.name}</h3>
              {project.description && (
                <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{project.description}</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
            <div className="flex -space-x-2">
              {project.members.map((member) => (
                <div
                  key={member.user.name || member.user.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-xs font-medium text-white"
                  title={member.user.name || "User"}
                >
                  {member.user.image ? (
                    <img src={member.user.image} alt={member.user.name || ""} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    member.user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
              ))}
              {project._count.members > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-xs font-medium text-neutral-400">
                  +{project._count.members - 3}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-neutral-500">
              {project._count.tasks} tarefas
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

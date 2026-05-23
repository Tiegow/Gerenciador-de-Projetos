import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FolderKanban, CheckSquare, Clock, Users } from "lucide-react"

export async function StatsRow() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  // Aguarda um tempo curto para testar a Skeleton UI (Remover em produção)
  // await new Promise((resolve) => setTimeout(resolve, 1000))

  const [totalProjects, totalTasks, completedTasks, recentActivity] = await Promise.all([
    prisma.project.count({
      where: { members: { some: { userId } } },
    }),
    prisma.task.count({
      where: { project: { members: { some: { userId } } } },
    }),
    prisma.task.count({
      where: {
        status: "DONE",
        project: { members: { some: { userId } } },
      },
    }),
    prisma.task.count({
      where: {
        updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // últimos 7 dias
        project: { members: { some: { userId } } },
      },
    }),
  ])

  const stats = [
    {
      name: "Projetos Ativos",
      value: totalProjects.toString(),
      icon: FolderKanban,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      name: "Total de Tarefas",
      value: totalTasks.toString(),
      icon: CheckSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Tarefas Concluídas",
      value: completedTasks.toString(),
      icon: CheckSquare,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      name: "Atividades (7 dias)",
      value: recentActivity.toString(),
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm transition-all hover:bg-neutral-800/50"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">{stat.name}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

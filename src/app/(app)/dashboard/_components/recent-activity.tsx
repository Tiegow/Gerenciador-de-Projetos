import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export async function RecentActivity() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  // await new Promise((resolve) => setTimeout(resolve, 3000))

  const recentTasks = await prisma.task.findMany({
    where: { project: { members: { some: { userId } } } },
    include: {
      project: { select: { name: true, color: true } },
      assignee: { select: { name: true, image: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  if (recentTasks.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-sm text-neutral-400">
        Nenhuma atividade recente.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-sm overflow-hidden">
      <div className="border-b border-neutral-800 px-6 py-5">
        <h3 className="font-semibold text-white">Atividades Recentes</h3>
      </div>
      <div className="divide-y divide-neutral-800">
        {recentTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-800/30 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-white">
              {task.assignee?.image ? (
                <img src={task.assignee.image} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                task.assignee?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm text-neutral-300">
                <span className="font-medium text-white">{task.assignee?.name || "Usuário"}</span>{" "}
                atualizou a tarefa <span className="font-medium text-white">{task.title}</span>
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                <span
                  className="flex items-center gap-1.5 font-medium"
                  style={{ color: task.project.color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {task.project.name}
                </span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(task.updatedAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatsRow } from "./_components/stats-row"
import { ProjectsGrid } from "./_components/projects-grid"
import { RecentActivity } from "./_components/recent-activity"
import { StatsRowSkeleton, ProjectsGridSkeleton, RecentActivitySkeleton } from "./_components/skeletons"
import { NewProjectButton } from "./_components/new-project-button"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header da Página */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bem-vindo de volta, {session.user?.name?.split(" ")[0] || "Usuário"}!
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Aqui está um resumo do seu espaço de trabalho.
          </p>
        </div>
        <NewProjectButton />
      </div>

      {/* Estatísticas (PPR) */}
      <Suspense fallback={<StatsRowSkeleton />}>
        <StatsRow />
      </Suspense>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Grid de Projetos (PPR) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Meus Projetos</h2>
          </div>
          <Suspense fallback={<ProjectsGridSkeleton />}>
            <ProjectsGrid />
          </Suspense>
        </div>

        {/* Atividade Recente (PPR) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Atividade</h2>
          </div>
          <Suspense fallback={<RecentActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

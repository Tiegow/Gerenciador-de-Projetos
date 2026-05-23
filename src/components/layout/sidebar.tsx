"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, FolderKanban, X } from "lucide-react"
import { useUIStore } from "@/stores/ui.store"
import { useQuery } from "@tanstack/react-query"
import type { Project } from "@prisma/client"
import { useSession } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useUIStore()
  const { data: session } = useSession()

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Erro ao buscar projetos")
      return res.json()
    },
  })

  return (
    <>
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800 bg-neutral-900 transition-transform duration-300 md:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:-ml-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span>WorkFlow</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </nav>

          <div className="mt-8 px-4">
            <div className="mb-2 flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <span>Projetos</span>
            </div>
            
            <div className="space-y-1">
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-neutral-500 animate-pulse">Carregando...</div>
              ) : projects.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-500">Nenhum projeto</div>
              ) : (
                projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}/board`}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      pathname.includes(`/projects/${project.id}`)
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
                className="h-9 w-9 rounded-full border border-neutral-700"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-white">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-white">
                {session?.user?.name}
              </span>
              <span className="truncate text-xs text-neutral-500">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

"use client"

import { Menu } from "lucide-react"
import { useUIStore } from "@/stores/ui.store"

export function Header() {
  const { toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-800 bg-neutral-900/80 px-4 backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-neutral-400 hover:text-white md:hidden"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Pode adicionar notificações, pesquisa global, etc, no futuro */}
        </div>
      </div>
    </header>
  )
}

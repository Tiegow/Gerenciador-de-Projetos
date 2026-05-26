"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 hover:text-red-400"
    >
      <LogOut className="h-4 w-4" />
      Sair da Conta
    </button>
  )
}

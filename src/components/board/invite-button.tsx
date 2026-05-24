"use client"

import { Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"

export function InviteButton({ projectId }: { projectId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyInvite = () => {
    // Monta a URL completa baseada no host atual
    const url = `${window.location.origin}/invite/${projectId}`
    navigator.clipboard.writeText(url)
    
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <button
      onClick={handleCopyInvite}
      className="ml-3 flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copiado!</span>
        </>
      ) : (
        <>
          <LinkIcon className="h-3.5 w-3.5" />
          <span>Convite</span>
        </>
      )}
    </button>
  )
}

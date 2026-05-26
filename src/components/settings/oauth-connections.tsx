"use client"

import { Mail } from "lucide-react"

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}

interface OAuthConnectionsProps {
  accounts: {
    provider: string
  }[]
}

export function OAuthConnections({ accounts }: OAuthConnectionsProps) {
  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "github":
        return <GithubIcon className="h-5 w-5 text-white" />
      case "google":
        return <GoogleIcon className="h-5 w-5 text-white" />
      default:
        return <Mail className="h-5 w-5 text-white" />
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "github": return "GitHub"
      case "google": return "Google"
      default: return provider
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">Conexões</h2>
      <p className="mt-1 text-sm text-neutral-400">Contas sociais vinculadas ao seu perfil.</p>

      {accounts.length === 0 ? (
        <div className="mt-6 flex items-center justify-center rounded-lg border border-neutral-800 border-dashed bg-neutral-900/30 p-8 text-center">
          <p className="text-sm text-neutral-500">Nenhuma conta social vinculada.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {accounts.map((account) => (
            <div key={account.provider} className="flex max-w-xl items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/80 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800">
                {getProviderIcon(account.provider)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{getProviderName(account.provider)}</p>
                <p className="mt-0.5 text-xs text-green-400">Conectado</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

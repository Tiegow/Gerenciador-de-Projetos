import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo — Branding */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 lg:flex">
        {/* Pattern decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 max-w-md px-8 text-center">
          {/* Ícone */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-2xl backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Gerenciador de Projetos
          </h1>
          <p className="text-lg leading-relaxed text-indigo-100">
            Organize seus projetos e tarefas com um board Kanban moderno,
            colaborativo e completamente gratuito.
          </p>

          {/* Feature badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Kanban Board", "Colaboração", "Drag & Drop", "100% Free"].map(
              (feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>

        {/* Glow decorativo */}
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl" />
      </div>

      {/* Lado direito — Formulário */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

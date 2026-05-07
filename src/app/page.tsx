export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      {/* Logo / Title */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
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
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Gerenciador de Projetos
        </h1>
        <p className="text-neutral-400">
          Setup completo — Next.js 16 · React 19 · Prisma · Tailwind
        </p>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2">
        {[
          "Next.js 16.2",
          "React 19.2",
          "TypeScript",
          "Tailwind CSS 4",
          "Prisma",
          "Zustand",
          "React Query",
        ].map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Sprint 1 checklist */}
      <div className="mt-4 w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Sprint 1 — Setup
        </h2>
        <ul className="space-y-2 text-sm text-neutral-300">
          {[
            { label: "Next.js 16 + Turbopack", done: true },
            { label: "Tailwind CSS + PostCSS", done: true },
            { label: "Prisma Schema + Neon DB", done: true },
            { label: "Schemas Zod (validação)", done: true },
            { label: "Zustand + React Query", done: true },
            { label: "Estrutura de pastas", done: true },
            { label: "Variáveis de ambiente", done: true },
          ].map(({ label, done }) => (
            <li key={label} className="flex items-center gap-2">
              {done ? (
                <span className="text-emerald-400">✓</span>
              ) : (
                <span className="text-neutral-600">○</span>
              )}
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

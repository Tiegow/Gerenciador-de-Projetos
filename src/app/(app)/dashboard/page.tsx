import { auth } from "@/lib/auth"
import { logout } from "@/app/actions/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
        <div className="mb-6 flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name ?? "Avatar"}
              className="h-14 w-14 rounded-full border-2 border-indigo-500"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">
              Olá, {session?.user?.name ?? "Usuário"}! 👋
            </h1>
            <p className="text-sm text-neutral-400">{session?.user?.email}</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          ✅ Autenticação funcionando — Sprint 2 concluído!
        </div>

        <p className="mb-6 text-sm text-neutral-400">
          Esta é uma página temporária de dashboard. Na Sprint 3 ela será
          substituída pelo dashboard real com a lista de projetos.
        </p>

        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            Sair da conta
          </button>
        </form>
      </div>
    </div>
  )
}

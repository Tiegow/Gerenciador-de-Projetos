import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "./_components/login-form"
import { OAuthButtons } from "./_components/oauth-buttons"

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Bem-vindo de volta
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Entre com sua conta para acessar seus projetos
        </p>
      </div>

      {/* OAuth */}
      <OAuthButtons />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-950 px-2 text-neutral-500">
            ou continue com e-mail
          </span>
        </div>
      </div>

      {/* Credentials form */}
      <LoginForm />

      {/* Link para registro */}
      <p className="mt-6 text-center text-sm text-neutral-400">
        Não tem uma conta?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Criar conta
        </Link>
      </p>
    </>
  )
}

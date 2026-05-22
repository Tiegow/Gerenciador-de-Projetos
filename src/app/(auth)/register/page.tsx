import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "./_components/register-form"
import { OAuthButtons } from "../login/_components/oauth-buttons"

export const metadata: Metadata = {
  title: "Criar conta",
}

export default function RegisterPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Criar conta
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Comece a organizar seus projetos agora
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
            ou crie com e-mail
          </span>
        </div>
      </div>

      {/* Register form */}
      <RegisterForm />

      {/* Link para login */}
      <p className="mt-6 text-center text-sm text-neutral-400">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Entrar
        </Link>
      </p>
    </>
  )
}

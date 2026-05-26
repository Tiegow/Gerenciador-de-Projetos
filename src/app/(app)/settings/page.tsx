import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/settings/profile-form"
import { AccountForm } from "@/components/settings/account-form"
import { OAuthConnections } from "@/components/settings/oauth-connections"
import { DeleteAccountZone } from "@/components/settings/delete-account-zone"
import { LogoutButton } from "@/components/settings/logout-button"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Configurações | Gerenciador de Projetos",
  description: "Gerencie suas informações de perfil, segurança e conexões.",
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/auth/login")
  }

  const hasPassword = !!user.password

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Configurações
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Gerencie suas preferências de conta, segurança e integrações.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        <ProfileForm 
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
          }} 
        />

        <AccountForm hasPassword={hasPassword} />

        <OAuthConnections accounts={user.accounts} />

        <DeleteAccountZone />
      </div>
    </div>
  )
}

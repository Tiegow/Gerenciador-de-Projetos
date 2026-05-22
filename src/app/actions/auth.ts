"use server"

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard" })
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function loginWithCredentials(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "E-mail ou senha incorretos" }
        default:
          return { error: "Algo deu errado. Tente novamente." }
      }
    }
    // NextAuth redireciona lançando um erro NEXT_REDIRECT
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}

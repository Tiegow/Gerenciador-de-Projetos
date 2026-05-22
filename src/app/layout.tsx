import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gerenciador de Projetos",
    template: "%s | Gerenciador de Projetos",
  },
  description:
    "Organize seus projetos e tarefas com um board Kanban moderno e colaborativo.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Gerenciador de Projetos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full bg-neutral-950 font-sans text-neutral-50 antialiased">
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
        <Toaster
          richColors
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(0 0% 9%)",
              border: "1px solid hsl(0 0% 15%)",
            },
          }}
        />
      </body>
    </html>
  );
}

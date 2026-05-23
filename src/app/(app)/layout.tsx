import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProjectModal } from "@/components/modals/project-modal"
import { DeleteProjectModal } from "@/components/modals/delete-project-modal"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-neutral-950 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Global Modals */}
      <ProjectModal />
      <DeleteProjectModal />
    </div>
  )
}

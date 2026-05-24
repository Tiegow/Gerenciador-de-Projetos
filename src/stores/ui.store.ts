import { create } from "zustand"
import type { Project } from "@prisma/client"

interface UIState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void

  isProjectModalOpen: boolean
  projectToEdit: Project | null
  openProjectModal: (project?: Project) => void
  closeProjectModal: () => void

  isDeleteProjectModalOpen: boolean
  projectToDelete: Project | null
  openDeleteProjectModal: (project: Project) => void
  closeDeleteProjectModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true, // Começa aberta por padrão no desktop
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  isProjectModalOpen: false,
  projectToEdit: null,
  openProjectModal: (project) => set({ isProjectModalOpen: true, projectToEdit: project || null }),
  closeProjectModal: () => set({ isProjectModalOpen: false, projectToEdit: null }),

  isDeleteProjectModalOpen: false,
  projectToDelete: null,
  openDeleteProjectModal: (project) => set({ isDeleteProjectModalOpen: true, projectToDelete: project }),
  closeDeleteProjectModal: () => set({ isDeleteProjectModalOpen: false, projectToDelete: null }),
}))

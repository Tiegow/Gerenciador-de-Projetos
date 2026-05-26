import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { TaskCard } from "@/components/board/task-card"

// Mock do dnd-kit
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    setNodeRef: vi.fn(),
    attributes: {},
    listeners: {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

// Mock do dnd-kit/utilities
vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: vi.fn(),
    },
  },
}))

// Mock do store Zustand
vi.mock("@/stores/board.store", () => ({
  useBoardStore: () => vi.fn(),
}))

const mockTask = {
  id: "1",
  title: "Test Task",
  description: "Test description",
  order: 0,
  priority: "HIGH" as any,
  status: "TODO" as any,
  dueDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  projectId: "p1",
  columnId: "c1",
  creatorId: "u1",
  assigneeId: null,
  tags: [
    {
      taskId: "1",
      tagId: "t1",
      tag: {
        id: "t1",
        name: "Bug",
        color: "#ff0000",
        projectId: "p1",
      },
    },
  ],
  comments: [],
  attachments: [],
  assignee: null,
}

describe("TaskCard Component", () => {
  it("renders task title correctly", () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText("Test Task")).toBeInTheDocument()
  })

  it("renders priority badge", () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText("Alta")).toBeInTheDocument()
  })

  it("renders tags correctly", () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText("Bug")).toBeInTheDocument()
  })

  it("shows question mark when no assignee", () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText("?")).toBeInTheDocument()
    expect(screen.getByTitle("Sem responsável")).toBeInTheDocument()
  })
})

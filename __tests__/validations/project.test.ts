import { describe, it, expect } from "vitest"
import { createProjectSchema } from "@/lib/validations/project"

describe("Project Validations", () => {
  it("should validate a correct project payload", () => {
    const validPayload = {
      name: "Meu Projeto",
      description: "Um projeto incrível",
      color: "#ff0000",
    }
    const result = createProjectSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it("should fail when name is too short", () => {
    const invalidPayload = {
      name: "A",
      color: "#ffffff",
    }
    const result = createProjectSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("O nome do projeto deve ter no mínimo 3 caracteres")
    }
  })

  it("should fail when color is invalid hex", () => {
    const invalidPayload = {
      name: "Valid Name",
      color: "red", // invalid hex
    }
    const result = createProjectSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
  })

  it("should provide default color if not provided", () => {
    const payload = { name: "Valid Name" }
    const result = createProjectSchema.safeParse(payload)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.color).toBe("#6366f1")
    }
  })
})

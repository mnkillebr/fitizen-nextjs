import { z } from "zod"

export interface SessionPayload {
  id: string
}

export const loginSchema = z.object({
  email: z.string().email(),
})

export const registerMagicLinkSchema = z.object({
  first_name: z.string().min(1, "First name cannot be blank"),
  last_name: z.string().min(1, "Last name cannot be blank"),
})

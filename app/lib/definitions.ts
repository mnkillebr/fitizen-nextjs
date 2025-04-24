import { z } from "zod"

export interface SessionPayload {
  id: string
}

export interface SetupProfilePayload {
  email: string
  provider?: string
  provider_user_id?: string
}

export const loginSchema = z.object({
  email: z.string().email(),
})

export const registerWithEmailSchema = z.object({
  first_name: z.string().min(1, "First name cannot be blank"),
  last_name: z.string().min(1, "Last name cannot be blank"),
})

export interface MagicLinkPayload {
  email: string
  nonce: string
  createdAt: string
}

export type ExerciseDialogProps = {
  exercise: {
    muxPlaybackId: string | null;
    videoToken?: string;
    cues: string[];
    name: string;
  }
}

export const programLogSchema = z.object({
  programId: z.string(),
  programWeek: z.string(),
  programDay: z.string(),
  duration: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  blocks: z.array(z.object({
    blockId: z.string().optional(),
    blockNumber: z.string().optional(),
    programBlockId: z.string(),
    sets: z.array(z.object({
      set: z.string(),
      targetReps: z.string().optional(),
      time: z.string().optional(),
      exerciseId: z.string(),
      actualReps: z.string().optional(),
      load: z.string().optional(),
      unit: z.string(),
      notes: z.string().optional(),
    })),
  })).min(1, "You must log at least one exercise"),
});
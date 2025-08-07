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

export const workoutLogSchema = z.object({
  workoutId: z.string(),
  duration: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    circuitId: z.string().optional(),
    target: z.string(),
    targetReps: z.string().optional(),
    time: z.string().optional(),
    sets: z.array(z.object({
      set: z.string(),
      actualReps: z.string().optional(),
      load: z.string().optional(),
      unit: z.string(),
      notes: z.string().optional(),
    })),
  })).min(1, "You must add at least one exercise"),
});

export const createWorkoutSchema = z.object({
  workoutName: z.string().min(1, "Workout name is required"),
  workoutDescription: z.string().optional(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    circuitId: z.string().optional(),
    sets: z.string(),
    target: z.string(),
    reps: z.string().optional(),
    rpe: z.string(),
    time: z.string().optional(),
    rest: z.string(),
    notes: z.string().optional(),
    orderInRoutine: z.string(),
  })).min(1, "You must add at least one exercise"),
});

export const updateUserProfileSchema = z.object({
  firstName: z.string()
    .min(1, "First Name is required")
    .transform(val => val.trim())
    .refine(val => val.length > 0, "Name cannot be only spaces"),
  lastName: z.string()
    .min(1, "Last Name is required")
    .transform(val => val.trim())
    .refine(val => val.length > 0, "Name cannot be only spaces"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .transform(val => val.trim())
})

export const updateFitnessProfileSchema = z.object({
  heightUnit: z.string().optional(),
  userHeight: z.string().optional(),
  unit: z.string().optional(),
  currentWeight: z.string().optional(),
  targetWeight: z.string().optional(),
  "fat-loss": z.string().optional(),
  endurance: z.string().optional(),
  "build-muscle": z.string().optional(),
  "lose-weight": z.string().optional(),
  "improve-balance": z.string().optional(),
  "improve-flexibility": z.string().optional(),
  "learn-new-skills": z.string().optional(),
  "heart-condition": z.string().optional(),
  "chest-pain-activity": z.string().optional(),
  "chest-pain-no-activity": z.string().optional(),
  "balance-consciousness": z.string().optional(),
  "bone-joint": z.string().optional(),
  "blood-pressure-meds": z.string().optional(),
  "other-reasons": z.string().optional(),
  occupation: z.string().optional(),
  "extended-sitting": z.string().optional(),
  "repetitive-movements": z.string().optional(),
  "explanation_repetitive-movements": z.string().optional(),
  "heel-shoes": z.string().optional(),
  "mental-stress": z.string().optional(),
  "physical-activities": z.string().optional(),
  "explanation_physical-activities": z.string().optional(),
  hobbies: z.string().optional(),
  explanation_hobbies: z.string().optional(),
  "injuries-pain": z.string().optional(),
  "explanation_injuries-pain": z.string().optional(),
  surgeries: z.string().optional(),
  explanation_surgeries: z.string().optional(),
  "chronic-disease": z.string().optional(),
  "explanation_chronic-disease": z.string().optional(),
  medications: z.string().optional(),
  explanation_medications: z.string().optional(),
})

export const generateWorkoutSchema = z.object({
  location: z.string(),
  type: z.string(),
  focus: z.string(),
  time: z.string(),
})

export const generateProgramSchema = z.object({
  deepSquat: z.string(),
  hurdleStep: z.string(),
  inlineLunge: z.string(),
  shoulderMobility: z.string(),
  activeStraightLegRaise: z.string(),
  trunkStabilityPushUp: z.string(),
  rotaryStability: z.string(),
  coachNotes: z.string(),
})

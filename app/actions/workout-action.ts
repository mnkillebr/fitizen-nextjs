"use server";

import { saveUserWorkoutLog } from "@/models/workout.server";
import { workoutLogSchema } from "../lib/definitions";
import { newWorkoutLog } from "../lib/sessions";
import { verifySession } from "../lib/dal";
import { redirect } from "next/navigation";

interface ExerciseType {
  exerciseId: string;
  target: string;
  sets: {
    set: string;
    unit: string;
    actualReps?: string | undefined;
    load?: string | undefined;
    notes?: string | undefined;
  }[];
  circuitId?: string | undefined;
  targetReps?: string | undefined;
  time?: string | undefined;
}

interface SetType {
  set: string;
  unit: string;
  actualReps?: string | undefined;
  load?: string | undefined;
  notes?: string | undefined;
}

function workoutLogFormDataToObject(formData: FormData): { [key: string]: any } {
  let formDataObject: { [key: string]: any } = {};

  for (const [key, value] of formData.entries()) {
    const keys = key.match(/([^\[\].]+)/g);

    if (!keys) {
      formDataObject[key] = value;
      continue;
    }

    let current = formDataObject;
    for (let i = 0; i < keys.length; i++) {
      const prop = keys[i];
      const nextProp = keys[i + 1];

      if (nextProp !== undefined) {
        if (!current[prop]) {
          current[prop] = /^\d+$/.test(nextProp) ? [] : {};
        }
        current = current[prop];
      } else {
        current[prop] = value;
      }
    }
  }

  return formDataObject;
}

export async function createWorkoutLog(prevState: unknown, formData: FormData) {
  const workoutLogObject = workoutLogFormDataToObject(formData);
  const validatedFields = workoutLogSchema.safeParse(workoutLogObject);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { workoutId, duration, date, exercises } = validatedFields.data;

  try {
    const { userId } = await verifySession();
    if (!userId) {
      return {
        server_error: "User not authenticated",
      };
    }
    
    const mappedExerciseLogs = exercises.map((exercise: ExerciseType, idx: number) => ({
      ...exercise,
      orderInRoutine: idx + 1,
      sets: exercise.sets.map((set: SetType) => ({
        ...set,
        target: exercise.target === "reps" ? "reps" : "time",
        load: set.load ? parseFloat(set.load) : undefined,
        unit: set.unit === "bw" ? "bodyweight" : set.unit === "lb(s)" ? "pound" : "kilogram",
      }))
    }))

    const workoutLog = await saveUserWorkoutLog(userId as string, workoutId, duration, mappedExerciseLogs);
    await newWorkoutLog({workoutLogId: workoutLog.id, workoutName: `Workout ${date}`});
  } catch (err) {
    console.error("Workout log error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
  redirect(`/workouts/${workoutId}`);
}

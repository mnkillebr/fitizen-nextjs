"use server";

import { createUserWorkout, ExerciseLogType, saveUserWorkoutLog } from "@/models/workout.server";
import { createWorkoutSchema, workoutLogSchema } from "../lib/definitions";
import { newWorkoutLog } from "../lib/sessions";
import { verifySession } from "../lib/dal";
import { redirect } from "next/navigation";

interface SetType {
  set: string;
  unit: string;
  actualReps?: string | undefined;
  load?: string | undefined;
  notes?: string | undefined;
}

interface ExerciseType {
  exerciseId: string;
  target: string;
  sets: SetType[];
  circuitId?: string | undefined;
  targetReps?: string | undefined;
  time?: string | undefined;
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

function workoutFormDataToObject(formData: FormData): { [key: string]: any } {
  let formDataObject: { [key: string]: any } = {};

  for (const [key, value] of formData.entries()) {
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]\.(\w+)$/);

    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const arrayMatchIndex = parseInt(arrayMatch[2], 10);
      const property = arrayMatch[3];

      if (!formDataObject[arrayName]) {
        formDataObject[arrayName] = [];
      }

      if (!formDataObject[arrayName][arrayMatchIndex]) {
        formDataObject[arrayName][arrayMatchIndex] = {};
      }

      if (formDataObject[arrayName][arrayMatchIndex][property]) {
        const currentObjects = formDataObject[arrayName]
        const lastObject = currentObjects[currentObjects.length - 1];

        if (lastObject.hasOwnProperty(property)) {
          const newObject = { [property]: value };
          formDataObject[arrayName].push(newObject);
        } else {
          formDataObject[arrayName][currentObjects.length-1][property] = value;
        }
      } else {
        formDataObject[arrayName][arrayMatchIndex][property] = value;
      }
    } else {
      formDataObject[key] = value;
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
      target: exercise.target === "reps" ? "reps" : "time",
      orderInRoutine: idx + 1,
      sets: exercise.sets.map((set: SetType) => ({
        ...set,
        load: set.load ? parseFloat(set.load) : undefined,
        unit: set.unit === "bw" ? "bodyweight" : set.unit === "lb(s)" ? "pound" : "kilogram",
      }))
    }))

    const workoutLog = await saveUserWorkoutLog(userId as string, workoutId, duration, mappedExerciseLogs as Array<ExerciseLogType>);
    await newWorkoutLog({workoutLogId: workoutLog.id, workoutName: `Workout ${date}`});
  } catch (err) {
    console.error("Workout log error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
  redirect(`/workouts/${workoutId}`);
}

export async function createWorkout(prevState: unknown, formData: FormData) {
  const workoutObject = workoutFormDataToObject(formData);
  const validatedFields = createWorkoutSchema.safeParse(workoutObject);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { workoutName, workoutDescription, exercises } = validatedFields.data;

  try {
    const { userId } = await verifySession();
    if (!userId) {
      return {
        server_error: "User not authenticated",
      };
    }

    const mappedExercises = exercises.map((exercise: any, idx: number) => ({
      ...exercise,
      exerciseId: exercise.exerciseId.split("-")[0],
      orderInRoutine: parseInt(exercise.orderInRoutine),
      rpe: parseInt(exercise.rpe),
    }))

   await createUserWorkout(userId as string, workoutName, workoutDescription ?? "", mappedExercises);
  } catch (err) {
    console.error("Create workout error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
  redirect(`/workouts`);
}

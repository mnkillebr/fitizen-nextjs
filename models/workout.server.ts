import db from "@/db";
import {
  Routine,
  RoutineExercise,
  Exercise,
  WorkoutLog,
  ExerciseLog,
  ExerciseLogSet
} from "@/db/schema";
import { eq, desc, ilike, and, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

export function getAllWorkouts(query: string) {
  return db.select().from(Routine)
    .where(ilike(Routine.name, `%${query}%`))
    .orderBy(desc(Routine.createdAt), asc(Routine.name));
};

export async function getWorkoutById(id: string) {
  const result = await db.select()
    .from(Routine)
    .leftJoin(RoutineExercise, eq(Routine.id, RoutineExercise.routineId))
    .leftJoin(Exercise, eq(RoutineExercise.exerciseId, Exercise.id))
    .where(eq(Routine.id, id));

  if (!result.length) {
    return null;
  }

  // Transform the flat result into a nested structure
  const routine = result[0].Routine;
  const exercises = result
    .filter(row => row.RoutineExercise && row.Exercise)
    .map(row => ({
      ...row.RoutineExercise!,
      exercise: {
        id: row.Exercise!.id,
        name: row.Exercise!.name,
        description: row.Exercise!.description,
        isFree: row.Exercise!.isFree,
        cues: row.Exercise!.cues,
        tips: row.Exercise!.tips,
        youtubeLink: row.Exercise!.youtubeLink,
        s3ImageKey: row.Exercise!.s3ImageKey,
        s3VideoKey: row.Exercise!.s3VideoKey,
        muxPlaybackId: row.Exercise!.muxPlaybackId,
        tags: row.Exercise!.tags,
        balance: row.Exercise!.balance,
        balanceLevel: row.Exercise!.balanceLevel,
        body: row.Exercise!.body,
        contraction: row.Exercise!.contraction,
        equipment: row.Exercise!.equipment,
        joint: row.Exercise!.joint,
        lift: row.Exercise!.lift,
        muscles: row.Exercise!.muscles,
        pattern: row.Exercise!.pattern,
        plane: row.Exercise!.plane,
        stretch: row.Exercise!.stretch
      }
    }));

  return {
    ...routine,
    exercises
  };
};

export async function getWorkoutLogsById(userId: string, routineId: string) {
  return db.select().from(WorkoutLog)
    .where(and(eq(WorkoutLog.userId, userId), eq(WorkoutLog.routineId, routineId)));
}

export interface ExerciseLogSet {
  set: string;
  actualReps?: string;
  load?: number;
  unit: "bodyweight" | "kilogram" | "pound";
  notes?: string;
}
export interface ExerciseLogType {
  exerciseId: string;
  circuitId?: string;
  target: "reps" | "time";
  time?: string;
  targetReps?: string;
  sets: ExerciseLogSet[];
  orderInRoutine: number;
}

export async function saveUserWorkoutLog(userId: string, routineId: string, duration: string, exerciseLogs: Array<ExerciseLogType>) {
  // Start a transaction
  return await db.transaction(async (tx) => {
    // Create the workout log
    const [workoutLog] = await tx
      .insert(WorkoutLog)
      .values({
        id: nanoid(),
        userId,
        routineId,
        date: new Date(),
        duration,
      })
      .returning();

    // Create exercise logs and their sets
    for (const exerciseLog of exerciseLogs) {
      const [exerciseLogRecord] = await tx
        .insert(ExerciseLog)
        .values({
          id: nanoid(),
          workoutLogId: workoutLog.id,
          exerciseId: exerciseLog.exerciseId,
          circuitId: exerciseLog.circuitId,
          orderInRoutine: exerciseLog.orderInRoutine,
          target: exerciseLog.target,
          time: exerciseLog.time,
          targetReps: exerciseLog.targetReps,
        })
        .returning();

      // Create sets for each exercise log
      for (const set of exerciseLog.sets) {
        await tx.insert(ExerciseLogSet).values({
          id: nanoid(),
          exerciseLogId: exerciseLogRecord.id,
          set: set.set,
          actualReps: set.actualReps,
          load: set.load,
          notes: set.notes,
          unit: set.unit,
        });
      }
    }

    return workoutLog;
  });
}

interface WorkoutLogWithDetails {
  id: string;
  userId: string;
  routineId: string;
  date: Date;
  duration: string;
  routineName: string | null;
  exerciseLogs: Array<{
    id: string;
    exerciseId: string;
    circuitId: string | null;
    orderInRoutine: number;
    target: "reps" | "time";
    time: string | null;
    targetReps: string | null;
    sets: Array<{
      id: string;
      set: string;
      actualReps: string | null;
      load: number | null;
      notes: string | null;
      unit: "bodyweight" | "kilogram" | "pound";
    }>;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
      tags: string[];
    };
  }>;
}

export async function getUserWorkoutLog(userId: string, workoutLogId: string): Promise<WorkoutLogWithDetails | null> {
  const result = await db.select()
    .from(WorkoutLog)
    .leftJoin(Routine, eq(WorkoutLog.routineId, Routine.id))
    .leftJoin(ExerciseLog, eq(WorkoutLog.id, ExerciseLog.workoutLogId))
    .leftJoin(ExerciseLogSet, eq(ExerciseLog.id, ExerciseLogSet.exerciseLogId))
    .leftJoin(Exercise, eq(ExerciseLog.exerciseId, Exercise.id))
    .where(and(eq(WorkoutLog.id, workoutLogId), eq(WorkoutLog.userId, userId)));

  if (!result.length) {
    return null;
  }

  // Transform the flat result into a nested structure
  const workoutLog = result[0].WorkoutLog;
  const routineName = result[0].Routine?.name || null;

  // Group exercise logs by their ID
  const exerciseLogsMap = new Map<string, WorkoutLogWithDetails['exerciseLogs'][0]>();
  result.forEach(row => {
    if (!row.ExerciseLog?.id) return;

    const exerciseLog = row.ExerciseLog;
    const exerciseLogSet = row.ExerciseLogSet;
    const exercise = row.Exercise;

    if (!exerciseLogsMap.has(exerciseLog.id)) {
      exerciseLogsMap.set(exerciseLog.id, {
        id: exerciseLog.id,
        exerciseId: exerciseLog.exerciseId,
        circuitId: exerciseLog.circuitId,
        orderInRoutine: exerciseLog.orderInRoutine,
        target: exerciseLog.target,
        time: exerciseLog.time,
        targetReps: exerciseLog.targetReps,
        sets: [],
        exercise: exercise ? {
          id: exercise.id,
          name: exercise.name,
          muxPlaybackId: exercise.muxPlaybackId,
          cues: exercise.cues,
          tags: exercise.tags
        } : {
          id: "",
          name: "",
          muxPlaybackId: null,
          cues: [],
          tags: []
        }
      });
    }

    // Add set if it exists
    if (exerciseLogSet?.id) {
      const existingLog = exerciseLogsMap.get(exerciseLog.id);
      if (existingLog && !existingLog.sets.some(s => s.id === exerciseLogSet.id)) {
        existingLog.sets.push({
          id: exerciseLogSet.id,
          set: exerciseLogSet.set,
          actualReps: exerciseLogSet.actualReps,
          load: exerciseLogSet.load,
          notes: exerciseLogSet.notes,
          unit: exerciseLogSet.unit
        });
      }
    }
  });

  return {
    id: workoutLog.id,
    userId: workoutLog.userId,
    routineId: workoutLog.routineId,
    date: workoutLog.date,
    duration: workoutLog.duration,
    routineName,
    exerciseLogs: Array.from(exerciseLogsMap.values())
  };
}
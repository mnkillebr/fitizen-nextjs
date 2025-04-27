import db from "@/db";
import {
  Routine,
  RoutineExercise,
  Exercise,
  WorkoutLog
} from "@/db/schema";
import { eq, desc, ilike, and } from "drizzle-orm";

export function getAllWorkouts(query: string) {
  return db.select().from(Routine)
    .where(ilike(Routine.name, `%${query}%`))
    .orderBy(desc(Routine.createdAt), desc(Routine.name));
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
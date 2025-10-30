import db from "@/db";
import { Exercise } from "@/db/schema";
import { eq, desc, ilike, and, asc, sql, or, inArray, arrayOverlaps } from "drizzle-orm";

export async function getAllExercisesPaginated(query: string, page: number, limit: number = 10) {
  const offset = (page - 1) * limit;
  
  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(Exercise)
    .where(ilike(Exercise.name, `%${query}%`));

  // Get paginated exercises
  const exercises = await db.select().from(Exercise)
    .where(ilike(Exercise.name, `%${query}%`))
    .orderBy(desc(Exercise.createdAt), asc(Exercise.name))
    .limit(limit)
    .offset(offset);

  return {
    exercises,
    totalCount: count
  };
}

export async function getBodyFocusExercisesPaginated(bodyFocus: 'upper' | 'lower' | 'core' | 'full', page: number, limit: number = 10) {
  const offset = (page - 1) * limit;
  
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(Exercise)
    .where(arrayOverlaps(Exercise.body, [bodyFocus]))
  const exercises = await db.select().from(Exercise)
    .where(arrayOverlaps(Exercise.body, [bodyFocus]))
    .orderBy(desc(Exercise.createdAt), asc(Exercise.name))
    .limit(limit)
    .offset(offset);
  return {
    exercises,
    totalCount: count
  };;
}

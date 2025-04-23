import db from "@/db";
import { Program, ProgramWeek, ProgramDay, ProgramBlock, BlockExercise, ProgramLog, Exercise } from "@/db/schema";
import { eq, desc, ilike, and } from "drizzle-orm";

interface NestedProgram {
  id: string;
  name: string;
  description: string | null;
  isFree: boolean;
  price: string | null;
  youtubeLink: string | null;
  s3ImageKey: string | null;
  s3VideoKey: string | null;
  muxPlaybackId: string | null;
  userId: string | null;
  weeks: Array<{
    id: string;
    programId: string;
    weekNumber: number;
    days: Array<{
      id: string;
      programWeekId: string;
      dayNumber: number;
      movementPrepId: string;
      warmupId: string;
      cooldownId: string;
      blocks: Array<{
        id: string;
        programDayId: string;
        blockNumber: number;
        exercises: Array<{
          programBlockId: string;
          exerciseId: string;
          orderInBlock: number;
          sets: number | null;
          target: string;
          reps: number | null;
          time: number | null;
          notes: string | null;
          rest: number | null;
          side: string | null;
          exercise: {
            id: string;
            name: string;
            muxPlaybackId: string | null;
            cues: string[];
            tags: string[];
          };
        }>;
      }>;
    }>;
  }>;
}

export async function getProgramById(id: string): Promise<NestedProgram | null> {
  const program = await db.select().from(Program)
    .where(eq(Program.id, id))
    .leftJoin(ProgramWeek, eq(Program.id, ProgramWeek.programId))
    .leftJoin(ProgramDay, eq(ProgramWeek.id, ProgramDay.programWeekId))
    .leftJoin(ProgramBlock, eq(ProgramDay.id, ProgramBlock.programDayId))
    .leftJoin(BlockExercise, eq(ProgramBlock.id, BlockExercise.programBlockId))
    .leftJoin(Exercise, eq(BlockExercise.exerciseId, Exercise.id));

  if (!program.length) {
    return null;
  }

  // Transform the flat result into a nested structure
  const result = program.reduce<NestedProgram>((acc, row) => {
    if (!acc) {
      acc = {
        ...row.Program,
        weeks: []
      };
    }

    if (row.ProgramWeek) {
      let week = acc.weeks.find(w => w.id === row.ProgramWeek!.id);
      if (!week) {
        week = {
          ...row.ProgramWeek,
          days: []
        };
        acc.weeks.push(week);
      }

      if (row.ProgramDay) {
        let day = week.days.find(d => d.id === row.ProgramDay!.id);
        if (!day) {
          day = {
            ...row.ProgramDay,
            blocks: []
          };
          week.days.push(day);
        }

        if (row.ProgramBlock) {
          let block = day.blocks.find(b => b.id === row.ProgramBlock!.id);
          if (!block) {
            block = {
              ...row.ProgramBlock,
              exercises: []
            };
            day.blocks.push(block);
          }

          if (row.BlockExercise && row.Exercise) {
            block.exercises.push({
              ...row.BlockExercise,
              exercise: {
                id: row.Exercise.id,
                name: row.Exercise.name,
                muxPlaybackId: row.Exercise.muxPlaybackId,
                cues: row.Exercise.cues,
                tags: row.Exercise.tags
              }
            });
          }
        }
      }
    }

    return acc;
  }, null as unknown as NestedProgram);

  return result;
};

export function getUserProgramLogsByProgramId(userId: string, programId: string) {
  return db.select().from(ProgramLog)
    .where(and(eq(ProgramLog.userId, userId), eq(ProgramLog.programId, programId)));
}

export function getAllPrograms(query: string) {
  return db.select().from(Program)
    .where(ilike(Program.name, `%${query}%`))
    .orderBy(desc(Program.name));
};

export function getProgramName(programId: string) {
  return db.select({ name: Program.name }).from(Program).where(eq(Program.id, programId));
}
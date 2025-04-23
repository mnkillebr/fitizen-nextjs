import db from "@/db";
import {
  Program,
  ProgramWeek,
  ProgramDay,
  ProgramBlock,
  BlockExercise,
  ProgramLog,
  Exercise,
  MovementPrep,
  FoamRollingExercise,
  MobilityExercise,
  ActivationExercise,
  Warmup,
  Cooldown,
  DynamicExercise,
  LadderExercise,
  PowerExercise,
  CooldownExercise,
} from "@/db/schema";
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

interface NestedMovementPrep {
  id: string;
  name: string;
  description: string | null;
  foamRolling: Array<{
    reps: number;
    time: number | null;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
    };
  }>;
  mobility: Array<{
    reps: number;
    time: number | null;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
    };
  }>;
  activation: Array<{
    reps: number;
    time: number | null;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
    };
  }>;
}

interface NestedWarmup {
  id: string;
  name: string;
  description: string | null;
  dynamic: Array<{
    reps: number;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
    };
  }>;
  ladder: Array<{
    reps: number;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
    };
  }>;
  power: Array<{
    reps: number;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
    };
  }>;
}

interface NestedCooldown {
  id: string;
  name: string;
  description: string | null;
  exercises: Array<{
    reps: number | null;
    time: number | null;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
    };
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

export async function getMovementPrepById(movementPrepId: string): Promise<NestedMovementPrep | null> {
  // Get the base movement prep
  const movementPrep = await db.select().from(MovementPrep)
    .where(eq(MovementPrep.id, movementPrepId));

  if (!movementPrep.length) {
    return null;
  }

  // Get foam rolling exercises
  const foamRollingResults = await db.select({
    reps: FoamRollingExercise.reps,
    time: FoamRollingExercise.time,
    exercise: {
      id: Exercise.id,
      name: Exercise.name,
      muxPlaybackId: Exercise.muxPlaybackId,
      cues: Exercise.cues
    }
  })
    .from(FoamRollingExercise)
    .leftJoin(Exercise, eq(FoamRollingExercise.exerciseId, Exercise.id))
    .where(eq(FoamRollingExercise.movementPrepId, movementPrepId));

  const foamRolling = foamRollingResults
    .filter(result => result.exercise !== null)
    .map(result => ({
      reps: result.reps,
      time: result.time,
      exercise: result.exercise!
    }));

  // Get mobility exercises
  const mobilityResults = await db.select({
    reps: MobilityExercise.reps,
    time: MobilityExercise.time,
    exercise: {
      id: Exercise.id,
      name: Exercise.name,
      muxPlaybackId: Exercise.muxPlaybackId,
      cues: Exercise.cues
    }
  })
    .from(MobilityExercise)
    .leftJoin(Exercise, eq(MobilityExercise.exerciseId, Exercise.id))
    .where(eq(MobilityExercise.movementPrepId, movementPrepId));

  const mobility = mobilityResults
    .filter(result => result.exercise !== null)
    .map(result => ({
      reps: result.reps,
      time: result.time,
      exercise: result.exercise!
    }));

  // Get activation exercises
  const activationResults = await db.select({
    reps: ActivationExercise.reps,
    time: ActivationExercise.time,
    exercise: {
      id: Exercise.id,
      name: Exercise.name,
      muxPlaybackId: Exercise.muxPlaybackId,
      cues: Exercise.cues
    }
  })
    .from(ActivationExercise)
    .leftJoin(Exercise, eq(ActivationExercise.exerciseId, Exercise.id))
    .where(eq(ActivationExercise.movementPrepId, movementPrepId));

  const activation = activationResults
    .filter(result => result.exercise !== null)
    .map(result => ({
      reps: result.reps,
      time: result.time,
      exercise: result.exercise!
    }));

  // Combine all the results
  return {
    ...movementPrep[0],
    foamRolling,
    mobility,
    activation
  };
}

export async function getWarmupById(warmupId: string): Promise<NestedWarmup | null> {
  // Get the base warmup
  const warmup = await db.select().from(Warmup)
    .where(eq(Warmup.id, warmupId));

  if (!warmup.length) {
    return null;
  }

  // Get dynamic exercises
  const dynamicResults = await db.select({
    reps: DynamicExercise.reps,
    exercise: {
      id: Exercise.id,
      name: Exercise.name,
      muxPlaybackId: Exercise.muxPlaybackId,
      cues: Exercise.cues
    }
  })
    .from(DynamicExercise)
    .leftJoin(Exercise, eq(DynamicExercise.exerciseId, Exercise.id))
    .where(eq(DynamicExercise.warmupId, warmupId));

  const dynamic = dynamicResults
    .filter(result => result.exercise !== null)
    .map(result => ({
      reps: result.reps,
      exercise: result.exercise!
    }));

  // Get ladder exercises
  const ladderResults = await db.select({
    reps: LadderExercise.reps,
    exercise: {
      id: Exercise.id,
      name: Exercise.name,
      muxPlaybackId: Exercise.muxPlaybackId,
      cues: Exercise.cues
    }
  })
    .from(LadderExercise)
    .leftJoin(Exercise, eq(LadderExercise.exerciseId, Exercise.id))
    .where(eq(LadderExercise.warmupId, warmupId));

  const ladder = ladderResults
    .filter(result => result.exercise !== null)
    .map(result => ({
      reps: result.reps,
      exercise: result.exercise!
    }));

  // Get power exercises
  const powerResults = await db.select({
    reps: PowerExercise.reps,
    exercise: {
      id: Exercise.id,
      name: Exercise.name,
      muxPlaybackId: Exercise.muxPlaybackId,
      cues: Exercise.cues
    }
  })
    .from(PowerExercise)
    .leftJoin(Exercise, eq(PowerExercise.exerciseId, Exercise.id))
    .where(eq(PowerExercise.warmupId, warmupId));

  const power = powerResults
    .filter(result => result.exercise !== null)
    .map(result => ({
      reps: result.reps,
      exercise: result.exercise!
    }));

  // Combine all the results
  return {
    ...warmup[0],
    dynamic,
    ladder,
    power
  };
}

export async function getCooldownById(cooldownId: string): Promise<NestedCooldown | null> {
  // Get the base cooldown
  const cooldown = await db.select().from(Cooldown)
    .where(eq(Cooldown.id, cooldownId));

  if (!cooldown.length) {
    return null;
  }

  // Get cooldown exercises
  const exerciseResults = await db.select({
    reps: CooldownExercise.reps,
    time: CooldownExercise.time,
    exercise: {
      id: Exercise.id,
      name: Exercise.name,
      muxPlaybackId: Exercise.muxPlaybackId,
      cues: Exercise.cues
    }
  })
    .from(CooldownExercise)
    .leftJoin(Exercise, eq(CooldownExercise.exerciseId, Exercise.id))
    .where(eq(CooldownExercise.cooldownId, cooldownId));

  const exercises = exerciseResults
    .filter(result => result.exercise !== null)
    .map(result => ({
      reps: result.reps,
      time: result.time,
      exercise: result.exercise!
    }));

  // Combine the results
  return {
    ...cooldown[0],
    exercises
  };
}
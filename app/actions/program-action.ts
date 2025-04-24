"use server";

import { programLogSchema } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { saveUserProgramLog } from "@/models/program.server";
import { verifySession } from "@/app/lib/dal";
import { newProgramLog } from "../lib/sessions";

interface SetData {
  set: string;
  actualReps?: string;
  load?: string;
  notes?: string;
  unit: string;
  exerciseId: string;
  targetReps?: string;
  time?: string;
}

interface BlockData {
  blockId: string;
  blockNumber: string;
  programBlockId: string;
  sets: SetData[];
}

interface ProgramExerciseLogType {
  programBlockId: string;
  exerciseId: string;
  sets: Array<{
    set: string;
    actualReps?: string;
    load?: number;
    notes?: string;
    unit: "bodyweight" | "kilogram" | "pound";
  }>;
}

function parseBlocksData(formData: FormData): BlockData[] {
  const blocks: Record<string, BlockData> = {};

  // Iterate through all form data entries
  for (const [key, value] of formData.entries()) {
    // Skip non-block entries
    if (!key.startsWith('blocks[')) continue;

    // Parse the key to get the path components
    const path = key.match(/([^\[\].]+)/g);
    if (!path) continue;

    // The first component is always 'blocks'
    const blockIndex = path[1];
    const property = path[2];

    // Initialize block if it doesn't exist
    if (!blocks[blockIndex]) {
      blocks[blockIndex] = {
        blockId: '',
        blockNumber: '',
        programBlockId: '',
        sets: []
      };
    }

    // Handle block-level properties
    if (property === 'blockId' || property === 'blockNumber' || property === 'programBlockId') {
      blocks[blockIndex][property] = value as string;
    }
    // Handle set-level properties
    else if (property === 'sets') {
      const setIndex = parseInt(path[3]);
      const setProperty = path[4];

      // Initialize set if it doesn't exist
      if (!blocks[blockIndex].sets[setIndex]) {
        blocks[blockIndex].sets[setIndex] = {
          set: '',
          actualReps: undefined,
          load: undefined,
          notes: undefined,
          unit: '',
          exerciseId: '',
          targetReps: undefined,
          time: undefined
        };
      }

      // Set the property value
      if (setProperty === 'set' || setProperty === 'actualReps' || setProperty === 'load' || 
          setProperty === 'notes' || setProperty === 'unit' || setProperty === 'exerciseId' ||
          setProperty === 'targetReps' || setProperty === 'time') {
        blocks[blockIndex].sets[setIndex][setProperty] = value as string;
      }
    }
  }

  // Convert to array and sort by block number
  return Object.values(blocks).sort((a, b) => parseInt(a.blockNumber) - parseInt(b.blockNumber));
}

export async function createProgramLog(prevState: unknown, formData: FormData) {
  const duration = formData.get("duration");
  if (!duration || typeof duration !== "string") {
    return {
      errors: {
        duration: ["Duration is required"]
      }
    };
  }

  // Parse the blocks data from form data first
  const parsedBlocks = parseBlocksData(formData);

  const validatedFields = programLogSchema.safeParse({
    programId: formData.get("programId") as string,
    programWeek: formData.get("programWeek") as string,
    programDay: formData.get("programDay") as string,
    duration,
    date: formData.get("date") as string,
    blocks: parsedBlocks.map(block => ({
      blockId: block.blockId,
      blockNumber: block.blockNumber,
      programBlockId: block.programBlockId,
      sets: block.sets.map(set => ({
        set: set.set,
        exerciseId: set.exerciseId,
        actualReps: set.actualReps,
        load: set.load,
        unit: set.unit,
        notes: set.notes,
        targetReps: set.targetReps,
        time: set.time,
      }))
    })),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { programId, programWeek, programDay } = validatedFields.data;

  try {
    const { userId } = await verifySession();
    if (!userId) {
      return {
        server_error: "User not authenticated",
      };
    }

    // Transform the blocks data into the format expected by saveUserProgramLog
    const exerciseLogs: ProgramExerciseLogType[] = parsedBlocks.map((block) => {
      // Group sets by exerciseId
      const setsByExercise = block.sets.reduce<Record<string, ProgramExerciseLogType['sets']>>((acc, set) => {
        const exerciseId = set.exerciseId;
        if (!acc[exerciseId]) {
          acc[exerciseId] = [];
        }
        acc[exerciseId].push({
          set: set.set,
          actualReps: set.actualReps,
          load: set.load ? parseFloat(set.load) : undefined,
          notes: set.notes,
          unit: set.unit === "bw" ? "bodyweight" : set.unit === "lb(s)" ? "pound" : "kilogram",
        });
        return acc;
      }, {} as Record<string, ProgramExerciseLogType['sets']>);

      // Create exercise logs for each exercise in the block
      return Object.entries(setsByExercise).map(([exerciseId, sets]) => ({
        programBlockId: block.programBlockId,
        exerciseId,
        sets,
      }));
    }).flat();

    const programLog = await saveUserProgramLog(
      userId as string,
      programId,
      parseInt(programWeek),
      parseInt(programDay),
      duration,
      exerciseLogs
    );

    await newProgramLog({programLogId: programLog.id, workoutName: `Week ${programWeek} Day ${programDay}`});
  } catch (err) {
    console.error("Program log error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
  redirect(`/programs/${programId}`);
}
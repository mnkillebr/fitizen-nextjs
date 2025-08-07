"use server";

import { generateProgramSchema, programLogSchema } from "@/app/lib/definitions";
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

export async function generateProgram(prevState: unknown, formData: FormData) {
  const validatedFields = generateProgramSchema.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { deepSquat, hurdleStep, inlineLunge, shoulderMobility, activeStraightLegRaise, trunkStabilityPushUp, rotaryStability, coachNotes } = validatedFields.data;

  try {
    const { userId } = await verifySession();
    if (!userId) {
      return {
        server_error: "User not authenticated",
      };
    }
    const programFormData = new FormData()
    programFormData.append("deepSquat", deepSquat)
    programFormData.append("hurdleStep", hurdleStep)
    programFormData.append("inlineLunge", inlineLunge)
    programFormData.append("shoulderMobility", shoulderMobility)
    programFormData.append("activeStraightLegRaise", activeStraightLegRaise)
    programFormData.append("trunkStabilityPushUp", trunkStabilityPushUp)
    programFormData.append("rotaryStability", rotaryStability)
    programFormData.append("coachNotes", coachNotes)
    // Generate workout with workout generator crew
    const programResponse = await fetch(`${process.env.API_BASE_URL}/programs/program_flow/excel`, {
      method: "POST",
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      body: programFormData,
    });

    if (!programResponse.ok) {
      const errorData = await programResponse.text();
      console.error("Program generation error:", errorData);
      return {
        server_error: `Failed to generate program: ${errorData || 'Unknown error'}`,
      };
    }

    // Get the Excel file as a blob
    const excelBlob = await programResponse.blob();
    
    // Get filename from response headers
    const contentDisposition = programResponse.headers.get('content-disposition');
    let filename = 'fitness_program.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Convert blob to base64 for transfer
    const arrayBuffer = await excelBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    return {
      success: true,
      filename,
      data: base64,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  } catch (err) {
    console.error("Program generation error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
}
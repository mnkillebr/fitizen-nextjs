"use server";

import { z } from "zod";

const searchExerciseSchema = z.object({
  body: z.string().optional(),
  plane: z.string().optional(),
  pattern: z.string().optional(),
});

export async function searchExercise(prevState: unknown, formData: FormData) {
  const validatedFields = searchExerciseSchema.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { body, plane, pattern } = validatedFields.data;

  try {
    const exerciseFormData = new FormData();
    exerciseFormData.append("body", body as string);
    exerciseFormData.append("plane", plane as string);
    exerciseFormData.append("pattern", pattern as string);
    const exerciseResponse = await fetch(`${process.env.API_BASE_URL}/exercises/search`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
      },
      body: exerciseFormData,
    });


    if (!exerciseResponse.ok) {
      const errorData = await exerciseResponse.json();
      console.error("Exercise search error:", errorData);
      return {
        server_error: `Failed to search exercises: ${errorData.detail || 'Unknown error'}`,
      };
    }

    const exerciseData = await exerciseResponse.json();
    return exerciseData;
  } catch (error) {
    console.error("Exercise search error:", error);
    return {
      server_error: "An unexpected error occurred while searching for exercises.",
    };
  }
}
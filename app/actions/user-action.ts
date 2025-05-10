"use server";

import { updateUserFitnessProfile, updateUserProfile } from "@/models/user.server";
import { getCurrentUser, verifySession } from "../lib/dal";
import { updateFitnessProfileSchema, updateUserProfileSchema } from "../lib/definitions";
import { FitnessProfile } from "@/db/schema";

export async function updateUser(prevState: unknown, formData: FormData) {
  const validatedFields = updateUserProfileSchema.safeParse({
    email: formData.get("email") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, firstName, lastName } = validatedFields.data;

  try {
    const { userId } = await verifySession();

    await updateUserProfile(userId as string, email, firstName, lastName);
    return {
      success: "User updated",
    };
  } catch (err) {
    console.error("Update user error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function fitnessProfileActions(prevState: unknown, formData: FormData) {
  switch (formData.get("_action")) {
    case "generatePARQProgram": {
      const user = await getCurrentUser();
      if (!user) {
        return {
          server_error: "User not found",
        };
      }
      const { firstName, lastName, email } = user;

      const programFormData = new FormData()
      programFormData.append("height", formData.get("userHeight") as string)
      programFormData.append("currentWeight", formData.get("currentWeight") as string)
      programFormData.append("targetWeight", formData.get("targetWeight") as string)
      formData.get("fat-loss") && programFormData.append("goal_fatLoss", "true")
      formData.get("endurance") && programFormData.append("goal_endurance", "true")
      formData.get("build-muscle") && programFormData.append("goal_buildMuscle", "true")
      formData.get("lose-weight") && programFormData.append("goal_loseWeight", "true")
      formData.get("improve-balance") && programFormData.append("goal_improveBalance", "true")
      formData.get("improve-flexibility") && programFormData.append("goal_improveFlexibility", "true")
      formData.get("learn-new-skills") && programFormData.append("goal_learnNewSkills", "true")
      
      // Convert boolean values properly
      const convertToBoolean = (value: string | null) => {
        if (value === null) return "false";
        return value === "true" ? "true" : "false";
      };

      programFormData.append("parq_heartCondition", convertToBoolean(formData.get("heart-condition") as string))
      programFormData.append("parq_chestPainActivity", convertToBoolean(formData.get("chest-pain-activity") as string))
      programFormData.append("parq_chestPainNoActivity", convertToBoolean(formData.get("chest-pain-no-activity") as string))
      programFormData.append("parq_balanceConsciousness", convertToBoolean(formData.get("balance-consciousness") as string))
      programFormData.append("parq_boneJoint", convertToBoolean(formData.get("bone-joint") as string))
      programFormData.append("parq_bloodPressureMeds", convertToBoolean(formData.get("blood-pressure-meds") as string))
      programFormData.append("parq_otherReasons", convertToBoolean(formData.get("other-reasons") as string))
      
      formData.get("occupation") && programFormData.append("operational_occupation", formData.get("occupation") as string)
      programFormData.append("operational_extendedSitting", convertToBoolean(formData.get("extended-sitting") as string))
      programFormData.append("operational_repetitiveMovements", convertToBoolean(formData.get("repetitive-movements") as string))
      formData.get("explanation_repetitive-movements") && programFormData.append("operational_explanation_repetitiveMovements", formData.get("explanation_repetitive-movements") as string)
      programFormData.append("operational_heelShoes", convertToBoolean(formData.get("heel-shoes") as string))
      programFormData.append("operational_mentalStress", convertToBoolean(formData.get("mental-stress") as string))
      programFormData.append("recreational_physicalActivities", convertToBoolean(formData.get("physical-activities") as string))
      formData.get("explanation_physical-activities") && programFormData.append("recreational_explanation_physicalActivities", formData.get("explanation_physical-activities") as string)
      programFormData.append("recreational_hobbies", convertToBoolean(formData.get("hobbies") as string))
      formData.get("explanation_hobbies") && programFormData.append("recreational_explanation_hobbies", formData.get("explanation_hobbies") as string)
      programFormData.append("medical_injuriesPain", convertToBoolean(formData.get("injuries-pain") as string))
      formData.get("explanation_injuries-pain") && programFormData.append("medical_explanation_injuriesPain", formData.get("explanation_injuries-pain") as string)
      programFormData.append("medical_surgeries", convertToBoolean(formData.get("surgeries") as string))
      formData.get("explanation_surgeries") && programFormData.append("medical_explanation_surgeries", formData.get("explanation_surgeries") as string)
      programFormData.append("medical_chronicDisease", convertToBoolean(formData.get("chronic-disease") as string))
      formData.get("explanation_chronic-disease") && programFormData.append("medical_explanation_chronicDisease", formData.get("explanation_chronic-disease") as string)
      programFormData.append("medical_medications", convertToBoolean(formData.get("medications") as string))
      formData.get("explanation_medications") && programFormData.append("medical_explanation_medications", formData.get("explanation_medications") as string)
      
      const clientParams = new URLSearchParams();
      clientParams.set("name", `${firstName} ${lastName}`);
      clientParams.set("age", "69");
      clientParams.set("email", email);
      
      try {
        const programResponse = await fetch(`${process.env.API_BASE_URL}/programs/parq_program?${clientParams.toString()}`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
          },
          body: programFormData,
        });

        if (!programResponse.ok) {
          const errorData = await programResponse.json();
          console.error("Program generation error:", errorData);
          return {
            server_error: `Failed to generate program: ${errorData.detail || 'Unknown error'}`,
          };
        }

        const programData = await programResponse.json();
        return programData;
      } catch (error) {
        console.error("Program generation error:", error);
        return {
          server_error: "An unexpected error occurred while generating the program.",
        };
      }
    }
    case "updateFitnessProfile": {
      const validatedFields = updateFitnessProfileSchema.safeParse(Object.fromEntries(formData));

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
        };
      }
      const fitnessProfileObj = {
        heightUnit: validatedFields.data.heightUnit === "in" ? "inches" : "centimeters",
        height: validatedFields.data.userHeight ? parseInt(validatedFields.data.userHeight) : null,
        unit: validatedFields.data.unit === "lbs" ? "pound" : "kilogram",
        currentWeight: validatedFields.data.currentWeight ? parseInt(validatedFields.data.currentWeight) : null,
        targetWeight: validatedFields.data.targetWeight ? parseInt(validatedFields.data.targetWeight) : null,
        goal_fatLoss: validatedFields.data["fat-loss"] && validatedFields.data["fat-loss"] === "on" ? true : null,
        goal_endurance: validatedFields.data.endurance && validatedFields.data["endurance"] === "on" ? true : null,
        goal_buildMuscle: validatedFields.data["build-muscle"] && validatedFields.data["build-muscle"] === "on" ? true : null,
        goal_loseWeight: validatedFields.data["lose-weight"] && validatedFields.data["lose-weight"] === "on" ? true : null,
        goal_improveBalance: validatedFields.data["improve-balance"] && validatedFields.data["improve-balance"] === "on" ? true : null,
        goal_improveFlexibility: validatedFields.data["improve-flexibility"] && validatedFields.data["improve-flexibility"] === "on" ? true : null,
        goal_learnNewSkills: validatedFields.data["learn-new-skills"] && validatedFields.data["learn-new-skills"] === "on" ? true : null,
        parq_heartCondition: validatedFields.data["heart-condition"] && validatedFields.data["heart-condition"] === "true" ? true : validatedFields.data["heart-condition"] && validatedFields.data["heart-condition"] === "false" ? false : null,
        parq_chestPainActivity: validatedFields.data["chest-pain-activity"] && validatedFields.data["chest-pain-activity"] === "true" ? true : validatedFields.data["chest-pain-activity"] && validatedFields.data["chest-pain-activity"] === "false" ? false : null,
        parq_chestPainNoActivity: validatedFields.data["chest-pain-no-activity"] && validatedFields.data["chest-pain-no-activity"] === "true" ? true : validatedFields.data["chest-pain-no-activity"] && validatedFields.data["chest-pain-no-activity"] === "false" ? false : null,
        parq_balanceConsciousness: validatedFields.data["balance-consciousness"] && validatedFields.data["balance-consciousness"] === "true" ? true : validatedFields.data["balance-consciousness"] && validatedFields.data["balance-consciousness"] === "false" ? false : null,
        parq_boneJoint: validatedFields.data["bone-joint"] && validatedFields.data["bone-joint"] === "true" ? true : validatedFields.data["bone-joint"] && validatedFields.data["bone-joint"] === "false" ? false : null,
        parq_bloodPressureMeds: validatedFields.data["blood-pressure-meds"] && validatedFields.data["blood-pressure-meds"] === "true" ? true : validatedFields.data["blood-pressure-meds"] && validatedFields.data["blood-pressure-meds"] === "false" ? false : null,
        parq_otherReasons: validatedFields.data["other-reasons"] && validatedFields.data["other-reasons"] === "true" ? true : validatedFields.data["other-reasons"] && validatedFields.data["other-reasons"] === "false" ? false : null,
        operational_occupation: validatedFields.data.occupation ?? null,
        operational_extendedSitting: validatedFields.data["extended-sitting"] && validatedFields.data["extended-sitting"] === "true" ? true : validatedFields.data["extended-sitting"] && validatedFields.data["extended-sitting"] === "false" ? false : null,
        operational_repetitiveMovements: validatedFields.data["repetitive-movements"] && validatedFields.data["repetitive-movements"] === "true" ? true : validatedFields.data["repetitive-movements"] && validatedFields.data["repetitive-movements"] === "false" ? false : null,
        operational_explanation_repetitiveMovements: validatedFields.data["explanation_repetitive-movements"] ?? null,
        operational_heelShoes: validatedFields.data["heel-shoes"] && validatedFields.data["heel-shoes"] === "true" ? true : validatedFields.data["heel-shoes"] && validatedFields.data["heel-shoes"] === "false" ? false : null,
        operational_mentalStress: validatedFields.data["mental-stress"] && validatedFields.data["mental-stress"] === "true" ? true : validatedFields.data["mental-stress"] && validatedFields.data["mental-stress"] === "false" ? false : null,
        recreational_physicalActivities: validatedFields.data["physical-activities"] && validatedFields.data["physical-activities"] === "true" ? true : validatedFields.data["physical-activities"] && validatedFields.data["physical-activities"] === "false" ? false : null,
        recreational_explanation_physicalActivities: validatedFields.data["explanation_physical-activities"] ?? null,
        recreational_hobbies: validatedFields.data.hobbies && validatedFields.data.hobbies === "true" ? true : validatedFields.data.hobbies && validatedFields.data.hobbies === "false" ? false : null,
        recreational_explanation_hobbies: validatedFields.data.explanation_hobbies ?? null,
        medical_injuriesPain: validatedFields.data["injuries-pain"] && validatedFields.data["injuries-pain"] === "true" ? true : validatedFields.data["injuries-pain"] && validatedFields.data["injuries-pain"] === "false" ? false : null,
        medical_explanation_injuriesPain: validatedFields.data["explanation_injuries-pain"] ?? null,
        medical_surgeries: validatedFields.data.surgeries && validatedFields.data.surgeries === "true" ? true : validatedFields.data.surgeries && validatedFields.data.surgeries === "false" ? false : null,
        medical_explanation_surgeries: validatedFields.data.explanation_surgeries ?? null,
        medical_chronicDisease: validatedFields.data["chronic-disease"] && validatedFields.data["chronic-disease"] === "true" ? true : validatedFields.data["chronic-disease"] && validatedFields.data["chronic-disease"] === "false" ? false : null,
        medical_explanation_chronicDisease: validatedFields.data["explanation_chronic-disease"] ?? null,
        medical_medications: validatedFields.data.medications && validatedFields.data.medications === "true" ? true : validatedFields.data.medications && validatedFields.data.medications === "false" ? false : null,
        medical_explanation_medications: validatedFields.data.explanation_medications ?? null,
      }
      try {
        const { userId } = await verifySession();
        await updateUserFitnessProfile(userId as string, fitnessProfileObj as Partial<typeof FitnessProfile.$inferInsert>);
        return {
          success: "Fitness profile updated",
        };
      } catch (err) {
        console.error("Update user fitness profile error:", err);
        return {
          server_error: "An unexpected error occurred. Please try again later.",
        };
      }
    }
    default: {
      return {
        server_error: "Invalid action",
      };
    }
  }
}


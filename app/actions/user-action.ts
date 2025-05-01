"use server";

import { updateUserFitnessProfile, updateUserProfile } from "@/models/user.server";
import { verifySession } from "../lib/dal";
import { updateFitnessProfileSchema, updateUserProfileSchema } from "../lib/definitions";

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

export async function updateFitnessProfile(prevState: unknown, formData: FormData) {
  const validatedFields = updateFitnessProfileSchema.safeParse(Object.fromEntries(formData));

  console.log("validatedFields", validatedFields);

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
    console.log("fitnessProfileObj", fitnessProfileObj);
    await updateUserFitnessProfile(userId as string, fitnessProfileObj);
  } catch (err) {
    console.error("Update user fitness profile error:", err);
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
}


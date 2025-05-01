import db from "@/db";
import { User, Role, SocialLogin, FitnessProfile } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export function getUserByEmail(email: string) {
  return db.select().from(User).where(eq(User.email, email));
};

export function getUserById(id: string) {
  return db.select().from(User).where(eq(User.id, id));
};

export function getUserByProvider(email: string, providerUserId: string) {
  return db.select()
    .from(User)
    .innerJoin(SocialLogin, eq(User.id, SocialLogin.userId))
    .where(and(eq(User.email, email), eq(SocialLogin.providerUserId, providerUserId)));
}

export function createUser(email: string, firstName: string, lastName: string) {
  return db.insert(User).values({
    id: nanoid(),
    email,
    firstName,
    lastName,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
};

export async function createUserWithProvider(
  email: string,
  firstName: string,
  lastName: string,
  provider: string,
  providerUserId: string
) {
  // Create the user
  const newUserData = await createUser(email, firstName, lastName);
  const newUser = newUserData[0];
  const newUserId = newUser.id;
  // Create the social login
  const newSocialLogin = await db.insert(SocialLogin).values({
    id: nanoid(),
    userId: newUserId,
    provider,
    providerUserId,
  });
  // Return the created user and social login
  return { user: newUser, socialLogin: newSocialLogin };
}

export function updateUserProfile(userId: string, email: string, firstName: string, lastName: string) {
  return db.update(User).set({
    email,
    firstName,
    lastName,
    updatedAt: new Date(),
  }).where(eq(User.id, userId));
}

export async function getUserFitnessProfile(userId: string) {
  const fitnessProfile = await db.select().from(FitnessProfile).where(eq(FitnessProfile.userId, userId));
  return fitnessProfile[0];
}

export async function updateUserFitnessProfile(userId: string, fitnessProfile: Partial<typeof FitnessProfile.$inferInsert>) {
  return db.insert(FitnessProfile)
    .values({
      id: nanoid(),
      userId,
      ...fitnessProfile,
    })
    .onConflictDoUpdate({
      target: FitnessProfile.userId,
      set: {
        ...fitnessProfile,
      },
    })
    .returning({
      heightUnit: FitnessProfile.heightUnit,
      height: FitnessProfile.height,
      unit: FitnessProfile.unit,
      currentWeight: FitnessProfile.currentWeight,
      targetWeight: FitnessProfile.targetWeight,
      goal_fatLoss: FitnessProfile.goal_fatLoss,
      goal_endurance: FitnessProfile.goal_endurance,
      goal_buildMuscle: FitnessProfile.goal_buildMuscle,
      goal_loseWeight: FitnessProfile.goal_loseWeight,
      goal_improveBalance: FitnessProfile.goal_improveBalance,
      goal_improveFlexibility: FitnessProfile.goal_improveFlexibility,
      goal_learnNewSkills: FitnessProfile.goal_learnNewSkills,
      parq_heartCondition: FitnessProfile.parq_heartCondition,
      parq_chestPainActivity: FitnessProfile.parq_chestPainActivity,
      parq_chestPainNoActivity: FitnessProfile.parq_chestPainNoActivity,
      parq_balanceConsciousness: FitnessProfile.parq_balanceConsciousness,
      parq_boneJoint: FitnessProfile.parq_boneJoint,
      parq_bloodPressureMeds: FitnessProfile.parq_bloodPressureMeds,
      parq_otherReasons: FitnessProfile.parq_otherReasons,
      operational_occupation: FitnessProfile.operational_occupation,
      operational_extendedSitting: FitnessProfile.operational_extendedSitting,
      operational_repetitiveMovements: FitnessProfile.operational_repetitiveMovements,
      operational_explanation_repetitiveMovements: FitnessProfile.operational_explanation_repetitiveMovements,
      operational_heelShoes: FitnessProfile.operational_heelShoes,
      operational_mentalStress: FitnessProfile.operational_mentalStress,
      recreational_physicalActivities: FitnessProfile.recreational_physicalActivities,
      recreational_explanation_physicalActivities: FitnessProfile.recreational_explanation_physicalActivities,
      recreational_hobbies: FitnessProfile.recreational_hobbies,
      recreational_explanation_hobbies: FitnessProfile.recreational_explanation_hobbies,
      medical_injuriesPain: FitnessProfile.medical_injuriesPain,
      medical_explanation_injuriesPain: FitnessProfile.medical_explanation_injuriesPain,
      medical_surgeries: FitnessProfile.medical_surgeries,
      medical_explanation_surgeries: FitnessProfile.medical_explanation_surgeries,
      medical_chronicDisease: FitnessProfile.medical_chronicDisease,
      medical_explanation_chronicDisease: FitnessProfile.medical_explanation_chronicDisease,
      medical_medications: FitnessProfile.medical_medications,
      medical_explanation_medications: FitnessProfile.medical_explanation_medications,
    });
}
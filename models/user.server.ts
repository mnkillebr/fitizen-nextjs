import db from "@/db";
import { User, Role, SocialLogin } from "@/db/schema";
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

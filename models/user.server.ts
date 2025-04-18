import db from "@/db";
import { User, Role } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export function getUserByEmail(email: string) {
  return db.select().from(User).where(eq(User.email, email));
};

export function getUserById(id: string) {
  return db.select().from(User).where(eq(User.id, id));
};

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

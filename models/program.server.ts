import db from "@/db";
import { Program } from "@/db/schema";
import { eq, desc, ilike } from "drizzle-orm";

export function getProgramById(id: string) {
  return db.select().from(Program).where(eq(Program.id, id));
};

export function getAllPrograms(query: string) {
  return db.select().from(Program)
    .where(ilike(Program.name, `%${query}%`))
    .orderBy(desc(Program.name));
};

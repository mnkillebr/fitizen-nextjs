import { getAllPrograms } from "@/models/program.server";

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = (await searchParams).q as string;
  const programs = await getAllPrograms(query ?? "");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Programs</h1>
        <p className="text-muted-foreground">
          Welcome to your programs
        </p>
      </div>
    </div>
  );
}
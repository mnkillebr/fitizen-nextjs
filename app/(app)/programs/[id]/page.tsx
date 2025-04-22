import { getProgramById } from "@/models/program.server";

export default async function ProgramIdPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const program = await getProgramById(id);
  return (
    <div>
      <h1>ProgramIdPage {id}</h1>
      <pre>{JSON.stringify(program, null, 2)}</pre>
    </div>
  );
}
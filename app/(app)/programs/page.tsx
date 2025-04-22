import { getAllPrograms } from "@/models/program.server";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageCard } from "@/components/ImageCard";
import Link from "next/link";

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = (await searchParams).q as string;
  const programs = await getAllPrograms(query ?? "");
  // console.log(programs);
  // Mock data for demonstration
  // const mockPrograms = Array.from({ length: 20 }, (_, i) => ({
  //   id: i + 1,
  //   title: `Program ${i + 1}`,
  //   description: `Description for program ${i + 1}`,
  //   imageUrl: "https://res.cloudinary.com/dqrk3drua/image/upload/v1724263117/cld-sample-3.jpg"
  // }));

  return (
    <div className="@container">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 snap-y snap-mandatory">
          {programs.map((program) => (
            <div key={program.id} className="snap-start">
              <Link href={`/programs/${program.id}`}>
                <ImageCard
                  title={program.name}
                  // description={program.description ?? ""}
                  imageUrl={program.s3ImageKey ?? ""}
                />
              </Link>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
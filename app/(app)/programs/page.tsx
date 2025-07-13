import { getAllPrograms } from "@/models/program.server";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageCard } from "@/components/ImageCard";
import { ProgramCardLink } from "./ProgramCardLink";

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = (await searchParams).q as string;
  const country = (await searchParams).country as string;
  const programs = await getAllPrograms(query ?? "");
  const testFlow = await fetch(`${process.env.API_BASE_URL}/programs/test_flow${country ? `?country=${country}` : ""}`);
  const testFlowData = await testFlow.json();
  console.log(testFlowData);
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
              <ProgramCardLink program={program} />
            </div>
          ))}
          <ImageCard
            title="Pre/Post Natal Program"
            description="Difficulty Level: Beginner"
            imageUrl="https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/v1/fitizen/s2j4mlhnvppquh8j9jk9"
            comingSoon={true}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
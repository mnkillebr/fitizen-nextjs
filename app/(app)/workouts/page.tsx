import { getAllWorkouts } from "@/models/workout.server";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkoutCardLink } from "./WorkoutCardLink";

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = (await searchParams).q as string;
  const workouts = await getAllWorkouts(query ?? "");

  return (
    <div className="@container">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 snap-y snap-mandatory">
          {workouts.map((workout) => (
            <div key={workout.id} className="snap-start">
              <WorkoutCardLink workout={workout} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
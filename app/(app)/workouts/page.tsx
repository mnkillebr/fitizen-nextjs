import { getAllWorkouts } from "@/models/workout.server";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkoutCardLink } from "./WorkoutCardLink";
import Link from "next/link";
import clsx from "clsx";
import { Sparkles } from "lucide-react";

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = (await searchParams).q as string;
  const workouts = await getAllWorkouts(query ?? "");

  return (
    <div className="@container">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Link
            href="/workouts/create"
            className={clsx(
              "w-full sm:w-1/2 xl:w-1/3 md:active:scale-95 md:px-3 font-medium",
              "text-black bg-primary hover:bg-yellow-300 rounded-md text-center py-2",
            )}
            // onClick={() => setOpenPanel(!openPanel)}
          >
            Create Workout
          </Link>
          <Link
            href="/workouts/generate"
            className={clsx(
              "w-full sm:w-1/2 xl:w-1/3 md:active:scale-95 md:px-3 font-medium flex items-center justify-center gap-2",
              "text-black bg-primary hover:bg-yellow-300 rounded-md text-center py-2",
            )}
            // onClick={() => setOpenPanel(!openPanel)}
          >
            <Sparkles className="size-5" />
            Generate Workout
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-7.5rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 snap-y snap-mandatory">
            {workouts.map((workout) => (
              <div key={workout.id} className="snap-start">
                <WorkoutCardLink workout={workout} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
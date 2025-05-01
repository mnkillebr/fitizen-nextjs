import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, ChevronLeft, ContextMenuIcon, PencilIcon, PlayIcon, TrashIcon, FireIcon, BarsIcon, ClockIcon } from "@/assets/icons";
import { cookies } from "next/headers";
import { WorkoutCompletedDialog } from "@/components/WorkoutCompletedDialog";
import { getWorkoutById, getWorkoutLogsByRoutineId } from "@/models/workout.server";
import { ExercisesPanel } from "@/components/ExercisesPanel";
import { RoutineExercise } from "@/db/schema";
import { generateMuxThumbnailToken, generateMuxVideoToken } from "@/app/lib/mux-tokens.server";
import { verifySession } from "@/app/lib/dal";

interface ExerciseDetailsType {
  id: string;
  name: string;
  description: string | null;
  isFree: boolean;
  cues: string[];
  tips: string[];
  youtubeLink: string | null;
  s3ImageKey: string | null;
  s3VideoKey: string | null;
  videoToken: string | undefined;
  thumbnail: string | undefined;
}

export function exerciseDetailsMap(routineExercises: Array<typeof RoutineExercise.$inferSelect> | undefined, exerciseDetails: Array<ExerciseDetailsType>) {
  if (routineExercises) {
    const detailedExercises = routineExercises.map((item) => {
      const itemId = item.exerciseId
      const exerciseDetail = exerciseDetails.find(detail => detail.id === itemId)
      return {
        ...item,
        ...exerciseDetail,
        circuitId: item.circuitId ? item.circuitId : ""
      }
    })
    const nonGrouped = detailedExercises.filter(ex => !ex.circuitId)
    const grouped = detailedExercises.filter(ex => ex.circuitId).reduce((result: any, curr: any) => {
      let resultArr = result
      if (resultArr.length && resultArr.find((item: any) => item.circuitId === curr.circuitId)) {
        resultArr = resultArr.map((item: any) => {
          if (item.circuitId === curr.circuitId) {
            return {
              ...item,
              exercises: [...item.exercises, curr].sort((a, b) => a.orderInRoutine - b.orderInRoutine)
            }
          } else {
            return item
          }
        })
        return resultArr
      } else {
        return resultArr.concat({
          circuitId: curr.circuitId,
          orderInRoutine: curr.orderInRoutine,
          sets: curr.sets,
          rest: curr.rest,
          exercises: [curr]
        })
      }
    }, [])
    const detailMappedExercises = [...nonGrouped, ...grouped].sort((a, b) => a.orderInRoutine - b.orderInRoutine)
    return detailMappedExercises
  } else {
    return []
  }
}

export default async function WorkoutIdPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const workout = await getWorkoutById(id);
  const { userId } = await verifySession();
  const workoutLogs = await getWorkoutLogsByRoutineId(id);
  const cookieStore = await cookies()
  const newWorkoutLog = JSON.parse(cookieStore.get('fitizen__new_workout_log')?.value || '{}')


  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`
  }

  if (!workout) {
    return <div>Workout not found</div>;
  }

  const tokenMappedExercises = workout?.exercises.map(ex_item => {
    const smartCrop = () => {
      let crop = ["Lateral Lunge", "Band Assisted Leg Lowering", "Ankle Mobility", "Kettlebell Swing", "Half Kneel Kettlebell Press"]
      if (crop.includes(ex_item.exercise.name)) {
        return "smartcrop"
      } else {
        return undefined
      }
    }
    const heightAdjust = () => {
      let adjustments = ["Pushup", "Kettlebell Swing", "Kettlebell Renegade Row", "Half Kneel Kettlebell Press"]
      let expand = ["Lateral Bound", "Mini Band Walks"]
      if (adjustments.includes(ex_item.exercise.name)) {
        return "481"
      } else if (expand.includes(ex_item.exercise.name)) {
        return "1369"
      } else {
        return undefined
      }
    }
    const thumbnailToken = generateMuxThumbnailToken(ex_item.exercise.muxPlaybackId, smartCrop(), heightAdjust())
    const videoToken = generateMuxVideoToken(ex_item.exercise.muxPlaybackId)
    return {
      ...ex_item,
      ...ex_item.exercise,
      videoToken,
      thumbnail: thumbnailToken ? `https://image.mux.com/${ex_item.exercise.muxPlaybackId}/thumbnail.png?token=${thumbnailToken}` : undefined,
    }
  }) ?? []
  const exerciseDetails = exerciseDetailsMap(workout.exercises, tokenMappedExercises)

  return (
    <div className="@container">
      {newWorkoutLog?.workoutLogId && <WorkoutCompletedDialog workoutName={workout.name} />}
      <div className="flex justify-between mb-2">
        <Link
          href="/workouts"
          className={clsx(
            "flex items-center text-primary-foreground bg-primary text-sm",
            "py-2 pl-2 pr-3 rounded-md hover:bg-primary/90 shadow",
          )}
        >
          <ChevronLeft className="h-4 w-4 text-black" />
          <div className="text-black">Back</div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <Tooltip delayDuration={300}>
              <TooltipTrigger> */}
                <Button variant="outline" size="icon" className="hover:text-primary">
                  <ContextMenuIcon />
                </Button>
              {/* </TooltipTrigger>
              <TooltipContent>
                Workout Menu
              </TooltipContent>
            </Tooltip> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CalendarIcon className="h-4" />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PencilIcon className="h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TrashIcon className="h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* TOP SECTION */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Mobile/Tablet View */}
        <div className="lg:hidden relative h-72 rounded-lg overflow-hidden shadow dark:shadow-border-muted group">
          <Image
            src={workout.s3ImageKey ?? "https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/v1/fitizen/tfvpajxu5dj9s5xcac7t"}
            alt={workout.name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-50"
            style={{ objectPosition: 'top center' }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
            <h1 className="text-3xl font-bold text-white text-shadow-lg group-hover:hidden" style={{ textShadow: `2px 2px 2px #424242` }}>{workout.name}</h1>
            <p className="text-white p-4 hidden group-hover:block" style={{ textShadow: `2px 2px 2px #424242` }}>{workout.description?.length ? workout.description : "No description"}</p>
          </div>
          <div className={clsx(
            "flex justify-around mb-6 *:font-semibold *:flex *:flex-col *:leading-5",
            "text-lg text-white *:drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)] *:items-center",
            "absolute bottom-0 left-0 right-0 group-hover:hidden"
          )}>
            <div>
              <ClockIcon />
              <div>40</div>
              <div>min</div>
            </div>
            <div>
              <FireIcon />
              <div>200</div>
              <div>kcal</div>
            </div>
            <div>
              <BarsIcon />
              <div>6</div>
              <div>level</div>
            </div>
          </div>
        </div>
        <Link
          href={`/workouts/${workout.id}/log`}
          className={clsx(
            "flex lg:hidden h-12 items-center justify-between shadow active:scale-95 rounded-full bg-slate-50",
            "hover:cursor-pointer dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted",
          )}
        >
          <div className="size-12 invisible"></div>
          <div className="select-none font-semibold self-center">Start Workout</div>
          <div className="bg-primary rounded-full p-3 text-black"><PlayIcon /></div>
        </Link>

        {/* Desktop View */}
        <div className="hidden lg:flex lg:flex-1 gap-4">
          <div className="flex-1 relative h-[340px] rounded-lg overflow-hidden shadow dark:shadow-border-muted">
            <Image
              src={workout.s3ImageKey ?? "https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/v1/fitizen/tfvpajxu5dj9s5xcac7t"}
              alt={workout.name}
              fill
              className="object-cover"
              style={{ objectPosition: 'top center' }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <h1 className="text-3xl font-bold text-white text-shadow-lg">{workout.name}</h1>
            </div>
            <div className={clsx(
              "flex justify-around mb-6 *:font-semibold *:flex *:flex-col *:leading-5",
              "text-lg text-white *:drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)] *:items-center",
              "absolute bottom-0 left-0 right-0"
            )}>
              <div>
                <ClockIcon />
                <div>40</div>
                <div>min</div>
              </div>
              <div>
                <FireIcon />
                <div>200</div>
                <div>kcal</div>
              </div>
              <div>
                <BarsIcon />
                <div>6</div>
                <div>level</div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className={clsx(
              "flex-[2] bg-background-muted rounded-lg p-6 shadow",
              "dark:bg-background-muted border dark:border-border-muted dark:shadow-border-muted",
            )}>
              <p className="text-foreground">{workout.description}</p>
            </div>
            <Link href={`/workouts/${workout.id}/log`} className="flex-1">
              <div className={clsx(
                "w-full h-full bg-background text-foreground rounded-lg hover:bg-background-muted transition-colors",
                "dark:bg-background-muted shadow border dark:border-border-muted dark:shadow-border-muted",
                "flex items-center justify-center bg-slate-50",
              )}>
                <div className="select-none font-semibold self-center mr-4">Start Workout</div>
                <div className="bg-primary rounded-full p-3 text-black"><PlayIcon /></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* BOTTOM SECTION */}
      <div className="flex-1">
        <Tabs defaultValue="exercises" className="w-full lg:hidden">
          <TabsList>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="exercises">
            <div
              className={clsx(
                "h-[calc(100vh-32.5rem)] bg-slate-50 rounded-md shadow-md",
                "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted p-2"
              )}
            >
              <div className="px-1 text-sm/6 font-semibold">Exercises</div>
              <div className="mt-2 max-h-[calc(100%-2.125rem)] overflow-y-auto">
                <ExercisesPanel exerciseDetailsArray={exerciseDetails} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div
              className={clsx(
                "h-[calc(100vh-32.5rem)] bg-slate-50 rounded-md shadow-md",
                "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted p-2"
              )}
            >
              <div className="px-1 text-sm/6 font-semibold">History</div>
              <div className="mt-2 h-full">
                <div className="flex flex-col gap-y-2 content-center max-h-[calc(100%-2.125rem)] snap-y snap-mandatory overflow-y-auto px-1 pb-1">
                  {workoutLogs.length ? workoutLogs.map(log => {
                    return (
                      <div key={log.id} className="flex flex-col shadow-md dark:shadow-sm dark:shadow-border-muted rounded-md *:content-center bg-white snap-start dark:bg-background">
                        <div className="bg-slate-400 dark:bg-zinc-700 w-full rounded-t-md flex justify-between px-3 py-1 *:text-white *:w-24">
                          <label className="text-sm font-medium">Date</label>
                          <label className="text-sm font-medium">Duration</label>
                          <label className="text-sm font-medium invisible">View</label>
                        </div>
                        <div className="w-full rounded-b-md flex justify-between px-3 py-1 *:w-24">
                          <p className="text-sm h-5">{new Date(log.date).toLocaleDateString()}</p>
                          <p className="text-sm h-5">{formatDuration(parseInt(log.duration))}</p>
                          <Link
                            href={`/workouts/${workout.id}/logview?id=${log.id}`}
                            className="text-sm h-5 underline text-primary hover:text-yellow-500"
                          >
                            View Log
                          </Link>
                        </div>
                      </div>
                    )
                  }) : <div className="text-sm place-self-center mt-4 text-muted-foreground">No workout logs</div>}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="hidden lg:flex gap-4">
          <div
            className={clsx(
              "flex-1 h-[calc(100vh-30.5rem)] bg-slate-50 rounded-lg shadow-md",
              "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted p-2"
            )}
          >
            <div className="px-1 text-sm/6 font-semibold">Exercises</div>
            <div className="mt-2 max-h-[calc(100%-2.125rem)] overflow-y-auto">
              <ExercisesPanel exerciseDetailsArray={exerciseDetails} />
            </div>
          </div>
          <div
            className={clsx(
              "flex-1 h-[calc(100vh-30.5rem)] bg-slate-50 rounded-lg shadow-md",
              "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted p-2"
            )}
          >
            <div className="px-1 text-sm/6 font-semibold">History</div>
            <div className="mt-2 h-full">
              <div className="flex flex-col gap-y-2 content-center max-h-[calc(100%-2.125rem)] snap-y snap-mandatory overflow-y-auto px-1 pb-1">
                {workoutLogs.length ? workoutLogs.map(log => {
                  return (
                    <div key={log.id} className="flex flex-col shadow-md dark:shadow-sm dark:shadow-border-muted rounded-md *:content-center bg-white dark:bg-background snap-start">
                      <div className="bg-slate-400 dark:bg-zinc-700 w-full rounded-t-md flex justify-between px-3 py-1 *:text-white *:w-24">
                        <label className="text-sm font-medium">Date</label>
                        <label className="text-sm font-medium">Duration</label>
                        <label className="text-sm font-medium invisible">View</label>
                      </div>
                      <div className="w-full rounded-b-md flex justify-between px-3 py-1 *:w-24">
                        <p className="text-sm h-5">{new Date(log.date).toLocaleDateString()}</p>
                        <p className="text-sm h-5">{formatDuration(parseInt(log.duration))}</p>
                        <Link
                          href={`/workouts/${workout.id}/logview?id=${log.id}`}
                          className="text-sm h-5 underline text-primary hover:text-yellow-500"
                        >
                          View Log
                        </Link>
                      </div>
                    </div>
                  )
                }) : <div className="text-sm place-self-center mt-4 text-muted-foreground">No workout logs</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
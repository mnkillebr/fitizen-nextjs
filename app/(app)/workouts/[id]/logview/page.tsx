import { verifySession } from "@/app/lib/dal";
import { getUserWorkoutLog } from "@/models/workout.server";
import clsx from "clsx";
import Link from "next/link";
import { ChevronLeft } from "@/assets/icons";
import CurrentDate from "@/components/CurrentDate";
import { redirect } from "next/navigation";
import { PastCircuitLog, PastExerciseLog } from "../log/log-types";

export default async function WorkoutLogViewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const workoutLogId = (await searchParams).id as string;
  const { userId } = await verifySession();
  const workoutLog = await getUserWorkoutLog(userId as string, workoutLogId);

  if (!workoutLog) {
    return <div>Workout Log not found</div>;
  }
  if (workoutLog.userId !== userId) {
    redirect("/dashboard")
  }

  const nameMappedWorkoutLog = {
    ...workoutLog,
    exerciseLogs: workoutLog.exerciseLogs.map(log => ({
      ...log,
      exerciseName: log.exercise.name,
    })).reduce((result: any, curr: any) => {
      let resultArr = result
      if (resultArr.length && resultArr.find((item: any) => item.circuitId === curr.circuitId && curr.circuitId !== null)) {
        resultArr = resultArr.map((res_item: any) => {
          if (res_item.circuitId === curr.circuitId) {
            if (res_item.sets.length) {
              return {
                ...res_item,
                sets: [
                  ...res_item.sets,
                  ...curr.sets.map((set: any) => ({
                    ...set,
                    target: curr.target,
                    targetReps: curr.targetReps,
                    time: curr.time,
                    name: curr.exerciseName,
                    orderInRoutine: curr.orderInRoutine,
                  })),
                ].sort((a, b) => a.set - b.set)
              }
            } else {
              return {
                ...curr,
                sets: [
                  ...curr.sets.map((set: any) => ({
                    ...set,
                    target: curr.target,
                    targetReps: curr.targetReps,
                    time: curr.time,
                    notes: curr.notes,
                    name: curr.exerciseName,
                    orderInRoutine: curr.orderInRoutine,
                  })),
                ]
              }
            }
          } else {
            return res_item
          }
        })
        return resultArr
      } else {
        if (curr.circuitId && curr.circuitId !== null) {
          return resultArr.concat(
            {
              ...curr,
              sets: [
                ...curr.sets.map((set: any) => ({
                  ...set,
                  target: curr.target,
                  targetReps: curr.targetReps,
                  time: curr.time,
                  name: curr.exerciseName,
                  orderInRoutine: curr.orderInRoutine,
                })),
              ]
            }
          )
        } else {
          return resultArr.concat(curr)
        }
      }
    }, [])
  }

  return (
    <div className="@container">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link
            href={`/workouts/${workoutLog.routineId}`}
            className={clsx(
              "flex items-center text-primary-foreground bg-primary text-sm",
              "py-2 pl-2 pr-3 rounded-md hover:bg-primary/90 shadow",
            )}
          >
            <ChevronLeft className="h-4 w-4 text-black" />
            <div className="text-black">Back</div>
          </Link>
          <div className="flex-none font-semibold">Workout Log</div>
        </div>
        <div className="*:text-sm"><CurrentDate incomingDate={workoutLog.date.toISOString()} /></div>
      </div>
      <div className="font-semibold text-lg py-4">Logged Exercises</div>
      <div
        className={clsx(
          "overflow-y-auto flex flex-col gap-y-3 bg-background-muted",
          "rounded-md shadow-md py-4 px-3",
          "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
        )}
      >
        {nameMappedWorkoutLog.exerciseLogs.map((exercise: any, index: number) => {
          if (exercise.circuitId) {
            return <PastCircuitLog key={`${exercise.circuitId}-${index}`} exercise={exercise} index={index} logs={nameMappedWorkoutLog.exerciseLogs} />
          } else {
            return <PastExerciseLog key={`${exercise.id}-${index}`} exercise={exercise} index={index} logs={nameMappedWorkoutLog.exerciseLogs} />
          }
        })}
      </div>
    </div>
  )
}
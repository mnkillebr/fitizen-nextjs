"use client";

import { useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import clsx from "clsx";
import Stopwatch from "@/components/Stopwatch";
import { createWorkoutLog } from "@/app/actions/workout-action";
import { CircuitLog, ExerciseLog } from "./log-types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex text-black justify-self-end">
      {pending ? "Submitting..." : "Submit Log"}
    </Button>
  );
}

export default function WorkoutLogForm({ workout, exerciseDetails }: { workout: { id: string }, exerciseDetails: any }) {
  const [state, dispatch] = useActionState(createWorkoutLog, null);
  const flattenedDetails = useMemo(() => {
    return exerciseDetails.reduce((result: any, curr: any) => {
      let resultArr = result
      if (curr.exercises) {
        return resultArr.concat(curr.exercises)
      } else {
        return resultArr.concat(curr)
      }
    }, [])
  }, [exerciseDetails])

  return (
    <Form action={dispatch}>
      <div className="pt-4">
        <Stopwatch autoStart={true} />
      </div>
      <input type="hidden" name="date" value={new Date().toISOString()} />
      <input type="hidden" name="workoutId" value={workout.id} />
      <div className="font-semibold text-lg py-4">Exercises</div>
      <div
        className={clsx(
          "rounded-md shadow-md py-4 px-3 bg-background-muted mb-4",
          "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
        )}
      >
        <div className="overflow-y-auto flex flex-col gap-y-3">
          {exerciseDetails.map((item: any, index: number) => {
            if (item.exercises) {
              return (
                <CircuitLog
                  key={`${item.circuitId}-${index}`}
                  item={item}
                  index={index}
                  exerciseDetails={exerciseDetails}
                  flatDetails={flattenedDetails}
                />
              )
            } else {
              return (
                <ExerciseLog
                  key={`${item.name}-${index}`}
                  item={item}
                  index={index}
                  exerciseDetails={exerciseDetails}
                  flatDetails={flattenedDetails}
                />
              )
            }
          })}
        </div>
      </div>
      <SubmitButton />
    </Form>
  )
}
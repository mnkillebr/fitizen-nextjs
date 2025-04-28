import { generateMuxThumbnailToken, generateMuxVideoToken } from "@/app/lib/mux-tokens.server";
import { getWorkoutById } from "@/models/workout.server";
import { exerciseDetailsMap } from "../page";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft } from "@/assets/icons";
import CurrentDate from "@/components/CurrentDate";
import WorkoutLogForm from "./WorkoutLogForm";
export default async function WorkoutLogPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const workout = await getWorkoutById(id);

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
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link
            href={`/workouts/${workout.id}`}
            className={clsx(
              "flex items-center text-primary-foreground bg-primary text-sm",
              "py-2 pl-2 pr-3 rounded-md hover:bg-primary/90 shadow",
            )}
          >
            <ChevronLeft className="h-4 w-4 text-black" />
            <div className="text-black">Back</div>
          </Link>
          <div className="flex-none font-semibold">{`New Workout Log - ${workout.name}`}</div>
        </div>
        <div className="*:text-sm"><CurrentDate /></div>
      </div>
      <WorkoutLogForm workout={workout} exerciseDetails={exerciseDetails} />
    </div>
  )
}
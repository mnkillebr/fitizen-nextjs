import { getAllExercisesPaginated } from "@/models/exercise.server";
import { EXERCISE_ITEMS_PER_PAGE } from "@/lib/magicNumbers";
import { generateMuxThumbnailToken, generateMuxVideoToken } from "@/app/lib/mux-tokens.server";
import WorkoutBuilder from "./WorkoutBuilder";

export default async function CreateWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q: query = "", page = 1, tags } = await searchParams;
  const { exercises, totalCount } = await getAllExercisesPaginated(
    query as string, 
    parseInt(page as string), 
    EXERCISE_ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(totalCount / EXERCISE_ITEMS_PER_PAGE);
  const tokenMappedExercises = exercises ? exercises.map(ex_item => {
    const smartCrop = () => {
      let crop = ["Lateral Lunge", "Band Assisted Leg Lowering", "Ankle Mobility", "Kettlebell Swing", "Half Kneel Kettlebell Press"]
      if (crop.includes(ex_item.name)) {
        return "smartcrop"
      } else {
        return undefined
      }
    }
    const heightAdjust = () => {
      let adjustments = ["Pushup", "Kettlebell Swing", "Kettlebell Renegade Row", "Half Kneel Kettlebell Press"]
      let expand = ["Lateral Bound", "Mini Band Walks"]
      if (adjustments.includes(ex_item.name)) {
        return "481"
      } else if (expand.includes(ex_item.name)) {
        return "1369"
      } else {
        return undefined
      }
    }
    const videoToken = generateMuxVideoToken(ex_item.muxPlaybackId)
    const thumbnailToken = generateMuxThumbnailToken(ex_item.muxPlaybackId, smartCrop(), heightAdjust())
    return {
      ...ex_item,
      videoToken,
      thumbnail: thumbnailToken ? `https://image.mux.com/${ex_item.muxPlaybackId}/thumbnail.png?token=${thumbnailToken}` : undefined,
    }
  }) : []

  return (
    <div className="@container">
      <div className="flex h-[calc(100vh-4rem)]">
        <WorkoutBuilder
          exercises={tokenMappedExercises}
          page={parseInt(page as string)}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
} 
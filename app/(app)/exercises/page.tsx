import { AppPagination } from "@/components/app-pagination";
import { ExerciseCard } from "./ExerciseCard";
import { Label } from "@/components/ui/label";
import { EXERCISE_ITEMS_PER_PAGE } from "@/lib/magicNumbers";
import { getAllExercisesPaginated } from "@/models/exercise.server";
import clsx from "clsx";
import { generateMuxThumbnailToken, generateMuxVideoToken } from "@/app/lib/mux-tokens.server";

export default async function ExercisesPage({
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
      <div className="h-[calc(100vh-7.22rem)] overflow-y-auto">
        {tokenMappedExercises.length ? (
          <div
            className={clsx(
              "flex-1 flex flex-col gap-3 snap-y snap-mandatory overflow-y-auto",
              "lg:grid lg:grid-cols-2 xl:grid-cols-3",
              "xl:grid-rows-3"
            )}
          >
            {tokenMappedExercises.map((ex_item) => (
              <ExerciseCard key={ex_item.id} exercise={ex_item} />
            ))}
          </div>
        ) : (
          <div className="flex-1 text-center"><Label>No Exercises</Label></div>
        )}
      </div>
      <AppPagination page={parseInt(page as string)} totalPages={totalPages} />
    </div>
  );
}
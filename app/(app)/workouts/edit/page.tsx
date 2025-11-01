import { getAllExercisesPaginated } from "@/models/exercise.server";
import { EXERCISE_ITEMS_PER_PAGE } from "@/lib/magicNumbers";
import { generateMuxThumbnailToken, generateMuxVideoToken } from "@/app/lib/mux-tokens.server";
import WorkoutBuilder from "../create/WorkoutBuilder";
import { getWorkoutById } from "@/models/workout.server";

export default async function EditWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q: query = "", page = 1, tags, id } = await searchParams;
  const workout = await getWorkoutById(id as string);
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
  console.log("workout", workout)
  function workoutCardsMap(routineExercises: any, exerciseDetails: any) {
    if (!routineExercises) {
      return []
    }

    // Create a Map for O(1) exercise detail lookups instead of O(n) find operations
    const exerciseDetailsMap = new Map(
      exerciseDetails.map((detail: any) => [detail.id, detail])
    )

    // Map routine exercises to detailed exercises: O(n) where n = routineExercises.length
    const detailedExercises = routineExercises.map((item: any) => {
      const exerciseDetail = exerciseDetailsMap.get(item.exerciseId)
      return {
        ...item,
        ...(exerciseDetail || {}),
        circuitId: item.circuitId || ""
      }
    })

    // Separate grouped and non-grouped exercises: O(n)
    const nonGrouped: any[] = []
    const groupedMap = new Map<string, any>()

    for (const exercise of detailedExercises) {
      if (!exercise.circuitId) {
        nonGrouped.push({
          ...exercise.exercise,
          orderInRoutine: exercise.orderInRoutine,
          notes: exercise.notes,
          rest: exercise.rest,
          sets: exercise.sets,
          target: exercise.target,
          time: exercise.time,
          rpe: exercise.rpe,
        })
      } else {
        // Use Map for O(1) circuit lookup instead of O(m) find operations
        const existingCircuit = groupedMap.get(exercise.circuitId)
        if (existingCircuit) {
          existingCircuit.exercises.push(exercise.exercise)
          // Sort only when needed: O(k log k) where k = exercises in circuit
          existingCircuit.exercises.sort((a: any, b: any) => a.orderInRoutine - b.orderInRoutine)
        } else {
          groupedMap.set(exercise.circuitId, {
            circuitId: exercise.circuitId,
            id: exercise.circuitId,
            orderInRoutine: exercise.orderInRoutine,
            sets: exercise.sets,
            rest: exercise.rest,
            exercises: [exercise.exercise]
          })
        }
      }
    }

    // Convert Map values to array: O(g) where g = number of unique circuits
    const grouped = Array.from(groupedMap.values())

    // Final sort: O(n log n)
    const detailMappedExercises = [...nonGrouped, ...grouped].sort(
      (a, b) => a.orderInRoutine - b.orderInRoutine
    )

    return detailMappedExercises
  }
  const incomingExercises = workoutCardsMap(workout?.exercises, tokenMappedExercises)
  console.log("incomingExercises", incomingExercises)
  return (
    <div className="@container">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <WorkoutBuilder
          incomingExercises={incomingExercises}
          exercises={tokenMappedExercises}
          page={parseInt(page as string)}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
} 
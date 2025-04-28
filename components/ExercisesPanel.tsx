import { Video } from "lucide-react"
import { ExerciseDialog } from "./ExerciseDialog";

interface ExerciseDetailProps {
  routineId?: string;
  id?: string;
  name?: string;
  orderInRoutine: number;
}

interface ExercisesPanelProps {
  exerciseDetailsArray: Array<ExerciseDetailProps>;
}

export function ExercisesPanel({ exerciseDetailsArray }: ExercisesPanelProps) {
  if (exerciseDetailsArray.length) {
    return (
      <div className="h-full flex flex-col gap-y-2 content-center snap-y snap-mandatory px-1 pb-1">
        {exerciseDetailsArray.map((exercise: any, ex_idx: number) => {
          if (exercise.circuitId) {
            return (
              <div
                key={`${exercise.routineId}-${exercise.circuitId}-${ex_idx}`}
                className="flex flex-col gap-2 shadow-inner border-2 border-dashed p-1 rounded-md *:content-center snap-start"
              >
                <div className="text-sm font-medium">Circuit of {exercise.sets} rounds</div>
                {exercise.exercises.map((ex_item: any, idx: number) => (
                  <div
                    key={`${exercise.routineId}-${ex_item.id}-${idx}`}
                    className="flex shadow-md rounded-md *:content-center bg-white dark:bg-background dark:shadow-sm dark:shadow-border-muted snap-start"
                  >
                    <div className="relative group cursor-pointer shrink-0">
                      <img
                        src={ex_item.thumbnail ?? "https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/cld-sample-3.jpg"}
                        className="h-16 rounded-sm transition-opacity duration-300 group-hover:opacity-85"
                      />
                      {/* <Video className="absolute w-full size-4 inset-y-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                      <div className="absolute w-full size-4 inset-y-1/3 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ExerciseDialog exercise={ex_item} />
                      </div>
                    </div>
                    <div className="flex flex-col overflow-x-hidden">
                      <div className="px-3 text-sm/6 font-medium max-w-[100%-6rem] truncate">{ex_item.name}</div>
                      <div className="px-3 flex flex-wrap max-w-full gap-4">
                        <div className="flex flex-col justify-between">
                          <label className="text-xs self-start font-medium">Target</label>
                          <p className="w-10 text-sm h-5">{ex_item.target}</p>
                        </div>
                        {ex_item.target === "reps" ? (
                          <div className="flex flex-col justify-between">
                            <label className="text-xs self-start font-medium">Reps</label>
                            <p className="w-10 text-sm h-5">{ex_item.reps}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-between">
                            <label className="text-xs self-start font-medium">Time</label>
                            <p className="w-fit text-sm h-5">{ex_item.time}</p>
                          </div>
                        )}
                        <div className="flex flex-col justify-between">
                          <label className="text-xs self-start font-medium">RPE</label>
                          <p className="w-fit text-sm h-5">{ex_item.rpe}</p>
                        </div>
                        {ex_item.notes ? (
                          <div className="flex flex-col justify-between">
                            <label className="text-xs self-start font-medium">Notes</label>
                            <p className="w-fit text-sm h-5">{ex_item.notes}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-sm self-end font-medium">Rest {exercise.rest} between rounds</div>
              </div>
            )
          } else {
            return (
              <div
                key={`${exercise.routineId}-${exercise.id}-${ex_idx}`}
                className="flex shadow-md rounded-md *:content-center bg-white dark:bg-background dark:shadow-sm dark:shadow-border-muted snap-start"
              >
                {/* <div className="bg-slate-400 rounded-md text-white size-16 min-w-16 text-center">Image</div> */}
                <div className="relative group cursor-pointer shrink-0">
                  <img
                    src={exercise.thumbnail ?? "https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/cld-sample-3.jpg"}
                    className="h-16 rounded-sm transition-opacity duration-300 group-hover:opacity-85"
                  />
                  {/* <Video className="absolute w-full size-4 inset-y-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                  <div className="absolute w-full size-4 inset-y-1/3 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExerciseDialog exercise={exercise} />
                  </div>
                </div>
                <div className="flex flex-col overflow-x-hidden">
                  <div className="px-3 text-sm/6 font-medium max-w-full truncate">{exercise.name}</div>
                  <div className="px-3 flex flex-wrap max-w-full gap-4">
                    <div className="flex flex-col justify-between">
                      <label className="text-xs self-start font-medium">Sets</label>
                      <p className="w-10 text-sm h-5">{exercise.sets}</p>
                    </div>
                    <div className="flex flex-col justify-between">
                      <label className="text-xs self-start font-medium">Target</label>
                      <p className="w-10 text-sm h-5">{exercise.target}</p>
                    </div>
                    {exercise.target === "reps" ? (
                      <div className="flex flex-col justify-between">
                        <label className="text-xs self-start font-medium">Reps</label>
                        <p className="w-10 text-sm h-5">{exercise.reps}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between">
                        <label className="text-xs self-start font-medium">Time</label>
                        <p className="w-fit text-sm h-5">{exercise.time}</p>
                      </div>
                    )}
                    <div className="flex flex-col justify-between">
                      <label className="text-xs self-start font-medium">Rest</label>
                      <p className="w-fit text-sm h-5">{exercise.rest}</p>
                    </div>
                    <div className="flex flex-col justify-between">
                      <label className="text-xs self-start font-medium">RPE</label>
                      <p className="w-fit text-sm h-5">{exercise.rpe}</p>
                    </div>
                    {exercise.notes ? (
                      <div className="flex flex-col justify-between">
                        <label className="text-xs self-start font-medium">Notes</label>
                        <p className="w-fit text-sm h-5">{exercise.notes}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          }
        })}
      </div>
    )
  } else {
    return (
      <div className="text-center text-sm/6 mt-2">{`No Exercises`}</div>
    )
  }
}
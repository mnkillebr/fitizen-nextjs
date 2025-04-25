import { verifySession } from "@/app/lib/dal";
import { getUserProgramLog } from "@/models/program.server";
import clsx from "clsx";
import Link from "next/link";
import { ChevronLeft } from "@/assets/icons";
import CurrentDate from "@/components/CurrentDate";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function ProgramLogViewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const programLogId = (await searchParams).id as string;
  const { userId } = await verifySession();
  const programLog = await getUserProgramLog(userId as string, programLogId);

  if (!programLog) {
    return <div>Program Log not found</div>;
  }

  const mappedBlocks = programLog.exerciseLogs.reduce((result: any, curr: any) => {
    let resultArr = result
    if (resultArr.length && resultArr.find((obj: { programBlockId: string }) => obj.programBlockId === curr.programBlockId)) {
      resultArr = resultArr.map((obj: { programBlockId: string, sets: any[] }) => {
        if (obj.programBlockId === curr.programBlockId) {
          if (obj.sets.find(set => set.set === parseInt(curr.sets[0].set))) {
            return {
              ...obj,
              sets: obj.sets.map(set => {
                if (set.set === parseInt(curr.sets[0].set)) {
                  return {
                    ...set,
                    exercises: set.exercises.concat({
                      ...curr.sets[0],
                      ...curr.blockExercise,
                      exerciseName: curr.blockExercise.exercise.name,
                      exerciseId: curr.exerciseId,
                    }).sort((a: any, b: any) => a.orderInBlock - b.orderInBlock)
                  }
                } else {
                  return set
                }
              })
            }
          } else {
            return {
              ...obj,
              sets: obj.sets.concat({
                set: parseInt(curr.sets[0].set),
                exercises: [{
                  ...curr.sets[0],
                  ...curr.blockExercise,
                  exerciseName: curr.blockExercise.exercise.name,
                  exerciseId: curr.exerciseId,
                }]
              })
            }
          }
        } else {
          return obj
        }
      })
    } else {
      if (curr.programBlockId) {
        resultArr = resultArr.concat({
          blockNumber: curr.blockExercise.block.blockNumber,
          programBlockId: curr.programBlockId,
          sets: [{
            set: parseInt(curr.sets[0].set),
            exercises: [{
              ...curr.sets[0],
              ...curr.blockExercise,
              exerciseName: curr.blockExercise.exercise.name,
              exerciseId: curr.exerciseId,
            }]
          }]
        })
      }
    }
    return resultArr
  }, [])

  return (
    <div className="@container">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link
            href={`/programs/${programLog.programId}`}
            className={clsx(
              "flex items-center text-primary-foreground bg-primary text-sm",
              "py-2 pl-2 pr-3 rounded-md hover:bg-primary/90 shadow",
            )}
          >
            <ChevronLeft className="h-4 w-4 text-black" />
            <div className="text-black">Back</div>
          </Link>
          <div className="flex-none font-semibold">{`Program Log - Week  ${programLog.programWeek} - Day ${programLog.programDay}`}</div>
        </div>
        <div className="*:text-sm"><CurrentDate incomingDate={programLog.date.toISOString()} /></div>
      </div>
      <div className="font-semibold text-lg py-4">Logged Exercises</div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div
          className={clsx(
            "flex flex-col gap-y-3 bg-background-muted",
            "rounded-md shadow-md bg-slate-50 py-4 px-3",
            "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
          )}
        >
          <div className="flex flex-col gap-y-3">
            {mappedBlocks.map((block: { blockNumber: number, programBlockId: string, sets: { set: number, exercises: any[] }[] }, block_idx: number) => {
              return (
                <div key={`${block.programBlockId}-${block_idx}`} className="flex flex-col">
                  <div className="flex gap-x-1 flex-nowrap">
                    <div className="flex-none font-semibold w-28">{`Block #${block.blockNumber}:`}</div>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 p-2 rounded shadow-inner flex flex-col gap-y-2">
                    {block.sets.map((set: { set: number, exercises: any[] }, set_idx: number) => (
                      <div key={`${block_idx}-${set_idx}`} className="border rounded dark:border-none dark:shadow-sm dark:shadow-border-muted">
                        <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                          <div className="tex-base font-semibold mb-1">{`Set ${set.set}`}</div>
                          {set.exercises.map((ex_item: { exerciseId: string, exerciseName: string, target: string, reps: number, actualReps: number, time: number, load: number, unit: string, notes: string }, ex_idx: number) => (
                            <div key={`${ex_idx}-${ex_item.exerciseId}`} className="py-1">
                              <div className="flex flex-wrap gap-x-3">
                                <div className="flex flex-col w-full sm:w-56">
                                  <label className="text-xs font-semibold text-muted-foreground">Name</label>
                                  <div className="flex gap-2 w-full">
                                    <div className="truncate">{ex_item.exerciseName}</div>
                                  </div>
                                </div>
                                {ex_item.target === "reps" ? (
                                  <>
                                    <div className="flex flex-col">
                                      <label className="text-xs font-semibold text-muted-foreground">Target Reps</label>
                                      <div className="text-start">{ex_item.reps}</div>
                                    </div>
                                    <div className="flex flex-col">
                                      <label className="text-xs font-semibold text-muted-foreground">Actual Reps</label>
                                      <div className="text-start">{ex_item.actualReps}</div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold capitalize text-muted-foreground">Time</label>
                                    <div className="text-start">{ex_item.time}</div>
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-muted-foreground">Load</label>
                                  <div className="text-start">{ex_item.load}</div>
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-muted-foreground">Load Units</label>
                                  <div className="text-start">{ex_item.unit === "kilogram" ? "kg(s)" : ex_item.unit === "pound" ? "lb(s)": ex_item.unit}</div>
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                                  <div className="text-start">{ex_item.notes}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
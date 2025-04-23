import { getCooldownById, getMovementPrepById, getProgramById, getUserProgramLogsByProgramId, getWarmupById } from "@/models/program.server";
import { verifySession } from "@/app/lib/dal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";
import { ChevronLeft } from "@/assets/icons";
import { ExerciseDialog } from "@/components/ExerciseDialog";
import { generateMuxVideoToken } from "@/app/lib/mux-tokens.server";
import CurrentDate from "@/components/CurrentDate";

import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";


const unitOptions = [
  { value: "bw", label: "Bodyweight" },
  { value: "lb(s)", label: "Pounds" },
  { value: "kg(s)", label: "Kilograms" },
]

export default async function ProgramsLogPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const program = await getProgramById(id);
  const { userId } = await verifySession();
  const userProgramLogs = await getUserProgramLogsByProgramId(userId as string, id);

  if (!program) {
    return <div>Program not found</div>;
  }

  const programLength = program.weeks.length * program.weeks[0].days.length
  const programDay = ((userProgramLogs.length) % (programLength) % (program.weeks[0].days.length)) + 1
  const programWeek = Math.ceil(((userProgramLogs.length) % (programLength) + 1) / program.weeks[0].days.length)
  const currentProgramWorkout = program.weeks[programWeek-1].days[programDay-1]
  const movementPrep = await getMovementPrepById(currentProgramWorkout.movementPrepId)
  const tokenMappedMovementPrep = {
    ...movementPrep,
    foamRolling: movementPrep?.foamRolling.map(ex_item => ({
      ...ex_item,
      exercise: {
        ...ex_item.exercise,
        videoToken: generateMuxVideoToken(ex_item.exercise.muxPlaybackId),
      }
    })),
    mobility: movementPrep?.mobility.map(ex_item => ({
      ...ex_item,
      exercise: {
        ...ex_item.exercise,
        videoToken: generateMuxVideoToken(ex_item.exercise.muxPlaybackId),
      }
    })),
    activation: movementPrep?.activation.map(ex_item => ({
      ...ex_item,
      exercise: {
        ...ex_item.exercise,
        videoToken: generateMuxVideoToken(ex_item.exercise.muxPlaybackId),
      }
    }))
  }
  const warmup = await getWarmupById(currentProgramWorkout.warmupId)
  const tokenMappedWarmup = {
    ...warmup,
    dynamic: warmup?.dynamic.map(ex_item => ({
      ...ex_item,
      exercise: {
        ...ex_item.exercise,
        videoToken: generateMuxVideoToken(ex_item.exercise.muxPlaybackId),
      }
    })),
    ladder: warmup?.ladder.map(ex_item => ({
      ...ex_item,
      exercise: {
        ...ex_item.exercise,
        videoToken: generateMuxVideoToken(ex_item.exercise.muxPlaybackId),
      }
    })),
    power: warmup?.power.map(ex_item => ({
      ...ex_item,
      exercise: {
        ...ex_item.exercise,
        videoToken: generateMuxVideoToken(ex_item.exercise.muxPlaybackId),
      }
    }))
  }
  const cooldown = await getCooldownById(currentProgramWorkout.cooldownId)
  const tokenMappedCooldown = {
    ...cooldown,
    exercises: cooldown?.exercises.map(ex_item => ({
      ...ex_item,
      exercise: {
        ...ex_item.exercise,
        videoToken: generateMuxVideoToken(ex_item.exercise.muxPlaybackId),
      }
    })),
  }
  const tokenMappedProgramWorkout = {
    ...currentProgramWorkout,
    blocks: currentProgramWorkout.blocks.map(block => ({
      ...block,
      exercises: block.exercises.map(block_ex_item => ({
        ...block_ex_item,
        exercise: {
          ...block_ex_item.exercise,
          videoToken: generateMuxVideoToken(block_ex_item.exercise.muxPlaybackId),
        }
      }))
    }))
  }

  return (
    <div className="@container">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link
            href={`/programs/${program?.id}`}
            className={clsx(
              "flex items-center text-primary-foreground bg-primary text-sm",
              "py-2 pl-2 pr-3 rounded-md hover:bg-primary/90 shadow",
            )}
          >
            <ChevronLeft className="h-4 w-4 text-black" />
            <div className="text-black">Back</div>
          </Link>
          <div className="flex-none font-semibold">{`New Program Log - Week ${programWeek} - Day ${programDay}`}</div>
        </div>
        <div className="*:text-sm"><CurrentDate /></div>
        <input type="hidden" name="date" value={new Date().toISOString()} />
        <input type="hidden" name="programId" value={program.id} />
        <input type="hidden" name="programWeek" value={programWeek} />
        <input type="hidden" name="programDay" value={programDay} />
      </div>
      <ScrollArea className="h-[calc(100vh-6.25rem)]">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="font-semibold text-lg">Movement Prep</div>
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={clsx(
                  "rounded-md shadow-md bg-slate-50 py-4 px-3 dark:bg-background-muted flex flex-col gap-y-2",
                  "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
                )}
              >
                {tokenMappedMovementPrep?.foamRolling && tokenMappedMovementPrep.foamRolling.length ? (
                  <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                    <div className="tex-base font-semibold mb-1">Foam Rolling</div>
                    <div className="flex flex-col gap-1">
                      {tokenMappedMovementPrep.foamRolling.map((roll, roll_idx) => (
                        <div key={roll_idx} className="flex flex-wrap gap-x-3">
                          <div className="flex flex-col w-full sm:w-56">
                            <label className="text-xs font-semibold text-muted-foreground">Name</label>
                            <div className="flex gap-2 w-full">
                              <div className="truncate">{roll.exercise.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Video</label>
                            <ExerciseDialog exercise={roll.exercise} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Reps</label>
                            <div className="text-start text-sm">{roll.reps}</div>
                          </div>
                          {roll.time ? (
                            <div className="flex flex-col w-11">
                              <label className="text-xs font-semibold text-muted-foreground">Time</label>
                              <div className="text-start text-sm">{roll.time} sec</div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {tokenMappedMovementPrep?.mobility && tokenMappedMovementPrep.mobility.length ? (
                  <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                    <div className="tex-base font-semibold mb-1">Mobility</div>
                    <div className="flex flex-col gap-1">
                      {tokenMappedMovementPrep.mobility.map((mob, mob_idx) => (
                        <div key={mob_idx} className="flex flex-wrap gap-x-3">
                          <div className="flex flex-col w-full sm:w-56">
                            <label className="text-xs font-semibold text-muted-foreground">Name</label>
                            <div className="flex gap-2 w-full">
                              <div className="truncate">{mob.exercise.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Video</label>
                            <ExerciseDialog exercise={mob.exercise} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Reps</label>
                            <div className="text-start text-sm">{mob.reps}</div>
                          </div>
                          {mob.time ? (
                            <div className="flex flex-col w-11">
                              <label className="text-xs font-semibold text-muted-foreground">Time</label>
                              <div className="text-start text-sm">{mob.time} sec</div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {tokenMappedMovementPrep?.activation && tokenMappedMovementPrep.activation.length ? (
                  <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                    <div className="tex-base font-semibold mb-1">Activation</div>
                    <div className="flex flex-col gap-1">
                      {tokenMappedMovementPrep.activation.map((act, act_idx) => (
                        <div key={act_idx} className="flex flex-wrap gap-x-3">
                          <div className="flex flex-col w-full sm:w-56">
                            <label className="text-xs font-semibold text-muted-foreground">Name</label>
                            <div className="flex gap-2 w-full">
                              <div className="truncate">{act.exercise.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Video</label>
                            <ExerciseDialog exercise={act.exercise} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Reps</label>
                            <div className="text-start text-sm">{act.reps}</div>
                          </div>
                          {act.time ? (
                            <div className="flex flex-col w-11">
                              <label className="text-xs font-semibold text-muted-foreground">Time</label>
                              <div className="text-start text-sm">{act.time} sec</div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="font-semibold text-lg">Warm-up</div>
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={clsx(
                  "rounded-md shadow-md bg-slate-50 py-4 px-3 dark:bg-background-muted flex flex-col gap-y-2",
                  "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
                )}
              >
                {tokenMappedWarmup?.dynamic && tokenMappedWarmup.dynamic.length ? (
                  <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                    <div className="tex-base font-semibold mb-1">Dynamic Drills</div>
                    <div className="flex flex-col gap-1">
                      {tokenMappedWarmup.dynamic.map((drill, drill_idx) => (
                        <div key={drill_idx} className="flex flex-wrap gap-x-3">
                          <div className="flex flex-col w-full sm:w-56">
                            <label className="text-xs font-semibold text-muted-foreground">Name</label>
                            <div className="flex gap-2 w-full">
                              <div className="truncate">{drill.exercise.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Video</label>
                            <ExerciseDialog exercise={drill.exercise} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Reps</label>
                            <div className="text-start text-sm">{drill.reps}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {tokenMappedWarmup?.ladder && tokenMappedWarmup.ladder.length ? (
                  <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                    <div className="tex-base font-semibold mb-1">Ladder</div>
                    <div className="flex flex-col gap-1">
                      {tokenMappedWarmup.ladder.map((ladder, ladder_idx) => (
                        <div key={ladder_idx} className="flex flex-wrap gap-x-3">
                          <div className="flex flex-col w-full sm:w-56">
                            <label className="text-xs font-semibold text-muted-foreground">Name</label>
                            <div className="flex gap-2 w-full">
                              <div className="truncate">{ladder.exercise.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Video</label>
                            <ExerciseDialog exercise={ladder.exercise} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Reps</label>
                            <div className="text-start text-sm">{ladder.reps}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {tokenMappedWarmup?.power && tokenMappedWarmup.power.length ? (
                  <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                    <div className="tex-base font-semibold mb-1">Power</div>
                    <div className="flex flex-col gap-1">
                      {tokenMappedWarmup.power.map((power, power_idx) => (
                        <div key={power_idx} className="flex flex-wrap gap-x-3">
                          <div className="flex flex-col w-full sm:w-56">
                            <label className="text-xs font-semibold text-muted-foreground">Name</label>
                            <div className="flex gap-2 w-full">
                              <div className="truncate">{power.exercise.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Video</label>
                            <ExerciseDialog exercise={power.exercise} />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Reps</label>
                            <div className="text-start text-sm">{power.reps}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="font-semibold text-lg py-4">Exercises</div>
        <div
          className={clsx(
            "rounded-md shadow-md bg-slate-50 py-4 px-3 dark:bg-background-muted",
            "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
          )}
        >
          <div className="overflow-y-auto flex flex-col gap-y-3">
            {tokenMappedProgramWorkout.blocks.map((block, block_idx) => {
              let overallSetNumber = 0
              return (
                <div key={`${block.id}-${block_idx}`} className="flex flex-col">
                  <div className="flex gap-x-1 flex-nowrap">
                    <div className="flex-none font-semibold w-28">{`Block #${block.blockNumber}:`}</div>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 p-2 rounded shadow-inner flex flex-col gap-y-2">
                    {[...Array(block.exercises.sort((a: any, b: any) => b.sets - a.sets)[0].sets)].map((set: unknown, set_idx: number) =>
                      <div key={`${block_idx}-${set_idx}`} className="border rounded dark:border-none dark:shadow-sm dark:shadow-border-muted">
                        {block.exercises.sort((a, b) => a.orderInBlock - b.orderInBlock).map((ex_item: any, ex_idx: number) => {
                          const currentSet = set_idx + 1
                          if (currentSet <= ex_item.sets) {
                            overallSetNumber+=1
                          }
                          return (
                            <div key={`${set_idx}-${ex_idx}`} className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                              {ex_idx === 0 ? <div className="tex-base font-semibold mb-1">{`Set ${currentSet}`}</div> : null}
                              <input type="hidden" name={`blocks[${block_idx}].blockId`} value={block.id} />
                              <input type="hidden" name={`blocks[${block_idx}].blockNumber`} value={block.blockNumber} />
                              <input type="hidden" name={`blocks[${block_idx}].programBlockId`} value={ex_item.programBlockId} />
                              {currentSet <= ex_item.sets ? (
                                <div className="flex flex-wrap gap-x-3">
                                  <input type="hidden" name={`blocks[${block_idx}].sets[${overallSetNumber-1}].exerciseId`} value={ex_item.exercise.id} />
                                  <input type="hidden" name={`blocks[${block_idx}].sets[${overallSetNumber-1}].targetReps`} value={ex_item.reps ?? ""} />
                                  <input type="hidden" name={`blocks[${block_idx}].sets[${overallSetNumber-1}].time`} value={ex_item.time ?? ""} />
                                  <input type="hidden" name={`blocks[${block_idx}].sets[${overallSetNumber-1}].set`} value={currentSet} />
                                  <div className="flex flex-col w-full sm:w-56">
                                    <label className="text-xs font-semibold text-muted-foreground">Name</label>
                                    <div className="flex gap-2 w-full">
                                      <div className="truncate">{ex_item.exercise.name}</div>
                                    </div>
                                  </div>
                                  {currentSet === 1 ? (
                                    <div className="flex flex-col">
                                      <label className="text-xs font-semibold text-muted-foreground">Video</label>
                                      <ExerciseDialog exercise={ex_item.exercise} />
                                    </div>
                                  ) : null}
                                  {ex_item.reps ? (
                                    <>
                                      <div className="flex flex-col">
                                        <label className="text-xs font-semibold text-muted-foreground">Target Reps</label>
                                        <div className="text-start text-sm">{ex_item?.reps}</div>
                                      </div>
                                      <div className="flex flex-col">
                                        <label className="text-xs font-semibold text-muted-foreground">Actual Reps</label>
                                        <Input
                                          type="number"
                                          className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                                          name={`blocks[${block_idx}].sets[${overallSetNumber-1}].actualReps`}
                                          placeholder={ex_item?.reps}
                                          min={1}
                                          max={999}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col w-11">
                                      <label className="text-xs font-semibold capitalize text-muted-foreground">Time</label>
                                      <div className="text-start text-sm">{ex_item?.time} sec</div>
                                    </div>
                                  )}
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-muted-foreground">Load</label>
                                    <Input
                                      type="number"
                                      className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                                      name={`blocks[${block_idx}].sets[${overallSetNumber-1}].load`}
                                      min={0}
                                      max={999}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-muted-foreground">Load Units</label>
                                    <Select
                                      defaultValue="lb(s)"
                                      name={`blocks[${block_idx}].sets[${overallSetNumber-1}].unit`}
                                    >
                                      <SelectTrigger className="text-xs h-5 bg-background dark:border-border-muted">
                                        <SelectValue placeholder="Select Units" />
                                      </SelectTrigger>
                                      <SelectContent className="dark:border-border-muted">
                                        <SelectGroup>
                                          <SelectLabel>Load Unit</SelectLabel>
                                          {unitOptions.map((unit, unit_idx) => <SelectItem key={unit_idx} value={unit.value}>{unit.label}</SelectItem>)}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                                    <Input
                                      type="text"
                                      className="w-36 text-sm px-2 h-5 self-end bg-background dark:border-border-muted"
                                      placeholder="Optional"
                                      name={`blocks[${block_idx}].sets[${overallSetNumber-1}].notes`}
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="font-semibold text-lg">Cooldown</div>
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={clsx(
                  "rounded-md shadow-md bg-slate-50 py-4 px-3 dark:bg-background-muted flex flex-col gap-y-2",
                  "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
                )}
              >
                {tokenMappedCooldown?.exercises ? (
                  <div className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                    <div className="flex flex-col gap-1">
                      {tokenMappedCooldown.exercises.map((cldwn, cldwn_idx) => (
                        <div key={cldwn_idx} className="flex flex-wrap gap-x-3">
                          <div className="flex flex-col w-full sm:w-56">
                            <label className="text-xs font-semibold text-muted-foreground">Name</label>
                            <div className="flex gap-2 w-full">
                              <div className="truncate">{cldwn.exercise.name}</div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs font-semibold text-muted-foreground">Video</label>
                            <ExerciseDialog exercise={cldwn.exercise} />
                          </div>
                          {cldwn.reps ? (
                            <div className="flex flex-col">
                              <label className="text-xs font-semibold text-muted-foreground">Reps</label>
                              <div className="text-start text-sm">{cldwn.reps}</div>
                            </div>
                          ) : null}
                          {cldwn.time ? (
                            <div className="flex flex-col w-11">
                              <label className="text-xs font-semibold text-muted-foreground">Time</label>
                              <div className="text-start text-sm">{cldwn.time} sec</div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
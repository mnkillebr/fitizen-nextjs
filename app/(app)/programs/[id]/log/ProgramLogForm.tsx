"use client";

import { createProgramLog } from "@/app/actions/program-action";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExerciseDialog } from "@/components/ExerciseDialog";
import { Input } from "@/components/ui/input";
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import clsx from "clsx";
import Stopwatch from "@/components/Stopwatch";

const unitOptions = [
  { value: "bw", label: "Bodyweight" },
  { value: "lb(s)", label: "Pounds" },
  { value: "kg(s)", label: "Kilograms" },
]

interface NestedExercise {
  exercise: {
    name: string;
    muxPlaybackId: string | null;
    videoToken?: string;
    cues: string[];
  },
  reps: number,
  time: number
}

interface NestedBlock {
  id: string;
  programDayId: string;
  blockNumber: number;
  exercises: Array<{
    programBlockId: string;
    exerciseId: string;
    orderInBlock: number;
    sets: number | null;
    target: string;
    reps: number | null;
    time: number | null;
    notes: string | null;
    rest: number | null;
    side: string | null;
    exercise: {
      id: string;
      name: string;
      muxPlaybackId: string | null;
      cues: string[];
      tags: string[];
    };
  }>
}

interface ProgramLogFormProps {
  programId: string;
  programWeek: number;
  programDay: number;
  blocks: any[];
  movementPrep: any;
  warmup: any;
  cooldown: any;
  programWorkout: any;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex text-black justify-self-end">
      {pending ? "Submitting..." : "Submit Log"}
    </Button>
  );
}

export default function ProgramLogForm({ programId, programWeek, programDay, blocks, movementPrep, warmup, cooldown, programWorkout }: ProgramLogFormProps) {
  const [state, dispatch] = useActionState(createProgramLog, null);
  return (
    <Form action={dispatch}>
      <div className="pt-4">
        <Stopwatch autoStart={true} />
      </div>
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="programWeek" value={programWeek} />
      <input type="hidden" name="programDay" value={programDay} />
      <input type="hidden" name="date" value={new Date().toISOString()} />
      <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
      
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="font-semibold text-lg">Movement Prep</div>
          </AccordionTrigger>
          <AccordionContent>
            <div
              className={clsx(
                "rounded-md shadow-md py-4 px-3 bg-background-muted flex flex-col gap-y-2",
                "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
              )}
            >
              {movementPrep?.foamRolling && movementPrep.foamRolling.length ? (
                <div className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
                  <div className="tex-base font-semibold mb-1">Foam Rolling</div>
                  <div className="flex flex-col gap-1">
                    {movementPrep.foamRolling.map((roll: NestedExercise, roll_idx: number) => (
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
              {movementPrep?.mobility && movementPrep.mobility.length ? (
                <div className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
                  <div className="tex-base font-semibold mb-1">Mobility</div>
                  <div className="flex flex-col gap-1">
                    {movementPrep.mobility.map((mob: NestedExercise, mob_idx: number) => (
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
              {movementPrep?.activation && movementPrep.activation.length ? (
                <div className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
                  <div className="tex-base font-semibold mb-1">Activation</div>
                  <div className="flex flex-col gap-1">
                    {movementPrep.activation.map((act: NestedExercise, act_idx: number) => (
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
                "rounded-md shadow-md py-4 px-3 bg-background-muted flex flex-col gap-y-2",
                "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
              )}
            >
              {warmup?.dynamic && warmup.dynamic.length ? (
                <div className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
                  <div className="tex-base font-semibold mb-1">Dynamic Drills</div>
                  <div className="flex flex-col gap-1">
                    {warmup.dynamic.map((drill: NestedExercise, drill_idx: number) => (
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
              {warmup?.ladder && warmup.ladder.length ? (
                <div className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
                  <div className="tex-base font-semibold mb-1">Ladder</div>
                  <div className="flex flex-col gap-1">
                    {warmup.ladder.map((ladder: NestedExercise, ladder_idx: number) => (
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
              {warmup?.power && warmup.power.length ? (
                <div className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
                  <div className="tex-base font-semibold mb-1">Power</div>
                  <div className="flex flex-col gap-1">
                    {warmup.power.map((power: NestedExercise, power_idx: number) => (
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
          "rounded-md shadow-md py-4 px-3 bg-background-muted",
          "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
        )}
      >
        <div className="overflow-y-auto flex flex-col gap-y-3">
          {programWorkout.blocks.map((block: NestedBlock, block_idx: number) => {
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
                          <div key={`${set_idx}-${ex_idx}`} className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
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
                                    <div className="truncate h-9 content-center">{ex_item.exercise.name}</div>
                                  </div>
                                </div>
                                {currentSet === 1 ? (
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-muted-foreground">Video</label>
                                    <div className="h-9 content-center">
                                      <ExerciseDialog exercise={ex_item.exercise} />
                                    </div>
                                  </div>
                                ) : null}
                                {ex_item.reps ? (
                                  <>
                                    <div className="flex flex-col">
                                      <label className="text-xs font-semibold text-muted-foreground">Target Reps</label>
                                      <div className="text-start text-sm h-9 content-center">{ex_item?.reps}</div>
                                    </div>
                                    <div className="flex flex-col">
                                      <label className="text-xs font-semibold text-muted-foreground">Actual Reps</label>
                                      <Input
                                        type="number"
                                        className="w-13 text-sm h-9 pr-1 bg-background dark:border-border-muted"
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
                                    <div className="text-start text-sm content-center h-9">{ex_item?.time} sec</div>
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-muted-foreground">Load</label>
                                  <Input
                                    type="number"
                                    className="w-13 text-sm h-9 pr-1 bg-background dark:border-border-muted"
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
                                    <SelectTrigger className="text-xs h-9 bg-background dark:border-border-muted">
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
                                    className="w-36 text-sm px-2 h-9 self-end bg-background dark:border-border-muted"
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
                "rounded-md shadow-md py-4 px-3 bg-background-muted flex flex-col gap-y-2",
                "dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted"
              )}
            >
              {cooldown?.exercises ? (
                <div className="bg-slate-100 dark:bg-background px-2 py-2 rounded">
                  <div className="flex flex-col gap-1">
                    {cooldown.exercises.map((cldwn: NestedExercise, cldwn_idx: number) => (
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
      
      <SubmitButton />
      
      {state?.errors && (
        <div className="text-red-500">
          {Object.entries(state.errors).map(([field, errors]) => (
            <div key={field}>
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {state?.server_error && (
        <div className="text-red-500">{state.server_error}</div>
      )}
    </Form>
  );
} 
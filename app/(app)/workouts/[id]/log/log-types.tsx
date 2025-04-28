import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ExerciseDialog } from "@/components/ExerciseDialog";

type ExerciseItemType = {
  id: string;
  target: string;
  reps: string;
  name: string;
  time: string;
  notes: string;
  sets: string;
  muxPlaybackId: string;
  videoToken: string;
  cues: string[];
}

interface CircuitLogProps {
  item: {
    exercises: Array<ExerciseItemType>;
    circuitId: string;
  };
  index: number;
  exerciseDetails: Array<{
    id: string;
    exercises: any[];
    circuitId: string;
  }>
  flatDetails: Array<{
    id: string;
    routineId: string;
    exerciseId: string;
    circuitId: string;
  }>
}

interface ExerciseLogProps {
  item: ExerciseItemType;
  index: number;
  exerciseDetails: Array<{
    id: string;
    exercises: any[];
    circuitId: string;
  }>
  flatDetails: Array<{
    id: string;
    routineId: string;
    exerciseId: string;
    circuitId: string;
  }>
}

const unitOptions = [
  { value: "bw", label: "Bodyweight" },
  { value: "lb(s)", label: "Pounds" },
  { value: "kg(s)", label: "Kilograms" },
]

export function CircuitLog({ item, index, exerciseDetails, flatDetails }: CircuitLogProps) {
  const numSets = item.exercises.find((ex_item: ExerciseItemType) => ex_item.sets)?.sets as string;
  return (
    <div key={`${item.circuitId}-${index}`} className="flex flex-col">
      <div className="flex gap-x-1 flex-nowrap">
        <div className="flex-none font-semibold w-28">{`Circuit #${exerciseDetails.filter(e => e.exercises).findIndex(e => e.circuitId === item.circuitId) + 1}:`}</div>
      </div>
      <div className="border-2 border-dashed border-gray-200 p-2 rounded shadow-inner flex flex-col gap-y-2">
        {[...Array(parseInt(numSets))].map((set: unknown, idx: number) =>
          <div key={`${index}-${idx}`} className="border rounded dark:border-none dark:shadow-sm dark:shadow-border-muted">
            {item.exercises.map((ex_item: ExerciseItemType, ex_idx: number) => {
              const currentSet = idx + 1
              const exerciseIndex = flatDetails.findIndex((d: { id: string }) => d.id === ex_item.id)
              return (
                <div key={`${idx}-${ex_idx}`} className="bg-slate-100 dark:bg-background px-2 py-1 rounded">
                  {ex_idx === 0 ? <div className="tex-base font-semibold">{`Set ${currentSet}`}</div> : null}
                  <input type="hidden" name={`exercises[${exerciseIndex}].circuitId`} value={item.circuitId} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].exerciseId`} value={ex_item.id} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].target`} value={ex_item.target} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].targetReps`} value={ex_item?.reps} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].time`} value={ex_item?.time} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].sets[${idx}].set`} value={currentSet} />
                  <div className="flex flex-wrap gap-x-3 py-2">
                    <div className="flex flex-col w-full sm:w-56 truncate">
                      <label className="text-xs font-semibold text-muted-foreground">Name</label>
                      <div>{ex_item.name}</div>
                    </div>
                    {currentSet === 1 ? (
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-muted-foreground">Video</label>
                        <ExerciseDialog exercise={ex_item} />
                      </div>
                    ) : null}
                    {ex_item.target === "reps" ? (
                      <>
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold text-muted-foreground">Target Reps</label>
                          <div className="text-start text-sm h-9 content-center">{ex_item?.reps}</div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold text-muted-foreground">Actual Reps</label>
                          <Input
                            type="number"
                            className="w-13 text-sm pr-1 bg-background dark:border-border-muted h-9 content-center"
                            name={`exercises[${exerciseIndex}].sets[${idx}].actualReps`}
                            placeholder={ex_item?.reps}
                            min={1}
                            max={999}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold capitalize text-muted-foreground">Time</label>
                        <div className="text-start text-sm h-9 content-center">{ex_item?.time}</div>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-muted-foreground">Load</label>
                      <Input
                        type="number"
                        className="w-13 text-sm pr-1 bg-background dark:border-border-muted h-9 content-center"
                        name={`exercises[${exerciseIndex}].sets[${idx}].load`}
                        min={0}
                        max={999}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-muted-foreground">Load Units</label>
                      <Select
                        defaultValue="lb(s)"
                        name={`exercises[${exerciseIndex}].sets[${idx}].unit`}
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
                        autoComplete="off"
                        className="w-36 text-sm px-2 self-end bg-background dark:border-border-muted h-9 content-center"
                        placeholder="Optional"
                        name={`exercises[${exerciseIndex}].sets[${idx}].notes`}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function ExerciseLog({ item, index, exerciseDetails, flatDetails }: ExerciseLogProps) {
  return (
    <div key={`${item.name}-${index}`} className="flex flex-col">
      <div className="flex gap-x-1 flex-nowrap">
        <div className="flex-none font-semibold w-28">{`Exercise #${exerciseDetails.filter(e => !e.exercises).findIndex(e => e.id === item.id) + 1}:`}</div>
        <div className="max-w-60 truncate">{item.name}</div>
        <ExerciseDialog exercise={item} />
      </div>
      <div className="flex flex-col gap-y-">
        {[...Array(parseInt(item.sets))].map((set: unknown, idx: number) => {
          const currentSet = idx + 1
          const exerciseIndex = flatDetails.findIndex((d: { id: string }) => d.id === item.id)
          return (
            <div key={idx} className="flex flex-wrap gap-x-3 items-center bg-slate-100 dark:bg-background dark:border-none dark:shadow-sm dark:shadow-border-muted px-2 py-2 rounded border">
              <div className="w-full sm:w-16 font-semibold">{`Set ${currentSet}`}</div>
              <input type="hidden" name={`exercises[${exerciseIndex}].exerciseId`} value={item.id} />
              <input type="hidden" name={`exercises[${exerciseIndex}].target`} value={item.target} />
              <input type="hidden" name={`exercises[${exerciseIndex}].targetReps`} value={item?.reps} />
              <input type="hidden" name={`exercises[${exerciseIndex}].time`} value={item?.time} />
              <input type="hidden" name={`exercises[${exerciseIndex}].sets[${idx}].set`} value={currentSet} />
              {item.target === "reps" ? (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-muted-foreground">Target Reps</label>
                    <div className="text-start text-sm h-9 content-center">{item?.reps}</div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-muted-foreground">Actual Reps</label>
                    <Input
                      type="number"
                      className="w-13 text-sm pr-1 bg-background dark:border-border-muted h-9 content-center"
                      name={`exercises[${exerciseIndex}].sets[${idx}].actualReps`}
                      placeholder={item?.reps}
                      min={1}
                      max={999}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <label className="text-xs font-semibold capitalize text-muted-foreground">Time</label>
                  <div className="text-start text-sm h-9 content-center">{item?.time}</div>
                </div>
              )}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground">Load</label>
                <Input
                  type="number"
                  className="w-13 text-sm pr-1 bg-background dark:border-border-muted h-9 content-center"
                  name={`exercises[${exerciseIndex}].sets[${idx}].load`}
                  min={0}
                  max={999}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-muted-foreground">Load Units</label>
                <Select
                  defaultValue="lb(s)"
                  name={`exercises[${exerciseIndex}].sets[${idx}].unit`}
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
                  autoComplete="off"
                  className="w-36 text-sm px-2 self-end bg-background dark:border-border-muted h-9 content-center"
                  placeholder="Optional"
                  name={`exercises[${exerciseIndex}].sets[${idx}].notes`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
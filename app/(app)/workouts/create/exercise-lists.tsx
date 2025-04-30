"use client";

import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from 'react-beautiful-dnd';
import { ExerciseCard } from "../../exercises/ExerciseCard";
import { useState, useEffect } from "react";
import { CirclePlus, Grip } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import clsx from 'clsx';
import { AppPagination } from '@/components/app-pagination';

function ExerciseDrawer({
  children,
  exercises,
  page,
  totalPages,
  handleAddExercise,
  flattenedWorkoutCards,
}: {
  children: React.ReactNode,
  exercises: any[],
  page: number,
  totalPages: number,
  handleAddExercise: (exercise: any) => void,
  flattenedWorkoutCards: any[],
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1280) {
        setOpen(false);
      }
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Available Exercises</DrawerTitle>
        </DrawerHeader>
        <div
          className={clsx(
            "h-full flex flex-col px-6 pt-0 bg-gray-200",
            "dark:bg-background text-foreground overflow-y-auto",
          )}
          id="available-exercises"
        >
          <div
            className="flex flex-col gap-y-2 md:grid md:grid-cols-2 md:gap-y-3 gap-x-3 overflow-y-auto pb-6 snap-y snap-mandatory"
            id="available-exercises-list"
          >
            {exercises.map((exercise) => (
              <div className="snap-start *:select-none">
                <ExerciseCard
                  exercise={exercise}
                  selectable
                  selectFn={handleAddExercise}
                  selectCount={flattenedWorkoutCards.map((sel_ex: any) => sel_ex.id.split("-")[0]).filter((id: any) => id === exercise.id).length}
                  selected={flattenedWorkoutCards.map((sel_ex: any) => sel_ex.id.split("-")[0]).includes(exercise.id)}
                />
              </div>
            ))}
          </div>
          <AppPagination page={page} totalPages={totalPages} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

function SelectedCircuitCard({
  card,
  onChangeCircuitRounds,
  handleUngroup,
  handleCardSelect,
  selectedCards,
  flattenedWorkoutCards,
  targetOptions,
  restOptions,
  onChangeCircuitTarget,
  onChangeCircuitRest,
}: {
  card: any,
  onChangeCircuitRounds: (cardId: string, rounds: string) => void,
  handleUngroup: (cardId: string) => void,
  handleCardSelect: (cardId: string) => void,
  selectedCards: Set<string>,
  flattenedWorkoutCards: any[],
  targetOptions: any[],
  restOptions: any[],
  onChangeCircuitTarget: (cardId: string, exItemId: string, target: string) => void,
  onChangeCircuitRest: (cardId: string, rest: string) => void,
}) {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2 mb-2">
          <Label className="text-xs self-end font-medium text-muted-foreground">Circuit of</Label>
          <Input
            type="number"
            className="w-12 text-sm h-5 pr-1 bg-background dark:border-border-muted"
            defaultValue={3}
            min={1}
            max={10}
            onChange={(event) => {
              const rounds = event.target.value
              onChangeCircuitRounds(card.id, rounds)
            }}
          />
          <Label className="text-xs self-end font-medium text-muted-foreground">rounds</Label>
        </div>
        <button className="text-xs font-medium underline" onClick={() => handleUngroup(card.id)}>Ungroup</button>
      </div>
      <div className="flex h-full w-full justify-between">
        <div className="flex items-center">
          <Checkbox
            className="mr-2"
            checked={selectedCards.has(card.id)}
            onCheckedChange={() => handleCardSelect(card.id)}
          />
          <div className="flex flex-col gap-2 divide-y-4">
            {card.exercises.map((ex_item: any, ex_item_idx: number) => {
              const exerciseIndex = flattenedWorkoutCards.findIndex((workoutCard: any) => workoutCard.id === ex_item.id)
              return (
                <div className="flex flex-col gap-1 last:pt-1 py-2" key={`${ex_item.name}-${ex_item_idx}`}>
                  <input type="hidden" name={`exercises[${exerciseIndex}].orderInRoutine`} value={exerciseIndex+1} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].circuitId`} value={card.circuitId} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].sets`} value={ex_item.rounds ? ex_item.rounds : 3} />
                  <input type="hidden" name={`exercises[${exerciseIndex}].rest`} value={ex_item.rest ? ex_item.rest : "60 sec"} />
                  <div className="flex flex-col justify-between">
                    <Label className="text-xs self-start font-medium text-muted-foreground">Name</Label>
                    <p className="min-w-40 max-w-full truncate shrink select-none">{ex_item.name}</p>
                  </div>
                  <div className="flex gap-3 h-full w-full flex-wrap">
                    <div className="flex flex-col justify-between">
                      <Label className="text-xs self-start font-medium text-muted-foreground">Target</Label>
                      <Select
                        defaultValue={ex_item.target ? ex_item.target : "reps"}
                        name={`exercises[${exerciseIndex}].target`}
                        value={card.target}
                        onValueChange={(val) => onChangeCircuitTarget(card.id, ex_item.id, val)}
                      >
                        <SelectTrigger className="text-xs h-5 bg-background dark:border-border-muted">
                          <SelectValue placeholder="Select Target" />
                        </SelectTrigger>
                        <SelectContent className="dark:border-border-muted">
                          <SelectGroup>
                            <SelectLabel>Target</SelectLabel>
                            {targetOptions.map((target, target_idx) => <SelectItem key={target_idx} value={target.value}>{target.label}</SelectItem>)}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {ex_item.target === "reps" ? (
                      <div className="flex flex-col justify-between">
                        <Label className="text-xs self-start font-medium text-muted-foreground">Reps</Label>
                        {/* <Input
                          type="number"
                          className="w-10 text-sm pl-2 h-5"
                          defaultValue="10"
                          name={`exercises[${exerciseIndex}].reps`}
                        /> */}
                        <Input
                          type="number"
                          className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                          defaultValue="10"
                          min={1}
                          max={20}
                          name={`exercises[${exerciseIndex}].reps`}
                        />
                      </div>
                    ) : ex_item.target === "time" ? (
                      <div className="flex flex-col justify-between">
                        <Label className="text-xs self-start font-medium text-muted-foreground">Time</Label>
                        <Select
                          defaultValue="30 sec"
                          name={`exercises[${exerciseIndex}].time`}
                        >
                          <SelectTrigger className="text-xs h-5 bg-background dark:border-border-muted">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent className="dark:border-border-muted">
                            <SelectGroup>
                              <SelectLabel>Time</SelectLabel>
                              {restOptions.map((rest, rest_idx) => <SelectItem key={rest_idx} value={rest.value}>{rest.label}</SelectItem>)}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between">
                        <Label className="text-xs self-start font-medium text-muted-foreground">Reps</Label>
                        <Input
                          type="number"
                          className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                          defaultValue="10"
                          min={1}
                          max={20}
                          name={`exercises[${exerciseIndex}].reps`}
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-between">
                      <div className="flex gap-2">
                        <Label className="text-xs self-start font-medium text-muted-foreground">RPE</Label>
                        <TooltipProvider>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="*:mr-5 *:hover:text-primary">
                              <InfoIcon className="w-3 h-3 cursor-default"/>
                            </TooltipTrigger>
                            <TooltipContent>
                              Rated Perceived Exertion (RPE)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        type="number"
                        className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                        defaultValue="1"
                        min={1}
                        max={10}
                        name={`exercises[${exerciseIndex}].rpe`}
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <Label className="text-xs self-start font-medium text-muted-foreground">Notes</Label>
                      <Input
                        type="text"
                        className="w-36 text-sm px-2 h-5 self-end bg-background dark:border-border-muted"
                        placeholder="reps, tempo, etc."
                        name={`exercises[${exerciseIndex}].notes`}
                      />
                    </div>
                  </div>
                  <input type="hidden" name={`exercises[${exerciseIndex}].exerciseId`} value={ex_item.id} />
                </div>
              )
            })}
          </div>
        </div>
        <div className="self-center">
          <Grip className="size-6 cursor-grab active:cursor-grabbing" />
        </div>
      </div>
      <div className="flex gap-2 mt-2 justify-end w-full">
        <Label className="text-xs self-end font-medium text-muted-foreground">Rest</Label>
        <Select
          defaultValue="60 sec"
          onValueChange={(val) => onChangeCircuitRest(card.id, val)}
        >
          <SelectTrigger className="text-xs h-5 bg-background dark:border-border-muted self-center w-fit">
            <SelectValue placeholder="Select Rest" />
          </SelectTrigger>
          <SelectContent className="dark:border-border-muted">
            <SelectGroup>
              <SelectLabel>Rest</SelectLabel>
              {restOptions.map((rest, rest_idx) => <SelectItem key={rest_idx} value={rest.value}>{rest.label}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Label className="text-xs self-end font-medium text-muted-foreground text-nowrap">between rounds</Label>
      </div>
    </>
  )
}

function SelectedExerciseCard({
  card,
  exerciseIndex,
  selectedCards,
  handleCardSelect,
  targetOptions,
  restOptions,
  onChangeTarget,
}: {
  card: any,
  exerciseIndex: number,
  selectedCards: Set<string>,
  handleCardSelect: (cardId: string) => void,
  targetOptions: any[],
  restOptions: any[],
  onChangeTarget: (val: string, cardId: string) => void,
}) {
  return (
    <>
      <input type="hidden" name={`exercises[${exerciseIndex}].orderInRoutine`} value={exerciseIndex+1} />
      <input type="hidden" name={`exercises[${exerciseIndex}].exerciseId`} value={card.id} />
      <Checkbox
        checked={selectedCards.has(card.id)}
        onCheckedChange={() => handleCardSelect(card.id)}
      />
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col justify-between">
            <Label className="text-xs self-start font-medium text-muted-foreground">Name</Label>
            <p className="min-w-40 max-w-full truncate shrink select-none">{card.name}</p>
          </div>
          <div className="flex flex-wrap max-w-full gap-3">
            <div className="flex flex-col justify-between">
              <Label className="text-xs self-start font-medium text-muted-foreground">Sets</Label>
              <Input
                type="number"
                className="w-12 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                defaultValue="3"
                min={1}
                max={10}
                name={`exercises[${exerciseIndex}].sets`}
              />
            </div>
            <div className="flex flex-col justify-between">
              <Label className="text-xs self-start font-medium text-muted-foreground">Target</Label>
              <Select
                defaultValue="reps"
                name={`exercises[${exerciseIndex}].target`}
                value={card.target}
                onValueChange={(val) => onChangeTarget(val, card.id)}
              >
                <SelectTrigger className="text-xs h-5 bg-background dark:border-border-muted">
                  <SelectValue placeholder="Select Target" />
                </SelectTrigger>
                <SelectContent className="dark:border-border-muted">
                  <SelectGroup>
                    <SelectLabel>Target</SelectLabel>
                    {targetOptions.map((target, target_idx) => <SelectItem key={target_idx} value={target.value}>{target.label}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {card.target === "reps" ? (
              <div className="flex flex-col justify-between">
                <Label className="text-xs self-start font-medium text-muted-foreground">Reps</Label>
                <Input
                  type="number"
                  className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                  defaultValue="10"
                  min={1}
                  max={20}
                  name={`exercises[${exerciseIndex}].reps`}
                />
              </div>
            ) : card.target === "time" ? (
              <div className="flex flex-col justify-between">
                <Label className="text-xs self-start font-medium text-muted-foreground">Time</Label>
                <Select
                  defaultValue="30 sec"
                  name={`exercises[${exerciseIndex}].time`}
                >
                  <SelectTrigger className="text-xs h-5 bg-background dark:border-border-muted">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent className="dark:border-border-muted">
                    <SelectGroup>
                      <SelectLabel>Time</SelectLabel>
                      {restOptions.map((rest, rest_idx) => <SelectItem key={rest_idx} value={rest.value}>{rest.label}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex flex-col justify-between">
                <Label className="text-xs self-start font-medium text-muted-foreground">Reps</Label>
                <Input
                  type="number"
                  className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                  defaultValue="10"
                  min={1}
                  max={20}
                  name={`exercises[${exerciseIndex}].reps`}
                />
              </div>
            )}
            <div className="flex flex-col justify-between">
              <div className="flex gap-2">
                <Label className="text-xs self-start font-medium text-muted-foreground">RPE</Label>
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="*:mr-5 *:hover:text-primary">
                      <InfoIcon className="w-3 h-3 cursor-default"/>
                    </TooltipTrigger>
                    <TooltipContent>
                      Rated Perceived Exertion (RPE)
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                className="w-13 text-sm h-5 pr-1 bg-background dark:border-border-muted"
                defaultValue="1"
                min={1}
                max={10}
                name={`exercises[${exerciseIndex}].rpe`}
              />
            </div>
            <div className="flex flex-col justify-between">
              <Label className="text-xs self-start font-medium text-muted-foreground">Notes</Label>
              <Input
                type="text"
                className="w-36 text-sm px-2 h-5 self-end bg-background dark:border-border-muted"
                placeholder="reps, tempo, etc."
                name={`exercises[${exerciseIndex}].notes`}
              />
            </div>
            <div className="flex flex-col justify-between">
              <Label className="text-xs self-start font-medium text-muted-foreground">Rest</Label>
              <Select
                defaultValue="60 sec"
                name={`exercises[${exerciseIndex}].rest`}
              >
                <SelectTrigger className="text-xs h-5 bg-background dark:border-border-muted">
                  <SelectValue placeholder="Select Rest" />
                </SelectTrigger>
                <SelectContent className="dark:border-border-muted">
                  <SelectGroup>
                    <SelectLabel>Rest</SelectLabel>
                    {restOptions.map((rest, rest_idx) => <SelectItem key={rest_idx} value={rest.value}>{rest.label}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="self-center">
          <Grip className="size-6 cursor-grab active:cursor-grabbing mr-2" />
        </div>
      </div>
    </>
  )
}

export function SelectedExercises({
  workoutCards,
  onChangeCircuitRounds,
  handleUngroup,
  handleCardSelect,
  selectedCards,
  flattenedWorkoutCards,
  targetOptions,
  restOptions,
  onChangeCircuitTarget,
  onChangeCircuitRest,
  onChangeTarget,
  exercises,
  page,
  totalPages,
  handleAddExercise
}: {
  workoutCards: any[],
  onChangeCircuitRounds: (cardId: string, rounds: string) => void,
  handleUngroup: (cardId: string) => void,
  handleCardSelect: (cardId: string) => void,
  selectedCards: Set<string>,
  flattenedWorkoutCards: any[],
  targetOptions: any[],
  restOptions: any[],
  onChangeCircuitTarget: (cardId: string, exItemId: string, target: string) => void,
  onChangeCircuitRest: (cardId: string, rest: string) => void,
  onChangeTarget: (val: string, cardId: string) => void,
  exercises: any[],
  page: number,
  totalPages: number,
  handleAddExercise: (exercise: any) => void
}) {
  return (
    <StrictModeDroppable droppableId="workoutCards" isDropDisabled={false}>
      {(provided: DroppableProvided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex-1 overflow-y-auto flex flex-col shadow-inner bg-slate-200 dark:bg-background rounded-md p-3 overflow-x-hidden border dark:border-border-muted"
          id="selected-exercises"
        >
          {workoutCards.map((card: any, index: number) => (
            <Draggable key={card.id} draggableId={card.id} index={index}>
              {(provided: DraggableProvided) => {
                if (card.circuitId) {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex flex-col mb-2 p-2 bg-gray-100 dark:bg-background-muted dark:border dark:border-border-muted rounded shadow overflow-x-hidden"
                    >
                      <SelectedCircuitCard
                        card={card}
                        onChangeCircuitRounds={onChangeCircuitRounds}
                        handleUngroup={handleUngroup}
                        handleCardSelect={handleCardSelect}
                        selectedCards={selectedCards}
                        flattenedWorkoutCards={flattenedWorkoutCards}
                        targetOptions={targetOptions}
                        restOptions={restOptions}
                        onChangeCircuitTarget={onChangeCircuitTarget}
                        onChangeCircuitRest={onChangeCircuitRest}
                      />
                    </div>
                  )
                } else {
                  const exerciseIndex = flattenedWorkoutCards.findIndex((workoutCard: any) => workoutCard.id === card.id)
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-2 mb-2 p-2 bg-gray-100 dark:bg-background-muted dark:border dark:border-border-muted rounded shadow"
                    >
                      <SelectedExerciseCard
                        card={card}
                        exerciseIndex={exerciseIndex}
                        selectedCards={selectedCards}
                        handleCardSelect={handleCardSelect}
                        targetOptions={targetOptions}
                        restOptions={restOptions}
                        onChangeTarget={onChangeTarget}
                      />  
                    </div>
                  )
                }
              }}
            </Draggable>
          ))}
          {provided.placeholder}
          <p className="hidden xl:flex h-full text-sm text-slate-400 dark:text-muted-foreground justify-center items-center p-4 border-2 bg-white dark:bg-background-muted border-dashed border-gray-300 rounded-md select-none">
            Drag 'n' drop exercise(s) here
          </p>
          <ExerciseDrawer
            exercises={exercises}
            page={page}
            totalPages={totalPages}
            handleAddExercise={handleAddExercise}
            flattenedWorkoutCards={flattenedWorkoutCards}
          >
            <div className="xl:hidden h-full border-2 border-dashed border-gray-300 bg-white dark:bg-background-muted rounded-md px-3 py-2 flex flex-col justify-center items-center my-1 cursor-pointer">
            <p className="text-sm text-slate-400 dark:text-muted-foreground select-none">Add exercise (s)</p>
              <CirclePlus className="size-8 text-primary"/>
            </div>
          </ExerciseDrawer>
        </div>
      )}
    </StrictModeDroppable>
  )
}

export function AvailableExercises({ exercises }: { exercises: any[] }) {
  return (
    <StrictModeDroppable droppableId="availableCards" isDropDisabled={true} isCombineEnabled={false} ignoreContainerClipping={true}>
      {(provided: DroppableProvided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col gap-y-2 2xl:grid 2xl:grid-cols-2 2xl:gap-y-3 gap-x-3 overflow-y-auto pb-6 snap-y snap-mandatory"
          id="available-exercises-list"
        >
          {exercises.map((exercise, index) => (
            <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
              {(provided: DraggableProvided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="snap-start *:select-none"
                  style={{
                    ...provided.draggableProps.style,
                    transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0px, 0px)',
                  }}
                >
                  <ExerciseCard exercise={exercise} draggable />
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
    </StrictModeDroppable>
  )
}
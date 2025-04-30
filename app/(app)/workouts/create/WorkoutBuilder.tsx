"use client";

import { useActionState, useCallback, useMemo, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { AvailableExercises, SelectedExercises } from "./exercise-lists";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "lucide-react";
import { AppPagination } from "@/components/app-pagination";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import { createWorkout } from "@/app/actions/workout-action";

type Card = {
  id: string;
  name: string;
};

type WorkoutCard = Card & {
  target: string;
  exercises?: any;
};

type ComplexCard = {
  id: string;
  circuitId: string;
  exercises: WorkoutCard[];
}

const targetOptions = [
  {value: "reps", label: "Repetitions"},
  {value: "time", label: "Time"}
]

const restOptions = [
  {value: "None", label: "None"},
  {value: "10 sec", label: "10 sec"},
  {value: "15 sec", label: "15 sec"},
  {value: "20 sec", label: "20 sec"},
  {value: "25 sec", label: "25 sec"},
  {value: "30 sec", label: "30 sec"},
  {value: "35 sec", label: "35 sec"},
  {value: "40 sec", label: "40 sec"},
  {value: "45 sec", label: "45 sec"},
  {value: "50 sec", label: "50 sec"},
  {value: "55 sec", label: "55 sec"},
  {value: "60 sec", label: "60 sec"},
  {value: "90 sec", label: "90 sec"},
  {value: "2 min", label: "2 min"},
  {value: "3 min", label: "3 min"},
  {value: "4 min", label: "4 min"},
  {value: "5 min", label: "5 min"},
]

export default function WorkoutBuilder({ exercises, page, totalPages }: { exercises: any[], page: number, totalPages: number }) {
  const [createWorkoutState, createWorkoutDispatch] = useActionState(createWorkout, null);
  const [workoutCards, setWorkoutCards] = useState<Array<WorkoutCard | ComplexCard>>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === 'availableCards' && destination.droppableId === 'workoutCards') {
      const card = exercises[source.index];
      // Create a new unique ID for the duplicate card
      const newId = `${card.id}-${Date.now()}`;
      const newDeckCard: WorkoutCard = {
        ...card,
        id: newId,
        target: "reps",
      };
      
      setWorkoutCards(prevWorkoutCards => {
        const newWorkoutCards = Array.from(prevWorkoutCards);
        newWorkoutCards.splice(destination.index, 0, newDeckCard);
        return newWorkoutCards;
      });
    } else if (source.droppableId === 'workoutCards' && destination.droppableId === 'workoutCards') {
      setWorkoutCards(prevWorkoutCards => {
        const newWorkoutCards = Array.from(prevWorkoutCards);
        const [reorderedItem] = newWorkoutCards.splice(source.index, 1);
        newWorkoutCards.splice(destination.index, 0, reorderedItem);
        return newWorkoutCards;
      });
    }
  };

  const handleAddExercise = (exercise: { id: string, name: string }) => {
    const newId = `${exercise.id}-${Date.now()}`;
    const newDeckCard: WorkoutCard = {
      ...exercise,
      id: newId,
      target: "reps",
    };
    
    setWorkoutCards(prevWorkoutCards => [...prevWorkoutCards, newDeckCard]);
  }

  const handleCardSelect = (cardId: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedCards(new Set(workoutCards.map(card => card.id)));
  };

  const handleDeselectAll = () => {
    setSelectedCards(new Set());
  };

  const handleDeleteSelected = () => {
    setWorkoutCards(prev => prev.filter(card => !selectedCards.has(card.id)));
    setSelectedCards(new Set());
  };

  const handleCircuit = useCallback(() => {
    setWorkoutCards((prev: any) => {
      const circuitCards = prev.filter((card: WorkoutCard) => selectedCards.has(card.id))
      const filteredDeck = prev.filter((card: WorkoutCard) => !selectedCards.has(card.id))
      return [...filteredDeck, {
        id: circuitCards.map((card: WorkoutCard) => card.id).join("-"),
        circuitId: `circuit-${Date.now()}`,
        exercises: circuitCards,
      }]
    })
    setSelectedCards(new Set());
  }, [[workoutCards, setWorkoutCards, selectedCards, setSelectedCards]])

  const handleChange = useCallback((id: string, field: string, value: string | number) => {
    setWorkoutCards(prev => prev.map(card => {
      if (card.id === id) {
        return {
          ...card,
          [field]: value
        }
      } else {
        return card
      }
    }))
  }, [workoutCards, setWorkoutCards])

  const handleUngroup = useCallback((circuitId: string) => {
    setWorkoutCards((prev: Array<WorkoutCard | ComplexCard>) => {
      const filteredDeck = prev.filter(card => card.id !== circuitId)
      const circuitExercises = prev.find(card => card.id === circuitId)?.exercises
      return [...filteredDeck, ...circuitExercises]
    })
  }, [workoutCards, setWorkoutCards])

  const onChangeCircuitRounds = useCallback((cardId: string, rounds: string) => {
    setWorkoutCards((prev: Array<WorkoutCard | ComplexCard>) => prev.map((card: any) => {
      if (card.id === cardId) {
        return {
          ...card,
          exercises: card.exercises.map((exercise: WorkoutCard) => ({
            ...exercise,
            rounds,
          }))
        }
      } else {
        return card
      }
    }))
  }, [workoutCards, setWorkoutCards])

  const onChangeCircuitRest = useCallback((cardId: string, rest: string) => {
    setWorkoutCards((prev: Array<WorkoutCard | ComplexCard>) => prev.map((card: any) => {
      if (card.id === cardId) {
        return {
          ...card,
          exercises: card.exercises.map((exercise: WorkoutCard) => ({
            ...exercise,
            rest,
          }))
        }
      } else {
        return card
      }
    }))
  }, [workoutCards, setWorkoutCards])

  const onChangeCircuitTarget = useCallback((circuitId: string, circuitExerciseId: string, target: string) => {
    setWorkoutCards((prev: Array<WorkoutCard | ComplexCard>) => prev.map((card: any) => {
      if (card.id === circuitId) {
        return {
          ...card,
          exercises: card.exercises.map((exercise: WorkoutCard) => {
            if (exercise.id === circuitExerciseId) {
              return {
                ...exercise,
                target,
              }
            } else {
              return exercise
            }
          })
        }
      } else {
        return card
      }
    }))
  }, [workoutCards, setWorkoutCards])

  const onChangeTarget = (value: string, id: string) => handleChange(id, "target", value)

  const flattenedWorkoutCards = useMemo(() => {
    return workoutCards.reduce((result: any, curr: any) => {
      let resultArr = result
      if (curr.exercises) {
        return resultArr.concat(curr.exercises)
      } else {
        return resultArr.concat(curr)
      }
    }, [])
  }, [workoutCards])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Create Workout Form */}
      <Form
        action={createWorkoutDispatch}
        className="flex flex-col h-full w-full xl:w-1/2 p-4 bg-background-muted text-foreground"
      >
        <h2 className="mb-2 text-lg font-semibold">Create Workout</h2>
        <fieldset>
          <div className="flex flex-col">
            <Label className="text-sm/6 font-medium">Name<span className="text-xs ml-1">*</span></Label>
            <Input
              type="text"
              id="workoutName"
              name="workoutName"
              autoComplete="off"
              required
              className={clsx(
                "p-2 rounded-md border text-sm/6",
                "bg-background placeholder:text-muted-foreground dark:border-border-muted dark:focus:border-ring"
              )}
              placeholder="Name your workout"
            />
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="text-sm/6 font-medium">Description</div>
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  className={clsx(
                    "p-2 rounded-md border text-sm/6 resize-none w-full bg-background",
                    "placeholder:text-muted-foreground dark:border-border-muted dark:focus:border-ring"
                  )}
                  placeholder="Optional"
                  name="workoutDescription"
                  id="workoutDescription"
                  autoFocus
                  rows={3}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </fieldset>
        <Label className="text-sm/6 font-medium">Exercises<span className="text-xs ml-1">*</span></Label>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => workoutCards.length === selectedCards.size ? handleDeselectAll() : handleSelectAll()}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-accent dark:hover:bg-border-muted dark:border dark:border-border-muted disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded"
            disabled={!workoutCards.length}
          >
            Select All
            {/* {workoutCards.length >= 1 && workoutCards.length === selectedCards.size ? "Deselect All" : "Select All"} */}
          </button>
          <button
            type="button"
            onClick={handleCircuit}
            disabled={selectedCards.size < 2}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-accent dark:hover:bg-border-muted dark:border dark:border-border-muted disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded"
          >
            Circuit
          </button>
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="px-2 py-1 rounded disabled:opacity-30 border hover:border-red-600"
            disabled={!selectedCards.size}
          >
            <TrashIcon className="size-4 text-red-500" />
            {/* <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger className="*:mr-5">
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </button>
        </div>
        <SelectedExercises
          workoutCards={workoutCards}
          onChangeCircuitRounds={onChangeCircuitRounds}
          handleUngroup={handleUngroup}
          handleCardSelect={handleCardSelect}
          selectedCards={selectedCards}
          flattenedWorkoutCards={flattenedWorkoutCards}
          targetOptions={targetOptions}
          restOptions={restOptions}
          onChangeCircuitTarget={onChangeCircuitTarget}
          onChangeCircuitRest={onChangeCircuitRest}
          onChangeTarget={onChangeTarget}
          exercises={exercises}
          page={page}
          totalPages={totalPages}
          handleAddExercise={handleAddExercise}
        />
        <div className="flex w-full justify-end mt-2">
          <Button className="text-black">Save</Button>
        </div>
      </Form>
      {/* Available Exercises */}
      <div
        className={clsx(
          "hidden h-full xl:flex flex-col xl:w-1/2 px-4 pt-4 bg-gray-200",
          "dark:bg-background text-foreground dark:border-l dark:border-border-muted",
        )}
        id="available-exercises"
      >
        <h2 className="mb-2 text-lg font-semibold">Available Exercises</h2>
        <AvailableExercises exercises={exercises} />
        <AppPagination page={page} totalPages={totalPages} />
      </div>
    </DragDropContext>
  )
}
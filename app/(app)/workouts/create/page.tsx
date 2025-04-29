import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TooltipContent, TooltipProvider, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";
import Form from "next/form";
import { CirclePlus, TrashIcon } from "lucide-react";
import { getAllExercisesPaginated } from "@/models/exercise.server";
import { EXERCISE_ITEMS_PER_PAGE } from "@/lib/magicNumbers";
import { generateMuxThumbnailToken, generateMuxVideoToken } from "@/app/lib/mux-tokens.server";
import { ExerciseCard } from "../../exercises/ExerciseCard";

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
  // console.log(tokenMappedExercises);
  return (
    <div className="@container">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Create Workout Form */}
        <div className="flex flex-col h-full w-full xl:w-1/2 p-6 bg-background-muted text-foreground">
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
              // onClick={() => workoutCards.length === selectedCards.size ? handleDeselectAll() : handleSelectAll()}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-accent dark:hover:bg-border-muted dark:border dark:border-border-muted disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded"
              // disabled={!workoutCards.length}
            >
              Select All
              {/* {workoutCards.length >= 1 && workoutCards.length === selectedCards.size ? "Deselect All" : "Select All"} */}
            </button>
            <button
              type="button"
              // onClick={handleCircuit}
              // disabled={selectedCards.size < 2}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-accent dark:hover:bg-border-muted dark:border dark:border-border-muted disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded"
            >
              Circuit
            </button>
            <button
              type="button"
              // onClick={handleDeleteSelected}
              className="px-2 py-1 rounded disabled:opacity-30 border hover:border-red-600"
              // disabled={!selectedCards.size}
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
          <div
            className="flex-1 overflow-y-auto flex flex-col shadow-inner bg-slate-200 dark:bg-background rounded-md p-3"
            id="selected-exercises"
          >
            <p className="hidden xl:flex h-full text-sm text-slate-400 dark:text-muted-foreground justify-center items-center p-4 border-2 bg-white dark:bg-background-muted border-dashed border-gray-300 rounded-md select-none">
              Drag 'n' drop exercise(s) here
            </p>
            <div
              className="xl:hidden h-full border-2 border-dashed border-gray-300 bg-white dark:bg-background-muted rounded-md px-3 py-2 flex flex-col justify-center items-center my-1 cursor-pointer"
              // onClick={toggleExercisesPanel}
            >
              <p className="text-sm text-slate-400 dark:text-muted-foreground select-none">Add exercise (s)</p>
              <CirclePlus className="size-8 text-primary"/>
            </div>
          </div>
        </div>
        {/* Available Exercises */}
        <div
          className={clsx(
            "hidden h-full xl:flex flex-col xl:w-1/2 px-6 pt-6 bg-gray-200",
            "dark:bg-background text-foreground dark:border-l dark:border-border-muted",
          )}
          id="available-exercises"
        >
          <h2 className="mb-2 text-lg font-semibold">Available Exercises</h2>
          <div
            className="flex flex-col gap-y-2 2xl:grid 2xl:grid-cols-2 2xl:gap-y-3 gap-x-3 overflow-y-auto pb-6 snap-y snap-mandatory"
            id="available-exercises-list"
          >
            {tokenMappedExercises.map((exercise) => (
              <div key={exercise.id} className="snap-start">
                <ExerciseCard exercise={exercise} draggable />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
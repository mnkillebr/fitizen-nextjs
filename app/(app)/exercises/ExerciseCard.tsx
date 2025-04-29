"use client";

import { useState } from "react";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Grip, Video } from "lucide-react";
import { CheckCircleIcon, PlusCircleIcon } from "@/assets/icons";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ExerciseDialog } from "@/components/ExerciseDialog";

interface ExerciseItemProps {
  id: string;
  name: string;
  body: string[];
  contraction: string | null;
  thumbnail?: string;
  muxPlaybackId: string | null;
  videoToken?: string;
  cues: string[];
}

type ExerciseProps = {
  exercise: ExerciseItemProps;
  selectable?: boolean;
  selectFn?: (...args: any[]) => void;
  selected?: boolean;
  selectCount?: number;
  draggable?: boolean;
}

export function ExerciseCard({ exercise, selectable, selectFn, selected, selectCount, draggable }: ExerciseProps) {
  return (
    <Card className="relative h-[calc(29.7vh)] overflow-hidden">
      <div className="absolute inset-0 z-0 group">
        <ExerciseDialog exercise={exercise}>
          <Image
            src={exercise.thumbnail ?? "https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/cld-sample-3.jpg"}
            alt={exercise.name}
            fill
            className="object-cover"
            style={{ objectPosition: 'top center', cursor: 'pointer' }} 
          />
        </ExerciseDialog>
        {/* <div className="absolute inset-0 bg-black/40" /> */}
      </div>
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 flex-none flex p-4 justify-between items-center dark:bg-background-muted z-10",
          selectable ? "bg-background" : "bg-muted hover:shadow-primary",
          draggable ? "cursor-grab" : ""
        )}
      >
        <div className="flex flex-col w-full">
        <p className="font-bold w-full md:max-w-[calc(100%-2rem)] truncate">{exercise.name}</p>
          <div
            className={clsx(
              "flex text-muted-foreground text-sm",
              (exercise.body && exercise.contraction && [...exercise.body, exercise.contraction].length > 1) || (exercise.body && exercise.body.length > 1) ? "divide-x divide-muted-foreground" : ""
            )}
          >
            {exercise.body.slice(0,2).map((body, body_idx) => (
              <p key={body_idx} className={`${body_idx > 0 ? "px-1" : "pr-1"} text-xs capitalize`}>{`${body} body`}</p>
            ))}
            <p className="px-1 text-xs capitalize">{exercise.contraction}</p>
          </div>
        </div>
        {selectable ? (
          <div
            className="relative flex items-center text-foreground"
            onClick={() => selectFn ? selectFn(exercise) : null}
          >
            <button>
              {selected ? <CheckCircleIcon className="xs:h-8 xs:w-8 text-primary" /> : <PlusCircleIcon className="xs:h-8 xs:w-8" />}
            </button>
            {selectCount && selectCount > 1 ? <p className="absolute -bottom-1 left-7 z-10 text-xs text-primary">{selectCount}</p> : null}
          </div>
        ) : null}
        {draggable ? (
          <div className="flex items-center justify-center">
            <Grip />
          </div>
        ) : null}
      </div>
    </Card>
  )
}
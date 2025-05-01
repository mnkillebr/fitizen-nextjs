"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { X } from "lucide-react";
import { LottieAnimation } from "./LottieAnimation";

export function WorkoutCompletedDialog({ workoutName }: { workoutName: string }) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="max-w-[300px] sm:max-w-[425px]">
        <DialogHeader>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2">
            <div className="absolute -right-1 -top-1 z-10 rounded-full bg-primary p-1 cursor-pointer" onClick={() => setIsOpen(false)}>
              <X className="text-primary-foreground h-6 w-6"/>
            </div>
            <div className="size-72 rounded-full overflow-hidden">
              <LottieAnimation src="https://lottie.host/207c5cf1-51d7-4917-836d-7251e7b162bd/w8RRmDM4Jf.lottie" autoplay />
            </div>
          </div>
          <DialogTitle></DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <div className="text-center space-y-4 mt-28">
        <div>
          <h3 className="text-xl font-semibold mb-2">Congrats!</h3>
          <p className="">You completed {workoutName}</p>
          <p className="">Keep it up! 💪</p>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  )
}
import { ExerciseDialogProps } from "@/app/lib/definitions";
import MuxPlayer from "@mux/mux-player-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video } from "lucide-react"

interface ExerciseDialogWithChildrenProps extends ExerciseDialogProps {
  children?: React.ReactNode;
}

export function ExerciseDialog ({ children, exercise }: ExerciseDialogWithChildrenProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? children : <Video className="hover:cursor-pointer min-w-6" />}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[408px] md:max-w-[550px] lg:max-w-[784px] ">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-x-4">
          <Tabs className="w-full md:hidden" defaultValue="video">
            <TabsList>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="cues">Cues</TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="">
              <MuxPlayer
                streamType="on-demand"
                playbackId={exercise.muxPlaybackId ? exercise.muxPlaybackId : undefined}
                tokens={{ playback: exercise.videoToken, thumbnail: exercise.videoToken }}
                metadataVideoTitle="Placeholder (optional)"
                metadataViewerUserId="Placeholder (optional)"
                primaryColor="#FFFFFF"
                secondaryColor="#000000"
                style={{
                  aspectRatio: 9/16,
                  width: "100%",
                  height: "100%",
                  maxHeight: 640,
                  maxWidth: 360,
                }}
              />
            </TabsContent>
            <TabsContent value="cues" className="">
              <div className="flex-1 flex flex-col gap-y-2 overflow-y-auto">
                {exercise.cues.map((cue: string, cue_idx: number) => (
                  <div key={cue_idx} className="flex w-full border border-border-muted rounded p-2">
                    {/* <div className="flex-none w-5">{cue_idx+1}.</div> */}
                    <div className="flex-1">{cue}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <div className="hidden md:flex md:flex-col w-full">
            <div className="font-bold mb-2 text-muted-foreground">Video</div>
            <div className="max-h-[425px] lg:max-h-[640px]">
              <MuxPlayer
                streamType="on-demand"
                playbackId={exercise.muxPlaybackId ? exercise.muxPlaybackId : undefined}
              tokens={{ playback: exercise.videoToken, thumbnail: exercise.videoToken }}
              metadataVideoTitle="Placeholder (optional)"
              metadataViewerUserId="Placeholder (optional)"
              primaryColor="#FFFFFF"
              secondaryColor="#000000"
              style={{
                aspectRatio: 9/16,
                width: "100%",
                height: "100%",
                maxHeight: 640,
                maxWidth: 360,
                }}
              />
            </div>
          </div>
          <div className="hidden md:flex md:flex-col w-full">
            <div className="font-bold mb-2 text-muted-foreground">Cues</div>
            <div className="flex-1 flex flex-col gap-y-2 overflow-y-auto max-h-[425px] lg:max-h-[640px+1.275rem]">
              {exercise.cues.map((cue: string, cue_idx: number) => (
                <div key={cue_idx} className="flex w-full border border-border-muted rounded p-2">
                  {/* <div className="flex-none w-5">{cue_idx+1}.</div> */}
                  <div className="flex-1">{cue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
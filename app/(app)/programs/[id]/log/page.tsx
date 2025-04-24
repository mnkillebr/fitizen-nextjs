import { getCooldownById, getMovementPrepById, getProgramById, getUserProgramLogsByProgramId, getWarmupById } from "@/models/program.server";
import { verifySession } from "@/app/lib/dal";
import clsx from "clsx";
import { ChevronLeft } from "@/assets/icons";
import { generateMuxVideoToken } from "@/app/lib/mux-tokens.server";
import CurrentDate from "@/components/CurrentDate";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProgramLogForm from "./ProgramLogForm";

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
      </div>
      {/* <ScrollArea className="h-[calc(100vh-6.25rem)]"> */}
        <ProgramLogForm 
          programId={program.id}
          programWeek={programWeek}
          programDay={programDay}
          blocks={tokenMappedProgramWorkout.blocks}
          movementPrep={tokenMappedMovementPrep}
          warmup={tokenMappedWarmup}
          cooldown={tokenMappedCooldown}
          programWorkout={tokenMappedProgramWorkout}
        />
      {/* </ScrollArea> */}
    </div>
  );
}
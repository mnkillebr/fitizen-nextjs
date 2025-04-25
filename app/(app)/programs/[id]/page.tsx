import { getProgramById, getUserProgramLogsByProgramId } from "@/models/program.server";
import { verifySession } from "@/app/lib/dal";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayIcon } from "@/assets/icons";
import { cookies } from "next/headers";
import { WorkoutCompletedDialog } from "@/components/WorkoutCompletedDialog";

export default async function ProgramIdPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const program = await getProgramById(id);
  const { userId } = await verifySession();
  const userProgramLogs = await getUserProgramLogsByProgramId(userId as string, id);
  const cookieStore = await cookies()
  const newProgramLog = JSON.parse(cookieStore.get('fitizen__new_program_log')?.value || '{}')
  // TODO: Add View Log links

  if (!program) {
    return <div>Program not found</div>;
  }

  const programLength = program.weeks.length * program.weeks[0].days.length
  const programDay = ((userProgramLogs.length) % (programLength) % (program.weeks[0].days.length)) + 1
  const programWeek = Math.ceil(((userProgramLogs.length) % (programLength) + 1) / program.weeks[0].days.length)

  return (
    <div className="@container">
      {newProgramLog?.programLogId && <WorkoutCompletedDialog workoutName={newProgramLog.workoutName} />}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Mobile/Tablet View */}
          <div className="lg:hidden relative h-72 rounded-lg overflow-hidden shadow dark:shadow-border-muted group">
            {program.s3ImageKey && (
              <Image
                src={program.s3ImageKey}
                alt={program.name}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-50"
                style={{ objectPosition: 'top center' }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
              <h1 className="text-2xl font-bold text-white group-hover:hidden">{program.name}</h1>
              <p className="text-white p-4 hidden group-hover:block">{program.description}</p>
            </div>
          </div>
          <Link
            href={`/programs/${program.id}/log`}
            className={clsx(
              "flex lg:hidden h-12 items-center justify-between shadow active:scale-95 rounded-full bg-slate-50",
              "hover:cursor-pointer dark:bg-background-muted dark:border dark:border-border-muted dark:shadow-border-muted",
            )}
          >
            <div className="size-12 invisible"></div>
            <div className="flex gap-2">
              <div className="select-none font-semibold self-center">{userProgramLogs.length ? 'Continue Program' : 'Start Program'}</div>
              {userProgramLogs.length ? <div className="select-none self-center text-sm text-muted-foreground">Week {programWeek} - Day {programDay}</div> : null}
            </div>
            <div className="bg-primary rounded-full p-3 text-black"><PlayIcon /></div>
          </Link>

          {/* Desktop View */}
          <div className="hidden lg:flex lg:flex-1 gap-4">
            <div className="flex-1 relative h-96 rounded-lg overflow-hidden shadow dark:shadow-border-muted">
              {program.s3ImageKey && (
                <Image
                  src={program.s3ImageKey}
                  alt={program.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'top center' }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <h1 className="text-3xl font-bold text-white">{program.name}</h1>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className={clsx(
                "flex-[2] bg-background-muted rounded-lg p-6 shadow",
                "dark:bg-background-muted border dark:border-border-muted dark:shadow-border-muted",
              )}>
                <p className="text-foreground">{program.description}</p>
              </div>
              <Link href={`/programs/${program.id}/log`} className="flex-1">
                <div className={clsx(
                  "w-full h-full bg-background text-foreground rounded-lg hover:bg-background-muted transition-colors",
                  "dark:bg-background-muted shadow border dark:border-border-muted dark:shadow-border-muted",
                  "flex items-center justify-center bg-slate-50",
                )}>
                  <div className="flex flex-col">
                    <div className="select-none font-semibold self-center mr-4">{userProgramLogs.length ? 'Continue Program' : 'Start Program'}</div>
                    {userProgramLogs.length ? <div className="select-none self-center text-sm text-muted-foreground mr-4">Week {programWeek} - Day {programDay}</div> : null}
                  </div>
                  <div className="bg-primary rounded-full p-3 text-black"><PlayIcon /></div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col gap-4 mb-4">
          {program.weeks.map((week, week_idx) => (
            <div key={`week-${week_idx}`} className="lg:hidden">
              <div className="font-semibold">Week {week.weekNumber}</div>
              <Tabs className="w-full h-full px-0.5" defaultValue="day_1">
                <TabsList>
                  {week.days.map((day, day_idx) => (<TabsTrigger key={`day-${day_idx}`} value={`day_${day.dayNumber}`}>Day {day.dayNumber}</TabsTrigger>))}
                </TabsList>
                {week.days.map((day, day_idx) => {
                  const logExists = userProgramLogs.find(log => log.programDay === day.dayNumber && log.programWeek === week.weekNumber)
                  return (
                    <TabsContent
                      key={`day-${day_idx}`}
                      value={`day_${day.dayNumber}`}
                      className="p-2 shadow h-[calc(100%-4.25rem)] rounded-md dark:border dark:border-border-muted dark:shadow-border-muted overflow-hidden"
                    >
                      <div className="flex items-end justify-between mb-2">
                        <div className="font-semibold text-muted-foreground">Day {day.dayNumber}</div>
                        {logExists ? (
                          <Link
                            href={`/programs/${program.id}/logview?id=${logExists?.id}`}
                            className={clsx(
                              "text-sm h-5 underline text-primary hover:text-yellow-500",
                              // isNavigatingLogView && navigation.location.search === `?id=${logExists?.id}` ? "animate-pulse" : ""
                            )}
                          >
                            View Log
                          </Link>
                        ) : null}
                      </div>
                      <div className="flex flex-col p-1 gap-1 *:bg-slate-100 *:rounded *:px-2 *:py-1 *:dark:bg-background-muted">
                        {day.blocks.map((block, block_idx) => (
                          <div key={`block-${block_idx}`} className="">
                            {block.exercises.map((exercise, exercise_idx) => (
                              <div key={`exercise-${exercise_idx}`} className="flex">
                                <div className="w-2/3 truncate">{exercise.exercise.name}</div>
                                <div className="w-1/3">{exercise.sets} x {exercise.time ? `${exercise.time} sec` : exercise.reps}</div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </div>
          ))}

          {/* Desktop View */}
          <div className="hidden lg:grid grid-cols-1 gap-8">
            {program.weeks.map((week) => (
              <div key={week.id} className="bg-background rounded-lg shadow">
                <div className="font-semibold mb-2">Week {week.weekNumber}</div>
                <div
                  className={clsx(
                    "hidden lg:flex h-[calc(100%-1.5rem)] *:shadow *:rounded-md gap-x-2 px-0.5",
                    "*:w-1/3 *:dark:border *:dark:border-border-muted *:dark:shadow-border-muted",
                  )}
                >
                  {week.days.map((day, day_idx) => {
                    const logExists = userProgramLogs.find(log => log.programDay === day.dayNumber && log.programWeek === week.weekNumber)
                    return (
                      <div key={`day-${day_idx}`} className="p-2 overflow-hidden overflow-y-auto">
                        <div className="flex items-end justify-between mb-2">
                          <div className="font-semibold text-muted-foreground">Day {day.dayNumber}</div>
                          {logExists ? (
                            <Link
                              href={`/programs/${program.id}/logview?id=${logExists?.id}`}
                              className={clsx(
                                "text-sm h-5 underline text-primary hover:text-yellow-500",
                              )}
                            >
                              View Log
                            </Link>
                          ) : null}
                        </div>
                        <div className="flex flex-col p-1 gap-1 *:bg-slate-100 *:rounded *:px-2 *:py-1 *:dark:bg-background-muted">
                          {day.blocks.map((block, block_idx) => (
                            <div key={`block-${block_idx}`} className="">
                              {block.exercises.map((exercise, exercise_idx) => (
                                <div key={`exercise-${exercise_idx}`} className="flex">
                                  <div className="w-2/3 truncate">{exercise.exercise.name}</div>
                                  <div className="w-1/3">{exercise.sets} x {exercise.time ? `${exercise.time} sec` : exercise.reps}</div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
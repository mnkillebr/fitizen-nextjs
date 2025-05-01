
import { getCurrentUser } from "@/app/lib/dal";
import { LottieAnimation } from "@/components/LottieAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMostRecentUserProgramLog } from "@/models/program.server";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const mostRecentProgramLog = await getMostRecentUserProgramLog(user?.id as string);
  console.log("mostRecentProgramLog", mostRecentProgramLog);
  return (
    <div className="@container">
      <div className="mb-2">
        {user && "firstName" in user ? ( // Type guard
          <h1 className="text-xl font-semibold">Welcome back, {user.firstName}</h1>
        ) : (
          <h1 className="text-xl font-semibold">Hello Guest</h1> // Fallback for error or guest
        )}
      </div>
      <ScrollArea className="h-[calc(100vh-6.25rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3">
          {mostRecentProgramLog ? (
            <Card className="relative h-[calc(29.7vh)] overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src={mostRecentProgramLog.s3ImageKey as string}
                  alt={mostRecentProgramLog.programName as string}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'top center' }} 
                  priority
                />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-white" style={{ textShadow: `2px 2px 2px #424242` }}>Current Program:</CardTitle>
                  <CardTitle className="text-white" style={{ textShadow: `2px 2px 2px #424242` }}>{mostRecentProgramLog.programName}</CardTitle>
                  <CardDescription className="text-white/90" style={{ textShadow: `2px 2px 2px #424242` }}>
                    Last workout completed: {mostRecentProgramLog.lastCompletedDate.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </div>
              <div className="relative z-10 w-full flex justify-end">
                <CardFooter>
                  <Link href={`/programs/${mostRecentProgramLog.programId}/log`}>
                    <Button className="text-black cursor-pointer">Continue Program</Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          ) : (
            <Card className="relative h-[calc(29.7vh)] overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/v1746042183/Image_huztyj.jpg"
                  alt="Generate a new program"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'top center' }} 
                  priority
                />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <CardHeader className="text-white text-shadow">
                  <CardTitle className="flex items-center gap-2 text-white text-shadow-lg" style={{ textShadow: `2px 2px 2px #424242` }}>
                    Generate a new program
                    <Sparkles className="size-5" />
                  </CardTitle>
                  <CardDescription className="text-white/90 text-shadow-lg" style={{ textShadow: `2px 2px 2px #424242` }}>
                    Generate a custom program based on your goals and preferences with AI
                  </CardDescription>
                </CardHeader>
              </div>
              <div className="relative z-10 w-full flex justify-end">
                <CardFooter>
                  <Button className="text-black">Generate Program</Button>
                </CardFooter>
              </div>
            </Card>
          )}
          <Card className="h-[calc(29.7vh)]">
            <CardHeader>
              <CardTitle>Current Goals</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold">Workouts this week</p>
                <Progress value={(2/3) * 100} />
                <p className="font-semibold flex justify-end">2/3</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold">Active minutes this week</p>
                <Progress value={(105/180) * 100} />
                <p className="font-semibold flex justify-end">105/180</p>
              </div>
              <div className="flex flex-col gap-1 relative">
                <p className="text-lg font-bold">Weekly Streak</p>
                <div className="h-24 w-48 absolute top-3 -left-14">
                  <LottieAnimation src="https://lottie.host/6559cc18-c2a8-4265-adfe-2b7e44d296eb/6jNTH73cnm.lottie" autoplay />
                </div>
                <p className="font-semibold text-2xl absolute inset-y-12 inset-x-1/4 w-full">3 Weeks</p>
              </div>
            </CardContent>
          </Card>
          <Card className="h-[calc(29.7vh)] overflow-hidden">
            <CardHeader>
              <CardTitle>Badges Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary rounded-full size-28">
                  <LottieAnimation src="https://lottie.host/d9ca4231-7cb9-4437-be77-397465351573/e2ufJZ2S0F.lottie" autoplay />
                </div>
                <div className="bg-secondary rounded-full size-28">
                  <LottieAnimation src="https://lottie.host/5e3d37d8-7ea3-4626-aed2-2617047b6311/ZPJx1xWx16.lottie" autoplay />
                </div>
                <div className="bg-secondary rounded-full size-28">
                  <LottieAnimation src="https://lottie.host/c0b5eec3-e1c7-4065-bdea-bf11d37a21c3/6BlcYLT455.lottie" autoplay />
                </div>
                <div className="bg-secondary rounded-full size-28">
                  <LottieAnimation src="https://lottie.host/c830d42c-9528-4d7b-a1bd-70ea604557ae/cFaie3RG1d.lottie" autoplay />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
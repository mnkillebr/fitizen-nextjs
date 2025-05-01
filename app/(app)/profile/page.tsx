import { Button } from "@/components/ui/button";
import { Card, CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ProfilePhoto from "./ProfilePhoto";
import { getCurrentUser } from "@/app/lib/dal";
import { redirect } from "next/navigation";
import UserSettingsForm from "./UserSettingsForm";
import { FitnessSettings } from "./FitnessSettings";
import { getUserFitnessProfile } from "@/models/user.server";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const fitnessProfile = await getUserFitnessProfile(user.id);

  return (
    <div className="@container">
      <div className="h-[calc(100vh-4rem)] select-none">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="fitness">Fitness Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="flex flex-col gap-y-4">
            <div className="text-muted-foreground">Manage your account settings and user information.</div>
            {/* Profile Photo */}
            <ProfilePhoto user={user} />
            {/* User Settings */}
            <Card className="w-full max-w-3xl self-center">
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>
                  Keep your user profile up to date.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserSettingsForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="fitness">
            <FitnessSettings fitnessProfile={fitnessProfile ?? {}} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
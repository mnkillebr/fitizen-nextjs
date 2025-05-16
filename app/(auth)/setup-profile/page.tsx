"use client";

import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Form from "next/form";
import { registerWithEmail } from "@/app/actions/register-action";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";

export default function SetupProfile() {
  const [state, dispatch, pending] = useActionState(registerWithEmail, undefined);

	return (
    <Card className="min-w-[400px] md:min-w-[500px]">
      <CardHeader>
        <CardTitle data-testid="setup-profile-title">Almost there!</CardTitle>
        <CardDescription data-testid="setup-profile-description">
          Enter your name to complete the registration
        </CardDescription> 
      </CardHeader>
      <CardContent className="max-w-2xl min-h-[200px]">
        <Form action={dispatch}>
          <fieldset className="pb-4 text-left flex flex-col gap-y-4">
            <div>
              <Label htmlFor="first_name" className="text-sm/3 font-medium mb-2">First Name</Label>
              <Input
                type="text"
                name="first_name"
                autoComplete="off"
                data-testid="first-name-input"
                className={clsx(
                  "w-full appearance-none border bg-background shadow-none",
                  "dark:bg-background dark:text-muted-foreground dark:focus:text-foreground",
                  "dark:border-border-muted dark:focus:border-ring"
                )}
                required
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-sm/3 font-medium mb-2">Last Name</Label>
              <Input
                type="text"
                name="last_name"
                autoComplete="off"
                data-testid="last-name-input"
                className={clsx(
                  "w-full appearance-none border bg-background shadow-none",
                  "dark:bg-background dark:text-muted-foreground dark:focus:text-foreground",
                  "dark:border-border-muted dark:focus:border-ring"
                )}
                required
                placeholder="Enter last name"
              />
            </div>
          </fieldset>
          <Button
            data-testid="signup-button"
            className="mx-auto w-full text-foreground dark:text-background"
            disabled={pending}
          >
            {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null }{pending ? "Signing up..." : "Sign Up"}
          </Button>
          {state?.server_error && <p data-testid="server-error" className="text-red-500 text-sm">{state.server_error}</p>}
        </Form>
      </CardContent>
    </Card>
	)
};
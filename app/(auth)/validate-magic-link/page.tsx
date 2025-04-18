"use client";

import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Form from "next/form";
import { register } from "@/app/actions/register-magic-link-action";
import { useActionState } from "react";

export default function ValidateMagicLink() {
  const [state, dispatch] = useActionState(register, undefined);

	return (
    <Card className="min-w-[400px] md:min-w-[500px]">
      <CardHeader>
        <CardTitle>Almost there!</CardTitle>
        <CardDescription>
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
          <Button className="mx-auto w-full text-foreground dark:text-background">Sign Up</Button>
        </Form>
      </CardContent>
    </Card>
	)
};
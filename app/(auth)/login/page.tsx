"use client";

import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import { login, googleSignIn } from "@/app/actions/login-action";
import { useActionState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export default function Login() {
  const [state, dispatch, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

	return (
		<Card className="flex text-foreground min-w-[400px] md:min-w-[500px]">
      <CardHeader>
        <CardTitle data-testid="login-title" id="login-title">Log In</CardTitle>
        <CardDescription data-testid="login-description" id="login-description">
          Enter your email address to log in
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-2xl min-h-[200px]">
        <Form action={dispatch} className="mx-auto">
          <div className="pb-4 text-left">
            <Input
              type="email"
              name="email"
              data-testid="email-input"
              required
              autoComplete="off"
              placeholder="Enter email address"
              className={clsx(
                "w-full appearance-none border bg-background shadow-none",
                "dark:bg-background dark:text-muted-foreground dark:focus:text-foreground",
                "dark:border-border-muted dark:focus:border-ring"
              )}
            />
            {state?.errors?.email && <p data-testid="email-error" className="text-red-500 text-sm">{state.errors.email[0]}</p>}
          </div>
          <Button
            data-testid="login-button"
            id="login-button"
            className="w-full text-foreground dark:text-background"
            disabled={pending}
          >
            {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null} Log In
          </Button>
          {state?.server_error && <p data-testid="server-error" className="text-red-500 text-sm">{state.server_error}</p>}
        </Form>
        <Separator className="my-6 dark:bg-border-muted"/>
        <Button
          data-testid="google-auth-button"
          id="google-auth-button"
          className="w-full text-foreground dark:text-background"
          onClick={googleSignIn}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>
      </CardContent>
		</Card>
	)
}
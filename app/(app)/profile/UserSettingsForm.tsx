"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { User } from "@/db/schema";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/app/actions/user-action";

export default function UserSettingsForm({ user }: { user: typeof User.$inferSelect }) {
  const [state, dispatch] = useActionState(updateUser, null);
  
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const hasChanges = 
    formData.firstName.trim() !== user.firstName ||
    formData.lastName.trim() !== user.lastName ||
    formData.email.trim() !== user.email;

  return (
    <Form action={dispatch} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          className="bg-background-muted dark:border-border-muted"
          defaultValue={user.firstName}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            firstName: e.target.value 
          }))}
          required
        />
        {state?.errors?.firstName ? <span className="text-red-500 text-xs">{state?.errors?.firstName}</span> : null}
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          className="bg-background-muted dark:border-border-muted"
          defaultValue={user.lastName}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            lastName: e.target.value
          }))}
          required
        />
        {state?.errors?.lastName ? <span className="text-red-500 text-xs">{state?.errors?.lastName}</span> : null}
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="bg-background-muted dark:border-border-muted"
          defaultValue={user.email}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            email: e.target.value
          }))}
          required
          disabled={user.email === "testuser@email.com"}
        />
        {state?.errors?.email ? <span className="text-red-500 text-xs">{state?.errors?.email}</span> : null}
      </div>
    
      <Button
        type="submit" 
        disabled={!hasChanges}
        className="w-fit self-end text-black"
      >
        Save Changes
      </Button>
    </Form>
  );
}
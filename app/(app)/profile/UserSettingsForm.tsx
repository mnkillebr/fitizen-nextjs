"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { User } from "@/db/schema";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/app/actions/user-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserSettingsForm({ user }: { user: typeof User.$inferSelect }) {
  const [state, dispatch] = useActionState(updateUser, null);
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success("User settings successfully updated.");
      router.replace("/profile");
    }
  }, [state]);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const hasChanges = 
    formData.firstName.trim() !== user.firstName ||
    formData.lastName.trim() !== user.lastName ||
    formData.email.trim() !== user.email;

  const handleExcelDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/programs/test_flow/excel', {
        method: 'GET',
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If we can't parse JSON, use the default error message
        }
        throw new Error(errorMessage);
      }

      // Check if the response is actually an Excel file
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('spreadsheetml.sheet')) {
        throw new Error('Response is not an Excel file');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'fitness_program_USA.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error('Download failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to download Excel file';
      toast.error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
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
            // disabled={user.email === "testuser@email.com"}
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

      {/* Excel Download Button */}
      <div className="pt-4 border-t">
        <Button
          onClick={handleExcelDownload}
          disabled={isDownloading}
          variant="outline"
          className="w-fit self-end"
        >
          {isDownloading ? "Downloading..." : "Download Test Excel Program"}
        </Button>
      </div>
    </div>
  );
}
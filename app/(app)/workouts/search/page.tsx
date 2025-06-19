"use client";

import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Select, SelectGroup, SelectItem, SelectLabel, SelectContent, SelectTrigger, SelectValue  } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { searchExercise } from "@/app/actions/exercise-action";
import { LoaderCircle } from "lucide-react";
import MultiSelect from "@/components/multi-select";

const bodyOptions = [
  { value: "upper", label: "Upper Body" },
  { value: "lower", label: "Lower Body" },
  { value: "full", label: "Full Body" },
];

export default function SearchWorkoutPage() {
  const [state, dispatch, pending] = useActionState(searchExercise, null);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Search Workout</h1>
      <Form action={dispatch} className="mx-auto w-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="body">Body Focus</Label>
            <Select name="body">
              <SelectTrigger className="text-xs h-9 bg-background dark:border-border-muted">
                <SelectValue placeholder="Select Body Focus" />
              </SelectTrigger>
              <SelectContent className="dark:border-border-muted">
                <SelectGroup>
                  <SelectLabel>Body Focus</SelectLabel>
                  {bodyOptions.map((body, body_idx) => <SelectItem key={body_idx} value={body.value}>{body.label}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 mb-2 w-[250px]">
            <MultiSelect options={bodyOptions} label="body focus" />
          </div>
        </div>
        <Button type="submit" className="text-black">
          {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </Form>
    </div>
  );
}

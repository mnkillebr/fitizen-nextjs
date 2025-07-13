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
import { useState } from "react";
import { cn } from "@/lib/utils";

const bodyOptions = [
  { value: "upper", label: "Upper Body" },
  { value: "lower", label: "Lower Body" },
  { value: "full", label: "Full Body" },
];

const patternOptions = [
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "core", label: "Core" },
  { value: "squat", label: "Squat" },
  { value: "hinge", label: "Hinge" },
  { value: "lunge", label: "Lunge" },
  { value: "rotational", label: "Rotational" },
  { value: "locomotive", label: "Locomotive" },
];

const planeOptions = [
  { value: "frontal", label: "Frontal" },
  { value: "sagittal", label: "Sagittal" },
  { value: "transverse", label: "Transverse" },
];

export default function SearchWorkoutPage() {
  const [state, dispatch, pending] = useActionState(searchExercise, null);
  const [searchForm, setSearchForm] = useState({
    bodyFocus: [] as string[],
    pattern: [] as string[],
    plane: [] as string[],
  });
  // console.log(state)
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Search Workout</h1>
      <Form action={dispatch} className="mx-auto w-full">
        <div className="flex flex-col gap-2">
          {/* <div className="flex flex-col gap-2">
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
          </div> */}
          <div className="flex flex-col gap-2 mb-2 w-[250px]">
            <Label htmlFor="body">Body Focus</Label>
            <MultiSelect options={bodyOptions} label="body focus" onSelect={(values) => setSearchForm({ ...searchForm, bodyFocus: values })} />
            <input type="hidden" name="body" value={searchForm.bodyFocus.join(",")} />
          </div>
          <div className="flex flex-col gap-2 mb-2 w-[250px]">
            <Label htmlFor="body">Movement Pattern</Label>
            <MultiSelect options={patternOptions} label="movement pattern" onSelect={(values) => setSearchForm({ ...searchForm, pattern: values })} />
            <input type="hidden" name="pattern" value={searchForm.pattern.join(",")} />
          </div>
          <div className="flex flex-col gap-2 mb-2 w-[250px]">
            <Label htmlFor="body">Movement Plane</Label>
            <MultiSelect options={planeOptions} label="movement plane" onSelect={(values) => setSearchForm({ ...searchForm, plane: values })} />
            <input type="hidden" name="plane" value={searchForm.plane.join(",")} />
          </div>
        </div>
        <Button type="submit" className="text-black">
          {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </Form>
      <div className={cn("flex flex-col gap-2 mt-2 p-2 border border-border-muted rounded-md overflow-y-auto max-h-[100px] w-[250px]", state?.length > 0 ? "block" : "hidden")}>
        {state?.map((exercise: any) => (
          <div key={exercise.id} className="pb-1">{exercise.name}</div>
        ))}
      </div>
    </div>
  );
}

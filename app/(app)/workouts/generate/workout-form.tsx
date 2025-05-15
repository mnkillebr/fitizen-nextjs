"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { generateWorkout } from "@/app/actions/workout-action";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LoaderCircle } from "lucide-react";

type WorkoutLocation = "gym" | "outdoor" | "home";
type WorkoutType = "strength" | "endurance" | "hiit" | "stability";
type WorkoutFocus = "upper" | "lower" | "full";
type WorkoutTime = "30" | "45" | "60" | "90";

interface WorkoutFormData {
  location: WorkoutLocation | null;
  type: WorkoutType | null;
  focus: WorkoutFocus | null;
  time: WorkoutTime | null;
}

const initialFormData: WorkoutFormData = {
  location: null,
  type: null,
  focus: null,
  time: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function WorkoutForm() {
  const [state, dispatch, pending] = useActionState(generateWorkout, null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkoutFormData>(initialFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Array<{ type: string; message: string; timestamp: number }>>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const totalSteps = 4;
  const progress = (Object.values(formData).filter(value => value !== null).length / Object.keys(formData).length) * 100;

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.location !== null;
      case 2:
        return formData.type !== null;
      case 3:
        return formData.focus !== null;
      case 4:
        return formData.time !== null;
      default:
        return false;
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps && isStepComplete(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field: keyof WorkoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (Object.values(formData).every(value => value !== null)) {
  //     // Handle form submission here
  //     console.log("Form submitted:", formData);
  //   }
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Where will you be working out?</h3>
            <RadioGroup
              value={formData.location || ""}
              onValueChange={(value) => handleChange("location", value as WorkoutLocation)}
              defaultValue={formData.location || ""}
            >
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="gym" />
                  <span>Gym</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="outdoor" />
                  <span>Outdoor</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="home" />
                  <span>Home</span>
                </Label>
              </div>
            </RadioGroup>
          </Card>
        );
      case 2:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">What type of workout?</h3>
            <RadioGroup
              value={formData.type || ""}
              onValueChange={(value) => handleChange("type", value as WorkoutType)}
              defaultValue={formData.type || ""}
            >
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="strength" />
                  <span>Strength</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="endurance" />
                  <span>Endurance</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="hiit" />
                  <span>HIIT</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="stability" />
                  <span>Stability</span>
                </Label>
              </div>
            </RadioGroup>
          </Card>
        );
      case 3:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">What's your focus?</h3>
            <RadioGroup
              value={formData.focus || ""}
              onValueChange={(value) => handleChange("focus", value as WorkoutFocus)}
              defaultValue={formData.focus || ""}
            >
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="upper" />
                  <span>Upper Body</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="lower" />
                  <span>Lower Body</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="full" />
                  <span>Full Body</span>
                </Label>
              </div>
            </RadioGroup>
          </Card>
        );
      case 4:
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">How much time do you have?</h3>
            <input type="hidden" name="location" value={formData.location || ""} />
            <input type="hidden" name="type" value={formData.type || ""} />
            <input type="hidden" name="focus" value={formData.focus || ""} />
            <RadioGroup
              value={formData.time || ""}
              onValueChange={(value) => handleChange("time", value as WorkoutTime)}
              defaultValue={formData.time || ""}
              name="time"
            >
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="30" />
                  <span>30 minutes</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="45" />
                  <span>45 minutes</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="60" />
                  <span>60 minutes</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <RadioGroupItem value="90" />
                  <span>90 minutes</span>
                </Label>
              </div>
            </RadioGroup>
          </Card>
        );
      default:
        return null;
    }
  };

  // Handle SSE connection
  useEffect(() => {
    if (isDialogOpen) {
      // Clear previous events
      setEvents([]);
      
      // Create new EventSource connection with the full URL
      const eventSource = new EventSource(`${API_BASE_URL}/programs/parq_program/events`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        let message = '';
        
        switch(data.type) {
          case 'crew_started':
            message = `Crew ${data.crew_name} has started execution!`;
            break;
          case 'agent_completed':
            message = `Agent ${data.agent_role} completed task\nOutput: ${data.output}`;
            break;
          case 'crew_completed':
            message = `Crew ${data.crew_name} has completed execution!\nFinal output: ${data.output}`;
            eventSource.close();
            break;
        }

        setEvents(prev => [...prev, {
          type: data.type,
          message,
          timestamp: data.timestamp
        }]);
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
        eventSourceRef.current = null;
      };
    }
  }, [isDialogOpen]);

  return (
    <>
      <Form action={dispatch} className="max-w-md mx-auto p-4">
        <Progress value={progress} className="mb-8" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="text-foreground"
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep === totalSteps ? (
            <Button 
              type="submit"
              className="text-black"
              disabled={!isStepComplete(currentStep) || pending}
              onClick={() => setIsDialogOpen(true)}
            >
              {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null}{pending ? "Generating" : "Generate"} Workout
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="text-black"
              disabled={!isStepComplete(currentStep)}
            >
              Next
            </Button>
          )}
        </div>
      </Form>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Workout Generation Progress</DialogTitle>
            <DialogDescription>
              The workout is being generated. Agent tasks are being executed in the background.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {pending && events.length > 0 && <LoaderCircle className="w-4 h-4 animate-spin" /> }
              {/* {events.map((event, index) => ( */}
                {events.slice().reverse().map((event, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.timestamp * 1000).toLocaleTimeString()}
                  </div>
                  <div className="whitespace-pre-wrap">{event.message}</div>
                  {index < events.length - 1 && <Separator />}
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center text-muted-foreground">
                  <LoaderCircle className="w-4 h-4 animate-spin" /> Waiting for events...
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              className="text-black"
              onClick={() => setIsDialogOpen(false)}
              disabled={pending}
            >
              {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 
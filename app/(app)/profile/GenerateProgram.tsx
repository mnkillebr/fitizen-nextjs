"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Sparkles } from "lucide-react";
import Form from "next/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fitnessProfileActions } from "@/app/actions/user-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateProgram } from "@/app/actions/program-action";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function GenerateProgram() {
  const [programState, dispatch, pending] = useActionState(generateProgram, null)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Array<{ type: string; message: string; timestamp: number }>>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Handle program generation success and download
  useEffect(() => {
    if (programState && programState.success && programState.data) {
      // Convert base64 back to blob and download
      const binaryString = atob(programState.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: programState.contentType });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = programState.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      toast.success('Program generated successfully! Excel file downloaded.');
      
      // Close dialog if open
      setIsDialogOpen(false);
    } else if (programState && programState.server_error) {
      toast.error(programState.server_error);
      setIsDialogOpen(false);
    }
  }, [programState]);
  
  // Form state for FMS scores and coach notes
  const [fmsScores, setFmsScores] = useState({
    deepSquat: '',
    hurdleStep: '',
    inlineLunge: '',
    shoulderMobility: '',
    activeStraightLegRaise: '',
    trunkStabilityPushUp: '',
    rotaryStability: ''
  });
  const [coachNotes, setCoachNotes] = useState('');

  // Check if all FMS scores and coach notes are filled
  const isFormValid = Object.values(fmsScores).every(score => score !== '') && coachNotes.trim() !== '';

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFmsScores(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear form inputs
  const clearForm = () => {
    setFmsScores({
      deepSquat: '',
      hurdleStep: '',
      inlineLunge: '',
      shoulderMobility: '',
      activeStraightLegRaise: '',
      trunkStabilityPushUp: '',
      rotaryStability: ''
    });
    setCoachNotes('');
  };

  // Handle SSE connection
  useEffect(() => {
    if (isDialogOpen) {
      // Clear previous events
      setEvents([]);
      
      // Create new EventSource connection with the full URL
      const eventSource = new EventSource(`${API_BASE_URL}/programs/program_flow/events`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        let message = '';
        console.log("event data", data)
        switch(data.type) {
          case 'flow_started':
            message = `Flow ${data.flow_name ?? ''} started.`;
            break;
          case 'method_started':
            message = `Method ${data.method_name ?? ''} started.`;
            break;
          case 'method_finished':
            message = `Method ${data.method_name ?? ''} finished.`;
            break;
          case 'flow_finished':
            message = `Flow ${data.flow_name ?? ''} finished.`;
            eventSource.close();
            break;
          case 'crew_started':
            message = `Crew ${data.crew_name} has started execution!`;
            break;
          case 'agent_completed':
            message = `Agent ${data.agent_role} completed task\nOutput: ${data.output}`;
            break;
          case 'crew_completed':
            message = `Crew ${data.crew_name} has completed execution!\nFinal output: ${data.output}`;
            break;
          case 'all_crews_completed':
            message = `All program generation crews have completed! Your fitness program is ready.`;
            eventSource.close();
            break;
          default:
            message = `Event: ${data.type}`;
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
      <Form action={dispatch} className="flex flex-col gap-y-4 overflow-hidden">
        <div className="text-muted-foreground">Generate a program based on the Functional Movement Screen (FMS).</div>
        <ScrollArea className="h-[calc(100vh-12.5rem)]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Functional Movement Screen (FMS)</CardTitle>
                <CardDescription>
                  Enter your FMS scores for the following categories:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 ">
                    <Label htmlFor="deep-squat">Deep Squat</Label>
                    <Input
                      id="deep-squat"
                      name="deepSquat"
                      type="number"
                      min="0"
                      step="1"
                      max="3"
                      placeholder="Enter score"
                      value={fmsScores.deepSquat}
                      onChange={(e) => handleInputChange('deepSquat', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="hurdle-step">Hurdle Step</Label>
                    <Input
                      id="hurdle-step"
                      name="hurdleStep"
                      type="number"
                      min="0"
                      step="1"
                      max="3"
                      placeholder="Enter score"
                      value={fmsScores.hurdleStep}
                      onChange={(e) => handleInputChange('hurdleStep', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="inline-lunge">Inline Lunge</Label>
                    <Input
                      id="inline-lunge"
                      name="inlineLunge"
                      type="number"
                      min="0"
                      step="1"
                      max="3"
                      placeholder="Enter score"
                      value={fmsScores.inlineLunge}
                      onChange={(e) => handleInputChange('inlineLunge', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="shoulder-mobility">Shoulder Mobility</Label>
                    <Input
                      id="shoulder-mobility"
                      name="shoulderMobility"
                      type="number"
                      min="0"
                      step="1"
                      max="3"
                      placeholder="Enter score"
                      value={fmsScores.shoulderMobility}
                      onChange={(e) => handleInputChange('shoulderMobility', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="active-straight-leg-raise">Active Straight Leg Raise</Label>
                    <Input
                      id="active-straight-leg-raise"
                      name="activeStraightLegRaise"
                      type="number"
                      min="0"
                      step="1"
                      max="3"
                      placeholder="Enter score"
                      value={fmsScores.activeStraightLegRaise}
                      onChange={(e) => handleInputChange('activeStraightLegRaise', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="trunk-stability-push-up">Trunk Stability Push-Up</Label>
                    <Input
                      id="trunk-stability-push-up"
                      name="trunkStabilityPushUp"
                      type="number"
                      min="0"
                      step="1"
                      max="3"
                      placeholder="Enter score"
                      value={fmsScores.trunkStabilityPushUp}
                      onChange={(e) => handleInputChange('trunkStabilityPushUp', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="rotary-stability">Rotary Stability</Label>
                    <Input
                      id="rotary-stability"
                      name="rotaryStability"
                      type="number"
                      min="0"
                      step="1"
                      max="3"
                      placeholder="Enter score"
                      value={fmsScores.rotaryStability}
                      onChange={(e) => handleInputChange('rotaryStability', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Coach Notes</CardTitle>
                <CardDescription>
                  Enter notes describing the goals for the client and any additional observations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="coach-notes">Notes</Label>
                  <Textarea
                    id="coach-notes"
                    placeholder="Please provide details..."
                    className="mt-2"
                    name="coachNotes"
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                  />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <div className="flex">
          <Button
            type="submit"
            className="text-black"
            name="_action"
            id="generateProgram"
            value="generateProgram"
            onClick={() => setIsDialogOpen(true)}
            disabled={!isFormValid || pending}
          >
            {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{pending ? "Generating" : "Generate"} Program
          </Button>
        </div>
      </Form>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          clearForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Program Generation Progress</DialogTitle>
            <DialogDescription>
              {pending ? "Your fitness program is being generated based on your FMS scores and coach notes. This may take a few moments." : "Program generation completed."}
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
                  {pending ? (
                    <div className="flex flex-col items-center gap-2">
                      <LoaderCircle className="w-6 h-6 animate-spin" />
                      <p>Generating your fitness program...</p>
                      <p className="text-sm">This may take a few moments</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <LoaderCircle className="w-4 h-4 animate-spin" /> Waiting for events...
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              className="text-black"
              onClick={() => {
                setIsDialogOpen(false);
                clearForm();
              }}
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
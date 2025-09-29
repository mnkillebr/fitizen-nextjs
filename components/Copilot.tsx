"use client";

import { CopilotPopup, type CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { useEffect } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { useRouter } from "next/navigation";

export default function Copilot() {
  // const router = useRouter();
  // useCopilotAction({
  //   name: "createWorkout",
  //   description: `Create a new workout for the user. The user should be prompted to choose from upper, lower or full body focus.
  //     The user should be prompted to select the number of exercises they want to include in the workout.
  //     The user should also be prompted for the workout style: circuit or straight sets.
  //   `,
  //   parameters: [
  //     {
  //       name: "bodyFocus",
  //       type: "string",
  //       description: "The body focus of the workout",
  //       required: true,
  //     },
  //     {
  //       name: "workoutStyle",
  //       type: "string",
  //       description: "The workout style of the workout",
  //       required: true,
  //     },
  //     {
  //       name: "numberOfExercises",
  //       type: "number",
  //       description: "The number of exercises to include in the workout",
  //       required: true,
  //     },
  //   ],
  //   handler: async ({ bodyFocus, workoutStyle, numberOfExercises }) => {
  //     router.push(`/workouts/create?bodyFocus=${bodyFocus}&workoutStyle=${workoutStyle}&numberOfExercises=${numberOfExercises}`);
  //   },
  // })
  useEffect(() => {
    const element = document.querySelector(".poweredBy");
    if (element) {
      element.remove();
    }
  }, []);
  return (
    <div
      style={
        {
          "--copilot-kit-primary-color": "var(--primary)",
          "--copilot-kit-contrast-color": "var(--secondary)",
          "--copilot-kit-background-color": "var(--popover)",
          "--copilot-kit-separator-color": "var(--border)",
          "--copilot-kit-muted-color": "var(--muted)",
        } as CopilotKitCSSProperties
      }
    >
      <CopilotPopup
          instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
          labels={{
          title: "Popup Assistant",
          initial: "Need any help?",
        }}
      />
    </div>
  );
}

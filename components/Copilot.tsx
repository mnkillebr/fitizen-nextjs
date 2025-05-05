"use client";

import { CopilotPopup, type CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { useEffect } from "react";

export default function Copilot() {
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

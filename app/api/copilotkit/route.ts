import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

const serviceAdapter = new GroqAdapter({ model: "moonshotai/kimi-k2-instruct-0905" });
const runtime = new CopilotRuntime({
  remoteEndpoints: [
    {
      url: process.env.REMOTE_ACTION_URL || "http://127.0.0.1:8000/copilotkit",
    },
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
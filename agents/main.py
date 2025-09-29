from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, Action
from agents.core.config import settings
from agents.routers import programs, workouts, exercises, flows

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def message_planet(planet: str, message: str):
    print(f"Sending message to {planet}: {message}")
    return f"Message sent to {planet}: {message}"

# CopilotKit
sdk = CopilotKitRemoteEndpoint(
    actions=lambda context: [
        Action(
            name="message_planet",
            handler=message_planet,
            description="""
                You are the Planetary Messenger Agent.
                You receive requests from the user when they want to send messages to other planets.

                Your job:
                1. Determine the name of the planet the user wants to message.
                2. Determine the message that the user wants to send.
                3. Prompt the user for the "planet" and/or "message" to ensure you have both before acting.
                3. Once you have both "planet" and "message", return the results.

                Send the message to the planet provided by the user.
            """,
            parameters=[
                {
                    "name": "planet",
                    "type": "string",
                    "description": "The planet to send the message to"
                },
                {
                    "name": "message",
                    "type": "string",
                    "description": "The message to send to the planet"
                }
            ]
        ),
    ]
)

add_fastapi_endpoint(app, sdk, "/copilotkit")

app.include_router(programs.router)
app.include_router(workouts.router)
app.include_router(exercises.router)
app.include_router(flows.router)

# add new route for health check
@app.get("/health")
def health():
    """Health check."""
    return {"status": "ok"}
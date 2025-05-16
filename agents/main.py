from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, Action
from agents.core.config import settings
from agents.routers import programs, workouts, exercises

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def hello_world():
    return "Hello, world!"

# CopilotKit
sdk = CopilotKitRemoteEndpoint(
    actions=lambda context: [
        Action(
            name="hello_world",
            handler=hello_world,
            description="Say hello to the world",
            parameters=None
        ),
    ]
)

add_fastapi_endpoint(app, sdk, "/copilotkit")

app.include_router(programs.router)
app.include_router(workouts.router)
app.include_router(exercises.router)

# add new route for health check
@app.get("/health")
def health():
    """Health check."""
    return {"status": "ok"}
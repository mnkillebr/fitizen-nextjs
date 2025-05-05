from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, Action
from agents.core.config import settings

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
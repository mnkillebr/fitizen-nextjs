import time
from typing import Annotated
from fastapi import APIRouter, Form
from fastapi.responses import StreamingResponse
import asyncio
import json

from agents.models.workout import GenerateWorkoutInput
from agents.crews.generate_workout_crew.generate_workout_crew import my_listener, GenerateWorkoutCrew, movement_patterns, movement_plane, balance_type

router = APIRouter(
    prefix="/workouts",
    tags=["workouts"]
)

async def event_generator():
    """Generate SSE events from the listener queue"""
    while True:
        event = my_listener.get_event()
        if event:
            if event["type"] == "crew_completed":
                yield f"data: {json.dumps(event)}\n\n"
                break
            yield f"data: {json.dumps(event)}\n\n"
        await asyncio.sleep(0.1)

@router.get("/generate_workout/events")
async def get_crew_events():
    """SSE endpoint for getting crew execution events"""
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

@router.post("/generate_workout")
async def getGeneratedWorkout(workoutInput: Annotated[GenerateWorkoutInput, Form()]):
    start_time = time.perf_counter()
    
    # Clear any previous events
    my_listener.clear_events()
    
    # Prepare inputs
    crew_inputs = {
      'workout_input': workoutInput.model_dump(),
      'movement_patterns': movement_patterns,
      'movement_plane': movement_plane,
      'balance_type': balance_type,
    }

    generate_workout_crew = GenerateWorkoutCrew().crew()
    
    # Start the crew execution
    result = await generate_workout_crew.kickoff_async(
        inputs=crew_inputs
    )
    raw_output = result.raw
    # pydantic_output = result.pydantic.model_dump()
    process_time = time.perf_counter() - start_time
    
    return {
        "process_time": process_time,
        # "pydantic_output": pydantic_output,
        "raw_output": raw_output,
    }
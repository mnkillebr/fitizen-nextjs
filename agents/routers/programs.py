import time
from typing import Annotated
from fastapi import APIRouter, Form, Query
from fastapi.responses import StreamingResponse
import asyncio
import json

from agents.models.profile import Client, FitnessProfile
from agents.crews.parq_program_crew.parq_program_crew import client, fitness_profile, movement_patterns, movement_plane, balance_type, parq_program_crew, my_listener
from agents.flows.generate_program_flow.generate_program_flow import GenerateProgramFlow, test_fms

router = APIRouter(
    prefix="/programs",
    tags=["programs"]
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

@router.get("/parq_program/events")
async def get_crew_events():
    """SSE endpoint for getting crew execution events"""
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

@router.post("/parq_program")
async def getParQProgram(profileClient: Annotated[Client, Query()], profileData: Annotated[FitnessProfile, Form()]):
    start_time = time.perf_counter()
    
    # print("profile client", profileClient.model_dump())
    # print("profile data", profileData.model_dump())
    # Clear any previous events
    my_listener.clear_events()
    
    # Prepare inputs
    crew_inputs = {
        'client': profileClient.model_dump(),
        'fitness_profile': profileData.model_dump(),
        # 'client': client,
        # 'fitness_profile': fitness_profile,
        'movement_patterns': movement_patterns,
        'movement_plane': movement_plane,
        'balance_type': balance_type,
    }
    # Start the crew execution
    result = await parq_program_crew.kickoff_async(
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

@router.get("/test_flow")
async def test_flow(country: Annotated[str | None, Query(max_length=30)] = None):
    """Test the flow"""
    # Test FMS Inputs
    fms_input = test_fms
    start_time = time.perf_counter()

    print(f"Country: {country}")
    print(f"FMS Input: {fms_input}")

    flow = GenerateProgramFlow(query=country, fms=fms_input)
    # flow.plot()
    result = await flow.kickoff_async()


    process_time = time.perf_counter() - start_time

    return {
        "process_time": process_time,
        "result": result,
    }
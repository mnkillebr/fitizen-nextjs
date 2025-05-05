import time
from typing import Annotated
from fastapi import APIRouter, Form, Query

from agents.models.profile import Client, FitnessProfile
from agents.crews.parq_program_crew import client, fitness_profile, movement_patterns, movement_plane, balance_type, parq_program_crew

router = APIRouter(
    prefix="/programs",
    tags=["programs"]
)

@router.post("/parq_program")
async def getParQProgram(profileClient: Annotated[Client, Query()], profileData: Annotated[FitnessProfile, Form()]):
    start_time = time.perf_counter()
    # print(profileData.model_dump())
    # print(profileClient.model_dump())
    #inputs
    crew_inputs = {
        'client': profileClient.model_dump(),
        'fitness_profile': profileData.model_dump(),
        # 'client': client,
        # 'fitness_profile': fitness_profile,
        'movement_patterns': movement_patterns,
        'movement_plane': movement_plane,
        'balance_type': balance_type,
    }
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
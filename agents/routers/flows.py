import time
from fastapi import APIRouter
from agents.flows.example_flow import ExampleFlow

router = APIRouter(
    prefix="/flows",
    tags=["flows"]
)

@router.get("/example_flow")
async def run_example_flow():
    start_time = time.perf_counter()
    flow = ExampleFlow()
    result = await flow.kickoff_async()
    process_time = time.perf_counter() - start_time
    return {
        "process_time": process_time,
        "result": result,
    }
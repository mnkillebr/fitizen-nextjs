from typing import Annotated, Optional
from fastapi import APIRouter, Form
from pydantic import BaseModel
from agents.services.exercise_service import get_exercise_by_id, search_exercises

router = APIRouter(
    prefix="/exercises",
    tags=["exercises"]
)

@router.get("/{exercise_id}")
async def get_exercise(exercise_id: str):
    exercise = await get_exercise_by_id(exercise_id)
    return exercise

class SearchExercisesRequest(BaseModel):
    body: Optional[list[str]] = None
    plane: Optional[list[str]] = None
    pattern: Optional[list[str]] = None

@router.post("/search")
async def search_exercises_endpoint(data: Annotated[SearchExercisesRequest, Form()]):
    exercises = await search_exercises(data.body, data.plane, data.pattern)
    return exercises
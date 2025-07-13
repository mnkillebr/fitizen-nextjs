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
    body: Optional[str] = None
    plane: Optional[str] = None
    pattern: Optional[str] = None

@router.post("/search")
async def search_exercises_endpoint(data: Annotated[SearchExercisesRequest, Form()]):
    body_list = data.body.split(',') if data.body else None
    plane_list = data.plane.split(',') if data.plane else None
    pattern_list = data.pattern.split(',') if data.pattern else None

    print(f"Searching for exercises with body: {body_list}, plane: {plane_list}, pattern: {pattern_list}")
    exercises = await search_exercises(body_list, plane_list, pattern_list)
    return exercises
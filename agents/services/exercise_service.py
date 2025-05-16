from prisma import Prisma
from typing import TypedDict, Optional

class ExerciseRead(TypedDict):
    id: str
    name: str
    description: str
    cues: list[str]
    tips: Optional[list[str]]
    tags: Optional[list[str]]
    body: Optional[list[str]]
    equipment: Optional[list[str]]
    plane: Optional[list[str]]
    pattern: Optional[list[str]]

async def get_exercise_by_id(exercise_id: str) -> dict | None:
    """
    Get an exercise by its ID.
    """
    async with Prisma() as prisma:
        exercise = await prisma.exercise.find_unique(where={"id": exercise_id})
        return exercise


async def search_exercises(body: list[str] = None, plane: list[str] = None, pattern: list[str] = None) -> list[ExerciseRead]:
    """
    Search for exercises based on body focus, plane of motion, and movement patterns.
    Only includes parameters in the query if they are present and non-empty.
    """
    print(f"Searching for exercises with body: {body}, plane: {plane}, pattern: {pattern}")
    async with Prisma() as prisma:
        where_conditions = {}
        if body and any(body):
            where_conditions["body"] = {"has_some": body}
        if plane and any(plane):
            where_conditions["plane"] = {"has_some": plane}
        if pattern and any(pattern):
            where_conditions["pattern"] = {"has_some": pattern}
        exercises = await prisma.exercise.find_many(where=where_conditions)
        return [ExerciseRead(
            id=exercise.id,
            name=exercise.name,
            description=exercise.description,
            cues=exercise.cues,
            tips=exercise.tips,
            tags=exercise.tags,
            body=exercise.body,
            equipment=exercise.equipment,
            plane=exercise.plane,
            pattern=exercise.pattern,
        ) for exercise in exercises]
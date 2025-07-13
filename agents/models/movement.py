from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class BalanceType(str, Enum):
    bilateral = "bilateral" 
    unilateral = "unilateral"

class ExerciseAngle(str, Enum):
    vertical = "vertical"
    horizontal = "horizontal"
    angled = "angled"

class MovementPattern(str, Enum):
    push = "push"
    pull = "pull"
    core = "core"
    squat = "squat"
    hinge = "hinge"
    lunge = "lunge"
    rotational = "rotational"
    locomotive = "locomotive"

class MovementPlane(str, Enum):
    frontal = "frontal"
    sagittal = "sagittal"
    transverse = "transverse"

class ExerciseType(BaseModel):
    pattern: MovementPattern = Field(..., description="The pattern of the exercise")
    angle: Optional[ExerciseAngle] = Field(None, description="The angle of the exercise")
    balance: Optional[BalanceType] = Field(None, description="The balance type of the exercise")
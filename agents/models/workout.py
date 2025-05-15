from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class WorkoutLocation(str, Enum):
  gym = "gym"
  outdoor = "outdoor"
  home = "home"

class WorkoutType(str, Enum):
  strength = "strength"
  endurance = "endurance"
  hiit = "hiit"
  stability = "stability"

class WorkoutFocus(str, Enum):
  upper = "upper"
  lower = "lower"
  full = "full"

class GenerateWorkoutInput(BaseModel):
  location: WorkoutLocation = Field(..., description="The location of the workout")
  type: WorkoutType = Field(..., description="The type of workout")
  focus: WorkoutFocus = Field(..., description="The focus of the workout")
  time: int = Field(..., description="The time of the workout")


from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from agents.models.movement import ExerciseType

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

class WorkoutOutline(BaseModel):
    day: str = Field(..., description="The day that represents the outline format", choices=["A", "B", "C", "D"])
    prep: str = Field(..., description="The movement preparation for the workout")
    power: str = Field(..., description="The power warmup for the workout")
    group_1: List[ExerciseType] = Field(..., description="The first group of movements")
    group_2: List[ExerciseType] = Field(..., description="The second group of movements")
    finisher: str = Field(..., description="The finisher for the workout")

class MovementPrep(BaseModel):
    name: str = Field(..., description="The name of the movement preparation group")
    description: Optional[str] = Field(default=None, description="A description of the how the movement preparation benefits the client in the context of the main workout")
    foam_rolling: List[str] = Field(..., description="A list of areas to foam roll relevant to the movements that will be performed in the main workout", max_length=7)
    dynamic_stretches: List[str] = Field(..., description="A list of dynamic stretches used to prepare for the exercises in the main workout. These can also be referred to as mobility drills. The goal is to increase the range of motion and flexibility of the client.", max_length=5)
    activation_exercises: List[str] = Field(..., description="A list of activation exercises used to prepare for the exercises in the main workout. These are exercises should help the client engage and 'feel' the muscles that will be used in the main workout.", max_length=5)

class ExerciseSet(BaseModel):
    name: str = Field(..., description="The exercise to be performed")
    reps: int = Field(..., description="The number of repetitions to perform the exercise")
    rpe: int = Field(..., description="The relative intensity of the exercise")

class Circuit(BaseModel):
    exercises: List[ExerciseSet] = Field(..., description="The exercises to be performed in the circuit")
    rounds: int = Field(..., description="The number of rounds to perform the circuit")
    rest: int = Field(..., description="The rest (in seconds) to take between each round in the circuit")

class WorkoutPlan(BaseModel):
    day: str = Field(..., description="The day that represents the workout plan", choices=["A", "B", "C", "D"])
    movement_prep: List[MovementPrep] = Field(..., description="The movement preparation for the workout")
    power: str = Field(..., description="The power exercise used to kick off the workout. It should engage the fast-twitch muscle fibers and raise the heart rate.")
    circuit_1: Circuit = Field(..., description="The first exercise circuit")
    circuit_2: Circuit = Field(..., description="The second exercise circuit")
    finisher: str = Field(..., description="The finisher for the workout")

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

from agents.models.movement import BalanceType, MovementPattern, MovementPlane
from agents.models.workout import WorkoutOutline

# Profile Analysis
class ExercisePriorities(BaseModel):
    goals: List[str] = Field(..., description="A list of high-priority goals for the program")
    description: str = Field(description="A brief summary of how the program will meet the clients goals/needs", max_length=150)
    split: List[str] = Field(..., description="A recommendation of the weekly split based on the number of sessions per week")

class ProfileAnalysis(BaseModel):
    medical_consultation: bool = Field(..., description="A boolean value that indicates if the client requires a medical consultation")
    consultation_suggestions: Optional[str] = Field(..., description="If the client needs a medical consultation, these are things to consider")
    sessions_per_week: int = Field(description="The recommended number of workout sessions per week", gt=1, le=4)
    program_phase: str = Field(..., description="Summarizes the goal for this phase of programming", max_length=40)
    priorities: ExercisePriorities
    exercises_to_avoid: List[str] = Field(..., description="A comprehensive list of exercises to avoid and reasons to avoid")
    exercises_to_include: List[str] = Field(
        ...,
        description="""A comprehensive list of exercises to include and reasons for inclusion. 
        This should include mobility, performance and skills recommendations based on the lifestyle, occupation and other physical activities of the client"""
        )
    progression_plan: List[str] = Field(..., description="A comprehensive list that briefly describes how to progress over the weeks")
    life_hacks: Optional[List[str]] = Field(..., description="Optional but recommended. A list of quick tips or `hacks` the client can use when they are not working out")
    final_recommendations: List[str] = Field(..., description="A comprehensive list of the overall guidelines and recommendations distilled for high-level overview")
    caveats: Optional[List[str]] = Field(..., description="Optional. A list of gotchas or caveats")
    full_analysis: str = Field(..., description="Provide the full analysis breakdown here formatted in markdown")

# Exercise Base
class Exercise(BaseModel):
    name: str = Field(..., description="The name of the exercise")
    description: Optional[str] = Field(default=None, description="A description of the exercise")
    balance: Optional[BalanceType] = Field(default=None, description="The base of support for the exercise. Unilateral is more difficult than bilateral")
    pattern: List[MovementPattern] = Field(..., description="The type of movement(s) an exercise can be classified as")
    plane: List[MovementPlane] = Field(..., description="The plane(s) of movement in which the exercise is performed")
    # angle: ExerciseAngle = Field(..., description="The angle of the movement action")

# Movement Prep
class MovementPrepType(str, Enum):
    foam_rolling = "foam_rolling"
    mobility = "mobility"
    activation = "activation"

class FoamRollingExercise(BaseModel):
    exercise: Exercise = Field(..., description="The foam rolling exercise used to perform self-myofascial release")
    movement_prep_type: MovementPrepType = MovementPrepType.foam_rolling
    time: int = Field(..., description="The suggested time to perform the foam rolling exercise")

class MobilityDrill(BaseModel):
    exercise: Exercise = Field(..., description="The mobility drill/exercise")
    movement_prep_type: MovementPrepType = MovementPrepType.mobility
    reps: int = Field(..., description="The suggested number of repetitions to perform the mobility drill/exercise")

class ActivationExercise(BaseModel):
    exercise: Exercise = Field(..., description="The activation exercise")
    movement_prep_type: MovementPrepType = MovementPrepType.activation
    reps: int = Field(..., description="The suggested number of repetitions to perform the activation exercise")

class MovementPrep(BaseModel):
    name: str = Field(..., description="The name of the movement preparation group")
    description: Optional[str] = Field(default=None, description="A description of the how the movement preparation benefits the client")
    foam_rolling_exercises: List[FoamRollingExercise] = Field(..., description="The foam rolling exercises used to prepare for the main workout")
    mobility_exercises: List[MobilityDrill] = Field(..., description="The mobility drills used to prepare for the main workout")
    activation_exercises: List[ActivationExercise] = Field(..., description="The activation exercises used to prepare for the main workout")

# Warmup
class WarmupType(str, Enum):
    dynamic = "dynamic"
    ladder = "ladder"
    power = "power"

class DynamicWarmup(BaseModel):
    exercise: Exercise = Field(..., description="The dynamic warmup exercise that usually involves some type of locomotion")
    warmup_type: WarmupType = WarmupType.dynamic
    reps: int = Field(..., description="The suggested number of repetitions to perform the dynamic warmup")

class LadderDrill(BaseModel):
    exercise: Exercise = Field(..., description="The ladder drill")
    warmup_type: WarmupType = WarmupType.ladder
    reps: int = Field(..., description="The suggested number of repetitions to perform the ladder drill")

class PowerWarmup(BaseModel):
    exercise: Exercise = Field(..., description="The power exercise used in warmup to engage fast-twich muscle fibers")
    warmup_type: WarmupType = WarmupType.power
    reps: int = Field(..., description="The suggested number of repetitions to perform the power exercise")

class Warmup(BaseModel):
    name: str = Field(..., description="The name of the warmup")
    description: Optional[str] = Field(default=None, description="A description of the warmup")
    dynamic_exercises: Optional[List[DynamicWarmup]] = Field(default=None, description="The dynamic exercises that incorporate locomotion")
    ladder_drills: Optional[List[LadderDrill]] = Field(default=None, description="The ladder drills that require an agility ladder")
    power_exercises: Optional[List[PowerWarmup]] = Field(default=None, description="The power warmup exercises that often incorporate medicine ball, bounds, jumping, etc.")

# Cooldown
class Cooldown(BaseModel):
    name: str = Field(..., description="The name of the cooldown")
    description: Optional[str] = Field(default=None, description="A description of the cooldown")
    cooldown_exercises: List[Exercise] = Field(..., description="Exercises that help the client cooldown and reduce their heart rate")

# Circuit
class CircuitExercise(BaseModel):
    order_in_circuit: int = Field(..., description="The number the denotes the order in which the exercise occurs in the circuit")
    exercise: Exercise
    reps: int = Field(..., description="The suggested number of repetitions to perform the exercise")
    rpe: int = Field(
        description="""A number from 1-10 the represents the perceived effort the client should give.
        Often this is used to help the client attribute a level of difficulty to the amount load used or their perceived difficulty of the exercise.
        This number is subjective from person to person based on their experience.""",
        gt=0,
        le=10
        )

class Circuit(BaseModel):
    circuit_number: int = Field(..., description="The number the denotes the order in which the circuit occurs in the main workout")
    exercises: List[CircuitExercise] = Field(..., description="The exercises you perform each round of the circuit", min_length=2, max_length=4)
    rounds: int = Field(..., Field="The number of rounds to perform the circuit")
    rest: int = Field(..., description="The rest (in minutes) to take between each round in the circuit")

# Workout Session
class WorkoutSession(BaseModel):
    session_of_week: int = Field(..., description="Number that represents the session within a given week", gt=0, le=4)
    week_of_program: int = Field(..., description="Number that represents the current week within the program", gt=0, le=4)
    movement_prep: MovementPrep
    warmup: Warmup
    circuits: List[Circuit] = Field(..., min_length=2, max_length=3)
    cooldown: Cooldown

# Program
class ProgramWeek(BaseModel):
    week_number: int = Field(..., description="Number that represents the week within a given program", gt=0, le=4)
    workout_sessions: List[WorkoutSession] = Field(..., description="A list of the sessions to be completed during the week")

class FitnessProgram(BaseModel):
    name: str = Field(..., description="The client the program is for")
    description: str = Field(..., description="A brief the description of the program, who it is for and its goals")
    weeks: List[ProgramWeek] = Field(..., min_length=4, max_length=4)

class WeekOutline(BaseModel):
    rationale: str = Field(..., description="A brief summary of the rationale for the week outline based on the client's fitness history")
    days: List[WorkoutOutline] = Field(..., description="A list of the workout outlines for the week")

class GenerateProgramInput(BaseModel):
    deepSquat: int = Field(..., description="The client's deep squat score")
    hurdleStep: int = Field(..., description="The client's hurdle step score")
    inlineLunge: int = Field(..., description="The client's inline lunge score")
    shoulderMobility: int = Field(..., description="The client's shoulder mobility score")
    activeStraightLegRaise: int = Field(..., description="The client's active straight leg raise score")
    trunkStabilityPushUp: int = Field(..., description="The client's trunk stability push-up score")
    rotaryStability: int = Field(..., description="The client's rotary stability score")
    coachNotes: str = Field(..., description="The coach's notes for the program")
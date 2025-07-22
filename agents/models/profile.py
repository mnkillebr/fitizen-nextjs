from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class HeightUnit(str, Enum):
    inches = "inches"
    centimeters = "centimeters"

class LoadUnit(str, Enum):
    bodyweight = "bodyweight"
    kilogram = "kilogram"
    pound = "pound"

class FitnessProfile(BaseModel):
    heightUnit: HeightUnit = Field(default="inches", description="The unit used for height measurement")
    height: Optional[int] = Field(default=None, description="The height of the client")
    unit: LoadUnit = Field(default="pound", description="The unit used for weight measurement")
    currentWeight: Optional[int] = Field(default=None, description="The current weight of the client")
    targetWeight: Optional[int] = Field(default=None, description="The desired weight of the client")
    goal_fatLoss: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants to lose fat")
    goal_endurance: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants to improve their endurance")
    goal_buildMuscle: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants to build muscle")
    goal_loseWeight: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants to lose weight")
    goal_improveBalance: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants to improve their balance")
    goal_improveFlexibility: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants to improve their flexibility")
    goal_learnNewSkills: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants to learn new skills")
    parq_heartCondition: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client has a heart condition")
    parq_chestPainActivity: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client experiences exercised-induced angina (chest pain)")
    parq_chestPainNoActivity: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client experiences chest pain when they are not exercising")
    parq_balanceConsciousness: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client loses their balance because of dizziness or loses consciousness")
    parq_boneJoint: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client has a bone or joint problem that could be made worse due to exercise")
    parq_bloodPressureMeds: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client wants takes medication for their blood pressure or for a heart condition")
    parq_otherReasons: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client has any other reasons they should not engage in physical activity")
    operational_occupation: Optional[str] = Field(default=None, description="The current occupation of the client")
    operational_extendedSitting: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client's occupation requires extended periods of sitting")
    operational_repetitiveMovements: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client's occupation has repetitive movements")
    operational_explanation_repetitiveMovements: Optional[str] = Field(default=None, description="An explanation of the repetitive movements")
    operational_heelShoes: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client's occupation requires them to wear shoes with an elevated heel")
    operational_mentalStress: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client's occupation causes them mental stress")
    recreational_physicalActivities: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client engages in other forms of physical activity or sports")
    recreational_explanation_physicalActivities: Optional[str] = Field(default=None, description="A description of the physical activities or sports that the client likes to engage in, if any")
    recreational_hobbies: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client has any recreational hobbies")
    recreational_explanation_hobbies: Optional[str] = Field(default=None, description="A description of the recreational hobbies")
    medical_injuriesPain: Optional[bool] = Field(default=None, description="A boolean value that indicates chronic pain or injuries")
    medical_explanation_injuriesPain: Optional[str] = Field(default=None, description="A description of the chronic pain or injuries")
    medical_surgeries: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client has undergone any surgeries")
    medical_explanation_surgeries: Optional[str] = Field(default=None, description="A description of the surgeries")
    medical_chronicDisease: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client has been diagnosed with a chronic disease such as high blood pressure, diabetes, high cholesterol, hypertension or heart disease")
    medical_explanation_chronicDisease: Optional[str] = Field(default=None, description="A description of the chronic disease")
    medical_medications: Optional[bool] = Field(default=None, description="A boolean value that indicates if the client is currently taking any prescription medication")
    medical_explanation_medications: Optional[str] = Field(default=None, description="A description of the medications")

class Client(BaseModel):
    name: str = Field(..., description="The name of the client")
    email: EmailStr = Field(..., description="The email of the client")
    age: int = Field(..., description="The age of the client")

class FMS(BaseModel):
    deep_squat: int = Field(..., description="The score of the client's deep squat", gt=0, le=3)
    hurdle_step: int = Field(..., description="The score of the client's hurdle step", gt=0, le=3)
    inline_lunge: int = Field(..., description="The score of the client's inline lunge", gt=0, le=3)
    shoulder_mobility: int = Field(..., description="The score of the client's shoulder mobility", gt=0, le=3)
    active_straight_leg_raise: int = Field(..., description="The score of the client's active straight leg raise", gt=0, le=3)
    trunk_stability_pushup: int = Field(..., description="The score of the client's trunk stability pushup", gt=0, le=3)
    rotary_stability: int = Field(..., description="The score of the client's rotary stability", gt=0, le=3)
    total_score: int = Field(..., description="The total score of the client's FMS", gt=0, le=21)

class BodyComposition(BaseModel):
    body_fat_percentage: float = Field(..., description="The body fat percentage of the client", gt=0, le=100)
    body_mass_index: float = Field(..., description="The body mass index of the client", gt=0, le=50)
    basal_metabolic_rate: float = Field(..., description="The basal metabolic rate of the client", ge=1000, le=10000)
    body_fat_mass: float = Field(..., description="The body fat mass of the client", gt=0, le=999)
    lean_body_mass: float = Field(..., description="The lean body mass of the client", gt=0, le=999)

class Gender(str, Enum):
    male = "male"
    female = "female"

class FlightAssessmentType(str, Enum):
    pilot = "pilot"
    flight_attendant = "flight_attendant"
    ground_crew = "ground_crew"
    air_traffic_controller = "air_traffic_controller"

class Persona(BaseModel):
    age_range: int = Field(..., description="The age range of the client", gt=0, le=100)
    gender: Gender = Field(..., description="The gender of the client")
    flight_assessment_type: Optional[FlightAssessmentType] = Field(
        ...,
        description="""
            The personality type revealed by the flight assessment.
            Pilots are individuals who show prowess in decision-making and problem-solving under pressure. Pilots are task-oriented, direct, and action-oriented. Pilots are the `get shit done` type.
            Flight attendants are individuals who are outgoing, energetic, and easily connect with others. Flight attendants enjoy interacting with others and expressing emotions. Flight attendants are the `social butterfly` type.
            Ground crew are individuals that prefer a steady pace and routine. Ground crew are natural team supporters, work well within established processes and they may need extra time to adjust to change.
            Air traffic controllers are individuals that are detail-oriented and systematic. Air traffic controllers prefer to complete their tasks correctly the first time, and value accuracy and thoroughness.
            These types will help you speak in a way that is appropriate for the client when selling them on the program.
        """)
    location: Optional[str] = Field(..., description="The location of the client")
    occupation: Optional[str] = Field(..., description="The occupation of the client")
    monthly_income: Optional[int] = Field(..., description="The monthly income of the client")
    interests: Optional[List[str]] = Field(..., description="The interests of the client")
    
# Pilots need a program that is presented with clear directions and a clear outcome.
# Air traffic controllers need a program that is presented with analytics, insights and metrics.
# Flight attendants need a program that is presented with new skills to learn and improve on.
# Ground crew needs a program that is presented with acknowledgements, incentives and rewards for consistency.
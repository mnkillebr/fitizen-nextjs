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
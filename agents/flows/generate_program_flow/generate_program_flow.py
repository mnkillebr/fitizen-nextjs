from crewai import LLM
from crewai.flow.flow import Flow, listen, start
from litellm import completion
from pydantic import BaseModel
from typing import List

from core.config import settings
from agents.models.profile import FMS
from agents.flows.generate_program_flow.crews.week_outline_crew.week_outline_crew import week_outline_crew
from agents.flows.generate_program_flow.crews.transform_outline_crew.transform_outline_crew import transform_outline_crew
from agents.models.program import WeekOutline
from agents.models.workout import WorkoutPlan

class ProgramState(BaseModel):
    fms_analysis: str = ""
    week_outline: WeekOutline = None
    week_plan: List[WorkoutPlan] = None
    # workout_plan: WorkoutPlan = None

class GenerateProgramFlow(Flow[ProgramState]):
    def __init__(self, query: str = None, fms: dict = None):
        super().__init__()
        self.query = query
        self.fms = fms
        self.days = 2
        self.weeks = 4
        self.model = "groq/llama-3.1-8b-instant"
   
    @start()
    def analyze_fms(self):
        print("Starting flow")
        print(f"Analyzing FMS: {self.fms}")
        print("Generating week outline ...")
        # Call the exercise selection crew
        result = week_outline_crew.kickoff(
            inputs={
                "fms": self.fms,
                "fitness_history": "minor ankle sprain in right ankle 5 years ago, but no other injuries. still active in tennis",
                "days": self.days,
            }
        )
        self.state.fms_analysis = result.tasks_output[0].raw
        self.state.week_outline = result.pydantic
        
        print("FMS Analysis: ", result.tasks_output[0].raw)
        print("Week Outline: ", result.pydantic)

        return result.pydantic
    
    @listen(analyze_fms)
    def generate_week_program(self, week_outline: WeekOutline):
        week_outline_dict = week_outline.model_dump()
        dayA_outline = week_outline_dict["days"][0]
        print("Transforming day A outline to workout plan")
        result = transform_outline_crew.kickoff(
            inputs={
                "workout_outline": dayA_outline,
            }
        )
        print("Workout Plan: ", result.pydantic)
        return result.pydantic
    
    # def generate_city(self):
    #     print("Starting flow")
    #     # Each flow state automatically gets a unique ID
    #     print(f"Flow State ID: {self.state['id']}")

    #     response = completion(
    #         model=self.model,
    #         messages=[
    #             {
    #                 "role": "user",
    #                 "content": f"Return the name of a random city in the country of {self.query}." if self.query else "Return the name of a random city in the world.",
    #             },
    #         ],
    #     )

    #     random_city = response["choices"][0]["message"]["content"]
    #     # Store the city in our state
    #     self.state["city"] = random_city
    #     print(f"Random City: {random_city}")

    #     return random_city

    # @listen(generate_city)
    # def generate_fun_fact(self, random_city):
    #     response = completion(
    #         model=self.model,
    #         messages=[
    #             {
    #                 "role": "user",
    #                 "content": f"Tell me a fun fact about {random_city}",
    #             },
    #         ],
    #     )

    #     fun_fact = response["choices"][0]["message"]["content"]
    #     # Store the fun fact in our state
    #     self.state["fun_fact"] = fun_fact
    #     return fun_fact


# Test FMS Inputs
test_fms = FMS(
    deep_squat=2,
    hurdle_step=2,
    inline_lunge=3,
    shoulder_mobility=2,
    active_straight_leg_raise=2,
    trunk_stability_pushup=3,
    rotary_stability=2,
    total_score=16
).model_dump()

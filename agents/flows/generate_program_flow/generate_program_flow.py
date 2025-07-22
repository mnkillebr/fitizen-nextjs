from crewai import LLM
from crewai.flow.flow import Flow, listen, start
from litellm import completion
from pydantic import BaseModel
from typing import List

from core.config import settings
from agents.models.profile import FMS
from agents.flows.generate_program_flow.crews.week_outline_crew.week_outline_crew import week_outline_crew
from agents.flows.generate_program_flow.crews.transform_outline_crew.transform_outline_crew import transform_outline_crew
from agents.flows.generate_program_flow.crews.program_progression_crew.program_progression_crew import program_progression_crew
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
        self.days = 3
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
        week_plan = []
        
        # Loop through all days in the week outline
        for i, day_outline in enumerate(week_outline_dict["days"]):
            print(f"Transforming day {chr(65 + i)} outline to workout plan")
            result = transform_outline_crew.kickoff(
                inputs={
                    "workout_outline": day_outline,
                }
            )
            week_plan.append(result.pydantic)
            print(f"Day {chr(65 + i)} Workout Plan: ", result.pydantic)
        
        # Store the complete week plan in state
        self.state.week_plan = week_plan
        print("Week Plan length: ", len(week_plan))
        return week_plan
    
    @listen(generate_week_program)
    def generate_weekly_progressions(self, week_plan: List[WorkoutPlan]):
        # Convert week_plan to list of dictionaries for easier processing
        week1_plan = [plan.model_dump() for plan in week_plan]
        remaining_weeks = self.weeks - 1  # Total weeks minus week 1
        full_program = {"week1": week1_plan}
        progressions = {}

        print(f"Generating progressions for {remaining_weeks} remaining weeks...")

        # Iterate through each day plan from week 1
        for day_plan in week1_plan:
            print(f"Generating progression for Day {day_plan['day']}")
            
            result = program_progression_crew.kickoff(
                inputs={
                    "workout_plan": day_plan,
                    "remaining_weeks": remaining_weeks
                }
            )

            progressions[f"day_{day_plan['day']}_progressions"] = result.pydantic.progressions
            print(f"Day {day_plan['day']} progressions generated")
        
        # Transform progressions from day-based to week-based structure
        print("Transforming progressions to week-based structure...")
        
        # Create week-based structure
        for week_idx in range(remaining_weeks):
            week_num = week_idx + 2  # Start from week 2
            week_plan = []
            
            # For each day, get the progression for this specific week
            for day_plan in week1_plan:
                day_key = f"day_{day_plan['day']}_progressions"
                week_progression = progressions[day_key][week_idx]
                week_plan.append(week_progression)
            
            full_program[f"week{week_num}"] = week_plan
            print(f"Week {week_num} structure created with {len(week_plan)} days")
        
        print("Full program generation completed")
        return full_program

        
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
    inline_lunge=2,
    shoulder_mobility=2,
    active_straight_leg_raise=2,
    trunk_stability_pushup=3,
    rotary_stability=2,
    total_score=15
).model_dump()

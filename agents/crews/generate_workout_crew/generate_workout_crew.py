from crewai import Agent, Task, Crew, LLM, Process
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
from crewai.project import CrewBase, agent, task, crew, before_kickoff, after_kickoff
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from core.config import settings
from agents.listeners.custom_listener import MyCustomListener
from models.movement import MovementPattern, MovementPlane, BalanceType

my_listener = MyCustomListener()

import os
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

# initialize models
llama8b_llm = LLM(model="groq/llama-3.1-8b-instant", api_key=settings.GROQ_API_KEY)

# Define file paths for YAML configurations
# files = {
#     'agents': 'crews/generate_workout_crew/config/agents.yaml',
#     'tasks': 'crews/generate_workout_crew/config/tasks.yaml'
# }

# Load configurations from YAML files
# configs = {}
# for config_type, file_path in files.items():
#     with open(file_path, 'r') as file:
#         configs[config_type] = yaml.safe_load(file)

# load pdf knowledge sources
pdf_source = PDFKnowledgeSource(
    file_paths=[
        "CFSC_Regression:Progression_Sheet_2023.pdf",
    ]   
)

@CrewBase
class GenerateWorkoutCrew:
    """
    Generate Workout Crew
    This crew generates a workout based on the user's input.
    The user provides the location, type, focus, and time of the workout.
    The crew then generates a workout based on the user's input.
    """

    agents: List[BaseAgent]
    tasks: List[Task]

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @before_kickoff
    def prepare_inputs(self, inputs):
        # Modify inputs before the crew starts
        inputs['additional_data'] = "Some extra information"
        return inputs

    @after_kickoff
    def process_output(self, output):
        # Modify output after the crew finishes
        output.raw += "\nProcessed after kickoff."
        return output

    @agent
    def workout_outline_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['workout_outline_agent'],
            llm=llama8b_llm,
            verbose=True
        )

    @agent
    def exercise_selection_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['exercise_selection_agent'],
            llm=llama8b_llm,
            knowledge_sources=[pdf_source],
            verbose=True
        )

    @task
    def outline_workout(self) -> Task:
        return Task(
            config=self.tasks_config['outline_workout'],
            agent=self.workout_outline_agent()
        )

    @task
    def select_exercises(self) -> Task:
        return Task(
            config=self.tasks_config['exercise_selection'],
            agent=self.exercise_selection_agent(),
            context=[self.outline_workout()]
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )

movement_patterns = [member.value for member in MovementPattern]
balance_type = [member.value for member in BalanceType]
movement_plane = [member.value for member in MovementPlane]
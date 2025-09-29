import yaml
from crewai import Agent, Task, Crew, LLM
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
from core.config import settings
# from agents.listeners.custom_listener import MyCustomListener
from agents.models.workout import WorkoutProgressions

# program_progression_listener = MyCustomListener()

import os
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

# initialize models
llama8b_llm = LLM(model="groq/llama-3.1-8b-instant", api_key=settings.GROQ_API_KEY)
llama_4_llm = LLM(model="groq/meta-llama/llama-4-maverick-17b-128e-instruct", api_key=settings.GROQ_API_KEY)
kimi_k2_llm = LLM(model="groq/moonshotai/kimi-k2-instruct-0905", api_key=settings.GROQ_API_KEY)

# Define file paths for YAML configurations
files = {
  'agents': 'flows/generate_program_flow/crews/program_progression_crew/config/agents.yaml',
  'tasks': 'flows/generate_program_flow/crews/program_progression_crew/config/tasks.yaml'
}

# Load configurations from YAML files
configs = {}
for config_type, file_path in files.items():
  with open(file_path, 'r') as file:
    configs[config_type] = yaml.safe_load(file)

# Assign loaded configurations to specific variables
agents_config = configs['agents']
tasks_config = configs['tasks']

# load pdf knowledge sources
pdf_source = PDFKnowledgeSource(
  file_paths=[
    "CFSC_Regression:Progression_Sheet_2023.pdf",
  ]
)

# Creating Agents
workout_progression_agent = Agent(
  config=agents_config['workout_progression_agent'],
  # llm=llama8b_llm,
  # llm=llama_4_llm,
  # llm=kimi_k2_llm,
  llm="gpt-4.1",
  knowledge_sources=[pdf_source],
  # reasoning=True,
)

# Creating Tasks
workout_progression_task = Task(
  config=tasks_config['add_progressions'],
  agent=workout_progression_agent,
  output_pydantic=WorkoutProgressions
)

# Creating Crew
program_progression_crew = Crew(
  agents=[
    workout_progression_agent,
  ],
  tasks=[
    workout_progression_task,
  ],
  verbose=True,
)

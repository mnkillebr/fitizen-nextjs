import yaml
from crewai import Agent, Task, Crew, LLM, Process
from core.config import settings
from agents.listeners.custom_listener import MyCustomListener
from agents.models.program import WeekOutline

week_outline_listener = MyCustomListener()

import os
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

# initialize models
llama8b_llm = LLM(model="groq/llama-3.1-8b-instant", api_key=settings.GROQ_API_KEY)

# Define file paths for YAML configurations
files = {
  'agents': 'flows/generate_program_flow/crews/week_outline_crew/config/agents.yaml',
  'tasks': 'flows/generate_program_flow/crews/week_outline_crew/config/tasks.yaml'
}

# Load configurations from YAML files
configs = {}
for config_type, file_path in files.items():
  with open(file_path, 'r') as file:
    configs[config_type] = yaml.safe_load(file)

# Assign loaded configurations to specific variables
agents_config = configs['agents']
tasks_config = configs['tasks']

# Creating Agents
fms_analysis_agent = Agent(
  config=agents_config['movement_screen_agent'],
  llm=llama8b_llm,
)

week_outline_agent = Agent(
  config=agents_config['week_outline_agent'],
  # llm=llama8b_llm,
  llm="gpt-4o",
  # reasoning=True,
)

group_class_instructor_agent = Agent(
  config=agents_config['group_class_instructor'],
  llm=llama8b_llm,
  reasoning=True,
)

# Creating Tasks
fms_analysis_task = Task(
  config=tasks_config['fms_analysis'],
  agent=fms_analysis_agent,
)

week_outline_task = Task(
  config=tasks_config['week_outline'],
  agent=week_outline_agent,
  context=[fms_analysis_task],
  output_pydantic=WeekOutline
)

group_class_task = Task(
  config=tasks_config['group_class'],
  agent=group_class_instructor_agent,
)

# Creating Crew
week_outline_crew = Crew(
  agents=[
    fms_analysis_agent,
    week_outline_agent,
    # group_class_instructor_agent,
  ],
  tasks=[
    fms_analysis_task,
    week_outline_task,
    # group_class_task,
  ],
  verbose=True,
  process=Process.sequential,
)

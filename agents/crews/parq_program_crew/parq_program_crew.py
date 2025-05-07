import yaml
from crewai import Agent, Task, Crew, LLM
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
# from models.program import FitnessProgram
from models.profile import Client, FitnessProfile
from models.movement import MovementPattern, MovementPlane, BalanceType
from core.config import settings

import os
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY
# initialize models
# qwen_qwq_llm = LLM(model="groq/qwen-qwq-32b", api_key=settings.GROQ_API_KEY)
# llama70b_llm = LLM(model="groq/llama-3.3-70b-versatile", api_key=settings.GROQ_API_KEY)
# gpt_4o_llm = LLM(model="openai/gpt-4o-mini", api_key=settings.OPENAI_API_KEY)
llama8b_llm = LLM(model="groq/llama-3.1-8b-instant", api_key=settings.GROQ_API_KEY)

# Define file paths for YAML configurations
files = {
    'agents': 'crews/parq_program_crew/config/agents.yaml',
    'tasks': 'crews/parq_program_crew/config/tasks.yaml'
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
fitness_program_agent = Agent(
  config=agents_config['fitness_program_agent'],
  llm=llama8b_llm,
  knowledge_sources=[pdf_source],
)

profile_analyst_agent = Agent(
  config=agents_config['profile_analyst_agent'],
  llm=llama8b_llm
)

# Creating Tasks
profile_analysis_task = Task(
  config=tasks_config['fitness_profile_breakdown'],
  agent=profile_analyst_agent,
  # output_pydantic=ProfileAnalysis
)

program_design_task = Task(
  config=tasks_config['fitness_program_designer'],
  agent=fitness_program_agent,
  context=[profile_analysis_task],
  # output_pydantic=FitnessProgram
)

# Creating Crew
parq_program_crew = Crew(
  agents=[
    profile_analyst_agent,
    fitness_program_agent,
  ],
  tasks=[
    profile_analysis_task,
    program_design_task
  ],
  verbose=True,
)

# Test Crew Inputs
client = Client(name="Brooke Lynn", email="brooke.lynn@status.com", age=32).model_dump()
fitness_profile = FitnessProfile(
    height=66,
    currentWeight=173,
    targetWeight=170,
    goal_fatLoss=True,
    goal_learnNewSkills=True,
    goal_endurance=True,
    operational_occupation="Business Advisor",
    operational_extendedSitting=True,
    operational_heelShoes=False,
    operational_mentalStress=True,
    operational_repetitiveMovements=False,
    recreational_physicalActivities=True,
    recreational_explanation_physicalActivities="roller blading, cycling",
    recreational_hobbies=True,
    recreational_explanation_hobbies="reading",
    medical_chronicDisease=False,
    medical_injuriesPain=True,
    medical_explanation_injuriesPain="back and neck pain",
    medical_medications=True,
    medical_explanation_medications="prozac",
    medical_surgeries=True,
    medical_explanation_surgeries="breast reduction"
).model_dump()
movement_patterns = [member.value for member in MovementPattern]
balance_type = [member.value for member in BalanceType]
movement_plane = [member.value for member in MovementPlane]
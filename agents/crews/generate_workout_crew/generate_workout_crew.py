import yaml
from crewai import Agent, Task, Crew, LLM
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
from core.config import settings

import os
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

# initialize models
llama8b_llm = LLM(model="groq/llama-3.1-8b-instant", api_key=settings.GROQ_API_KEY)

# Define file paths for YAML configurations
files = {
    'agents': 'crews/generate_workout_crew/config/agents.yaml',
    'tasks': 'crews/generate_workout_crew/config/tasks.yaml'
}

# Load configurations from YAML files
configs = {}
for config_type, file_path in files.items():
    with open(file_path, 'r') as file:
        configs[config_type] = yaml.safe_load(file)

# Assign loaded configurations to specific variables
agents_config = configs['agents']
tasks_config = configs['tasks']
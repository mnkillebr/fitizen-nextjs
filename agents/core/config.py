from typing import Set

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # CORS
    CORS_ORIGINS: Set[str] = Field(..., env="CORS_ORIGINS")

    # PORT
    PORT: int = Field(..., env="PORT")

    # LLMS
    OPENAI_API_KEY: str = Field(..., env="OPENAI_API_KEY")
    GROQ_API_KEY: str = Field(..., env="GROQ_API_KEY")

    #Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    TEST_DATABASE_URL: str = Field(..., env="TEST_DATABASE_URL")
    EXPIRE_ON_COMMIT: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

settings = Settings()
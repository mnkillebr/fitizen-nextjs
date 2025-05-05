from typing import Set

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # CORS
    CORS_ORIGINS: Set[str] = Field(..., env="CORS_ORIGINS")

    # PORT
    PORT: int = Field(..., env="PORT")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

settings = Settings()
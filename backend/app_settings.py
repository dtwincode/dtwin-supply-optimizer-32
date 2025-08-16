from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

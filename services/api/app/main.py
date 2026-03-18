from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings
from app.db.session import init_db

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


@app.on_event("startup")
async def startup_event() -> None:
    if settings.auto_create_tables:
        await init_db()


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}

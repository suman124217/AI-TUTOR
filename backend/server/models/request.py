from pydantic import BaseModel
from typing import Any


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    phase: str
    profile_complete: bool


class RoadmapRequest(BaseModel):
    session_id: str


class RoadmapResponse(BaseModel):
    session_id: str
    roadmap: dict[str, Any]   # ✅ typed generic dict, fixes "Missing type argument"
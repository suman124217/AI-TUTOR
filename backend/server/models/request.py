from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    session_id: str          #unique tabs 
    message: str             #latest message sent


class ChatResponse(BaseModel):
    session_id: str
    reply: str               # Claude reply 
    phase: str               # "interview" | "roadmap" | "followup"
    profile_complete: bool   # True once all 6 fields are collected


class RoadmapRequest(BaseModel):
    session_id: str          # must already have a completed profile in session


class RoadmapResponse(BaseModel):
    session_id: str
    roadmap: dict            #JSON roadmap
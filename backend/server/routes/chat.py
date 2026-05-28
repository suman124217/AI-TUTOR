import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.request import ChatRequest, ChatResponse
from services.session import (
    get_or_create_session,
    append_message,
    set_profile,
    clear_session,
)
# Changed: Importing Gemini services instead of 
from services.gemini import stream_gemini, extract_json_from_response
from prompts.interview import INTERVIEW_PROMPT
from prompts.followup import FOLLOWUP_PROMPT

router = APIRouter()


def format_messages_for_gemini(messages: list[dict]) -> list[dict]:
    """
    Converts standard message history [{'role': '...', 'content': '...'}]
    into the format expected by the google-genai SDK [{'role': '...', 'parts': [...]}]
    """
    formatted = []
    for msg in messages:
        # Map 'assistant' role to 'model' for Gemini compatibility
        role = "model" if msg["role"] == "assistant" else msg["role"]
        formatted.append({
            "role": role,
            "parts": [msg["content"]]
        })
    return formatted


# ── POST /api/chat ─────────────────────────────────────────────────────────────
# Main chat endpoint. Streams Gemini's reply back using Server-Sent Events (SSE).
# The frontend should consume this with EventSource or fetch + ReadableStream.
@router.post("/chat")
async def chat(body: ChatRequest):
    session = get_or_create_session(body.session_id)

    # Pick the right system prompt based on the current phase
    if session["phase"] == "followup":
        system_prompt = FOLLOWUP_PROMPT
    else:
        system_prompt = INTERVIEW_PROMPT

    # Add the user's message to history
    append_message(body.session_id, "user", body.message)

    # Convert session messages to Gemini's native 'parts' format
    gemini_messages = format_messages_for_gemini(session["messages"])

    # Collect the full streamed reply so we can post-process it
    full_reply = ""

    async def event_stream():
        nonlocal full_reply

        # Changed: Now calling stream_gemini with formatted messages
        async for chunk in stream_gemini(system_prompt, gemini_messages):
            full_reply += chunk
            # SSE format: each chunk prefixed with "data: "
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"

        # ── Post-stream processing ─────────────────────────────────────────
        # Check if Gemini signalled that the interview is complete
        if "[PROFILE_COMPLETE]" in full_reply and not session["profile_complete"]:
            try:
                profile = extract_json_from_response(full_reply)
                set_profile(body.session_id, profile)
            except ValueError:
                # Profile parsing failed — keep going, roadmap route will retry
                pass

        # Save Gemini's full reply to session history
        clean_reply = full_reply
        if "[PROFILE_COMPLETE]" in full_reply:
            clean_reply = full_reply.split("[PROFILE_COMPLETE]")[0].strip()

        append_message(body.session_id, "assistant", clean_reply)

        # Sending SSE event for frontend
        yield f"data: {json.dumps({'done': True, 'phase': session['phase'], 'profile_complete': session['profile_complete']})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # for Nginx/proxy setups
        },
    )


#GET /api/chat/start 

@router.get("/chat/start")
async def start_chat(session_id: str):
    session = get_or_create_session(session_id)

    #no repaeter
    if session["messages"]:
        return {"reply": None, "phase": session["phase"]}

    opening = (
        "Hey! I'm your AI Career Tutor I'll help you build a personalized roadmap to reach your goal.\n\n"
        "Let's start simple — what role or field are you trying to get into?"
    )

    append_message(session_id, "assistant", opening)

    return {"reply": opening, "phase": "interview"}


# DELETE /api/chat/session 
@router.delete("/chat/session")
async def delete_session(session_id: str):
    cleared = clear_session(session_id)
    return {"cleared": cleared, "session_id": session_id}


# GET /api/chat/session 
# Debug/restore endpoint
@router.get("/chat/session")
async def get_session_state(session_id: str):
    from services.session import get_session
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {
        "session_id":       session_id,
        "phase":            session["phase"],
        "profile_complete": session["profile_complete"],
        "profile":          session["profile"],
        "message_count":    len(session["messages"]),
    }

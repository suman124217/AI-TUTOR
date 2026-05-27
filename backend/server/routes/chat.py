import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.request import ChatRequest, ChatResponse
from services.session import (
    get_or_create_session,
    append_message,
    set_profile,
    set_phase,
    clear_session,
)
from services.claude import stream_claude, extract_json_from_response
from prompts.interview import INTERVIEW_PROMPT
from prompts.followup import FOLLOWUP_PROMPT

router = APIRouter()


# ── POST /api/chat ─────────────────────────────────────────────────────────────
# Main chat endpoint. Streams Claude's reply back using Server-Sent Events (SSE).
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

    # Collect the full streamed reply so we can post-process it
    full_reply = ""

    async def event_stream():
        nonlocal full_reply

        async for chunk in stream_claude(system_prompt, session["messages"]):
            full_reply += chunk
            # SSE format: each chunk prefixed with "data: "
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"

        # ── Post-stream processing ─────────────────────────────────────────
        # Check if Claude signalled that the interview is complete
        if "[PROFILE_COMPLETE]" in full_reply and not session["profile_complete"]:
            try:
                profile = extract_json_from_response(full_reply)
                set_profile(body.session_id, profile)
            except ValueError:
                # Profile parsing failed — keep going, roadmap route will retry
                pass

        # Save Claude's full reply to session history

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
            "X-Accel-Buffering": "no",   #for Nginx/proxy setups
        },
    )


#GET /api/chat/start 
# Calling this when the user first lands
# Returns Claude's opening greeting 
@router.get("/chat/start")
async def start_chat(session_id: str):
    session = get_or_create_session(session_id)

    # If session already has messages, don't repeat the greeting
    if session["messages"]:
        return {"reply": None, "phase": session["phase"]}

    opening = (
        "Hey! I'm your AI Career Tutor I'll help you build a personalized roadmap to reach your goal.\n\n"
        "Let's start simple — what role or field are you trying to get into?"
    )

    append_message(session_id, "assistant", opening)

    return {"reply": opening, "phase": "interview"}


#DELETE /api/chat/session 

@router.delete("/chat/session")
async def delete_session(session_id: str):
    cleared = clear_session(session_id)
    return {"cleared": cleared, "session_id": session_id}


#GET /api/chat/session 
#Debug/restore endpoint

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
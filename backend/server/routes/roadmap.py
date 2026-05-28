from fastapi import APIRouter, HTTPException
from models.request import RoadmapRequest
from services.session import get_session, set_phase
from services.gemini import call_gemini, extract_json_from_response
from prompts.roadmap import ROADMAP_PROMPT

router = APIRouter()


# ── POST /api/roadmap/generate ─────────────────────────────────────────────────
# Triggers full roadmap generation for a session that has a completed profile.
# Returns the structured JSON roadmap + a short summary paragraph.

@router.post("/roadmap/generate")
async def generate_roadmap(body: RoadmapRequest):
    session = get_session(body.session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found. Start a chat first.")

    if not session["profile_complete"]:
        raise HTTPException(
            status_code=400,
            detail="Profile is not complete yet. Continue the interview first."
        )

    if not session["profile"]:
        raise HTTPException(
            status_code=400,
            detail="Profile data missing. Something went wrong during the interview phase."
        )

    #passing convo to gemini
    #explicitly inject the profile JSON
    import json
    profile_injection = {
        "role": "user",
        "content": (
            f"Here is the collected profile in JSON format:\n"
            f"```json\n{json.dumps(session['profile'], indent=2)}\n```\n\n"
            "Please generate my personalized career roadmap now."
        )
    }

    messages_with_profile = session["messages"] + [profile_injection]

    # Call  
    raw_response = call_gemini(ROADMAP_PROMPT, messages_with_profile)

    # Parse the JSON roadmap out of gemini's response
    try:
        roadmap_json = extract_json_from_response(raw_response)
    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse roadmap JSON: {str(e)}"
        )

    # Extract the summary paragraph 
    summary = ""
    if "```json" in raw_response:
        summary = raw_response.split("```json")[0].strip()
    elif "```" in raw_response:
        summary = raw_response.split("```")[0].strip()

    # Saveing the roadmap to session and advance phase to followup
    session["roadmap"] = roadmap_json
    set_phase(body.session_id, "followup")

    # Add a note to conversation history so gemini remembers the roadmap was delivered
    session["messages"].append({
        "role": "assistant",
        "content": f"I've generated your personalized roadmap. {summary}"
    })

    return {
        "session_id":  body.session_id,
        "summary":     summary,
        "roadmap":     roadmap_json,
        "phase":       "followup",
    }

#GET /api/roadmap
#Returns the stored roadmap for a session.
@router.get("/roadmap")
async def get_roadmap(session_id: str):
    session = get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    roadmap = session.get("roadmap")
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not generated yet.")

    return {
        "session_id": session_id,
        "roadmap":    roadmap,
        "phase":      session["phase"],
    }
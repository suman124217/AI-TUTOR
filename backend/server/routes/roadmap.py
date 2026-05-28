import json
from fastapi import APIRouter, HTTPException, Request
from services.session import get_session, get_or_create_session, set_profile, set_phase
from services.gemini import client, MODEL, extract_json_from_response
from prompts.roadmap import ROADMAP_PROMPT
from google.genai import types

router = APIRouter()


@router.post("/roadmap/generate")
async def generate_roadmap(request: Request):
    body = await request.json()

    is_session_mode = ("session_id" in body and len(body.keys()) == 1)

    if is_session_mode:
        session_id = body["session_id"]
        session = get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")
        if not session["profile_complete"]:
            raise HTTPException(status_code=400, detail="Profile not complete yet.")
        profile = session["profile"]
    else:
        session_id = "form_" + str(abs(hash(json.dumps(body, sort_keys=True))))
        session = get_or_create_session(session_id)
        set_profile(session_id, body)
        profile = body

    prompt_text = (
        ROADMAP_PROMPT +
        "\n\nHere is the user profile:\n" +
        json.dumps(profile, indent=2) +
        "\n\nGenerate a complete personalized career roadmap based on this profile."
    )

    config = types.GenerateContentConfig(
        max_output_tokens=9000
    )

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt_text,
        config=config
    )

    # Guard against None response text
    raw_response: str = response.text or ""

    try:
        roadmap_json = extract_json_from_response(raw_response)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse roadmap: {str(e)}")

    summary = ""
    if "```json" in raw_response:
        summary = raw_response.split("```json")[0].strip()
    elif "```" in raw_response:
        summary = raw_response.split("```")[0].strip()

    # Use session service layer instead of direct dict mutation
    set_phase(session_id, "followup")
    updated_session = get_session(session_id)
    if updated_session is not None:
        updated_session["roadmap"] = roadmap_json

    return {
        "session_id": session_id,
        "summary":    summary,
        "roadmap":    roadmap_json,
        "phase":      "followup",
    }


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
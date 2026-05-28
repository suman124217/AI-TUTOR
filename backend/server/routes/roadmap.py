import os
import json

from fastapi import APIRouter, HTTPException, Request
from dotenv import load_dotenv

from google import genai
from google.genai import types

from services.session import (
    get_session,
    get_or_create_session,
    set_profile,
    set_phase,
)

from services.gemini import extract_json_from_response
from prompts.roadmap import ROADMAP_PROMPT


# ─────────────────────────────────────────────────────────────
# ENV
# ─────────────────────────────────────────────────────────────

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing in .env file")


# ─────────────────────────────────────────────────────────────
# GEMINI CLIENT
# ─────────────────────────────────────────────────────────────

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL = "gemini-2.5-flash"


# ─────────────────────────────────────────────────────────────
# ROUTER
# ─────────────────────────────────────────────────────────────

router = APIRouter()


# ─────────────────────────────────────────────────────────────
# GENERATE ROADMAP
# ─────────────────────────────────────────────────────────────

@router.post("/roadmap/generate")
async def generate_roadmap(request: Request):

    try:
        body = await request.json()

        print("Incoming body:", body)

        # -----------------------------------------------------
        # SESSION MODE
        # -----------------------------------------------------

        is_session_mode = (
            "session_id" in body and len(body.keys()) == 1
        )

        if is_session_mode:

            session_id = body["session_id"]

            session = get_session(session_id)

            if not session:
                raise HTTPException(
                    status_code=404,
                    detail="Session not found."
                )

            if not session.get("profile_complete"):
                raise HTTPException(
                    status_code=400,
                    detail="Profile not complete yet."
                )

            profile = session["profile"]

        # -----------------------------------------------------
        # DIRECT FORM MODE
        # -----------------------------------------------------

        else:

            session_id = "form_" + str(
                abs(hash(json.dumps(body, sort_keys=True)))
            )

            session = get_or_create_session(session_id)

            set_profile(session_id, body)

            profile = body

        print("Profile received:", profile)

        # -----------------------------------------------------
        # BUILD PROMPT
        # -----------------------------------------------------

        prompt_text = f"""
{ROADMAP_PROMPT}

Here is the user profile:

{json.dumps(profile, indent=2)}

Generate a complete personalized career roadmap in valid JSON format.
"""

        print("Calling Gemini...")

        # -----------------------------------------------------
        # GEMINI CONFIG
        # -----------------------------------------------------

        config = types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(
                thinking_budget=0
            )
        )

        # -----------------------------------------------------
        # GEMINI CALL
        # -----------------------------------------------------

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt_text,
            config=config,
        )

        raw_response = response.text

        print("Gemini response received")
        print(raw_response)

        if not raw_response:
            raise HTTPException(
                status_code=500,
                detail="Empty response from Gemini."
            )

        # -----------------------------------------------------
        # PARSE JSON
        # -----------------------------------------------------

        try:
            roadmap_json = extract_json_from_response(
                raw_response
            )

        except Exception as e:
            print("JSON PARSE ERROR:", str(e))

            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse roadmap JSON: {str(e)}"
            )

        # -----------------------------------------------------
        # SUMMARY EXTRACTION
        # -----------------------------------------------------

        summary = ""

        if "```json" in raw_response:
            summary = raw_response.split("```json")[0].strip()

        elif "```" in raw_response:
            summary = raw_response.split("```")[0].strip()

        # -----------------------------------------------------
        # SAVE SESSION
        # -----------------------------------------------------

        session["roadmap"] = roadmap_json

        set_phase(session_id, "followup")

        # -----------------------------------------------------
        # RESPONSE
        # -----------------------------------------------------

        return {
            "success": True,
            "session_id": session_id,
            "summary": summary,
            "roadmap": roadmap_json,
            "phase": "followup",
        }

    except HTTPException:
        raise

    except Exception as e:

        print("ROADMAP ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ─────────────────────────────────────────────────────────────
# GET ROADMAP
# ─────────────────────────────────────────────────────────────

@router.get("/roadmap")
async def get_roadmap(session_id: str):

    session = get_session(session_id)

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found."
        )

    roadmap = session.get("roadmap")

    if not roadmap:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not generated yet."
        )

    return {
        "success": True,
        "session_id": session_id,
        "roadmap": roadmap,
        "phase": session.get("phase"),
    }
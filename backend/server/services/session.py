import time
from typing import Any, Optional

# ── In-memory store ───────────────────────────────────────────────────────────
# Key   → session_id (str)
# Value → session dict (see structure below)

_sessions: dict[str, dict[str, Any]] = {}


def get_or_create_session(session_id: str) -> dict[str, Any]:
    """
    Returns an existing session or creates a fresh one.

    Session structure:
    {
        "messages":        [],           # full conversation history sent to gemini
        "profile":         None,         # filled once interview phase completes
        "phase":           "interview",  # interview → roadmap → followup
        "profile_complete": False,       # flips True when [PROFILE_COMPLETE] tag seen
        "user_turns":      0,            # counts how many times user has responded
        "roadmap":         None,         # filled after roadmap generation
        "created_at":      float,        # unix timestamp for expiry tracking
    }
    """
    if session_id not in _sessions:
        _sessions[session_id] = {
            "messages": [],
            "profile": None,
            "phase": "interview",
            "profile_complete": False,
            "user_turns": 0,
            "roadmap": None,
            "created_at": time.time(),
        }
    return _sessions[session_id]


def get_session(session_id: str) -> Optional[dict[str, Any]]:
    """Returns a session if it exists, else None."""
    return _sessions.get(session_id)


def clear_session(session_id: str) -> bool:
    """Deletes a session (useful for 'start over' button in UI)."""
    if session_id in _sessions:
        del _sessions[session_id]
        return True
    return False


def append_message(session_id: str, role: str, content: str) -> None:
    """Appends a single message to the session's conversation history."""
    session = get_or_create_session(session_id)
    session["messages"].append({"role": role, "content": content})
    if role == "user":
        session["user_turns"] += 1


def set_profile(session_id: str, profile: dict[str, Any]) -> None:
    """Stores the extracted user profile and marks the interview as complete."""
    session = get_or_create_session(session_id)
    session["profile"] = profile
    session["profile_complete"] = True
    session["phase"] = "roadmap"


def set_phase(session_id: str, phase: str) -> None:
    """Manually advance the session phase."""
    session = get_or_create_session(session_id)
    session["phase"] = phase


def set_roadmap(session_id: str, roadmap: dict[str, Any]) -> None:
    """Stores the generated roadmap in the session."""
    session = get_or_create_session(session_id)
    session["roadmap"] = roadmap
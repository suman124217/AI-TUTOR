import os
import json
import anthropic
from typing import AsyncGenerator

# ── Client ────────────────────────────────────────────────────────────────────
# Reads ANTHROPIC_API_KEY from environment automatically
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 2048


def call_claude(system_prompt: str, messages: list[dict]) -> str:
    """
    Standard (non-streaming) Claude call.
    Returns the full text response as a string.
    Used for roadmap generation where we need the full JSON before rendering.
    """
    response = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=system_prompt,
        messages=messages,
    )
    return response.content[0].text


async def stream_claude(
    system_prompt: str,
    messages: list[dict]
) -> AsyncGenerator[str, None]:
    """
    Streaming Claude call — yields text chunks as they arrive.
    Used for the chat/interview phase so replies feel real-time.
    Each yielded chunk is a raw text delta (string).
    """
    with client.messages.stream(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=system_prompt,
        messages=messages,
    ) as stream:
        for text_chunk in stream.text_stream:
            yield text_chunk


def extract_json_from_response(text: str) -> dict:
    """
    Safely pulls a JSON block out of Claude's response.
    Claude wraps JSON in ```json ... ``` fences — this strips them.
    Falls back to raw parse if no fences found.
    """
    try:
        # Try to find fenced JSON block first
        if "```json" in text:
            start = text.index("```json") + 7
            end = text.index("```", start)
            json_str = text[start:end].strip()
        elif "```" in text:
            start = text.index("```") + 3
            end = text.index("```", start)
            json_str = text[start:end].strip()
        else:
            json_str = text.strip()

        return json.loads(json_str)
    except (ValueError, json.JSONDecodeError) as e:
        raise ValueError(f"Could not parse JSON from Claude response: {e}\n\nRaw text:\n{text}")
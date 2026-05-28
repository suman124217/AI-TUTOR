import os
import json
import asyncio
from typing import AsyncGenerator, Any
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.5-flash"


def call_gemini(system_prompt: str, messages: list[dict[str, Any]]) -> str:
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=messages,  # type: ignore[arg-type]
        config=config
    )
    return response.text or ""   # ✅ fixes "str | None not assignable to str"


async def stream_gemini(
    system_prompt: str,
    messages: list[dict[str, Any]]   # ✅ fixes "partially unknown" + missing type arg
) -> AsyncGenerator[str, None]:
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
    )
    response_stream = client.models.generate_content_stream(
        model=MODEL,
        contents=messages,  # type: ignore[arg-type]
        config=config
    )
    for chunk in response_stream:
        if chunk.text:
            yield chunk.text
            await asyncio.sleep(0)  # ✅ also fixes the sync-in-async issue


def extract_json_from_response(text: str) -> dict[str, Any]:
    try:
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

        return json.loads(json_str)          # ✅ explicit return inside try

    except (ValueError, json.JSONDecodeError) as e:
        raise ValueError(                    # ✅ raise is now clearly in except block
            f"Could not parse JSON from Gemini response: {e}\n\nRaw text:\n{text}"
        )
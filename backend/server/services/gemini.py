import os
import json
from typing import AsyncGenerator
from google import genai
from google.genai import types
from dotenv import load_dotenv

#Client 

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

# Recommended model for general text and reasoning tasks
MODEL = "gemini-2.5-flash" 


def call_gemini(system_prompt: str, messages: list[dict]) -> str:
    """
    Standard (non-streaming) Gemini call.
    Returns the full text response as a string.
    """
    #mapping message for binding generate content
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
    )
    
    response = client.models.generate_content(
        model=MODEL,
        contents=messages,
        config=config
    )
    return response.text


async def stream_gemini(
    system_prompt: str,
    messages: list[dict]
) -> AsyncGenerator[str, None]:
    """
    Streaming Gemini call — yields text chunks as they arrive.
    Each yielded chunk is a raw text delta (string).
    """
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
    )
    
    # generate_content_stream returns an iterable response object
    response_stream = client.models.generate_content_stream(
        model=MODEL,
        contents=messages,
        config=config
    )
    
    for chunk in response_stream:
        if chunk.text:
            yield chunk.text


def extract_json_from_response(text: str) -> dict:
    """
    Safely pulls a JSON block out of Gemini's response.
    Gemini wraps JSON in ```json ... ``` fences — this strips them.
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
        raise ValueError(f"Could not parse JSON from Gemini response: {e}\n\nRaw text:\n{text}")

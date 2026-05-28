import axios from 'axios'

// ── Axios instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── 1. Start a new chat session ────────────────────────────────────────────
// Call this on page load to get the opening greeting from the bot
// Returns: { reply: "Hey! I'm your AI Career Tutor...", phase: "interview" }
export const startChat = (sessionId) =>
  api.get('/api/chat/start', { params: { session_id: sessionId } })

// ── 2. Send a chat message (NON-streaming) ─────────────────────────────────
// Use this if you want a simple request/response without streaming
// Returns: full reply once complete
export const sendMessage = (sessionId, message) =>
  api.post('/api/chat', { session_id: sessionId, message })

// ── 3. Send a chat message (STREAMING) ────────────────────────────────────
// Use this for real-time typing effect in the chat UI
// onChunk(text) is called for every streamed piece of text
// onDone({ phase, profile_complete }) is called when stream finishes
export const sendMessageStream = async (sessionId, message, onChunk, onDone) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    // Each SSE chunk looks like: "data: {...}\n\n"
    const raw = decoder.decode(value)
    const lines = raw.split('\n').filter(line => line.startsWith('data: '))

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line.replace('data: ', ''))

        if (parsed.chunk) {
          // Text chunk — pass to UI for rendering
          onChunk(parsed.chunk)
        }

        if (parsed.done) {
          // Stream finished — pass metadata to caller
          onDone({ phase: parsed.phase, profileComplete: parsed.profile_complete })
        }
      } catch {
        // Ignore malformed chunks
      }
    }
  }
}

// ── 4. Generate roadmap ────────────────────────────────────────────────────
// Call this AFTER profile_complete is true (after interview phase)
// Returns: { summary: "...", roadmap: { ...full JSON... }, phase: "followup" }
export const generateRoadmap = (userProfile) =>
  api.post('/api/roadmap/generate', userProfile)

// ── 5. Get stored roadmap ──────────────────────────────────────────────────
// Call this on page refresh to restore roadmap without regenerating
// Returns: { roadmap: { ...full JSON... }, phase: "followup" }
export const getRoadmap = (sessionId) =>
  api.get('/api/roadmap', { params: { session_id: sessionId } })

// ── 6. Get session state ───────────────────────────────────────────────────
// Useful on page refresh to restore phase and check if profile is complete
// Returns: { phase, profile_complete, profile, message_count }
export const getSessionState = (sessionId) =>
  api.get('/api/chat/session', { params: { session_id: sessionId } })

// ── 7. Clear session (start over) ─────────────────────────────────────────
// Call this when user clicks "Start Over" button
export const clearSession = (sessionId) =>
  api.delete('/api/chat/session', { params: { session_id: sessionId } })
# Talk to Founder — Maneuver Voice AI Agent

This is a complete, production-grade Voice AI application built using the LiveKit Agents framework. It allows users to have a real-time, low-latency voice conversation with an AI agent acting as the founder of Maneuver.

## Features

- **Low-Latency Voice Pipeline**: Uses Deepgram Nova-3 for STT and Gemini 2.5 Flash for LLM inference.
- **Zero-Latency TTS**: Uses the Browser Speech Synthesis API for instant text-to-speech without network overhead.
- **Synchronized Visual Layer**: The React frontend reacts to the conversation in real-time. When the agent discusses services, process, or case studies, the UI updates instantly via LiveKit RPC tool calls.
- **Live Lead Capture**: As the agent learns about the visitor (name, company, problem, budget), the data appears live on the screen and is persisted to JSON.
- **Dual-Mode Intelligence**: A single agent fluidly handles both proactive discovery questions and reactive knowledge-base Q&A.

## Architecture

1. **Python Backend**: Uses `AgentServer` and `AgentSession` (LiveKit v1.5 API) to manage the WebRTC connection, voice pipeline, and agent tools. Includes an embedded FastAPI server for token generation.
2. **React Frontend**: Built with Vite, TailwindCSS v4, and Framer Motion for premium glassmorphism aesthetics. Uses `@livekit/components-react` for session management.

## Setup & Running Locally

### Prerequisites
- Python 3.11+
- Node.js 20+
- A [LiveKit Cloud](https://cloud.livekit.io) account (free tier)
- A [Deepgram](https://console.deepgram.com) API key
- A [Google AI Studio](https://aistudio.google.com) API key (for Gemini)

### 1. Configure Environment

In `agent/`, copy `.env.example` to `.env.local` and add your keys:

```bash
cp agent/.env.example agent/.env.local
# Edit agent/.env.local and add LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, DEEPGRAM_API_KEY, and GOOGLE_API_KEY
```

### 2. Start the Python Agent Backend

We use `uv` for fast Python dependency management.

```bash
cd agent
uv sync
uv run src/agent.py dev
```

*(This will start both the LiveKit Agent Server and the token server on port 8081).*

### 3. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## What I'd do with another week

1. **Server-Side TTS Upgrade**: Swap the browser SpeechSynthesis for Cartesia or ElevenLabs via `livekit-plugins-cartesia` for a more natural, emotional voice, utilizing LiveKit's WebRTC audio tracks.
2. **Persistent Memory**: Connect the `LeadManager` to a real database (PostgreSQL/Supabase) and use user sessions so the agent remembers visitors who return.
3. **Multi-Agent Handoff**: If the visitor is ready to buy, the Founder Agent could use `session.transfer()` to hand off to a "Scheduling Agent" that explicitly books a calendar slot.
4. **Agent State Observability**: Send the `lead_manager` data to a real-time admin dashboard using WebSocket/LiveKit DataChannels so Maneuver staff can watch discovery calls live.

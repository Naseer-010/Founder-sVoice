# 🎙️ Maneuver — Voice AI "Talk to Founder" Agent

A real-time voice AI agent that simulates a conversation with a startup founder. Visitors land on the website, click **"Start Conversation,"** and have a live voice call with an AI agent that discovers their needs, answers questions about Maneuver's services, and captures lead information — all in real time.

---

## 🏗️ Architecture & Pipeline

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  User's  │────▶│   LiveKit    │────▶│  Deepgram    │────▶│  LLM (pick   │────▶│ Deepgram │
│   Mic    │     │  WebRTC Room │     │  STT Nova-3  │     │  one below)  │     │ Aura TTS │
└──────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────┘
                         │                                         │                    │
                         │                                         │                    │
                         ▼                                         ▼                    ▼
                  ┌──────────────┐                          ┌──────────────┐     ┌──────────┐
                  │   React      │◀─────── RPC ─────────────│  Founder     │     │  Audio   │
                  │   Frontend   │        (visuals,         │  Agent       │     │  Stream  │
                  │              │         lead data)       │  (LiveKit)   │     │  → User  │
                  └──────────────┘                          └──────────────┘     └──────────┘
```

### Pipeline Breakdown

| Stage | Technology | Purpose |
|-------|-----------|---------|
| **Transport** | LiveKit WebRTC | Ultra-low latency bi-directional audio streaming |
| **VAD** | Silero VAD | Voice Activity Detection — detects speech start/end |
| **STT** | Deepgram Nova-3 | Real-time speech-to-text transcription |
| **LLM** | Google Gemini 2.5 Flash (default) **or** Groq Llama 3 8B | Conversational AI response generation |
| **TTS** | Deepgram Aura (aura-asteria-en) | Natural-sounding text-to-speech (server-side) |
| **TTS Fallback** | Browser SpeechSynthesis | Client-side fallback when server TTS is unavailable |
| **Frontend** | React + Vite + Framer Motion | Real-time UI with live transcript, visuals, and lead capture |

---

## ✨ Features

- **Real-time Voice Conversation** — Sub-second latency voice pipeline via WebRTC
- **Dual Conversation Modes** — Discovery mode (agent leads) + Q&A mode (answers about Maneuver)
- **Live Visual Layer** — Agent triggers contextual slides (services, process, case studies) via RPC
- **Real-time Lead Capture** — Information appears on screen as the visitor shares it
- **Auto Lead Persistence** — Leads are auto-saved when the call disconnects (safety net)
- **Interruption Handling** — Agent stops speaking immediately when user talks
- **Swappable LLM** — Switch between Google Gemini and Groq with a single comment toggle
- **Graceful TTS Degradation** — Falls back to browser TTS if Deepgram TTS fails

---

## 🛠️ Tech Stack

### Backend (Python)
| Package | Version | Purpose |
|---------|---------|---------|
| `livekit-agents` | ~1.5 | Agent framework with session management |
| `livekit-plugins-deepgram` | ~1.5 | STT (Nova-3) + TTS (Aura Asteria) |
| `livekit-plugins-google` | ~1.5 | LLM inference (Gemini 2.5 Flash) — default |
| `livekit-plugins-groq` | ~1.5 | LLM inference (Llama 3 8B) — alternative |
| `livekit-plugins-silero` | ~1.5 | Voice Activity Detection |
| `fastapi` | >=0.115 | Token server for frontend auth |
| `uvicorn` | >=0.32 | ASGI server |
| `python-dotenv` | >=1.0 | Environment variable management |

### Frontend (JavaScript)
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0 | UI framework |
| `@livekit/components-react` | ^2.9 | LiveKit React SDK |
| `livekit-client` | ^2.9 | LiveKit client SDK |
| `framer-motion` | ^12.0 | Smooth animations and transitions |
| `tailwindcss` | ^4.0 | Utility-first CSS framework |
| `vite` | ^6.0 | Build tool and dev server |

---

## 📁 Project Structure

```
Task_Maneuver/
├── agent/                          # Python backend
│   ├── src/
│   │   ├── agent.py                # Main entrypoint — pipeline wiring, LLM/TTS config
│   │   ├── founder_agent.py        # Core AI agent — tools, visuals, lead capture
│   │   ├── prompts.py              # System prompts & persona definitions
│   │   ├── knowledge_base.py       # Maneuver knowledge base loader
│   │   ├── lead_manager.py         # Lead data capture & persistence
│   │   ├── token_server.py         # FastAPI token endpoint for frontend auth
│   │   ├── config.py               # Environment & LiveKit config helpers
│   │   └── __init__.py
│   ├── data/
│   │   ├── maneuver_kb.md          # Maneuver company knowledge base
│   │   └── leads/                  # ⬅️ Lead JSON files saved here
│   │       └── lead_<id>_<timestamp>.json
│   ├── pyproject.toml              # Python dependencies (uv)
│   ├── .env                        # API keys (git-ignored)
│   └── .env.example                # Template for .env setup
│
├── frontend/                       # React frontend
│   ├── src/
│   │   ├── App.jsx                 # Root component — routing & LiveKit room
│   │   ├── main.jsx                # React DOM entry point
│   │   ├── index.css               # Global styles & design tokens
│   │   ├── components/
│   │   │   ├── session/
│   │   │   │   ├── SessionView.jsx     # Main 3-column session layout
│   │   │   │   ├── AgentOrb.jsx        # Animated agent state indicator
│   │   │   │   └── ConnectionScreen.jsx # Pre-call landing page
│   │   │   ├── visual/
│   │   │   │   ├── VisualLayer.jsx      # Visual content router
│   │   │   │   ├── WelcomeVisual.jsx    # Default idle state
│   │   │   │   ├── ServicesSlide.jsx    # Services overview
│   │   │   │   ├── ServiceDetail.jsx    # Single service deep-dive
│   │   │   │   ├── ProcessDiagram.jsx   # Engagement process timeline
│   │   │   │   └── CaseStudyCard.jsx    # Case study display
│   │   │   ├── transcript/
│   │   │   │   └── TranscriptPanel.jsx  # Live conversation transcript
│   │   │   └── lead/
│   │   │       └── LeadCapturePanel.jsx # Real-time lead info display
│   │   ├── hooks/
│   │   │   ├── useAgentConnection.js   # LiveKit connection management
│   │   │   ├── useAgentState.js        # Agent state tracking
│   │   │   ├── useBrowserTTS.js        # Browser SpeechSynthesis fallback
│   │   │   └── useRpcHandler.js        # RPC message handler
│   │   ├── services/
│   │   │   └── tokenService.js         # Token fetch logic
│   │   └── utils/
│   │       └── constants.js            # App-wide constants
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔑 Getting API Keys

You need **4 API keys** from 3 services. All have free tiers.

### 1. LiveKit Cloud (Transport)
1. Go to [cloud.livekit.io](https://cloud.livekit.io) and create a free account
2. Create a new project
3. Go to **Project Settings → Keys**
4. Copy: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

### 2. Deepgram (STT + TTS)
1. Go to [console.deepgram.com](https://console.deepgram.com) and sign up (free $200 credit)
2. Go to **API Keys → Create Key**
3. Copy the API key → `DEEPGRAM_API_KEY`

### 3. LLM Provider (choose one or both)

#### Option A: Google Gemini (Default)
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **Create API Key**
3. Copy the key → `GOOGLE_API_KEY`

#### Option B: Groq (Alternative — faster inference)
1. Go to [console.groq.com](https://console.groq.com) and sign up
2. Go to **API Keys → Create API Key**
3. Copy the key → `GROQ_API_KEY`

> **Note:** To switch between Gemini and Groq, edit `agent/src/agent.py` — see the [Switching LLM](#switching-llm-provider) section below.

---

## 🚀 Setup & Running

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **uv** (Python package manager) — [Install uv](https://docs.astral.sh/uv/getting-started/installation/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Task_Maneuver.git
cd Task_Maneuver
```

### 2. Set Up the Backend

```bash
cd agent

# Install Python dependencies
uv sync

# Set up environment variables
cp .env.example .env
# Edit .env with your actual API keys (see "Getting API Keys" above)
```

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Run the Application

Open **two terminal windows:**

**Terminal 1 — Start the Agent Server:**
```bash
cd agent
uv run src/agent.py dev
```
This starts:
- The LiveKit agent server (connects to LiveKit Cloud)
- The token server on `http://localhost:8081`

**Terminal 2 — Start the Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

### 5. Use the App

1. Open `http://localhost:5173` in your browser
2. Enter your name (optional) and click **Start Conversation**
3. Allow microphone access when prompted
4. Start talking — the AI founder will respond in real-time!
5. When the call ends, lead data is automatically saved

---

## ⚙️ Configuration

### Switching LLM Provider

Edit `agent/src/agent.py` around line 113:

**Using Google Gemini (default):**
```python
llm=google.LLM(
    model="gemini-2.5-flash",
    max_output_tokens=800,
),
```

**Using Groq (faster inference):**
```python
llm=groq.LLM(
    model="llama3-8b-8192",
    max_output_tokens=800,
),
```

Just comment out one and uncomment the other. Make sure the corresponding API key is set in `.env`.

### TTS Modes

Set `TTS_MODE` in `agent/.env`:

| Mode | Description | Requires |
|------|-------------|----------|
| `deepgram` (default) | Server-side Deepgram Aura TTS — natural voice, low latency | `DEEPGRAM_API_KEY` |
| `browser` (fallback) | Client-side `window.speechSynthesis` — no API key needed | Nothing |

### VAD Parameters

Voice Activity Detection is tuned in `agent/src/agent.py`:

```python
silero.VAD.load(
    min_silence_duration=1.0,    # Seconds of silence before end-of-speech
    min_speech_duration=0.3,     # Minimum speech duration to register
    activation_threshold=0.8,    # Confidence threshold for speech detection
)
```

---

## 📋 Lead Data

### How Leads Are Captured

1. **During the call** — The LLM calls `update_lead_field()` every time it learns new info (name, company, problem, etc.)
2. **On call end** — The LLM calls `end_discovery_call()` which persists all data to disk
3. **Auto-save (safety net)** — If the call disconnects without the LLM calling `end_discovery_call`, lead data is automatically saved on room disconnect

### Where Leads Are Stored

Leads are saved as JSON files in:
```
agent/data/leads/
```

Each file is named: `lead_<id>_<timestamp>.json`

**Example lead file:**
```json
{
  "id": "d5075da6",
  "created_at": "2026-05-25T17:09:58.238103+00:00",
  "name": "John Doe",
  "company": "Acme Corp",
  "role": "CTO",
  "email": "john@acme.com",
  "problem": "Need an MVP for our AI-powered scheduling tool",
  "timeline": "3 months",
  "budget": "$50k-$80k",
  "notes": "Currently using spreadsheets, wants mobile app too",
  "call_duration_seconds": 0.0,
  "transcript_summary": ""
}
```

### Viewing Leads via API

While the agent is running, you can fetch all leads via:
```bash
curl http://localhost:8081/api/leads
```

This returns all saved leads as JSON.

---

## 📋 How It Works

1. **Connection** — Frontend fetches a LiveKit token from the token server and joins a WebRTC room
2. **Voice Capture** — User's microphone audio streams to LiveKit via WebRTC
3. **STT** — Deepgram Nova-3 transcribes speech to text in real-time
4. **VAD** — Silero detects when the user stops speaking (turn detection)
5. **LLM** — Gemini or Groq generates contextual responses based on the conversation
6. **TTS** — Deepgram Aura converts the response to natural speech audio
7. **Visuals** — The agent triggers frontend UI updates via LiveKit RPC (services slides, process diagrams, case studies)
8. **Lead Capture** — Information is captured in real-time and persisted as JSON to `agent/data/leads/`

---

## 📄 License

This project is part of the Maneuver Voice AI Agent internship assignment.

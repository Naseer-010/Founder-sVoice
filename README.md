# 🎙️ Maneuver — Voice AI "Talk to Founder" Agent

A real-time voice AI agent that simulates a conversation with a startup founder. Visitors land on the website, click "Start Conversation," and have a live voice call with an AI agent that discovers their needs, answers questions about Maneuver's services, and captures lead information — all in real time.

---

## 🏗️ Architecture & Pipeline

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  User's  │────▶│   LiveKit     │────▶│  Deepgram    │────▶│   Groq LLM   │────▶│ Deepgram │
│   Mic    │     │  WebRTC Room  │     │  STT Nova-3  │     │ Llama3-8B    │     │ Aura TTS │
└──────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────┘
                         │                                         │                    │
                         │                                         │                    │
                         ▼                                         ▼                    ▼
                  ┌──────────────┐                          ┌──────────────┐     ┌──────────┐
                  │   React      │◀─────── RPC ────────────│  Founder     │     │  Audio   │
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
| **LLM** | Groq (Llama 3 8B 8192) | Fast inference for conversational AI responses |
| **TTS** | Deepgram Aura (Asteria) | Natural-sounding text-to-speech (server-side) |
| **TTS Fallback** | Browser SpeechSynthesis | Client-side fallback when server TTS is unavailable |
| **Frontend** | React + Vite + Framer Motion | Real-time UI with live transcript, visuals, and lead capture |

---

## ✨ Features

- **Real-time Voice Conversation** — Sub-second latency voice pipeline via WebRTC
- **Dual Conversation Modes** — Discovery mode (agent leads) + Q&A mode (answers about Maneuver)
- **Live Visual Layer** — Agent triggers contextual slides (services, process, case studies) via RPC
- **Real-time Lead Capture** — Information appears on screen as the visitor shares it
- **Interruption Handling** — Agent stops speaking immediately when user talks
- **Graceful Degradation** — Falls back to browser TTS if server TTS fails

---

## 🛠️ Tech Stack

### Backend (Python)
| Package | Version | Purpose |
|---------|---------|---------|
| `livekit-agents` | ~1.5 | Agent framework with session management |
| `livekit-plugins-deepgram` | ~1.5 | STT (Nova-3) + TTS (Aura Asteria) |
| `livekit-plugins-groq` | ~1.5 | LLM inference (Llama 3 8B) |
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
│   │   ├── agent.py                # Main entrypoint — pipeline wiring & TTS factory
│   │   ├── founder_agent.py        # Core AI agent — tools, visuals, lead capture
│   │   ├── prompts.py              # System prompts & persona definitions
│   │   ├── knowledge_base.py       # Maneuver knowledge base loader
│   │   ├── lead_manager.py         # Lead data capture & persistence
│   │   ├── token_server.py         # FastAPI token endpoint for frontend auth
│   │   ├── config.py               # Environment & LiveKit config helpers
│   │   └── __init__.py
│   ├── data/
│   │   ├── knowledge_base.md       # Maneuver company information
│   │   └── leads/                  # Persisted lead JSON files
│   ├── pyproject.toml              # Python dependencies (uv)
│   └── .env                        # API keys (git-ignored)
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

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **uv** (Python package manager) — [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
- **API Keys:**
  - [LiveKit Cloud](https://cloud.livekit.io) — URL, API Key, API Secret
  - [Deepgram](https://console.deepgram.com) — API Key (for STT + TTS)
  - [Groq](https://console.groq.com) — API Key (for LLM)

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

# Configure environment variables
cp .env.example .env   # or create .env manually
```

Edit `agent/.env` with your API keys:

```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
DEEPGRAM_API_KEY=your_deepgram_api_key
GROQ_API_KEY=your_groq_api_key
TTS_MODE=deepgram
```

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Run the Application

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

The frontend will be available at `http://localhost:5173`

### 5. Use the App

1. Open `http://localhost:5173` in your browser
2. Enter your name (optional) and click **Start Conversation**
3. Allow microphone access when prompted
4. Start talking — the AI founder will respond in real-time!

---

## ⚙️ Configuration

### TTS Modes

Set `TTS_MODE` in `agent/.env`:

| Mode | Description | Requires |
|------|-------------|----------|
| `deepgram` (default) | Server-side Deepgram Aura TTS — natural voice, low latency | `DEEPGRAM_API_KEY` |
| `browser` (fallback) | Client-side `window.speechSynthesis` — no API key needed | Nothing |

### VAD Parameters

Voice Activity Detection is tuned in `agent.py`:

```python
silero.VAD.load(
    min_silence_duration=1.0,    # Seconds of silence before end-of-speech
    min_speech_duration=0.3,     # Minimum speech duration to register
    activation_threshold=0.8,    # Confidence threshold for speech detection
)
```

---

## 📋 How It Works

1. **Connection** — Frontend fetches a LiveKit token from the token server and joins a WebRTC room
2. **Voice Capture** — User's microphone audio streams to LiveKit via WebRTC
3. **STT** — Deepgram Nova-3 transcribes speech to text in real-time
4. **VAD** — Silero detects when the user stops speaking (turn detection)
5. **LLM** — Groq runs Llama 3 8B to generate contextual responses
6. **TTS** — Deepgram Aura converts the response to natural speech audio
7. **Visuals** — The agent triggers frontend UI updates via LiveKit RPC (services slides, process diagrams, case studies)
8. **Lead Capture** — Information is captured in real-time and persisted as JSON

---

## 📄 License

This project is part of the Maneuver Voice AI Agent internship assignment.

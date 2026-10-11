# realistic-image-animator

A modern web app that turns a still image into a short cinematic 30-second animation with a polished upload workflow and a local high-quality demo renderer.

This project is built as a starter foundation for integrating a model like Seedance 2.5 while also working out of the box using a local FFmpeg-based animation engine for prototype testing.

## Features

- Upload a still image
- Choose motion style: cinematic, dramatic, subtle, product
- Generate a 30-second preview video
- Preview directly in the browser
- Built-in backend API for image-to-video generation
- Ready for Seedance 2.5 API integration

## Tech stack

- Frontend: React + Vite + Tailwind-inspired CSS
- Backend: FastAPI
- Video rendering: FFmpeg
- Optional integration: Seedance 2.5 API via environment variables

## Local setup

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### 3) Open the app

Visit:

```text
http://localhost:5173
```

## Example prompt

```text
Ultra realistic cinematic image animation, subtle camera movement, natural parallax, realistic lighting, soft atmospheric motion, photorealistic textures, 30-second video, high detail, smooth temporal continuity.
```

## Optional Seedance 2.5 API setup

Create a `.env` file in the backend directory with:

```bash
SEEDANCE_API_KEY=your_key_here
SEEDANCE_API_URL=https://your-model-endpoint.example.com
```

The app will prefer the configured model endpoint when available, and fall back to the local FFmpeg renderer when it is not configured.

## Notes

- The local demo mode is suitable for rapid prototyping and testing UI/flow.
- For production-quality model generation, connect a real Seedance 2.5 compatible API and replace the local renderer with the model call in the backend generation logic.

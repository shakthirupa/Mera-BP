# MeraBP — Full Stack

## Project Structure
```
MERABP/
├── backend/    # Spring Boot (Java 17) — runs on port 8080
└── frontend/   # React Native (Expo) — mobile app
```

## Prerequisites
- Java 17+
- Maven (or use `mvnw`)
- Node.js 18+
- PostgreSQL running on port 5432 with a `healthcare` database
- Ollama running locally (`ollama serve`) with `nomic-embed-text` model

## Run Both Together (Windows)
From the root `MERABP/` folder:
```bash
npm run dev
```
This opens two terminal windows — one for the backend, one for the frontend.

## Run Separately

### Backend
```bash
cd backend
mvnw.cmd spring-boot:run
```
Backend starts at: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm start
```
Scan the QR code with Expo Go on your phone.

## Frontend → Backend Connection
The frontend calls the backend at `http://localhost:8080` (configured in `frontend/src/constants/api.ts`).

> **On a physical device:** Replace `localhost` in `frontend/src/constants/api.ts` with your machine's local IP (run `ipconfig` to find it, e.g. `192.168.1.x`).

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)
| Key | Description |
|-----|-------------|
| `spring.datasource.password` | PostgreSQL password |
| `jwt.secret` | JWT signing secret (min 32 chars) |
| `google.client-id` | Google OAuth client ID |
| `spring.ai.openai.api-key` | Groq API key |

### Frontend (`frontend/.env`)
| Key | Description |
|-----|-------------|
| `EXPO_PUBLIC_WEB_ID` | Google OAuth Web client ID |
| `EXPO_PUBLIC_ANDROID_ID` | Google OAuth Android client ID |

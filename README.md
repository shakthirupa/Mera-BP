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
copy .env.example .env   # first time only — fill in DB password, JWT_SECRET, API keys
mvnw.cmd spring-boot:run
```
Backend starts at: `http://localhost:8080`

> **Requires** `backend/.env` (see `.env.example`). Spring Boot loads it automatically.  
> **Requires** PostgreSQL with database `healthcare` on port 5432.  
> If port 8080 is busy: `.\start-backend.ps1` (stops the old process, then starts).

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
Copy `frontend/.env.example` to `frontend/.env`.

| Key | Description |
|-----|-------------|
| `EXPO_PUBLIC_API_URL` | Backend URL the app calls (see APK section below) |
| `EXPO_PUBLIC_WEB_ID` | Google OAuth Web client ID |
| `EXPO_PUBLIC_ANDROID_ID` | Google OAuth Android client ID |

## APK on any phone (internet)

The APK only works on other phones if it can reach your **public backend** over the internet. A Wi‑Fi IP or `localhost` will not work elsewhere.

### Step 1 — Put the API on the internet

**Quick test (your PC, any phone):**

```powershell
# Terminal 1 — backend
cd backend
mvnw.cmd spring-boot:run

# Terminal 2 — free HTTPS tunnel (installs cloudflared if needed)
.\scripts\public-tunnel.ps1
```

Copy the `https://….trycloudflare.com` URL (changes each time you restart the tunnel).

**Always-on (VPS e.g. Oracle free tier, DigitalOcean):**

```bash
cp .env.example .env   # fill JWT_SECRET, DB_PASSWORD, GROQ_API_KEY, Google keys
docker compose up -d --build
docker compose exec ollama ollama pull nomic-embed-text
curl http://YOUR_SERVER_IP:8080/auth/login/email   # should not connection-refuse
```

Point a domain at the server and put **HTTPS** in front (Caddy/nginx) — use that URL in the app.

### Step 2 — Bake the public URL into the APK

```bash
cd frontend
eas login
eas env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://YOUR-PUBLIC-URL
eas env:create --environment preview --name EXPO_PUBLIC_WEB_ID --value YOUR_WEB_CLIENT_ID
eas env:create --environment preview --name EXPO_PUBLIC_ANDROID_ID --value YOUR_ANDROID_CLIENT_ID
eas build --profile preview --platform android
```

Install the APK from the EAS build page.

### Step 3 — Google Sign-In on the release APK

In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Android OAuth client:

- Add package name: `com.vctr1912.merabp`
- Add SHA-1 from: `cd frontend && eas credentials -p android`

Without this, Google login fails on the APK even if the API URL is correct.

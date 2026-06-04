# MeraBP — Developer Guide
> For new team members joining the project. Read this fully before touching any code.

---

## Table of Contents
1. [What is MeraBP](#1-what-is-merabp)
2. [Project Structure](#2-project-structure)
3. [Tech Stack](#3-tech-stack)
4. [Prerequisites & Setup](#4-prerequisites--setup)
5. [Environment Variables](#5-environment-variables)
6. [Running the Project](#6-running-the-project)
7. [Database](#7-database)
8. [Backend Architecture](#8-backend-architecture)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Authentication Flow](#10-authentication-flow)
11. [Chatbot (Bandhu)](#11-chatbot-bandhu)
12. [Privacy Design — Name Storage](#12-privacy-design--name-storage)
13. [What Has Been Built](#13-what-has-been-built)
14. [Known Issues & Limitations](#14-known-issues--limitations)
15. [What Should Be Done Next](#15-what-should-be-done-next)
16. [Deployment](#16-deployment)
17. [Key Credentials & Services](#17-key-credentials--services)

---

## 1. What is MeraBP

MeraBP is a **hypertension management mobile app** for Indian patients. It helps users:
- Track blood pressure, heart rate, blood glucose, and HbA1c readings
- Manage medications and set reminders
- Learn about hypertension through educational content
- Chat with **Bandhu**, an AI health assistant trained specifically on hypertension data
- Sign up and log in via Email, Phone, or Google

---

## 2. Project Structure

```
MERABP/
├── backend/          # Spring Boot REST API (Java 17) — port 8080
├── frontend/         # React Native app (Expo) — mobile
├── chatbot/          # Fine-tuned LLM server (Python/FastAPI) — deployed on HuggingFace
├── ai_server/        # Alternate AI server (not actively used)
├── scripts/          # Utility scripts (tunnel, etc.)
├── docker-compose.yml
└── DEVELOPER_GUIDE.md  ← you are here
```

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo (TypeScript) |
| Navigation | Expo Router (file-based) |
| State | React Context API |
| Local Storage | expo-secure-store (tokens + name), AsyncStorage (chat history) |
| Backend API | Spring Boot 3 (Java 17) |
| Database | PostgreSQL 15 |
| Auth | JWT (access + refresh tokens) + Google OAuth |
| OTP Email | Brevo (formerly Sendinblue) HTTP API |
| Chatbot LLM | Phi-3-mini + LoRA fine-tune, hosted on HuggingFace Spaces |
| Chatbot Fallback | Groq API (Llama 3.3 70B) |
| Notifications | Expo Notifications |

---

## 4. Prerequisites & Setup

### Install these first
- **Java 17+** — for the backend
- **Node.js 18+** — for the frontend
- **PostgreSQL 15** — running on port 5432
- **Maven** — or use the included `mvnw` wrapper
- **Expo Go app** — on your Android phone for testing

### First-time setup

```bash
# 1. Clone the repo and enter the folder
cd MERABP

# 2. Setup backend environment
cd backend
copy .env.example .env
# Edit .env and fill in your values (see Section 5)

# 3. Create the PostgreSQL database
# Open psql or pgAdmin and run:
# CREATE DATABASE healthcare;

# 4. Install frontend dependencies
cd ../frontend
npm install
```

---

## 5. Environment Variables

### Backend — `backend/.env`

```env
GOOGLE_CLIENT_ID=<web oauth client id from google cloud>
GOOGLE_CLIENT_SECRET=<web oauth client secret>
GOOGLE_ANDROID_CLIENT_ID=<android oauth client id>
BREVO_API_KEY=<brevo smtp api key for sending OTP emails>
MAIL_FROM=<sender email address registered in Brevo>
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/healthcare
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<your postgres password>
JWT_SECRET=<random string, minimum 32 characters>
GROQ_API_KEY=<groq api key from console.groq.com>
HUGGINGFACE_API_KEY=<hf token from huggingface.co/settings/tokens>
LOCAL_MODEL_URL=https://shakthirupan-bandhu-hypertension-chatbot.hf.space
```

> **Never commit `.env` to git.** It is already in `.gitignore`.

### Frontend — `frontend/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_WEB_ID=<google web oauth client id>
EXPO_PUBLIC_ANDROID_ID=<google android oauth client id>
```

> On a **physical device**, replace `localhost` with your PC's local IP (`ipconfig` → IPv4 address, e.g. `192.168.1.5`).

---

## 6. Running the Project

### Run everything together (Windows)
```bash
# From MERABP/ root
npm run dev
```
Opens two terminals — one for backend, one for frontend.

### Run separately

```bash
# Backend
cd backend
mvnw.cmd spring-boot:run

# Frontend (separate terminal)
cd frontend
npm start
# Scan QR code with Expo Go
```

### If port 8080 is already in use
```powershell
cd backend
.\start-backend.ps1
```

---

## 7. Database

**Connection details (local):**
- Host: `localhost`
- Port: `5432`
- Database: `healthcare`
- Username: `postgres`
- Password: `postgres` (or whatever you set)

**Tables created automatically** by Spring Boot (`spring.jpa.hibernate.ddl-auto=update`):

| Table | Description |
|---|---|
| `patients` | User accounts — email, phone, google_id, gender, dob. **No name stored.** |
| `observations` | Health readings — BP, heart rate, glucose, HbA1c |
| `medications` | Medication records per patient |
| `reminders` | Medication reminder times (FK → medications) |
| `refresh_tokens` | Hashed refresh tokens for session management |
| `otp_verifications` | OTP records for email/phone/google verification |

**To inspect data:**
```bash
# Command line
psql -U postgres -d healthcare
\dt          # list tables
SELECT * FROM patients;
SELECT * FROM observations;
\q           # quit
```
Or use **pgAdmin** / **DBeaver** with the same connection details.

---

## 8. Backend Architecture

```
backend/src/main/java/com/merabp/healthcare/
├── controller/     # REST endpoints — one file per feature
├── service/        # Business logic
├── repository/     # JPA database queries
├── model/          # JPA entities (DB tables)
├── dto/            # Request/Response data transfer objects
├── security/       # JWT filter + JWT service
├── exception/      # Global error handler
└── util/           # HashUtil (SHA-256 for OTP/token hashing)
```

### Key API Endpoints

#### Auth (`/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/start-email-signup` | Send OTP to email |
| POST | `/auth/verify-email-signup-otp` | Verify OTP → get onboarding token |
| POST | `/auth/complete-email-signup` | Submit DOB + gender + password → create account |
| POST | `/auth/login/email` | Login with email + password |
| POST | `/auth/login/phone` | Login with phone + password |
| POST | `/auth/google` | Google sign-in → sends OTP to Gmail |
| POST | `/auth/google/verify-otp` | Verify Gmail OTP → login or start onboarding |
| POST | `/auth/google/complete` | Complete Google signup (DOB + gender + T&C) |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Revoke all refresh tokens |
| POST | `/auth/forgot-password` | Send password reset OTP |
| POST | `/auth/verify-forgot-otp` | Verify reset OTP |
| POST | `/auth/reset-password` | Set new password |

#### Patient (`/patients`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/patients/profile` | Get current user profile |
| PUT | `/patients` | Update DOB + gender (name is NOT sent here) |
| DELETE | `/patients/me` | Hard delete account + all data |

#### Health Data (`/observations`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/observations` | Log a health reading |
| GET | `/observations?code=BLOOD_PRESSURE` | Get readings by type |
| DELETE | `/observations/{id}` | Delete a reading |

Supported codes: `BLOOD_PRESSURE`, `HEART_RATE`, `BLOOD_GLUCOSE`, `HBA1C`

#### Medications & Reminders
- `GET/POST/PUT/DELETE /medications` — CRUD for medications
- `GET/POST/DELETE /reminders` — CRUD for reminders (linked to medications)

#### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat` | Send message to Bandhu chatbot |

### Security
- All `/patients`, `/observations`, `/medications`, `/reminders`, `/chat` endpoints require a valid `Authorization: Bearer <token>` header
- `/auth/*` endpoints are public
- JWT access tokens expire in **24 hours**
- Refresh tokens expire in **30 days** and rotate on use
- OTPs are SHA-256 hashed before storing in DB

---

## 9. Frontend Architecture

```
frontend/
├── app/
│   ├── (auth)/           # Login, Register, OTP, Onboarding, Policy screens
│   └── (app)/
│       └── (tabs)/
│           ├── learn/    # Health education content
│           ├── profile/  # Profile, edit, health history, medications
│           └── chatbot.tsx
├── src/
│   ├── constants/
│   │   └── api.ts        # All API endpoint URLs
│   ├── providers/
│   │   └── AuthContext.tsx  # Global auth state
│   ├── services/
│   │   ├── api.ts        # All API call functions
│   │   ├── tokenStorage.ts  # SecureStore: tokens + name
│   │   ├── google.ts     # Google Sign-In
│   │   └── notifications.ts # Expo push notifications
│   ├── context/
│   │   └── SignupContext.tsx  # Temporary signup wizard state
│   └── types/
│       └── index.ts      # TypeScript interfaces
```

### Auth State Flow
```
App starts
    ↓
AuthContext.checkAuth()
    ↓
getAccessToken() from SecureStore
    ↓
If valid → getProfile() from API + getName() from SecureStore → authenticated
If expired → tryRefreshToken() → retry
If all fail → unauthenticated → show login screen
```

### Adding a New Screen
1. Create a file in the appropriate `app/` folder
2. Export a default React component
3. Expo Router auto-registers it as a route

### Adding a New API Call
1. Add the endpoint URL to `src/constants/api.ts`
2. Add the function to `src/services/api.ts`
3. Call it from the screen

---

## 10. Authentication Flow

### Email/Phone Signup
```
Enter email/phone + password
    → POST /auth/start-email-signup  (sends OTP)
    → Enter OTP on verify screen
    → POST /auth/verify-email-signup-otp  (returns onboarding token)
    → Fill name, gender, DOB (onboarding screens)
    → Accept T&C
    → POST /auth/complete-email-signup  (creates account, returns JWT)
    → Name saved to device SecureStore (NOT sent to backend)
    → Logged in
```

### Google Signup/Login
```
Tap "Continue with Google"
    → Google SDK returns ID token
    → POST /auth/google  (verifies token, sends OTP to Gmail)
    → Enter OTP on verify screen
    → POST /auth/google/verify-otp
        → Existing user: returns JWT → logged in
        → New user: returns onboarding token → fill DOB/gender/T&C
        → POST /auth/google/complete → creates account, returns JWT
    → Name saved to device SecureStore
    → Logged in
```

### Token Lifecycle
- **Access token** — short-lived (24h), sent in every API request header
- **Refresh token** — long-lived (30 days), used to get new access token silently
- **Onboarding token** — 10 min, only valid for `/complete` endpoints, blocked from all other routes

---

## 11. Chatbot (Bandhu)

### Architecture — 4 Layers (in order)
```
User message
    ↓
Layer 1: Fine-tuned Phi-3 model on HuggingFace Space
         POST https://shakthirupan-bandhu-hypertension-chatbot.hf.space/chat
         { message, patient_context }  →  { response }
    ↓ (if fails or times out)
Layer 2: Groq API — Llama 3.3 70B (fast, always-on, free tier)
    ↓ (if fails)
Layer 3: HuggingFace Inference API — shakthirupan/bandhu-hypertension-lora
    ↓ (if fails)
Layer 4: Local dataset keyword search (hypertension_dataset_clean.json)
```

### HuggingFace Space
- **URL:** `https://shakthirupan-bandhu-hypertension-chatbot.hf.space`
- **Model:** Microsoft Phi-3-mini-4k-instruct + LoRA adapter
- **Quantization:** 4-bit (fits in GPU VRAM)
- **Server:** FastAPI (`chatbot/server.py`)
- **Endpoints:** `POST /chat`, `GET /health`

### Keep-Alive (Free Tier Limitation)
HuggingFace free Spaces sleep after 15 minutes of inactivity.
- Set up a cron job at [cron-job.org](https://cron-job.org) to ping `/health` every 10 minutes
- URL to ping: `https://shakthirupan-bandhu-hypertension-chatbot.hf.space/health`

### Chat History
- Stored in **AsyncStorage** on device, keyed by last 16 chars of access token
- History is session-scoped — clears on logout or account delete
- Last 6 messages sent to backend as context for Groq

### Patient Context
When a user chats, the backend automatically builds context from their DB records (last 5 BP readings, last 3 heart rate + glucose, all medications) and sends it to the model so answers are personalised.

---

## 12. Privacy Design — Name Storage

**The patient's name is intentionally NOT stored in the database.**

This is a deliberate privacy decision.

| What | Where stored |
|---|---|
| Name | Device only (`expo-secure-store`, key: `userName`) |
| Email | PostgreSQL `patients` table |
| Phone | PostgreSQL `patients` table |
| DOB, Gender | PostgreSQL `patients` table |
| Health readings | PostgreSQL `observations` table |

### How it works
- **On signup** — user enters name in onboarding screen → saved to device SecureStore → never sent to backend
- **On Google signup** — Google provides name → passed through in JWT claims → frontend reads it and saves locally
- **On login** — name loaded from SecureStore, merged into user state in memory
- **On display** — `user.name` from `AuthContext` always comes from device cache
- **On edit profile** — name change saved to SecureStore only, PUT to backend only sends DOB + gender
- **On logout/delete** — `clearName()` called, name removed from device

### Why this matters
If the database is ever breached, patient names cannot be linked to their health records.

---

## 13. What Has Been Built

### Backend
- ✅ Full user registration — email, phone, Google OAuth
- ✅ OTP verification for email, phone, and Google login (via Gmail)
- ✅ JWT authentication with refresh token rotation
- ✅ Patient profile (no name in DB — privacy by design)
- ✅ Health observations — BP, heart rate, blood glucose, HbA1c
- ✅ Medications and reminders CRUD
- ✅ Hard delete account (removes all data from DB)
- ✅ Chatbot endpoint with 4-layer fallback
- ✅ OTP email via Brevo API

### Frontend
- ✅ Login screen (email, phone, Google)
- ✅ Signup flow (email/phone OTP → onboarding → T&C → complete)
- ✅ Google signup flow (Gmail OTP → onboarding → T&C → complete)
- ✅ Forgot password flow
- ✅ Home / Learn tab with health education cards
- ✅ Profile tab with health graphs (BP, heart rate)
- ✅ Profile details with reminders, account info, edit profile
- ✅ Edit profile (name saved locally, DOB/gender sent to backend)
- ✅ Health history with chart view per metric
- ✅ Medications screen with reminders
- ✅ Chatbot screen (Bandhu) with suggested questions
- ✅ Chat history persisted per login session
- ✅ Push notification reminders for medications
- ✅ Delete account (clears DB + local storage)

### Chatbot
- ✅ Phi-3-mini fine-tuned with LoRA on hypertension dataset
- ✅ Deployed on HuggingFace Spaces with GPU
- ✅ FastAPI server with `/chat` and `/health` endpoints
- ✅ 4-layer fallback: fine-tuned model → Groq → HF Inference API → dataset search

---

## 14. Known Issues & Limitations

| Issue | Details |
|---|---|
| HF Space cold start | Free tier sleeps after 15 min — first message can take 30–60s. Set up keep-alive ping. |
| Name not in DB | If user installs app on new phone, their name will be blank until they edit it in profile settings |
| Google resend OTP | Cannot resend OTP for Google auth — user must restart the Google sign-in flow |
| `patient.getName()` in ChatService | `buildPatientContext()` still calls `patient.getName()` which no longer exists — this will cause a compile error. See Section 15. |
| No phone OTP | Phone signup uses email OTP endpoints currently — proper SMS OTP not implemented yet |
| Hard delete + soft delete | `PatientRepository` still has `findByIdAndDeletedFalse` queries — these are fine since hard delete removes the row, but `deleted` column is now unused |

---

## 15. What Should Be Done Next

### 🔴 Must fix before production

**1. Fix `buildPatientContext()` compile error**

In `ChatService.java`, line:
```java
ctx.append("Patient: ").append(patient.getName());
```
`getName()` was removed from the `Patient` entity. Replace with:
```java
ctx.append("Patient DOB: ").append(patient.getDateOfBirth());
```

**2. Google OTP resend**

Currently shows an alert saying "go back and try again". A proper fix would be to store the Google ID token temporarily and re-trigger the OTP send without re-launching the Google SDK.

**3. Secure the JWT secret**

In `backend/.env`:
```
JWT_SECRET=merabp-production-jwt-secret-key-2024-secure-32chars
```
This is weak and hardcoded. Generate a proper random 64-char secret for production.

**4. Change default DB password**

`SPRING_DATASOURCE_PASSWORD=postgres` — change this before any public deployment.

### 🟡 Should be done soon

**5. SMS OTP for phone signup**

Currently phone signup reuses the email OTP endpoint. Integrate a proper SMS provider (e.g. Twilio, MSG91) for phone number verification.

**6. Name on new device**

When a user installs the app fresh on a new device, their name will be empty. Add a prompt in the profile screen to ask them to set their name if it's blank.

**7. Keep-alive for HuggingFace Space**

Set up a free cron job to ping the health endpoint every 10 minutes:
- Service: [cron-job.org](https://cron-job.org)
- URL: `https://shakthirupan-bandhu-hypertension-chatbot.hf.space/health`
- Interval: every 10 minutes

**8. Remove unused `deleted` column**

Since account deletion is now a hard delete, the `deleted` column in `patients` table is no longer needed. Clean it up in a future migration.

**9. Production JWT secret rotation**

Add a mechanism to rotate JWT secrets without logging out all users (e.g. support multiple valid secrets during transition period).

### 🟢 Nice to have / Future features

**10. Weight tracking** — screens exist in the learn section but no observation code for weight yet

**11. Lab results upload** — the upload screen exists but the backend endpoint for storing lab result files is not implemented

**12. Doctor linking** — share health data with a doctor via a code

**13. Multi-language support** — Tamil, Hindi for Indian patients

**14. Offline mode** — cache last known readings for when there's no internet

**15. Apple / iOS support** — currently Android only; iOS build config not set up

**16. Admin dashboard** — web portal to view anonymized aggregate health data

---

## 16. Deployment

### Local Development
See Section 6.

### Public APK (for testing on any phone)

1. Start a tunnel so the backend is reachable over the internet:
```powershell
# Terminal 1 — backend
cd backend
mvnw.cmd spring-boot:run

# Terminal 2 — tunnel
.\scripts\public-tunnel.ps1
# Copy the https://...trycloudflare.com URL
```

2. Build APK with the public URL baked in:
```bash
cd frontend
eas login
eas env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://YOUR-TUNNEL-URL
eas build --profile preview --platform android
```

### Production Server (Docker)
```bash
# On your server
cp .env.example .env
# Fill in all values

docker compose up -d --build
docker compose exec ollama ollama pull nomic-embed-text
```

Point a domain at port 8080 and add HTTPS (Caddy or nginx).

### Google Sign-In on Release APK
In [Google Cloud Console](https://console.cloud.google.com) → Credentials → Android OAuth Client:
- Package name: `com.vctr1912.merabp`
- SHA-1 fingerprint: run `cd frontend && eas credentials -p android`

---

## 17. Key Credentials & Services

> These are the current development credentials. **Rotate all of these before going to production.**

| Service | What it's for | Where to manage |
|---|---|---|
| Google OAuth | Sign in with Google | [console.cloud.google.com](https://console.cloud.google.com) |
| Brevo | Sending OTP emails | [app.brevo.com](https://app.brevo.com) |
| Groq | LLM fallback (Llama 3.3) | [console.groq.com](https://console.groq.com) |
| HuggingFace | Fine-tuned model hosting | [huggingface.co](https://huggingface.co) |
| EAS (Expo) | APK builds | [expo.dev](https://expo.dev) — account: `shakthirupag1` |
| PostgreSQL | Database | Local / your server |

---

## Quick Reference

### Start everything locally
```bash
cd MERABP
npm run dev
```

### Check which AI layer answered
Watch the backend terminal logs:
- `[ChatService] Answered by fine-tuned model` ← HuggingFace Space
- `[ChatService] Answered by Groq` ← Groq fallback
- `[ChatService] Answered by dataset fallback` ← last resort

### Test the chatbot server directly
```bash
curl -X POST https://shakthirupan-bandhu-hypertension-chatbot.hf.space/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a normal blood pressure?", "patient_context": ""}'
```

### View all DB tables
```bash
psql -U postgres -d healthcare -c "\dt"
```

### Add a new backend endpoint
1. Add method to the relevant `Service` class
2. Add endpoint to the relevant `Controller` class
3. Add DTO in `dto/` if needed
4. Add URL to `frontend/src/constants/api.ts`
5. Add API function to `frontend/src/services/api.ts`

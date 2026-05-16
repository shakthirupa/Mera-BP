<<<<<<< HEAD
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
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
>>>>>>> 25a5ed50d02f09c9001ba1c3065bf480b9ebe65f

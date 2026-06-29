<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# SocialSphere

Where Ideas Become Connections — a premium futuristic social media platform with liquid glassmorphism and AI-enhanced experiences.

<div align="center">
<img width="1200" height="475" alt="SocialSphere" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

## Live / AI Studio

View your app in AI Studio: https://ai.studio/apps/dfbaeefb-b938-48fc-a6fe-d07279e2e54e

## Local Development

**Prerequisites:** Node.js

### 1) Install

```bash
npm install
```

### 2) Configure environment

Set your Gemini API key:

- Create/edit `.env.local`
- Add:

```bash
GEMINI_API_KEY=YOUR_KEY
```

### 3) Run

```bash
npm run dev
```

The server starts on `http://localhost:3000`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — build frontend + bundle server
- `npm start` — run the built server
- `npm run lint` — typecheck (tsc noEmit)

## Tech Stack

- React + Vite
- Express server
- Gemini API (`@google/genai`)

## Project Structure

- `server.ts` — Express + Vite dev middleware + Gemini endpoints
- `src/` — React UI components and pages
- `assets/` — mock/DB and server-side code for persistence



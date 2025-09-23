## Amala Atlas

A Next.js + Firebase app to discover, submit, and moderate Amala spots with a Google Maps experience.

Demo video: [https://www.youtube.com/watch?v=rnla6FqpDug](https://www.youtube.com/watch?v=rnla6FqpDug)

### Tech Stack
- Next.js App Router (React, API routes)
- Firebase (Admin SDK)
- Tailwind CSS
- Google Maps (`@vis.gl/react-google-maps`)

---

## Setup

### 1) Prerequisites
- Node.js 18+
- A Firebase project (service account credentials)
- A Google Maps API key (Maps JavaScript API enabled)

### 2) Environment Variables
Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required variables:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (e.g. http://localhost:3000)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 3) Install & Run
```bash
npm install
npm run dev
```
Visit http://localhost:3000

For detailed local setup and configuration, see [SETUP.md](./SETUP.md).

---

## Deploy

### Vercel
1. Push to a public GitHub repo
2. Import the repo in Vercel
3. Configure the same environment variables in Vercel Project Settings
4. Deploy

### Firebase Credentials
Use environment variables (preferred). Never commit raw private keys. If you use a JSON file locally (e.g., `amala-atlas-firebase-adminsdk.json`), keep it out of version control.

---

## Architecture (Simple Diagram)

```
User (Web/Mobile)
      |
      v
Next.js (Vercel)
  - App Pages (UI)
  - API Routes (server)
      |
      v
Firebase (Firestore/Auth/Storage)
```

Key flows:
- Maps & UI via Next.js App Router
- Submissions and moderation via API routes
- Secure data operations via Firebase Admin SDK

---

## Development Notes
- Keep secrets in `.env.local`
- Do not commit service account keys
- Tailwind config: `tailwind.config.js`

---

## License
This project is licensed under the MIT License. See `LICENSE` for details.

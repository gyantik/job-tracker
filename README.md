# Job Tracker

A full-stack job tracking app with:

- Backend: Node.js + Express + PostgreSQL
- Frontend: React + Vite

## Monorepo scripts

From workspace root:

- npm run dev: run server + client together
- npm run dev:server: run backend only
- npm run dev:client: run frontend only
- npm run build:client: production build for frontend
- npm run start:server: run backend in production mode

## Local setup

1. Install dependencies:

   - npm --prefix server install
   - npm --prefix client install

2. Create env files:

   - server/.env from server/.env.example
   - client/.env from client/.env.example

3. Start locally:

   - npm run dev

## Deployment setup

This repository is configured for:

- Backend on Render (Web Service)
- Frontend on Vercel (Vite)

### Backend on Render

Use render.yaml at repository root.

- rootDir: server
- buildCommand: npm install
- startCommand: npm run start
- health check: /api/health

Required Render environment variables:

- NODE_ENV=production
- PORT=5000
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT
- DB_NAME
- JWT_SECRET
- CORS_ORIGINS
- DEV_RESET_KEY (optional)

CORS_ORIGINS should be a comma-separated list of allowed frontend URLs.
Example:

https://job-tracker.vercel.app,https://job-tracker-git-main-yourteam.vercel.app

### Frontend on Vercel

Use client/vercel.json.

- framework: vite
- build command: npm run build
- output directory: dist
- rewrite all routes to index.html for SPA routing

Required Vercel environment variables:

- VITE_API_URL=https://your-render-service.onrender.com/api

## CORS behavior

Backend CORS is configured in server/src/app.js.

- If CORS_ORIGINS is set, browser origins must match one of those values.
- Non-browser requests (no origin header) are allowed.
- credentials mode is enabled.

## API prefixes

- Auth: /api/auth
- Applications: /api/applications
- Health: /api/health

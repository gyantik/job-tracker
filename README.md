# Job Tracker (MERN)

A full-stack Job Tracker scaffold using:

- MongoDB
- Express.js
- React (Vite)
- Node.js

## Project Structure

- client/: React frontend (routing, auth context, API layer, pages, components)
- server/: Express + MongoDB backend (MVC pattern)

## Backend Structure

- src/config: Database connection
- src/models: Mongoose models
- src/controllers: Request handlers
- src/routes: Express route modules
- src/middleware: Auth middleware
- src/app.js: Express app setup
- src/server.js: Server bootstrap

## Frontend Structure

- src/api: Axios clients and API functions
- src/context: Global auth state
- src/components: Reusable UI components
- src/pages: Route-level pages

## Setup

1. Install dependencies

   - In client/: npm install
   - In server/: npm install

2. Configure environment files

   - Copy server/.env.example to server/.env
   - Copy client/.env.example to client/.env

3. Start development servers

   - Backend: npm run dev (from server/)
   - Frontend: npm run dev (from client/)

## API Prefix

- Auth: /api/auth
- Applications: /api/applications

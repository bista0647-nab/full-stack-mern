# Good Things — MERN shopping app

A responsive storefront built with React and Vite, an Express API, and MongoDB. The demo supports a searchable and filterable catalog, a persistent browser cart, and checkout that creates an order in MongoDB. Checkout is a demo flow and does not collect payment.

## Requirements

- Node.js 20 or newer
- A MongoDB database (MongoDB Atlas works)

## Run locally

1. Create a database and allow your development machine's IP in its MongoDB network access settings.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
3. From `backend`, run `npm install`, then `npm run seed` to add the sample catalog.
4. In one terminal, run `npm start` from `backend`.
5. In another terminal, run `npm install` and `npm run dev` from `frontend`.
6. Open the Vite URL (normally `http://localhost:5173`).

The Vite development server proxies `/api` requests to `http://localhost:5000`. For cross-origin API use, set `VITE_API_URL` to the API's base URL.

## Deploy

### Backend — Render

Create a new Blueprint from this repository and use the included `render.yaml`, or create a Node web service with `backend` as its root directory, `npm install` as its build command, and `npm start` as its start command. Set:

- `MONGODB_URI`: your MongoDB Atlas connection string
- `CLIENT_ORIGIN`: the exact deployed Vercel origin, for example `https://your-store.vercel.app`

After the service is live, run `npm run seed` from `backend` with the production `MONGODB_URI` (or seed the database before deploying).

### Frontend — Vercel

Import the repository into Vercel and set the project root to `frontend`. The included Vercel configuration sets the build command and output directory. Set `VITE_API_URL` to the deployed Render API URL (for example `https://good-things-api.onrender.com`) and redeploy. Add that exact Vercel origin to Render's `CLIENT_ORIGIN`.

## API

- `GET /api/health` — service and database readiness
- `GET /api/products` — catalog; accepts `category`, `featured`, and `search`
- `POST /api/orders` — validate and save a demo order

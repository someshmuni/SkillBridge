# Installation Guide

## Requirements
- Node.js 18+ and npm
- MongoDB (local or Atlas) - see MONGODB_SETUP.md

## Backend
1. `cd backend`
2. `npm install`
3. A `.env` file is included (copy of `.env.example`). Edit `MONGO_URI` and set a strong `JWT_SECRET`.
4. `npm run seed` loads sample internships.
5. `npm run dev` starts the API on http://localhost:5000 (check http://localhost:5000/api/health).

## Frontend
1. `cd frontend`
2. `npm install`
3. `.env` points to `http://localhost:5000/api` by default.
4. `npm run dev` opens the app on http://localhost:3000

## Admin user
`cd backend && npm run create-admin`
Default: admin@skillbridge.com / Admin@123

## Troubleshooting
- "MongoDB connection error": make sure mongod is running or fix MONGO_URI.
- CORS errors: `CLIENT_URL` in backend `.env` must match the frontend URL.
- Port in use: change `PORT` in backend `.env` and `VITE_API_BASE_URL` in frontend `.env`.

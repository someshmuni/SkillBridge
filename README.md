# SkillBridge — Internship & Skill-Gap Tracker

A full-stack internship management platform built with the MERN stack: MongoDB, Express.js, React.js, and Node.js.

## Features

- Student registration and login using JWT authentication
- Browse and search internship listings
- Apply for internships and bookmark opportunities
- Track application statuses: Saved, Applied, Interview, Offer, and Rejected
- Analyze skill gaps against internship requirements
- Discover learning resources for missing skills
- Admin dashboard for managing internships, users, applications, and analytics

## Tech Stack

**Frontend:** React, Vite, JavaScript, Recharts  
**Backend:** Node.js, Express.js, REST API, JWT  
**Database:** MongoDB, Mongoose  
**Tools:** Git, GitHub, Postman

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas database

### 1. Clone the repository

```bash
git clone https://github.com/someshmuni/SkillBridge.git
cd SkillBridge
```

### 2. Configure environment variables

Create the backend and frontend `.env` files using the provided `.env.example` templates. Set your own database connection string, JWT secret, and frontend API URL as required.

**Never commit real secrets, passwords, tokens, or database credentials.**

### 3. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend, in a separate terminal:

```bash
cd frontend
npm install
```

### 4. Start the application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create an administrator

Use the project's admin creation script and configure the administrator with your own credentials. Never use a publicly documented default password for a real account.

See `INSTALLATION_GUIDE.md`, `MONGODB_SETUP.md`, and `POSTMAN_GUIDE.md` for additional setup instructions.

## Security Notes

- Environment files containing secrets must remain private.
- Use a strong, unique JWT secret.
- Keep administrator credentials private.
- Configure production environment variables separately when deploying.

## Author

**Muni Somesh**

GitHub: [someshmuni](https://github.com/someshmuni)

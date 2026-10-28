# SkillBridge

Internship tracker with skill-gap analysis. MERN stack (MongoDB, Express, React + Vite, Node).

## Features
- Student register/login (JWT)
- Browse and search internships, apply or bookmark
- Application pipeline tracking (Saved, Applied, Interview, Offer, Rejected)
- Skill-gap analysis against live internship listings, with learning resources
- Admin panel to manage internships

## Quick start
```bash
# Terminal 1
cd backend
npm install
npm run seed
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

Create an admin: `npm run create-admin` (in backend) -> admin@skillbridge.com / Admin@123
(or `node scripts/createAdmin.js you@email.com YourPassword`).

See INSTALLATION_GUIDE.md, MONGODB_SETUP.md and POSTMAN_GUIDE.md for details.

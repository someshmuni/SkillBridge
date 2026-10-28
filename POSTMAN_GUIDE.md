# Postman Guide

1. Import `SkillBridge.postman_collection.json` and `SkillBridge.postman_environment.json`.
2. Select the "SkillBridge Environment" (baseUrl = http://localhost:5000).
3. Run "Auth - Register Student", then "Auth - Login". The login test script saves the JWT into the `token` variable.
4. Run the protected requests (Dashboard Stats, Skill-Gap) - they send `Bearer {{token}}` automatically.

## Endpoints
| Method | Path | Auth |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | - |
| GET | /api/auth/me | user |
| PUT | /api/users/profile | user |
| POST/DELETE | /api/users/skills, /api/users/skills/:skill | user |
| GET | /api/internships, /api/internships/:id | - |
| POST/PUT/DELETE | /api/internships, /api/internships/:id | admin |
| GET/POST | /api/applications | user |
| GET | /api/applications/dashboard-stats | user |
| PUT/DELETE | /api/applications/:id | user |
| GET | /api/skill-gap/overall, /api/skill-gap/internship/:id | user |

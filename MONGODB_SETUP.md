# MongoDB Setup

## Option A: Local
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start the service (Windows: it runs automatically; Linux: `sudo systemctl start mongod`; macOS: `brew services start mongodb-community`).
3. Use `MONGO_URI=mongodb://127.0.0.1:27017/skillbridge`

## Option B: MongoDB Atlas (cloud)
1. Create a free cluster at https://www.mongodb.com/atlas
2. Database Access: create a user with a password.
3. Network Access: add your IP (or 0.0.0.0/0 for development only).
4. Click Connect > Drivers and copy the connection string.
5. Put it in `backend/.env`:
   `MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/skillbridge`
   (URL-encode special characters in the password.)

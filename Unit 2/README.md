# Notes API - Unit 2 Assignment

REST API for Notes Application using Express.js, MongoDB, session based auth, Multer and Cloudinary.

## Features

- User register & login
- Session based authentication (signed cookies)
- Max 2 devices per user (oldest session gets removed on 3rd login)
- Logout and Logout from all devices
- Notes CRUD
- File/image upload using Multer + Cloudinary

## Setup

1. Clone the repo and go to Unit 2 folder
2. Install packages
```bash
npm install
```

3. Create `.env` file from `.env.example`
```bash
cp .env.example .env
```

4. Fill these values in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-api
COOKIE_SECRET=any_random_long_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start the server
```bash
npm start
```

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login (sets signed cookie) |
| POST | /api/auth/logout | Logout current device |
| POST | /api/auth/logout-all | Logout from all devices |
| GET | /api/auth/me | Get current user |

### Notes (Protected - need login)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/notes | Get all notes of logged in user |
| POST | /api/notes | Create note (optional file attachment) |
| GET | /api/notes/:id | Get single note |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |

## How auth works

1. User registers
2. User logs in → new session is created in DB
3. Signed cookie (`sessionId`) is sent to client
4. Every protected request checks the cookie and validates session
5. Max 2 active sessions allowed. If 3rd login happens, oldest session is deleted.

## Example Requests

**Register**
```json
POST /api/auth/register
{
  "name": "Leeladhar",
  "email": "leeladhar@example.com",
  "password": "123456"
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "leeladhar@example.com",
  "password": "123456"
}
```

**Create Note** (use form-data in Postman)
- title: My Note
- content: Some content here
- attachment: (optional file)

## Tech Used

- Express.js
- MongoDB + Mongoose
- cookie-parser (signed cookies)
- bcryptjs
- Multer
- Cloudinary
- uuid

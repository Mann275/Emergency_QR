# Emergency QR

Emergency QR is a full-stack emergency profile system.
A user creates one profile and gets one QR that can be scanned instantly in emergencies.

## Why This Project

- Fast emergency access without app install
- Public emergency view with only critical information
- Owner-only editing on the original device/session
- Mobile-first UI with multilingual support (English, Hindi, Gujarati)

## Core Rule

`1 user = 1 QR`

Once a logged-in user creates a profile:

- revisiting create form pre-fills old details
- saving updates keeps the same profile ID
- QR remains the same

## Stack

- Frontend: React 18, React Router 6, Tailwind CSS 3, Vite 4
- Backend: Node.js, Express 4, Mongoose 8
- Database: MongoDB
- Auth: Firebase Auth (email/password + Google)
- Security: JWT edit tokens, bcrypt hashing, helmet, rate limiting, NoSQL sanitization

## Local Setup

### 1) Clone

```bash
git clone https://github.com/Mann275/Emergency_QR.git
cd Emergency_QR
```

### 2) Server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:5000`.

### 3) Client

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Client runs on `http://localhost:5173`.

## Environment Files

Use these templates:

- [server/.env.example](server/.env.example)
- [client/.env.example](client/.env.example)

## Important Flows

### Profile create/update

- Create API returns profile ID + edit token
- Edit token is stored per profile in browser storage
- Update API requires this token in Bearer auth
- Unauthorized users cannot edit by guessing ID

### Emergency profile page

- Publicly readable by QR/URL
- Edit button appears only for the owner session/device

### Account actions

- Logged-in users get account dropdown actions:
  - Edit Profile
  - Download QR
  - Logout

## API Endpoints

- `POST /api/users/create` create or update owner profile while keeping same QR
- `GET /api/users/:id` fetch public emergency profile
- `PUT /api/users/update/:id` owner-authorized profile update
- `GET /api/health` backend health check

## Security Notes

- Helmet secure headers
- Rate limiting on API and write routes
- Request sanitization against NoSQL operator injection
- JWT + bcrypt protected edit authorization

## Project Structure

```text
Emergency_QR/
	client/
		src/
			components/
			context/
			pages/
			utils/
	server/
		models/
		routes/
		server.js
```

## License

MIT

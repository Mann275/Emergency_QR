#Emergency QR
<div align="center">

[Live Demo](https://emergencyqr-gen.vercel.app/) • [Report Bug](https://github.com/Mann275/Emergency_QR/issues)

</div>
Emergency QR is a full-stack emergency profile system. Users create a single profile that generates one stable QR code for instant, read-only access during emergencies.

## Key Capabilities

- One user = one QR (updates keep the same QR)
- Public emergency view shows only critical data
- Owner-only edits via per-profile edit token
- Mobile-first UI with multilingual support (EN/HI/GU)
- Auth via Firebase (email/password + Google)
- Email OTP via Brevo for password reset

## Stack

- Frontend: React 18, React Router 6, Vite 4, Tailwind CSS 3
- Backend: Node.js, Express 4, Mongoose 8
- Database: MongoDB
- Auth: Firebase Auth
- Security: JWT edit tokens, bcrypt, helmet, rate limiting, mongo-sanitize

## Local Development

### Server

```bash
cd server
npm install
npm run dev
```

Server: `http://localhost:5000`

### Client

```bash
cd client
npm install
npm run dev
```

Client: `http://localhost:5173`


## Core Flows

- **Create/Update Profile**: `POST /api/users/create` creates or updates while keeping the same QR.
- **Public Emergency View**: `GET /api/users/:id` returns read-only emergency data.
- **Edit Profile**: `PUT /api/users/update/:id` requires edit token (Bearer).
- **Password Reset**: OTP via Brevo email.

## API Endpoints

- `POST /api/users/create`
- `GET /api/users/:id`
- `GET /api/users/owner/:ownerAuthUid`
- `PUT /api/users/update/:id`
- `POST /api/users/auth/forgot-password/request`
- `POST /api/users/auth/forgot-password/verify`
- `POST /api/users/auth/forgot-password/reset`
- `GET /api/health`

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
    utils/
    server.js
```

## Preview
![alt text](https://ik.imagekit.io/shubhampathak/emergency-qr/1.jpeg)

![alt text](https://ik.imagekit.io/shubhampathak/emergency-qr/2.jpeg)
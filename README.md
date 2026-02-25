# Emergency QR - Instant Medical & Contact Info

A MERN stack application that generates QR codes containing emergency medical and contact information.

## Project Structure

```
Emergency/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── server.js     # Main server file
└── frontend/         # React + Tailwind CSS
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── utils/
    └── public/
```

## Features

- Create emergency profiles with medical information
- Generate QR codes for emergency access
- Public emergency information display
- Mobile-responsive design
- Secure data handling

## Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **QR Code:** qrcode npm package
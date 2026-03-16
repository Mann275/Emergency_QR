# Emergency QR

> QR-based emergency medical profile system. One scan reveals blood group, medications, allergies, and emergency contacts — no app install required.

## Tech Stack

| Layer    | Stack                                          |
|----------|-------------------------------------------------|
| Frontend | React 18, React Router 6, Tailwind CSS 3, Vite 4 |
| Backend  | Node.js, Express 4, Mongoose 8                  |
| Database | MongoDB                                         |
| Other    | QR Code generation, i18n (EN/HI/GU)             |

## Getting Started

### Prerequisites

- Node.js ≥ 16
- MongoDB instance (local or Atlas)

### Setup

```bash
# Clone
git clone https://github.com/Mann275/Emergency_QR.git
cd Emergency_QR

# Server
cd server
npm install
cp .env.example .env   # configure MONGODB_URI
npm run dev             # runs on :5000

# Client (new terminal)
cd client
npm install
npm run dev             # runs on :5173
```

### Environment Variables

**Server** (`server/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/emergencyqr
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Client** (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
Emergency_QR/
├── server/
│   ├── models/User.js        # Mongoose schema
│   ├── routes/users.js       # REST API endpoints
│   └── server.js             # Express entry point
├── client/src/
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── CreateProfile.jsx  # Profile creation form
│   │   ├── EditProfile.jsx    # Profile editing form
│   │   ├── EmergencyProfile.jsx # Public emergency view
│   │   └── Success.jsx        # QR download page
│   ├── components/            # Header, Footer, BottomNav
│   ├── context/               # Language & Theme providers
│   └── utils/api.js           # API service layer
└── README.md
```

## API Endpoints

| Method | Route                    | Description              |
|--------|--------------------------|--------------------------|
| POST   | `/api/users/create`      | Create profile + QR code |
| GET    | `/api/users/:id`         | Get emergency profile    |
| PUT    | `/api/users/update/:id`  | Update profile           |
| GET    | `/api/users`             | List all profiles        |

## Client Routes

| Path             | Page               |
|------------------|--------------------|
| `/`              | Home               |
| `/create`        | Create Profile     |
| `/edit/:id`      | Edit Profile       |
| `/emergency/:id` | Emergency Profile  |
| `/success/:id`   | QR Download        |

## Features

- **Profile CRUD** — Create and edit medical profiles with personal info, emergency contacts, and medical history
- **QR Generation** — Unique QR code per profile linking to the public emergency page
- **Zero-install access** — Any phone camera opens the emergency profile instantly
- **Multi-language** — English, Hindi, and Gujarati supported
- **Responsive** — Mobile-first design with glassmorphic UI

## Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT

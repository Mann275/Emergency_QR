# Emergency QR - Medical Information Management System

An emergency medical information management system that allows users to create personal profiles with critical medical data and generate a QR code for quick access during emergencies.

## 🌟 Features

- **Personal Profile Creation**: Create and manage detailed medical profiles
- **QR Code Generation**: Generate unique QR codes for instant profile access
- **Emergency Access**: Quick access to medical information during critical situations
- **Responsive Design**: Works on all devices - mobile, tablet, and desktop
- **Secure Storage**: Medical data is securely stored and accessible only through QR code
- **Offline Access**: Profile data can be accessed without internet connection

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/emergency-qr.git
   cd emergency-qr
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   - Copy `server/.env.example` to `server/.env`
   - Configure your MongoDB connection string
   - Update other environment variables as needed

5. **Start the development servers**

   ```bash
   # Start backend server (port 5000)
   cd server
   npm run dev

   # Start frontend server (port 3000) in new terminal
   cd client
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
emergency-qr/
├── server/                 # Backend API (Node.js + Express)
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Middleware functions
│   ├── server.js          # Server entry point
│   ├── package.json       # Server dependencies
│   └── .env.example       # Environment variables example
├── client/                 # Frontend application (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Application entry point
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
├── README.md              # Project documentation
└── .gitignore            # Git ignore rules
```

## 🛠️ Tech Stack

### Frontend

- **React 18.2.0**: UI library
- **React Router 6.8.0**: Routing management
- **Tailwind CSS 3.3.0**: Utility-first CSS framework
- **Vite 4.4.5**: Build tool and dev server
- **Axios 1.6.0**: HTTP client
- **QRCode.js 1.5.3**: QR code generation

### Backend

- **Node.js**: JavaScript runtime
- **Express 4.18.2**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose 8.0.0**: ODM for MongoDB
- **CORS 2.8.5**: Cross-origin resource sharing
- **JWT 9.0.2**: JSON Web Token authentication
- **bcryptjs 2.4.3**: Password hashing
- **Validator 13.11.0**: Data validation

## 📱 Usage

### Creating a Profile

1. Visit the homepage and click "Create Profile"
2. Fill in all the required fields including:
   - Personal information
   - Emergency contacts
   - Medical history
   - Current medications
   - Allergies
   - Insurance information
3. Click "Generate QR Code"
4. Download and save your QR code
5. Print or store the QR code in a accessible location (wallet, phone case, etc.)

### Accessing a Profile

1. Scan the QR code with any QR scanner
2. The profile information will be displayed instantly
3. No login or authentication required for emergency access

## 🔒 Security

- Medical data is stored securely in MongoDB
- QR codes contain encrypted profile identifiers
- No sensitive data is stored directly in the QR code
- Data is only accessible through authorized API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the project maintainers.

## 🎥 Demo

[Watch a quick demo of the application](#)

## 📊 Screenshots

### Homepage

![Homepage](https://via.placeholder.com/800x400/4CAF50/ffffff?text=Homepage)

### Create Profile

![Create Profile](https://via.placeholder.com/800x400/2196F3/ffffff?text=Create+Profile)

### QR Code Generation

![QR Code](https://via.placeholder.com/800x400/FFC107/000000?text=QR+Code+Generation)

### Profile Display

![Profile](https://via.placeholder.com/800x400/9C27B0/ffffff?text=Profile+Display)

## 🚀 Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Configure build settings
3. Deploy with one click

### Heroku (Backend)

1. Create a Heroku account
2. Install the Heroku CLI
3. Deploy your backend

### MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Connect your application

## 📈 Performance

- Fast initial load times
- Responsive design for all screen sizes
- Optimized for mobile devices
- Minimal bundle size

## 🔧 Configuration

### Environment Variables (Server)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emergencyqr
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Environment Variables (Client)

```env
VITE_API_URL=http://localhost:5000
```

## 🛡️ Security Measures

- Input validation
- CORS configuration
- Helmet security headers
- Rate limiting
- Data sanitization
- Error handling

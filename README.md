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

   **Server (.env)**

   ```bash
   cd server
   cp .env.example .env
   ```

   Configure the following variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Frontend URL for CORS and QR code generation
   - `PORT`: Server port (default: 5000)
   - `JWT_SECRET`: Secret key for JWT tokens

   **Client (.env)**

   ```bash
   cd client
   cp .env.example .env
   ```

   Configure:
   - `VITE_API_URL`: Backend API URL (e.g., `http://localhost:5000/api` for local, `https://your-backend.onrender.com/api` for production)

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

### Production Deployment

#### Frontend (Vercel)

1. **Deploy to Vercel**
   ```bash
   cd client
   vercel --prod
   ```
2. **Configure Environment Variables**
   In Vercel dashboard, set:
   - `VITE_API_URL`: Your production backend URL (e.g., `https://emergency-qr-jp5i.onrender.com/api`)

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Backend (Render/Heroku)

1. **Deploy to Render**
   - Connect your GitHub repository
   - Select the `server` directory as root
   - Set build command: `npm install`
   - Set start command: `npm start`

2. **Configure Environment Variables**
   Set the following in your hosting platform:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   FRONTEND_URL=https://emergencyqr-gen.vercel.app
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your_secret_key
   ```

#### Database (MongoDB Atlas)

1. Create a free cluster on MongoDB Atlas
2. Whitelist IP addresses (use `0.0.0.0/0` for all IPs)
3. Create a database user
4. Copy the connection string and update `MONGODB_URI`

### Health Check System

The application includes an automatic server health monitoring system:

- **Health Endpoint**: `/api/health` - Returns server status
- **Auto-Detection**: Frontend automatically checks server health every 30 seconds
- **Visual Feedback**: Yellow banner shows "Server is starting..." when backend is initializing
- **Error Handling**: Red banner appears when server is unreachable
- **User Experience**: Users are informed of server status during profile creation and access

This is especially useful for deployments on services like Render (free tier) where the server may go to sleep and take 30-60 seconds to restart.

### Deployment Checklist

#### Before Deploying:

- [ ] Update `client/.env` with production backend URL
- [ ] Update `server/.env` with production frontend URL
- [ ] Test health endpoint: `curl https://your-backend-url/api/health`
- [ ] Verify MongoDB connection string
- [ ] Ensure CORS settings allow your frontend domain
- [ ] Check QR code generation with production URLs

#### After Deploying:

- [ ] Test profile creation on production
- [ ] Verify QR code links to correct profile URL
- [ ] Test emergency profile access via QR code
- [ ] Monitor server health status banner
- [ ] Check network requests in browser DevTools

### Live Deployment

- **Frontend**: https://emergencyqr-gen.vercel.app
- **Backend**: https://emergency-qr-jp5i.onrender.com
- **Health Check**: https://emergency-qr-jp5i.onrender.com/api/health

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

## 🔧 Troubleshooting

### Profile Creation Not Working

**Issue**: Profile creation fails or shows "Server is starting" banner

**Solutions**:

1. **Check Backend Health**

   ```bash
   curl https://your-backend-url/api/health
   ```

   Expected response:

   ```json
   {
     "message": "Emergency QR API is running!",
     "timestamp": "2024-03-10T..."
   }
   ```

2. **Verify Environment Variables**
   - Client: `VITE_API_URL` should point to backend with `/api` suffix
   - Server: `FRONTEND_URL` should match your frontend domain

3. **Check CORS Settings**
   - Ensure server allows requests from your frontend domain
   - Check browser console for CORS errors

4. **Render Free Tier Delay**
   - Free tier goes to sleep after 15 minutes of inactivity
   - First request may take 30-60 seconds to wake up
   - Health check system will show "Server is starting..." during this time

### QR Code Not Working

**Issue**: QR code doesn't link to the correct profile

**Solutions**:

1. Verify `FRONTEND_URL` in server `.env` matches deployed frontend
2. Check QR code URL format: `https://your-frontend.com/emergency/{uniqueId}`
3. Ensure profile was created successfully (check database)

### Connection Timeout

**Issue**: Requests timeout or fail

**Solutions**:

1. Check if MongoDB Atlas allows connections from all IPs (`0.0.0.0/0`)
2. Verify MongoDB connection string is correct
3. Check if backend service is running
4. Increase timeout in API calls if needed

### Server Health Banner Not Disappearing

**Issue**: Health banner stays visible even when server is running

**Solutions**:

1. Check browser console for health check errors
2. Verify `/api/health` endpoint is accessible
3. Check CORS settings allow health check requests
4. Clear browser cache and refresh page

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

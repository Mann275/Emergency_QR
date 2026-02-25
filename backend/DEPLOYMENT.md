# Deployment Configuration for Railway/Render
# Backend deployment settings

# Environment Variables needed in production:
# NODE_ENV=production
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/emergencyqr
# JWT_SECRET=your_production_jwt_secret
# FRONTEND_URL=https://your-frontend-domain.vercel.app
# PORT=5000

# For Railway deployment:
nixpacks.toml:
[phases.build]
cmd = "npm install"

[phases.start] 
cmd = "npm start"

# For Render deployment:
# Build Command: npm install
# Start Command: npm start
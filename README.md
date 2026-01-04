# PLAYINDIA 🏏

India's Premier Sports Network - Connect, Compete, and Celebrate Sports!

## 🎯 Overview

PLAYINDIA is a comprehensive sports platform connecting players, coaches, and sports enthusiasts across India. Find teammates, join tournaments, book venues, and climb the leaderboards!

## 📱 Features

- 🎮 **Tournament Management** - Browse and register for local tournaments
- 🏆 **Leaderboards** - Track your rankings and compete with others
- 👥 **Find Nearby Players** - Connect with players in your area
- 📅 **Venue Booking** - Reserve sports facilities
- 💳 **Marketplace** - Buy and sell sports equipment
- 📊 **Player Profiles** - Track achievements and statistics

## 🛠️ Tech Stack

### Frontend (React Native)
- React Native with TypeScript
- React Navigation (Stack & Bottom Tabs)
- Axios for API calls
- React Native Vector Icons
- Animated API for smooth transitions

### Backend (Node.js)
- Express.js REST API
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Helmet & CORS for security
- Winston for logging
- Nodemailer for emails

## 📦 Project Structure

```
PLAYINDIA/
├── PlayIndia/          # React Native Mobile App
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── hooks/
│   │   ├── config/
│   │   └── utils/
│   ├── android/
│   ├── ios/
│   └── package.json
│
└── backend/            # Node.js Backend API
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   └── utils/
    ├── .env
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account
- React Native development environment
- Android Studio / Xcode

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Seed database with sample data
node seed.js

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd PlayIndia
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
```

## 🧪 Test Credentials

```
Email: test@playindia.com
Password: password123
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/leaderboard` - Get top players
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Tournaments
- `GET /api/tournaments` - List all tournaments
- `GET /api/tournaments/:id` - Get tournament details
- `POST /api/tournaments/:id/register` - Register for tournament

### Nearby Players
- `GET /api/nearby-players` - Find nearby players
- `POST /api/nearby-players/notify` - Notify players for match

## 🎨 Screens

1. **Splash & Onboarding** - Welcome flow
2. **Authentication** - Login/Register with skip for testing
3. **Home** - Tournament listings with filters
4. **Bookings** - Venue reservation system
5. **Leaderboard** - Player rankings
6. **Profile** - User stats and achievements
7. **Tournament Details** - Complete tournament information

## 🔧 Development

### Run Tests
```bash
npm test
```

### Build Android APK
```bash
cd PlayIndia/android
./gradlew assembleRelease
```

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or support, reach out through GitHub issues.

---

**Built with ❤️ for Indian Sports Community**

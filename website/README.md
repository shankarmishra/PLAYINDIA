# TeamUp India - Advanced Sports Platform Website

## Overview
TeamUp India is a comprehensive sports ecosystem connecting players, coaches, stores, and delivery partners across India. This website serves as both a marketing platform and an operational hub for the entire sports community.

## Features

### For Players
- Find and book verified coaches
- Join tournaments
- Purchase sports equipment
- Track fitness and performance
- Connect with other players

### For Coaches
- Create professional profiles
- Manage booking calendar
- Host tournaments
- Track earnings
- Access performance analytics

### For Stores
- List sports equipment
- Manage orders and inventory
- Assign deliveries
- Access sales analytics
- Reach local customers

### For Delivery Partners
- Accept delivery assignments
- Track earnings
- View route optimization
- Access customer communication

### For Admins
- Manage user approvals
- Monitor platform performance
- Control content management
- Set commission rates
- Access analytics and logs

## Technology Stack

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Headless UI

### Backend
- Node.js
- Express.js
- MongoDB (or PostgreSQL)
- JWT Authentication

## Project Structure

```
website/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout component
│   ├── pages/
│   │   ├── index.tsx           # Home page
│   │   ├── about.tsx           # About page
│   │   ├── features.tsx        # Features page
│   │   ├── how-it-works.tsx    # How it works page
│   │   ├── contact.tsx         # Contact page
│   │   ├── login.tsx           # Login page
│   │   ├── register.tsx        # Registration page
│   │   ├── 404.tsx             # 404 error page
│   │   ├── profile.tsx         # Profile page
│   │   ├── help.tsx            # Help center
│   │   ├── privacy.tsx         # Privacy policy
│   │   ├── terms.tsx           # Terms and conditions
│   │   ├── logout.tsx          # Logout page
│   │   ├── admin/
│   │   │   ├── index.tsx       # Admin dashboard
│   │   │   └── approvals.tsx   # Admin approvals
│   │   ├── coach/
│   │   │   ├── index.tsx       # Coach dashboard
│   │   │   └── register.tsx    # Coach registration
│   │   ├── store/
│   │   │   ├── index.tsx       # Store dashboard
│   │   │   └── register.tsx    # Store registration
│   │   ├── delivery/
│   │   │   ├── index.tsx       # Delivery dashboard
│   │   │   └── register.tsx    # Delivery registration
│   │   └── register/
│   │       └── player.tsx      # Player registration
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Base URL for the backend API
- `NEXT_PUBLIC_APP_NAME` - Name of the application
- `NEXT_PUBLIC_BASE_URL` - Base URL of the website

## API Endpoints

The website communicates with the backend API at `/api/*` routes. The backend handles:

- Authentication (login, registration)
- User management
- Booking management
- Payment processing
- Content management
- Analytics

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, contact us at:
- Email: support@teamupindia.com
- Phone: +91 98765 43210
- Website: teamupindia.com/contact

## About TeamUp India

TeamUp India is building the most comprehensive sports ecosystem in India, connecting all stakeholders in the sports industry to create opportunities for growth, development, and success.
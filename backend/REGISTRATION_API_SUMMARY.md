# Registration API Documentation

## Overview
The registration API endpoint allows new users to create accounts in the PlayIndia sports networking platform. It supports comprehensive user profiles with sports preferences, availability, and location-based features.

## API Endpoint
```
POST /api/auth/register
```

## Request Format
Base URL: `http://localhost:5000/api/auth/register` (or production equivalent)

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "name": "string (2-50 characters)",
  "email": "string (valid email format)",
  "password": "string (min 8 chars with uppercase, lowercase, number, special char)",
  "mobile": "string (10-12 digits)",
  "role": "string (optional, default: 'user')",
  "additionalData": {
    "city": "string (user location)",
    "favoriteGames": ["array of sport names"],
    "gender": "string (Male/Female/Other)",
    "dateOfBirth": "string (YYYY-MM-DD format)",
    "skillLevel": "string (beginner/intermediate/advanced)",
    "experience": "string (years of experience)",
    "preferredTime": "string (Morning/Evening/Weekend)",
    "availableDays": "string (Mon-Fri/Sat-Sun/Any Day)",
    "bio": "string (user bio)",
    "emergencyContact": "string (contact number)",
    "preferredRadius": "number (search radius in km)",
    "notificationsEnabled": "boolean",
    "locationSharing": "boolean"
  }
}
```

## Validation Rules
- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 8 characters with at least one uppercase letter, one lowercase letter, one number, and one special character
- **Mobile**: Required, 10-12 digits (will be normalized to 10 digits)
- **Role**: Optional, defaults to 'user' (other options: coach, seller, store, delivery)

## Processing Steps
1. Validate input data against schema
2. Normalize mobile number (remove country code, ensure 10 digits)
3. Check for existing user with same email/mobile
4. Generate referral code
5. Create user with profile data from additionalData
6. Create associated wallet with 0 balance
7. Create role-specific profile if applicable (coach, store, delivery)
8. Return success response with JWT token

## Response Format

### Success (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT token string",
  "user": {
    "id": "user ID",
    "name": "user name",
    "email": "user email",
    "mobile": "user mobile",
    "role": "user role",
    "status": "user status",
    "profileComplete": "boolean",
    "trustScore": "number",
    "level": "number",
    "experiencePoints": "number",
    "walletBalance": "number",
    "preferences": "user preferences",
    "profile": "user profile data"
  }
}
```

### Error Responses
- **400 Bad Request**: Validation errors or duplicate user
- **400 Bad Request**: Invalid input data

## Features
- **Referral System**: Automatically generates referral codes for new users
- **Wallet Creation**: Creates a wallet with 0 balance for each user
- **Role Support**: Supports different user roles (user, coach, store, delivery)
- **Profile Completeness**: Tracks profile completion status
- **Trust Score**: Implements user trust scoring system
- **Location Services**: Supports location-based features with radius preferences
- **Sports Preferences**: Comprehensive sports preference management
- **Availability Tracking**: Records preferred playing times and available days

## Database Models
- **User Model**: Core user data, authentication, and profile information
- **Wallet Model**: Financial transactions and balance tracking
- **Role-specific Models**: Coach, Store, Delivery models as needed

## Security Features
- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Generates secure tokens for session management
- **Input Validation**: Comprehensive validation to prevent injection attacks
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Mobile Normalization**: Standardizes mobile numbers for consistency
# SemiCrypto Backend API

Premium fintech trading platform backend built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [Running the Server](#running-the-server)
- [Error Handling](#error-handling)
- [Security](#security)

## ✨ Features

- **User Authentication**: JWT-based auth with refresh tokens
- **Two-Factor Authentication**: Optional 2FA for enhanced security
- **Trading System**: Place orders (BUY/SELL) with market/limit/stop orders
- **Portfolio Management**: Real-time portfolio tracking and metrics
- **Chat System**: Real-time messaging between users
- **Error Handling**: Comprehensive error handling with meaningful error codes
- **Input Validation**: Validate all inputs using express-validator
- **Rate Limiting**: Built-in request rate limiting
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **CORS**: Configured for frontend communication
- **Security**: Helmet.js for secure HTTP headers

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Language**: TypeScript
- **Database**: MongoDB 6+
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet
- **Testing**: Jest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+
- TypeScript 5+

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure environment variables** (see below)

## 🔧 Environment Configuration

Copy `.env.example` to `.env.local` and update with your values:

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/semicrypto
DB_NAME=semicrypto

# Authentication
JWT_SECRET=your_very_secure_secret_key_min_32_chars
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars
REFRESH_TOKEN_EXPIRY=30d

# Email (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@semicrypto.com

# Encryption
ENCRYPTION_KEY=your_encryption_key_32_chars

# Third-party APIs
STOCK_API_KEY=your_api_key
CRYPTO_API_KEY=your_api_key

# Logging
LOG_LEVEL=debug
```

### MongoDB Setup

#### Using MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database named `semicrypto`
3. Create a database user
4. Get connection string and add to `.env.local`

#### Local MongoDB

```bash
# Install MongoDB Community
# Start MongoDB
mongod
# Connection string: mongodb://localhost:27017/semicrypto
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {...},
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### Refresh Token
```
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <accessToken>
```

### Trading Endpoints

#### Search Stocks
```
GET /trading/search?query=BTC&type=CRYPTO
Authorization: Bearer <accessToken>
```

#### Get Stock Details
```
GET /trading/stocks/BTC
Authorization: Bearer <accessToken>
```

#### Place Order
```
POST /trading/orders
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "ticker": "BTC",
  "type": "BUY",
  "quantity": 0.5,
  "price": 45000,
  "orderType": "MARKET"
}
```

#### Get Order History
```
GET /trading/orders?status=FILLED&limit=20&offset=0
Authorization: Bearer <accessToken>
```

#### Cancel Order
```
PUT /trading/orders/{orderId}/cancel
Authorization: Bearer <accessToken>
```

### Portfolio Endpoints

#### Get Portfolio Overview
```
GET /portfolio
Authorization: Bearer <accessToken>
```

#### Get Holdings
```
GET /portfolio/holdings
Authorization: Bearer <accessToken>
```

#### Get Transactions
```
GET /portfolio/transactions?limit=50&offset=0
Authorization: Bearer <accessToken>
```

#### Get Metrics
```
GET /portfolio/metrics
Authorization: Bearer <accessToken>
```

### Chat Endpoints

#### Send Message
```
POST /chat/messages
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "recipientId": "userId",
  "content": "Hello, how are you?"
}
```

#### Get Messages
```
GET /chat/messages/{userId}
Authorization: Bearer <accessToken>
```

#### Get Chat Users
```
GET /chat/users
Authorization: Bearer <accessToken>
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── env.ts        # Environment variables
│   │   └── database.ts   # MongoDB connection
│   ├── models/           # Mongoose models
│   │   ├── User.ts
│   │   ├── Stock.ts
│   │   ├── Order.ts
│   │   ├── Portfolio.ts
│   │   └── ChatMessage.ts
│   ├── controllers/      # Business logic
│   │   ├── authController.ts
│   │   ├── tradingController.ts
│   │   ├── portfolioController.ts
│   │   └── chatController.ts
│   ├── routes/          # API routes
│   │   ├── auth.ts
│   │   ├── trading.ts
│   │   ├── portfolio.ts
│   │   └── chat.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT authentication
│   │   └── errorHandler.ts
│   ├── utils/           # Utility functions
│   └── server.ts        # Main server file
├── dist/               # Compiled JavaScript
├── .env.example        # Environment template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── README.md          # This file
```

## 💾 Database Models

### User Model
- Email (unique)
- Password (hashed)
- First/Last Name
- Avatar
- Email Verification Status
- 2FA Settings
- Account Status (ACTIVE, SUSPENDED, DELETED)
- KYC Status (PENDING, VERIFIED, REJECTED)
- User Preferences
- Timestamps

### Stock Model
- Ticker (unique)
- Name
- Type (CRYPTO, STOCK, COMMODITY)
- Current Price
- Previous Close Price
- Day High/Low
- Market Cap
- Trading Volume
- Currency
- Exchange
- Last Updated

### Order Model
- User ID (foreign key)
- Ticker
- Order Type (BUY, SELL)
- Quantity
- Price
- Order Type (MARKET, LIMIT, STOP)
- Status (PENDING, FILLED, PARTIALLY_FILLED, CANCELLED, REJECTED)
- Filled Quantity
- Average Fill Price
- Fees & Commission
- Timestamps

### Portfolio Model
- User ID (unique, foreign key)
- Holdings Array
  - Ticker
  - Quantity
  - Average Cost
  - Current Price
  - Total Value
  - Gain/Loss
  - Last Updated
- Cash Balance
- Total Value
- Timestamps

### Chat Message Model
- Sender ID (foreign key)
- Recipient ID (foreign key)
- Content
- Is Read
- Read At Timestamp
- Attachments Array
- Timestamps

## ▶️ Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
```

## 🛡️ Error Handling

All errors follow a standardized format:

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {}
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 422 | Input validation failed |
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `USER_NOT_FOUND` | 404 | User doesn't exist |
| `STOCK_NOT_FOUND` | 404 | Stock not found |
| `INSUFFICIENT_FUNDS` | 400 | Not enough cash for order |
| `INSUFFICIENT_HOLDINGS` | 400 | Not enough shares to sell |

## 🔐 Security

### Implemented Measures

1. **Password Security**
   - Bcryptjs hashing with salt rounds
   - Minimum 8 characters required

2. **JWT Token Management**
   - Short-lived access tokens (7 days)
   - Separate refresh token (30 days)
   - Token revocation on logout

3. **Input Validation**
   - Express-validator on all endpoints
   - Email format validation
   - Type checking

4. **CORS Protection**
   - Configured to frontend domain only
   - Credential cookies support

5. **HTTP Security Headers**
   - Helmet.js for secure headers
   - XSS Protection
   - CSRF Protection (configured)

6. **Database Security**
   - Connection pooling
   - Input parameterization (Mongoose)
   - Proper indexing

### Best Practices

- Never log sensitive data
- Use environment variables for secrets
- Regenerate tokens after login
- Implement rate limiting (recommended)
- Regular dependency updates
- SQL injection prevention (using Mongoose)

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode
- Descriptive variable names
- JSDoc comments for functions
- 80-120 character line length

### Commits
- Meaningful commit messages
- Atomic commits (one feature per commit)
- Reference issue numbers when applicable

### Testing
- Unit tests for controllers
- Integration tests for routes
- Mock external API calls

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Ensure MongoDB is running (mongod)
```

### JWT Token Errors
```
Error: TokenExpiredError
Solution: Use refresh token to get new access token
```

### CORS Issues
```
Solution: Verify FRONTEND_URL matches your frontend origin
```

## 📞 Support

For issues and questions:
1. Check the API documentation
2. Review error codes in Error Handling section
3. Check MongoDB connection
4. Verify environment variables

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by SemiCrypto Team**

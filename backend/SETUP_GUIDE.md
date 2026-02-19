# SemiCrypto Backend - Setup Guide

Quick start guide for setting up and running the SemiCrypto backend.

## 📋 Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
node --version   # Should be v18+
npm --version    # Should be v9+
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Setup Database

#### Option A: MongoDB Atlas (Recommended for Development)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier available)
4. Create a database user
5. Get connection string
6. Update `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/semicrypto?retryWrites=true&w=majority
```

#### Option B: Local MongoDB
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download from: https://www.mongodb.com/try/download/community
```

### 4. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

**Minimum required settings:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secure_key_at_least_32_chars
REFRESH_TOKEN_SECRET=another_secure_key_at_least_32_chars
```

### 5. Start Development Server
```bash
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║    🚀 SemiCrypto Backend API                          ║
║    Environment: DEVELOPMENT                            ║
║    Port: 5000                                          ║
║    API URL: http://localhost:5000                     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### 6. Test the Server
```bash
curl http://localhost:5000/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2024-02-19T10:30:00.000Z",
#   "environment": "development"
# }
```

## 🔑 Generate Secure Keys

For production, generate proper JWT secrets:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Environment Variables Explained

```env
# Server Configuration
NODE_ENV=development              # development, production, test
PORT=5000                         # Server port
API_URL=http://localhost:5000     # Public API URL
FRONTEND_URL=http://localhost:3000 # Frontend origin for CORS

# Database
MONGODB_URI=mongodb://...         # MongoDB connection string
DB_NAME=semicrypto               # Database name

# Authentication
JWT_SECRET=...                    # Access token secret (min 32 chars)
JWT_EXPIRY=7d                     # Access token expiration
REFRESH_TOKEN_SECRET=...          # Refresh token secret
REFRESH_TOKEN_EXPIRY=30d         # Refresh token expiration

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com          # SMTP server
SMTP_PORT=587                     # SMTP port
SMTP_USER=your_email@gmail.com    # SMTP username
SMTP_PASS=app_specific_password   # SMTP password
EMAIL_FROM=noreply@semicrypto.com # From email

# Security
ENCRYPTION_KEY=...                # Encryption key (min 32 chars)

# Third-party APIs (Optional)
STOCK_API_KEY=...                 # Stock API key
CRYPTO_API_KEY=...                # Crypto API key

# Logging
LOG_LEVEL=debug                   # error, warn, info, debug
```

## 🧪 Testing the API

### Using cURL

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

### Using Postman

1. Import the collection from `./postman/` (if available)
2. Set environment variables:
   - `base_url`: http://localhost:5000
   - `token`: (from login response)
3. Run requests from collection

### Using VS Code REST Client

Create `test.http`:
```http
### Health Check
GET http://localhost:5000/health

### Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123",
  "firstName": "Test",
  "lastName": "User"
}
```

## 🚨 Common Issues & Solutions

### Issue: MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify MongoDB URI in `.env.local`
- Check network connectivity for Atlas

### Issue: Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
# Or use different port
PORT=5001 npm run dev
```

### Issue: JWT Secret Too Short
```
Error: JWT secret must be at least 32 characters
```
**Solution:**
Generate new secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Issue: CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify `FRONTEND_URL` in `.env.local`
- Check frontend origin matches exactly
- Clear browser cache

## 📦 Project Structure Overview

```
backend/
├── src/
│   ├── config/          # Environment & database config
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, errors, etc.
│   └── server.ts        # Main entry point
├── dist/                # Compiled JS (after build)
├── .env.example         # Environment template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── README.md            # Full documentation
```

## 🔄 Development Workflow

### 1. Create New Feature

**Step 1: Create Model** (`src/models/NewModel.ts`)
```typescript
import { Schema, Document } from 'mongoose';

interface INewModel extends Document {
  // Your fields
}

const schema = new Schema<INewModel>({
  // Define fields
});

export default mongoose.model<INewModel>('NewModel', schema);
```

**Step 2: Create Controller** (`src/controllers/newController.ts`)
```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '@middleware/errorHandler';

export const getItems = asyncHandler(async (req, res) => {
  // Your logic
  res.json({ success: true, data: {} });
});
```

**Step 3: Create Routes** (`src/routes/new.ts`)
```typescript
import { Router } from 'express';
import { authenticate } from '@middleware/auth';
import * as newController from '@controllers/newController';

const router = Router();
router.use(authenticate);
router.get('/', newController.getItems);

export default router;
```

**Step 4: Mount Routes** (in `src/server.ts`)
```typescript
import newRoutes from './routes/new';
app.use('/api/new', newRoutes);
```

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] All environment variables set
- [ ] MongoDB Atlas cluster configured
- [ ] SSL certificates configured
- [ ] CORS correctly configured
- [ ] JWT secrets rotated
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] Tests passing

### Environment Setup
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
MONGODB_URI=mongodb+srv://prod_user:password@prod-cluster.mongodb.net/semicrypto
```

### Build & Deploy
```bash
npm run build
npm start
```

## 💡 Tips & Tricks

### Enable Auto-reload Development
```bash
npm run dev
# Server restarts on file changes
```

### Debug Mode
```bash
LOG_LEVEL=debug npm run dev
```

### Connect to MongoDB Compass
1. Download MongoDB Compass
2. Use your MongoDB URI
3. Browse collections visually

### Export/Import Data
```bash
# Export
mongoexport --uri "mongodb://localhost:27017/semicrypto" --collection users --out users.json

# Import
mongoimport --uri "mongodb://localhost:27017/semicrypto" --collection users --file users.json
```

## 📚 Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mongoose Documentation](https://mongoosejs.com/)

## ❓ FAQ

**Q: How do I update MongoDB schema?**
A: Modify the model, Mongoose is flexible with schema changes. For major migrations, write migration scripts.

**Q: How do I add a new API endpoint?**
A: See "Development Workflow" section above.

**Q: How do I test an endpoint?**
A: Use cURL, Postman, or VS Code REST Client (see "Testing the API" section).

**Q: Where are logs stored?**
A: Development: Console. Production: Configure with your logging service (Sentry, DataDog, etc.)

**Q: How do I reset the database?**
A: Delete all collections or drop the database through MongoDB Compass/Atlas UI.

---

**Need help? Check the full README.md or submit an issue!**

# Authentication Module Documentation

> Complete JWT authentication system for the Web App Template

## 🎯 Overview

This template includes a **production-ready authentication module** with:

- ✅ JWT token-based authentication (access + refresh tokens)
- ✅ Password hashing with bcrypt
- ✅ User registration and login
- ✅ Token refresh mechanism
- ✅ Protected routes middleware
- ✅ PostgreSQL + Prisma ORM
- ✅ TypeScript + Zod validation
- ✅ Frontend React components (Login/Register forms)
- ✅ Zustand state management
- ✅ Axios interceptor for auto token refresh

---

## 📦 Backend Setup

### 1. Database Setup

Start PostgreSQL and Redis using Docker Compose:

```bash
# Start database services
docker-compose up -d postgres redis

# Wait for services to be healthy (check with):
docker-compose ps
```

### 2. Install Dependencies

```bash
cd apps/backend
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**IMPORTANT**: Generate secure secrets for production:

```bash
# Generate random secrets (use these in production)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed test user (optional)
npm run db:seed
```

### 5. Start Backend

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

## 🔐 API Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "isActive": true,
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      ...
    }
  }
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "message": "Tokens refreshed successfully",
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🛡️ Protecting Routes

Use the `authenticate` middleware to protect routes:

```typescript
import { Router } from 'express';
import { authenticate } from './modules/auth/auth.middleware.js';

const router = Router();

// Public route
router.get('/public', (req, res) => {
  res.json({ message: 'This is public' });
});

// Protected route
router.get('/protected', authenticate, (req, res) => {
  // req.user is available here
  res.json({
    message: 'This is protected',
    user: req.user
  });
});

export default router;
```

### Optional Authentication

For routes that work for both authenticated and anonymous users:

```typescript
import { optionalAuthenticate } from './modules/auth/auth.middleware.js';

router.get('/optional', optionalAuthenticate, (req, res) => {
  if (req.user) {
    // User is authenticated
    res.json({ message: `Hello ${req.user.name}` });
  } else {
    // User is anonymous
    res.json({ message: 'Hello guest' });
  }
});
```

---

## 💻 Frontend Setup

### 1. Install Dependencies

```bash
cd apps/frontend
npm install react-hook-form @hookform/resolvers
```

### 2. Environment Variables

Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000
```

### 3. Use Auth Store

```typescript
import { useAuthStore } from './stores/authStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### 4. Protect Routes

```typescript
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### 5. Login/Register Forms

```typescript
import { LoginForm } from './modules/auth/components/LoginForm';
import { RegisterForm } from './modules/auth/components/RegisterForm';

<LoginForm onSuccess={() => navigate('/dashboard')} />
<RegisterForm onSuccess={() => navigate('/dashboard')} />
```

---

## 🧪 Testing

### Test User (Seeded)

```
Email: admin@test.com
Password: password123
```

### cURL Examples

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🏗️ Architecture

### Backend Structure

```
apps/backend/src/modules/auth/
├── auth.types.ts           # TypeScript interfaces
├── auth.utils.ts           # Password hashing, JWT generation/verification
├── auth.service.ts         # Business logic (register, login, refresh, etc.)
├── auth.middleware.ts      # Express middleware for route protection
├── auth.controller.ts      # Route handlers
└── auth.routes.ts          # Express routes

apps/backend/prisma/
├── schema.prisma           # Database schema (User, RefreshToken)
└── seed.ts                 # Database seed script
```

### Frontend Structure

```
apps/frontend/src/modules/auth/
├── components/
│   ├── LoginForm.tsx       # Login form with validation
│   ├── RegisterForm.tsx    # Register form with validation
│   └── ProtectedRoute.tsx  # Route guard component
├── hooks/
│   └── useAuth.ts          # Auth hooks
├── stores/
│   └── authStore.ts        # Zustand auth store
├── services/
│   └── authService.ts      # API calls
└── types/
    └── auth.types.ts       # TypeScript types
```

### Database Schema

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String         // bcrypt hashed
  name          String?
  isActive      Boolean        @default(true)
  emailVerified Boolean        @default(false)
  refreshTokens RefreshToken[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  lastLoginAt   DateTime?
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

---

## 🔒 Security Features

✅ **Password Hashing**: bcrypt with 10 salt rounds
✅ **JWT Tokens**: Separate secrets for access and refresh tokens
✅ **Short-lived Access Tokens**: 15 minutes (configurable)
✅ **Long-lived Refresh Tokens**: 7 days (configurable)
✅ **Token Rotation**: New refresh token on every refresh
✅ **Token Storage**: Refresh tokens stored in database
✅ **Token Cleanup**: Expired tokens automatically removed
✅ **Rate Limiting**: Built-in rate limiting on API routes
✅ **CORS**: Configured with credentials support
✅ **Helmet**: Security headers middleware
✅ **Validation**: Zod schema validation on all inputs

---

## 📝 Configuration

### JWT Token Lifetimes

Edit `.env` to customize token expiration:

```bash
JWT_ACCESS_EXPIRES_IN=15m   # 15 minutes
JWT_REFRESH_EXPIRES_IN=7d   # 7 days

# Other formats:
# 10s = 10 seconds
# 5m = 5 minutes
# 2h = 2 hours
# 30d = 30 days
```

### Password Requirements

Edit `apps/backend/src/modules/auth/auth.utils.ts`:

```typescript
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/[A-Z]/, 'Must contain uppercase') // Add custom rules
    .regex(/[0-9]/, 'Must contain number'),
  name: z.string().min(2).optional(),
});
```

---

## 🚀 Production Deployment

### Environment Variables

**CRITICAL**: Change these in production:

```bash
# Generate secure secrets:
JWT_ACCESS_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

# Use strong database password
DATABASE_URL="postgresql://user:STRONG_PASSWORD@host:5432/db"
```

### Database Migrations

```bash
# Run migrations in production
npm run db:migrate:deploy
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Migrations will run automatically via Dockerfile CMD
```

---

## 🆘 Troubleshooting

### "Missing required environment variable"

Make sure `.env` file exists and contains all required variables from `.env.example`.

### "Access token expired"

This is expected behavior. The frontend should automatically refresh the token using the `/api/auth/refresh` endpoint.

### "Invalid refresh token"

Refresh tokens expire after 7 days or can be invalidated on logout. User needs to login again.

### Database connection errors

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check connection
docker-compose exec postgres psql -U webapp -d webapp_db
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io/)
- [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

---

🎉 **Your auth module is ready!** Start building your authenticated features.

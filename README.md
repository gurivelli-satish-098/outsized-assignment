# 🔐 Outsized Authentication System

A robust, serverless authentication system built with TypeScript, AWS Lambda, Sequelize, Supabase, and JWT. This system provides comprehensive user management with role-based access control, rate limiting, and secure password handling.

## 🚀 Live API Documentation

### 📚 **Netlify Documentation (Recommended)**

**🌐 Main Documentation**: [https://admirable-rolypoly-777506.netlify.app/](https://admirable-rolypoly-777506.netlify.app/)

**📋 Alternative URLs**:

- [https://admirable-rolypoly-777506.netlify.app/api-docs](https://admirable-rolypoly-777506.netlify.app/api-docs)
- [https://admirable-rolypoly-777506.netlify.app/docs](https://admirable-rolypoly-777506.netlify.app/docs)
- [https://admirable-rolypoly-777506.netlify.app/swagger](https://admirable-rolypoly-777506.netlify.app/swagger)

**📄 Raw API Spec**: [https://admirable-rolypoly-777506.netlify.app/swagger.yaml](https://admirable-rolypoly-777506.netlify.app/swagger.yaml)

**🔐 Email Verification Page**: [https://admirable-rolypoly-777506.netlify.app/email-verification](https://admirable-rolypoly-777506.netlify.app/email-verification)

### 🚀 **Deploy Your Own**

**Deploy to Netlify**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/outsized-auth)

## ✨ Features

### 🔐 Core Authentication

- **User Registration & Login** with email/password
- **JWT Token Management** with configurable expiry
- **Password Reset** via email with secure tokens
- **Email Verification** webhook integration with Supabase
- **Role-based Access Control** (ADMIN, CUSTOMER)
- **Account Management** (create, delete, update)

### 🛡️ Security Features

- **Rate Limiting** with Redis-based tracking
- **IP Whitelist/Blocklist** management
- **Password Hashing** with bcrypt (11 rounds)
- **Input Validation** with comprehensive validators
- **Admin-only Operations** for sensitive actions
- **CORS Support** for cross-origin requests

### 🏗️ Infrastructure

- **Serverless Architecture** (AWS Lambda)
- **Database Integration** (MySQL with Sequelize ORM)
- **Redis Caching** for rate limiting and sessions
- **Supabase Integration** for auth and storage
- **Request Logging** with automatic sync to database
- **TypeScript** for type safety and better development experience

## 📡 API Endpoints

### 🌐 **Base URL**

```
https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod
```

### 🔍 **Health Check**

```http
GET /health
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/health](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/health)

### 🔐 **Authentication Endpoints**

#### User Registration

```http
POST /auth/sign-up
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-up](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-up)

#### User Login

```http
POST /auth/sign-in
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-in](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-in)

#### Request Password Reset

```http
POST /auth/request-password-reset
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/request-password-reset](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/request-password-reset)

#### Reset Password

```http
POST /auth/reset-password
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/reset-password](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/reset-password)

**Client-Side Handler**: [https://outsized-auth-docs.netlify.app/auth-callback](https://outsized-auth-docs.netlify.app/auth-callback)

> **Note**: Both email verification and password reset flows use a single client-side HTML page that handles Supabase callbacks with URL fragments based on the `type` parameter. Users are redirected to this page after clicking links in their emails.

#### Email Verification Webhook

```http
GET /auth/email-verification
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/email-verification](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/email-verification)

**Client-Side Handler**: [https://outsized-auth-docs.netlify.app/auth-callback](https://outsized-auth-docs.netlify.app/auth-callback)

### 👥 **User Management Endpoints**

#### Get User Profile

```http
GET /user
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user)
**Auth**: Bearer Token Required

#### Create User (Admin Only)

```http
POST /user
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user)
**Auth**: Admin Bearer Token Required

#### Delete User (Admin Only)

```http
DELETE /user
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user)
**Auth**: Admin Bearer Token Required

### 🔧 **CORS Preflight**

```http
OPTIONS /{proxy+}
```

**URL**: [https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/)

## 🏗️ Architecture

```
├── clients/           # Database and service clients
│   ├── mysql.ts      # MySQL/Sequelize connection
│   ├── redis.ts      # Redis client singleton
│   └── supabase.ts   # Supabase client
├── constants/         # Application constants
├── middlewares/       # Authentication and rate limiting
├── models/           # Sequelize database models
├── services/         # Core business services
├── utils/            # Utility functions
├── validators/       # Input validation
├── public/           # Static files (docs, landing page)
├── handler.ts        # Lambda function handlers
└── serverless.yml    # AWS deployment configuration
```

## 🔧 Handler Interfaces & Type Safety

This project uses comprehensive TypeScript interfaces to ensure type safety across all Lambda handler functions. The interfaces are defined in `types/handler.ts` and provide strong typing for request/response structures.

### 📁 Interface Structure

```
types/
└── handler.ts          # All handler interfaces and types
```

### 🔗 Core Interfaces

#### LambdaEvent

Base interface for all Lambda function events:

```typescript
interface LambdaEvent {
  body?: string;
  user?: { id: string; role?: string };
  httpMethod?: string;
  queryStringParameters?: {
    access_token?: string;
    refresh_token?: string;
  };
  path?: string;
  pathParameters?: { proxy?: string };
  headers?: { [key: string]: string };
}
```

#### LambdaResponse

Standard response structure for all handlers:

```typescript
interface LambdaResponse {
  statusCode: number;
  headers: {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Headers": string;
    "Access-Control-Allow-Methods": string;
    "Content-Type": string;
  };
  body: string;
}
```

### 🔐 Authentication Interfaces

#### SignUpRequest/SignUpResponse

```typescript
interface SignUpRequest {
  email: string;
  password: string;
}

interface SignUpResponse {
  message: string;
  data: { id: string; email: string };
}
```

#### SignInRequest/SignInResponse

```typescript
interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; role: string };
  };
}
```

### 👥 User Management Interfaces

#### CreateUserRequest/CreateUserResponse (Admin Only)

```typescript
interface CreateUserRequest {
  email: string;
  password: string;
  role?: string;
}

interface CreateUserResponse {
  message: string;
  data: { id: string; email: string; role: string };
}
```

#### DeleteUserRequest/DeleteUserResponse (Admin Only)

```typescript
interface DeleteUserRequest {
  email: string;
}

interface DeleteUserResponse {
  message: string;
  data: { email: string; deleted: boolean };
}
```

### 🔄 Password Reset Interfaces

#### RequestPasswordResetRequest/RequestPasswordResetResponse

```typescript
interface RequestPasswordResetRequest {
  email: string;
}

interface RequestPasswordResetResponse {
  message: string;
  data: { email: string; resetTokenSent: boolean };
}
```

#### ResetPasswordRequest/ResetPasswordResponse

```typescript
interface ResetPasswordRequest {
  accessToken: string;
  refreshToken: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  data: { email: string; passwordUpdated: boolean };
}
```

### 🎯 Handler Function Types

All handler functions are strongly typed with specific function types:

```typescript
// Authentication handlers
export type SignUpHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type SignInHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type EmailVerificationWebhookHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;

// User management handlers
export type CreateUserHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type DeleteUserHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type FetchUserHandler = (event: LambdaEvent) => Promise<LambdaResponse>;

// Password reset handlers
export type RequestPasswordResetHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;
export type ResetPasswordHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;

// Utility handlers
export type HealthHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
export type SyncRequestLogsHandler = (
  event: LambdaEvent
) => Promise<LambdaResponse>;
export type CORSHandler = (event: LambdaEvent) => Promise<LambdaResponse>;
```

### 🔧 Usage in Handler Functions

Each handler function is typed with its specific interface:

```typescript
// Example: Sign-up handler with proper typing
export const signUp: SignUpHandler = async (event: LambdaEvent) => {
  try {
    // Parse request body with type safety
    const { email, password }: SignUpRequest = JSON.parse(event.body || "{}");

    // Validate input
    await signUpValidator({ email, password });

    // Process request
    const result = await authService.signUp({ email, password });

    // Return typed response
    return successResponse({
      message: "User signed up successfully",
      data: result,
    });
  } catch (error) {
    return errorResponse(error);
  }
};
```

### ✅ Benefits of Type Safety

1. **Compile-time Error Detection**: TypeScript catches type mismatches before runtime
2. **Better IDE Support**: Enhanced autocomplete and IntelliSense
3. **Self-documenting Code**: Interfaces serve as living documentation
4. **Refactoring Safety**: Changes to interfaces catch breaking changes early
5. **Consistent API Structure**: Ensures all responses follow the same pattern

### 🧪 Testing with Interfaces

The interfaces are also used in test files to ensure type consistency:

```typescript
// Test example with proper typing
it("should return success for valid credentials", async () => {
  const event: LambdaEvent = {
    body: JSON.stringify({
      email: "test@example.com",
      password: "password123",
    }),
    headers: { "x-forwarded-for": "127.0.0.1" },
  };

  const response: LambdaResponse = await signIn(event);
  expect(response.statusCode).toBe(200);
});
```

## 📋 Prerequisites

- **Node.js 16+**
- **MySQL Database** (AWS RDS, PlanetScale, or local)
- **Redis Server** (AWS ElastiCache, Upstash, or local)
- **Supabase Account** ([supabase.com](https://supabase.com))
- **AWS Account** (for Lambda deployment)
- **Serverless Framework** (`npm install -g serverless`)

## 🔧 Environment Variables

Create a `.env` file with the following variables:

### 📊 Database Configuration

```env
# MySQL Database
DB_DIALECT=mysql
DB_HOST=your-mysql-host.com
DB_PORT=3306
DB_DATABASE=outsized_auth
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Read Replica (Optional - for high availability)
DB_READ_HOST=your-read-replica-host.com
DB_READ_USER=your_read_user
DB_READ_PASSWORD=your_read_password
```

### 🔴 Redis Configuration

```env
# Redis Connection
REDIS_URL=redis://your-redis-host:6379
# Alternative formats:
# REDIS_URL=redis://username:password@host:6379
# REDIS_URL=rediss://host:6379 (for SSL)
```

### 🔐 Supabase Configuration

```env
# Supabase Project
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🔑 JWT Configuration

```env
# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### 📧 Email Configuration

```env
# Note: Redirect URLs are configured in Supabase project settings
# Email verification and password reset will redirect to:
# https://outsized-auth-docs.netlify.app/auth-callback
```

### 🌍 AWS Configuration (Optional)

```env
# AWS Region
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

## 🚀 Quick Start

### 1. **Clone and Install**

```bash
git clone <repository-url>
cd outsized-auth
npm install
```

### 2. **Set Up Environment**

```bash
# Copy example environment file
cp env.example .env

# Edit with your actual values
nano .env
```

### 3. **Set Up Database**

```sql
-- Create your MySQL database
CREATE DATABASE outsized_auth;

-- Run the SQL scripts to create tables
-- (Tables will be created automatically by Sequelize)
```

### 4. **Deploy to AWS**

```bash
# Deploy to production
npm run deploy:prod

# Deploy to development
npm run deploy:dev

# Deploy to staging
npm run deploy:staging
```

### 5. **Test Your API**

```bash
# Test health endpoint
curl https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/health

# Test sign up
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Test sign in
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

## 📋 API Usage Examples

### 🔍 Health Check

```bash
curl https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is UP!"
}
```

### 👤 Authentication Examples

#### Sign Up

```bash
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

#### Sign In

```bash
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

#### Request Password Reset

```bash
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

#### Reset Password

**Step 1: Request Password Reset**

```bash
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Step 2: User clicks email link and gets redirected to client-side handler**

```
https://outsized-auth-docs.netlify.app/auth-callback#access_token=...&refresh_token=...&type=recovery
```

**Step 3: Client-side handler calls API (automatically)**

```bash
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "supabase_access_token",
    "refreshToken": "supabase_refresh_token",
    "newPassword": "NewSecurePass123"
  }'
```

### 👥 User Management Examples

#### Get User Profile

```bash
curl -X GET https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create User (Admin Only)

```bash
curl -X POST https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123",
    "role": "CUSTOMER"
  }'
```

#### Delete User (Admin Only)

```bash
curl -X DELETE https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/user \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

## 🛠️ Development

### Local Development

```bash
# Start local development server
npm run dev

# Run tests
npm test

# View logs
npm run logs:dev
```

### Available Scripts

```bash
# API Deployment
npm run deploy:dev      # Deploy to development
npm run deploy:staging  # Deploy to staging
npm run deploy:prod     # Deploy to production

# API Management
npm run remove:dev      # Remove development deployment
npm run remove:prod     # Remove production deployment

# API Monitoring
npm run logs:dev        # View development logs
npm run logs:prod       # View production logs

# Documentation Deployment
npm run docs:serve      # Serve docs locally
npm run docs:deploy     # Deploy to Netlify
npm run docs:preview    # Preview deployment
./scripts/deploy-docs.sh # Automated deployment script
```

## 📊 Database Schema

### Core Tables

- **`outsized_users`** - User accounts and profiles
- **`outsized_roles`** - User roles (ADMIN, CUSTOMER)
- **`outsized_user_roles`** - User-role assignments
- **`outsized_functionalities`** - System functionalities
- **`outsized_role_permissions`** - Role-permission mappings
- **`outsized_request_logs`** - API request logging

## 🔒 Security Considerations

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Block Duration**: 15 minutes on violation

### JWT Configuration

- **Expiry**: 3 minutes (short-lived for security)
- **Algorithm**: HS256
- **Secret**: Environment variable (keep secure)

## 🚀 Deployment Options

### 1. **AWS Lambda (Recommended)**

```bash
npm run deploy:prod
```

- **Cost**: Pay-per-use
- **Scalability**: Automatic
- **Region**: ap-south-1

### 2. **Vercel (Frontend + Proxy)**

```bash
# Deploy frontend to Vercel
vercel --prod

# Set AWS API URL as environment variable
vercel env add AWS_API_BASE_URL
```

- **Cost**: Free tier available
- **Performance**: Global CDN
- **Integration**: Easy with AWS Lambda

### 3. **Netlify Functions**

```bash
# Deploy to Netlify
netlify deploy --prod
```

## 📈 Monitoring & Logs

### View Logs

```bash
# Real-time logs
npm run logs:prod --tail

# Specific function logs
serverless logs --function sign-up --stage prod
```

### CloudWatch Metrics

- Function invocations
- Duration and memory usage
- Error rates
- API Gateway metrics

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   ```bash
   # Check database credentials
   # Verify security groups
   # Test connection manually
   ```

2. **Redis Connection Failed**

   ```bash
   # Check Redis URL format
   # Verify Redis is accessible
   # Check authentication
   ```

3. **Supabase Errors**
   ```bash
   # Verify project URL and API key
   # Check email templates
   # Ensure proper CORS settings
   ```

### Debug Commands

```bash
# Test locally
npm run dev

# Check serverless configuration
serverless print --stage prod

# Validate serverless.yml
serverless validate
```

## 📞 Support

- **Documentation**: [API Docs](https://74u6z8bv6b.execute-api.ap-south-1.amazonaws.com/prod/docs)
- **Netlify Docs**: Deploy with `./scripts/deploy-docs.sh`
- **Issues**: Create an issue in the repository
- **Email**: Contact the development team

## 🚀 Quick Deploy

### Option 1: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/outsized-auth)

### Option 2: Automated Script

```bash
# Make script executable (first time only)
chmod +x scripts/deploy-docs.sh

# Deploy documentation
./scripts/deploy-docs.sh
```

### Option 3: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
npm run docs:deploy
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**Built with ❤️ using TypeScript, AWS Lambda, and Supabase**

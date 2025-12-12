# Primetrade.ai - Production-Ready REST API

A production-ready Node.js REST API with user authentication, role-based access control (RBAC), and CRUD operations for task management.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Refresh Token System**: Short-lived access tokens (15m) with long-lived refresh tokens (7d)
- **Role-Based Access Control**: User and Admin roles with permission checks
- **Task Management**: Full CRUD operations with search, filter, and pagination
- **Input Validation**: Server-side validation using Zod schemas
- **Security Features**:
    - Password hashing with bcrypt (12 salt rounds)
    - HTTP-only cookies for refresh tokens
    - Rate limiting on authentication endpoints
    - Helmet.js for security headers
    - CORS configuration
    - MongoDB injection prevention
- **Error Handling**: Centralized error handling with proper status codes
- **Logging**: Winston logger with file and console transports
- **API Versioning**: All routes prefixed with `/api/v1`

## 📋 Tech Stack

- **Runtime**: Node.js >= 18
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: bcrypt, helmet, cors, express-rate-limit
- **Logging**: Winston
- **Testing**: Jest & Supertest

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd Primetrade.ai/backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` file with your configuration:

    ```env
    PORT=5000
    NODE_ENV=development

    MONGO_URI=mongodb://localhost:27017
    MONGO_DB_NAME=primetrade

    ACCESS_TOKEN_SECRET=your_secure_secret_key_min_32_chars
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_SECRET=your_secure_refresh_secret_min_32_chars
    REFRESH_TOKEN_EXPIRY=7d

    CORS_ORIGIN=http://localhost:3000,http://localhost:5173
    LOG_LEVEL=info
    ```

    **Important**: Generate secure random secrets for production:

    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```

4. **Create logs directory**

    ```bash
    mkdir logs
    ```

5. **Start MongoDB**
    - Local: `mongod --dbpath /path/to/data`
    - Or use MongoDB Atlas connection string

### Running the Application

**Development mode with auto-reload:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

### Health Check

Visit `http://localhost:5000/health` to verify the server is running.

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGc..."
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "User logged in successfully",
  "user": { ... },
  "accessToken": "eyJhbGc..."
}
```

#### Refresh Access Token

```http
POST /api/v1/auth/refresh
Cookie: refreshToken=...

Response: 200 OK
{
  "success": true,
  "message": "Access token refreshed",
  "accessToken": "eyJhbGc..."
}
```

#### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "message": "User logged out successfully"
}
```

### User Endpoints

#### Get Current User Profile

```http
GET /api/v1/users/me
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Update Profile

```http
PUT /api/v1/users/me
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}

Response: 200 OK
```

#### Get All Users (Admin Only)

```http
GET /api/v1/users?page=1&limit=20&role=user&isActive=true
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "users": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

#### Update User (Admin Only)

```http
PUT /api/v1/users/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "role": "admin",
  "isActive": false
}

Response: 200 OK
```

### Task Endpoints

#### Create Task

```http
POST /api/v1/tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "status": "open",
  "tags": ["documentation", "priority"],
  "dueDate": "2025-12-31T23:59:59Z"
}

Response: 201 Created
{
  "success": true,
  "message": "Task created successfully",
  "task": { ... }
}
```

#### Get All Tasks

```http
GET /api/v1/tasks?q=documentation&status=open&page=1&limit=20&sort=-createdAt
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "items": [...],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

**Query Parameters:**

- `q`: Search text (searches in title and description)
- `status`: Filter by status (open, in-progress, done)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (prefix with `-` for descending, e.g., `-createdAt`)

#### Get Task by ID

```http
GET /api/v1/tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "task": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "status": "open",
    "owner": {
      "_id": "...",
      "name": "...",
      "email": "..."
    },
    "tags": [],
    "dueDate": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Update Task

```http
PUT /api/v1/tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "in-progress",
  "description": "Updated description"
}

Response: 200 OK
{
  "success": true,
  "message": "Task updated successfully",
  "task": { ... }
}
```

#### Delete Task

```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Admin Hard Delete:**

```http
DELETE /api/v1/tasks/:id?hard=true
Authorization: Bearer <accessToken> (Admin)
```

## 🔒 Security Best Practices

### Password Security

- Passwords hashed with bcrypt (12 salt rounds)
- Minimum 8 characters required
- Stored as `passwordHash` in database
- Never returned in API responses

### JWT Token Management

- **Access Token**: Short-lived (15 minutes), sent in Authorization header
- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie
- Tokens include user ID, email, and role
- Refresh tokens stored in database for validation

### Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes
- General API endpoints: 100 requests per 15 minutes

### HTTPS in Production

Always use HTTPS in production. Configure your reverse proxy (nginx/Apache) or hosting platform to enforce HTTPS.

### Environment Variables

- Never commit `.env` file to version control
- Use strong, random secrets for JWT tokens
- Rotate secrets periodically
- Use different secrets for development and production

### MongoDB Security

- Use parameterized queries (Mongoose handles this)
- Validate and sanitize all user inputs
- Use MongoDB Atlas with IP whitelisting in production
- Enable authentication on MongoDB

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Test Structure

```
backend/
  __tests__/
    auth.test.js       # Authentication tests
    tasks.test.js      # Task CRUD tests
    users.test.js      # User management tests
```

## 📦 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong, unique secrets for JWT tokens
3. Configure MongoDB Atlas connection
4. Set up proper CORS origins
5. Enable HTTPS

### Deployment Platforms

#### Heroku

```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set ACCESS_TOKEN_SECRET=your_secret
# ... set other env vars
git push heroku main
```

#### Railway

```bash
# Install Railway CLI
railway login
railway init
railway up
# Configure environment variables in Railway dashboard
```

#### DigitalOcean / AWS / Azure

1. Set up a VPS or container service
2. Install Node.js and MongoDB
3. Clone repository and install dependencies
4. Configure environment variables
5. Use PM2 for process management:
    ```bash
    npm install -g pm2
    pm2 start index.js --name primetrade-api
    pm2 save
    pm2 startup
    ```

### Docker Support (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
    api:
        build: .
        ports:
            - "5000:5000"
        env_file:
            - .env
        depends_on:
            - mongodb
    mongodb:
        image: mongo:latest
        ports:
            - "27017:27017"
        volumes:
            - mongodb_data:/data/db

volumes:
    mongodb_data:
```

Run with Docker:

```bash
docker-compose up -d
```

## 📈 Scalability Considerations

See [SCALABILITY.md](./SCALABILITY.md) for detailed scaling strategies.

**Quick Summary:**

- **Caching**: Implement Redis for session storage and API response caching
- **Database**: Use MongoDB replica sets and sharding for high availability
- **Load Balancing**: Deploy multiple API instances behind a load balancer
- **CDN**: Serve static assets through a CDN
- **Monitoring**: Use tools like Sentry, New Relic, or Datadog

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For issues and questions, please open an issue on GitHub.

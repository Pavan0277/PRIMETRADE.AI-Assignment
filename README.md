# Primetrade.AI

A modern, full-stack task management application built with React and Node.js featuring a bold **Neo-Brutalist** design aesthetic.

## 🌐 Live Demo

| Service               | URL                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**          | [https://primetrade-ai-assignment-delta.vercel.app/](https://primetrade-ai-assignment-delta.vercel.app/)                                                                    |
| **Backend API**       | [https://primetrade-ai-assignment-sd1x.onrender.com](https://primetrade-ai-assignment-sd1x.onrender.com)                                                                    |
| **API Documentation** | [Postman Collection](https://www.postman.com/garud-1010/workspace/primetrade-ai-api/collection/40534176-58b569ad-c354-457d-92bb-c1b98ee79ffc?action=share&creator=40534176) |

---

## 📋 Table of Contents

-   [Features](#-features)
-   [Tech Stack](#-tech-stack)
-   [Project Structure](#-project-structure)
-   [Getting Started](#-getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Backend Setup](#backend-setup)
    -   [Frontend Setup](#frontend-setup)
-   [Environment Variables](#-environment-variables)
-   [API Endpoints](#-api-endpoints)
-   [User Features](#-user-features)

---

## ✨ Features

### Authentication & Authorization

-   🔐 Secure JWT-based authentication with access & refresh tokens
-   🔄 Automatic token refresh mechanism
-   👥 Role-based access control (User/Admin)
-   🚪 Secure logout with token invalidation

### Task Management

-   ✅ Create, read, update, and delete tasks
-   🏷️ Task status tracking (Open, In Progress, Done)
-   🔍 Search and filter tasks
-   📄 Pagination support
-   🗓️ Due date management
-   🏷️ Tags support

### User Management

-   👤 User profile management
-   🔒 Password update functionality
-   👑 Admin panel for user management
-   ⚡ Toggle user active status (Admin)

### UI/UX

-   🎨 Neo-Brutalist design with bold borders and shadows
-   📱 Fully responsive design with mobile hamburger menu
-   🔔 Toast notifications for user feedback
-   ⚡ Optimistic updates with React Query
-   🎯 Active route highlighting in navigation

---

## 🛠️ Tech Stack

### Frontend

| Technology            | Purpose                    |
| --------------------- | -------------------------- |
| React 19              | UI Framework               |
| Vite                  | Build Tool                 |
| Tailwind CSS 4        | Styling                    |
| React Router DOM 7    | Routing                    |
| TanStack React Query  | Server State Management    |
| React Hook Form + Zod | Form Handling & Validation |
| Axios                 | HTTP Client                |
| React Hot Toast       | Notifications              |

### Backend

| Technology         | Purpose          |
| ------------------ | ---------------- |
| Node.js            | Runtime          |
| Express 5          | Web Framework    |
| MongoDB + Mongoose | Database         |
| JWT                | Authentication   |
| Bcrypt             | Password Hashing |
| Helmet             | Security Headers |
| Winston            | Logging          |
| Zod                | Validation       |
| Jest + Supertest   | Testing          |

---

## 📁 Project Structure

```
Primetrade.ai/
├── backend/
│   ├── controller/          # Route handlers
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   └── user.controller.js
│   ├── db/                  # Database connection
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middlewares.js
│   │   ├── error.middleware.js
│   │   └── rateLimiter.js
│   ├── models/              # Mongoose models
│   │   ├── task.model.js
│   │   └── user.model.js
│   ├── routers/             # API routes
│   ├── utils/               # Helper utilities
│   ├── validators/          # Zod schemas
│   ├── __tests__/           # Jest tests
│   ├── app.js               # Express app setup
│   └── index.js             # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client configuration
│   │   ├── components/      # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── UI.jsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── AdminPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── TaskDetailPage.jsx
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── index.html
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js** >= 18.x
-   **npm** or **yarn**
-   **MongoDB** (local or Atlas)

### Backend Setup

1. **Navigate to backend directory:**

    ```bash
    cd backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create environment file:**

    ```bash
    cp .env.example .env
    ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables))

5. **Start development server:**

    ```bash
    npm run dev
    ```

6. **Run tests (optional):**
    ```bash
    npm test
    ```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create environment file:**

    ```bash
    cp .env.example .env
    ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables))

5. **Start development server:**
    ```bash
    npm run dev
    ```

The frontend will start on `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable               | Description                             | Example                     |
| ---------------------- | --------------------------------------- | --------------------------- |
| `PORT`                 | Server port                             | `5000`                      |
| `NODE_ENV`             | Environment mode                        | `development`               |
| `MONGO_URI`            | MongoDB connection string               | `mongodb://localhost:27017` |
| `MONGO_DB_NAME`        | Database name                           | `primetrade`                |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret (min 32 chars)  | `your_secret_key`           |
| `ACCESS_TOKEN_EXPIRY`  | Access token expiration                 | `15m`                       |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret (min 32 chars) | `your_secret_key`           |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration                | `7d`                        |
| `CORS_ORIGIN`          | Allowed origins (comma-separated)       | `http://localhost:5173`     |
| `LOG_LEVEL`            | Winston log level                       | `info`                      |

### Frontend (`frontend/.env`)

| Variable       | Description     | Example                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint              | Description          | Auth |
| ------ | --------------------- | -------------------- | ---- |
| `POST` | `/api/users/register` | Register new user    | ❌   |
| `POST` | `/api/users/login`    | Login user           | ❌   |
| `POST` | `/api/users/logout`   | Logout user          | ✅   |
| `POST` | `/api/users/refresh`  | Refresh access token | ❌   |

### User Profile

| Method | Endpoint        | Description                 | Auth |
| ------ | --------------- | --------------------------- | ---- |
| `GET`  | `/api/users/me` | Get current user profile    | ✅   |
| `PUT`  | `/api/users/me` | Update current user profile | ✅   |

### Admin (Admin Only)

| Method | Endpoint         | Description       | Auth     |
| ------ | ---------------- | ----------------- | -------- |
| `GET`  | `/api/users`     | Get all users     | ✅ Admin |
| `PUT`  | `/api/users/:id` | Update user by ID | ✅ Admin |

### Tasks

| Method   | Endpoint         | Description                  | Auth |
| -------- | ---------------- | ---------------------------- | ---- |
| `GET`    | `/api/tasks`     | Get all tasks (with filters) | ✅   |
| `POST`   | `/api/tasks`     | Create new task              | ✅   |
| `GET`    | `/api/tasks/:id` | Get task by ID               | ✅   |
| `PUT`    | `/api/tasks/:id` | Update task                  | ✅   |
| `DELETE` | `/api/tasks/:id` | Delete task (soft delete)    | ✅   |

#### Task Query Parameters

-   `status` - Filter by status (`open`, `in-progress`, `done`)
-   `search` - Search in title and description
-   `page` - Page number (default: 1)
-   `limit` - Items per page (default: 10)
-   `sortBy` - Sort field (default: `createdAt`)
-   `sortOrder` - Sort direction (`asc` or `desc`)

---

## 👤 User Features

### 🔐 Authentication

#### Register

-   Create a new account with name, email, and password
-   Automatic login after successful registration
-   Password validation (minimum 6 characters)

#### Login

-   Secure login with email and password
-   Automatic token management
-   "Remember me" via refresh tokens

#### Logout

-   Secure logout with token invalidation
-   Clears all stored credentials

### 📋 Dashboard (Task Management)

#### View Tasks

-   See all your tasks in a clean, organized list
-   Visual status indicators (Open, In Progress, Done)
-   Display due dates and tags

#### Create Task

-   Add new tasks with title and description
-   Set initial status
-   Add due date (optional)
-   Add tags (optional)

#### Edit Task

-   Update task details inline
-   Change status with a single click
-   Modify due dates and tags

#### Delete Task

-   Remove tasks (soft delete)
-   Confirmation before deletion

#### Search & Filter

-   Search tasks by title or description
-   Filter by status
-   Pagination for large task lists

### 👤 Profile Management

#### View Profile

-   See your account information
-   View role and account status

#### Update Profile

-   Change your name
-   Update email address
-   Change password (requires current password)

### 👑 Admin Panel (Admin Users Only)

#### User Management

-   View all registered users
-   Search users by name or email
-   Filter users by role (User/Admin)
-   Filter users by status (Active/Inactive)

#### User Actions

-   Toggle user active status
-   View user statistics (total, active, inactive, admins)
-   Pagination for user list

---

## 🧪 Testing

Run backend tests:

```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

---

## 📝 Scripts

### Backend

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm start`             | Start production server               |
| `npm run dev`           | Start development server with nodemon |
| `npm test`              | Run Jest tests                        |
| `npm run test:coverage` | Run tests with coverage               |

### Frontend

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

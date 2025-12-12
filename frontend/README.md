# Primetrade.AI Frontend

A responsive, black & white themed single-page application built with React, Vite, and Tailwind CSS that integrates with the Primetrade.AI backend REST API.

## Features

-   ✅ JWT-based authentication with automatic token refresh
-   ✅ Role-based access control (User & Admin roles)
-   ✅ Responsive black & white design
-   ✅ Task management (CRUD operations)
-   ✅ Search, filter, and pagination
-   ✅ Admin panel for user management
-   ✅ Protected routes
-   ✅ Client-side form validation with Zod
-   ✅ Keyboard accessible
-   ✅ Real-time toast notifications

## Tech Stack

-   **React 19** - UI library
-   **Vite** - Build tool
-   **Tailwind CSS v4** - Styling
-   **React Router** - Routing
-   **Axios** - HTTP client with interceptors
-   **React Query (TanStack Query)** - Data fetching & caching
-   **React Hook Form** - Form management
-   **Zod** - Schema validation
-   **React Hot Toast** - Notifications

## Prerequisites

-   Node.js >= 18
-   Backend API running on `http://localhost:5000`

## Installation

1. **Navigate to frontend directory**

    ```bash
    cd frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

4. **Update `.env` if needed**
    ```env
    VITE_API_URL=http://localhost:5000
    ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/               # API client and endpoints
│   │   ├── client.js      # Axios instance with interceptors
│   │   └── index.js       # API methods
│   ├── components/        # Reusable components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── ProtectedRoute.jsx
│   │   └── UI.jsx         # Button, Input, Modal, etc.
│   ├── context/           # React context
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TaskDetailPage.jsx
│   │   ├── AdminPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles (Tailwind)
├── .env                   # Environment variables
├── package.json
└── vite.config.js
```

## Available Routes

| Route        | Access     | Description       |
| ------------ | ---------- | ----------------- |
| `/`          | Public     | Landing page      |
| `/login`     | Public     | Login form        |
| `/register`  | Public     | Registration form |
| `/dashboard` | Protected  | Task dashboard    |
| `/tasks/:id` | Protected  | Task detail/edit  |
| `/admin`     | Admin Only | User management   |

## Key Features Explained

### Authentication

-   Access tokens stored in localStorage
-   Refresh tokens stored as httpOnly cookies
-   Automatic token refresh on 401 responses
-   Silent refresh flow prevents user disruption

### Protected Routes

```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

<ProtectedRoute requireAdmin={true}>
  <AdminPage />
</ProtectedRoute>
```

### API Client

The Axios client automatically:

-   Attaches access tokens to requests
-   Handles token refresh on 401 errors
-   Retries failed requests after refresh
-   Redirects to login on refresh failure

### Form Validation

Client-side validation using Zod schemas:

```jsx
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Min 8 characters"),
});
```

### State Management

-   React Query for server state
-   React Context for auth state
-   Local component state for UI

## Deployment

### Environment Variables for Production

```env
VITE_API_URL=https://your-api-domain.com
```

### Build & Deploy

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Hosting Options

-   **Vercel**: `vercel --prod`
-   **Netlify**: Drag & drop `dist` folder
-   **AWS S3 + CloudFront**
-   **Docker**: See Dockerfile in root

## Accessibility

-   Keyboard navigation support
-   ARIA attributes for modals and dialogs
-   Focus management
-   High contrast black & white theme
-   Semantic HTML

## Browser Support

-   Chrome/Edge (latest)
-   Firefox (latest)
-   Safari (latest)

## Troubleshooting

### CORS Issues

Ensure backend CORS settings allow your frontend origin:

```js
// Backend: app.js
cors: {
    origin: "http://localhost:5173";
}
```

### API Connection Issues

-   Verify backend is running on port 5000
-   Check `.env` file has correct `VITE_API_URL`
-   Check browser console for errors

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

MIT

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { logger } from "./utils/logger.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",")
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// Rate limiting
app.use("/api/", apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });
    next();
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Primetrade API is running",
    });
});

// API routes
import { userRouter } from "./routers/user.routes.js";
import { taskRouter } from "./routers/task.routes.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export { app };

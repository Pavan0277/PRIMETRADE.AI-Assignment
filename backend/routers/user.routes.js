import { Router } from "express";
import { verifyJWT, requireRole } from "../middlewares/auth.middlewares.js";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
} from "../controller/auth.controller.js";
import {
    getMe,
    updateMe,
    getAllUsers,
    updateUser,
} from "../controller/user.controller.js";
import { validate } from "../validators/validate.js";
import {
    registerSchema,
    loginSchema,
    updateUserSchema,
} from "../validators/schemas.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const userRouter = Router();

// Auth routes
userRouter
    .route("/register")
    .post(authLimiter, validate(registerSchema), registerUser);
userRouter.route("/login").post(authLimiter, validate(loginSchema), loginUser);
userRouter.route("/refresh").post(refreshAccessToken);
userRouter.route("/logout").post(verifyJWT, logoutUser);

// User profile routes
userRouter.route("/me").get(verifyJWT, getMe);
userRouter.route("/me").put(verifyJWT, validate(updateUserSchema), updateMe);

// Admin routes
userRouter.route("/").get(verifyJWT, requireRole("admin"), getAllUsers);
userRouter
    .route("/:id")
    .put(
        verifyJWT,
        requireRole("admin"),
        validate(updateUserSchema),
        updateUser
    );

export { userRouter };

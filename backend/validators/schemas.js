import { z } from "zod";

// Auth validations
export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email format").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format").toLowerCase(),
    password: z.string().min(1, "Password is required"),
});

// User validations
export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").trim().optional(),
    email: z.string().email("Invalid email format").toLowerCase().optional(),
    role: z.enum(["user", "admin"]).optional(),
    isActive: z.boolean().optional(),
});

// Task validations
export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().trim().optional(),
    status: z.enum(["open", "in-progress", "done"]).optional(),
    tags: z.array(z.string()).optional(),
    dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    description: z.string().trim().optional(),
    status: z.enum(["open", "in-progress", "done"]).optional(),
    tags: z.array(z.string()).optional(),
    dueDate: z.string().optional(),
});

// Helper to convert empty strings to undefined
const emptyStringToUndefined = z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional()
);

export const taskQuerySchema = z.object({
    q: emptyStringToUndefined,
    status: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.enum(["open", "in-progress", "done"]).optional()
    ),
    page: z.preprocess(
        (val) => (val === "" ? undefined : val ? Number(val) : undefined),
        z.number().positive().optional()
    ),
    limit: z.preprocess(
        (val) => (val === "" ? undefined : val ? Number(val) : undefined),
        z.number().positive().optional()
    ),
    sort: emptyStringToUndefined,
});

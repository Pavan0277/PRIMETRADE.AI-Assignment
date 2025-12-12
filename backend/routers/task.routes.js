import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controller/task.controller.js";
import { validate, validateQuery } from "../validators/validate.js";
import {
    createTaskSchema,
    updateTaskSchema,
    taskQuerySchema,
} from "../validators/schemas.js";

const taskRouter = Router();

// All task routes require authentication
taskRouter.use(verifyJWT);

taskRouter
    .route("/")
    .get(validateQuery(taskQuerySchema), getAllTasks)
    .post(validate(createTaskSchema), createTask);

taskRouter
    .route("/:id")
    .get(getTaskById)
    .put(validate(updateTaskSchema), updateTask)
    .delete(deleteTask);

export { taskRouter };

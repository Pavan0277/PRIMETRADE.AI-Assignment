import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new task
export const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, tags, dueDate } = req.body;

    const task = await Task.create({
        title,
        description,
        status: status || "open",
        owner: req.user._id,
        tags: tags || [],
        dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        task,
    });
});

// Get all tasks with filtering, search, and pagination
export const getAllTasks = asyncHandler(async (req, res) => {
    const { q, status, page = 1, limit = 20, sort = "-createdAt" } = req.validatedQuery || req.query;

    const query = { isDeleted: false };

    // Only show user's tasks unless admin
    if (req.user.role !== "admin") {
        query.owner = req.user._id;
    }

    // Status filter
    if (status) {
        query.status = status;
    }

    // Text search
    if (q) {
        query.$text = { $search: q };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Parse sort parameter
    const sortObj = {};
    if (sort.startsWith("-")) {
        sortObj[sort.substring(1)] = -1;
    } else {
        sortObj[sort] = 1;
    }

    const [tasks, total] = await Promise.all([
        Task.find(query)
            .populate("owner", "name email")
            .limit(limitNum)
            .skip(skip)
            .sort(sortObj),
        Task.countDocuments(query),
    ]);

    return res.status(200).json({
        success: true,
        items: tasks,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
        },
    });
});

// Get a single task by ID
export const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findOne({
        _id: id,
        isDeleted: false,
    }).populate("owner", "name email");

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    // Check if user has access to this task
    if (
        req.user.role !== "admin" &&
        task.owner._id.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }

    return res.status(200).json({
        success: true,
        task,
    });
});

// Update a task
export const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, status, tags, dueDate } = req.body;

    const task = await Task.findOne({
        _id: id,
        isDeleted: false,
    });

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    // Check if user has permission to update
    if (
        req.user.role !== "admin" &&
        task.owner.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (tags !== undefined) task.tags = tags;
    if (dueDate !== undefined)
        task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    const updatedTask = await Task.findById(id).populate("owner", "name email");

    return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
    });
});

// Delete a task (soft delete for users, hard delete for admin)
export const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findOne({
        _id: id,
        isDeleted: false,
    });

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    // Check if user has permission to delete
    if (
        req.user.role !== "admin" &&
        task.owner.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }

    if (req.user.role === "admin" && req.query.hard === "true") {
        // Hard delete for admin
        await Task.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Task permanently deleted",
        });
    } else {
        // Soft delete
        task.isDeleted = true;
        await task.save();
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    }
});

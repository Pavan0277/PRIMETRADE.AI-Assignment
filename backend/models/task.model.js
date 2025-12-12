import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "done"],
            default: "open",
            index: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        dueDate: {
            type: Date,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search functionality
taskSchema.index({ title: "text", description: "text" });

// Index for filtering by owner and status
taskSchema.index({ owner: 1, status: 1, isDeleted: 1 });

export const Task = mongoose.model("Task", taskSchema);

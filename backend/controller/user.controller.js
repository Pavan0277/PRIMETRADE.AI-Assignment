import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get current user profile
export const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt,
    };

    return res.status(200).json({
        success: true,
        user,
    });
});

// Update own profile
export const updateMe = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    }).select("-passwordHash -refreshToken");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

// Get all users (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by role
    if (req.query.role) {
        query.role = req.query.role;
    }
    
    // Filter by active status
    if (req.query.isActive !== undefined) {
        query.isActive = req.query.isActive === "true";
    }
    
    // Search by name or email
    if (req.query.search) {
        query.$or = [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ];
    }

    const [users, total] = await Promise.all([
        User.find(query)
            .select("-passwordHash -refreshToken")
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 }),
        User.countDocuments(query),
    ]);

    return res.status(200).json({
        success: true,
        users: users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        })),
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    });
});

// Update user (Admin only)
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    }).select("-passwordHash -refreshToken");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        },
    });
});

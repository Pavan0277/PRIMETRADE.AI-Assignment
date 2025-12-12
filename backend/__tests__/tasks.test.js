import request from "supertest";
import { app } from "../app.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { connectDB } from "../db/index.js";
import mongoose from "mongoose";

describe("Task CRUD Tests", () => {
    let userToken;
    let userId;
    let adminToken;
    let adminId;

    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Task.deleteMany({});

        // Create regular user
        const userResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Regular User",
                email: "user@example.com",
                password: "password123",
            });

        userToken = userResponse.body.accessToken;
        userId = userResponse.body.user.id;

        // Create admin user
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            passwordHash: "password123",
            role: "admin",
        });

        const adminResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "admin@example.com",
                password: "password123",
            });

        adminToken = adminResponse.body.accessToken;
        adminId = adminUser._id;
    });

    describe("POST /api/v1/tasks", () => {
        it("should create a new task", async () => {
            const taskData = {
                title: "Test Task",
                description: "Test Description",
                status: "open",
                tags: ["test", "demo"],
            };

            const response = await request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${userToken}`)
                .send(taskData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Task created successfully");
            expect(response.body.task.title).toBe(taskData.title);
            expect(response.body.task.owner).toBe(userId);
        });

        it("should fail without authentication", async () => {
            const taskData = {
                title: "Test Task",
                description: "Test Description",
            };

            const response = await request(app)
                .post("/api/v1/tasks")
                .send(taskData)
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it("should fail with invalid data", async () => {
            const taskData = {
                description: "No title provided",
            };

            const response = await request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${userToken}`)
                .send(taskData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/tasks", () => {
        beforeEach(async () => {
            await Task.create([
                {
                    title: "Task 1",
                    description: "Description 1",
                    owner: userId,
                    status: "open",
                },
                {
                    title: "Task 2",
                    description: "Description 2",
                    owner: userId,
                    status: "in-progress",
                },
                {
                    title: "Admin Task",
                    description: "Admin's task",
                    owner: adminId,
                    status: "done",
                },
            ]);
        });

        it("should get all user tasks", async () => {
            const response = await request(app)
                .get("/api/v1/tasks")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.items).toHaveLength(2);
            expect(response.body.pagination.total).toBe(2);
        });

        it("should filter tasks by status", async () => {
            const response = await request(app)
                .get("/api/v1/tasks?status=open")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.items).toHaveLength(1);
            expect(response.body.items[0].status).toBe("open");
        });

        it("should get all tasks for admin", async () => {
            const response = await request(app)
                .get("/api/v1/tasks")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.items.length).toBeGreaterThanOrEqual(3);
        });

        it("should support pagination", async () => {
            const response = await request(app)
                .get("/api/v1/tasks?page=1&limit=1")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.items).toHaveLength(1);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.limit).toBe(1);
        });
    });

    describe("GET /api/v1/tasks/:id", () => {
        let taskId;

        beforeEach(async () => {
            const task = await Task.create({
                title: "Test Task",
                description: "Description",
                owner: userId,
            });
            taskId = task._id;
        });

        it("should get task by id", async () => {
            const response = await request(app)
                .get(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.task.title).toBe("Test Task");
        });

        it("should fail to get other user's task", async () => {
            const otherTask = await Task.create({
                title: "Other Task",
                owner: adminId,
            });

            const response = await request(app)
                .get(`/api/v1/tasks/${otherTask._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403);

            expect(response.body.success).toBe(false);
        });

        it("should fail with invalid id", async () => {
            const response = await request(app)
                .get("/api/v1/tasks/invalid_id")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe("PUT /api/v1/tasks/:id", () => {
        let taskId;

        beforeEach(async () => {
            const task = await Task.create({
                title: "Test Task",
                description: "Description",
                owner: userId,
                status: "open",
            });
            taskId = task._id;
        });

        it("should update own task", async () => {
            const updates = {
                status: "in-progress",
                description: "Updated description",
            };

            const response = await request(app)
                .put(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send(updates)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.task.status).toBe("in-progress");
            expect(response.body.task.description).toBe("Updated description");
        });

        it("should fail to update other user's task", async () => {
            const otherTask = await Task.create({
                title: "Other Task",
                owner: adminId,
            });

            const response = await request(app)
                .put(`/api/v1/tasks/${otherTask._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ status: "done" })
                .expect(403);

            expect(response.body.success).toBe(false);
        });

        it("should allow admin to update any task", async () => {
            const response = await request(app)
                .put(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ status: "done" })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.task.status).toBe("done");
        });
    });

    describe("DELETE /api/v1/tasks/:id", () => {
        let taskId;

        beforeEach(async () => {
            const task = await Task.create({
                title: "Test Task",
                owner: userId,
            });
            taskId = task._id;
        });

        it("should soft delete own task", async () => {
            const response = await request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Task deleted successfully");

            const task = await Task.findById(taskId);
            expect(task.isDeleted).toBe(true);
        });

        it("should fail to delete other user's task", async () => {
            const otherTask = await Task.create({
                title: "Other Task",
                owner: adminId,
            });

            const response = await request(app)
                .delete(`/api/v1/tasks/${otherTask._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403);

            expect(response.body.success).toBe(false);
        });

        it("should allow admin to hard delete", async () => {
            const response = await request(app)
                .delete(`/api/v1/tasks/${taskId}?hard=true`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.message).toBe("Task permanently deleted");

            const task = await Task.findById(taskId);
            expect(task).toBeNull();
        });
    });
});

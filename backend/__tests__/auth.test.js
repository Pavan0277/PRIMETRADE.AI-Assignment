import request from "supertest";
import { app } from "../app.js";
import { User } from "../models/user.model.js";
import { connectDB } from "../db/index.js";
import mongoose from "mongoose";

describe("Authentication Tests", () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe("POST /api/v1/auth/register", () => {
        it("should register a new user successfully", async () => {
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("User registered successfully");
            expect(response.body.user).toHaveProperty("id");
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.name).toBe(userData.name);
            expect(response.body.user.role).toBe("user");
            expect(response.body).toHaveProperty("accessToken");
            expect(response.headers["set-cookie"]).toBeDefined();
        });

        it("should fail with invalid email", async () => {
            const userData = {
                name: "Test User",
                email: "invalid-email",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Validation failed");
        });

        it("should fail with short password", async () => {
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "short",
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should fail when email already exists", async () => {
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            await request(app).post("/api/v1/auth/register").send(userData);

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Email already exists");
        });
    });

    describe("POST /api/v1/auth/login", () => {
        beforeEach(async () => {
            await request(app).post("/api/v1/auth/register").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });
        });

        it("should login successfully with correct credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "test@example.com",
                    password: "password123",
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("User logged in successfully");
            expect(response.body.user.email).toBe("test@example.com");
            expect(response.body).toHaveProperty("accessToken");
        });

        it("should fail with incorrect email", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "wrong@example.com",
                    password: "password123",
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Invalid credentials");
        });

        it("should fail with incorrect password", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "test@example.com",
                    password: "wrongpassword",
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Invalid credentials");
        });

        it("should fail with missing credentials", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "test@example.com",
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/users/me", () => {
        let accessToken;

        beforeEach(async () => {
            const registerResponse = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123",
                });

            accessToken = registerResponse.body.accessToken;
        });

        it("should get user profile with valid token", async () => {
            const response = await request(app)
                .get("/api/v1/users/me")
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.user.email).toBe("test@example.com");
            expect(response.body.user.name).toBe("Test User");
        });

        it("should fail without token", async () => {
            const response = await request(app)
                .get("/api/v1/users/me")
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it("should fail with invalid token", async () => {
            const response = await request(app)
                .get("/api/v1/users/me")
                .set("Authorization", "Bearer invalid_token")
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/auth/logout", () => {
        let accessToken;

        beforeEach(async () => {
            const registerResponse = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123",
                });

            accessToken = registerResponse.body.accessToken;
        });

        it("should logout successfully", async () => {
            const response = await request(app)
                .post("/api/v1/auth/logout")
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("User logged out successfully");
        });

        it("should fail without token", async () => {
            const response = await request(app)
                .post("/api/v1/auth/logout")
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });
});

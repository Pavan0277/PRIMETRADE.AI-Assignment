import apiClient from "./client";

export const authAPI = {
    register: async (data) => {
        const response = await apiClient.post("/api/v1/auth/register", data);
        return response.data;
    },

    login: async (data) => {
        const response = await apiClient.post("/api/v1/auth/login", data);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post("/api/v1/auth/logout");
        return response.data;
    },

    refresh: async () => {
        const response = await apiClient.post("/api/v1/auth/refresh");
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get("/api/v1/users/me");
        return response.data;
    },
};

export const userAPI = {
    getProfile: async () => {
        const response = await apiClient.get("/api/v1/users/me");
        return response.data;
    },

    updateProfile: async (id, data) => {
        const response = await apiClient.put(`/api/v1/users/${id}`, data);
        return response.data;
    },

    updateUser: async (id, data) => {
        const response = await apiClient.put(`/api/v1/users/${id}`, data);
        return response.data;
    },

    getAllUsers: async (params) => {
        const response = await apiClient.get("/api/v1/users", { params });
        return response.data;
    },
};

export const taskAPI = {
    getTasks: async (params) => {
        const response = await apiClient.get("/api/v1/tasks", { params });
        return response.data;
    },

    getTask: async (id) => {
        const response = await apiClient.get(`/api/v1/tasks/${id}`);
        return response.data;
    },

    createTask: async (data) => {
        const response = await apiClient.post("/api/v1/tasks", data);
        return response.data;
    },

    updateTask: async (id, data) => {
        const response = await apiClient.put(`/api/v1/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id) => {
        const response = await apiClient.delete(`/api/v1/tasks/${id}`);
        return response.data;
    },
};

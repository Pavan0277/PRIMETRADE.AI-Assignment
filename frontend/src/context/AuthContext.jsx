import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const data = await authAPI.getProfile();
                setUser(data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const data = await authAPI.login(credentials);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success("Logged in successfully");
            return data;
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authAPI.register(userData);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success("Registration successful");
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message || "Registration failed";
            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            toast.success("Logged out successfully");
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

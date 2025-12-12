import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/register"
                                    element={<RegisterPage />}
                                />

                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <DashboardPage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <ProfilePage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/tasks/:id"
                                    element={
                                        <ProtectedRoute>
                                            <TaskDetailPage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <AdminPage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>

                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 4000,
                                    style: {
                                        background: "#fff",
                                        color: "#000",
                                        border: "2px solid #000",
                                    },
                                }}
                            />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;

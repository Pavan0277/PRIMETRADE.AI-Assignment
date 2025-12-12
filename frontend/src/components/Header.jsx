import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white border-b-4 border-black shadow-lg relative z-50">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl md:text-3xl font-black tracking-tighter hover:scale-105 transition-transform"
                    >
                        PRIMETRADE
                        <span className="text-3xl md:text-4xl">.</span>AI
                    </Link>

                    {isAuthenticated && user && (
                        <div className="flex flex-wrap items-center gap-2 md:gap-4">
                            {/* User Info Badge */}
                            <div className="px-3 py-1 bg-gray-100 border-2 border-black text-sm font-bold">
                                {user.name}
                                <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs uppercase">
                                    {user.role}
                                </span>
                            </div>

                            {/* Navigation Links */}
                            <Link
                                to="/dashboard"
                                className={`px-4 py-2 border-2 border-black font-bold transition-all hover:scale-105 ${
                                    isActive("/dashboard")
                                        ? "bg-black text-white"
                                        : "bg-white hover:bg-gray-100"
                                }`}
                            >
                                DASHBOARD
                            </Link>

                            <Link
                                to="/profile"
                                className={`px-4 py-2 border-2 border-black font-bold transition-all hover:scale-105 ${
                                    isActive("/profile")
                                        ? "bg-black text-white"
                                        : "bg-white hover:bg-gray-100"
                                }`}
                            >
                                PROFILE
                            </Link>

                            {user.role === "admin" && (
                                <Link
                                    to="/admin"
                                    className={`px-4 py-2 border-2 border-black font-bold transition-all hover:scale-105 ${
                                        isActive("/admin")
                                            ? "bg-black text-white"
                                            : "bg-white hover:bg-gray-100"
                                    }`}
                                >
                                    ADMIN
                                </Link>
                            )}

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border-2 border-red-600 bg-red-500 text-white font-bold hover:bg-red-600 transition-all hover:scale-105"
                            >
                                LOGOUT
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

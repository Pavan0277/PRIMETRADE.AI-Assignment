import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="bg-white border-b-4 border-black shadow-lg relative z-50">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl md:text-3xl font-black tracking-tighter hover:scale-105 transition-transform"
                    >
                        PRIMETRADE
                        <span className="text-3xl md:text-4xl">.</span>AI
                    </Link>

                    {/* Mobile Menu Button */}
                    {isAuthenticated && (
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 border-2 border-black hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Desktop Navigation */}
                    {isAuthenticated && user && (
                        <div className="hidden md:flex items-center gap-4">
                            {/* User Info Badge */}
                            <div className="px-3 py-1 bg-gray-100 border-2 border-black text-sm font-bold">
                                {user.name}
                                <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs uppercase">
                                    {user.role}
                                </span>
                            </div>

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

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border-2 border-red-600 bg-red-500 text-white font-bold hover:bg-red-600 transition-all hover:scale-105"
                            >
                                LOGOUT
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation Dropdown */}
                {isAuthenticated && user && isMenuOpen && (
                    <div className="md:hidden mt-4 flex flex-col gap-2 pb-2 border-t-2 border-black pt-4 animate-in slide-in-from-top-2">
                        <div className="px-3 py-2 bg-gray-100 border-2 border-black text-sm font-bold flex justify-between items-center">
                            <span>{user.name}</span>
                            <span className="px-2 py-0.5 bg-black text-white text-xs uppercase">
                                {user.role}
                            </span>
                        </div>

                        <Link
                            to="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-2 border-2 border-black font-bold transition-all ${
                                isActive("/dashboard")
                                    ? "bg-black text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            DASHBOARD
                        </Link>

                        <Link
                            to="/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-2 border-2 border-black font-bold transition-all ${
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
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 border-2 border-black font-bold transition-all ${
                                    isActive("/admin")
                                        ? "bg-black text-white"
                                        : "bg-white hover:bg-gray-100"
                                }`}
                            >
                                ADMIN
                            </Link>
                        )}

                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                handleLogout();
                            }}
                            className="px-4 py-2 border-2 border-red-600 bg-red-500 text-white font-bold hover:bg-red-600 transition-all text-left"
                        >
                            LOGOUT
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

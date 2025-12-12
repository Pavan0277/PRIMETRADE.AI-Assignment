import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { isDark, toggleTheme } = useTheme();
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
        <header className="bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white shadow-lg relative z-50 transition-colors duration-300">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl md:text-3xl font-black tracking-tighter hover:scale-105 transition-transform dark:text-white"
                    >
                        PRIMETRADE
                        <span className="text-3xl md:text-4xl">.</span>AI
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 border-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-none"
                            title={
                                isDark
                                    ? "Switch to Light Mode"
                                    : "Switch to Dark Mode"
                            }
                        >
                            {isDark ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-yellow-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
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
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        {isAuthenticated && (
                            <button
                                onClick={toggleMenu}
                                className="md:hidden p-2 border-2 border-black dark:border-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                    </div>

                    {/* Desktop Navigation */}
                    {isAuthenticated && user && (
                        <div className="hidden md:flex items-center gap-4">
                            {/* User Info Badge */}
                            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-white text-sm font-bold dark:text-white">
                                {user.name}
                                <span className="ml-2 px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-xs uppercase">
                                    {user.role}
                                </span>
                            </div>

                            <Link
                                to="/dashboard"
                                className={`px-4 py-2 border-2 border-black dark:border-white font-bold transition-all hover:scale-105 ${
                                    isActive("/dashboard")
                                        ? "bg-black dark:bg-white text-white dark:text-black"
                                        : "bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                DASHBOARD
                            </Link>

                            <Link
                                to="/profile"
                                className={`px-4 py-2 border-2 border-black dark:border-white font-bold transition-all hover:scale-105 ${
                                    isActive("/profile")
                                        ? "bg-black dark:bg-white text-white dark:text-black"
                                        : "bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                PROFILE
                            </Link>

                            {user.role === "admin" && (
                                <Link
                                    to="/admin"
                                    className={`px-4 py-2 border-2 border-black dark:border-white font-bold transition-all hover:scale-105 ${
                                        isActive("/admin")
                                            ? "bg-black dark:bg-white text-white dark:text-black"
                                            : "bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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
                    <div className="md:hidden mt-4 flex flex-col gap-2 pb-2 border-t-2 border-black dark:border-white pt-4 animate-in slide-in-from-top-2">
                        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-white text-sm font-bold flex justify-between items-center dark:text-white">
                            <span>{user.name}</span>
                            <span className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-xs uppercase">
                                {user.role}
                            </span>
                        </div>

                        <Link
                            to="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-2 border-2 border-black dark:border-white font-bold transition-all ${
                                isActive("/dashboard")
                                    ? "bg-black dark:bg-white text-white dark:text-black"
                                    : "bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            DASHBOARD
                        </Link>

                        <Link
                            to="/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-2 border-2 border-black dark:border-white font-bold transition-all ${
                                isActive("/profile")
                                    ? "bg-black dark:bg-white text-white dark:text-black"
                                    : "bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            PROFILE
                        </Link>

                        {user.role === "admin" && (
                            <Link
                                to="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 border-2 border-black dark:border-white font-bold transition-all ${
                                    isActive("/admin")
                                        ? "bg-black dark:bg-white text-white dark:text-black"
                                        : "bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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

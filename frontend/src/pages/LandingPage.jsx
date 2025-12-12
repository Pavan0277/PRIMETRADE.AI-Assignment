import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/UI";

export const LandingPage = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold">Loading...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-dots"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 border-4 border-black rotate-12 animate-float opacity-10"></div>
            <div
                className="absolute bottom-20 right-20 w-48 h-48 border-4 border-black -rotate-12 animate-float opacity-10"
                style={{ animationDelay: "1s" }}
            ></div>
            <div
                className="absolute top-1/2 right-10 w-24 h-24 border-4 border-black rotate-45 animate-float opacity-10"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="container mx-auto px-4 py-6">
                    <nav className="flex justify-between items-center">
                        <div className="text-3xl font-black tracking-tighter">
                            PRIMETRADE<span className="text-4xl">.</span>AI
                        </div>
                        <div className="flex gap-4">
                            <Link to="/login">
                                <Button variant="outline">LOGIN</Button>
                            </Link>
                            <Link to="/register">
                                <Button>GET STARTED</Button>
                            </Link>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
                    <div className="max-w-5xl w-full text-center">
                        <div className="animate-fadeInUp">
                            <div className="inline-block mb-6 px-6 py-2 border-2 border-black text-sm font-bold tracking-wider">
                                PRIMETRADE.AI
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                                TASK
                                <br />
                                MANAGEMENT
                                <br />
                                <span className="relative inline-block">
                                    SIMPLIFIED
                                    <div className="absolute -bottom-2 left-0 w-full h-4 bg-black opacity-10"></div>
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                                A modern, secure, and scalable system with
                                role-based access control and real-time task
                                management capabilities.
                            </p>
                            <div className="flex gap-6 justify-center flex-wrap mb-16">
                                <Link to="/register">
                                    <Button
                                        size="lg"
                                        className="text-lg px-10 py-4 hover-lift"
                                    >
                                        START FREE →
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="text-lg px-10 py-4 border-4"
                                    >
                                        SIGN IN
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                {
                                    title: "🔐 SECURE AUTH",
                                    desc: "JWT-based authentication with refresh tokens and role-based access control",
                                },
                                {
                                    title: "⚡ FULL CRUD",
                                    desc: "Complete task management with search, filter, and pagination support",
                                },
                                {
                                    title: "🚀 PRODUCTION READY",
                                    desc: "Rate limiting, validation, error handling, and comprehensive documentation",
                                },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="animate-fadeInUp hover-lift p-8 border-4 border-black bg-white transition-all"
                                    style={{ animationDelay: `${idx * 0.2}s` }}
                                >
                                    <h3 className="text-xl font-black mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="container mx-auto px-4 py-8 text-center border-t-2 border-black mt-12">
                    <p className="text-sm font-medium text-gray-600">
                        © 2025 Pavan Rasal · Built with precision and
                        performance in mind
                    </p>
                </footer>
            </div>
        </div>
    );
};

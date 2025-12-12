import { Link } from "react-router-dom";
import { Button } from "../components/UI";

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-dots opacity-50"></div>

            {/* Animated Decorative Elements */}
            <div className="absolute top-1/4 left-10 w-32 h-32 border-4 border-black dark:border-white rotate-12 animate-float opacity-10"></div>
            <div
                className="absolute bottom-1/4 right-10 w-48 h-48 border-4 border-black dark:border-white -rotate-12 animate-float opacity-10"
                style={{ animationDelay: "1s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-black dark:border-white rotate-45 animate-float opacity-10"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute bottom-1/3 right-1/3 w-24 h-24 border-4 border-black dark:border-white -rotate-45 animate-float opacity-10"
                style={{ animationDelay: "1.5s" }}
            ></div>

            <div className="text-center relative z-10 animate-fadeInUp">
                <div className="relative inline-block mb-8">
                    <h1 className="text-[200px] md:text-[280px] font-black leading-none mb-0 relative dark:text-white">
                        4
                        <span
                            className="inline-block animate-float"
                            style={{ animationDelay: "0.3s" }}
                        >
                            0
                        </span>
                        4
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="text-6xl animate-float"
                            style={{ animationDelay: "0.6s" }}
                        >
                            ❌
                        </div>
                    </div>
                </div>

                <div className="max-w-md mx-auto">
                    <h2 className="text-4xl font-black mb-4 tracking-tight dark:text-white">
                        OOPS! PAGE NOT FOUND
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed">
                        The page you're looking for seems to have vanished into
                        the void.
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/">
                            <Button
                                size="lg"
                                className="px-8 py-4 text-lg hover-lift"
                            >
                                ← GO HOME
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-4 text-lg border-4"
                            >
                                DASHBOARD
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-sm text-gray-400 dark:text-gray-500 font-medium">
                    <p>Error Code: 404 | Page Not Found</p>
                </div>
            </div>
        </div>
    );
};

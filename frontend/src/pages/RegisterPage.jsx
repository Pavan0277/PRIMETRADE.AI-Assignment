import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/UI";
import { useState } from "react";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const RegisterPage = () => {
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await register(data);
            navigate("/dashboard");
        } catch (error) {
            // Error is already handled in AuthContext with toast
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-gray-50 px-4 relative overflow-hidden py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-dots"></div>

            {/* Decorative Elements */}
            <div
                className="absolute top-20 left-10 w-48 h-48 border-8 border-black opacity-5 -rotate-12 animate-float"
                style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 border-8 border-black opacity-5 rotate-45"></div>

            <div className="max-w-md w-full relative z-10 animate-fadeInUp">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4">
                        <div className="text-4xl font-black tracking-tighter">
                            PRIMETRADE<span className="text-5xl">.</span>
                        </div>
                    </Link>
                    <h1 className="text-4xl font-black mb-2">GET STARTED</h1>
                    <p className="text-gray-500 font-medium">
                        Create your account in seconds
                    </p>
                </div>

                <div className="bg-white border-4 border-black p-8 shadow-2xl hover-lift">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            register={formRegister("name")}
                            error={errors.name?.message}
                            autoComplete="name"
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="your@email.com"
                            register={formRegister("email")}
                            error={errors.email?.message}
                            autoComplete="email"
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            register={formRegister("password")}
                            error={errors.password?.message}
                            autoComplete="new-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            className="text-lg py-3 font-bold"
                        >
                            {loading
                                ? "CREATING ACCOUNT..."
                                : "CREATE ACCOUNT →"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">
                                    Already have an account?
                                </span>
                            </div>
                        </div>
                        <Link
                            to="/login"
                            className="mt-4 inline-block font-bold text-black hover:underline text-lg"
                        >
                            Sign in instead →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

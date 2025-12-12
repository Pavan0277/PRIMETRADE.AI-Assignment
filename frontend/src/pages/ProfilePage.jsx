import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import { Button, Input, Card } from "../components/UI";
import { userAPI } from "../api";
import toast from "react-hot-toast";

const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
});

export const ProfilePage = () => {
    const { user, checkAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await userAPI.updateProfile(user.id, data);
            await checkAuth(); // Refresh user data
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
            console.error("Update profile error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset({
            name: user?.name || "",
            email: user?.email || "",
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-dots opacity-50"></div>

            <Header />

            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-3xl mx-auto animate-fadeInUp">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-black mb-2 dark:text-white">
                            MY PROFILE
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Manage your account information
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8 shadow-2xl mb-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-6 border-b-2 border-black dark:border-white">
                            <div>
                                <h2 className="text-2xl font-black mb-1 dark:text-white">
                                    ACCOUNT DETAILS
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    Your personal information
                                </p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 md:mt-0 px-4 py-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-bold dark:text-white"
                                >
                                    EDIT PROFILE
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            // View Mode
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-500 dark:text-gray-400 tracking-wider">
                                            FULL NAME
                                        </label>
                                        <div className="px-4 py-3 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-700 font-bold dark:text-white">
                                            {user?.name}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-500 dark:text-gray-400 tracking-wider">
                                            EMAIL ADDRESS
                                        </label>
                                        <div className="px-4 py-3 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-700 font-bold break-all dark:text-white">
                                            {user?.email}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-500 dark:text-gray-400 tracking-wider">
                                            ROLE
                                        </label>
                                        <div className="px-4 py-3 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-700">
                                            <span className="uppercase bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-sm font-bold">
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-500 dark:text-gray-400 tracking-wider">
                                            MEMBER SINCE
                                        </label>
                                        <div className="px-4 py-3 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-700 font-bold dark:text-white">
                                            {user?.createdAt
                                                ? new Date(
                                                      user.createdAt
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          month: "long",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        placeholder="John Doe"
                                        register={register("name")}
                                        error={errors.name?.message}
                                        autoComplete="name"
                                    />

                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="your@email.com"
                                        register={register("email")}
                                        error={errors.email?.message}
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        loading={loading}
                                        className="flex-1"
                                    >
                                        {loading ? "SAVING..." : "SAVE CHANGES"}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 border-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-bold disabled:opacity-50 dark:text-white"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Account Status Card */}
                    <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8 shadow-2xl">
                        <h2 className="text-2xl font-black mb-6 dark:text-white">
                            ACCOUNT STATUS
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                                            ACCOUNT STATUS
                                        </p>
                                        <p className="text-2xl font-black">
                                            {user?.isActive ? (
                                                <span className="text-green-600 dark:text-green-400">
                                                    ACTIVE
                                                </span>
                                            ) : (
                                                <span className="text-red-600 dark:text-red-400">
                                                    INACTIVE
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-700">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                                    USER ID
                                </p>
                                <p className="text-sm font-mono font-bold break-all dark:text-white">
                                    {user?.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

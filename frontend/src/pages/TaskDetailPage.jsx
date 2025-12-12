import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskAPI } from "../api";
import { Header } from "../components/Header";
import {
    Button,
    Input,
    Select,
    Textarea,
    Loader,
    Card,
} from "../components/UI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useEffect } from "react";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["open", "in-progress", "done"]),
    dueDate: z.string().optional(),
    tags: z.string().optional(),
});

export const TaskDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: task,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["task", id],
        queryFn: () => taskAPI.getTask(id),
    });

    const updateMutation = useMutation({
        mutationFn: (data) => taskAPI.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["task", id]);
            queryClient.invalidateQueries(["tasks"]);
            toast.success("Task updated successfully");
            navigate("/dashboard");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to update task"
            );
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(taskSchema),
    });

    useEffect(() => {
        if (task?.task) {
            reset({
                title: task.task.title,
                description: task.task.description,
                status: task.task.status,
                dueDate: task.task.dueDate
                    ? new Date(task.task.dueDate).toISOString().split("T")[0]
                    : "",
                tags: task.task.tags ? task.task.tags.join(", ") : "",
            });
        }
    }, [task, reset]);

    const onSubmit = async (data) => {
        const taskData = {
            ...data,
            tags: data.tags
                ? data.tags.split(",").map((tag) => tag.trim())
                : [],
        };
        updateMutation.mutate(taskData);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Header />
                <Loader />
            </div>
        );
    }

    if (error || !task?.task) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Card>
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            Error loading task:{" "}
                            {error?.message || "Task not found"}
                        </p>
                        <div className="mt-4 text-center">
                            <Button onClick={() => navigate("/dashboard")}>
                                Back to Dashboard
                            </Button>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-dots opacity-50"></div>

            <Header />

            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-2xl mx-auto animate-fadeInUp">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-black mb-2 dark:text-white">
                                EDIT TASK
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                Update task details below
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/dashboard")}
                            className="border-2"
                        >
                            ← Back
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-8 shadow-2xl hover-lift">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <Input
                                label="Title"
                                register={register("title")}
                                error={errors.title?.message}
                                placeholder="Task title"
                            />

                            <Textarea
                                label="Description"
                                register={register("description")}
                                error={errors.description?.message}
                                placeholder="Task description"
                                rows={6}
                            />

                            <Select
                                label="Status"
                                register={register("status")}
                                error={errors.status?.message}
                                options={[
                                    { value: "open", label: "Open" },
                                    {
                                        value: "in-progress",
                                        label: "In Progress",
                                    },
                                    { value: "done", label: "Done" },
                                ]}
                            />

                            <Input
                                label="Due Date (optional)"
                                type="date"
                                register={register("dueDate")}
                                error={errors.dueDate?.message}
                            />

                            <Input
                                label="Tags (comma separated)"
                                register={register("tags")}
                                error={errors.tags?.message}
                                placeholder="urgent, frontend, bug"
                            />

                            <div className="flex gap-4 pt-6 border-t-2 border-gray-200 dark:border-gray-600">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/dashboard")}
                                    className="flex-1 border-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={updateMutation.isPending}
                                    className="flex-1 text-lg py-3 font-bold"
                                >
                                    {updateMutation.isPending
                                        ? "SAVING..."
                                        : "SAVE CHANGES →"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div
                        className="mt-6 bg-white dark:bg-gray-800 border-2 border-black dark:border-white p-6 animate-fadeInUp"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 tracking-wider">
                            TASK METADATA
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                                    Created
                                </p>
                                <p className="font-bold dark:text-white">
                                    {new Date(
                                        task.task.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                                    Last Updated
                                </p>
                                <p className="font-bold dark:text-white">
                                    {new Date(
                                        task.task.updatedAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

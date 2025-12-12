import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskAPI } from "../api";
import { Header } from "../components/Header";
import {
    Button,
    Card,
    Loader,
    Modal,
    Input,
    Select,
    Textarea,
    ConfirmDialog,
} from "../components/UI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["open", "in-progress", "done"]),
    dueDate: z.string().optional(),
    tags: z.string().optional(),
});

export const DashboardPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        q: "",
        status: "",
        page: 1,
        limit: 10,
        sort: "-createdAt",
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["tasks", filters],
        queryFn: () => taskAPI.getTasks(filters),
    });

    const createMutation = useMutation({
        mutationFn: taskAPI.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]);
            setIsCreateModalOpen(false);
            toast.success("Task created successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to create task"
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: taskAPI.deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]);
            setDeleteConfirm(null);
            toast.success("Task deleted successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to delete task"
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
        defaultValues: {
            status: "open",
        },
    });

    const onSubmit = async (data) => {
        const taskData = {
            ...data,
            tags: data.tags
                ? data.tags.split(",").map((tag) => tag.trim())
                : [],
        };
        createMutation.mutate(taskData);
    };

    const handleDelete = (task) => {
        setDeleteConfirm(task);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteMutation.mutate(deleteConfirm._id);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-white to-gray-50 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-dots opacity-50"></div>

            <Header />

            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="animate-fadeInUp">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black">
                                TASKS
                            </h1>
                            <p className="text-gray-600 font-medium mt-1">
                                Manage your tasks efficiently
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-lg py-3 px-6 font-bold whitespace-nowrap"
                        >
                            + CREATE TASK
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white border-4 border-black p-6 mb-6 shadow-xl">
                        <form
                            onSubmit={handleSearch}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={filters.q}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        q: e.target.value,
                                    })
                                }
                                className="px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-medium"
                            />
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        status: e.target.value,
                                        page: 1,
                                    })
                                }
                                className="px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-medium bg-white"
                            >
                                <option value="">All Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <select
                                value={filters.sort}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        sort: e.target.value,
                                        page: 1,
                                    })
                                }
                                className="px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-medium bg-white"
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="createdAt">Oldest First</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="-title">Title (Z-A)</option>
                            </select>
                        </form>
                    </div>
                </div>

                {/* Task List */}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Card>
                        <p className="text-center text-gray-600">
                            Error loading tasks: {error.message}
                        </p>
                    </Card>
                ) : !data?.items || data.items.length === 0 ? (
                    <div className="bg-white border-4 border-black p-12 shadow-xl text-center">
                        <p className="text-xl text-gray-600 font-bold">
                            No tasks found. Create your first task!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 animate-fadeInUp">
                            {data.items.map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-white border-4 border-black p-6 shadow-xl hover-lift transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black mb-2">
                                                {task.title}
                                            </h3>
                                            <p className="text-gray-600 mb-3 font-medium">
                                                {task.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <span
                                                    className={`px-3 py-1 text-sm font-bold border-2 border-black ${
                                                        task.status === "done"
                                                            ? "bg-black text-white"
                                                            : task.status ===
                                                              "in-progress"
                                                            ? "bg-gray-800 text-white"
                                                            : "bg-white text-black"
                                                    }`}
                                                >
                                                    {task.status
                                                        .toUpperCase()
                                                        .replace("-", " ")}
                                                </span>
                                                {task.tags &&
                                                    task.tags.map(
                                                        (tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-1 text-xs border-2 border-black font-bold"
                                                            >
                                                                {tag}
                                                            </span>
                                                        )
                                                    )}
                                                {task.dueDate && (
                                                    <span className="text-sm text-gray-600 font-medium">
                                                        Due:{" "}
                                                        {new Date(
                                                            task.dueDate
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/tasks/${task._id}`
                                                    )
                                                }
                                                className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold"
                                                aria-label="Edit task"
                                            >
                                                EDIT
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(task)
                                                }
                                                className="px-4 py-2 border-2 border-red-600 bg-red-500 text-white hover:bg-red-600 transition-all font-bold"
                                                aria-label="Delete task"
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {data.pagination && data.pagination.pages > 1 && (
                            <div className="mt-8 flex justify-center gap-2 bg-white border-4 border-black p-6 shadow-xl">
                                <button
                                    disabled={filters.page === 1}
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            page: filters.page - 1,
                                        })
                                    }
                                    className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ⟨ PREVIOUS
                                </button>
                                <span className="px-4 py-2 border-2 border-black font-bold bg-black text-white">
                                    PAGE {filters.page} OF{" "}
                                    {data.pagination.pages}
                                </span>
                                <button
                                    disabled={
                                        filters.page >= data.pagination.pages
                                    }
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            page: filters.page + 1,
                                        })
                                    }
                                    className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    NEXT ⟩
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Create Task Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    reset();
                }}
                title="CREATE NEW TASK"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        rows={4}
                    />

                    <Select
                        label="Status"
                        register={register("status")}
                        error={errors.status?.message}
                        options={[
                            { value: "open", label: "Open" },
                            { value: "in-progress", label: "In Progress" },
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

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={createMutation.isPending}
                        >
                            Create Task
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

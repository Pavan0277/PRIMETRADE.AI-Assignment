import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../api";
import { Header } from "../components/Header";
import { Card, Loader } from "../components/UI";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const AdminPage = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const queryClient = useQueryClient();

    // Debounce search input to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page when search changes
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["users", page, limit, roleFilter, statusFilter, debouncedSearch],
        queryFn: () =>
            userAPI.getAllUsers({
                page,
                limit,
                ...(roleFilter && { role: roleFilter }),
                ...(statusFilter && { isActive: statusFilter }),
                ...(debouncedSearch && { search: debouncedSearch }),
            }),
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ userId, updates }) =>
            userAPI.updateUser(userId, updates),
        onSuccess: () => {
            toast.success("User updated successfully!");
            queryClient.invalidateQueries(["users"]);
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to update user"
            );
        },
    });

    const handleStatusToggle = (userId, currentStatus) => {
        updateUserMutation.mutate({
            userId,
            updates: { isActive: !currentStatus },
        });
    };

    const handleRoleChange = (userId, newRole) => {
        updateUserMutation.mutate({
            userId,
            updates: { role: newRole },
        });
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setDebouncedSearch("");
        setRoleFilter("");
        setStatusFilter("");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-white to-gray-50 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-grid opacity-50"></div>

            <Header />

            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="animate-fadeInUp">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black">
                                ADMIN PANEL
                            </h1>
                            <p className="text-gray-600 font-medium mt-1">
                                User Management Dashboard
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-black text-white border-4 border-black font-bold">
                                {data?.pagination?.total || 0} USERS
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white border-4 border-black p-6 mb-6 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-bold mb-2 tracking-wider">
                                    SEARCH
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                    />
                                    {searchQuery !== debouncedSearch && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Role Filter */}
                            <div>
                                <label className="block text-sm font-bold mb-2 tracking-wider">
                                    FILTER BY ROLE
                                </label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-medium bg-white"
                                >
                                    <option value="">All Roles</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-bold mb-2 tracking-wider">
                                    FILTER BY STATUS
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-medium bg-white"
                                >
                                    <option value="">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery || roleFilter || statusFilter) && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-4 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
                            >
                                CLEAR FILTERS
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Card>
                        <p className="text-center text-gray-600">
                            Error loading users: {error.message}
                        </p>
                    </Card>
                ) : !data?.users || data.users.length === 0 ? (
                    <Card>
                        <p className="text-center text-gray-600 py-8">
                            {searchQuery || roleFilter || statusFilter
                                ? "No users match your filters."
                                : "No users found."}
                        </p>
                    </Card>
                ) : (
                    <>
                        <div className="overflow-x-auto animate-fadeInUp hover-lift bg-white border-4 border-black shadow-xl">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-black text-white">
                                        <th className="px-4 py-4 text-left font-black tracking-wider">
                                            NAME
                                        </th>
                                        <th className="px-4 py-4 text-left font-black tracking-wider">
                                            EMAIL
                                        </th>
                                        <th className="px-4 py-4 text-left font-black tracking-wider">
                                            ROLE
                                        </th>
                                        <th className="px-4 py-4 text-left font-black tracking-wider">
                                            STATUS (CLICK TO CHANGE)
                                        </th>
                                        <th className="px-4 py-4 text-left font-black tracking-wider">
                                            JOINED
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.users.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className={`border-t-2 border-black transition-colors hover:bg-gray-100 ${
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <td className="px-4 py-4 font-bold">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-4 font-medium text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            user.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="uppercase bg-black text-white px-3 py-1 text-sm font-bold border-2 border-black cursor-pointer hover:bg-gray-800"
                                                    disabled={
                                                        updateUserMutation.isPending
                                                    }
                                                >
                                                    <option value="user">
                                                        USER
                                                    </option>
                                                    <option value="admin">
                                                        ADMIN
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleStatusToggle(
                                                            user.id,
                                                            user.isActive
                                                        )
                                                    }
                                                    disabled={
                                                        updateUserMutation.isPending
                                                    }
                                                    className={`group relative px-4 py-2 text-sm font-bold border-2 transition-all cursor-pointer ${
                                                        user.isActive
                                                            ? "bg-green-500 text-white border-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                                                            : "bg-red-500 text-white border-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg"
                                                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                                                    title={`Click to ${user.isActive ? 'deactivate' : 'activate'} user`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {user.isActive ? (
                                                            <>
                                                                <span>ACTIVE</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>INACTIVE</span>
                                                            </>
                                                        )}
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 font-medium text-gray-600">
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Pagination */}
                        {data?.pagination && data.pagination.pages > 1 && (
                            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-4 border-black p-6 shadow-xl">
                                <div className="text-sm font-bold text-gray-600">
                                    Showing {(page - 1) * limit + 1} to{" "}
                                    {Math.min(
                                        page * limit,
                                        data.pagination.total
                                    )}{" "}
                                    of {data.pagination.total} users
                                </div>

                                <div className="flex gap-2 items-center flex-wrap justify-center">
                                    <button
                                        className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                                        disabled={page === 1}
                                        onClick={() => setPage(1)}
                                    >
                                        ⟨⟨ FIRST
                                    </button>
                                    <button
                                        className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        ⟨ PREV
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex gap-1">
                                        {[...Array(data.pagination.pages)].map(
                                            (_, idx) => {
                                                const pageNum = idx + 1;
                                                // Show first page, last page, current page, and pages around current
                                                if (
                                                    pageNum === 1 ||
                                                    pageNum ===
                                                        data.pagination.pages ||
                                                    (pageNum >= page - 1 &&
                                                        pageNum <= page + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            className={`px-4 py-2 border-2 border-black font-bold transition-colors ${
                                                                page === pageNum
                                                                    ? "bg-black text-white"
                                                                    : "hover:bg-gray-100"
                                                            }`}
                                                            onClick={() =>
                                                                setPage(pageNum)
                                                            }
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                } else if (
                                                    pageNum === page - 2 ||
                                                    pageNum === page + 2
                                                ) {
                                                    return (
                                                        <span
                                                            key={pageNum}
                                                            className="px-2 font-bold"
                                                        >
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            }
                                        )}
                                    </div>

                                    <button
                                        className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                                        disabled={page >= data.pagination.pages}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        NEXT ⟩
                                    </button>
                                    <button
                                        className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                                        disabled={page >= data.pagination.pages}
                                        onClick={() =>
                                            setPage(data.pagination.pages)
                                        }
                                    >
                                        LAST ⟩⟩
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Statistics */}
                        <div
                            className="mt-8 animate-fadeInUp"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
                                📊 STATISTICS
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-linear-to-br from-blue-500 to-blue-600 border-4 border-black p-6 hover-lift transition-all text-white shadow-xl">
                                    <p className="text-xs font-black text-blue-100 mb-2 tracking-widest">
                                        TOTAL USERS
                                    </p>
                                    <p className="text-5xl font-black mb-2">
                                        {data?.pagination?.total || 0}
                                    </p>
                                    <div className="w-full h-1 bg-white mt-3 opacity-50"></div>
                                </div>
                                <div className="bg-linear-to-br from-green-500 to-green-600 border-4 border-black p-6 hover-lift transition-all text-white shadow-xl">
                                    <p className="text-xs font-black text-green-100 mb-2 tracking-widest">
                                        ACTIVE USERS
                                    </p>
                                    <p className="text-5xl font-black mb-2">
                                        {data?.users?.filter((u) => u.isActive)
                                            .length || 0}
                                    </p>
                                    <div className="w-full h-1 bg-white mt-3 opacity-50"></div>
                                </div>
                                <div className="bg-linear-to-br from-purple-500 to-purple-600 border-4 border-black p-6 hover-lift transition-all text-white shadow-xl">
                                    <p className="text-xs font-black text-purple-100 mb-2 tracking-widest">
                                        ADMINISTRATORS
                                    </p>
                                    <p className="text-5xl font-black mb-2">
                                        {data?.users?.filter(
                                            (u) => u.role === "admin"
                                        ).length || 0}
                                    </p>
                                    <div className="w-full h-1 bg-white mt-3 opacity-50"></div>
                                </div>
                                <div className="bg-linear-to-br from-red-500 to-red-600 border-4 border-black p-6 hover-lift transition-all text-white shadow-xl">
                                    <p className="text-xs font-black text-red-100 mb-2 tracking-widest">
                                        INACTIVE USERS
                                    </p>
                                    <p className="text-5xl font-black mb-2">
                                        {data?.users?.filter((u) => !u.isActive)
                                            .length || 0}
                                    </p>
                                    <div className="w-full h-1 bg-white mt-3 opacity-50"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
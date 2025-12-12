export const Button = ({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    type = "button",
    onClick,
    ...props
}) => {
    const baseStyles =
        "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 focus:ring-black",
        secondary:
            "bg-white text-black border-2 border-black hover:bg-gray-100 focus:ring-black",
        outline:
            "bg-transparent text-black border border-black hover:bg-black hover:text-white focus:ring-black",
        danger: "bg-black text-white hover:bg-gray-800 border-2 border-gray-800 focus:ring-gray-800",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center">
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
};

export const Input = ({ label, error, type = "text", register, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-black mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`w-full px-4 py-2 border-2 ${
                    error ? "border-black bg-gray-100" : "border-gray-300"
                } focus:border-black focus:outline-none transition-colors`}
                {...register}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-black">{error}</p>}
        </div>
    );
};

export const Select = ({ label, error, options, register, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-black mb-1">
                    {label}
                </label>
            )}
            <select
                className={`w-full px-4 py-2 border-2 ${
                    error ? "border-black bg-gray-100" : "border-gray-300"
                } focus:border-black focus:outline-none transition-colors bg-white`}
                {...register}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-black">{error}</p>}
        </div>
    );
};

export const Textarea = ({ label, error, register, rows = 4, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-black mb-1">
                    {label}
                </label>
            )}
            <textarea
                rows={rows}
                className={`w-full px-4 py-2 border-2 ${
                    error ? "border-black bg-gray-100" : "border-gray-300"
                } focus:border-black focus:outline-none transition-colors resize-none`}
                {...register}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-black">{error}</p>}
        </div>
    );
};

export const Card = ({ children, className = "" }) => {
    return (
        <div className={`bg-white border-2 border-black p-6 ${className}`}>
            {children}
        </div>
    );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white border-4 border-black p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="modal-title" className="text-2xl font-bold">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-gray-600 text-2xl leading-none"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const Loader = ({ size = "md" }) => {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className="flex justify-center items-center p-8">
            <svg
                className={`animate-spin ${sizes[size]}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
};

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="mb-6 text-gray-700">{message}</p>
            <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={onClose}>
                    {cancelText}
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
};

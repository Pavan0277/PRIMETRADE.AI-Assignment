export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated;
            next();
        } catch (error) {
            if (error.errors && Array.isArray(error.errors)) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            }
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error.message || "Invalid input",
            });
        }
    };
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.query);
            req.validatedQuery = validated;
            next();
        } catch (error) {
            if (error.errors && Array.isArray(error.errors)) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                return res.status(400).json({
                    success: false,
                    message: "Query validation failed",
                    errors,
                });
            }
            return res.status(400).json({
                success: false,
                message: "Query validation failed",
                error: error.message || "Invalid query parameters",
            });
        }
    };
};

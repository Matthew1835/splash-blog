const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err.code === "P2002") {
        const field = err.meta?.target?.[0] || "field";
        return res.status(409).json({ error: `That ${field} is already taken.` });
    }

    if (err.code === "P2025") {
        return res.status(404).json({ error: "Not found" });
    }

    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Something went wrong" });
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, asyncHandler };
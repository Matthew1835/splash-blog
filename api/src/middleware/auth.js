import passport from "passport";

// sets req.user
const requireAuth = passport.authenticate("jwt", { session: false }); 

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};

// for guests
const optionalAuth = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) return next(err);
        if (user) req.user = user;
        next();
    })(req, res, next);
}

export { requireAuth, requireAdmin, optionalAuth };
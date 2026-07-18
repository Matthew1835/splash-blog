import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";

import configurePassport from "./config/passport.js";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

configurePassport(passport);

const app = express();

app.use(
    cors({
        origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean),
    })
);
app.use(express.json());
app.use(passport.initialize());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler);

export default app;
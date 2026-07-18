import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { register, login, me } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", requireAuth, asyncHandler(me));

export default authRouter;
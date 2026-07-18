import { Router } from "express";
import { updateComment, deleteComment } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const commentRouter = Router();

commentRouter.put("/:id", requireAuth, asyncHandler(updateComment));
commentRouter.delete("/:id", requireAuth, asyncHandler(deleteComment));

export default commentRouter;
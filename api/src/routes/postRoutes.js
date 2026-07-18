import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/auth.js";
import { getAllPosts, getPostById, createPost, updatePost, togglePublish, deletePost } from "../controllers/postController.js";
import { getCommentsForPost, createComment } from "../controllers/commentController.js";

const postRouter = Router();

postRouter.get("/", optionalAuth, asyncHandler(getAllPosts));
postRouter.get("/:id", optionalAuth, asyncHandler(getPostById));
postRouter.post("/", requireAuth, requireAdmin, asyncHandler(createPost));
postRouter.put("/:id", requireAuth, requireAdmin, asyncHandler(updatePost));
postRouter.patch("/:id/publish", requireAuth, requireAdmin, asyncHandler(togglePublish));
postRouter.delete("/:id", requireAuth, requireAdmin, asyncHandler(deletePost));

postRouter.get("/:postId/comments", asyncHandler(getCommentsForPost));
postRouter.post("/:postId/comments", requireAuth, asyncHandler(createComment));

export default postRouter;
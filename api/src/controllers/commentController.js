import prisma from "../lib/prisma.js";

const userSelect = { select: { id: true, username: true } };

// GET /api/posts/:postId/comments
const getCommentsForPost = async (req, res) => {
    const postId = Number(req.params.postId);

    const comments = await prisma.comments.findMany({
        where: { postId },
        orderBy: { createdAt: "asc" },
        include: { user: userSelect },
    });

    res.json(comments);
};

// POST /api/posts/:postId/comments (logged-in users only)
const createComment = async (req, res) => {
    const postId = Number(req.params.postId);
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const post = await prisma.post.findUnique({ where: { postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = await prisma.post.create({
        data: { content, postId, userId: req.user.id },
        include: { user: userSelect },
    });

    res.status(201).json(comment);
};

// PUT /api/comments/:id (comment owner or ADMIN)
const updateComment = async (req, res) => {
    const id = Number(req.params.id);
    const { content } = req.body;

    // if (!content) return res.status(400).json({ error: "Content is required" });

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Comment not found" });

    const isOwner = existing.userId === req.user.id;
    if (!isOwner && req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Not allowed to edit this comment" });
    }

    const comment = await prisma.comment.update({
        where: { id },
        data: { content },
        include: { user: userSelect },
    });

    res.json(comment);
};

// DELETE /api/comments/:id (comment owner or ADMIN)
const deleteComment = async (req, res) => {
    const id = Number(req.params.id);

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Comment not found" });

    const isOwner = existing.userId === req.user.id;
    if (!isOwner && req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Not allowed to delete this comment" });
    }

    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
};

export { getCommentsForPost, createComment, updateComment, deleteComment };
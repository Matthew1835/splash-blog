import prisma from "../lib/prisma.js";

const authorSelect = { select: { id: true, username: true } };

// GET /api/posts (?search=<title text>)
const getAllPosts = async (req, res) => {
    const { search } = req.query;
    const isAdmin = req.user?.role === "ADMIN";

    const where = {
        ...(isAdmin ? {} : { published: true }),
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
    };

    const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            author: authorSelect,
            _count: { select: { comments: true } },
        },
    });

    res.json(posts);
};

// GET /api/posts/:id
const getPostById = async (req, res) => {
    const id = Number(req.params.id);
    const isAdmin = req.user?.role === "ADMIN";

    const post = await prisma.post.findUnique({ 
        where: { id },
        include: { author: authorSelect },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });
    
    if (!post.published && !isAdmin) {
        return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
};

// POST /api/posts (ADMIN only)
const createPost = async (req, res) => {
    const { title, content, imageUrl } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    const post = await prisma.post.create({
        data: { title, content, imageUrl: imageUrl || null, authorId: req.user.id },
    });

    res.status(201).json(post);
}

// PUT /api/posts/:id (ADMIN only)
const updatePost = async (req, res) => {
    const id = Number(req.params.id);
    const { title, content, imageUrl } = req.body;

    const post = await prisma.post.update({
        where: { id },
        data: { title, content, imageUrl },
    });

    res.json(post);
}

// PATCH /api/posts/:id/publish (ADMIN only)
const togglePublish = async (req, res) => {
    const id = Number(req.params.id);

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Post not found" });

    const post = await prisma.post.update({
        where: { id },
        data: { published: !existing.published },
    });

    res.json(post);
}

// DELETE /api/posts/:id (ADMIN only)
const deletePost = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
};

export { getAllPosts, getPostById, createPost, updatePost, togglePublish, deletePost }
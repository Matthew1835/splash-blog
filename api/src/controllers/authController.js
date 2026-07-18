import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const signToken = (user) => {
    return jwt.sign(
        { sub: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    )
};

// POST /register
const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { username, email, password: hashed },
        select: { id: true, username: true, email: true, role: true },
    });

    const token = signToken(user);
    res.status(201).json({ user, token });
}

// POST /login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    res.json({
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token,
    });
};

const me = async (req, res) => {
    res.json({ user: req.user });
};

export { register, login, me };
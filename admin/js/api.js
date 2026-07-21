import { API_BASE } from "./config.js";
import { clearSession, getToken, getUser } from "./auth.js";

async function request(path, options = {}) {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
        clearSession();
        window.location.href = "login.html";
        return null;
    }

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : null;

    if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");

    return data;
}

const login = (email, password) => 
    request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

const getAllPosts = () => request("/posts");

const getPost = (id) => request(`/posts/${id}`);

const createPost = (data) =>
    request("/posts", {
        method: "POST",
        body: JSON.stringify(data),
    });

const updatePost = (id, data) => 
    request(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

const togglePublish = (id) => request(`/posts/${id}/publish`, { method: "PATCH" });

const deletePost = (id) => request(`/posts/${id}`, { method: "DELETE" });

const getComments = (postId) => request(`/posts/${postId}/comments`);

const deleteComment = (id) => request(`/comments/${id}`, { method: "DELETE" });

export { login, getAllPosts, getPost, createPost, updatePost, togglePublish, deletePost, getComments, deleteComment };
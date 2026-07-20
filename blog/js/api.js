import { API_BASE } from "./config.js";
import { getToken } from "./auth.js";

async function request(path, options = {}) {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : null;

    if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");

    return data;
}

const getPosts = (search) => request(`/posts${search ? `?search=${encodeURIComponent(search)}` : ""}`);

const getPost = (id) => request(`/posts/${id}`);

const getComments = (postId) => request(`/posts/${postId}/comments`);

const addComment = (postId, content) => 
    request(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });

const updateComment = (id, content) => 
    request(`/comments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
    });

const deleteComment = (id) => request(`/comments/${id}`, { method: "DELETE" });

const login = (email, password) => 
    request(`/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

const register = (username, email, password) => 
    request(`/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });

export { getPosts, getPost, getComments, addComment, updateComment, deleteComment, login, register };
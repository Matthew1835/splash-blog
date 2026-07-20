import { getPost, getComments, addComment, deleteComment } from "./api.js";
import { renderNav } from "./nav.js";
import { getUser, isLoggedIn } from "./auth.js";
import { formatDate, escapeHtml } from "./posts-render.js";

renderNav("home");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const headerEl = document.getElementById("post-header");
const imageEl = document.getElementById("post-image");
const bodyEl = document.getElementById("post-body");
const commentsListEl = document.getElementById("comments-list");
const commentsHeadingEl = document.getElementById("comments-heading");
const commentAreaEl = document.getElementById("comment-area");

const PLACEHOLDER_IMAGE = "https://placehold.co/1200x675/ddb892/7f5539?text=Splash";

async function loadPost() {
    if (!postId) {
        headerEl.innerHTML = `<div class="error-state">No post specified.</div>`;
        return;
    }

    try {
        const post = await getPost(postId);
        document.title = `${post.title} · Splash`;

        headerEl.innerHTML = ` 
            <div class="post-meta">${formatDate(post.createdAt)} · by ${escapeHtml(post.author.username)}</div>
            <h1>${escapeHtml(post.title)}</h1>
        `;

        imageEl.src = post.imageUrl || PLACEHOLDER_IMAGE;
        imageEl.alt = post.title;
        bodyEl.textContent = post.content;

        loadComments();
    } catch (err) {
        headerEl.innerHTML = `<div class="error-state">${err.message}</div>`;
    }
}

async function loadComments() {
    try {
        const comments = await getComments(postId);
        renderComments(comments);
    } catch (err) {
        commentsListEl.innerHTML = `<div class="error-state">${err.message}</div>`;
    }
}

function renderComments(comments) {
    commentsHeadingEl.textContent = `${comments.length} comment${comments.length === 1 ? "" : "s"}`;
    const currentUser = getUser();

    commentsListEl.innerHTML = 
        comments
            .map(c => {
                const canModerate = currentUser && (currentUser.id === c.userId || currentUser.role === "ADMIN");
                return `
                    <div class="comment" data-id="${c.id}">
                        <div class="comment-avatar">${c.user.username[0].toUpperCase()}</div>
                        <div class="comment-body>
                            <div class="comment-meta">
                                <span class="username">${escapeHtml(c.user.username)}</span>
                                <span class="date">· ${formatDate(c.createdAt)}</span>
                            </div>
                            <div class="comment-text">${escapeHtml(c.content)}</div>
                            ${
                                canModerate 
                                ? `<div class="comment-actions"><button data-action="delete">Delete</button></div>` 
                                : ""
                            };
                        </div>
                    </div>
                `;
            })
            .join("") || `<div class="empty-state">No comments yet - be the first.</div>`;

    commentsListEl.querySelectorAll(`[data-action="delete"]`).forEach(btn => {
        btn.addEventListener("click", async (e) => {
            if (!confirm("Delete this comment?")) return;
            const id = e.target.closet(".comment").dataset.id;
            try {
                await deleteComment(id);
                loadComments();
            } catch (err) {
                alert(err.message);
            }
        });
    });
}

function renderCommentArea() {
    if (!isLoggedIn()) {
        commentAreaEl.innerHTML = `
            <div class="signin-prompt">
                <a href="login.html">Sign in</a> to leave a comment.
            </div>
        `;
        return;
    }

    commentAreaEl.innerHTML = `
        <form class="comment-form" id="comment-form">
            <textarea id="comment-input" placeholder="Add a comment..." required></textarea>
            <button type="submit" class="btn btn-primary">Post comment</button>
        </form>
    `;

    document.getElementById("comment-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("comment-input");
        const content = input.value.trim();
        if (!content) return;

        try {
            await addComment(postId, content);
            input.value = "";
            loadComments();
        } catch (err) {
            alert(err.message);
        }
    });
}

renderCommentArea();
loadPost();
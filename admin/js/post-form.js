import { requireAdmin } from "./auth.js";
import { renderNav } from "./nav.js";
import { getPost, createPost, updatePost, togglePublish, deletePost, getComments, deleteComment } from "./api.js";
import { escapeHtml, formatDate } from "./helpers.js";

requireAdmin();
renderNav();

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
const isEditing = !!postId;

const titleHeading = document.getElementById("form-title");
const form = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const imageInput = document.getElementById("imageUrl");
const contentInput = document.getElementById("content");
const messageEl = document.getElementById("form-message");
const deleteBtn = document.getElementById("delete-btn");
const publishBtn = document.getElementById("publish-toggle-btn");
const moderationSection = document.getElementById("moderation-section");
const commentsListEl = document.getElementById("moderation-comments");

let currentPost = null;

function showMessage(text, isError = true) {
    messageEl.textContent = text;
    messageEl.className = `form-message ${isError ? "error" : ""}`;
    messageEl.style.display = "block";
}

async function init() {
    if (!isEditing) {
        titleHeading.textContent = "New post";
        return;
    }

    titleHeading.textContent = "Edit post";
    deleteBtn.style.display = "inline-flex";
    publishBtn.style.display = "inline-flex";
    moderationSection.style.display = "block";

    try {
        currentPost = await getPost(postId);
        titleInput.value = currentPost.title;
        imageInput.value = currentPost.imageUrl || "";
        contentInput.value = currentPost.content;
        updatePublishButton();
        loadComments();
    } catch (err) {
        showMessage(err.message);
    }
}

function updatePublishButton() {
    publishBtn.textContent = currentPost.published ? "Unpublish" : "Publish";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.style.display = "none";

    const data = {
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
        imageUrl: imageInput.value.trim() || null,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
        if (isEditing) {
            currentPost = await updatePost(postId, data);
            showMessage("Saved", false);
        } else {
            const created = await createPost(data);
            window.location.href = `index.html`;
        }
    } catch (err) {
        showMessage(err.message);
    } finally {
        submitBtn.disabled = false;
    }
});

publishBtn?.addEventListener("click", async () => {
    publishBtn.disabled = true;

    try {
        currentPost = await togglePublish(postId);
        updatePublishButton();
    } catch (err) {
        showMessage(err.message);
    } finally {
        publishBtn.disabled = false;
    }
});

deleteBtn?.addEventListener("click", async () => {
    if (!confirm("Delete this post? This can't be undone.")) return;

    try {
        await deletePost(postId);
        window.location.href = "index.html";
    } catch (err) { 
        showMessage(err.message);
    }
});

async function loadComments() {
    try {
        const comments = await getComments(postId);
        renderComments(comments);
    } catch (err) {
        commentsListEl.innerHTML = `<div class="error-state">${err.message}</div>`;
    }
}

function renderComments(comments) {
    if (!comments.length) {
        commentsListEl.innerHTML = `<div class="empty-state">No comments on this post yet.</div>`;
        return;
    }

    commentsListEl.innerHTML = 
        comments
            .map(c => `
                <div class="comment" data-id="${c.id}">
                    <div class="comment-avatar">${c.user.username[0].toUpperCase()}</div>
                    <div class="comment-body">
                        <div class="comment-meta">
                            <span class="username">${escapeHtml(c.user.username)}</span>
                            <span class="date">· ${formatDate(c.createdAt)}</span>
                        </div>
                        <div class="comment-text">${escapeHtml(c.content)}</div>
                        <div class="comment-actions"><button data-action="delete">Delete</button></div>
                    </div>
                </div>
            `)
            .join("");

    commentsListEl.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener("click", async (e) => {
            if (!confirm("Delete this comment?")) return;
            const id = e.target.closest(".comment").dataset.id;
            try {
                await deleteComment(id);
                loadComments();
            } catch (err) {
                alert(err.message);
            }
        });
    });
}

init();
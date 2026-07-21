import { requireAdmin } from "./auth.js";
import { renderNav } from "./nav.js";
import { getAllPosts, togglePublish, deletePost } from "./api.js";
import { escapeHtml, formatDate } from "./helpers.js";

requireAdmin();
renderNav();

const listEl = document.getElementById("post-list");

async function load() {
    listEl.innerHTML = `<div class="loading-state">Loading posts...</div>`;

    try {
        const posts = await getAllPosts();
        render(posts);
    } catch (err) {
        listEl.innerHTML = `<div class="error-state>${err.message}</div>`;
    }
}

function render(posts) {
    if (!posts.length) {
        listEl.innerHTML = `<div class="empty-state">No posts yet. Click "New post" to write your first one.</div>`;
        return;
    }

    listEl.innerHTML = posts
        .map(post => `
                <div class="admin-post-row" data-id="${post.id}">
                    <div class="post-info">
                        <h3>${escapeHtml(post.title)}</h3>
                        <div class="post-meta">
                            <span class="status-badge ${post.published ? "published" : "draft"}">${post.published ? "Published" : "Draft"}</span>
                            <span>${formatDate(post.createdAt)}</span>
                            <span>· ${post._count?.comments ?? 0} comments</span>
                        </div>
                    </div>
                    <div class="admin-post-actions">
                        <a class="icon-btn" href="post-form.html?id=${post.id}" title="Edit" aria-label="Edit">
                            <i class="ti ti-pencil" aria-hidden="true"></i>
                        </a>
                        <button class="icon-btn" data-action="toggle" title="${post.published ? "Unpublish" : "Publish"}" aria-label="Toggle publish state">
                            <i class="ti ${post.published ? "ti-eye-off" : "ti-eye"}" aria-hidden="true"></i>
                        </button>
                        <button class="icon-btn danger" data-action="delete" title="Delete" aria-label="Delete">
                            <i class="ti ti-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            `)
        .join("");

    listEl.querySelectorAll('[data-action="toggle"]').forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.closest(".admin-post-row").dataset.id;
            btn.disabled = true;

            try {
                await togglePublish(id);
                load();
            } catch (err) {
                alert(err.message);
                btn.disabled = false;
            }
        });
    });

    listEl.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener("click", async (e) => {
            if (!confirm("Delete this post? This can't be undone.")) return;
            const id = e.target.closest(".admin-post-row").dataset.id;

            try {
                await deletePost(id);
                load();
            } catch (err) {
                alert(err.message);
            }
        });
    });
}

load();
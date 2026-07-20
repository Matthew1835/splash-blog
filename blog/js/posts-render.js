function escapeHtml(str = "") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function excerpt(text = "", len = 140) {
    if (text.length <= len) return text;
    return text.slice(0, len).trim() + "...";
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function renderPostList(posts, container) {
    if (!posts.length) {
        container.innerHTML = `<div class="empty-state">No posts found.</div>`;
        return;
    }

    container.innerHTML = posts
        .map(post => {
            const count = post._count?.comments ?? 0;
            return `
                <a class="post-card" href="post.html?id=${post.id}">
                    <h2>${escapeHtml(post.title)}</h2>
                    <p>${escapeHtml(excerpt(post.content))}</p>
                    <div class="post-meta">${formatDate(post.createdAt)} · ${count} comment${count === 1 ? "" : "s"}</div>
                </a>
            `;
        })
        .join("");
}

export { escapeHtml, excerpt, formatDate, renderPostList };
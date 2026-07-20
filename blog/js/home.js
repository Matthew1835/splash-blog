import { getPosts } from "./api.js";
import { renderNav } from "./nav.js"; 
import { renderPostList } from "./posts-render.js";

renderNav("home");

const listEl = document.getElementById("post-list");
const searchInput = document.getElementById("search-input");

let debounceTimer;

async function loadPosts(search = "") {
    listEl.innerHTML = `<div class="loading-state">Loading posts...</div>`;
    try {
        const posts = await getPosts(search);
        renderPostList(posts, listEl);
    } catch (err) {
        listEl.innerHTML = `<div class="error-state">${err.message}</div>`;
    }
}

searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => loadPosts(e.target.value.trim()), 300);
});

loadPosts();
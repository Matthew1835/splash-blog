import { getPosts } from "./api.js";
import { renderNav } from "./nav.js";
import { renderPostList } from './posts-render.js';

renderNav("archive");

const listEl = document.getElementById("post-list");

getPosts()
    .then(posts => renderPostList(posts, listEl))
    .catch(err => {
        listEl.innerHTML = `<div class="error-state">${err.message}</div>`;
    });
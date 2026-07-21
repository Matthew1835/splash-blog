import { getUser, clearSession } from "./auth.js";

export function renderNav() {
    const mount = document.getElementById("site-nav");
    if (!mount) return;

    const user = getUser();

    mount.innerHTML = `
        <a href="index.html" class="nav-logo">Splash <span style="color: var(--clay); font-weight: 400; font-size: 14px;">Admin</span></a>
        <div class="nav-links">
            <a href="index.html">Posts</a>
            <a href="post-form.html">New post</a>
        </div>
        <div class="nav-auth">
            ${
                user
                    ? `<span class="username">${user.username}</span><button class="btn btn-outline" id="logout-btn" style="padding: 6px 14px;">Log out</button>`
                    : ""
            }
        </div>
    `;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            clearSession();
            window.location.href = "login.html";
        });
    }
}
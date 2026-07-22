import { getUser, clearSession } from "./auth.js";

export function renderNav (activePage) {
    const mount = document.getElementById("site-nav");
    if (!mount) return;

    const user = getUser();
    const links = [
        { href: "index.html", label: "Home", key: "home" },
        { href: "about.html", label: "About", key: "about" },
    ];

    mount.innerHTML = `
        <a href="index.html" class="nav-log">Splash</a>
        <div class="nav-links">
            ${links.map(l => {
                return `<a href="${l.href}" class="${l.key === activePage ? "active" : ""}">${l.label}</a>`
            }).join("")}
        </div>
        <div class="nav-auth">
            ${
                user
                    ? `<span class="username">${user.username}</span><button class="btn btn-outline" id="logout-btn" style="padding: 6px 14px;">Log out</button>`
                    : `<a href="login.html" class="btn btn-outline" style="padding: 6px 14px;">Sign in</a>`
            }
        </div>
    `;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            clearSession();
            window.location.href = "index.html";
        });
    }
}
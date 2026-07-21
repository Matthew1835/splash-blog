const TOKEN_KEY = "splash_admin_token";
const USER_KEY = "splash_admin_user";

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function isAdmin() {
    const user = getUser();
    return !!getToken() && user.role === "ADMIN";
}

function requireAdmin() {
    if (!isAdmin()) window.location.href = "login.html";
}

export { getToken, getUser, setSession, clearSession, isAdmin, requireAdmin };
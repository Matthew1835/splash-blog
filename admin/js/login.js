import { login } from "./auth.js";
import { setSession } from "./auth.js";

const form = document.getElementById("login-form");
const messageEl = document.getElementById("form-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    
    try {
        const { token, user } = await login(email, password);

        if (user.role !== "ADMIN") {
            messageEl.textContent = "This account doesn't have admin access.";
            messageEl.style.display = "block";
            return;
        }

        setSession(token, user);
        window.location.href = "index.html";
    } catch (err) {
        messageEl.textContent = err.message;
        messageEl.style.display = "block";
    } finally {
        submitBtn.disabled = false;
    }
});
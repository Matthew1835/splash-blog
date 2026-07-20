import { register } from "./api.js";
import { setSession } from "./auth.js";
import { renderNav } from "./nav.js";

renderNav("");

const form = document.getElementById("register-form");
const messageEl = document.getElementById("form-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.style.display = "none";

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = form.querySelector('button[type="submit]');
    submitBtn.disabled = true;

    try {
        const { token, user } = await register(username, email, password);
        setSession(token, user);
        window.location.href = "index.html";
    } catch (err) {
        messageEl.textContent = err.message;
        messageEl.style.display = "block";
    } finally {
        submitBtn.disabled = false;
    }
});
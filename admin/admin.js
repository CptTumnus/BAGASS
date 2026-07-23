// ==========================================
// BAGASS Admin
// ==========================================

const ADMIN_TOKEN_COOKIE = "bagass_admin_token";
const LOGIN_ENDPOINT = "https://bagass-api-theta.vercel.app/api/auth/login";

function getCookie(name) {
    const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, hours) {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/admin; SameSite=Lax${secure}`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin`;
}

const loginView = document.getElementById("loginView");
const actionsView = document.getElementById("actionsView");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutButton = document.getElementById("logoutButton");

function showLoggedIn() {
    loginView.hidden = true;
    actionsView.hidden = false;
}

function showLoggedOut() {
    actionsView.hidden = true;
    loginView.hidden = false;
}

if (getCookie(ADMIN_TOKEN_COOKIE)) {
    showLoggedIn();
} else {
    showLoggedOut();
}

loginForm?.addEventListener("submit", async (event) => {

    event.preventDefault();
    loginError.hidden = true;

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(LOGIN_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Invalid username or password");
        }

        const data = await response.json();
        const token = data.token;

        if (!token) {
            throw new Error("No auth token returned");
        }

        setCookie(ADMIN_TOKEN_COOKIE, token, 24);
        showLoggedIn();

    } catch (error) {

        loginError.textContent = error.message || "Login failed. Please try again.";
        loginError.hidden = false;

    }

});

logoutButton?.addEventListener("click", () => {
    deleteCookie(ADMIN_TOKEN_COOKIE);
    showLoggedOut();
});

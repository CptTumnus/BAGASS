// ==========================================
// BAGASS Admin - Add Game
// ==========================================

const GAMES_ENDPOINT = "https://bagass-api-theta.vercel.app/api/games";

function getCookie(name) {
    const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
}

const addGameForm = document.getElementById("addGameForm");
const addGameError = document.getElementById("addGameError");
const addGameSuccess = document.getElementById("addGameSuccess");

addGameForm?.addEventListener("submit", async (event) => {

    event.preventDefault();
    addGameError.hidden = true;
    addGameSuccess.hidden = true;

    const name = document.getElementById("gameName").value.trim();
    const minPlayers = document.getElementById("minPlayers").value;
    const maxPlayers = document.getElementById("maxPlayers").value;
    const playTimeMinutes = document.getElementById("playTimeMinutes").value;

    try {

        const response = await fetch(GAMES_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCookie("bagass_admin_token")}`
            },
            body: JSON.stringify({
                name,
                minPlayers: minPlayers ? Number(minPlayers) : null,
                maxPlayers: maxPlayers ? Number(maxPlayers) : null,
                playTimeMinutes: playTimeMinutes ? Number(playTimeMinutes) : null
            })
        });

        if (response.status === 401) {
            window.location.replace("index.html");
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to add game");
        }

        addGameForm.reset();
        addGameSuccess.textContent = `"${data.name}" was added to the game library.`;
        addGameSuccess.hidden = false;

    } catch (error) {

        addGameError.textContent = error.message || "Failed to add game. Please try again.";
        addGameError.hidden = false;

    }

});

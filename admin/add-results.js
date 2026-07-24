// ==========================================
// BAGASS Admin - Add Game Results
// ==========================================

const GAMES_ENDPOINT = "https://bagass-api-theta.vercel.app/api/games";
const SEASONS_ENDPOINT = "https://bagass-api-theta.vercel.app/api/seasons";
const PLAYERS_ENDPOINT = "https://bagass-api-theta.vercel.app/api/players";
const GAME_PLAYS_ENDPOINT =
  "https://bagass-api-theta.vercel.app/api/game_plays";

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const resultsForm = document.getElementById("resultsForm");
const resultsError = document.getElementById("resultsError");
const resultsSuccess = document.getElementById("resultsSuccess");
const gameSelect = document.getElementById("gameSelect");
const seasonSelect = document.getElementById("seasonSelect");
const momentInput = document.getElementById("moment");
const notesEditor = document.getElementById("notesEditor");
const resultsRepeater = document.getElementById("resultsRepeater");
const addResultRowButton = document.getElementById("addResultRow");

let playerOptionsHtml = "";

function playerSelectHtml() {
  return `<option value="">Select player</option>${playerOptionsHtml}`;
}

function createResultRow() {
  const row = document.createElement("div");
  row.className = "results-row";
  row.innerHTML = `
    <select class="result-player">${playerSelectHtml()}</select>
    <input type="number" class="result-position" min="1" step="1" placeholder="Position">
    <input type="number" class="result-points" min="0" step="1" placeholder="Points">
    <button type="button" class="result-remove" aria-label="Remove player">✕</button>
  `;

  row
    .querySelector(".result-remove")
    .addEventListener("click", () => row.remove());

  return row;
}

function addResultRow() {
  resultsRepeater.appendChild(createResultRow());
}

addResultRowButton?.addEventListener("click", addResultRow);

// Start with one row so the repeater isn't empty
addResultRow();

async function loadGames() {
  try {
    const response = await fetch(GAMES_ENDPOINT);
    if (!response.ok) throw new Error("Failed to load games");

    const games = await response.json();

    gameSelect.innerHTML = games.length
      ? games
          .map((game) => `<option value="${game.id}">${game.name}</option>`)
          .join("")
      : `<option value="">No games in the library yet</option>`;
  } catch (error) {
    gameSelect.innerHTML = `<option value="">Couldn't load games</option>`;
  }
}

async function loadSeasons() {
  try {
    const response = await fetch(SEASONS_ENDPOINT);
    if (!response.ok) throw new Error("Failed to load seasons");

    const seasons = await response.json();

    seasonSelect.innerHTML = seasons.length
      ? seasons
          .map(
            (season) =>
              `<option value="${season.id}" ${season.activeSeason ? "selected" : ""}>${season.name}</option>`
          )
          .join("")
      : `<option value="">No seasons found</option>`;
  } catch (error) {
    seasonSelect.innerHTML = `<option value="">Couldn't load seasons</option>`;
  }
}

async function loadPlayers() {
  try {
    const response = await fetch(PLAYERS_ENDPOINT);
    if (!response.ok) throw new Error("Failed to load players");

    const players = await response.json();
    playerOptionsHtml = players
      .map((player) => `<option value="${player.id}">${player.name}</option>`)
      .join("");
  } catch (error) {
    playerOptionsHtml = `<option value="" disabled>Couldn't load players</option>`;
  }

  document.querySelectorAll(".result-player").forEach((select) => {
    const previousValue = select.value;
    select.innerHTML = playerSelectHtml();
    select.value = previousValue;
  });
}

loadGames();
loadSeasons();
loadPlayers();

document.querySelectorAll(".html-editor-toolbar button").forEach((button) => {
  button.addEventListener("mousedown", (event) => event.preventDefault());
  button.addEventListener("click", () => {
    notesEditor.focus();
    document.execCommand(
      button.dataset.command,
      false,
      button.dataset.value || null
    );
  });
});

resultsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  resultsError.hidden = true;
  resultsSuccess.hidden = true;

  const gameId = gameSelect.value;
  const season = seasonSelect.value;
  const moment = momentInput.value.trim();
  const notes = notesEditor.innerHTML.trim();

  if (!gameId) {
    resultsError.textContent = "Please select a game.";
    resultsError.hidden = false;
    return;
  }

  if (!season) {
    resultsError.textContent = "Please select a season.";
    resultsError.hidden = false;
    return;
  }

  const rows = Array.from(resultsRepeater.querySelectorAll(".results-row"));
  const results = [];

  for (const row of rows) {
    const playerId = row.querySelector(".result-player").value;
    const position = row.querySelector(".result-position").value;
    const points = row.querySelector(".result-points").value;

    if (!playerId && !position && !points) continue;

    if (!playerId || position === "" || points === "") {
      resultsError.textContent =
        "Each player row needs a player, position, and points.";
      resultsError.hidden = false;
      return;
    }

    results.push({
      playerId: Number(playerId),
      position: Number(position),
      points: Number(points),
    });
  }

  try {
    const response = await fetch(GAME_PLAYS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("bagass_admin_token")}`,
      },
      body: JSON.stringify({
        gameId: Number(gameId),
        season: Number(season),
        notes: notes || null,
        moment: moment || null,
        results,
      }),
    });

    if (response.status === 401) {
      window.location.replace("index.html");
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save results");
    }

    resultsForm.reset();
    notesEditor.innerHTML = "";
    resultsRepeater.innerHTML = "";
    addResultRow();

    resultsSuccess.textContent = "Game results were saved.";
    resultsSuccess.hidden = false;
  } catch (error) {
    resultsError.textContent =
      error.message || "Failed to save results. Please try again.";
    resultsError.hidden = false;
  }
});

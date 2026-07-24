// ==========================================
// BAGASS Championship
// Game Library
// ==========================================

const GAME_LIBRARY_ENDPOINT = "https://bagass-api-theta.vercel.app/api/games";

const GAME_LIBRARY_COLUMNS = [
  { key: "name", label: "Game" },
  //   { key: "minPlayers", label: "Min Players" },
  //   { key: "maxPlayers", label: "Max Players" },
  //   { key: "playTimeMinutes", label: "Play Time" },
  { key: "totalPlaysThisSeason", label: "Season Plays" },
  { key: "totalPlays", label: "Total Plays" },
];

let gameLibraryData = [];
let gameLibrarySort = { column: "name", direction: "asc" };

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]
  );
}

function compareGames(gameA, gameB, column, direction) {
  const valueA = gameA[column];
  const valueB = gameB[column];

  if (valueA == null && valueB == null) return 0;
  if (valueA == null) return 1;
  if (valueB == null) return -1;

  const result =
    typeof valueA === "number" && typeof valueB === "number"
      ? valueA - valueB
      : String(valueA).localeCompare(String(valueB));

  return direction === "asc" ? result : -result;
}

function renderGameLibrary() {
  const container = document.getElementById("gameLibraryTable");
  if (!container) return;

  if (!gameLibraryData.length) {
    container.innerHTML = `<div class="coming-soon"><span>🎲</span><strong>No games in the library yet</strong></div>`;
    return;
  }

  const sortedGames = [...gameLibraryData].sort((gameA, gameB) =>
    compareGames(
      gameA,
      gameB,
      gameLibrarySort.column,
      gameLibrarySort.direction
    )
  );

  const headerHtml = GAME_LIBRARY_COLUMNS.map((column) => {
    const isActive = gameLibrarySort.column === column.key;
    const arrow = isActive
      ? gameLibrarySort.direction === "asc"
        ? " ▲"
        : " ▼"
      : "";

    return `<th data-column="${column.key}" class="${isActive ? "sorted" : ""}">${column.label}${arrow}</th>`;
  }).join("");

  const rowsHtml = sortedGames
    .map(
      (game) => `
        <tr>
            <td>${escapeHtml(game.name)}</td>
            <td>${game.totalPlaysThisSeason ?? 0}</td>
            <td>${game.totalPlays ?? 0}</td>            
        </tr>
    `
    )
    .join("");

  container.innerHTML = `
        <div class="game-table-wrapper">
            <table class="game-table">
                <thead><tr>${headerHtml}</tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;

  container.querySelectorAll("th[data-column]").forEach((header) => {
    header.addEventListener("click", () => {
      const column = header.dataset.column;

      gameLibrarySort =
        gameLibrarySort.column === column
          ? {
              column,
              direction: gameLibrarySort.direction === "asc" ? "desc" : "asc",
            }
          : { column, direction: "asc" };

      renderGameLibrary();
    });
  });
}

async function loadGameLibrary() {
  const container = document.getElementById("gameLibraryTable");
  if (!container) return;

  try {
    const response = await fetch(GAME_LIBRARY_ENDPOINT);

    if (!response.ok) {
      throw new Error("Failed to load games");
    }

    gameLibraryData = await response.json();
    renderGameLibrary();
  } catch (error) {
    container.innerHTML = `<div class="coming-soon"><span>🎲</span><strong>Couldn't load the game library</strong></div>`;
  }
}

loadGameLibrary();

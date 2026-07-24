// ==========================================
// BAGASS Championship v1.0
// ==========================================

const enterButton = document.getElementById("enterButton");
const mainMenu = document.getElementById("mainMenu");
const cards = Array.from(document.querySelectorAll(".flip-card"));

enterButton?.addEventListener("click", () => {
    mainMenu?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// ==========================================
// Player Cards
// ==========================================

function closeCard(card) {
    card.classList.remove("flipped");
    card.setAttribute("aria-pressed", "false");
}

function toggleCard(event) {

    const selectedCard = event.currentTarget;
    const willOpen = !selectedCard.classList.contains("flipped");

    cards.forEach(card => {
        if (card !== selectedCard) {
            closeCard(card);
        }
    });

    selectedCard.classList.toggle("flipped", willOpen);
    selectedCard.setAttribute("aria-pressed", String(willOpen));

}

cards.forEach(card => {
    card.addEventListener("click", toggleCard);
});

console.info("BAGASS v1.0 loaded");

// ==========================================
// League Table
// ==========================================

const LEAGUE_RESULTS_ENDPOINT = "https://bagass-api-theta.vercel.app/api/results";

function buildLeagueRows(results) {

    const rows = players.map(player => {

        const result = results.find(r => r.playerId === player.apiId);

        return {
            player: player,
            points: result ? result.totalPoints : 0,
            firsts: result ? result.firstPlaces : 0,
            seconds: result ? result.secondPlaces : 0
        };

    });

    rows.sort((a, b) => {

        if (b.points !== a.points) return b.points - a.points;
        if (b.firsts !== a.firsts) return b.firsts - a.firsts;
        return b.seconds - a.seconds;

    });

    return rows;

}

function renderLeagueTable(rows) {

    let html = `
        <table class="league-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Points</th>
                    <th>🥇</th>
                    <th>🥈</th>
                </tr>
            </thead>
            <tbody>
    `;

    rows.forEach((row, index) => {

        const info = row.player;

        const crown = index === 0 ? "👑 " : "";
        const trophy = info && info.seasonOneChampion ? "🏆 " : "";

        html += `
            <tr class="${index === 0 ? "leader" : ""}">
                <td>${index + 1}</td>
                <td>${crown}${trophy}${info ? info.name : "Unknown Player"}</td>
                <td>${row.points}</td>
                <td>${row.firsts}</td>
                <td>${row.seconds}</td>
            </tr>
        `;

    });

    document.getElementById("leagueTable").innerHTML = `
        ${html}
            </tbody>
        </table>
    `;

}

async function buildLeagueTable() {

    const container = document.getElementById("leagueTable");
    if (!container) return;

    try {

        const response = await fetch(LEAGUE_RESULTS_ENDPOINT);

        if (!response.ok) {
            throw new Error("Failed to load results");
        }

        const results = await response.json();
        renderLeagueTable(buildLeagueRows(results));

    } catch (error) {
        container.innerHTML = `<div class="coming-soon"><span>🏆</span><strong>Couldn't load the league standings</strong></div>`;
    }

}

buildLeagueTable();
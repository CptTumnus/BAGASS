u// BAGASS Championship v1.0
const enterButton = document.getElementById("enterButton");
const mainMenu = document.getElementById("mainMenu");
const cards = Array.from(document.querySelectorAll(".flip-card"));

enterButton?.addEventListener("click", () => {
  mainMenu?.scrollIntoView({ behavior: "smooth", block: "start" });
});

function closeCard(card) {
  card.classList.remove("flipped");
  card.setAttribute("aria-pressed", "false");
}

function toggleCard(event) {
  // currentTarget is always the exact card whose listener fired.
  const selectedCard = event.currentTarget;
  const willOpen = !selectedCard.classList.contains("flipped");

  cards.forEach((card) => {
    if (card !== selectedCard) closeCard(card);
  });

  selectedCard.classList.toggle("flipped", willOpen);
  selectedCard.setAttribute("aria-pressed", String(willOpen));
}

cards.forEach((card) => card.addEventListener("click", toggleCard));
console.info("BAGASS v1.0 loaded");

// ==========================================
// League Table
// ==========================================

function buildLeagueTable() {

    const league = getLeagueTable();

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

    league.forEach((player, index) => {

        const info = getPlayer(player.player);

        const crown = index === 0 ? "👑 " : "";
        const trophy = info.seasonOneChampion ? "🏆 " : "";

        html += `
            <tr class="${index === 0 ? "leader" : ""}">
                <td>${index + 1}</td>
                <td>${crown}${trophy}${info.name}</td>
                <td>${player.points}</td>
                <td>${player.firsts}</td>
                <td>${player.seconds}</td>
            </tr>
        `;

    });

    html += `
            </tbody>
        </table>
    `;

    document.getElementById("leagueTable").innerHTML = html;

}

// ==========================================
// Initialise Website
// ==========================================

// ==========================================
// Session Chronicles
// ==========================================

function buildSessionHistory() {

    const container = document.getElementById("sessionHistory");

    if (!container) {
        console.error("sessionHistory div not found.");
        return;
    }

    let html = "";

    games.forEach((game, index) => {

        const winners = game.results
            .filter(r => r.position === 1)
            .map(r => getPlayer(r.player)?.name || r.player);

        const runnersUp = game.results
            .filter(r => r.position === 2)
            .map(r => getPlayer(r.player)?.name || r.player);

        const hosts = (game.hosts || [])
            .map(host => getPlayer(host)?.name || host)
            .join(" & ");

        html += `
        <article class="chronicle-card">

            <div class="chronicle-title">

                <p class="eyebrow">
                    Chapter ${index + 1}
                </p>

                <h2>${game.game}</h2>

                <p><strong>${game.date}</strong></p>

                <p>🏠 Hosted by ${hosts}</p>

            </div>

            <div class="chronicle-section">

                <h3>🏆 Champions</h3>

                <ul>
                    ${winners.map(name => `<li>${name}</li>`).join("")}
                </ul>

            </div>

            ${
                runnersUp.length
                ?
                `
                <div class="chronicle-section">

                    <h3>🥈 Runner-up</h3>

                    <ul>
                        ${runnersUp.map(name => `<li>${name}</li>`).join("")}
                    </ul>

                </div>
                `
                :
                ""
            }

            <div class="chronicle-section">

                <h3>📜 Chronicle</h3>

                <p>${game.chronicle.replace(/\n/g,"<br><br>")}</p>

            </div>

            <div class="chronicle-section">

                <h3>⭐ Moment of the Night</h3>

                <blockquote>${game.moment}</blockquote>

            </div>

        </article>
        `;

    });

    container.innerHTML = html;

}


// ==========================================
// Initialise Website
// ==========================================

buildLeagueTable();
// ==========================================
// BAGASS Championship
// Session Chronicles
// ==========================================

function buildSessionHistory() {

    const container = document.getElementById("sessionHistory");

    if (!container) return;

    let html = "";

    games.forEach((game, index) => {

        const winners = game.results
            .filter(result => result.position === 1)
            .map(result => getPlayer(result.player).name);

        const runnersUp = game.results
            .filter(result => result.position === 2)
            .map(result => getPlayer(result.player).name);

        const hosts = game.hosts
            .map(host => getPlayer(host).name)
            .join(" & ");

        html += `

        <article class="chronicle-card">

            <div class="chronicle-header">

                <p class="eyebrow">
                    Chapter ${toRoman(index + 1)}
                </p>

                <h2>${game.game}</h2>

                <p class="chronicle-date">${formatDate(game.date)}</p>

                <p><strong>Hosted by:</strong> ${hosts}</p>

            </div>

          <div class="chronicle-toggle">

    <span>▼ Open Chronicle</span>

           </div>

            <div class="chronicle-content">

                <h3>🏆 Champions</h3>

                <ul>

                    ${winners.map(name => `<li>${name}</li>`).join("")}

                </ul>

                ${
                    runnersUp.length
                    ?
                    `
                    <h3>${runnersUp.length > 1 ? "🥈 Runners-up" : "🥈 Runner-up"}</h3>

                    <ul>

                        ${runnersUp.map(name => `<li>${name}</li>`).join("")}

                    </ul>
                    `
                    :
                    ""
                }

                <h3>📜 Chronicle</h3>

                <p>${game.chronicle.replace(/\n/g,"<br><br>")}</p>

                <h3>⭐ Moment of the Night</h3>

                <blockquote>${game.moment}</blockquote>

            </div>

        </article>

        `;

    });

    container.innerHTML = html;

    document.querySelectorAll(".chronicle-toggle").forEach(button => {

        button.addEventListener("click", () => {

            const content = button.nextElementSibling;

            const open = content.classList.toggle("open");

            button.textContent = open
                ? "📕 Close Chapter"
                : "📖 Read Chapter";

        });

    });

}


// ==========================================
// Helper Functions
// ==========================================

function formatDate(dateString){

    return new Date(dateString).toLocaleDateString("en-GB",{

        day:"numeric",
        month:"long",
        year:"numeric"

    });

}

function toRoman(number){

    const numerals = [

        ["M",1000],
        ["CM",900],
        ["D",500],
        ["CD",400],
        ["C",100],
        ["XC",90],
        ["L",50],
        ["XL",40],
        ["X",10],
        ["IX",9],
        ["V",5],
        ["IV",4],
        ["I",1]

    ];

    let result = "";

    numerals.forEach(([roman,value])=>{

        while(number >= value){

            result += roman;
            number -= value;

        }

    });

    return result;

}


// ==========================================
// Initialise
// ==========================================

buildSessionHistory();
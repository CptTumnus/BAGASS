const champions = [

{

season:"Season One",

year:"2025-2026",

player:"paul",

quote:"He came. He strategised. He conquered.",

image:"images/paul.png"

}

];

function buildChampion(){

    const champion = champions[0];

    const player = getPlayer(champion.player);

    document.getElementById("championDisplay").innerHTML = `
    
    <div class="champion-card">

        <div class="champion-crown">👑</div>

        <img src="${player.portrait}">

        <h2>${player.name}</h2>

        <h3>${champion.season}</h3>

        <p>${champion.quote}</p>

    </div>

    `;

}

buildChampion();

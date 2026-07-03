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

    const player = {

    name: "Paul Barnett",

    portrait: "images/paul.png"

};

    document.getElementById("championDisplay").innerHTML = `

<div class="champion-card">

    <div class="champion-crown">👑</div>

    <img src="${player.portrait}" alt="${player.name}">

    <h2>${player.name}</h2>

    <h3>${champion.season}</h3>

    <p>${champion.quote}</p>

    <button id="paulMode" class="exe-button">
        ⚠ ENTER PAUL.EXE ⚠
    </button>

</div>

`;

    // Add the click event AFTER the button exists
    document.getElementById("paulMode").addEventListener("click", () => {

        window.location.href = "paul-exe.html";

    });

}

buildChampion();

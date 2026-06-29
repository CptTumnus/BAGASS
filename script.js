let currentCard = "";

function showPlayer(
  name,
  title,
  game,
  food,
  least,
  colour,
  number,
  quote,
  playStyle,
  song,
  secret,
  image,
  card
) {

  document.getElementById("profile").classList.remove("hidden");

  document.getElementById("portrait").src = image;
  document.getElementById("name").textContent = name;
  document.getElementById("title").textContent = title;

  document.getElementById("details").innerHTML = `
    <li><strong>🎲 Favourite Game:</strong> ${game}</li>
    <li><strong>🍕 Favourite Food:</strong> ${food}</li>
    <li><strong>💀 Least Favourite Game:</strong> ${least}</li>
    <li><strong>🎨 Favourite Colour:</strong> ${colour}</li>
    <li><strong>🍀 Lucky Number:</strong> ${number}</li>
    <li><strong>💬 Player Quote:</strong> ${quote}</li>
    <li><strong>🏆 Play Style:</strong> ${playStyle}</li>
    <li><strong>🎵 Victory Song:</strong> ${song}</li>
    <li><strong>🤫 Top Secret:</strong> ${secret}</li>
  `;

  currentCard = card;

  document.getElementById("profile").scrollIntoView({
    behavior: "smooth"
  });
}

function showCard() {

  if (currentCard === "") return;

  document.getElementById("overlay").style.display = "flex";
  document.getElementById("cardImage").src = currentCard;

}

function hideCard() {

  document.getElementById("overlay").style.display = "none";

}

window.onclick = function(event){

    const overlay = document.getElementById("overlay");

    if(event.target === overlay){

        hideCard();

    }

}

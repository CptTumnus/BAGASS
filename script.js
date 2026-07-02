// BAGASS Championship v1.0
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
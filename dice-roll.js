// ==========================================
// BAGASS Championship
// Player Dice Roll
// ==========================================

const DICE_FACES = ["front", "back", "right", "left", "top", "bottom"];

const DICE_FACE_ROTATIONS = {
  front: { x: 0, y: 0 },
  back: { x: 0, y: 180 },
  right: { x: 0, y: -90 },
  left: { x: 0, y: 90 },
  top: { x: -90, y: 0 },
  bottom: { x: 90, y: 0 },
};

const DICE_ROLL_MS = 2600;

let diceRotationX = 0;
let diceRotationY = 0;
let diceFacePlayers = {};

function getDiceElements() {
  return {
    fab: document.getElementById("diceRollButton"),
    modal: document.getElementById("diceRollModal"),
    closeButton: document.getElementById("diceRollClose"),
    stage: document.querySelector(".dice-stage"),
    cube: document.getElementById("diceCube"),
    result: document.getElementById("diceRollResult"),
  };
}

function buildDiceFaces() {
  const els = getDiceElements();
  const rosterPlayers = typeof getPlayers === "function" ? getPlayers() : [];

  diceFacePlayers = {};

  els.cube.innerHTML = DICE_FACES.map((face, index) => {
    const player = rosterPlayers[index];
    if (player) diceFacePlayers[face] = player;

    return `
      <div class="dice-face dice-face--${face}">
        ${player ? `<img src="${player.portrait}" alt="${player.name}">` : ""}
        <span>${player ? player.name.split(" ")[0] : "?"}</span>
      </div>
    `;
  }).join("");
}

function angleDelta(currentTotal, target) {
  const currentMod = ((currentTotal % 360) + 360) % 360;
  return ((target - currentMod) % 360 + 360) % 360;
}

function showDiceWinner(player) {
  const els = getDiceElements();
  els.result.textContent = player.name;
  els.result.hidden = false;
}

function rollDice() {
  const els = getDiceElements();
  const faces = Object.keys(diceFacePlayers);
  if (!faces.length) return;

  els.result.hidden = true;

  const winningFace = faces[Math.floor(Math.random() * faces.length)];
  const winner = diceFacePlayers[winningFace];
  const target = DICE_FACE_ROTATIONS[winningFace];

  const extraX = 360 * (2 + Math.floor(Math.random() * 2));
  const extraY = 360 * (3 + Math.floor(Math.random() * 2));

  diceRotationX += extraX + angleDelta(diceRotationX, target.x);
  diceRotationY += extraY + angleDelta(diceRotationY, target.y);

  els.cube.style.transition = `transform ${DICE_ROLL_MS}ms cubic-bezier(0.2, 0.65, 0.15, 1)`;
  els.cube.style.transform = `rotateX(${diceRotationX}deg) rotateY(${diceRotationY}deg)`;

  let finished = false;

  function onTransitionEnd(event) {
    if (event.propertyName !== "transform" || finished) return;
    finished = true;
    els.cube.removeEventListener("transitionend", onTransitionEnd);
    showDiceWinner(winner);
  }

  els.cube.addEventListener("transitionend", onTransitionEnd);

  setTimeout(() => {
    if (finished) return;
    finished = true;
    els.cube.removeEventListener("transitionend", onTransitionEnd);
    showDiceWinner(winner);
  }, DICE_ROLL_MS + 200);
}

function openDiceRoll() {
  const els = getDiceElements();

  if (!els.cube.children.length) buildDiceFaces();

  els.result.hidden = true;
  els.modal.hidden = false;
  document.body.classList.add("modal-open");

  rollDice();
}

function closeDiceRoll() {
  const els = getDiceElements();
  els.modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function initDiceRoll() {
  const els = getDiceElements();
  if (!els.fab) return;

  els.fab.addEventListener("click", openDiceRoll);
  els.closeButton.addEventListener("click", closeDiceRoll);
  els.stage.addEventListener("click", rollDice);

  els.modal.addEventListener("click", (event) => {
    if (event.target === els.modal) closeDiceRoll();
  });
}

initDiceRoll();

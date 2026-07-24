// ==========================================
// BAGASS Championship
// Coin Flip
// ==========================================

const COIN_FLIP_MS = 1800;

let coinRotation = 0;

function getCoinElements() {
  return {
    fab: document.getElementById("coinFlipButton"),
    modal: document.getElementById("coinFlipModal"),
    closeButton: document.getElementById("coinFlipClose"),
    stage: document.querySelector(".coin-stage"),
    coin: document.getElementById("flipCoin"),
    result: document.getElementById("coinFlipResult"),
  };
}

function coinAngleDelta(currentTotal, target) {
  const currentMod = ((currentTotal % 360) + 360) % 360;
  return ((target - currentMod) % 360 + 360) % 360;
}

function showCoinResult(side) {
  const els = getCoinElements();
  els.result.textContent = side === "heads" ? "Heads!" : "Tails!";
  els.result.hidden = false;
}

function flipCoin() {
  const els = getCoinElements();

  els.result.hidden = true;

  const side = Math.random() < 0.5 ? "heads" : "tails";
  const target = side === "heads" ? 0 : 180;
  const extraSpins = 360 * (4 + Math.floor(Math.random() * 3));

  coinRotation += extraSpins + coinAngleDelta(coinRotation, target);

  els.coin.style.transition = `transform ${COIN_FLIP_MS}ms cubic-bezier(0.2, 0.65, 0.15, 1)`;
  els.coin.style.transform = `rotateY(${coinRotation}deg)`;

  let finished = false;

  function onTransitionEnd(event) {
    if (event.propertyName !== "transform" || finished) return;
    finished = true;
    els.coin.removeEventListener("transitionend", onTransitionEnd);
    showCoinResult(side);
  }

  els.coin.addEventListener("transitionend", onTransitionEnd);

  setTimeout(() => {
    if (finished) return;
    finished = true;
    els.coin.removeEventListener("transitionend", onTransitionEnd);
    showCoinResult(side);
  }, COIN_FLIP_MS + 200);
}

function openCoinFlip() {
  const els = getCoinElements();

  els.result.hidden = true;
  els.modal.hidden = false;
  document.body.classList.add("modal-open");

  flipCoin();
}

function closeCoinFlip() {
  const els = getCoinElements();
  els.modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function initCoinFlip() {
  const els = getCoinElements();
  if (!els.fab) return;

  els.fab.addEventListener("click", openCoinFlip);
  els.closeButton.addEventListener("click", closeCoinFlip);
  els.stage.addEventListener("click", flipCoin);

  els.modal.addEventListener("click", (event) => {
    if (event.target === els.modal) closeCoinFlip();
  });
}

initCoinFlip();

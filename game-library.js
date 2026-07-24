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

// ==========================================
// Choose a Game - Spin the Wheel
// ==========================================

const WHEEL_COLORS = ["#8c4dff", "#ff3d9d", "#ffc857", "#5ad1c4", "#ff8f3d", "#6c8cff"];
const WHEEL_SPIN_MS = 5000;
const WHEEL_POINTER_ANGLE = 90;

let pickerAvailable = [];
let pickerSelected = [];
let pickerInitialized = false;
let pickerAudioContext = null;
let wheelRotation = 0;
let confettiAnimationId = null;

function getPickerElements() {
  return {
    openButton: document.getElementById("chooseGameButton"),
    modal: document.getElementById("gameSpinnerModal"),
    closeButton: document.getElementById("gameSpinnerClose"),
    pickerView: document.getElementById("gamePickerView"),
    availableList: document.getElementById("availableGamesList"),
    selectedList: document.getElementById("selectedGamesList"),
    addButton: document.getElementById("addGameButton"),
    removeButton: document.getElementById("removeGameButton"),
    spinButton: document.getElementById("spinWheelButton"),
    wheelView: document.getElementById("wheelView"),
    wheel: document.getElementById("spinWheel"),
    resultView: document.getElementById("wheelResult"),
    resultName: document.getElementById("wheelResultName"),
    spinAgainButton: document.getElementById("spinAgainButton"),
  };
}

function renderPickerList(listEl, items) {
  listEl.innerHTML = items.length
    ? items
        .map(
          (game) =>
            `<li data-id="${game.id}" tabindex="0">${escapeHtml(game.name)}</li>`
        )
        .join("")
    : `<li class="game-picker-empty">Nothing here</li>`;

  listEl.querySelectorAll("li[data-id]").forEach((item) => {
    item.addEventListener("click", () => item.classList.toggle("picked"));
  });
}

function renderPicker() {
  const els = getPickerElements();
  renderPickerList(els.availableList, pickerAvailable);
  renderPickerList(els.selectedList, pickerSelected);
  els.spinButton.disabled = pickerSelected.length < 2;
}

function moveItems(fromArray, toArray, listEl) {
  const pickedIds = Array.from(listEl.querySelectorAll("li.picked")).map(
    (item) => item.dataset.id
  );
  if (!pickedIds.length) return false;

  pickedIds.forEach((id) => {
    const index = fromArray.findIndex((game) => String(game.id) === id);
    if (index !== -1) toArray.push(fromArray.splice(index, 1)[0]);
  });

  return true;
}

function ensurePickerAudioContext() {
  if (!pickerAudioContext) {
    pickerAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (pickerAudioContext.state === "suspended") {
    pickerAudioContext.resume();
  }
}

function playCheerSound() {
  if (!pickerAudioContext) return;

  const now = pickerAudioContext.currentTime;
  const notes = [523.25, 659.25, 784.0, 1046.5];

  notes.forEach((frequency, index) => {
    const oscillator = pickerAudioContext.createOscillator();
    const gainNode = pickerAudioContext.createGain();
    const startTime = now + index * 0.12;

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(pickerAudioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.55);
  });
}

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.hidden = false;

  const duration = 3200;
  const startTime = performance.now();
  const particles = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.3,
    size: 6 + Math.random() * 6,
    color: WHEEL_COLORS[Math.floor(Math.random() * WHEEL_COLORS.length)],
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 3,
    rotation: Math.random() * 360,
    vr: -6 + Math.random() * 12,
  }));

  function frame(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.05;
      particle.rotation += particle.vr;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
      ctx.restore();
    });

    if (elapsed < duration) {
      confettiAnimationId = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.hidden = true;
    }
  }

  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  confettiAnimationId = requestAnimationFrame(frame);
}

function buildWheel(games) {
  const wheelEl = document.getElementById("spinWheel");
  const segmentAngle = 360 / games.length;

  const gradientStops = games
    .map((game, index) => {
      const start = index * segmentAngle;
      const end = start + segmentAngle;
      const color = WHEEL_COLORS[index % WHEEL_COLORS.length];
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  wheelEl.style.background = `conic-gradient(${gradientStops})`;

  wheelEl.innerHTML = games
    .map((game, index) => {
      const midAngle = index * segmentAngle + segmentAngle / 2;
      // The label box naturally points right (true 90deg) before rotating,
      // but midAngle is measured from top (true 0deg) like the gradient
      // stops above - offset by -90deg so the label lands on its own wedge.
      return `
        <div class="wheel-label" style="transform: rotate(${midAngle - 90}deg);">
          <span>${escapeHtml(game.name)}</span>
        </div>
      `;
    })
    .join("");
}

function showWinner(game) {
  const els = getPickerElements();
  els.wheelView.hidden = true;
  els.resultView.hidden = false;
  els.resultName.textContent = game.name;

  launchConfetti();
  playCheerSound();
}

function spinWheel() {
  const els = getPickerElements();
  const games = [...pickerSelected];
  if (games.length < 2) return;

  els.pickerView.hidden = true;
  els.spinButton.hidden = true;
  els.resultView.hidden = true;
  els.wheelView.hidden = false;

  buildWheel(games);

  const winnerIndex = Math.floor(Math.random() * games.length);
  const winner = games[winnerIndex];
  const segmentAngle = 360 / games.length;
  const midAngle = winnerIndex * segmentAngle + segmentAngle / 2;
  const extraSpins = 5;

  // Reset to a clean 0deg baseline (no transition) before every spin, so the
  // alignment math below always starts from a known point rather than
  // wherever the wheel happened to stop last time.
  els.wheel.style.transition = "none";
  els.wheel.style.transform = "rotate(0deg)";
  els.wheel.getBoundingClientRect();

  // The pointer sits on the right of the wheel (90deg clockwise from top).
  const pointerOffset = ((WHEEL_POINTER_ANGLE - midAngle) % 360 + 360) % 360;
  wheelRotation = extraSpins * 360 + pointerOffset;

  els.wheel.style.transition = `transform ${WHEEL_SPIN_MS}ms cubic-bezier(0.15, 0.65, 0.1, 1)`;
  els.wheel.style.transform = `rotate(${wheelRotation}deg)`;

  let finished = false;

  function onTransitionEnd(event) {
    if (event.propertyName !== "transform" || finished) return;
    finished = true;
    els.wheel.removeEventListener("transitionend", onTransitionEnd);
    showWinner(winner);
  }

  els.wheel.addEventListener("transitionend", onTransitionEnd);

  setTimeout(() => {
    if (finished) return;
    finished = true;
    els.wheel.removeEventListener("transitionend", onTransitionEnd);
    showWinner(winner);
  }, WHEEL_SPIN_MS + 200);
}

function openGamePicker() {
  const els = getPickerElements();

  if (!pickerInitialized) {
    pickerAvailable = [...gameLibraryData];
    pickerSelected = [];
    pickerInitialized = true;
  }

  els.pickerView.hidden = false;
  els.spinButton.hidden = false;
  els.wheelView.hidden = true;
  els.resultView.hidden = true;

  renderPicker();

  els.modal.hidden = false;
  document.body.classList.add("modal-open");

  ensurePickerAudioContext();
}

function closeGamePicker() {
  const els = getPickerElements();
  els.modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function initGamePicker() {
  const els = getPickerElements();
  if (!els.openButton) return;

  els.openButton.addEventListener("click", openGamePicker);
  els.closeButton.addEventListener("click", closeGamePicker);

  els.modal.addEventListener("click", (event) => {
    if (event.target === els.modal) closeGamePicker();
  });

  els.addButton.addEventListener("click", () => {
    if (moveItems(pickerAvailable, pickerSelected, els.availableList)) renderPicker();
  });

  els.removeButton.addEventListener("click", () => {
    if (moveItems(pickerSelected, pickerAvailable, els.selectedList)) renderPicker();
  });

  els.spinButton.addEventListener("click", spinWheel);
  els.spinAgainButton.addEventListener("click", spinWheel);
}

initGamePicker();

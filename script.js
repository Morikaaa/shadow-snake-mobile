const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const boardWrap = document.querySelector(".board-wrap");

const scoreText = document.querySelector("#scoreText");
const bestScoreText = document.querySelector("#bestScoreText");
const speedText = document.querySelector("#speedText");
const skinText = document.querySelector("#skinText");
const effectText = document.querySelector("#effectText");
const comboText = document.querySelector("#comboText");
const rewindText = document.querySelector("#rewindText");
const statusText = document.querySelector("#statusText");
const overlay = document.querySelector("#overlay");
const overlayKicker = document.querySelector("#overlayKicker");
const overlayTitle = document.querySelector("#overlayTitle");
const overlayText = document.querySelector("#overlayText");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const soundButton = document.querySelector("#soundButton");
const guideTitle = document.querySelector("#guideTitle");
const guideDetailButton = document.querySelector("#guideDetailButton");
const guideSummary = document.querySelector("#guideSummary");
const guideDetailPanel = document.querySelector("#guideDetailPanel");
const guideBackButton = document.querySelector("#guideBackButton");
const mobileControlButtons = document.querySelectorAll("[data-direction]");

const gridSize = 24;
const cellSize = canvas.width / gridSize;
const bestScoreKey = "shadow-snake-best-score";

const trailLife = 2800;
const shadowFadeTime = 2800;
const formingShadowDuration = 700;
const powerUpLife = 8000;
const hasteDuration = 6000;
const prismDuration = 6000;
const invincibleDuration = 4000;
const magnetDuration = 6000;
const evolveShieldDuration = 1800;
const rewindShieldDuration = 1500;
const comboTimeout = 3000;
const startDelay = 165;
const speedRatio = 0.88;
const magnetRange = 3;
const rewindWindow = 4000;
const rewindTargetAge = 3000;

const progressTiers = [
  {
    minScore: 0,
    name: "默认",
    speedLevel: "Lv.1",
    tierIndex: 0,
    trailToShadowWindow: 2000,
    shadowLife: 8000,
    maxShadowsPerFood: 14,
    head: "#8cffb9",
    body: "#37ff8b",
    glow: "#37ff8b",
    accent: "#37ff8b",
    mode: "default",
    particleType: "green"
  },
  {
    minScore: 50,
    name: "冰蓝核心",
    speedLevel: "Lv.2",
    tierIndex: 1,
    trailToShadowWindow: 1850,
    shadowLife: 7600,
    maxShadowsPerFood: 13,
    head: "#e8fbff",
    body: "#8bdcff",
    glow: "#7dd3fc",
    accent: "#dff9ff",
    mode: "ice",
    particleType: "cyan"
  },
  {
    minScore: 120,
    name: "蓝绿电光",
    speedLevel: "Lv.3",
    tierIndex: 2,
    trailToShadowWindow: 1650,
    shadowLife: 7000,
    maxShadowsPerFood: 12,
    head: "#b9fff4",
    body: "#36f7c9",
    glow: "#37b7ff",
    accent: "#37b7ff",
    mode: "electric",
    particleType: "blue"
  },
  {
    minScore: 220,
    name: "粉色霓虹",
    speedLevel: "Lv.4",
    tierIndex: 3,
    trailToShadowWindow: 1500,
    shadowLife: 6600,
    maxShadowsPerFood: 11,
    head: "#ffe5f4",
    body: "#ff7ad9",
    glow: "#ff4fbf",
    accent: "#37b7ff",
    mode: "pink",
    particleType: "pink"
  },
  {
    minScore: 360,
    name: "紫粉幻影",
    speedLevel: "Lv.5",
    tierIndex: 4,
    trailToShadowWindow: 1350,
    shadowLife: 6200,
    maxShadowsPerFood: 10,
    head: "#f5d0ff",
    body: "#b45cff",
    glow: "#ff7ad9",
    accent: "#ff7ad9",
    mode: "phantom",
    particleType: "purple"
  },
  {
    minScore: 520,
    name: "棱镜霓虹",
    speedLevel: "Lv.6",
    tierIndex: 5,
    trailToShadowWindow: 1200,
    shadowLife: 5600,
    maxShadowsPerFood: 9,
    head: "#ffffff",
    body: "#37ff8b",
    glow: "#ff7ad9",
    accent: "#37b7ff",
    mode: "prism",
    particleType: "prism"
  },
  {
    minScore: 700,
    name: "黄金电弧",
    speedLevel: "Lv.7",
    tierIndex: 6,
    trailToShadowWindow: 1050,
    shadowLife: 5200,
    maxShadowsPerFood: 8,
    head: "#fff7cc",
    body: "#ffd166",
    glow: "#ffb703",
    accent: "#fff6d6",
    mode: "gold",
    particleType: "yellow"
  },
  {
    minScore: 850,
    name: "橙白星焰",
    speedLevel: "Lv.8",
    tierIndex: 7,
    trailToShadowWindow: 950,
    shadowLife: 5000,
    maxShadowsPerFood: 8,
    head: "#ffffff",
    body: "#ff9f1c",
    glow: "#ff6b35",
    accent: "#fff3b0",
    mode: "solar",
    particleType: "orange"
  },
  {
    minScore: 1000,
    name: "白金终焉",
    speedLevel: "Lv.9",
    tierIndex: 8,
    trailToShadowWindow: 850,
    shadowLife: 4800,
    maxShadowsPerFood: 7,
    head: "#ffffff",
    body: "#fff6d6",
    glow: "#ffffff",
    accent: "#ffd166",
    mode: "platinum",
    particleType: "platinum"
  }
];

const rewindMilestones = [220, 520, 700, 850, 1000];

const powerUpTypes = {
  clear: {
    label: "清影",
    score: 20,
    color: "#37b7ff",
    particleType: "blue"
  },
  haste: {
    label: "超频",
    score: 25,
    color: "#ffd166",
    particleType: "yellow"
  },
  prism: {
    label: "棱彩",
    score: 15,
    color: "#ff7ad9",
    particleType: "prism"
  },
  magnet: {
    label: "磁铁",
    score: 15,
    color: "#b45cff",
    particleType: "magnet"
  },
  compress: {
    label: "凝核",
    score: 20,
    color: "#fff6d6",
    particleType: "platinum"
  }
};

let snake = [];
let foods = [];
let powerUp = null;
let trails = [];
let formingShadows = [];
let shadowObstacles = [];
let particles = [];
let floatingTexts = [];
let score = 0;
let bestScore = loadBestScore();
let gameState = "ready";
let currentDirection = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let moveTimer = null;
let pausedAt = 0;
let activeEffect = {
  type: null,
  expiresAt: 0,
  invincibleUntil: 0,
  warnedInvincibleEnding: false,
  warningMarks: {}
};
let evolveShield = {
  expiresAt: 0,
  color: "#7dd3fc",
  warningMarks: {}
};
let rewindShield = {
  expiresAt: 0,
  warningMarks: {}
};
let comboCount = 0;
let lastFoodEatAt = 0;
let unlockedTierNames = new Set(["默认"]);
let headBoostUntil = 0;
let rewindCharges = 0;
let rewindSnapshots = [];
let grantedRewindMilestones = new Set();
const hudFlashTimers = new WeakMap();
let statusOverride = {
  text: "",
  until: 0
};
let soundEnabled = true;
let audioContext = null;
let hasStartedOnce = false;
let touchStartX = 0;
let touchStartY = 0;
let isTouchTracking = false;

startButton.addEventListener("click", handleStartButtonClick);
restartButton.addEventListener("click", startGame);
soundButton.addEventListener("click", toggleSound);
document.addEventListener("keydown", handleKeyDown);
setupMobileControls();

if (guideDetailButton) {
  guideDetailButton.addEventListener("click", showGuideDetail);
}

if (guideBackButton) {
  guideBackButton.addEventListener("click", showGuideSummary);
}

updateSoundButton();
setupBoard();
showStartScreen();
requestAnimationFrame(drawFrame);

function setupBoard() {
  const startX = Math.floor(gridSize / 2);
  const startY = Math.floor(gridSize / 2);

  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
    { x: startX - 3, y: startY }
  ];

  foods = [];
  powerUp = null;
  trails = [];
  formingShadows = [];
  shadowObstacles = [];
  particles = [];
  floatingTexts = [];
  score = 0;
  activeEffect = {
    type: null,
    expiresAt: 0,
    invincibleUntil: 0,
    warnedInvincibleEnding: false,
    warningMarks: {}
  };
  evolveShield = {
    expiresAt: 0,
    color: "#7dd3fc",
    warningMarks: {}
  };
  rewindShield = {
    expiresAt: 0,
    warningMarks: {}
  };
  comboCount = 0;
  lastFoodEatAt = 0;
  unlockedTierNames = new Set(["默认"]);
  headBoostUntil = 0;
  rewindCharges = 0;
  rewindSnapshots = [];
  grantedRewindMilestones = new Set();
  statusOverride = {
    text: "",
    until: 0
  };
  currentDirection = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  ensureFoodCount();
  updateHud();
}

function startGame() {
  hasStartedOnce = true;
  ensureAudioReady();
  playSound("ui");
  clearTimeout(moveTimer);
  pausedAt = 0;
  setupBoard();
  gameState = "playing";
  overlay.classList.add("is-hidden");
  startButton.textContent = "重新开局";
  statusText.textContent = "影子正在记录你的路线";
  scheduleNextMove();
}

function handleStartButtonClick() {
  if (gameState === "paused") {
    resumeGame();
    return;
  }

  startGame();
}

function showStartScreen() {
  gameState = "ready";
  overlay.classList.remove("is-hidden");
  overlayKicker.textContent = "准备开始";
  overlayTitle.textContent = "影子贪吃蛇";
  overlayText.textContent = "吃到食物后，你刚走过的路线会变成影子障碍。别被过去的自己困住。";
  startButton.textContent = "开始游戏";
  statusText.textContent = "等待开始";
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  const directionMap = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 }
  };

  if ((key === " " || key === "spacebar" || key === "p") && (gameState === "playing" || gameState === "paused")) {
    event.preventDefault();
    togglePause();
    return;
  }

  if (key === "enter" && gameState !== "playing") {
    handleStartButtonClick();
    return;
  }

  if (!directionMap[key]) {
    return;
  }

  event.preventDefault();

  if (gameState !== "playing") {
    return;
  }

  changeDirection(directionMap[key]);
}

function togglePause() {
  if (gameState === "playing") {
    pauseGame();
    return;
  }

  if (gameState === "paused") {
    resumeGame();
  }
}

function pauseGame() {
  gameState = "paused";
  pausedAt = performance.now();
  clearTimeout(moveTimer);
  playSound("pause");

  overlay.classList.remove("is-hidden");
  overlayKicker.textContent = "暂停中";
  overlayTitle.textContent = "游戏暂停";
  overlayText.textContent = "按空格或 P 继续游戏。";
  startButton.textContent = "继续";
  statusText.textContent = "游戏已暂停";
}

function resumeGame() {
  const pausedDuration = performance.now() - pausedAt;

  // 暂停期间不消耗影子、道具和粒子的剩余时间。
  shiftTimedObjects(pausedDuration);
  gameState = "playing";
  pausedAt = 0;
  overlay.classList.add("is-hidden");
  startButton.textContent = "重新开局";
  statusText.textContent = "继续移动，别撞到影子";
  playSound("resume");
  scheduleNextMove();
}

function shiftTimedObjects(duration) {
  trails.forEach(function (trail) {
    trail.bornAt = trail.bornAt + duration;
  });

  shadowObstacles.forEach(function (shadow) {
    shadow.bornAt = shadow.bornAt + duration;
  });

  formingShadows.forEach(function (shadow) {
    shadow.bornAt = shadow.bornAt + duration;
    shadow.activatesAt = shadow.activatesAt + duration;
  });

  particles.forEach(function (particle) {
    particle.bornAt = particle.bornAt + duration;
  });

  floatingTexts.forEach(function (text) {
    text.bornAt = text.bornAt + duration;
  });

  if (powerUp !== null) {
    powerUp.expiresAt = powerUp.expiresAt + duration;
  }

  if (activeEffect.type !== null) {
    activeEffect.expiresAt = activeEffect.expiresAt + duration;

    if (activeEffect.invincibleUntil > 0) {
      activeEffect.invincibleUntil = activeEffect.invincibleUntil + duration;
    }
  }

  if (evolveShield.expiresAt > 0) {
    evolveShield.expiresAt = evolveShield.expiresAt + duration;
  }

  if (rewindShield.expiresAt > 0) {
    rewindShield.expiresAt = rewindShield.expiresAt + duration;
  }

  rewindSnapshots.forEach(function (snapshot) {
    snapshot.savedAt = snapshot.savedAt + duration;
  });

  if (lastFoodEatAt > 0) {
    lastFoodEatAt = lastFoodEatAt + duration;
  }

  if (headBoostUntil > 0) {
    headBoostUntil = headBoostUntil + duration;
  }

  if (statusOverride.until > 0) {
    statusOverride.until = statusOverride.until + duration;
  }
}

function changeDirection(newDirection) {
  const isReverse =
    currentDirection.x + newDirection.x === 0 &&
    currentDirection.y + newDirection.y === 0;

  if (!isReverse) {
    nextDirection = newDirection;
  }
}

function setupMobileControls() {
  mobileControlButtons.forEach(function (button) {
    button.addEventListener("pointerdown", handleMobileControlPointerDown);
    button.addEventListener("pointerup", clearMobileControlActiveState);
    button.addEventListener("pointercancel", clearMobileControlActiveState);
    button.addEventListener("pointerleave", clearMobileControlActiveState);
  });

  if (!boardWrap) {
    return;
  }

  boardWrap.addEventListener("touchstart", handleBoardTouchStart, { passive: false });
  boardWrap.addEventListener("touchmove", handleBoardTouchMove, { passive: false });
  boardWrap.addEventListener("touchend", handleBoardTouchEnd, { passive: false });
  boardWrap.addEventListener("touchcancel", resetBoardTouchTracking, { passive: true });
}

function getDirectionByName(directionName) {
  const mobileDirectionMap = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  return mobileDirectionMap[directionName] || null;
}

function handleMobileControlPointerDown(event) {
  event.preventDefault();
  ensureAudioReady();

  const button = event.currentTarget;
  const direction = getDirectionByName(button.dataset.direction);

  if (!direction) {
    return;
  }

  button.classList.add("is-pressed");

  if (gameState === "playing") {
    changeDirection(direction);
  }
}

function clearMobileControlActiveState(event) {
  event.currentTarget.classList.remove("is-pressed");
}

function handleBoardTouchStart(event) {
  if (event.touches.length !== 1) {
    resetBoardTouchTracking();
    return;
  }

  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  isTouchTracking = true;

  if (gameState === "playing") {
    event.preventDefault();
  }
}

function handleBoardTouchMove(event) {
  if (isTouchTracking && gameState === "playing") {
    event.preventDefault();
  }
}

function handleBoardTouchEnd(event) {
  if (!isTouchTracking) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const swipeThreshold = 24;

  resetBoardTouchTracking();

  if (gameState !== "playing" || Math.max(absX, absY) < swipeThreshold) {
    return;
  }

  event.preventDefault();

  if (absX > absY) {
    changeDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
  } else {
    changeDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
  }
}

function resetBoardTouchTracking() {
  isTouchTracking = false;
  touchStartX = 0;
  touchStartY = 0;
}

function scheduleNextMove() {
  clearTimeout(moveTimer);

  if (gameState !== "playing") {
    return;
  }

  moveTimer = setTimeout(function () {
    stepGame();
    scheduleNextMove();
  }, getMoveDelay());
}

function stepGame() {
  const now = performance.now();
  removeExpiredObjects(now);

  currentDirection = nextDirection;

  const head = snake[0];
  let nextHead = {
    x: head.x + currentDirection.x,
    y: head.y + currentDirection.y
  };

  if (isOutsideBoard(nextHead)) {
    if (isCollisionShieldActive(now)) {
      nextHead = wrapCell(nextHead);
      spawnParticles(head, "yellow", 8);
    } else {
      handleFatalCollision("撞到边界，影子网格关闭。", now);
      return;
    }
  }

  const foodIndex = foods.findIndex(function (item) {
    return isSameCell(nextHead, item);
  });
  const willEatFood = foodIndex !== -1;
  const bodyToCheck = willEatFood ? snake : snake.slice(0, -1);

  if (!isCollisionShieldActive(now) && bodyToCheck.some(function (part) { return isSameCell(part, nextHead); })) {
    handleFatalCollision("撞到自己，路线被自己封住了。", now);
    return;
  }

  const shadowIndex = shadowObstacles.findIndex(function (shadow) {
    return isSameCell(shadow, nextHead);
  });

  if (shadowIndex !== -1) {
    if (isHasteInvincible(now)) {
      phaseThroughShadow(shadowIndex, nextHead);
    } else if (isCollisionShieldActive(now)) {
      spawnParticles(nextHead, "cyan", 5);
    } else {
      handleFatalCollision("撞到实体影子，过去的路线追上来了。", now);
      return;
    }
  }

  const willEatPowerUp = powerUp !== null && isSameCell(nextHead, powerUp);
  const collectedPowerUp = willEatPowerUp ? powerUp : null;
  snake.unshift(nextHead);

  if (activeEffect.type === "haste") {
    spawnParticles(nextHead, "yellow", 2);
  }

  emitSkinMovementParticles(nextHead);

  if (willEatFood) {
    handleFoodEaten(foodIndex, nextHead, now);

    if (snake.length > getMaxSnakeLength()) {
      const removedTail = snake.pop();

      if (removedTail) {
        addTrail(removedTail, now);
      }
    }
  } else {
    const removedTail = snake.pop();
    addTrail(removedTail, now);
  }

  if (collectedPowerUp !== null) {
    applyPowerUp(collectedPowerUp, nextHead, now);
    powerUp = null;
  }

  collectFoodsByMagnet(now);
  ensureFoodCount();
  recordRewindSnapshot(now);
  updateHud();
}

function handleFoodEaten(foodIndex, cell, now) {
  updateFoodCombo(now);

  const foodScore = getFoodScore(cell);
  const comboFeedback = getFoodFeedback(cell, foodScore);
  addScore(foodScore, cell, comboFeedback.text, comboFeedback.color);
  playFoodComboSound(comboCount);
  convertRecentTrailsToShadows(now);
  spawnParticles(cell, "red", 14);
  foods.splice(foodIndex, 1);
  ensureFoodCount();
  maybeSpawnPowerUp(now);
}

function getFoodScore(cell) {
  const baseScore = activeEffect.type === "prism" ? 20 : 10;
  return baseScore + getEdgeBonus(cell);
}

function getFoodFeedback(cell, foodScore) {
  const edgeRisk = getEdgeRisk(cell);

  if (edgeRisk === "high") {
    return {
      text: "+" + foodScore + " 高危边缘",
      color: "#fff6d6"
    };
  }

  if (edgeRisk === "medium") {
    return {
      text: "+" + foodScore + (activeEffect.type === "prism" ? " 棱彩边缘" : " 边缘"),
      color: activeEffect.type === "prism" ? "#ffffff" : "#ffd166"
    };
  }

  const comboFeedback = getComboFeedback();

  if (activeEffect.type === "prism" && comboCount === 1) {
    return {
      text: "+20",
      color: "#ffffff"
    };
  }

  return comboFeedback;
}

function updateFoodCombo(now) {
  if (lastFoodEatAt > 0 && now - lastFoodEatAt < comboTimeout) {
    comboCount = comboCount + 1;
  } else {
    comboCount = 1;
  }

  lastFoodEatAt = now;
}

function getComboFeedback() {
  if (comboCount >= 8) {
    return {
      text: "High Combo x" + comboCount + "!",
      color: "#fff6d6"
    };
  }

  if (comboCount >= 5) {
    return {
      text: "Combo x" + comboCount + "!",
      color: "#ffd166"
    };
  }

  if (comboCount >= 2) {
    return {
      text: "Combo x" + comboCount,
      color: "#ff9f43"
    };
  }

  return {
    text: "+10",
    color: "#ff315a"
  };
}

function addScore(points, cell, label, color) {
  score = score + points;
  addFloatingText(cell, label, color);
  grantRewindIfNeeded(cell);
  checkProgressTierUnlocks(cell);
}

function applyPowerUp(item, cell, now) {
  const config = powerUpTypes[item.type];

  if (!config) {
    return;
  }

  const powerScore = config.score + getEdgeBonus(cell);
  addScore(powerScore, cell, getPowerUpFeedback(item.type, powerScore, cell), config.color);
  spawnParticles(cell, config.particleType, 24);
  playSound("powerUp");

  if (item.type === "clear") {
    const clearedCount = clearSomeShadows(cell);
    spawnClearRipple(cell);
    setStatusOverride("清影释放，安全区展开", 1700);

    if (clearedCount >= 8) {
      addFloatingText(cell, "清除 x" + clearedCount, "#d7f5ff", 900);
    }
  }

  if (item.type === "haste") {
    activeEffect = {
      type: item.type,
      expiresAt: now + hasteDuration,
      invincibleUntil: now + invincibleDuration,
      warnedInvincibleEnding: false,
      warningMarks: {}
    };
  }

  if (item.type === "prism") {
    activeEffect = {
      type: item.type,
      expiresAt: now + prismDuration,
      invincibleUntil: 0,
      warnedInvincibleEnding: false,
      warningMarks: {}
    };
    addFloatingText(cell, "棱彩觉醒", "#ffffff", 1100);
    spawnParticles(cell, "prism", 40);
  }

  if (item.type === "magnet") {
    activeEffect = {
      type: item.type,
      expiresAt: now + magnetDuration,
      invincibleUntil: 0,
      warnedInvincibleEnding: false,
      warningMarks: {}
    };
    addFloatingText(cell, "磁铁启动", "#d8b4fe", 900);
    spawnParticles(cell, "magnet", 28);
  }

  if (item.type === "compress") {
    const minLength = 8;
    const targetLength = Math.max(minLength, Math.ceil(snake.length * 0.72));
    const removedCount = trimSnakeToLength(targetLength, false);

    if (removedCount > 0) {
      addFloatingText(cell, "凝核 -" + removedCount, "#fff6d6", 1100);
      spawnParticles(cell, "platinum", 34);
      setStatusOverride("凝核完成，蛇身缩短，活动空间扩大", 1900);
    } else {
      addFloatingText(cell, "凝核稳定", "#fff6d6", 900);
      setStatusOverride("蛇身已经足够紧凑", 1500);
    }
  }
}

function getPowerUpFeedback(type, points, cell) {
  const label = powerUpTypes[type].label;
  const edgeRisk = getEdgeRisk(cell);

  if (edgeRisk === "high") {
    return "+" + points + " 高危" + label;
  }

  if (edgeRisk === "medium") {
    return "+" + points + " 边缘" + label;
  }

  return "+" + points + " " + label;
}

function isHasteInvincible(now) {
  return activeEffect.type === "haste" && now < activeEffect.invincibleUntil;
}

function isCollisionShieldActive(now) {
  return isHasteInvincible(now) || now < evolveShield.expiresAt || now < rewindShield.expiresAt;
}

function emitSkinMovementParticles(cell) {
  const skin = getSnakeSkin();

  if (skin.mode === "gold" && Math.random() < 0.28) {
    spawnParticles(cell, "yellow", 1);
  } else if (skin.mode === "solar" && Math.random() < 0.36) {
    spawnParticles(cell, "orange", 1);
  } else if (skin.mode === "platinum" && Math.random() < 0.42) {
    spawnParticles(cell, "platinum", 1);
  }
}

function phaseThroughShadow(shadowIndex, cell) {
  const removedShadow = shadowObstacles.splice(shadowIndex, 1)[0];

  addScore(5, cell, "+5 穿影", "#ffd166");
  spawnParticles(removedShadow, "yellow", 16);
  playSound("phase");
}

function handleFatalCollision(reason, now) {
  if (rewindCharges > 0 && rewindSnapshots.length > 0) {
    triggerShadowRewind(now);
    return;
  }

  endGame(reason);
}

function recordRewindSnapshot(now) {
  rewindSnapshots.push({
    savedAt: now,
    snake: cloneData(snake),
    currentDirection: cloneData(currentDirection),
    nextDirection: cloneData(nextDirection),
    score: score,
    foods: cloneData(foods),
    trails: cloneData(trails),
    formingShadows: cloneData(formingShadows),
    shadowObstacles: cloneData(shadowObstacles),
    powerUp: cloneData(powerUp),
    activeEffect: cloneData(activeEffect),
    comboCount: comboCount,
    lastFoodEatAt: lastFoodEatAt
  });

  rewindSnapshots = rewindSnapshots.filter(function (snapshot) {
    return now - snapshot.savedAt <= rewindWindow;
  });
}

function triggerShadowRewind(now) {
  const targetTime = now - rewindTargetAge;
  let snapshot = rewindSnapshots[0];

  rewindSnapshots.forEach(function (candidate) {
    if (candidate.savedAt <= targetTime) {
      snapshot = candidate;
    }
  });

  const timeShift = now - snapshot.savedAt;

  snake = cloneData(snapshot.snake);
  currentDirection = cloneData(snapshot.currentDirection);
  nextDirection = cloneData(snapshot.nextDirection);
  foods = cloneData(snapshot.foods);
  trails = shiftTimedArray(cloneData(snapshot.trails), timeShift, ["bornAt"]);
  formingShadows = shiftTimedArray(cloneData(snapshot.formingShadows), timeShift, ["bornAt", "activatesAt"]);
  shadowObstacles = shiftTimedArray(cloneData(snapshot.shadowObstacles), timeShift, ["bornAt"]);
  powerUp = cloneData(snapshot.powerUp);
  activeEffect = cloneData(snapshot.activeEffect);
  comboCount = 0;
  lastFoodEatAt = 0;
  score = Math.max(0, snapshot.score - 30);
  rewindCharges = Math.max(0, rewindCharges - 1);
  rewindSnapshots = [];

  if (powerUp !== null) {
    powerUp.expiresAt = powerUp.expiresAt + timeShift;
  }

  if (activeEffect.type !== null) {
    activeEffect.expiresAt = activeEffect.expiresAt + timeShift;

    if (activeEffect.invincibleUntil > 0) {
      activeEffect.invincibleUntil = activeEffect.invincibleUntil + timeShift;
    }
  }

  clearShadowsAround(snake[0], 5);
  rewindShield = {
    expiresAt: now + rewindShieldDuration,
    warningMarks: {}
  };
  overlay.classList.add("is-hidden");
  gameState = "playing";
  addFloatingText(snake[0], "影子回溯", "#d7f5ff", 1200);
  spawnParticles(snake[0], "rewind", 38);
  playSound("rewind");
  setStatusOverride("已回到数秒前，影子暂时退散", 2200);
  ensureFoodCount();
  updateHud();
  flashRewindHud("use");
}

function clearShadowsAround(cell, radius) {
  formingShadows = formingShadows.filter(function (shadow) {
    return getManhattanDistance(shadow, cell) > radius;
  });

  shadowObstacles = shadowObstacles.filter(function (shadow) {
    return getManhattanDistance(shadow, cell) > radius;
  });
}

function shiftTimedArray(items, duration, keys) {
  return items.map(function (item) {
    keys.forEach(function (key) {
      if (typeof item[key] === "number") {
        item[key] = item[key] + duration;
      }
    });

    return item;
  });
}

function cloneData(value) {
  if (value === null || value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
}

function collectFoodsByMagnet(now) {
  if (activeEffect.type !== "magnet") {
    return;
  }

  const head = snake[0];
  let collectedCount = 0;

  while (collectedCount < 3) {
    const foodIndex = foods.findIndex(function (food) {
      return getManhattanDistance(food, head) <= magnetRange;
    });

    if (foodIndex === -1) {
      break;
    }

    const foodCell = {
      x: foods[foodIndex].x,
      y: foods[foodIndex].y
    };

    spawnParticles(foodCell, "magnet", 10);
    handleFoodEaten(foodIndex, foodCell, now);
    collectedCount = collectedCount + 1;
  }
}

function addTrail(cell, now) {
  trails.push({
    x: cell.x,
    y: cell.y,
    bornAt: now
  });
}

function trimSnakeToLength(targetLength, createTrails) {
  let removedCount = 0;
  const now = performance.now();

  while (snake.length > targetLength && snake.length > 4) {
    const removedTail = snake.pop();
    removedCount = removedCount + 1;

    if (createTrails && removedTail) {
      addTrail(removedTail, now);
    }
  }

  return removedCount;
}

function convertRecentTrailsToShadows(now) {
  const tier = getProgressTier();
  const snakeKeys = new Set(snake.map(getCellKey));
  const shadowKeys = new Set(shadowObstacles.map(getCellKey));
  const formingKeys = new Set(formingShadows.map(getCellKey));
  const foodKeys = new Set(foods.map(getCellKey));
  const powerUpKey = powerUp === null ? "" : getCellKey(powerUp);
  const selectedTrailKeys = new Set();
  let createdCount = 0;

  trails
    .slice()
    .sort(function (a, b) {
      return b.bornAt - a.bornAt;
    })
    .forEach(function (trail) {
    if (createdCount >= tier.maxShadowsPerFood) {
      return;
    }

    const isRecent = now - trail.bornAt <= tier.trailToShadowWindow;
    const key = getCellKey(trail);
    const canBecomeShadow =
      isRecent &&
      !snakeKeys.has(key) &&
      !shadowKeys.has(key) &&
      !formingKeys.has(key) &&
      !foodKeys.has(key) &&
      key !== powerUpKey;

    if (canBecomeShadow) {
      formingShadows.push({
        x: trail.x,
        y: trail.y,
        bornAt: now,
        activatesAt: now + formingShadowDuration,
        life: tier.shadowLife
      });
      formingKeys.add(key);
      selectedTrailKeys.add(key);
      createdCount = createdCount + 1;
    }
  });

  trails = trails.filter(function (trail) {
    return !selectedTrailKeys.has(getCellKey(trail));
  });

  if (createdCount > 0) {
    playSound("shadow");
    spawnParticles(snake[0], "purple", Math.min(18, createdCount + 6));
  }
}

function maybeSpawnPowerUp(now) {
  if (powerUp !== null || score < 20) {
    return;
  }

  const shouldSpawn = score % 40 === 0 || Math.random() < 0.28;

  if (shouldSpawn) {
    let types = Object.keys(powerUpTypes);

    if (score < 220) {
      types = types.filter(function (type) {
        return type !== "compress";
      });
    } else if (score < 520 && Math.random() < 0.45) {
      types = types.filter(function (type) {
        return type !== "compress";
      });
    }

    const type = types[Math.floor(Math.random() * types.length)];

    powerUp = getRandomEmptyCell();
    powerUp.type = type;
    powerUp.expiresAt = now + powerUpLife;
  }
}

function clearSomeShadows(cell) {
  const clearRadius = 6;
  const removed = [];

  formingShadows = formingShadows.filter(function (shadow) {
    if (getManhattanDistance(shadow, cell) <= clearRadius) {
      removed.push(shadow);
      return false;
    }

    return true;
  });

  shadowObstacles = shadowObstacles.filter(function (shadow) {
    if (getManhattanDistance(shadow, cell) <= clearRadius) {
      removed.push(shadow);
      return false;
    }

    return true;
  });

  const extraClearCount = shadowObstacles.length > 14
    ? Math.max(4, Math.ceil(shadowObstacles.length * 0.22))
    : 0;
  const sortedShadows = shadowObstacles
    .map(function (shadow, index) {
      return {
        shadow: shadow,
        index: index,
        distance: getManhattanDistance(shadow, cell)
      };
    })
    .sort(function (a, b) {
      return a.distance - b.distance;
    });

  const indexesToRemove = new Set(
    sortedShadows.slice(0, extraClearCount).map(function (item) {
      return item.index;
    })
  );

  shadowObstacles = shadowObstacles.filter(function (shadow, index) {
    if (indexesToRemove.has(index)) {
      removed.push(shadow);
      return false;
    }

    return true;
  });

  spawnParticles(cell, "blue", 22);

  removed.slice(0, 12).forEach(function (shadow) {
    spawnParticles(shadow, "blue", 3);
  });

  return removed.length;
}

function spawnClearRipple(cell) {
  for (let i = 0; i < 24; i = i + 1) {
    particles.push({
      x: getCellCenter(cell).x,
      y: getCellCenter(cell).y,
      dx: Math.cos((Math.PI * 2 / 24) * i) * 120,
      dy: Math.sin((Math.PI * 2 / 24) * i) * 120,
      size: 2.5,
      color: "#37b7ff",
      bornAt: performance.now(),
      life: 520
    });
  }
}

function endGame(reason) {
  gameState = "ended";
  clearTimeout(moveTimer);
  activeEffect = {
    type: null,
    expiresAt: 0,
    invincibleUntil: 0,
    warnedInvincibleEnding: false,
    warningMarks: {}
  };
  comboCount = 0;
  lastFoodEatAt = 0;
  playSound("death");

  if (score > bestScore) {
    bestScore = score;
    saveBestScore(bestScore);
  }

  updateHud();
  overlay.classList.remove("is-hidden");
  overlayKicker.textContent = "游戏结束";
  overlayTitle.textContent = "最终分数 " + score;
  overlayText.textContent = reason;
  startButton.textContent = "再玩一次";
  statusText.textContent = "本局结束";
}

function getMoveDelay() {
  const baseDelay = getTierBaseDelay(getProgressTier());

  if (activeEffect.type === "haste") {
    return Math.max(50, baseDelay * 0.72);
  }

  return baseDelay;
}

function getMaxSnakeLength() {
  if (score >= 1000) {
    return 42;
  }

  if (score >= 850) {
    return 40;
  }

  if (score >= 700) {
    return 38;
  }

  if (score >= 520) {
    return 36;
  }

  if (score >= 360) {
    return 34;
  }

  if (score >= 220) {
    return 32;
  }

  if (score >= 120) {
    return 28;
  }

  if (score >= 50) {
    return 24;
  }

  return 20;
}

function getTierBaseDelay(tier) {
  return Math.max(85, Math.round(startDelay * Math.pow(speedRatio, tier.tierIndex)));
}

function getSpeedLevel() {
  return getProgressTier().speedLevel;
}

function updateHud() {
  scoreText.textContent = score;
  bestScoreText.textContent = bestScore;
  speedText.textContent = getSpeedLevel();
  skinText.textContent = getSnakeSkin().name;
  updateComboText(performance.now());
  rewindText.textContent = rewindCharges + "/" + getMaxRewindCharges();
  updateEffectText(performance.now());
}

function getMaxRewindCharges() {
  if (score >= 1000) {
    return 3;
  }

  if (score >= 700) {
    return 2;
  }

  if (score >= 220) {
    return 1;
  }

  return 0;
}

function updateComboText(now) {
  comboText.textContent = "Combo x" + getVisibleComboCount(now);
}

function getVisibleComboCount(now) {
  if (comboCount > 0 && lastFoodEatAt > 0 && now - lastFoodEatAt < comboTimeout) {
    return comboCount;
  }

  return 0;
}

function updateEffectText(now) {
  if (activeEffect.type === "haste" && now < activeEffect.invincibleUntil) {
    const invincibleLeft = Math.max(0, (activeEffect.invincibleUntil - now) / 1000).toFixed(1);
    effectText.textContent = "超频无敌 " + invincibleLeft + "s";
    return;
  }

  if (now < rewindShield.expiresAt) {
    const shieldLeft = Math.max(0, (rewindShield.expiresAt - now) / 1000).toFixed(1);
    effectText.textContent = "回溯护盾 " + shieldLeft + "s";
    return;
  }

  if (now < evolveShield.expiresAt) {
    const shieldLeft = Math.max(0, (evolveShield.expiresAt - now) / 1000).toFixed(1);
    effectText.textContent = "进化护盾 " + shieldLeft + "s";
    return;
  }

  if (activeEffect.type === null) {
    effectText.textContent = "无";
    return;
  }

  const secondsLeft = Math.max(0, (activeEffect.expiresAt - now) / 1000).toFixed(1);
  let label = "棱彩加成";

  if (activeEffect.type === "haste") {
    label = "超频中";
  } else if (activeEffect.type === "magnet") {
    label = "磁铁吸附";
  }

  effectText.textContent = label + " " + secondsLeft + "s";
}

function getSnakeSkin() {
  if (activeEffect.type === "prism") {
    return {
      name: "棱彩觉醒",
      speedLevel: getProgressTier().speedLevel,
      head: "#ffffff",
      body: "#37ff8b",
      glow: "#ffffff",
      accent: "#ff7ad9",
      mode: "prism-awakened",
      particleType: "prism"
    };
  }

  return getProgressTier();
}

function getProgressTier() {
  for (let i = progressTiers.length - 1; i >= 0; i = i - 1) {
    if (score >= progressTiers[i].minScore) {
      return progressTiers[i];
    }
  }

  return progressTiers[0];
}

function checkProgressTierUnlocks(cell) {
  progressTiers.forEach(function (tier) {
    if (
      tier.minScore > 0 &&
      score >= tier.minScore &&
      !unlockedTierNames.has(tier.name)
    ) {
      const now = performance.now();
      const unlockMessage = getTierUnlockMessage(tier);

      unlockedTierNames.add(tier.name);
      addFloatingText(cell, unlockMessage.floatingText, "#ffffff", tier.minScore >= 1000 ? 1600 : 1300);
      setStatusOverride(unlockMessage.statusText, tier.minScore >= 1000 ? 2600 : 2000);
      headBoostUntil = now + 1100;
      evolveShield = {
        expiresAt: now + getTierEvolveShieldDuration(tier),
        color: tier.accent,
        warningMarks: {}
      };
      spawnParticles(cell, tier.particleType, getTierUnlockParticleCount(tier));
      playSound("unlock");
      compressSnakeForEvolution(tier, cell);
    }
  });
}

function getTierUnlockMessage(tier) {
  if (tier.minScore === 700) {
    return {
      floatingText: "阶段提升：黄金电弧",
      statusText: "黄金电弧启动，速度提升至 Lv.7"
    };
  }

  if (tier.minScore === 850) {
    return {
      floatingText: "阶段提升：橙白星焰",
      statusText: "星焰核心点燃，速度提升至 Lv.8"
    };
  }

  if (tier.minScore === 1000) {
    return {
      floatingText: "终局进化：白金终焉",
      statusText: "白金终焉觉醒，影子网格进入终局形态"
    };
  }

  return {
    floatingText: "阶段提升：" + tier.name,
    statusText: "速度提升至 " + tier.speedLevel
  };
}

function getTierEvolveShieldDuration(tier) {
  return tier.minScore >= 1000 ? 2400 : evolveShieldDuration;
}

function getTierUnlockParticleCount(tier) {
  if (tier.minScore >= 1000) {
    return 56;
  }

  if (tier.minScore >= 850) {
    return 48;
  }

  if (tier.minScore >= 700) {
    return 42;
  }

  return 34;
}

function getEvolutionTargetLength(tier) {
  if (tier.minScore >= 1000) {
    return 34;
  }

  if (tier.minScore >= 850) {
    return 33;
  }

  if (tier.minScore >= 700) {
    return 32;
  }

  if (tier.minScore >= 520) {
    return 31;
  }

  if (tier.minScore >= 360) {
    return 30;
  }

  if (tier.minScore >= 220) {
    return 28;
  }

  if (tier.minScore >= 120) {
    return 26;
  }

  if (tier.minScore >= 50) {
    return 22;
  }

  return snake.length;
}

function compressSnakeForEvolution(tier, cell) {
  const targetLength = getEvolutionTargetLength(tier);

  if (snake.length <= targetLength) {
    return;
  }

  const removedCount = trimSnakeToLength(targetLength, false);

  if (removedCount > 0) {
    addFloatingText(cell, "进化压缩 -" + removedCount, tier.accent || "#d7f5ff", 1100);
    spawnParticles(snake[0], tier.particleType || "cyan", Math.min(28, removedCount + 10));
    setStatusOverride("外观进化，蛇身结构压缩至更灵活状态", 1900);
  }
}

function grantRewindIfNeeded(cell) {
  rewindMilestones.forEach(function (milestone) {
    if (score < milestone || grantedRewindMilestones.has(milestone)) {
      return;
    }

    giveRewindCharge(cell);
    grantedRewindMilestones.add(milestone);
  });
}

function giveRewindCharge(cell) {
  const maxCharges = getMaxRewindCharges();

  if (maxCharges <= 0) {
    return false;
  }

  if (rewindCharges >= maxCharges) {
    updateHud();
    return false;
  }

  rewindCharges = rewindCharges + 1;
  addFloatingText(cell, "获得影子回溯", "#d7f5ff", 1200);
  spawnParticles(cell, "rewind", 34);
  playSound("rewind");
  setStatusOverride("影子回溯已充能", 1800);
  updateHud();
  flashRewindHud("gain");
  return true;
}

function flashHudElement(element, className, duration) {
  if (!element) {
    return;
  }

  const timers = hudFlashTimers.get(element) || {};

  if (timers[className]) {
    window.clearTimeout(timers[className]);
  }

  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  timers[className] = window.setTimeout(function () {
    element.classList.remove(className);
    delete timers[className];
  }, duration);
  hudFlashTimers.set(element, timers);
}

function flashRewindHud(type) {
  const card = rewindText ? (rewindText.closest(".stats div") || rewindText.parentElement || rewindText) : null;

  if (type === "gain") {
    flashHudElement(card, "hud-flash-rewind-gain", 1000);
    flashHudElement(rewindText, "hud-flash-rewind-number-gain", 1000);
  } else if (type === "use") {
    flashHudElement(card, "hud-flash-rewind-use", 1400);
    flashHudElement(rewindText, "hud-flash-rewind-number-use", 1400);
  }
}

function setStatusOverride(text, duration) {
  statusOverride = {
    text: text,
    until: performance.now() + duration
  };
}

function getRandomEmptyCell(options) {
  const settings = options || {};
  const avoidEdges = settings.avoidEdges || false;
  const edgeMargin = settings.edgeMargin || 3;

  for (let i = 0; i < 800; i = i + 1) {
    const cell = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };

    if (
      !isBlocked(cell) &&
      (!avoidEdges || getDistanceToEdge(cell) >= edgeMargin)
    ) {
      return cell;
    }
  }

  if (avoidEdges) {
    return getRandomEmptyCell({
      avoidEdges: false
    });
  }

  for (let y = 0; y < gridSize; y = y + 1) {
    for (let x = 0; x < gridSize; x = x + 1) {
      const cell = { x: x, y: y };

      if (!isBlocked(cell)) {
        return cell;
      }
    }
  }

  return { x: 0, y: 0 };
}

function getTargetFoodCount() {
  if (score >= 160) {
    return 3;
  }

  if (score >= 80) {
    return 2;
  }

  return 1;
}

function ensureFoodCount() {
  while (foods.length < getTargetFoodCount()) {
    foods.push(getRandomEmptyCell({
      avoidEdges: score < 50 || getProgressTier().speedLevel === "Lv.1",
      edgeMargin: 3
    }));
  }

  if (foods.length > getTargetFoodCount()) {
    foods = foods.slice(0, getTargetFoodCount());
  }
}

function getDistanceToEdge(cell) {
  return Math.min(cell.x, cell.y, gridSize - 1 - cell.x, gridSize - 1 - cell.y);
}

function getEdgeRisk(cell) {
  const distance = getDistanceToEdge(cell);

  if (distance === 0) {
    return "high";
  }

  if (distance === 1) {
    return "medium";
  }

  return "none";
}

function getEdgeBonus(cell) {
  const risk = getEdgeRisk(cell);

  if (risk === "high") {
    return 10;
  }

  if (risk === "medium") {
    return 5;
  }

  return 0;
}

function isBlocked(cell) {
  const inSnake = snake.some(function (part) { return isSameCell(part, cell); });
  const inShadow = shadowObstacles.some(function (shadow) { return isSameCell(shadow, cell); });
  const inFormingShadow = formingShadows.some(function (shadow) { return isSameCell(shadow, cell); });
  const onFood = foods.some(function (item) { return isSameCell(item, cell); });
  const onPowerUp = powerUp !== null && isSameCell(powerUp, cell);

  return inSnake || inShadow || inFormingShadow || onFood || onPowerUp;
}

function isSameCell(a, b) {
  return a !== null && b !== null && a.x === b.x && a.y === b.y;
}

function isOutsideBoard(cell) {
  return cell.x < 0 || cell.x >= gridSize || cell.y < 0 || cell.y >= gridSize;
}

function wrapCell(cell) {
  return {
    x: (cell.x + gridSize) % gridSize,
    y: (cell.y + gridSize) % gridSize
  };
}

function getCellKey(cell) {
  return cell.x + "," + cell.y;
}

function getManhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function removeExpiredObjects(now) {
  trails = trails.filter(function (trail) {
    return now - trail.bornAt < trailLife;
  });

  const activatedShadows = [];
  formingShadows = formingShadows.filter(function (shadow) {
    if (now >= shadow.activatesAt) {
      activatedShadows.push({
        x: shadow.x,
        y: shadow.y,
        bornAt: now,
        life: shadow.life
      });
      return false;
    }

    return true;
  });

  if (activatedShadows.length > 0) {
    shadowObstacles = shadowObstacles.concat(activatedShadows);
  }

  shadowObstacles = shadowObstacles.filter(function (shadow) {
    return now - shadow.bornAt < (shadow.life || getProgressTier().shadowLife);
  });

  particles = particles.filter(function (particle) {
    return now - particle.bornAt < particle.life;
  });

  floatingTexts = floatingTexts.filter(function (text) {
    return now - text.bornAt < text.life;
  });

  if (powerUp !== null && now > powerUp.expiresAt) {
    powerUp = null;
  }

  updateEffectEndingWarnings(now);

  if (activeEffect.type === "haste" && activeEffect.invincibleUntil > 0) {
    if (now >= activeEffect.invincibleUntil) {
      activeEffect.invincibleUntil = 0;
      playSound("shieldEnd");
    }
  }

  if (activeEffect.type !== null && now > activeEffect.expiresAt) {
    if (activeEffect.type === "magnet" || activeEffect.type === "prism" || activeEffect.type === "haste") {
      playSound("shieldEnd");
    }

    activeEffect = {
      type: null,
      expiresAt: 0,
      invincibleUntil: 0,
      warnedInvincibleEnding: false,
      warningMarks: {}
    };
  }
}

function updateEffectEndingWarnings(now) {
  if (activeEffect.type === "haste" || activeEffect.type === "prism" || activeEffect.type === "magnet") {
    playTimedWarnings(activeEffect.type, activeEffect.expiresAt, now, activeEffect.warningMarks);
  }

  if (evolveShield.expiresAt > now) {
    playShieldEndingCue(evolveShield.expiresAt, now, evolveShield.warningMarks);
  }

  if (rewindShield.expiresAt > now) {
    playShieldEndingCue(rewindShield.expiresAt, now, rewindShield.warningMarks);
  }
}

function playShieldEndingCue(expiresAt, now, marks) {
  if (!marks) {
    return;
  }

  const remaining = expiresAt - now;
  const key = "shield-end";

  if (remaining <= 360 && remaining > 220 && !marks[key]) {
    marks[key] = true;
    playSound("shield-end");
  }
}

function playTimedWarnings(effectType, expiresAt, now, marks) {
  if (!marks) {
    return;
  }

  const remaining = expiresAt - now;
  const checkpoints = [1500, 1000, 500];

  checkpoints.forEach(function (checkpoint) {
    const key = effectType + "-" + checkpoint;

    if (remaining <= checkpoint && remaining > checkpoint - 120 && !marks[key]) {
      marks[key] = true;
      playEffectEndingWarning(effectType, checkpoint);
    }
  });
}

function playEffectEndingWarning(effectType, level) {
  playSound("warning-countdown-" + level);
}

function drawFrame(now) {
  if (gameState !== "paused") {
    removeExpiredObjects(now);
  }

  const renderTime = gameState === "paused" && pausedAt > 0 ? pausedAt : now;

  drawBackground();
  drawTrails(renderTime);
  drawFormingShadows(renderTime);
  drawShadowObstacles(renderTime);
  drawFoods(renderTime);
  drawPowerUp(renderTime);
  drawActiveEffectFields(renderTime);
  drawSnake(renderTime);
  drawParticles(renderTime);
  drawFloatingTexts(renderTime);
  updateEffectText(renderTime);
  updateComboText(renderTime);

  if (gameState === "playing") {
    const powerText = getPowerUpStatusText(renderTime);
    const effectStatus = effectText.textContent === "无" ? "无当前效果" : effectText.textContent;
    const shadowText = "预警影子 " + formingShadows.length + " 个 · 实体影子 " + shadowObstacles.length + " 个";
    const comboStatus = "Combo x" + getVisibleComboCount(renderTime);

    if (statusOverride.until > renderTime) {
      statusText.textContent = statusOverride.text;
    } else {
      statusText.textContent = shadowText + " · " + powerText + " · " + effectStatus + " · " + comboStatus;
    }
  }

  requestAnimationFrame(drawFrame);
}

function drawBackground() {
  ctx.fillStyle = "#03050a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(111, 231, 255, 0.08)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= gridSize; i = i + 1) {
    const linePosition = i * cellSize;

    ctx.beginPath();
    ctx.moveTo(linePosition, 0);
    ctx.lineTo(linePosition, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, linePosition);
    ctx.lineTo(canvas.width, linePosition);
    ctx.stroke();
  }
}

function getPowerUpStatusText(now) {
  if (powerUp === null) {
    return "道具未出现";
  }

  const config = powerUpTypes[powerUp.type] || powerUpTypes.clear;
  const timeLeft = powerUp.expiresAt - now;

  if (timeLeft < 2000) {
    return config.label + "即将消失";
  }

  return config.label + "已出现";
}

function drawTrails(now) {
  trails.forEach(function (trail) {
    const age = now - trail.bornAt;
    const alpha = Math.max(0, 1 - age / trailLife);
    const color = getTrailColor(0.13 * alpha, trail, now);

    drawCell(trail, color, 6, 0);
  });
}

function drawFormingShadows(now) {
  formingShadows.forEach(function (shadow) {
    const progress = Math.min(1, (now - shadow.bornAt) / formingShadowDuration);
    const blink = 0.55 + Math.sin(now / 70) * 0.28;
    const x = shadow.x * cellSize + 5;
    const y = shadow.y * cellSize + 5;
    const size = cellSize - 10;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 116, 232, " + Math.max(0.25, blink) + ")";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 18 * progress;
    ctx.shadowColor = "#ff74e8";
    ctx.setLineDash([5, 5]);
    drawRoundedRect(x, y, size, size, 6);
    ctx.stroke();
    ctx.restore();
  });
}

function drawShadowObstacles(now) {
  shadowObstacles.forEach(function (shadow) {
    const age = now - shadow.bornAt;
    const life = shadow.life || getProgressTier().shadowLife;
    const timeLeft = life - age;
    const isFading = timeLeft < shadowFadeTime;
    const fadeAlpha = isFading ? Math.max(0, timeLeft / shadowFadeTime) : 1;
    const blink = isFading ? 0.78 + Math.sin(now / 90) * 0.18 : 1;
    const visualAlpha = 0.75 * fadeAlpha * blink;
    const visualGlow = 18 * fadeAlpha * blink;

    // 临近消失时只做视觉闪烁，不改变影子障碍的碰撞逻辑。
    drawCell(shadow, "rgba(180, 92, 255, " + visualAlpha + ")", 4, visualGlow, "#b45cff");
  });
}

function drawFoods(now) {
  foods.forEach(function (food) {
    drawFoodIcon(food, now);
  });
}

function drawPowerUp(now) {
  if (powerUp === null) {
    return;
  }

  const config = powerUpTypes[powerUp.type] || powerUpTypes.clear;
  const timeLeft = powerUp.expiresAt - now;
  const blinkAlpha = timeLeft < 2000 ? 0.55 + Math.sin(now / 70) * 0.35 : 1;

  ctx.save();
  ctx.globalAlpha = blinkAlpha;

  if (getEdgeRisk(powerUp) !== "none") {
    const center = getCellCenter(powerUp);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 18;
    ctx.shadowColor = config.color;
    ctx.beginPath();
    ctx.arc(center.x, center.y, cellSize * 0.48 + Math.sin(now / 100) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (powerUp.type === "clear") {
    drawClearIcon(powerUp, now);
  } else if (powerUp.type === "haste") {
    drawHasteIcon(powerUp, now);
  } else if (powerUp.type === "prism") {
    drawPrismIcon(powerUp, now);
  } else if (powerUp.type === "magnet") {
    drawMagnetIcon(powerUp, now);
  } else if (powerUp.type === "compress") {
    drawCompressIcon(powerUp, now);
  } else {
    drawPowerCore(powerUp, config.color, now);
  }

  ctx.restore();
}

function drawFoodIcon(cell, now) {
  const center = getCellCenter(cell);
  const size = cellSize * 0.34 + Math.sin(now / 120 + cell.x * 0.2) * 2;
  const edgeRisk = getEdgeRisk(cell);

  ctx.save();
  ctx.translate(center.x, center.y);

  if (edgeRisk !== "none") {
    const ringAlpha = edgeRisk === "high" ? 0.78 : 0.46;
    ctx.strokeStyle = "rgba(255, 214, 223, " + (ringAlpha + Math.sin(now / 90) * 0.12) + ")";
    ctx.lineWidth = edgeRisk === "high" ? 3 : 2;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ff315a";
    ctx.beginPath();
    ctx.arc(0, 0, cellSize * 0.48, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.rotate(Math.PI / 4);
  ctx.shadowBlur = 22;
  ctx.shadowColor = "#ff315a";
  ctx.fillStyle = "#ff315a";
  drawRoundedRect(-size, -size, size * 2, size * 2, 5);
  ctx.fill();
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = "#ffd6df";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawClearIcon(cell, now) {
  const center = getCellCenter(cell);
  const pulse = Math.sin(now / 150) * 1.5;

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.strokeStyle = "rgba(215, 245, 255, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 19 + pulse, 0, Math.PI * 2);
  ctx.stroke();

  ctx.rotate(-0.25);
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#37b7ff";
  ctx.fillStyle = "#37b7ff";
  drawRoundedRect(-12 - pulse, -9, 24 + pulse * 2, 18, 5);
  ctx.fill();
  ctx.fillStyle = "#d7f5ff";
  drawRoundedRect(-5, -9, 15, 18, 4);
  ctx.fill();
  ctx.strokeStyle = "#031722";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-13, 11);
  ctx.lineTo(14, 11);
  ctx.moveTo(-17, 15);
  ctx.lineTo(6, 15);
  ctx.stroke();
  ctx.restore();
}

function drawHasteIcon(cell, now) {
  const center = getCellCenter(cell);
  const scale = 1 + Math.sin(now / 120) * 0.08;

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.scale(scale, scale);
  ctx.shadowBlur = 24;
  ctx.shadowColor = "#ffd166";
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.moveTo(-2, -17);
  ctx.lineTo(12, -4);
  ctx.lineTo(4, -4);
  ctx.lineTo(13, 17);
  ctx.lineTo(-12, 1);
  ctx.lineTo(-3, 1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPrismIcon(cell, now) {
  const center = getCellCenter(cell);
  const radius = cellSize * 0.38 + Math.sin(now / 130) * 1.5;
  const colors = ["#37ff8b", "#37b7ff", "#b45cff", "#ff7ad9", "#ffd166", "#ffffff"];

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(now / 650);
  ctx.shadowBlur = 24;
  ctx.shadowColor = "#ff7ad9";

  for (let i = 0; i < 6; i = i + 1) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, (Math.PI * 2 / 6) * i, (Math.PI * 2 / 6) * (i + 1));
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i = i + 1) {
    const angle = (Math.PI * 2 / 6) * i;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawMagnetIcon(cell, now) {
  const center = getCellCenter(cell);
  const pulse = 1 + Math.sin(now / 140) * 0.08;

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.scale(pulse, pulse);
  ctx.shadowBlur = 22;
  ctx.shadowColor = "#b45cff";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#37b7ff";
  ctx.beginPath();
  ctx.arc(0, 1, 13, Math.PI * 0.08, Math.PI * 0.92);
  ctx.stroke();

  ctx.fillStyle = "#ff315a";
  ctx.fillRect(-14, -6, 8, 8);
  ctx.fillStyle = "#37b7ff";
  ctx.fillRect(6, -6, 8, 8);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 1, 20, Math.PI * 0.18, Math.PI * 0.82);
  ctx.stroke();
  ctx.restore();
}

function drawCompressIcon(cell, now) {
  const center = getCellCenter(cell);
  const pulse = Math.sin(now / 140) * 1.3;

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.shadowBlur = 22;
  ctx.shadowColor = "#fff6d6";
  ctx.strokeStyle = "rgba(255, 246, 214, 0.86)";
  ctx.lineWidth = 2;

  for (let i = 0; i < 3; i = i + 1) {
    const radius = 18 - i * 5 - pulse * (i + 1) * 0.35;

    ctx.beginPath();
    ctx.arc(0, 0, radius, now / 420 + i, now / 420 + i + Math.PI * 1.42);
    ctx.stroke();
  }

  ctx.fillStyle = "#fff6d6";
  ctx.beginPath();
  ctx.arc(0, 0, 5 + Math.sin(now / 180) * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 209, 102, 0.72)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 10 + pulse * 0.25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawPowerCore(cell, color, now) {
  const center = getCellCenter(cell);
  const size = cellSize * 0.34 + Math.sin(now / 150) * 2;

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(Math.PI / 4);
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  drawRoundedRect(-size, -size, size * 2, size * 2, 5);
  ctx.fill();
  ctx.restore();
}

function drawActiveEffectFields(now) {
  if (activeEffect.type !== "magnet" || snake.length === 0) {
    return;
  }

  const center = getCellCenter(snake[0]);
  const radius = magnetRange * cellSize + Math.sin(now / 180) * 2;
  const alpha = 0.12 + Math.sin(now / 220) * 0.02;

  ctx.save();
  ctx.strokeStyle = "rgba(180, 92, 255, " + alpha + ")";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 3;
  ctx.shadowColor = "#b45cff";
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSnake(now) {
  const skin = getSnakeSkin();
  const hasHeadBoost = now < headBoostUntil;

  for (let i = snake.length - 1; i >= 0; i = i - 1) {
    const part = snake[i];
    const isHead = i === 0;
    const color = getSnakePartColor(skin, i, isHead, now);
    const inset = isHead ? 3 : 4;
    const glow = isHead ? (hasHeadBoost ? 42 : 26) : getSnakeBodyGlow(skin);

    drawCell(part, color, inset, glow, skin.glow);

    if (isHead && (skin.mode === "gold" || skin.mode === "solar" || skin.mode === "platinum")) {
      drawHeadHalo(part, skin, now);
    }

    if ((skin.mode === "electric" || skin.mode === "prism" || skin.mode === "prism-awakened" || skin.mode === "gold") && !isHead && i % 3 === 0) {
      drawElectricMark(part, skin.accent);
    }

    if (skin.mode === "prism-awakened" && !isHead && i % 2 === 0) {
      drawPrismFacet(part, now, i);
    }

    if (skin.mode === "solar" && !isHead && i % 2 === 0) {
      drawSolarSpark(part, now, i);
    }

    if (skin.mode === "platinum" && !isHead && i % 2 === 0) {
      drawPlatinumFacet(part, now, i);
    }

    if (isHead && isHasteInvincible(now)) {
      drawInvincibleShield(part, now, "#ffd166", "#fff5d2", activeEffect.invincibleUntil);
    } else if (isHead && now < rewindShield.expiresAt) {
      drawInvincibleShield(part, now, "#b45cff", "#d7f5ff", rewindShield.expiresAt);
    } else if (isHead && now < evolveShield.expiresAt) {
      drawInvincibleShield(part, now, evolveShield.color, "#ffffff", evolveShield.expiresAt);
    }
  }
}

function drawInvincibleShield(cell, now, glowColor, strokeColor, expiresAt) {
  const center = getCellCenter(cell);
  const timeLeft = expiresAt - now;
  const pulse = Math.sin(now / 95) * 3;
  const blink = timeLeft < 1000 ? 0.45 + Math.sin(now / 45) * 0.42 : 0.88;

  ctx.save();
  ctx.strokeStyle = hexToRgba(strokeColor, blink);
  ctx.lineWidth = 4;
  ctx.shadowBlur = 34;
  ctx.shadowColor = glowColor;
  ctx.beginPath();
  ctx.arc(center.x, center.y, cellSize * 0.72 + pulse, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = hexToRgba(glowColor, Math.max(0.2, blink - 0.15));
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center.x, center.y, cellSize * 0.92 + pulse * 0.8, now / 180, now / 180 + Math.PI * 1.35);
  ctx.stroke();
  ctx.restore();
}

function getSnakePartColor(skin, index, isHead, now) {
  if (isHead) {
    return skin.head;
  }

  if (skin.mode === "prism-awakened") {
    const colors = ["#37ff8b", "#37b7ff", "#b45cff", "#ff7ad9", "#ffd166", "#ffffff"];
    const offset = Math.floor(now / 110) % colors.length;
    return colors[(index + offset) % colors.length];
  }

  if (skin.mode === "gradient") {
    return index % 2 === 0 ? "#37ff8b" : "#b45cff";
  }

  if (skin.mode === "pink") {
    return index % 2 === 0 ? "#ff7ad9" : "#ffc3e6";
  }

  if (skin.mode === "phantom") {
    return index % 2 === 0 ? "#b45cff" : "#ff7ad9";
  }

  if (skin.mode === "gold") {
    return index % 2 === 0 ? "#ffd166" : "#fff0a8";
  }

  if (skin.mode === "solar") {
    const colors = ["#ff9f1c", "#fff3b0", "#ff6b35"];
    return colors[index % colors.length];
  }

  if (skin.mode === "platinum") {
    const colors = ["#ffffff", "#fff6d6", "#ffd166", "#e8fbff", "#ffedf9"];
    return colors[index % colors.length];
  }

  if (skin.mode === "prism") {
    const colors = ["#37ff8b", "#37b7ff", "#b45cff", "#ff7ad9", "#ffd166"];
    return colors[index % colors.length];
  }

  return skin.body;
}

function getSnakeBodyGlow(skin) {
  if (skin.mode === "prism-awakened") {
    return 28;
  }

  if (skin.mode === "platinum") {
    return 30;
  }

  if (skin.mode === "solar") {
    return 27;
  }

  if (skin.mode === "gold") {
    return 24;
  }

  if (skin.mode === "prism") {
    return 22;
  }

  if (skin.mode === "phantom") {
    return 24;
  }

  if (skin.mode === "pink") {
    return 18;
  }

  if (skin.mode === "electric" || skin.mode === "gradient") {
    return 16;
  }

  return 11;
}

function drawPrismFacet(cell, now, index) {
  const x = cell.x * cellSize;
  const y = cell.y * cellSize;
  const alpha = 0.45 + Math.sin(now / 130 + index) * 0.22;

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, " + alpha + ")";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + cellSize * 0.28, y + cellSize * 0.24);
  ctx.lineTo(x + cellSize * 0.72, y + cellSize * 0.5);
  ctx.lineTo(x + cellSize * 0.34, y + cellSize * 0.78);
  ctx.stroke();
  ctx.restore();
}

function drawElectricMark(cell, color) {
  const x = cell.x * cellSize;
  const y = cell.y * cellSize;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.moveTo(x + cellSize * 0.28, y + cellSize * 0.42);
  ctx.lineTo(x + cellSize * 0.5, y + cellSize * 0.28);
  ctx.lineTo(x + cellSize * 0.44, y + cellSize * 0.6);
  ctx.lineTo(x + cellSize * 0.7, y + cellSize * 0.48);
  ctx.stroke();
  ctx.restore();
}

function drawHeadHalo(cell, skin, now) {
  const center = getCellCenter(cell);
  const pulse = Math.sin(now / 180) * 1.4;
  let strokeColor = "rgba(255, 209, 102, 0.72)";
  let glowColor = skin.glow;
  let radius = cellSize * 0.6 + pulse;

  if (skin.mode === "solar") {
    strokeColor = "rgba(255, 243, 176, 0.78)";
    glowColor = "#ff6b35";
    radius = cellSize * 0.64 + pulse;
  } else if (skin.mode === "platinum") {
    strokeColor = "rgba(255, 246, 214, 0.86)";
    glowColor = "#ffffff";
    radius = cellSize * 0.68 + pulse;
  }

  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = skin.mode === "platinum" ? 2 : 1.5;
  ctx.shadowBlur = skin.mode === "platinum" ? 20 : 14;
  ctx.shadowColor = glowColor;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, now / 520, now / 520 + Math.PI * 1.55);
  ctx.stroke();

  if (skin.mode === "platinum") {
    ctx.strokeStyle = "rgba(55, 183, 255, 0.34)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(center.x, center.y, cellSize * 0.48, now / 360, now / 360 + Math.PI * 0.72);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSolarSpark(cell, now, index) {
  const center = getCellCenter(cell);
  const alpha = 0.45 + Math.sin(now / 110 + index) * 0.18;
  const size = cellSize * 0.16;

  ctx.save();
  ctx.strokeStyle = "rgba(255, 243, 176, " + alpha + ")";
  ctx.lineWidth = 1.4;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#ff9f1c";
  ctx.beginPath();
  ctx.moveTo(center.x - size, center.y);
  ctx.lineTo(center.x + size, center.y);
  ctx.moveTo(center.x, center.y - size);
  ctx.lineTo(center.x, center.y + size);
  ctx.stroke();
  ctx.restore();
}

function drawPlatinumFacet(cell, now, index) {
  const x = cell.x * cellSize;
  const y = cell.y * cellSize;
  const colors = ["#ffffff", "#ffd166", "#37b7ff", "#ff7ad9"];
  const color = colors[index % colors.length];
  const alpha = color === "#ffffff" || color === "#ffd166" ? 0.62 : 0.32;

  ctx.save();
  ctx.strokeStyle = hexToRgba(color, alpha);
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = color === "#ffd166" ? 10 : 6;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.moveTo(x + cellSize * 0.24, y + cellSize * 0.3);
  ctx.lineTo(x + cellSize * 0.78, y + cellSize * 0.34);
  ctx.lineTo(x + cellSize * 0.52, y + cellSize * 0.76);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawParticles(now) {
  particles.forEach(function (particle) {
    const progress = (now - particle.bornAt) / particle.life;
    const alpha = Math.max(0, 1 - progress);
    const x = particle.x + particle.dx * progress;
    const y = particle.y + particle.dy * progress;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = particle.color;
    ctx.beginPath();
    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function addFloatingText(cell, text, color, life) {
  const center = getCellCenter(cell);

  floatingTexts.push({
    x: center.x,
    y: center.y - 8,
    text: text,
    color: color,
    bornAt: performance.now(),
    life: life || 760
  });
}

function drawFloatingTexts(now) {
  floatingTexts.forEach(function (text) {
    const progress = (now - text.bornAt) / text.life;
    const alpha = Math.max(0, 1 - progress);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = text.color;
    ctx.shadowBlur = 14;
    ctx.shadowColor = text.color;
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.text, text.x, text.y - progress * 32);
    ctx.restore();
  });
}

function drawCell(cell, color, inset, shadowBlur, shadowColor) {
  const x = cell.x * cellSize + inset;
  const y = cell.y * cellSize + inset;
  const size = cellSize - inset * 2;

  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowColor = shadowColor || color;
  drawRoundedRect(x, y, size, size, 6);
  ctx.fill();
  ctx.restore();
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const fullHex = normalized.length === 3
    ? normalized.split("").map(function (item) { return item + item; }).join("")
    : normalized;
  const value = parseInt(fullHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function getTrailColor(alpha, trail, now) {
  const skin = getSnakeSkin();
  const colorByMode = {
    default: "#37ff8b",
    ice: "#8bdcff",
    electric: "#36f7c9",
    pink: "#ff7ad9",
    phantom: "#b45cff",
    prism: "#ff7ad9",
    "prism-awakened": "#ffffff",
    gold: "#ffd166",
    solar: "#ff9f1c",
    platinum: "#fff6d6"
  };
  let sourceColor = colorByMode[skin.mode] || skin.body || skin.glow || "#37ff8b";

  if (skin.mode === "prism" || skin.mode === "prism-awakened") {
    const prismColors = ["#ffffff", "#37b7ff", "#ff7ad9", "#ffd166", "#37ff8b"];
    const index = Math.abs((trail.x + trail.y + Math.floor(now / 220)) % prismColors.length);
    sourceColor = prismColors[index];
  }

  if (skin.mode === "platinum") {
    const platinumColors = ["#ffffff", "#fff6d6", "#ffd166"];
    const index = Math.abs((trail.x + trail.y + Math.floor(now / 300)) % platinumColors.length);
    sourceColor = platinumColors[index];
  }

  const rgb = hexToRgb(sourceColor);

  return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
}

function hexToRgba(hex, alpha) {
  const rgb = hexToRgb(hex);

  return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
}

function getCellCenter(cell) {
  return {
    x: cell.x * cellSize + cellSize / 2,
    y: cell.y * cellSize + cellSize / 2
  };
}

function spawnParticles(cell, type, count) {
  const center = getCellCenter(cell);
  const colorMap = {
    green: "#37ff8b",
    red: "#ff315a",
    purple: "#b45cff",
    blue: "#37b7ff",
    yellow: "#ffd166",
    cyan: "#4deeea",
    pink: "#ff7ad9",
    magnet: "#b45cff",
    rewind: "#8fd3ff",
    orange: ["#ff9f1c", "#ff6b35", "#fff3b0"],
    platinum: ["#ffffff", "#fff6d6", "#ffd166", "#ffffff", "#fff6d6", "#37b7ff", "#ff7ad9"],
    prism: ["#37ff8b", "#37b7ff", "#b45cff", "#ff7ad9", "#ffd166"]
  };

  for (let i = 0; i < count; i = i + 1) {
    const colorValue = colorMap[type] || colorMap.green;
    const particleColor = Array.isArray(colorValue)
      ? colorValue[i % colorValue.length]
      : colorValue;

    particles.push({
      x: center.x,
      y: center.y,
      dx: Math.random() * 90 - 45,
      dy: Math.random() * 90 - 45,
      size: Math.random() * 3 + 2,
      color: particleColor,
      bornAt: performance.now(),
      life: Math.random() * 260 + 360
    });
  }

  if (particles.length > 180) {
    particles = particles.slice(particles.length - 180);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  updateSoundButton();

  if (soundEnabled && hasStartedOnce) {
    ensureAudioReady();
    playSound("ui");
  }
}

function updateSoundButton() {
  soundButton.textContent = soundEnabled ? "音效：开" : "音效：关";
}

function showGuideDetail() {
  if (!guideSummary || !guideDetailPanel) {
    return;
  }

  guideSummary.classList.add("is-hidden");
  guideDetailPanel.classList.remove("is-hidden");

  if (guideTitle) {
    guideTitle.textContent = "详细机制";
  }

  if (guideDetailButton) {
    guideDetailButton.classList.add("is-hidden");
  }

  playSound("ui");
}

function showGuideSummary() {
  if (!guideSummary || !guideDetailPanel) {
    return;
  }

  guideDetailPanel.classList.add("is-hidden");
  guideSummary.classList.remove("is-hidden");

  if (guideTitle) {
    guideTitle.textContent = "玩法说明";
  }

  if (guideDetailButton) {
    guideDetailButton.classList.remove("is-hidden");
  }

  playSound("ui");
}

function ensureAudioReady() {
  if (!soundEnabled || audioContext !== null) {
    return;
  }

  const AudioConstructor = window.AudioContext || window.webkitAudioContext;

  if (!AudioConstructor) {
    return;
  }

  try {
    audioContext = new AudioConstructor();
  } catch (error) {
    audioContext = null;
  }
}

function playSound(type) {
  if (!soundEnabled) {
    return;
  }

  ensureAudioReady();

  if (audioContext === null) {
    return;
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(function () {});
  }

  const now = audioContext.currentTime;

  if (type === "food") {
    playTone(720, 0.09, "sine", 0.045, now);
    playTone(1080, 0.08, "triangle", 0.028, now + 0.045);
  } else if (type === "clear") {
    playTone(520, 0.11, "triangle", 0.04, now);
    playTone(760, 0.12, "sine", 0.035, now + 0.05);
  } else if (type === "haste") {
    playTone(880, 0.08, "square", 0.026, now);
    playTone(1320, 0.1, "triangle", 0.036, now + 0.045);
  } else if (type === "prism") {
    playTone(660, 0.09, "triangle", 0.036, now);
    playTone(990, 0.1, "sine", 0.034, now + 0.06);
    playTone(1480, 0.14, "triangle", 0.028, now + 0.13);
  } else if (type === "magnet") {
    playTone(620, 0.08, "square", 0.026, now);
    playTone(420, 0.12, "triangle", 0.028, now + 0.05);
  } else if (type === "rewind") {
    playTone(980, 0.08, "triangle", 0.034, now);
    playTone(640, 0.12, "sine", 0.032, now + 0.07);
    playTone(420, 0.16, "triangle", 0.026, now + 0.16);
  } else if (type === "shadow") {
    playTone(130, 0.2, "sawtooth", 0.035, now);
    playTone(92, 0.18, "triangle", 0.025, now + 0.05);
  } else if (type === "death") {
    playTone(260, 0.18, "sawtooth", 0.05, now);
    playTone(150, 0.26, "sawtooth", 0.045, now + 0.12);
  } else if (type === "phase") {
    playTone(760, 0.08, "triangle", 0.04, now);
    playTone(1180, 0.1, "sine", 0.026, now + 0.04);
  } else if (type === "shield-end") {
    playTone(620, 0.16, "triangle", 0.014, now, 420);
    playTone(1080, 0.18, "sine", 0.007, now + 0.018, 760);
  } else if (type === "shieldEnd") {
    playTone(440, 0.08, "sine", 0.022, now);
  } else if (type === "pause") {
    playTone(360, 0.07, "sine", 0.025, now);
  } else if (type === "resume" || type === "ui") {
    playTone(540, 0.06, "sine", 0.025, now);
    playTone(720, 0.07, "sine", 0.02, now + 0.04);
  } else if (type === "unlock") {
    playTone(420, 0.62, "triangle", 0.034, now, 980);
    playTone(760, 0.58, "sine", 0.026, now + 0.015, 1760);
    playTone(1880, 0.32, "sine", 0.008, now + 0.06, 2880);
  } else if (type === "powerUp") {
    playTone(640, 0.11, "triangle", 0.032, now);
    playTone(960, 0.13, "sine", 0.024, now + 0.035);
  } else if (type === "warning-countdown-1500") {
    playTone(820, 0.075, "sine", 0.02, now);
  } else if (type === "warning-countdown-1000") {
    playTone(1040, 0.08, "sine", 0.024, now);
  } else if (type === "warning-countdown-500") {
    playTone(1320, 0.09, "triangle", 0.028, now);
  } else if (type === "warning-haste" || type === "warning-hasteShield") {
    playTone(920, 0.04, "square", 0.018, now);
    playTone(700, 0.05, "square", 0.016, now + 0.045);
  } else if (type === "warning-soft" || type === "warning-prism") {
    playTone(1040, 0.08, "sine", 0.02, now);
  } else if (type === "warning-magnet") {
    playTone(520, 0.05, "square", 0.015, now);
    playTone(360, 0.06, "triangle", 0.014, now + 0.05);
  } else if (type === "warning-evolveShield" || type === "warning-rewindShield") {
    playTone(620, 0.05, "sine", 0.014, now);
  }
}

function playFoodComboSound(combo) {
  if (!soundEnabled) {
    return;
  }

  ensureAudioReady();

  if (audioContext === null) {
    return;
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(function () {});
  }

  const cappedCombo = Math.min(combo - 1, 12);
  const loopLift = combo > 12 ? (combo % 4) * 18 : 0;
  const mainFreq = 520 * Math.pow(1.07, cappedCombo) + loopLift;
  const now = audioContext.currentTime;

  playTone(mainFreq, 0.08, "sine", 0.042, now);
  playTone(mainFreq * 1.5, 0.07, "triangle", 0.026, now + 0.045);
}

function playTone(frequency, duration, waveType, volume, startTime, endFrequency) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const endTime = startTime + duration;

  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, endTime);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

function loadBestScore() {
  try {
    const savedScore = Number(localStorage.getItem(bestScoreKey));

    if (Number.isFinite(savedScore)) {
      return savedScore;
    }
  } catch (error) {
    return 0;
  }

  return 0;
}

function saveBestScore(value) {
  try {
    localStorage.setItem(bestScoreKey, String(value));
  } catch (error) {
    // 本地存储不可用时，最高分只在当前页面里显示。
  }
}

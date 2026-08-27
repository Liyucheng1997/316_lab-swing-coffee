/* ================= 饮品数据（配色对应设计稿分层） ================= */
const DRINKS = [
  {
    id: "vanilla", name: "Vanilla silk", zh: "香草丝绒拿铁", type: "layered",
    milk: ["#f3e9d9", "#e4d0b2"], top: ["#7a4a2a", "#5a341b"],
    crema: "#c99a5f", specks: "#4a2c15",
  },
  {
    id: "choco", name: "Choco chips", zh: "巧克力碎冰沙", type: "blended",
    body: ["#4a2c18", "#2a1609"], drizzle: "#1d0d04",
    cream: "#fbf3e6", chip: "#4a2517",
  },
  {
    id: "caramel", name: "Caramel cloud", zh: "焦糖云朵玛奇朵", type: "layered",
    milk: ["#f2e4cc", "#e6d0ab"], top: ["#8a5427", "#6f4023"],
    crema: "#d8b183", drizzle: "#b06f2e",
  },
  {
    id: "matcha", name: "Matcha mist", zh: "抹茶轻雾拿铁", type: "layered",
    milk: ["#f4efe2", "#e9e0cb"], top: ["#7e9c50", "#93b164"],
    crema: null, powder: "#5c7a3a",
  },
];

/* ================= DOM ================= */
const $ = (id) => document.getElementById(id);
const sheet = $("sheet"), carousel = $("carousel"), drinkName = $("drinkName");
const spinBtn = $("spinBtn"), pillBtn = $("pillBtn");
const liquidLayers = $("liquidLayers");
const milkPath = $("milkPath"), topPath = $("topPath"), blendRect = $("blendRect"), cremaPath = $("cremaPath");
const milkStopA = $("milkStopA"), milkStopB = $("milkStopB");
const topStopA = $("topStopA"), topStopB = $("topStopB");
const blendStopA = $("blendStopA"), blendStopB = $("blendStopB");
const decoG = $("deco"), tendrilsG = $("tendrils"), bubblesG = $("bubbles"), iceG = $("ice");
const creamG = $("creamG"), chipsG = $("chipsG");
const flatLid = $("flatLid"), domeLid = $("domeLid");
const streamGroup = $("streamGroup"), streamRect = $("stream"), streamSheen = $("streamSheen");
const splashG = $("splash");

/* ================= 杯子几何 ================= */
const GEO = {
  xL: 53, xR: 247, xC: 150,
  yBottom: 424,          // 内壁底
  MILK_TARGET: 200,      // 注奶后的奶面
  SURF_FINAL: 146,       // 注入浓缩后的总液面
  CREMA_H: 9,
  BLEND_FINAL: 64,
};

/* ================= 选择卡片（设计稿同款插画） ================= */
function cardSVG(d) {
  const p = `cd-${d.id}`;
  const cupClip = `<clipPath id="${p}-cup"><path d="M38 62 L50 232 Q51 240 60 240 L110 240 Q119 240 120 232 L132 62 Z"/></clipPath>`;
  const wall = `
    <path d="M35 58 L48 234 Q49 243 59 243 L111 243 Q121 243 122 234 L135 58 Z" fill="rgba(255,255,255,.10)" stroke="rgba(70,50,35,.30)" stroke-width="2"/>
    <path d="M44 76 L54 218" stroke="rgba(255,255,255,.5)" stroke-width="4" stroke-linecap="round"/>
    <path d="M126 76 L118 208" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-linecap="round"/>`;
  const rim = `<rect x="30" y="52" width="110" height="10" rx="5" fill="rgba(252,249,243,.9)" stroke="rgba(70,50,35,.25)" stroke-width="1.5"/>`;
  const flat = `
    <path d="M33 52 L41 37 Q42 33 47 33 L123 33 Q128 33 129 37 L137 52 Z" fill="rgba(250,246,238,.95)" stroke="rgba(70,50,35,.25)" stroke-width="1.5"/>
    <ellipse cx="85" cy="41" rx="10" ry="3" fill="rgba(70,50,35,.18)"/>`;
  const ice = `
    <g fill="rgba(255,255,255,.30)" stroke="rgba(255,255,255,.85)" stroke-width="1.5">
      <rect x="50" y="76" width="30" height="30" rx="7" transform="rotate(-12 65 91)"/>
      <rect x="90" y="70" width="26" height="26" rx="6" transform="rotate(14 103 83)"/>
      <rect x="72" y="106" width="24" height="24" rx="6" transform="rotate(38 84 118)"/>
    </g>`;

  if (d.type === "blended") {
    return `<svg viewBox="0 0 170 260" xmlns="http://www.w3.org/2000/svg">
      <defs>${cupClip}
        <linearGradient id="${p}-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d.body[0]}"/><stop offset="1" stop-color="${d.body[1]}"/></linearGradient>
      </defs>
      <ellipse cx="85" cy="250" rx="58" ry="7" fill="rgba(90,70,50,.22)"/>
      <g clip-path="url(#${p}-cup)">
        <rect x="30" y="64" width="110" height="180" fill="url(#${p}-body)"/>
        <path d="M48 66 C44 96 52 128 47 162" stroke="${d.drizzle}" stroke-width="4" fill="none" opacity=".8" stroke-linecap="round"/>
        <path d="M122 68 C126 100 118 132 123 168" stroke="${d.drizzle}" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>
        <g fill="rgba(250,242,230,.35)"><circle cx="66" cy="120" r="2"/><circle cx="98" cy="150" r="1.6"/><circle cx="76" cy="188" r="1.8"/></g>
      </g>
      ${wall}${rim}
      <g fill="${d.cream}" stroke="rgba(120,90,60,.15)" stroke-width="1">
        <ellipse cx="85" cy="48" rx="44" ry="14"/><ellipse cx="85" cy="36" rx="33" ry="12"/><ellipse cx="85" cy="26" rx="21" ry="9"/>
      </g>
      <g fill="${d.chip}">
        <rect x="66" y="38" width="6" height="4" rx="1" transform="rotate(18 69 40)"/>
        <rect x="94" y="30" width="5" height="4" rx="1" transform="rotate(-22 96 32)"/>
        <rect x="80" y="44" width="5" height="3.5" rx="1" transform="rotate(40 82 46)"/>
        <rect x="104" y="42" width="5" height="4" rx="1" transform="rotate(8 106 44)"/>
      </g>
      <path d="M31 52 C31 10 139 10 139 52 Z" fill="rgba(255,255,255,.13)" stroke="rgba(70,50,35,.28)" stroke-width="2"/>
      <path d="M44 38 C52 24 64 15 80 13" stroke="rgba(255,255,255,.5)" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  const driz = d.drizzle ? `
    <path d="M46 88 C42 120 50 152 46 186" stroke="${d.drizzle}" stroke-width="3.5" fill="none" opacity=".8" stroke-linecap="round"/>
    <path d="M124 92 C128 124 120 154 124 190" stroke="${d.drizzle}" stroke-width="3.5" fill="none" opacity=".75" stroke-linecap="round"/>` : "";
  const specks = d.specks ? `
    <g fill="${d.specks}" opacity=".55"><circle cx="60" cy="180" r="1.1"/><circle cx="86" cy="196" r="1"/><circle cx="108" cy="176" r="1.2"/><circle cx="98" cy="224" r="1.1"/></g>` : "";
  const powder = d.powder ? `
    <g fill="${d.powder}" opacity=".7"><circle cx="56" cy="67" r="1.2"/><circle cx="72" cy="69" r="1"/><circle cx="90" cy="66" r="1.3"/><circle cx="108" cy="68" r="1"/></g>` : "";
  const crema = d.crema ? `<rect x="30" y="64" width="110" height="7" fill="${d.crema}" opacity=".9"/>` : "";

  return `<svg viewBox="0 0 170 260" xmlns="http://www.w3.org/2000/svg">
    <defs>${cupClip}
      <linearGradient id="${p}-milk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d.milk[0]}"/><stop offset="1" stop-color="${d.milk[1]}"/></linearGradient>
      <linearGradient id="${p}-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d.top[0]}"/><stop offset="1" stop-color="${d.top[1]}"/></linearGradient>
      <linearGradient id="${p}-blend" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d.top[1]}" stop-opacity=".95"/><stop offset="1" stop-color="${d.top[1]}" stop-opacity="0"/></linearGradient>
    </defs>
    <ellipse cx="85" cy="250" rx="58" ry="7" fill="rgba(90,70,50,.22)"/>
    <g clip-path="url(#${p}-cup)">
      <rect x="30" y="64" width="110" height="180" fill="url(#${p}-milk)"/>
      <rect x="30" y="64" width="110" height="42" fill="url(#${p}-top)"/>
      <rect x="30" y="100" width="110" height="48" fill="url(#${p}-blend)"/>
      <path d="M62 108 C58 124 66 132 61 150" stroke="${d.top[1]}" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>
      <path d="M104 110 C108 126 100 138 106 156" stroke="${d.top[1]}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
      ${crema}${driz}${specks}${powder}${ice}
    </g>
    ${wall}${rim}${flat}
  </svg>`;
}

let selected = 0;
DRINKS.forEach((d, i) => {
  const btn = document.createElement("button");
  btn.className = "card";
  btn.innerHTML = cardSVG(d);
  btn.addEventListener("click", () => selectDrink(i, true));
  carousel.appendChild(btn);
});
const cards = [...carousel.children];

function selectDrink(i, scroll) {
  selected = i;
  cards.forEach((c, j) => c.classList.toggle("selected", j === i));
  drinkName.textContent = `${DRINKS[i].name} · ${DRINKS[i].zh}`;
  if (scroll) cards[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

let scrollTimer;
carousel.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const mid = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    if (best !== selected) selectDrink(best, false);
  }, 80);
});

selectDrink(0, false);
requestAnimationFrame(() => cards[0].scrollIntoView({ inline: "center", block: "nearest" }));

/* ================= 动画状态机 ================= */
const DUR = {
  driz: 550, ice: 780,
  milkIn: 220, milkFill: 1500, milkOut: 240,
  topIn: 200, topFill: 1150, topOut: 240,
  bloom: 950, lid: 560,
  bodyIn: 220, bodyFill: 1900, bodyOut: 240,
  cream: 520, chips: 480,
  drain: 500,
};
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t;
const backOut = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

const state = {
  seq: [], seqIdx: -1, phase: "idle", phaseStart: 0,
  surface: 430,        // 总液面（>424 视为空杯）
  topH: 0, blendH: 0, cremaOp: 0, amp: 0,
  streamHead: -1200, streamTail: -1200,
  drink: DRINKS[0],
};

function seqFor(d) {
  if (d.type === "blended") return ["driz", "bodyIn", "bodyFill", "bodyOut", "cream", "chips", "lid", "done"];
  const s = ["ice", "milkIn", "milkFill", "milkOut", "topIn", "topFill", "topOut", "bloom", "lid", "done"];
  return d.drizzle ? ["driz", ...s] : s;
}

function setPhase(p) {
  state.phase = p;
  state.phaseStart = performance.now();
  onPhaseEnter(p);
}
function nextPhase() {
  state.seqIdx += 1;
  setPhase(state.seq[state.seqIdx]);
}

spinBtn.addEventListener("click", () => {
  state.drink = DRINKS[selected];
  applyDrink(state.drink);
  sheet.classList.add("hidden");
  setTimeout(() => { state.seq = seqFor(state.drink); state.seqIdx = -1; nextPhase(); }, 430);
});

pillBtn.addEventListener("click", () => {
  pillBtn.classList.remove("show");
  state.drainFrom = state.surface;
  setPhase("drain");
});

function applyDrink(d) {
  const milk = d.type === "blended" ? d.body : d.milk;
  milkStopA.setAttribute("stop-color", milk[0]);
  milkStopB.setAttribute("stop-color", milk[1]);
  const top = d.top || d.body;
  topStopA.setAttribute("stop-color", top[0]);
  topStopB.setAttribute("stop-color", top[1]);
  blendStopA.setAttribute("stop-color", top[1]);
  blendStopB.setAttribute("stop-color", top[1]);
  if (d.crema) cremaPath.setAttribute("fill", d.crema);
  pillBtn.textContent = d.name;
}

/* ================= 各阶段进入时的一次性搭建 ================= */
const SVGNS = "http://www.w3.org/2000/svg";
let iceCubes = [], drizzleEls = [], tendrilEls = [], speckEls = [], powderEls = [], creamEls = [], chipEls = [];

function onPhaseEnter(p) {
  const d = state.drink;
  if (p === "driz") buildDrizzle(d);
  if (p === "ice") buildIce();
  if (p === "milkIn" || p === "bodyIn") {
    setStream(d.type === "blended" ? d.body[0] : d.milk[0], 16);
    state.streamHead = state.streamTail = -1200;
    streamGroup.style.display = "";
  }
  if (p === "topIn") {
    setStream(d.top[1], 10);
    state.streamHead = state.streamTail = -1200;
    streamGroup.style.display = "";
  }
  if (p === "topFill") buildTendrils(d);
  if (p === "bloom") { buildSpecks(d); buildPowder(d); }
  if (p === "milkOut" || p === "topOut" || p === "bodyOut") { /* 水流收尾 */ }
  if (p === "cream") buildCream(d);
  if (p === "chips") buildChips(d);
  if (p === "lid") {
    streamGroup.style.display = "none";
    lidGroup().setAttribute("opacity", "1");
  }
  if (p === "done") pillBtn.classList.add("show");
}

function lidGroup() { return state.drink.type === "blended" ? domeLid : flatLid; }

function setStream(color, w) {
  streamRect.setAttribute("fill", color);
  streamRect.setAttribute("x", GEO.xC - w / 2);
  streamRect.setAttribute("width", w);
  streamRect.setAttribute("rx", w / 2);
  streamSheen.setAttribute("x", GEO.xC - w / 2 + 3);
  streamSheen.setAttribute("width", 3);
  streamSheen.setAttribute("rx", 1.5);
}

/* 挂壁酱 */
function buildDrizzle(d) {
  decoG.querySelectorAll(".driz").forEach((e) => e.remove());
  drizzleEls = [];
  const paths = d.type === "blended"
    ? ["M85 116 C78 169 92 226 83 286", "M215 120 C222 176 208 233 217 296", "M148 123 C143 173 155 219 146 265"]
    : ["M81 155 C74 212 88 268 81 328", "M219 162 C226 219 212 272 219 335", "M150 226 C145 265 155 304 148 346"];
  paths.forEach((dd, i) => {
    const el = document.createElementNS(SVGNS, "path");
    el.setAttribute("class", "driz");
    el.setAttribute("d", dd);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", d.drizzle);
    el.setAttribute("stroke-width", i === 2 ? 5 : 6);
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("opacity", i === 2 ? ".55" : ".8");
    el.setAttribute("pathLength", "1");
    el.setAttribute("stroke-dasharray", "1");
    el.setAttribute("stroke-dashoffset", "1");
    decoG.appendChild(el);
    drizzleEls.push(el);
  });
}

/* 冰块 */
const ICE_SPEC = [
  { x: 115, s: 53, floatOff: 48, delay: 0 },
  { x: 182, s: 46, floatOff: 33, delay: 150 },
  { x: 150, s: 42, floatOff: 92, delay: 300 },
];
function buildIce() {
  iceG.innerHTML = "";
  iceCubes = ICE_SPEC.map((spec) => {
    const el = document.createElementNS(SVGNS, "rect");
    el.setAttribute("width", spec.s);
    el.setAttribute("height", spec.s);
    el.setAttribute("rx", spec.s * 0.24);
    el.setAttribute("x", -spec.s / 2);
    el.setAttribute("y", -spec.s / 2);
    el.setAttribute("fill", "rgba(255,255,255,.30)");
    el.setAttribute("stroke", "rgba(255,255,255,.85)");
    el.setAttribute("stroke-width", "2");
    el.setAttribute("visibility", "hidden");
    iceG.appendChild(el);
    return {
      ...spec, el,
      y: 40, vy: 0, rot: (Math.random() - 0.5) * 30, vrot: 0,
      floor: GEO.yBottom - spec.s / 2 - 6,
      dropped: false, launched: false,
    };
  });
}

/* 浓缩下沉须 */
function buildTendrils(d) {
  tendrilsG.innerHTML = "";
  tendrilEls = [];
  const iy = GEO.MILK_TARGET;
  const spec = [
    { x: 110, len: 92, w: 7, op: 0.45 },
    { x: 186, len: 78, w: 5, op: 0.35 },
    { x: 148, len: 110, w: 5, op: 0.3 },
  ];
  spec.forEach((s) => {
    const el = document.createElementNS(SVGNS, "path");
    el.setAttribute("d", `M ${s.x} ${iy} C ${s.x - 10} ${iy + s.len * 0.4}, ${s.x + 12} ${iy + s.len * 0.62}, ${s.x - 3} ${iy + s.len}`);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", d.top[1]);
    el.setAttribute("stroke-width", s.w);
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("opacity", s.op);
    el.setAttribute("pathLength", "1");
    el.setAttribute("stroke-dasharray", "1");
    el.setAttribute("stroke-dashoffset", "1");
    tendrilsG.appendChild(el);
    tendrilEls.push(el);
  });
}

/* 香草籽 / 抹茶粉 */
function buildSpecks(d) {
  speckEls = [];
  if (!d.specks) return;
  [[106, 318], [151, 346], [190, 311], [127, 377], [173, 395]].forEach(([x, y]) => {
    const el = document.createElementNS(SVGNS, "circle");
    el.setAttribute("cx", x); el.setAttribute("cy", y); el.setAttribute("r", 2);
    el.setAttribute("fill", d.specks); el.setAttribute("opacity", "0");
    decoG.appendChild(el);
    speckEls.push(el);
  });
}
function buildPowder(d) {
  powderEls = [];
  if (!d.powder) return;
  [99, 127, 159, 190, 212].forEach((x, i) => {
    const el = document.createElementNS(SVGNS, "circle");
    el.setAttribute("cx", x); el.setAttribute("cy", GEO.SURF_FINAL + 4 + (i % 2) * 3); el.setAttribute("r", 2);
    el.setAttribute("fill", d.powder); el.setAttribute("opacity", "0");
    decoG.appendChild(el);
    powderEls.push(el);
  });
}

/* 奶油顶 / 巧克力碎 */
const CREAM_SPEC = [
  { cy: 85, rx: 78, ry: 25 },
  { cy: 63, rx: 58, ry: 21 },
  { cy: 50, rx: 35, ry: 14 },
];
function buildCream(d) {
  creamG.innerHTML = "";
  creamEls = CREAM_SPEC.map((s) => {
    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("transform", `translate(150 ${s.cy}) scale(0)`);
    const el = document.createElementNS(SVGNS, "ellipse");
    el.setAttribute("rx", s.rx); el.setAttribute("ry", s.ry);
    el.setAttribute("fill", d.cream);
    el.setAttribute("stroke", "rgba(120,90,60,.15)");
    g.appendChild(el);
    creamG.appendChild(g);
    return { ...s, g };
  });
}
const CHIP_SPEC = [
  { x: 122, y: 70, r: 18 }, { x: 169, y: 56, r: -22 }, { x: 145, y: 81, r: 40 },
  { x: 187, y: 77, r: 8 }, { x: 134, y: 46, r: -30 },
];
function buildChips(d) {
  chipsG.innerHTML = "";
  chipEls = CHIP_SPEC.map((s, i) => {
    const el = document.createElementNS(SVGNS, "rect");
    el.setAttribute("width", 10); el.setAttribute("height", 7); el.setAttribute("rx", 2);
    el.setAttribute("fill", d.chip);
    el.setAttribute("visibility", "hidden");
    chipsG.appendChild(el);
    return { ...s, el, delay: i * 65 };
  });
}

/* ================= 粒子 ================= */
let particles = [], bubbles = [];
function spawnSplash(ySurf, color, n) {
  for (let i = 0; i < n; i++) {
    if (particles.length > 44) return;
    const el = document.createElementNS(SVGNS, "circle");
    el.setAttribute("r", 1.6 + Math.random() * 2.4);
    el.setAttribute("fill", color);
    splashG.appendChild(el);
    particles.push({
      el,
      x: GEO.xC + (Math.random() * 18 - 9),
      y: ySurf - 2,
      vx: (Math.random() - 0.5) * 3.4,
      vy: -(1.2 + Math.random() * 3.2),
      life: 1,
    });
  }
}
function spawnBubble() {
  if (bubbles.length > 14) return;
  const el = document.createElementNS(SVGNS, "circle");
  el.setAttribute("r", 1.4 + Math.random() * 2.6);
  el.setAttribute("fill", "rgba(255,255,255,.35)");
  bubblesG.appendChild(el);
  bubbles.push({
    el,
    x: GEO.xC + (Math.random() * 80 - 40),
    y: GEO.yBottom - 6,
    vy: 0.5 + Math.random() * 0.9,
  });
}

/* ================= 液面绘制 ================= */
function surfaceLine(ySurf, t, amp, dip) {
  let d = "";
  for (let x = GEO.xL - 8; x <= GEO.xR + 8; x += 12) {
    let y = ySurf
      + Math.sin(x * 0.045 + t * 0.004) * amp
      + Math.sin(x * 0.1 - t * 0.0026) * amp * 0.6;
    if (dip) y += Math.exp(-Math.pow(x - GEO.xC, 2) / (2 * 17 * 17)) * 6;
    d += (d ? " L " : "M ") + x + " " + y.toFixed(1);
  }
  return d;
}
function fillFromSurface(ySurf, t, amp, dip) {
  return surfaceLine(ySurf, t, amp, dip) + ` L ${GEO.xR + 8} 470 L ${GEO.xL - 8} 470 Z`;
}
function bandPath(yTop, yBot, t, ampTop, ampBot, dip) {
  const top = surfaceLine(yTop, t, ampTop, dip);
  // 下边缘反向走一遍
  let back = "";
  for (let x = GEO.xR + 8; x >= GEO.xL - 8; x -= 12) {
    const y = yBot + Math.sin(x * 0.05 + t * 0.003) * ampBot;
    back += ` L ${x} ${y.toFixed(1)}`;
  }
  return top + back + " Z";
}

function drawLiquid(t) {
  const s = state;
  if (s.surface > 423) {
    milkPath.setAttribute("d", "");
    topPath.setAttribute("d", "");
    blendRect.setAttribute("height", 0);
    cremaPath.setAttribute("d", "");
    return;
  }
  const pouringMilk = s.phase === "milkFill" || s.phase === "bodyFill";
  const pouringTop = s.phase === "topFill";
  const milkSurf = s.surface + s.topH;

  milkPath.setAttribute("d", fillFromSurface(milkSurf, t, s.topH > 0.5 ? s.amp * 0.5 : s.amp, pouringMilk));

  if (s.topH > 0.5) {
    topPath.setAttribute("d", bandPath(s.surface, milkSurf + 3, t, s.amp, s.amp * 0.5, pouringTop));
  } else {
    topPath.setAttribute("d", "");
  }

  blendRect.setAttribute("y", milkSurf);
  blendRect.setAttribute("height", s.blendH);

  if (state.drink.crema && s.cremaOp > 0.01) {
    cremaPath.setAttribute("d", bandPath(s.surface, s.surface + GEO.CREMA_H, t, s.amp, s.amp * 0.8, pouringTop));
    cremaPath.setAttribute("opacity", s.cremaOp * 0.9);
  } else {
    cremaPath.setAttribute("d", "");
  }
}

/* ================= 冰块物理 ================= */
function tickIce(t, dt) {
  const s = state;
  const milkSurf = s.surface + s.topH;
  iceCubes.forEach((c) => {
    const now = t - s.phaseStartIce;
    if (!c.launched) {
      if (now >= c.delay) { c.launched = true; c.el.setAttribute("visibility", "visible"); }
      else return;
    }
    const hasLiquid = s.surface < 423 && milkSurf < c.floor;
    if (hasLiquid && milkSurf < c.y + c.s * 0.3) {
      // 浮力弹簧
      const target = Math.min(s.surface + c.floatOff, c.floor);
      c.vy += (target - c.y) * 0.028;
      c.vy *= 0.86;
      c.y += c.vy;
      c.rot += Math.sin(t * 0.0018 + c.x) * 0.12;
    } else {
      // 自由落体 + 弹跳
      c.vy += 0.55;
      c.y += c.vy;
      if (c.y > c.floor) {
        c.y = c.floor;
        if (Math.abs(c.vy) > 1.2) { c.vy *= -0.32; c.vrot = (Math.random() - 0.5) * 6; }
        else c.vy = 0;
      }
      c.rot += c.vrot;
      c.vrot *= 0.92;
    }
    c.el.setAttribute("transform", `translate(${c.x} ${c.y.toFixed(1)}) rotate(${c.rot.toFixed(1)})`);
  });
}

/* ================= 主循环 ================= */
let lastT = performance.now();
function tick(t) {
  const dt = Math.min(t - lastT, 50);
  lastT = t;
  const s = state;
  const el = t - s.phaseStart;
  const p = s.phase in DUR ? Math.min(el / DUR[s.phase], 1) : 0;
  const d = s.drink;

  switch (s.phase) {
    case "driz": {
      drizzleEls.forEach((e, i) => {
        const pp = Math.min(Math.max((el - i * 90) / (DUR.driz - 180), 0), 1);
        e.setAttribute("stroke-dashoffset", (1 - easeOut(pp)).toFixed(3));
      });
      if (p >= 1) nextPhase();
      break;
    }
    case "ice": {
      if (!s.iceStarted) { s.iceStarted = true; s.phaseStartIce = t; }
      if (p >= 1) nextPhase();
      break;
    }
    case "milkIn": case "bodyIn": case "topIn": {
      s.streamTail = -1200;
      s.streamHead = -1200 + ((s.surface > 423 ? GEO.yBottom : s.surface) + 1206) * easeIn(p);
      if (p >= 1) nextPhase();
      break;
    }
    case "milkFill": {
      s.surface = GEO.yBottom - (GEO.yBottom - GEO.MILK_TARGET) * easeOut(p);
      s.amp = 3.6;
      s.streamHead = s.surface + 4;
      if (Math.random() < 0.7) spawnSplash(s.surface, d.milk[0], 2);
      if (Math.random() < 0.3) spawnBubble();
      if (p >= 1) nextPhase();
      break;
    }
    case "bodyFill": {
      s.surface = GEO.yBottom - (GEO.yBottom - GEO.SURF_FINAL) * easeOut(p);
      s.amp = 3.2;
      s.streamHead = s.surface + 4;
      if (Math.random() < 0.6) spawnSplash(s.surface, d.body[0], 2);
      if (p >= 1) nextPhase();
      break;
    }
    case "milkOut": case "bodyOut": case "topOut": {
      s.streamHead = s.surface + 4;
      s.streamTail = -1200 + (s.surface + 1204) * easeIn(p);
      if (Math.random() < 0.35) spawnSplash(s.surface, s.phase === "topOut" ? d.top[1] : (d.milk || d.body)[0], 1);
      if (p >= 1) {
        streamGroup.style.display = "none";
        nextPhase();
      }
      break;
    }
    case "topFill": {
      s.surface = GEO.MILK_TARGET - (GEO.MILK_TARGET - GEO.SURF_FINAL) * easeOut(p);
      s.topH = GEO.MILK_TARGET - s.surface;
      s.amp = 3.4;
      s.cremaOp = p;
      s.streamHead = s.surface + 4;
      tendrilEls.forEach((e, i) => {
        const pp = Math.min(Math.max((el - i * 160) / 700, 0), 1);
        e.setAttribute("stroke-dashoffset", (1 - easeOut(pp)).toFixed(3));
      });
      if (Math.random() < 0.6) spawnSplash(s.surface, d.top[1], 2);
      if (p >= 1) nextPhase();
      break;
    }
    case "bloom": {
      s.blendH = GEO.BLEND_FINAL * easeOut(p);
      s.amp = 3.4 - 2.2 * p;
      speckEls.forEach((e) => e.setAttribute("opacity", (0.55 * p).toFixed(2)));
      powderEls.forEach((e) => e.setAttribute("opacity", (0.7 * p).toFixed(2)));
      if (Math.random() < 0.15) spawnBubble();
      if (p >= 1) nextPhase();
      break;
    }
    case "cream": {
      creamEls.forEach((c, i) => {
        const pp = Math.min(Math.max((el - i * 130) / 300, 0), 1);
        c.g.setAttribute("transform", `translate(150 ${c.cy}) scale(${backOut(pp).toFixed(3)})`);
      });
      if (p >= 1) nextPhase();
      break;
    }
    case "chips": {
      chipEls.forEach((c) => {
        const pp = Math.min(Math.max((el - c.delay) / 260, 0), 1);
        if (pp <= 0) return;
        c.el.setAttribute("visibility", "visible");
        const y = c.y - 60 * (1 - easeIn(pp));
        const rot = c.r * pp;
        c.el.setAttribute("transform", `translate(${c.x - 5} ${y - 3.5}) rotate(${rot} 5 3.5)`);
        c.el.setAttribute("opacity", pp < 0.15 ? pp / 0.15 : 1);
      });
      if (p >= 1) nextPhase();
      break;
    }
    case "lid": {
      const g = lidGroup();
      let y;
      if (p < 0.65) y = -110 * (1 - easeIn(p / 0.65));
      else y = 3 * Math.sin(((p - 0.65) / 0.35) * Math.PI);
      g.setAttribute("transform", `translate(0 ${y.toFixed(1)})`);
      if (p >= 0.6 && !s.lidThump) { s.lidThump = true; s.amp = 2.4; }
      if (p >= 1) nextPhase();
      break;
    }
    case "done": {
      s.amp += (1.1 - s.amp) * 0.02;
      break;
    }
    case "drain": {
      const k = 1 - easeIn(p);
      liquidLayers.setAttribute("opacity", k.toFixed(2));
      creamG.setAttribute("opacity", k.toFixed(2));
      chipsG.setAttribute("opacity", k.toFixed(2));
      const g = lidGroup();
      g.setAttribute("transform", `translate(0 ${(-140 * easeIn(p)).toFixed(1)})`);
      g.setAttribute("opacity", k.toFixed(2));
      if (p >= 1) resetAll();
      break;
    }
  }

  /* 水流 */
  if (streamGroup.style.display !== "none") {
    const h = Math.max(0, s.streamHead - s.streamTail);
    streamRect.setAttribute("y", s.streamTail);
    streamRect.setAttribute("height", h);
    streamSheen.setAttribute("y", s.streamTail + 10);
    streamSheen.setAttribute("height", Math.max(0, h - 20));
  }

  drawLiquid(t);
  if (iceCubes.length) tickIce(t, dt);

  /* 飞溅 */
  particles = particles.filter((pt) => {
    pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.17; pt.life -= 0.032;
    if (pt.life <= 0 || pt.y > GEO.yBottom + 24) { pt.el.remove(); return false; }
    pt.el.setAttribute("cx", pt.x.toFixed(1));
    pt.el.setAttribute("cy", pt.y.toFixed(1));
    pt.el.setAttribute("opacity", (pt.life * 0.9).toFixed(2));
    return true;
  });

  /* 气泡 */
  bubbles = bubbles.filter((b) => {
    b.y -= b.vy;
    b.x += Math.sin(t * 0.003 + b.y * 0.08) * 0.3;
    if (b.y < s.surface + s.topH + 8) { b.el.remove(); return false; }
    b.el.setAttribute("cx", b.x.toFixed(1));
    b.el.setAttribute("cy", b.y.toFixed(1));
    return true;
  });

  requestAnimationFrame(tick);
}

function resetAll() {
  const s = state;
  s.surface = 430; s.topH = 0; s.blendH = 0; s.cremaOp = 0; s.amp = 0;
  s.iceStarted = false; s.lidThump = false;
  s.phase = "idle"; s.seqIdx = -1;
  decoG.innerHTML = ""; tendrilsG.innerHTML = ""; iceG.innerHTML = "";
  creamG.innerHTML = ""; chipsG.innerHTML = "";
  bubblesG.innerHTML = ""; bubbles = [];
  iceCubes = []; drizzleEls = []; tendrilEls = []; speckEls = []; powderEls = []; creamEls = []; chipEls = [];
  liquidLayers.setAttribute("opacity", "1");
  creamG.setAttribute("opacity", "1");
  chipsG.setAttribute("opacity", "1");
  [flatLid, domeLid].forEach((g) => {
    g.setAttribute("opacity", "0");
    g.setAttribute("transform", "translate(0 0)");
  });
  sheet.classList.remove("hidden");
}

requestAnimationFrame(tick);

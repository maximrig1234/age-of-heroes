import { PageFrame, PageFrameProps } from "./types"
import HeaderConstructor from "../Header"
import { FullSlug, resolveRelative } from "../../util/path"

const Header = HeaderConstructor()

// Верхнее меню: label это надпись на кнопке, folder это название папки в Obsidian
// (в том виде, как она называется у вас в хранилище; регистр и пробелы не важны).
const MENU = [
  { label: "Меню", folder: "Меню" },
  { label: "История", folder: "История" },
  { label: "Мир Окологорья", folder: "Мир Окологорья" },
  { label: "Летопись Компаний", folder: "Летопись Компаний" },
  { label: "Геймплей", folder: "Геймплей" },
]

// Музыка: файлы лежат в quartz/static/music/. Днём играет первая, ночью (тёмная тема) вторая.
// Звук нажатия проигрывается при каждом клике.
const MUSIC = { light: "morning.mp3", dark: "night.mp3" }
const CLICK_SOUND = "click.mp3"

// Чат: сюда вставляется адрес встраиваемого чата (например, от WidgetBot для Discord).
// Пока пусто, блок чата на сайте не показывается.
const CHAT_URL = "https://e.widgetbot.io/channels/1520105778495619213/1563209734104817784"

// Сколько случайных статей показывать в правой колонке
const RANDOM_COUNT = 4

// Облака (днём светлые, ночью тёмные)
const CLOUDS = [
  { y: "7%", s: 1, d: "75s", o: "-10s" },
  { y: "14%", s: 0.7, d: "110s", o: "-70s" },
  { y: "4%", s: 1.3, d: "140s", o: "-40s" },
  { y: "22%", s: 0.85, d: "95s", o: "-20s" },
]

// Бабочки (только день)
const BUTTERFLIES = [
  { x: "4vw", y: "6vw", d: "15s", o: "0s", c: "#f08a24" },
  { x: "10vw", y: "10vw", d: "19s", o: "-6s", c: "#3a8de0" },
  { x: "16vw", y: "5vw", d: "13s", o: "-3s", c: "#e8517a" },
  { x: "21vw", y: "9vw", d: "17s", o: "-9s", c: "#f5d442" },
  { x: "7vw", y: "13vw", d: "21s", o: "-12s", c: "#ffffff" },
]

// Светлячки (только ночь). Положения заданы одним и тем же набором для всех страниц,
// чтобы при переходах между статьями они не прыгали.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}
const rand = seeded(20261022)
const sign = () => (rand() < 0.5 ? -1 : 1)
const FIREFLIES = Array.from({ length: 16 }, () => ({
  x: 3 + rand() * 94,
  y: 4 + rand() * 58,
  dx: sign() * (40 + rand() * 80),
  dy: sign() * (30 + rand() * 60),
  d: 14 + rand() * 12,
  g: 2.5 + rand() * 2.5,
  o: -rand() * 20,
  o2: -rand() * 5,
  size: 4 + rand() * 3,
}))

// Кубики: какие кости показывать в панели (справа внизу)
const DICE = [2, 4, 6, 8, 10, 12, 20, 100]
const DICE_PATH: Record<number, string> = {
  2: "M3.5 12a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0 -17 0 M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0",
  4: "M12 3 L21 19 L3 19 L12 3 M12 14 L12 3 M12 14 L3 19 M12 14 L21 19",
  6: "M12 3 L20 7.5 L20 16.5 L12 21 L4 16.5 L4 7.5 L12 3 M12 12 L4 7.5 M12 12 L20 7.5 M12 12 L12 21",
  8: "M12 2.5 L20 12 L12 21.5 L4 12 L12 2.5 M4 12 L20 12 M12 2.5 L8.5 12 L12 21.5 M12 2.5 L15.5 12 L12 21.5",
  10: "M12 2.5 L20 10 L12 21.5 L4 10 L12 2.5 M4 10 L12 13 L20 10 M12 13 L12 21.5 M12 2.5 L12 13",
  12: "M12 3 L20 9 L17 19 L7 19 L4 9 L12 3 M12 8 L15.8 10.8 L14.4 15.3 L9.6 15.3 L8.2 10.8 L12 8 M12 3 L12 8 M20 9 L15.8 10.8 M17 19 L14.4 15.3 M7 19 L9.6 15.3 M4 9 L8.2 10.8",
  20: "M12 2.5 L20.5 7.25 L20.5 16.75 L12 21.5 L3.5 16.75 L3.5 7.25 L12 2.5 M12 7 L17.2 15.5 L6.8 15.5 L12 7 M12 7 L12 2.5 M12 7 L3.5 7.25 M12 7 L20.5 7.25 M6.8 15.5 L3.5 7.25 M6.8 15.5 L3.5 16.75 M6.8 15.5 L12 21.5 M17.2 15.5 L20.5 7.25 M17.2 15.5 L20.5 16.75 M17.2 15.5 L12 21.5",
  100: "M3.5 12a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0 -17 0 M7.6 9.3a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0 -3.4 0 M13 14.7a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0 -3.4 0 M9 16 L15 8",
}

// Слайд-шоу на титульной странице (только на главной). Картинки лежат в quartz/static/slides/.
// Чтобы добавить слайд, положите файл в эту папку и допишите строку сюда.
const SLIDE_SECONDS = 6
const SLIDES = [
  { file: "map-okologorye.webp", caption: "Карта Окологорья и западной части материка. Рисовалась с детства" },
  { file: "orc.webp", caption: "Орк. Набросок к стратегии в духе Age of Heroes 3" },
  { file: "orcs.webp", caption: "Орки: ещё наброски" },
  { file: "necromancers.webp", caption: "Некроманты из Анмора" },
  { file: "dwarf.webp", caption: "Дварф" },
  { file: "knight.webp", caption: "Рыцарь" },
  { file: "forest-elf.webp", caption: "Так я представлял лесных эльфов" },
  { file: "avair.webp", caption: "Хранитель мудрости Аваир. Ранний образ" },
  { file: "elf-architecture.webp", caption: "Архитектура эльфов в ранних представлениях о мире" },
  { file: "north-map.webp", caption: "Север королевства Грифон Харт" },
]
const slotPct = 100 / SLIDES.length
const fadePct = slotPct * 0.12
const SLIDE_CSS = `@keyframes okolo-slide{0%{opacity:0}${fadePct.toFixed(2)}%{opacity:1}${slotPct.toFixed(2)}%{opacity:1}${(slotPct + fadePct).toFixed(2)}%{opacity:0}100%{opacity:0}}.okolo-slide{animation:okolo-slide ${SLIDES.length * SLIDE_SECONDS}s linear infinite;animation-delay:calc(var(--i) * ${SLIDE_SECONDS}s)}`

// Quartz пишет адреса папок строчными буквами и с дефисами вместо пробелов
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")

// Дерево подпапок для выпадающего меню: только папки, в которых (на любой глубине) есть заметки.
// label это настоящее имя папки из Obsidian, path это адрес папки на сайте.
type MenuNode = { label: string; path: string; children: Map<string, MenuNode> }

// Сколько уровней папок показывать в выпадающем меню (глубже папки открываются со страницы раздела)
const MENU_DEPTH = 2
// Папки, которые не нужно показывать в меню (регистр и пробелы не важны)
const MENU_HIDE = ["Краткие сокращения", "Image", "Изображения", "File", "Templates"]
const HIDE_SET = new Set(MENU_HIDE.map((x) => x.trim().toLowerCase().replace(/\s+/g, "-")))

function buildMenuTree(allFiles: any[], top: string): Map<string, MenuNode> {
  const root = new Map<string, MenuNode>()
  for (const f of allFiles) {
    if (!f.slug || !f.relativePath) continue
    const rel = String(f.relativePath).split("/")
    const dirs = rel.slice(0, -1)
    if (dirs.length < 2 || normalize(dirs[0]) !== top) continue
    const slugSegs = String(f.slug).split("/")
    let level = root
    for (let i = 1; i < dirs.length && i <= MENU_DEPTH; i++) {
      const slugKey = slugSegs[i] ?? normalize(dirs[i])
      if (HIDE_SET.has(normalize(dirs[i])) || HIDE_SET.has(slugKey)) break
      let node = level.get(slugKey)
      if (!node) {
        node = { label: dirs[i], path: slugSegs.slice(0, i + 1).join("/"), children: new Map() }
        level.set(slugKey, node)
      } else if (node.label === slugKey && dirs[i] !== slugKey) {
        // настоящее имя папки лучше, чем адрес в нижнем регистре
        node.label = dirs[i]
      }
      level = node.children
    }
  }
  return root
}

const sortNodes = (m: Map<string, MenuNode>) =>
  [...m.values()].sort((a, b) => a.label.localeCompare(b.label, "ru"))

const MENU_SCRIPT = `(function () {
  if (window.__okoloMenu) return;
  window.__okoloMenu = true;
  function closeAll() {
    document.querySelectorAll(".okolo-nav .open").forEach(function (el) { el.classList.remove("open"); });
    var nav = document.querySelector(".okolo-nav");
    if (nav) nav.classList.remove("menu-open");
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var caret = t.closest(".okolo-caret");
    if (caret) {
      e.preventDefault();
      var li = caret.parentElement;
      var willOpen = !li.classList.contains("open");
      if (li.parentElement) {
        Array.prototype.forEach.call(li.parentElement.children, function (sib) { sib.classList.remove("open"); });
      }
      if (willOpen) li.classList.add("open");
      return;
    }
    if (t.closest(".okolo-burger")) {
      var nav = t.closest(".okolo-nav");
      nav.classList.toggle("menu-open");
      return;
    }
    if (!t.closest(".okolo-menu")) closeAll();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  document.addEventListener("nav", closeAll);
})();
`

// Самый первый скрипт: до отрисовки страницы выбирает, показывать ли большую кнопку Play
const EARLY_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("okolo-music")||"{}");document.documentElement.setAttribute("data-okolo-state",s.started?"mini":"intro")}catch(e){document.documentElement.setAttribute("data-okolo-state","intro")}`

// Скрипт плеера. Звук играет из объекта в памяти страницы, а не из разметки,
// поэтому не прерывается при переходах между статьями.
const PLAYER_SCRIPT = `(function () {
  if (window.__okoloPlayer) return;
  var cfg = __CFG__;
  var root = document.documentElement;
  var KEY = "okolo-music";
  var base = (document.body && document.body.dataset.basepath) || "";
  var st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) {}
  st.times = st.times || {};
  var vol = typeof st.vol === "number" ? st.vol : 0.4;
  var on = false;
  var cur = null;
  var switching = false;
  var fadeTimer = null;
  var audio = new Audio();
  audio.preload = "none";
  audio.loop = true;
  audio.volume = vol;
  var muted = !!st.muted;
  if (muted) root.setAttribute("data-okolo-muted", "1");

  // полное выключение звуков: фоновая музыка, звук нажатия и звук на самой странице
  function muteMedia() {
    document.querySelectorAll("audio, video").forEach(function (m) { if (m !== audio) m.muted = muted; });
  }
  function setMuted(m) {
    muted = m;
    st.muted = m;
    if (m) {
      st.resume = on;
      root.setAttribute("data-okolo-muted", "1");
      if (on) pause();
    } else {
      root.removeAttribute("data-okolo-muted");
      var again = st.resume && root.getAttribute("data-okolo-state") !== "intro";
      st.resume = false;
      if (again) play();
    }
    muteMedia();
    save();
  }

  function theme() { return root.getAttribute("saved-theme") === "dark" ? "dark" : "light"; }
  function url(f) { return base + "/static/music/" + encodeURIComponent(f); }
  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    s = Math.floor(s);
    var m = Math.floor(s / 60), r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function save() {
    if (cur) st.times[cur] = audio.currentTime || 0;
    st.on = on;
    st.vol = vol;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }
  function refresh() {
    root.setAttribute("data-okolo-playing", on ? "1" : "0");
    var d = audio.duration, c = audio.currentTime || 0;
    var known = d > 0 && isFinite(d);
    root.style.setProperty("--okolo-progress", (known ? Math.min(100, (c / d) * 100) : 0) + "%");
    document.querySelectorAll("[data-okolo-time]").forEach(function (el) {
      var t = fmt(c) + " / " + (known ? fmt(d) : "--:--");
      if (el.textContent !== t) el.textContent = t;
    });
    document.querySelectorAll("[data-okolo-volume]").forEach(function (r) {
      if (parseFloat(r.value) !== vol) r.value = vol;
    });
  }
  function load(t) {
    cur = t;
    audio.src = url(cfg.files[t]);
    var at = st.times[t] || 0;
    if (at > 0) {
      audio.addEventListener("loadedmetadata", function once() {
        audio.removeEventListener("loadedmetadata", once);
        if (audio.duration && at < audio.duration - 3) { try { audio.currentTime = at; } catch (e) {} }
      });
    }
  }
  function fade(to, ms, done) {
    clearInterval(fadeTimer);
    var from = audio.volume, steps = Math.max(1, Math.round(ms / 40)), i = 0;
    fadeTimer = setInterval(function () {
      i++;
      audio.volume = Math.max(0, Math.min(1, from + ((to - from) * i) / steps));
      if (i >= steps) {
        clearInterval(fadeTimer);
        fadeTimer = null;
        if (done) done();
      }
    }, 40);
  }
  function play() {
    if (!cur) load(theme());
    audio.volume = 0;
    var p = audio.play();
    function ok() { on = true; fade(vol, 600); refresh(); save(); }
    function fail() { on = false; audio.volume = vol; refresh(); }
    if (p && p.then) p.then(ok, fail); else ok();
    return p;
  }
  function pause() {
    on = false;
    refresh();
    fade(0, 350, function () { audio.pause(); audio.volume = vol; save(); });
  }
  function setState(s) { root.setAttribute("data-okolo-state", s); }
  function start(withMusic) {
    st.started = true;
    setState("mini");
    if (withMusic) play(); else { on = false; refresh(); save(); }
  }
  function onTheme() {
    var t = theme();
    if (!cur || t === cur) return;
    st.times[cur] = audio.currentTime || 0;
    if (!on) { load(t); refresh(); return; }
    switching = true;
    fade(0, 400, function () {
      load(t);
      audio.volume = 0;
      var p = audio.play();
      var okay = function () { switching = false; fade(vol, 600); };
      var bad = function () { switching = false; on = false; audio.volume = vol; refresh(); };
      if (p && p.then) p.then(okay, bad); else okay();
    });
  }
  new MutationObserver(onTheme).observe(root, { attributes: true, attributeFilter: ["saved-theme"] });

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest("[data-okolo-skip]")) { start(false); return; }
    if (t.closest("[data-okolo-mute]")) { setMuted(!muted); return; }
    if (t.closest("[data-okolo-toggle]")) {
      if (muted) { st.resume = false; setMuted(false); }
      if (root.getAttribute("data-okolo-state") === "intro") { start(true); return; }
      if (on) pause(); else play();
      return;
    }
    var bar = t.closest("[data-okolo-seek]");
    if (bar && audio.duration > 0) {
      var r = bar.getBoundingClientRect();
      audio.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * audio.duration;
      refresh();
    }
  });
  document.addEventListener("input", function (e) {
    var r = e.target;
    if (r && r.matches && r.matches("[data-okolo-volume]")) {
      vol = parseFloat(r.value);
      if (!fadeTimer) audio.volume = vol;
      save();
    }
  });
  // если на странице включили другой звук или видео, фоновая музыка замолкает
  document.addEventListener("play", function (e) {
    var m = e.target;
    if (muted && m && m !== audio && m.tagName && /^(AUDIO|VIDEO)$/.test(m.tagName)) m.muted = true;
    if (on && m && m !== audio && m.tagName && /^(AUDIO|VIDEO)$/.test(m.tagName)) pause();
  }, true);
  audio.addEventListener("pause", function () {
    if (on && !switching && !fadeTimer) { on = false; refresh(); }
  });
  ["timeupdate", "durationchange", "loadedmetadata"].forEach(function (ev) {
    audio.addEventListener(ev, refresh);
  });

  // звук нажатия на любой клик
  var clickBase = new Audio(base + "/static/music/" + encodeURIComponent(cfg.click));
  clickBase.preload = "auto";
  var lastClick = 0;
  document.addEventListener("click", function () {
    var now = Date.now();
    if (now - lastClick < 40 || vol <= 0 || muted) return;
    lastClick = now;
    var a = clickBase.cloneNode();
    a.volume = 0.7;
    var p = a.play();
    if (p && p.catch) p.catch(function () {});
  }, true);

  document.addEventListener("nav", function () { refresh(); muteMedia(); });
  window.addEventListener("pagehide", save);
  window.__okoloPlayer = audio;
  load(theme());
  setState(st.started ? "mini" : "intro");
  refresh();
  muteMedia();
  if (st.started && st.on && !muted) {
    var p0 = play();
    if (p0 && p0.catch) {
      p0.catch(function () {
        document.addEventListener("pointerdown", function once() {
          document.removeEventListener("pointerdown", once);
          if (!on) play();
        });
      });
    }
  }
})();
`.replace(
  "__CFG__",
  JSON.stringify({ files: MUSIC, click: CLICK_SOUND }),
)

const DICE_SCRIPT = "function okoloRnd(n) {\n  var a = new Uint32Array(1), lim = Math.floor(4294967296 / n) * n, x;\n  do { crypto.getRandomValues(a); x = a[0]; } while (x >= lim);\n  return (x % n) + 1;\n}\n// Разбор формулы: 2d20kh1+3, d20+5, 4d6dl1, 1к8+2. Возвращает { terms } или { error }\nfunction okoloParse(src) {\n  var s = String(src || \"\").toLowerCase().replace(/\\s+/g, \"\").replace(/к/g, \"d\").replace(/−/g, \"-\");\n  if (!s) return { error: \"Введите формулу, например 2d20kh1+3\" };\n  var re = /([+-]?)(?:(\\d*)d(\\d+)(?:(kh|kl|dh|dl)(\\d*))?|(\\d+))/g, m, pos = 0, terms = [], dice = 0;\n  while ((m = re.exec(s)) !== null) {\n    if (m.index !== pos) return { error: \"Не понимаю формулу: «\" + src + \"»\" };\n    pos = re.lastIndex;\n    var sign = m[1] === \"-\" ? -1 : 1;\n    if (m[6] !== undefined) { terms.push({ type: \"const\", sign: sign, value: parseInt(m[6], 10) }); continue; }\n    var n = m[2] === \"\" ? 1 : parseInt(m[2], 10), sides = parseInt(m[3], 10);\n    if (n < 1 || n > 100 || sides < 2 || sides > 1000) return { error: \"Слишком много костей или граней\" };\n    dice += n;\n    var keep = m[4] ? { kind: m[4], n: m[5] === \"\" ? 1 : parseInt(m[5], 10) } : null;\n    terms.push({ type: \"dice\", sign: sign, n: n, sides: sides, keep: keep, label: n + \"d\" + sides + (m[4] ? m[4] + (m[5] || \"\") : \"\") });\n  }\n  if (pos !== s.length || !terms.length) return { error: \"Не понимаю формулу: «\" + src + \"»\" };\n  if (terms.length > 20 || dice > 200) return { error: \"Слишком длинная формула\" };\n  return { terms: terms };\n}\n// Бросок. Возвращает { total, parts: [{label, sign, rolls:[{v, dropped}], sum} | {const}] }\nfunction okoloRoll(terms) {\n  var total = 0, parts = [];\n  terms.forEach(function (t) {\n    if (t.type === \"const\") { total += t.sign * t.value; parts.push({ type: \"const\", sign: t.sign, value: t.value }); return; }\n    var rolls = [];\n    for (var i = 0; i < t.n; i++) rolls.push({ v: okoloRnd(t.sides), dropped: false });\n    if (t.keep) {\n      var idx = rolls.map(function (_, i) { return i; });\n      idx.sort(function (a, b) { return rolls[a].v - rolls[b].v; }); // по возрастанию\n      var k = Math.min(t.keep.n, t.n), dropIdx;\n      if (t.keep.kind === \"kh\") dropIdx = idx.slice(0, t.n - k);\n      else if (t.keep.kind === \"kl\") dropIdx = idx.slice(k);\n      else if (t.keep.kind === \"dh\") dropIdx = idx.slice(t.n - k);\n      else dropIdx = idx.slice(0, k); // dl\n      dropIdx.forEach(function (i) { rolls[i].dropped = true; });\n    }\n    var sum = 0;\n    rolls.forEach(function (r) { if (!r.dropped) sum += r.v; });\n    total += t.sign * sum;\n    parts.push({ type: \"dice\", label: t.label, sides: t.sides, sign: t.sign, rolls: rolls, sum: sum });\n  });\n  return { total: total, parts: parts };\n}\nif (typeof module !== \"undefined\") module.exports = { okoloParse: okoloParse, okoloRoll: okoloRoll };\n(function () {\n  if (window.__okoloDice) return;\n  window.__okoloDice = true;\n  var root = document.documentElement;\n  var DICE = [2, 4, 6, 8, 10, 12, 20, 100];\n  var counts = {}, mod = 0, custom = false, typed = \"\", hideTimer = null;\n\n  function build() {\n    var parts = [];\n    DICE.forEach(function (d) { if (counts[d]) parts.push(counts[d] + \"d\" + d); });\n    var s = parts.join(\"+\");\n    if (mod > 0) s += (s ? \"+\" : \"\") + mod;\n    else if (mod < 0) s += mod;\n    return s;\n  }\n  function sync() {\n    document.querySelectorAll(\"[data-okolo-die]\").forEach(function (b) {\n      var d = parseInt(b.getAttribute(\"data-okolo-die\"), 10);\n      var badge = b.querySelector(\".okolo-die-badge\");\n      var c = counts[d] || 0;\n      b.classList.toggle(\"sel\", c > 0);\n      if (badge) badge.textContent = c > 0 ? String(c) : \"\";\n    });\n    document.querySelectorAll(\"[data-okolo-modval]\").forEach(function (el) {\n      el.textContent = (mod > 0 ? \"+\" : \"\") + mod;\n    });\n    document.querySelectorAll(\"[data-okolo-formula]\").forEach(function (inp) {\n      var v = custom ? typed : build();\n      if (inp.value !== v) inp.value = v;\n    });\n  }\n  function showResult(res) {\n    var card = document.querySelector(\"[data-okolo-result]\");\n    if (!card) return;\n    var total = card.querySelector(\"[data-okolo-total]\");\n    var body = card.querySelector(\"[data-okolo-detail]\");\n    body.textContent = \"\";\n    if (res.error) {\n      total.textContent = \"\";\n      var e = document.createElement(\"div\");\n      e.className = \"okolo-dice-error\";\n      e.textContent = res.error;\n      body.appendChild(e);\n    } else {\n      total.textContent = String(res.total);\n      res.parts.forEach(function (p, i) {\n        var row = document.createElement(\"div\");\n        row.className = \"okolo-dice-part\";\n        var sgn = p.sign < 0 ? \"−\" : (i > 0 ? \"+\" : \"\");\n        if (p.type === \"const\") {\n          row.textContent = sgn + \" \" + p.value;\n        } else {\n          var lab = document.createElement(\"span\");\n          lab.className = \"okolo-dice-label\";\n          lab.textContent = sgn + \" \" + p.label + \":\";\n          row.appendChild(lab);\n          p.rolls.forEach(function (r) {\n            var d = document.createElement(\"span\");\n            d.className = \"okolo-dice-val\" + (r.dropped ? \" drop\" : \"\") +\n              (p.sides === 20 && !r.dropped && r.v === 20 ? \" crit\" : \"\") +\n              (p.sides === 20 && !r.dropped && r.v === 1 ? \" fail\" : \"\");\n            d.textContent = String(r.v);\n            row.appendChild(d);\n          });\n        }\n        body.appendChild(row);\n      });\n    }\n    root.setAttribute(\"data-okolo-result\", \"1\");\n    clearTimeout(hideTimer);\n    hideTimer = setTimeout(function () { root.removeAttribute(\"data-okolo-result\"); }, 12000);\n  }\n  function roll() {\n    var f = custom ? typed : build();\n    var q = okoloParse(f);\n    if (q.error) { showResult({ error: q.error }); return; }\n    showResult(okoloRoll(q.terms));\n  }\n\n  document.addEventListener(\"click\", function (e) {\n    var t = e.target;\n    if (!t || !t.closest) return;\n    if (t.closest(\"[data-okolo-dice-toggle]\")) {\n      if (root.getAttribute(\"data-okolo-dice\") === \"open\") root.removeAttribute(\"data-okolo-dice\");\n      else root.setAttribute(\"data-okolo-dice\", \"open\");\n      return;\n    }\n    var die = t.closest(\"[data-okolo-die]\");\n    if (die) {\n      if (custom) { counts = {}; mod = 0; custom = false; }\n      var d = parseInt(die.getAttribute(\"data-okolo-die\"), 10);\n      counts[d] = Math.min(99, (counts[d] || 0) + 1);\n      sync();\n      return;\n    }\n    var m = t.closest(\"[data-okolo-mod]\");\n    if (m) {\n      if (custom) { counts = {}; mod = 0; custom = false; }\n      mod = Math.max(-99, Math.min(99, mod + parseInt(m.getAttribute(\"data-okolo-mod\"), 10)));\n      sync();\n      return;\n    }\n    if (t.closest(\"[data-okolo-dice-reset]\")) { counts = {}; mod = 0; custom = false; typed = \"\"; sync(); return; }\n    if (t.closest(\"[data-okolo-roll]\")) { roll(); return; }\n    if (t.closest(\"[data-okolo-result-close]\")) { root.removeAttribute(\"data-okolo-result\"); return; }\n  });\n  document.addEventListener(\"input\", function (e) {\n    var inp = e.target;\n    if (inp && inp.matches && inp.matches(\"[data-okolo-formula]\")) {\n      typed = inp.value;\n      custom = typed.trim() !== \"\";\n    }\n  });\n  document.addEventListener(\"keydown\", function (e) {\n    var inp = e.target;\n    if (e.key === \"Enter\" && inp && inp.matches && inp.matches(\"[data-okolo-formula]\")) { e.preventDefault(); roll(); }\n    if (e.key === \"Escape\") root.removeAttribute(\"data-okolo-dice\");\n  });\n  document.addEventListener(\"nav\", sync);\n  sync();\n})();\n"

/**
 * Рамка «Окологорье»: стена замка и меню сверху на всю ширину,
 * ниже две колонки: слева статья, справа игры, оглавление, граф, обратные ссылки,
 * случайные статьи и чат. Поверх всего облака, бабочки или светлячки и плеер.
 */
export const OkologorFrame: PageFrame = {
  name: "okologorye",
  css: SLIDE_CSS,
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    right,
    footer,
  }: PageFrameProps) {
    const slug = (componentData.fileData.slug ?? "index") as FullSlug
    const depth = slug.split("/").length - 1
    const root = depth === 0 ? "./" : "../".repeat(depth)
    const siteTitle = componentData.cfg.pageTitle
    const allFiles = componentData.allFiles

    // Первые части адресов всех страниц = названия папок верхнего уровня
    const topFolders = new Set<string>()
    for (const f of allFiles) {
      if (f.slug && f.slug.includes("/")) topFolders.add(f.slug.split("/")[0])
    }

    const homeHref = resolveRelative(slug, "index" as FullSlug)

    // Случайные статьи выбираются при сборке сайта (у каждой страницы свой набор)
    const pool = allFiles.filter(
      (f) =>
        f.slug &&
        f.slug !== slug &&
        f.slug !== "index" &&
        !f.slug.endsWith("/index") &&
        !f.slug.startsWith("tags/") &&
        f.frontmatter?.title,
    )
    const picks = pool
      .map((f) => ({ f, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .slice(0, RANDOM_COUNT)
      .map((x) => x.f)

    return (
      <>
        <script dangerouslySetInnerHTML={{ __html: EARLY_SCRIPT }} />

        <div class="okolo-clouds" aria-hidden="true">
          {CLOUDS.map((c) => (
            <i class="okolo-cloud" style={`--y:${c.y};--s:${c.s};--d:${c.d};--o:${c.o}`} />
          ))}
        </div>
        <div class="okolo-fly" aria-hidden="true">
          {BUTTERFLIES.map((b) => (
            <div
              class="okolo-bf"
              style={`--x:${b.x};--y:${b.y};--d:${b.d};--o:${b.o};--c:${b.c}`}
            >
              <svg viewBox="0 0 20 14">
                <g class="okolo-wing">
                  <path d="M10 7C4 0 0 3 2 8 4 10 8 9 10 7Z" />
                  <path d="M10 7C16 0 20 3 18 8 16 10 12 9 10 7Z" />
                </g>
              </svg>
            </div>
          ))}
          {FIREFLIES.map((f) => (
            <i
              class="okolo-firefly"
              style={`left:${f.x.toFixed(1)}vw;bottom:${f.y.toFixed(1)}vh;--dx:${f.dx.toFixed(0)}px;--dy:${f.dy.toFixed(0)}px;--d:${f.d.toFixed(1)}s;--g:${f.g.toFixed(1)}s;--o:${f.o.toFixed(1)}s;--o2:${f.o2.toFixed(1)}s;width:${f.size.toFixed(1)}px;height:${f.size.toFixed(1)}px`}
            />
          ))}
        </div>

        <div class="okolo-wall">
          <a class="okolo-wall-title" href={homeHref} aria-label={siteTitle}>
            <img src={`${root}static/theme/logo-age-of-heroes.webp`} alt="Age of Heroes" />
          </a>
        </div>
        <nav class="okolo-nav">
          <button class="okolo-burger" type="button" aria-label="Меню сайта">
            <span />
            <span />
            <span />
          </button>
          <div class="okolo-menu">
            {MENU.map((item) => {
              const seg = normalize(item.folder)
              const exists = topFolders.has(seg)
              const current = slug === seg || slug.startsWith(seg + "/")
              const href = resolveRelative(slug, `${seg}/index` as FullSlug)
              const cls = [current ? "current" : "", exists ? "" : "missing"].join(" ").trim()
              const subs = sortNodes(buildMenuTree(allFiles, seg))
              const renderNodes = (nodes: MenuNode[]) => (
                <ul class="okolo-sub">
                  {nodes.map((n) => {
                    const kids = sortNodes(n.children)
                    return (
                      <li class={kids.length ? "has-sub" : ""}>
                        <a href={resolveRelative(slug, `${n.path}/index` as FullSlug)}>{n.label}</a>
                        {kids.length > 0 && (
                          <button class="okolo-caret" type="button" aria-label="Показать подразделы" />
                        )}
                        {kids.length > 0 && renderNodes(kids)}
                      </li>
                    )
                  })}
                </ul>
              )
              return (
                <div class={subs.length ? "okolo-item has-sub" : "okolo-item"}>
                  <a
                    href={href}
                    class={cls}
                    title={exists ? undefined : `Папка «${item.folder}» не найдена в content`}
                  >
                    {item.label}
                  </a>
                  {subs.length > 0 && (
                    <button class="okolo-caret" type="button" aria-label="Показать подразделы" />
                  )}
                  {subs.length > 0 && renderNodes(subs)}
                </div>
              )
            })}
          </div>
          <div class="okolo-tools">
            <Header {...componentData}>
              {header.map((HeaderComponent) => (
                <HeaderComponent {...componentData} />
              ))}
            </Header>
            <button
              class="okolo-mute"
              type="button"
              data-okolo-mute
              title="Выключить все звуки"
              aria-label="Выключить или включить все звуки"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
                <path class="okolo-mute-wave" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
                <path class="okolo-mute-slash" d="M4 4l16 16" />
              </svg>
            </button>
          </div>
        </nav>
        <script dangerouslySetInnerHTML={{ __html: MENU_SCRIPT }} />
        <div class="okolo-cols">
          <div class="center">
            <div class="page-header">
              <div class="popover-hint">
                {beforeBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
            </div>
            {slug === "index" && (
              <div class="okolo-slides" aria-label="Рисунки автора">
                {SLIDES.map((sl, i) => (
                  <figure class="okolo-slide" style={`--i:${i}`}>
                    <img
                      src={`${root}static/slides/${sl.file}`}
                      alt={sl.caption}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <figcaption>{sl.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            <Content {...componentData} />
            <hr />
            <div class="page-footer">
              {afterBody.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </div>
          <div class="right sidebar">
            <a
              class="okolo-game"
              href="https://arcomage.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              data-router-ignore
            >
              <img src={`${root}static/theme/arcomage.webp`} alt="Аркомаг" loading="lazy" />
              <div class="okolo-game-title">Аркомаг</div>
              <div class="okolo-game-sub">Карточная игра таверн</div>
            </a>
            <a
              class="okolo-game"
              href={`${root}static/games/kosti.html`}
              target="_blank"
              rel="noopener"
              data-router-ignore
            >
              <img src={`${root}static/theme/kosti.webp`} alt="Кости" loading="lazy" />
              <div class="okolo-game-title">Кости</div>
              <div class="okolo-game-sub">Покер на костях</div>
            </a>
            <div class="okolo-links">
              <h3>Ресурсы</h3>
              <ul>
                <li>
                  <a
                    href="https://5e14.ttg.club/tools/ability-calc"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-router-ignore
                  >
                    Калькулятор характеристик
                  </a>
                  <span class="okolo-links-sub">TTG Club</span>
                </li>
                <li>
                  <a href="https://dnd.su/" target="_blank" rel="noopener noreferrer" data-router-ignore>
                    DnD.su
                  </a>
                  <span class="okolo-links-sub">справочник по D&amp;D 5-й редакции</span>
                </li>
              </ul>
            </div>
            {right.map((BodyComponent) => (
              <BodyComponent {...componentData} />
            ))}
            {picks.length > 0 && (
              <div class="okolo-random">
                <h3>Случайные статьи</h3>
                <ul>
                  {picks.map((p) => (
                    <li>
                      <a href={resolveRelative(slug, p.slug as FullSlug)}>
                        {p.frontmatter?.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {CHAT_URL && (
              <div class="okolo-chat">
                <h3>Чат</h3>
                <iframe src={CHAT_URL} title="Чат" loading="lazy" allow="clipboard-write; fullscreen" />
              </div>
            )}
          </div>
        </div>
        {footer.map((FooterComponent) => (
          <FooterComponent {...componentData} />
        ))}

        <div class="okolo-intro">
          <div class="okolo-intro-label">Мир Окологорья</div>
          <button type="button" class="okolo-skip" data-okolo-skip>
            Войти без музыки
          </button>
        </div>
        <div class="okolo-player">
          <button
            type="button"
            class="okolo-play"
            data-okolo-toggle
            aria-label="Играть или пауза"
          >
            <svg class="okolo-ico-play" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg class="okolo-ico-pause" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          </button>
          <div class="okolo-bar" data-okolo-seek>
            <div class="okolo-bar-fill" />
          </div>
          <span class="okolo-time" data-okolo-time>
            0:00 / --:--
          </span>
          <input
            type="range"
            class="okolo-volume"
            data-okolo-volume
            min="0"
            max="1"
            step="0.05"
            value="0.4"
            aria-label="Громкость"
          />
        </div>
        <script dangerouslySetInnerHTML={{ __html: PLAYER_SCRIPT }} />

        <button
          type="button"
          class="okolo-dice-fab"
          data-okolo-dice-toggle
          aria-label="Бросить кубики"
          title="Кубики"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d={DICE_PATH[20]} />
          </svg>
        </button>
        <div class="okolo-dice-panel">
          <div class="okolo-dice-grid">
            {DICE.map((d) => (
              <button type="button" class="okolo-die-btn" data-okolo-die={d} title={`d${d}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d={DICE_PATH[d]} />
                </svg>
                <span class="okolo-die-label">{`d${d}`}</span>
                <span class="okolo-die-badge" />
              </button>
            ))}
          </div>
          <div class="okolo-dice-row">
            <button type="button" class="okolo-dice-small" data-okolo-dice-reset title="Сбросить">
              ↺
            </button>
            <input
              type="text"
              class="okolo-dice-formula"
              data-okolo-formula
              placeholder="2d20kh1+3"
              aria-label="Формула броска"
              autocomplete="off"
            />
          </div>
          <div class="okolo-dice-row">
            <button type="button" class="okolo-dice-small" data-okolo-mod="-1" aria-label="Минус один">
              −
            </button>
            <span class="okolo-dice-mod" data-okolo-modval>
              0
            </span>
            <button type="button" class="okolo-dice-small" data-okolo-mod="1" aria-label="Плюс один">
              +
            </button>
            <button type="button" class="okolo-dice-roll" data-okolo-roll>
              Бросить
            </button>
          </div>
        </div>
        <div class="okolo-dice-result" data-okolo-result>
          <div class="okolo-dice-result-head">
            <span>Бросок</span>
            <b data-okolo-total />
          </div>
          <div class="okolo-dice-result-body" data-okolo-detail />
          <button type="button" class="okolo-dice-close" data-okolo-result-close aria-label="Закрыть">
            ×
          </button>
        </div>
        <script dangerouslySetInnerHTML={{ __html: DICE_SCRIPT }} />
      </>
    )
  },
}

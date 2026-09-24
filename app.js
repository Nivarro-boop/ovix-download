const svg = (paths) =>
  `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  windows: svg('<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>'),
  mac: svg('<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20"/>'),
  linux: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>'),
  android: svg('<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>'),
  ios: svg('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4"/>'),
  web: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  download: svg('<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>'),
  box: svg('<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
};

const PLATFORMS = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "Web",
};

const site = window.SITE || {};
const apps = (window.APPS || []).map((app) => ({ ...app, downloads: app.downloads || [] }));
const $ = (sel) => document.querySelector(sel);

const state = {
  platform: "all",
  query: "",
  sort: "new",
};

// ---------- Helpers ----------
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of [].concat(children)) if (child) node.append(child);
  return node;
}

function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/win/.test(ua)) return "windows";
  if (/mac/.test(ua)) return "mac";
  if (/linux|x11/.test(ua)) return "linux";
  return null;
}
const userPlatform = detectPlatform();

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}

function isNew(app) {
  if (!app.date) return false;
  const age = (Date.now() - new Date(app.date).getTime()) / 86400000;
  return age >= 0 && age <= (site.newDays ?? 30);
}

function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 1800);
}

async function copy(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    prompt("Kopieren:", text);
  }
}

function appIcon(app, large = false) {
  const cls = `app-icon${large ? " lg" : ""}`;
  if (app.icon) return el("img", { class: cls, src: app.icon, alt: "", loading: "lazy" });
  const icon = el("div", { class: cls, text: app.name.charAt(0).toUpperCase(), "aria-hidden": "true" });
  const c = app.color || "#6d5efc";
  icon.style.background = `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 60%, #000))`;
  return icon;
}

function downloadButton(d, { compact = false, text = null } = {}) {
  const label = PLATFORMS[d.platform] || d.platform;
  if (!d.file) {
    return el("span", { class: "btn btn-primary", "aria-disabled": "true" }, [
      el("span", { html: ICONS.clock }),
      el("span", { text: compact ? d.note || "Bald" : `${label} – ${d.note || "bald verfügbar"}` }),
    ]);
  }
  if (text) {
    const web = d.platform === "web";
    return el("a", { class: "btn btn-primary", href: d.file, download: web ? null : "", target: web ? "_blank" : null, rel: web ? "noopener" : null }, [
      el("span", { html: d.platform === "web" ? ICONS.web : ICONS.download }),
      el("span", { text: d.platform === "web" ? "Öffnen" : text }),
    ]);
  }
  const external = /^https?:\/\//.test(d.file) && d.platform === "web";
  return el(
    "a",
    {
      class: "btn btn-primary",
      href: d.file,
      download: external ? null : "",
      target: external ? "_blank" : null,
      rel: external ? "noopener" : null,
    },
    [
      el("span", { html: d.platform === "web" ? ICONS.web : ICONS.download }),
      el("span", { text: d.platform === "web" ? "Öffnen" : compact ? label : `Für ${label}` }),
      d.size ? el("small", { text: d.size }) : null,
    ]
  );
}

// Best download for a card: active filter, then visitor OS, then first available
function primaryDownload(app) {
  const list = app.downloads;
  const ready = (p) => list.find((d) => d.platform === p && d.file);
  return (
    (state.platform !== "all" && (ready(state.platform) || list.find((d) => d.platform === state.platform))) ||
    (userPlatform && ready(userPlatform)) ||
    list.find((d) => d.file) ||
    list[0]
  );
}

// ---------- Render ----------
function renderHeader() {
  const name = site.name || "Downloads";
  document.title = `${name} – Downloads`;
  $("#brand-name").textContent = name;
  $("#brand-mark").textContent = name.charAt(0).toUpperCase();
  if (site.title) $("#hero-title").innerHTML = site.title;
  $("#hero-tagline").textContent = site.tagline || "";
  $("#footer-text").textContent = `© ${new Date().getFullYear()} ${name}`;
  if (site.contact) {
    const contact = $("#contact");
    contact.href = site.contact;
    contact.hidden = false;
  }

  const platformCount = new Set(apps.flatMap((a) => a.downloads.map((d) => d.platform))).size;
  const latest = [...apps].filter((a) => a.date).sort((a, b) => b.date.localeCompare(a.date))[0];
  $("#stats").replaceChildren(
    el("span", { class: "stat" }, [el("span", { html: ICONS.box }), el("b", { text: apps.length }), " Apps"]),
    el("span", { class: "stat" }, [el("span", { html: ICONS.windows }), el("b", { text: platformCount }), " Plattformen"]),
    latest
      ? el("span", { class: "stat" }, [el("span", { html: ICONS.clock }), "Zuletzt aktualisiert ", el("b", { text: formatDate(latest.date) })])
      : null
  );
}

function renderFilters() {
  const used = new Set(apps.flatMap((a) => a.downloads.map((d) => d.platform)));
  const keys = ["all", ...Object.keys(PLATFORMS).filter((p) => used.has(p))];
  $("#filters").replaceChildren(
    ...keys.map((key) =>
      el(
        "button",
        {
          class: "pill",
          type: "button",
          "aria-pressed": String(key === state.platform),
          onclick: () => {
            state.platform = key;
            renderFilters();
            renderApps();
          },
        },
        [key === "all" ? null : el("span", { html: ICONS[key] }), key === "all" ? "Alle" : PLATFORMS[key]]
      )
    )
  );
}

function filteredApps() {
  const q = state.query.trim().toLowerCase();
  const list = apps.filter((app) => {
    const haystack = `${app.name} ${app.description} ${(app.changelog || []).join(" ")}`.toLowerCase();
    const matchesQuery = !q || haystack.includes(q);
    const matchesPlatform =
      state.platform === "all" || app.downloads.some((d) => d.platform === state.platform);
    return matchesQuery && matchesPlatform;
  });
  return list.sort((a, b) =>
    state.sort === "name"
      ? a.name.localeCompare(b.name, "de")
      : (b.date || "").localeCompare(a.date || "")
  );
}

function renderApps() {
  const list = filteredApps();
  $("#grid").replaceChildren(
    ...list.map((app, i) => {
      const card = el("article", { class: "card" }, [
        el("div", { class: "card-head" }, [
          appIcon(app),
          el("div", {}, [
            el("h2", {}, el("a", { class: "title-link", href: `#${app.id}`, text: app.name })),
            el("div", { class: "meta" }, [
              el("span", { class: "badge", text: `v${app.version}` }),
              isNew(app) ? el("span", { class: "badge new", text: "Neu" }) : null,
              app.date ? el("span", { text: formatDate(app.date) }) : null,
            ]),
          ]),
        ]),
        el("p", { class: "desc", text: app.description }),
        el(
          "div",
          { class: "platforms", "aria-label": "Plattformen" },
          [...new Set(app.downloads.map((d) => d.platform))].map((p) =>
            el("span", { title: PLATFORMS[p] || p, html: ICONS[p] || ICONS.box })
          )
        ),
        el("div", { class: "card-actions" }, [
          app.downloads.length ? downloadButton(primaryDownload(app), { compact: true }) : null,
          el("a", { class: "btn btn-ghost", href: `#${app.id}`, "aria-label": `Details zu ${app.name}` }, [
            el("span", { html: ICONS.info }),
            "Details",
          ]),
        ]),
      ]);
      card.style.animationDelay = `${Math.min(i, 8) * 40}ms`;
      return card;
    })
  );
  $("#empty").hidden = list.length > 0;
}

// ---------- Detail modal ----------
function openModal(app) {
  const modal = $("#modal");
  const section = (title, content) => el("section", {}, [el("h3", { text: title }), content]);

  modal.replaceChildren(
    el("div", { class: "modal-head" }, [
      appIcon(app, true),
      el("div", {}, [
        el("h2", { id: "modal-title", text: app.name }),
        el("div", { class: "meta" }, [
          el("span", { class: "badge", text: `v${app.version}` }),
          isNew(app) ? el("span", { class: "badge new", text: "Neu" }) : null,
          app.date ? el("span", { text: formatDate(app.date) }) : null,
        ]),
      ]),
      el("button", { class: "icon-btn", type: "button", "aria-label": "Schließen", html: ICONS.close, onclick: () => modal.close() }),
    ]),
    el("div", { class: "modal-body" }, [
      el("p", { text: app.description }),
      app.screenshots?.length
        ? el("div", { class: "shots" }, app.screenshots.map((src) => el("img", { src, alt: `Screenshot ${app.name}`, loading: "lazy" })))
        : null,
      section(
        "Download",
        el(
          "div",
          { class: "dl-table" },
          app.downloads.map((d) =>
            el("div", { class: "dl-row" }, [
              el("span", { html: ICONS[d.platform] || ICONS.box }),
              el("div", { class: "name" }, [
                el("b", { text: PLATFORMS[d.platform] || d.platform }),
                el("small", { text: [d.file && d.file.split("/").pop(), d.size].filter(Boolean).join(" · ") }),
                d.sha256
                  ? el("div", { class: "hash" }, [
                      "SHA-256",
                      el("code", { text: d.sha256 }),
                      el("button", { class: "link-btn", type: "button", text: "kopieren", onclick: () => copy(d.sha256, "Prüfsumme kopiert") }),
                    ])
                  : null,
              ]),
              downloadButton(d, { compact: true, text: "Laden" }),
            ])
          )
        )
      ),
      app.changelog?.length
        ? section("Was ist neu?", el("ul", { class: "changes" }, app.changelog.map((c) => el("li", { text: c }))))
        : null,
      el("div", { class: "links" }, [
        ...(app.links || []).map((l) =>
          el("a", { class: "btn btn-ghost", href: l.url, target: "_blank", rel: "noopener" }, [el("span", { html: ICONS.link }), l.label])
        ),
        el("button", {
          class: "btn btn-ghost",
          type: "button",
          onclick: () => copy(location.href, "Link kopiert"),
        }, [el("span", { html: ICONS.link }), "Link teilen"]),
      ]),
    ])
  );

  if (!modal.open) modal.showModal();
}

function syncModalWithHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const app = apps.find((a) => a.id === id);
  const modal = $("#modal");
  if (app) openModal(app);
  else if (modal.open) modal.close();
}

// ---------- Theme ----------
function currentTheme() {
  return document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function renderThemeButton() {
  $("#theme-toggle").innerHTML = currentTheme() === "dark" ? ICONS.sun : ICONS.moon;
}

// ---------- Events ----------
$("#search").addEventListener("input", (e) => {
  state.query = e.target.value;
  renderApps();
});
$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderApps();
});
$("#reset").addEventListener("click", () => {
  state.query = "";
  state.platform = "all";
  $("#search").value = "";
  renderFilters();
  renderApps();
});
$("#theme-toggle").addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
  renderThemeButton();
});

const modal = $("#modal");
modal.addEventListener("close", () => {
  if (location.hash) history.pushState("", document.title, location.pathname + location.search);
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close(); // click on backdrop
});
window.addEventListener("hashchange", syncModalWithHash);

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT" && !modal.open) {
    e.preventDefault();
    $("#search").focus();
  }
});

new IntersectionObserver(([entry]) => $("#toolbar").classList.toggle("stuck", entry.intersectionRatio < 1), {
  threshold: [1],
  rootMargin: "-1px 0px 0px 0px",
}).observe($("#toolbar"));

// ---------- Init ----------
// Filter stays on "Alle"; the visitor OS only picks each card's main button
renderHeader();
renderThemeButton();
renderFilters();
renderApps();
syncModalWithHash();

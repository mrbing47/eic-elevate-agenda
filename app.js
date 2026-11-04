/*
 * ANZ EIC Elevate — live agenda timeline.
 * Plain JavaScript, no dependencies. Reads window.EVENT_AGENDA from agenda.js.
 */
(() => {
  "use strict";

  const MINUTE = 60 * 1000;
  const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
  const NOW_RE = /^(?:(\d{4})-(\d{2})-(\d{2})[T ])?([01]?\d|2[0-3]):([0-5]\d)$/;

  const $ = (id) => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  // Updates text only when it differs; returns whether it changed.
  const setText = (el, text) => {
    if (el.textContent === text) return false;
    el.textContent = text;
    return true;
  };

  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key === "class") el.className = value;
      else if (key === "text") el.textContent = value;
      else el.setAttribute(key, value);
    }
    for (const child of children.flat()) {
      if (child != null && child !== false && child !== "") el.append(child);
    }
    return el;
  }

  const timelineEl = $("timeline");
  const showProblem = (message) => timelineEl.replaceChildren(h("li", { class: "notice", text: message }));

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------
  const config = window.EVENT_AGENDA;
  if (!config || !Array.isArray(config.sessions)) {
    showProblem("Agenda data not found. Check agenda.js.");
    return;
  }

  const dateMatch = DATE_RE.exec(String(config.date || "").trim());
  if (!dateMatch) {
    showProblem('Set the event date in agenda.js as "YYYY-MM-DD".');
    return;
  }
  const [Y, M, D] = dateMatch.slice(1).map(Number);

  const timeZone = resolve("timeZone", config.timeZone);
  const locale = resolve("locale", config.locale);

  function resolve(kind, value) {
    if (!value) return undefined;
    try {
      kind === "locale"
        ? new Intl.DateTimeFormat(value)
        : new Intl.DateTimeFormat("en-US", { timeZone: value });
      return value;
    } catch {
      console.warn(`[agenda] Ignoring unknown ${kind} "${value}" from agenda.js.`);
      return undefined;
    }
  }

  // ---------------------------------------------------------------------------
  // Time-zone aware date maths
  // ---------------------------------------------------------------------------
  const wallClock = timeZone && new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  });

  // Difference between the event's wall-clock time and UTC at instant `ms`.
  function zoneOffset(ms) {
    const p = {};
    for (const { type, value } of wallClock.formatToParts(new Date(ms))) p[type] = value;
    const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return asUtc - Math.floor(ms / 1000) * 1000;
  }

  // Absolute timestamp for a wall-clock date/time in the event's time zone.
  function instant(year, month, day, hour, minute) {
    if (!timeZone) return new Date(year, month - 1, day, hour, minute).getTime();
    const wall = Date.UTC(year, month - 1, day, hour, minute);
    return wall - zoneOffset(wall - zoneOffset(wall));
  }

  // Calendar date [year, month, day] at instant `ms`, in the event's time zone.
  function dateAt(ms) {
    if (!timeZone) {
      const d = new Date(ms);
      return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    }
    const p = {};
    for (const { type, value } of wallClock.formatToParts(new Date(ms))) p[type] = value;
    return [+p.year, +p.month, +p.day];
  }

  // Whole calendar days from instant `ms` until the event date (immune to DST shifts).
  function daysToEvent(ms) {
    const [y, m, d] = dateAt(ms);
    return Math.round((Date.UTC(Y, M - 1, D) - Date.UTC(y, m - 1, d)) / (24 * 60 * MINUTE));
  }

  const fmt = {
    time: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone }),
    clock: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", second: "2-digit", timeZone }),
    date: new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone }),
    shortDate: new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone }),
    zone: new Intl.DateTimeFormat(locale, { timeZoneName: "short", timeZone }),
  };

  // Splits a formatted time into its digits and day period, e.g. ["1:30", "pm"].
  function timeParts(ms, formatter = fmt.time) {
    let main = "";
    let period = "";
    for (const { type, value } of formatter.formatToParts(new Date(ms))) {
      if (type === "dayPeriod") period = value;
      else main += value;
    }
    return [main.trim(), period];
  }

  const formatRange = (a, b) =>
    typeof fmt.time.formatRange === "function"
      ? fmt.time.formatRange(new Date(a), new Date(b))
      : `${fmt.time.format(a)} – ${fmt.time.format(b)}`;

  function formatDuration(ms, round = Math.round) {
    const total = Math.max(0, round(ms / MINUTE));
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    if (!hours) return `${minutes} min`;
    return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
  }

  // ---------------------------------------------------------------------------
  // Sessions
  // ---------------------------------------------------------------------------
  // A link's address: a web page or a file next to this page, never javascript: and the like.
  function safeHref(raw) {
    const value = String(raw ?? "").trim();
    if (!value) return null;
    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", location.protocol].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  // Optional details shown once a session starts:
  // { text, links: [{ label, url, heading, qr }], steps: ["...", "..."] }.
  // heading puts the link in its own box under that title; qr adds an image of
  // a QR code for the link (e.g. "assets/qr/app.svg") to that box.
  function readDetails(raw, i) {
    if (raw == null) return null;
    const text = typeof raw.text === "string" ? raw.text.trim() : "";
    const links = [];
    for (const link of [].concat(raw.links ?? [])) {
      const label = String(link?.label ?? "").trim();
      const href = safeHref(link?.url);
      if (!label || !href) {
        console.warn(`[agenda] Skipping a link in session #${i + 1}: it needs a label and a web address.`, link);
        continue;
      }
      const heading = typeof link.heading === "string" ? link.heading.trim() : "";
      if (link.heading != null && !heading) console.warn(`[agenda] Ignoring the heading for "${label}" in session #${i + 1}: it needs some text.`, link.heading);
      const qr = link.qr == null ? null : safeHref(link.qr);
      if (link.qr != null && !qr) console.warn(`[agenda] Ignoring the QR code for "${label}" in session #${i + 1}: give it an image path.`, link.qr);
      links.push({ label, href, heading, qr });
    }
    const steps = [];
    for (const step of [].concat(raw.steps ?? [])) {
      const value = typeof step === "string" ? step.trim() : "";
      if (value) steps.push(value);
      else console.warn(`[agenda] Skipping a step in session #${i + 1}: each step is a line of text.`, step);
    }
    if (text || links.length || steps.length) return { text, links, steps };
    console.warn(`[agenda] Ignoring details for session #${i + 1}: give it text, links and/or steps.`, raw);
    return null;
  }

  // Optional people, e.g. a session's speakers or the event's hosts:
  // [{ name, role, photo }]. Only the name is required. `where` names the
  // place in agenda.js for warnings, e.g. "session #3".
  function readPeople(raw, where) {
    const people = [];
    for (const person of [].concat(raw ?? [])) {
      const name = typeof person?.name === "string" ? person.name.trim() : "";
      if (!name) {
        console.warn(`[agenda] Skipping a person in ${where}: they need a name.`, person);
        continue;
      }
      const role = typeof person.role === "string" ? person.role.trim() : "";
      if (person.role != null && !role) console.warn(`[agenda] Ignoring the role for "${name}" in ${where}: it needs some text.`, person.role);
      const photo = person.photo == null ? null : safeHref(person.photo);
      if (person.photo != null && !photo) console.warn(`[agenda] Ignoring the photo for "${name}" in ${where}: give it an image path.`, person.photo);
      people.push({ name, role, photo });
    }
    return people;
  }

  // A list of people: round photo, then name and role. The name is right
  // beside each photo, so the photo itself needs no alt text.
  function peopleList(people) {
    return h("ul", { class: "people" },
      people.map(({ name, role, photo }) => h("li", { class: "person" },
        photo && h("img", { class: "person-photo", src: photo, alt: "" }),
        h("span", { class: "person-text" },
          h("span", { class: "person-name", text: name }),
          role && h("span", { class: "person-role", text: role })))));
  }

  const sessions = config.sessions
    .map((s, i) => {
      const start = TIME_RE.exec(String(s?.start ?? "").trim());
      const end = TIME_RE.exec(String(s?.end ?? "").trim());
      if (!s?.title || !start || !end) {
        console.warn(`[agenda] Skipping session #${i + 1}: it needs a title plus start/end as "HH:MM".`, s);
        return null;
      }
      const startMs = instant(Y, M, D, +start[1], +start[2]);
      let endMs = instant(Y, M, D, +end[1], +end[2]);
      if (endMs < startMs) endMs = instant(Y, M, D + 1, +end[1], +end[2]); // runs past midnight
      return { ...s, startMs, endMs, details: readDetails(s.details, i), people: readPeople(s.people, `session #${i + 1}`) };
    })
    .filter(Boolean)
    .sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);

  if (!sessions.length) {
    showProblem("No sessions yet. Add some to agenda.js.");
    return;
  }

  const count = sessions.length;
  const dayStart = sessions[0].startMs;
  const dayEnd = Math.max(...sessions.map((s) => s.endMs));
  // "Coming up" / "Up next" only appear from midnight on the event day (event time zone).
  const eventDayStart = instant(Y, M, D, 0, 0);

  // Preview: ?now=HH:MM (or YYYY-MM-DDTHH:MM) starts the clock at another moment,
  // ?speed=60 runs it 60x faster. Only the clock speeds up: the pulses, glows
  // and glides keep their normal pace. ?details=all shows every session's
  // details straight away instead of when it starts, e.g. for reviewing the page.
  const params = new URLSearchParams(location.search);
  const previewStart = (() => {
    const raw = params.get("now");
    if (!raw) return null;
    const m = NOW_RE.exec(raw.trim());
    if (!m) {
      console.warn(`[agenda] Ignoring ?now=${raw}. Use HH:MM or YYYY-MM-DDTHH:MM.`);
      return null;
    }
    return m[1] ? instant(+m[1], +m[2], +m[3], +m[4], +m[5]) : instant(Y, M, D, +m[4], +m[5]);
  })();
  const speed = clamp(Number(params.get("speed")) || 1, 1, 3600);
  const showAllDetails = (() => {
    const raw = params.get("details");
    if (raw == null) return false;
    if (raw.trim().toLowerCase() === "all") return true;
    console.warn(`[agenda] Ignoring ?details=${raw}. Use ?details=all.`);
    return false;
  })();
  const simulatedTime = previewStart !== null || speed !== 1;
  const isPreview = simulatedTime || showAllDetails;
  const loadedAt = Date.now();
  const clockStart = previewStart ?? loadedAt;
  const now = () => clockStart + (Date.now() - loadedAt) * speed;

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  function cssHex(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const m = /^#([\da-f]{6})$/i.exec(value);
    return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : fallback;
  }

  const brandStops = [
    cssHex("--eic-blue", [9, 52, 241]),
    cssHex("--eic-violet", [97, 14, 239]),
    cssHex("--eic-purple", [161, 3, 215]),
  ];

  // Colour at position t (0..1) along the brand gradient, so the rail flows blue -> purple.
  function brandAt(t) {
    const x = clamp(t, 0, 1) * (brandStops.length - 1);
    const i = Math.min(Math.floor(x), brandStops.length - 2);
    const f = x - i;
    const rgb = brandStops[i].map((v, k) => Math.round(v + (brandStops[i + 1][k] - v) * f));
    return `rgb(${rgb.join(" ")})`;
  }

  function timeEl(ms, className) {
    const [main, period] = timeParts(ms);
    return h("time", { class: className, datetime: new Date(ms).toISOString() },
      main, period && h("span", { class: "ampm", text: period }));
  }

  sessions.forEach((s, i) => {
    const isBreak = s.type === "break";
    const metaParts = [formatRange(s.startMs, s.endMs), formatDuration(s.endMs - s.startMs), s.location]
      .filter(Boolean)
      .map((text) => h("span", { class: "meta-part", text }));

    s.id = `session-${i + 1}`;
    // The rail segment runs from this session's start to the next session's start.
    s.segmentEndMs = i + 1 < count ? sessions[i + 1].startMs : dayEnd;
    s.fillEl = h("span", { class: "track-fill" });
    s.pointerEl = h("span", { class: "pointer" });
    s.chipEl = h("span", { class: "now-chip" });
    s.trackEl = h("div", { class: "track" }, s.fillEl, h("span", { class: "node" }), s.pointerEl, s.chipEl);
    s.barEl = h("span", { class: "progress-fill" });
    s.elapsedEl = h("span", { class: "progress-elapsed" });
    s.leftEl = h("span", { class: "progress-left" });
    s.progressEl = h("div", {
      class: "progress", role: "progressbar", "aria-label": "Session progress",
      "aria-valuemin": "0", "aria-valuemax": "100",
    },
      h("div", { class: "progress-track" }, s.barEl),
      h("div", { class: "progress-text" }, s.elapsedEl, s.leftEl));

    // Built now, but only added to the card once the session starts (see tick).
    // A link with a heading or QR code gets its own box: heading, QR code, then
    // the button, which is the only part you click. With QR codes, larger
    // screens show the boxes beside the steps (see styles.css).
    const hasQr = s.details?.links.some((link) => link.qr);
    s.detailsEl = s.details && h("div", { class: hasQr && s.details.steps.length > 0 ? "details details-split" : "details" },
      s.details.text && h("p", { class: "details-text", text: s.details.text }),
      s.details.links.length > 0 && h("ul", { class: "details-links" },
        s.details.links.map(({ label, href, heading, qr }) => h("li", { class: heading || qr ? "details-box" : null },
          heading && h("p", { class: "details-box-heading", text: heading }),
          qr && h("img", { class: "details-qr", src: qr, alt: "" }),
          h("a", { class: "details-link", href, target: "_blank", rel: "noopener" },
            label, h("span", { class: "visually-hidden", text: " (opens in a new tab)" }))))),
      s.details.steps.length > 0 && h("ol", { class: "details-steps" },
        s.details.steps.map((step) => h("li", { text: step }))));

    s.el = h("li", { class: isBreak ? "item is-break" : "item", id: s.id },
      h("div", { class: "item-time" }, timeEl(s.startMs, "item-start")),
      h("div", { class: "rail", "aria-hidden": "true" }, s.trackEl),
      h("div", { class: "item-body" },
        h("article", { class: "card" },
          h("div", { class: "card-top" },
            h("span", { class: "badge badge-live" }, h("span", { class: "badge-dot" }), "Now"),
            h("span", { class: "badge badge-next", text: "Up next" }),
            h("p", { class: "meta" }, metaParts)),
          h("h2", { class: "title", text: s.title }),
          s.speaker && h("p", { class: "speaker", text: s.speaker }),
          s.description && h("p", { class: "desc", text: s.description }),
          s.people.length > 0 && peopleList(s.people),
          s.progressEl)));

    s.el.style.setProperty("--c1", brandAt(i / count));
    s.el.style.setProperty("--c2", brandAt((i + 1) / count));
  });

  const thanksText = config.title ? `Thanks for attending ${config.title}!` : "Thanks for attending!";

  // The end row also thanks everyone once the event is over.
  const endEl = h("li", { class: "item item-end" },
    h("div", { class: "item-time" }, timeEl(dayEnd, "item-start")),
    h("div", { class: "rail", "aria-hidden": "true" }, h("div", { class: "track" }, h("span", { class: "node" }))),
    h("div", { class: "item-body" },
      h("p", { class: "end-label" },
        h("span", { text: "End of day" }),
        h("span", { class: "end-thanks", text: thanksText }))));
  endEl.style.setProperty("--c1", brandAt(1));

  timelineEl.replaceChildren(...sessions.map((s) => s.el), endEl);

  // Header & footer
  const zoneAt = (ms) => fmt.zone.formatToParts(new Date(ms)).find((p) => p.type === "timeZoneName")?.value || "";
  const city = timeZone ? timeZone.split("/").pop().replace(/_/g, " ") : "";
  const eventZone = zoneAt(dayStart);

  document.title = `${isPreview ? "[Preview] " : ""}Agenda · ${config.title || "ANZ EIC Elevate"}`;
  setText($("event-date"), fmt.date.format(dayStart));
  if (config.venue) setText($("event-venue"), config.venue);
  else $("event-venue").hidden = true;

  // Event theme: words wrapped in *asterisks* get the brand highlight.
  const theme = typeof config.theme === "string" ? config.theme.trim() : "";
  if (theme) {
    const themeEl = $("event-theme");
    themeEl.replaceChildren(...theme.split(/\*([^*]+)\*/)
      .map((part, i) => (i % 2 ? h("span", { class: "theme-accent", text: part }) : part)));
    themeEl.hidden = false;
  }

  // The event's hosts, above the timeline all day
  const hosts = readPeople(config.hosts, "hosts");
  if (hosts.length) {
    const hostsEl = $("event-hosts");
    hostsEl.append(peopleList(hosts));
    hostsEl.hidden = false;
    // Line the hosts up with the first session time below them. The times are
    // right-aligned, so where they start depends on the text: measure it, and
    // again whenever its size changes (fonts loading, screen size).
    const firstTime = timelineEl.querySelector(".item-start");
    new ResizeObserver(() => {
      const inset = firstTime.getBoundingClientRect().left - timelineEl.getBoundingClientRect().left;
      hostsEl.style.setProperty("--time-inset", `${inset}px`);
    }).observe(firstTime);
  }
  setText($("clock-label"), city ? `${city} time · ${zoneAt(now())}` : "Local time");
  setText($("footer-note"), `All times are ${city ? `${city} time` : "local time"}${eventZone ? ` (${eventZone})` : ""}.`);
  $("preview-flag").hidden = !isPreview;
  if (isPreview) {
    setText($("preview-flag"), ["Preview", simulatedTime && "simulated time", showAllDetails && "all details shown"]
      .filter(Boolean).join(" · "));
  }

  const clockEl = $("clock-time");
  const clockDigits = h("span", { class: "clock-digits" });
  const clockPeriod = h("span", { class: "ampm" });
  clockEl.replaceChildren(clockDigits, clockPeriod);

  const statusEl = $("status");
  const status = {
    badge: $("status-badge"),
    title: $("status-title"),
    meta: $("status-meta"),
    next: $("status-next"),
    clock: $("status-clock"),
    announce: $("status-announce"),
  };

  // When the title would be cut off, stack the bar: badge, time left and clock
  // on top, the full title on its own line below.
  function fitStatus() {
    statusEl.classList.remove("is-stacked");
    const { title } = status;
    statusEl.classList.toggle("is-stacked", title.scrollWidth > title.clientWidth + 1);
  }

  // Sets the status title, optionally led by a styled countdown such as "T−31".
  // The countdown is updated in place, so its orbiting glow keeps turning when
  // the number changes. Returns whether anything changed.
  const leadText = h("span", { class: "status-lead-text" });
  const leadEl = h("span", { class: "status-lead" }, leadText);
  const titleText = document.createTextNode("");

  function setTitle(lead, text) {
    const el = status.title;
    if (!lead) return setText(el, text);
    const attached = el.firstChild === leadEl;
    if (!attached) el.replaceChildren(leadEl, titleText);
    const changed = [setText(leadText, lead), setText(titleText, ` ${text}`)].includes(true);
    return !attached || changed;
  }

  let statusWidth = 0;
  new ResizeObserver(([entry]) => {
    // Stacking only changes the height, so reacting to width alone can't loop.
    if (entry.contentRect.width === statusWidth) return;
    statusWidth = entry.contentRect.width;
    fitStatus();
  }).observe(statusEl);
  document.fonts.addEventListener("loadingdone", fitStatus);

  // ---------------------------------------------------------------------------
  // Keeping the current session in view
  // ---------------------------------------------------------------------------
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let lastInteraction = 0;
  for (const type of ["wheel", "touchstart", "keydown", "mousedown"]) {
    addEventListener(type, () => { lastInteraction = Date.now(); }, { passive: true });
  }

  function bringIntoView(el) {
    const rect = el.getBoundingClientRect();
    const top = Math.max(statusEl.getBoundingClientRect().bottom, 0);
    if (rect.top >= top && rect.bottom <= innerHeight) return;
    el.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: rect.height < (innerHeight - top) * 0.8 ? "center" : "start",
    });
  }

  let focusEl; // undefined until the first tick
  let scrollOwed = false; // focusEl changed but the page hasn't been brought to it yet

  function follow(el) {
    if (el !== focusEl) {
      const isFirst = focusEl === undefined;
      focusEl = el;
      scrollOwed = !!el;
      if (isFirst && el) {
        if (location.hash) {
          lastInteraction = Date.now(); // honour a #session link for a minute first
        } else {
          scrollOwed = false;
          document.fonts.ready.then(() => bringIntoView(el));
        }
      }
    }
    // Don't yank the page while someone is reading it: catch up after a minute idle.
    if (scrollOwed && Date.now() - lastInteraction > MINUTE) {
      scrollOwed = false;
      bringIntoView(focusEl);
    }
  }

  // The top bar shows its own clock only once the big one has scrolled
  // completely out of view, so the time is never on screen twice. (The bar
  // sits below the header until the header has gone, so it never covers it.)
  new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      statusEl.classList.toggle("show-clock", !entry.isIntersecting);
      fitStatus();
    },
  ).observe(clockEl);

  // ---------------------------------------------------------------------------
  // The "now" pointer, rail fill and progress bar advance once a minute. JS sets
  // the new position and a CSS transition glides it there on the GPU.
  // ---------------------------------------------------------------------------
  let pointerRow = null;
  let liveRows = [];

  // Fraction of [start, end] that has passed, counted in whole minutes.
  const minuteProgress = (t, start, end) =>
    clamp((Math.floor(t / MINUTE) * MINUTE - start) / Math.max(end - start, 1), 0, 1);

  // Layout changes (fonts loading, window resizes) re-place the pointer without a glide.
  const layoutWatcher = new ResizeObserver(() => paintMotion(true));

  // Length of one glide (--glide in styles.css). A new glide waits for the last
  // one to finish, so a fast ?speed preview plays the same full glide, just more
  // often, rather than cutting each one short.
  const glideMs = (() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--glide").trim();
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return 800;
    return /^[\d.]+ms/.test(value) ? n : n * 1000;
  })();
  let paintedMinute = null;
  let glideStartedAt = -Infinity;

  function paintMotion(snap = false) {
    const t = now();
    const minute = Math.floor(t / MINUTE);
    if (!snap) {
      if (minute === paintedMinute) return; // nothing has moved
      if (performance.now() - glideStartedAt < glideMs) return; // let the current glide finish
      glideStartedAt = performance.now();
    }
    paintedMinute = minute;
    const s = pointerRow;
    if (snap) timelineEl.classList.add("no-glide");
    if (s) {
      const p = minuteProgress(t, s.startMs, s.segmentEndMs);
      // Read layout first, then write, so updates never force a synchronous reflow.
      const y = p * s.trackEl.getBoundingClientRect().height;
      const chipHalf = s.chipEl.offsetHeight / 2;
      s.pointerEl.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      // Whole pixels keep the chip's text crisp.
      s.chipEl.style.transform = `translateY(${Math.round(y - chipHalf)}px)`;
      s.fillEl.style.clipPath = `inset(0 0 ${(100 - p * 100).toFixed(3)}% 0)`;
    }
    for (const r of liveRows) {
      const p = minuteProgress(t, r.startMs, r.endMs);
      r.barEl.style.clipPath = `inset(0 ${(100 - p * 100).toFixed(3)}% 0 0 round 999px)`;
    }
    if (snap) {
      void timelineEl.offsetHeight; // apply the new positions before re-enabling the glide
      timelineEl.classList.remove("no-glide");
    }
  }

  // Only minute-to-minute steps glide; a new pointer row or live session is
  // placed instantly. Returns whether the pointer row or live sessions changed.
  function setMotion(row, live) {
    const changed = row !== pointerRow || live.length !== liveRows.length || live.some((r, i) => r !== liveRows[i]);
    if (row !== pointerRow) {
      if (pointerRow) {
        pointerRow.fillEl.style.removeProperty("clip-path");
        layoutWatcher.unobserve(pointerRow.trackEl);
      }
      pointerRow = row;
      if (row) layoutWatcher.observe(row.trackEl);
    }
    liveRows = live;
    paintMotion(changed);
    return changed;
  }

  // The "Now" dots and the pointer's outer ring share one fade (CSS live-pulse).
  // One that starts later, e.g. on the next back-to-back session, is lined up
  // with one already running so they all brighten and dim together. Pulses only
  // start when a session or the bar's state changes, so this runs just then.
  function syncPulses() {
    const pulses = document.getAnimations().filter((a) => a.animationName === "live-pulse");
    const start = pulses.find((a) => a.startTime !== null)?.startTime;
    if (start == null) return; // all just started together this frame
    for (const a of pulses) if (a.startTime !== start) a.startTime = start;
  }

  // ---------------------------------------------------------------------------
  // Live updates
  // ---------------------------------------------------------------------------
  function tick() {
    const t = now();
    const beforeEventDay = t < eventDayStart;

    const [digits, period] = timeParts(t, fmt.clock);
    setText(clockDigits, digits);
    setText(clockPeriod, period);
    const clockChanged = setText(status.clock, fmt.time.format(t));

    let live = null;
    let next = null;
    let pointer = null;
    const liveNow = [];

    sessions.forEach((s) => {
      const isLive = t >= s.startMs && t < s.endMs;
      const isPast = t >= s.endMs;
      const hasPointer = t >= s.startMs && t < s.segmentEndMs;

      if (isLive) liveNow.push(s);
      if (isLive && !live) live = s;
      if (hasPointer) pointer = s;
      if (!next && t < s.startMs) next = s;

      s.el.classList.toggle("is-live", isLive);
      s.el.classList.toggle("is-past", isPast);
      s.el.classList.toggle("has-pointer", hasPointer);
      if (isLive) s.el.setAttribute("aria-current", "time");
      else s.el.removeAttribute("aria-current");

      s.el.classList.toggle("rail-done", t >= s.segmentEndMs);
      if (hasPointer) setText(s.chipEl, fmt.time.format(t));

      // Details (e.g. slides) join the card when the session starts and stay
      // afterwards; with ?details=all they're there from the start.
      const showDetails = showAllDetails || t >= s.startMs;
      if (s.detailsEl && showDetails !== s.detailsEl.isConnected) {
        if (showDetails) s.progressEl.before(s.detailsEl);
        else s.detailsEl.remove();
      }

      if (isLive) {
        const elapsed = t - s.startMs;
        s.progressEl.setAttribute("aria-valuenow", String(Math.round(minuteProgress(t, s.startMs, s.endMs) * 100)));
        setText(s.elapsedEl, elapsed < MINUTE ? "Just started" : `${formatDuration(elapsed, Math.floor)} in`);
        setText(s.leftEl, `${formatDuration(s.endMs - t, Math.ceil)} left`);
      }
    });

    const upNext = beforeEventDay ? null : next;
    for (const s of sessions) s.el.classList.toggle("is-next", !!upNext && s.startMs === upNext.startMs);
    endEl.classList.toggle("is-past", t >= dayEnd);
    const motionChanged = setMotion(pointer, liveNow);

    let state;
    let badge = "";
    let lead = "";
    let title;
    let target = null;
    let meta = "";
    let nextText = "";

    if (beforeEventDay) {
      // Countdown until the event day; "Coming up" / "Up next" start at midnight on the day.
      const days = daysToEvent(t);
      state = "early";
      lead = `T\u2212${days}`;
      title = `${days === 1 ? "day" : "days"} till the event`;
      meta = `${fmt.shortDate.format(dayStart)} · ${fmt.time.format(dayStart)}`;
    } else if (live) {
      state = "live";
      badge = "Now";
      title = live.title;
      target = live;
      meta = `${formatDuration(live.endMs - t, Math.ceil)} left`;
      if (next) nextText = `Next ${fmt.time.format(next.startMs)} · ${next.title}`;
    } else if (t < dayStart) {
      state = "before";
      badge = "Coming up";
      title = sessions[0].title;
      target = sessions[0];
      meta = `Starts in ${formatDuration(dayStart - t, Math.ceil)}`;
    } else if (next) {
      state = "gap";
      badge = "Up next";
      title = next.title;
      target = next;
      meta = `Starts in ${formatDuration(next.startMs - t, Math.ceil)}`;
    } else {
      state = "done";
      badge = "That's a wrap";
      title = thanksText;
    }

    const stateChanged = statusEl.dataset.state !== state;
    statusEl.dataset.state = state;
    const textChanged = [
      setText(status.badge, badge),
      setTitle(lead, title),
      setText(status.meta, meta),
      setText(status.next, nextText),
    ].includes(true);
    const spoken = lead ? `${lead} ${title}` : title;
    setText(status.announce, badge ? `${badge}: ${spoken}` : spoken);
    if (target) status.title.setAttribute("href", `#${target.id}`);
    else status.title.removeAttribute("href");
    if (textChanged || clockChanged) fitStatus();
    if (motionChanged || stateChanged) syncPulses();

    follow(beforeEventDay ? null : live ? live.el : next ? next.el : endEl);
  }

  let lastTickError = "";
  function safeTick() {
    try {
      tick();
      lastTickError = "";
    } catch (err) {
      // Log a repeating failure once instead of every second.
      if (String(err) !== lastTickError) console.error("[agenda] Update failed; will retry.", err);
      lastTickError = String(err);
    }
  }

  function loop() {
    safeTick();
    // Wake just after the next (simulated) second, at most ~20 times a second when fast-forwarding.
    setTimeout(loop, Math.max((1000 - (now() % 1000)) / speed, 50) + 15);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) safeTick();
  });

  loop();
})();

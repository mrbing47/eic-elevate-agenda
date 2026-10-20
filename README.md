# ANZ EIC Elevate: live agenda

A static, dependency-free agenda site (HTML + CSS + vanilla JS). Sessions are laid out on a timeline. A pointer moves along the timeline to show how far the current session has progressed, and the live session is shown with bigger text.

Before the event day, the top bar shows a countdown (e.g. "T−31 days till the event") with the event's date. "Coming up", "Up next" and the live highlights appear from midnight on the event day (in the event's time zone).

If the device's reduce-motion setting is on, the "Now" dots, the pointer's ring and the countdown's glow stand still.

## Run

Open `index.html` in a browser. No build step or server is needed.

The Inter font is bundled in `assets/fonts/` under the SIL Open Font License (see `assets/fonts/OFL.txt`), so the page makes no external requests.

## Edit the agenda

Everything lives in [`agenda.js`](agenda.js):

| Field | Example | Notes |
| --- | --- | --- |
| `date` | `"2026-11-06"` | Event day |
| `timeZone` | `"Australia/Sydney"` | Time zone the session times are written in |
| `sessions[].start` / `end` | `"13:30"` | 24-hour time |
| `sessions[].speaker`, `location`, `description` | | Optional |
| `sessions[].type` | `"break"` | Optional, gives a lighter card |
| `sessions[].details` | `{ links: [{ label: "Slides", url: "https://…" }] }` | Optional. Appears when the session starts and stays afterwards. Can also have `text` |

`details` is only hidden on the page. Anyone who opens `agenda.js` (or this repository) can read it early, so if slides must stay private until the session, add the link (or share the file) when the session starts.

## Preview a moment in time

Add `?now=` to the URL to see the page as it would look at another time:

- `index.html?now=10:45` – on the event day
- `index.html?now=2026-11-05T18:00` – any date/time (in the event's time zone)
- `index.html?now=10:45&speed=60` – also runs the clock 60× faster, so you can watch the pointer move and the sessions change. Only the clock speeds up; the pulses, glows and glides keep their normal pace.

## Deploy

Upload the folder as-is to any static host, such as Azure Static Web Apps, an Azure Storage static website, GitHub Pages or an internal web server.

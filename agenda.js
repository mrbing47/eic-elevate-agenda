/*
 * ANZ EIC Elevate — agenda data
 * ----------------------------------------------------------------------------
 * This is the only file you need to edit to update the agenda.
 *
 *   date      Event day as "YYYY-MM-DD".
 *   timeZone  IANA time zone the session times are written in, e.g.
 *             "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland".
 *             Live progress is then correct on any device, wherever it is.
 *   sessions  start / end use 24-hour "HH:MM". Optional fields:
 *               speaker, location, description,
 *               type: "break"  -> renders as a lighter card,
 *               details        -> appears when the session starts and stays
 *                                 after it ends, e.g. for slides:
 *                   details: { links: [{ label: "Slides", url: "https://..." }] }
 *                 Add text: "..." for a line of text. It's only hidden on the
 *                 page: anyone can read this file, so keep secrets out of it.
 *
 * Preview the page at any moment by adding ?now=HH:MM (or
 * ?now=YYYY-MM-DDTHH:MM) to the URL, e.g. index.html?now=10:45
 * Add &speed=60 to run the clock 60x faster.
 */
window.EVENT_AGENDA = {
  title: "ANZ EIC Elevate",
  date: "2026-11-06",
  timeZone: "Australia/Sydney",
  locale: "en-AU",
  venue: "Sydney",

  sessions: [
    {
      start: "08:30", end: "08:50",
      title: "Registration",
      description: "Name tags and goodie bags",
      type: "break"
    },
    {
      start: "08:50", end: "09:00",
      title: "MC",
      description: "Housekeeping"
    },
    {
      start: "09:00", end: "09:15",
      title: "EIC Exec Sponsor Intro",
      speaker: "Erika + Adam"
    },
    {
      start: "09:15", end: "09:30",
      title: "Kick off + Icebreaker",
      description: "Icebreaker activity"
    },
    {
      start: "09:30", end: "09:50",
      title: "Keynote",
      speaker: "Charles Gray",
      description: "Theme: EIC focus"
    },
    {
      start: "09:50", end: "10:10",
      title: "Morning Tea",
      type: "break"
    },
    {
      start: "10:10", end: "11:00",
      title: "Anthropic",
      description: "Talk + Q&A"
    },
    {
      start: "11:00", end: "11:15",
      title: "Mini activity - NFC LinkedIn card reader"
    },
    {
      start: "11:15", end: "12:00",
      title: "EIC Alumni fireside chat session",
      description: "Panel (mix of EIC alumni & EIC manager), Q&A"
    },
    {
      start: "12:00", end: "13:00",
      title: "Lunch",
      type: "break"
    },
    {
      start: "13:00", end: "14:00",
      title: "Reach workshop"
    },
    {
      start: "14:00", end: "15:30",
      title: "Hackathon",
      details: {
        // Example link: replace it with the real slides before the event.
        links: [{ label: "Slides", url: "https://example.com/hackathon-slides" }]
      }
    },
    {
      start: "15:30", end: "16:00",
      title: "Close + prizes + feedback"
    }
  ]
};

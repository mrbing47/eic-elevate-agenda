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
 *               type: "break"  -> renders as a lighter card.
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
      start: "08:30", end: "09:00",
      title: "Registration & breakfast",
      location: "Foyer",
      type: "break"
    },
    {
      start: "09:00", end: "09:20",
      title: "Welcome to Elevate",
      speaker: "ANZ EIC Leadership Team",
      location: "Main Stage",
      description: "Kick-off, housekeeping and what to expect from the day."
    },
    {
      start: "09:20", end: "10:05",
      title: "Keynote: Building your career in the age of AI",
      speaker: "Guest keynote speaker",
      location: "Main Stage",
      description: "How AI is reshaping the way we work, learn and grow."
    },
    {
      start: "10:05", end: "10:30",
      title: "Morning tea & networking",
      location: "Foyer",
      type: "break"
    },
    {
      start: "10:30", end: "11:30",
      title: "Panel: Lessons from leaders across ANZ",
      speaker: "Panel of ANZ leaders",
      location: "Main Stage",
      description: "Candid stories about career pivots, setbacks and breakthroughs."
    },
    {
      start: "11:30", end: "12:30",
      title: "Workshop: Crafting your personal brand",
      speaker: "Career coach",
      location: "Breakout rooms",
      description: "A hands-on session to sharpen your story, profile and network."
    },
    {
      start: "12:30", end: "13:30",
      title: "Lunch",
      location: "Foyer",
      type: "break"
    },
    {
      start: "13:30", end: "14:15",
      title: "Fireside chat: Growth mindset in practice",
      speaker: "Senior leadership guest",
      location: "Main Stage",
      description: "An open conversation on learning fast, owning feedback and thinking big."
    },
    {
      start: "14:15", end: "15:15",
      title: "Build challenge: Ship it with Copilot",
      speaker: "EIC tech leads",
      location: "Breakout rooms",
      description: "Team up and build something useful in 60 minutes."
    },
    {
      start: "15:15", end: "15:30",
      title: "Afternoon break",
      location: "Foyer",
      type: "break"
    },
    {
      start: "15:30", end: "16:15",
      title: "Lightning talks: EIC showcase",
      speaker: "EIC community",
      location: "Main Stage",
      description: "Five-minute talks on projects, wins and lessons learned."
    },
    {
      start: "16:15", end: "16:45",
      title: "Awards & closing remarks",
      speaker: "ANZ EIC Leadership Team",
      location: "Main Stage"
    },
    {
      start: "16:45", end: "18:00",
      title: "Networking drinks",
      location: "Terrace",
      type: "break"
    }
  ]
};

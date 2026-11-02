/*
 * ANZ EIC Elevate — agenda data
 * ----------------------------------------------------------------------------
 * This is the only file you need to edit to update the agenda.
 *
 *   theme     Optional line shown in the header under the logo. Wrap words
 *             in *asterisks* to give them the brand highlight.
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
 *                 Add text: "..." for a line of text, or steps: ["...", "..."]
 *                 for numbered steps (shown below the links). A link can also
 *                 have heading: "..." to show it in its own box under that
 *                 heading, and qr: "assets/qr/....svg", a QR code image of the
 *                 same link, shown in the box on screens bigger than a phone.
 *                 In one session, give all links a heading and QR code or
 *                 none, so they line up as matching boxes.
 *                 It's only hidden on the page: anyone can read this file (or
 *                 add ?details=all to the address), so keep secrets out of it.
 *
 * Preview the page at any moment by adding ?now=HH:MM (or
 * ?now=YYYY-MM-DDTHH:MM) to the URL, e.g. index.html?now=10:45
 * Add &speed=60 to run the clock 60x faster, and ?details=all to show every
 * session's details straight away (e.g. to get the page reviewed).
 */
window.EVENT_AGENDA = {
  title: "ANZ EIC Elevate",
  theme: "Growing your career in the *frontier generation*",
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
      title: "Mini activity - NFC LinkedIn card reader",
      details: {
        text: "Download NFC Tools",
        links: [
          {
            heading: "iPhone",
            label: "App Store",
            url: "https://apps.apple.com/nz/app/nfc-tools/id1252962749",
            qr: "assets/qr/nfc-tools-iphone.svg"
          },
          {
            heading: "Android",
            label: "Play Store",
            url: "https://play.google.com/store/apps/details?id=com.wakdev.wdnfc&hl=en-US",
            qr: "assets/qr/nfc-tools-android.svg"
          }
        ],
        steps: [
          "Open NFC Tools",
          "Click on Write",
          "Add a record",
          "Find “Social Network”",
          "Click on Edit",
          "Find LinkedIn or GitHub",
          "Enter your username or profile URL, then press Enter",
          "Click on Write and scan your NFC tag"
        ]
      }
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
        links: [
          {
            heading: "Registration",
            label: "Open form",
            url: "https://forms.cloud.microsoft/r/ke8f0btuXi",
            qr: "assets/qr/hackathon-registration.svg"
          },
          {
            heading: "Slides",
            label: "Open slides",
            url: "https://microsoftapc-my.sharepoint.com/:p:/g/personal/yvonnezhang_microsoft_com/cQrJukiQw7QURpSJQtltkWZZEgUC6FijNwFWVIlJgctUmNaRtQ",
            qr: "assets/qr/hackathon-slides.svg"
          }
        ]
      }
    },
    {
      start: "15:30", end: "16:00",
      title: "Close + prizes + feedback",
      details: {
        links: [
          {
            heading: "Feedback",
            label: "Open form",
            url: "https://forms.cloud.microsoft/r/VtaaS3Zf3T",
            qr: "assets/qr/feedback-form.svg"
          }
        ]
      }
    }
  ]
};

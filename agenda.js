/*
 * ANZ EIC Elevate — agenda data
 * ----------------------------------------------------------------------------
 * This is the only file you need to edit to update the agenda.
 *
 *   theme     Optional line shown in the header under the logo. Wrap words
 *             in *asterisks* to give them the brand highlight.
 *   hosts     Optional hosts of the day, shown above the timeline as photos
 *             with names and roles (same format as people below).
 *   date      Event day as "YYYY-MM-DD".
 *   timeZone  IANA time zone the session times are written in, e.g.
 *             "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland".
 *             Live progress is then correct on any device, wherever it is.
 *   sessions  start / end use 24-hour "HH:MM". Optional fields:
 *               speaker, location, description,
 *               type: "break"  -> renders as a lighter card,
 *               people         -> photos with names and roles, e.g. speakers,
 *                                 shown on the card all day:
 *                   people: [{ name: "...", role: "...", photo: "assets/people/....jpg" }]
 *                 role and photo are optional. Use a square photo with the
 *                 face in the middle: it's shown as a small circle.
 *               parts          -> a plan within the session, which appears
 *                                 when the session starts (like details) and
 *                                 stays after it ends, with the part
 *                                 happening now highlighted and counting down:
 *                   parts: [{ minutes: 10, title: "..." }, { minutes: 40, title: "..." }]
 *                 Parts run back to back from the session's start; any time
 *                 left at the end is free (e.g. a buffer). A part can have its
 *                 own details (same format as below), shown under it.
 *               details        -> appears when the session starts and stays
 *                                 after it ends, e.g. for slides:
 *                   details: { links: [{ label: "Slides", url: "https://..." }] }
 *                 Add text: "..." for a line of text, keywords: ["...", "..."]
 *                 for a row of keyword tags under it, or steps: ["...", "..."]
 *                 for numbered steps (shown below the links). A link can also
 *                 have heading: "..." to show it in its own box under that
 *                 heading, and qr: "assets/qr/....svg", a QR code image of the
 *                 same link, shown in the box on screens bigger than a phone.
 *                 In one session, give all links a heading and QR code or
 *                 none, so they line up as matching boxes.
 *                 It's only hidden on the page (parts too): anyone can read
 *                 this file (or add ?details=all to the address), so keep
 *                 secrets out of it.
 *
 * Preview the page at any moment by adding ?now=HH:MM (or
 * ?now=YYYY-MM-DDTHH:MM) to the URL, e.g. index.html?now=10:45
 * Add &speed=60 to run the clock 60x faster, and ?details=all to show every
 * session's parts and details straight away (e.g. to get the page reviewed).
 */
window.EVENT_AGENDA = {
  title: "ANZ EIC Elevate",
  theme: "Growing your career in the *frontier generation*",
  hosts: [
    {
      name: "Neth Botheju",
      role: "Software Engineer",
      photo: "assets/people/neth-botheju.jpg"
    },
    {
      name: "Ryan Saena",
      role: "Cloud Solution Architect",
      photo: "assets/people/ryan-saena.jpg"
    }
  ],
  date: "2026-11-06",
  timeZone: "Australia/Sydney",
  locale: "en-AU",
  venue: "Sydney",

  sessions: [
    {
      start: "08:30", end: "08:50",
      title: "Registration",
      description: "Collect your name tag and welcome pack",
      type: "break"
    },
    {
      start: "08:50", end: "09:00",
      title: "Welcome & Housekeeping",
      description: "Opening remarks from your hosts"
    },
    {
      start: "09:00", end: "09:15",
      title: "EIC Executive Sponsor Introduction",
      people: [
        {
          name: "Erika Harris",
          role: "Sr. Principal Software Engineering Manager",
          photo: "assets/people/erika-harris.jpg"
        },
        {
          name: "Adam Richings",
          role: "MD of SPT",
          photo: "assets/people/adam-richings.jpg"
        }
      ]
    },
    {
      start: "09:15", end: "09:30",
      title: "Kick-Off & Icebreaker",
      description: "Get to know your fellow attendees"
    },
    {
      start: "09:30", end: "09:50",
      title: "Keynote",
      people: [
        {
          name: "Charles Gray",
          role: "Partner Software Engineer",
          photo: "assets/people/charles-gray.jpg"
        }
      ]
    },
    {
      start: "09:50", end: "10:10",
      title: "Morning Tea",
      type: "break"
    },
    {
      start: "10:10", end: "11:00",
      title: "Guest Session: Anthropic",
      description: "Talk followed by Q&A",
      people: [
        {
          name: "Maddy O’Brien",
          role: "GTM @ Anthropic",
          photo: "assets/people/maddy-obrien.jpg"
        }
      ]
    },
    {
      start: "11:00", end: "11:15",
      title: "Mini Activity: NFC LinkedIn Card Reader",
      people: [
        {
          name: "Jamie Loke",
          role: "Solution Engineer",
          photo: "assets/people/jamie-loke.jpg"
        },
        {
          name: "Sarthik Garg",
          role: "Software Engineer",
          photo: "assets/people/sarthik-garg.jpg"
        }
      ],
      details: {
        text: "Download the NFC Tools app",
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
          "Tap Write",
          "Add a record",
          "Select “Social Network”",
          "Tap Edit",
          "Select LinkedIn or GitHub",
          "Enter your username or profile URL, then press Enter",
          "Tap Write, then scan your NFC tag"
        ]
      }
    },
    {
      start: "11:15", end: "12:00",
      title: "EIC Alumni Fireside Chat",
      description: "Discussion followed by Q&A",
      people: [
        {
          name: "Deborah Burnett",
          role: "Customer Success Account Manager",
          photo: "assets/people/deborah-burnett.jpg"
        },
        {
          name: "Alan Huynh",
          role: "Account Technology Strategist – Private Health",
          photo: "assets/people/alan-huynh.jpg"
        },
        {
          name: "Sharon Lyu",
          role: "Senior Software Engineer",
          photo: "assets/people/sharon-lyu.jpg"
        },
        {
          name: "Susan Shi",
          role: "Senior Software Engineering Manager",
          photo: "assets/people/susan-shi.jpg"
        }
      ]
    },
    {
      start: "12:00", end: "13:00",
      title: "Lunch & Group Photo",
      type: "break"
    },
    {
      start: "13:00", end: "14:00",
      title: "REACH Workshop"
    },
    {
      start: "14:00", end: "15:30",
      title: "Hackathon",
      people: [
        {
          name: "Sarthik Garg",
          role: "Software Engineer",
          photo: "assets/people/sarthik-garg.jpg"
        },
        {
          name: "Yvonne Zhang",
          role: "Technical Program Manager",
          photo: "assets/people/yvonne-zhang.jpg"
        }
      ],
      // 80 minutes of parts: the last 10 minutes (3:20–3:30 pm) are a buffer.
      parts: [
        {
          minutes: 10,
          title: "Form Teams",
          details: {
            links: [
              {
                heading: "Registration",
                label: "Open form",
                url: "https://forms.cloud.microsoft/r/ke8f0btuXi",
                qr: "assets/qr/hackathon-registration.svg"
              }
            ]
          }
        },
        {
          minutes: 40,
          title: "Choose Keywords, Define a Use Case & Hack",
          details: {
            keywords: ["67", "Time Travel", "Penguin", "Taco", "Tea", "Level Up", "Frontier", "Side Quest", "Glitch", "Multiverse"]
          }
        },
        { minutes: 20, title: "Showcase: 10 Teams × 2 Minutes" },
        {
          minutes: 10,
          title: "Voting & Prizes",
          details: {
            links: [
              {
                heading: "Vote",
                label: "Open form",
                url: "https://forms.cloud.microsoft/r/PBq8SnNkhS",
                qr: "assets/qr/hackathon-voting.svg"
              }
            ]
          }
        }
      ]
    },
    {
      start: "15:30", end: "16:00",
      title: "Closing Remarks & Feedback",
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

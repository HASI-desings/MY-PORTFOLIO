// Identity facts — App.md §2. Use exactly; never invent more.

export const site = {
  brand: "HASI DESIGNS",
  wordmark: "HASI",
  name: "HUSSNAIN SOHAIL",
  roles: ["Founder", "Developer", "Digital Creator"],
  location: "Lahore, Pakistan",
  locationShort: "LAHORE, PK",
  statement:
    "I build digital experiences, automate processes, and transform ideas into functional software.",
  year: 2026,
  contact: {
    email: "RanaHasi302@gmail.com",
    /** Digits only — built into wa.me links by lib/contact.ts. */
    whatsappDigits: "923141481275",
    whatsappDisplay: "+92 314 1481275",
    instagramHandle: "hussnain_7979",
    instagramUrl: "https://instagram.com/hussnain_7979",
    githubUrl: "https://github.com/HASI-desings",
  },
  prefill: {
    emailSubject: "Project inquiry — via HASI DESIGNS",
    emailBody:
      "Hi Hussnain,\r\n\r\nI'd like to talk about a project.\r\n\r\nName:\r\nWhat I want to build:\r\nTimeline:\r\n",
    whatsapp: "Hi Hussnain, I found HASI DESIGNS and I'd like to talk about a project.",
  },
} as const;

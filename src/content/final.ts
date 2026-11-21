// Design.md §9 Scene 06.
export const final = {
  label: "CONTACT",
  statements: ["EVERY IDEA STARTS SOMEWHERE.", "LET'S BUILD SOMETHING."],
  cta: "LET'S MAKE IT REAL",
  chooser: "CHOOSE A CHANNEL",
  options: {
    email: "EMAIL",
    whatsapp: "WHATSAPP",
  },
  copyPrefix: "or copy:",
  copied: "COPIED",
  mailFallback: "No mail app opened? Copy the address instead.",
  portraitAlt:
    "Hussnain Sohail — black-and-white silhouette portrait, looking to the left, backlit against a light grey studio backdrop.",
} as const;

export const chrome = {
  talk: "LET'S TALK",
  skip: "Skip to contact",
  scroll: "SCROLL",
  swipe: "SWIPE",
  offline: "You're offline — the experience will continue with what's loaded.",
  online: "Back online.",
  needsInternet: "Needs internet",
} as const;

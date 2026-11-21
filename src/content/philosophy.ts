// Design.md §9 Scene 05. `lines` is the giant statement as it is stacked on screen.
export const philosophy = {
  label: "PHILOSOPHY",
  lines: ["CREATIVITY", "IS A PROCESS,", "NOT A TRAIT."],
  /** The words that get the red underline once the line is fully lit. */
  underline: "NOT A TRAIT.",
  supporting: [
    { index: "I", text: "Ideas become valuable when they are executed." },
    {
      index: "II",
      text: "I enjoy understanding problems, experimenting with possibilities, and building solutions that actually work.",
    },
    {
      index: "III",
      text: "Technology is not just about writing code. It's about creating something useful.",
    },
  ],
} as const;

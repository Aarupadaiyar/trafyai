// Mirrors tailwind.config.ts — kept as plain JS for places Tailwind classes
// can't reach, like the HTML email digest template.
export const tokens = {
  color: {
    cream: "#FAFAF0",
    creamDim: "#F3F3E7",
    ink: "#0B0B0B",
    inkSoft: "#1A1A1A",
    lime: "#C8FF2C",
    limeDim: "#DFF8A0",
    grayBody: "#6B6B63",
    border: "#E4E4D8",
  },
  radius: {
    card: "22px",
    pill: "999px",
  },
  font: {
    family: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
} as const;

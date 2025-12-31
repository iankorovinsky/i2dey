export enum NoteColor {
  Yellow = "yellow",
  Pink = "pink",
  Blue = "blue",
  Green = "green",
  Purple = "purple",
  Orange = "orange",
}

export interface NoteColorConfig {
  paper: string;
  paperDark: string;
  lines: string;
  border: string;
}

export const noteColorMap: Record<NoteColor, NoteColorConfig> = {
  [NoteColor.Yellow]: {
    paper: "#fef3c7",
    paperDark: "#fde68a",
    lines: "#d97706",
    border: "#f59e0b",
  },
  [NoteColor.Pink]: {
    paper: "#fce7f3",
    paperDark: "#fbcfe8",
    lines: "#db2777",
    border: "#ec4899",
  },
  [NoteColor.Blue]: {
    paper: "#dbeafe",
    paperDark: "#bfdbfe",
    lines: "#2563eb",
    border: "#3b82f6",
  },
  [NoteColor.Green]: {
    paper: "#dcfce7",
    paperDark: "#bbf7d0",
    lines: "#16a34a",
    border: "#22c55e",
  },
  [NoteColor.Purple]: {
    paper: "#f3e8ff",
    paperDark: "#e9d5ff",
    lines: "#9333ea",
    border: "#a855f7",
  },
  [NoteColor.Orange]: {
    paper: "#ffedd5",
    paperDark: "#fed7aa",
    lines: "#ea580c",
    border: "#f97316",
  },
};

export const getRandomNoteColor = (): NoteColor => {
  const colors = Object.values(NoteColor);
  return colors[Math.floor(Math.random() * colors.length)];
};

import { Theme } from "../types";

export const themes: Theme[] = [
  {
    id: "modern_theme",
    name: "Modern Theme",
    fields: [
      { key: "headline", label: "Main Headline", defaultPosition: { x: 50, y: 20 }, fontSize: 24, alignment: "center" },
      { key: "subheadline", label: "Sub Headline", defaultPosition: { x: 50, y: 60 }, fontSize: 18, alignment: "center" },
    ],
  },
  {
    id: "classic_theme",
    name: "Classic Theme",
    fields: [
      { key: "title", label: "Title", defaultPosition: { x: 30, y: 30 }, fontSize: 20, alignment: "left" },
    ],
  },
];

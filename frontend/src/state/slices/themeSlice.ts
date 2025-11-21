import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeState,LogoState } from "../../types";

const initialState: ThemeState = {
  selectedTheme: null,
  content: {},
  positions: {},
  logo: { url: "", position: { x: 50, y: 50 }, size: 100 },
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    selectTheme: (state, action: PayloadAction<string>) => {
      state.selectedTheme = action.payload;
      state.content = {};
      state.positions = {};
    },
    updateTextContent: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.content[action.payload.key] = action.payload.value;
    },
    updateTextPosition: (state, action: PayloadAction<{ key: string; position: { x: number; y: number } }>) => {
      state.positions[action.payload.key] = action.payload.position;
    },
    updateLogo: (state, action: PayloadAction<LogoState>) => {
      state.logo = action.payload;
    },
  },
});

export const { selectTheme, updateTextContent, updateTextPosition, updateLogo } = themeSlice.actions;
export default themeSlice.reducer;

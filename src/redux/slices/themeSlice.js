import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light", // will be overridden by system theme
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.mode = action.payload;
    },
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

/**
 * themeSlice
 *
 * Redux slice responsible for managing the application theme.
 *
 * Responsibilities:
 * - Store the current theme mode (light or dark)
 * - Provide actions to toggle or explicitly set the theme
 *
 * Note:
 * - The initial state always starts with "light" to ensure
 *   consistent server-side rendering and avoid hydration mismatches.
 * - The actual DOM theme application (class toggling, persistence)
 *   is handled outside Redux (e.g., in React effects).
 */
const themeSlice = createSlice({
  name: "theme",

  /**
   * Initial state for the theme slice.
   * Starts with light mode for SSR safety.
   */
  initialState: {
    mode: "light",
  },

  reducers: {
    /**
     * Toggles between light and dark modes.
     * This reducer is typically triggered by a UI control.
     */
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    /**
     * Explicitly sets the theme mode.
     * Used when restoring persisted user preference
     * or importing dashboard configuration.
     */
    setTheme(state, action) {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

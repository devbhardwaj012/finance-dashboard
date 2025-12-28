import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import widgetReducer from "./slices/widgetSlice";

/**
 * Redux Store Configuration
 *
 * Centralized store for the application state.
 *
 * State structure:
 * - theme: manages light/dark mode selection
 * - widgets: manages dashboard widget data and layout
 *
 * Additional slices can be added here as the application grows.
 */
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    widgets: widgetReducer,
  },
});

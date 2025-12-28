import { createSlice } from "@reduxjs/toolkit";

/**
 * widgetSlice
 *
 * Redux slice responsible for managing dashboard widgets.
 *
 * Responsibilities:
 * - Maintain the ordered list of widgets
 * - Support creation, update, deletion, and reordering
 * - Enable full dashboard replacement or merge (e.g., import flows)
 *
 * The widget array order directly controls dashboard layout.
 */
const widgetSlice = createSlice({
  name: "widgets",

  /**
   * Initial state is an empty widget list.
   * Widgets are typically hydrated from localStorage
   * or a default configuration on application mount.
   */
  initialState: [],

  reducers: {
    /**
     * Adds a new widget to the dashboard.
     * A unique identifier is generated at insertion time.
     */
    addWidget(state, action) {
      state.push({
        id: crypto.randomUUID(),
        ...action.payload,
      });
    },

    /**
     * Updates an existing widget by replacing it entirely.
     * The widget is matched using its unique identifier.
     */
    updateWidget(state, action) {
      const index = state.findIndex(
        (w) => w.id === action.payload.id
      );

      if (index !== -1) {
        state[index] = action.payload;
      }
    },

    /**
     * Removes a widget from the dashboard by ID.
     */
    removeWidget(state, action) {
      return state.filter((w) => w.id !== action.payload);
    },

    /**
     * Reorders widgets.
     * The payload is expected to be a fully ordered widget array.
     */
    reorderWidgets(state, action) {
      return action.payload;
    },

    /**
     * Replaces the entire dashboard state.
     * Typically used when importing a saved dashboard configuration.
     */
    replaceDashboard(state, action) {
      return action.payload.widgets;
    },

    /**
     * Merges an imported dashboard into the current one.
     * Existing widgets are preserved and new ones are appended.
     */
    mergeDashboard(state, action) {
      state.push(...action.payload.widgets);
    },
  },
});

export const {
  addWidget,
  updateWidget,
  removeWidget,
  reorderWidgets,
  replaceDashboard,
  mergeDashboard,
} = widgetSlice.actions;

export default widgetSlice.reducer;

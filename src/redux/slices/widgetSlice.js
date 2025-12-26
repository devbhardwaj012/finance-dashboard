import { createSlice } from "@reduxjs/toolkit";

const widgetSlice = createSlice({
  name: "widgets",
  initialState: [],
  reducers: {
    addWidget(state, action) {
      state.push({
        id: crypto.randomUUID(),
        ...action.payload,
      });
    },
    removeWidget(state, action) {
      return state.filter((w) => w.id !== action.payload);
    },
  },
});

export const { addWidget, removeWidget } = widgetSlice.actions;
export default widgetSlice.reducer;

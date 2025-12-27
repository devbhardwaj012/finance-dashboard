// import { createSlice } from "@reduxjs/toolkit";

// const themeSlice = createSlice({
//   name: "theme",
//   initialState: {
//     mode: "light", // "light" or "dark"
//   },
//   reducers: {
//     toggleTheme(state) {
//       state.mode = state.mode === "light" ? "dark" : "light";
//     },
//     setTheme(state, action) {
//       state.mode = action.payload;
//     },
//   },
// });

// export const { toggleTheme, setTheme } = themeSlice.actions;
// export default themeSlice.reducer;












// just updated
















// import { createSlice } from "@reduxjs/toolkit";

// // Load initial theme from localStorage
// const getInitialTheme = () => {
//   if (typeof window === "undefined") return "light";
  
//   try {
//     const stored = localStorage.getItem("theme");
//     return stored === "dark" ? "dark" : "light";
//   } catch {
//     return "light";
//   }
// };

// const themeSlice = createSlice({
//   name: "theme",
//   initialState: {
//     mode: getInitialTheme(),
//   },
//   reducers: {
//     toggleTheme(state) {
//       state.mode = state.mode === "light" ? "dark" : "light";
//     },
//     setTheme(state, action) {
//       state.mode = action.payload;
//     },
//   },
// });

// export const { toggleTheme, setTheme } = themeSlice.actions;
// export default themeSlice.reducer;

















import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light", // Always start with light on server
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme(state, action) {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
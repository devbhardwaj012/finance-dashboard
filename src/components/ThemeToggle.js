// "use client";

// import { useDispatch, useSelector } from "react-redux";
// // import { toggleTheme, setTheme } from "@/redux/themeSlice";
// import { toggleTheme, setTheme } from "@/redux/slices/themeSlice";

// import { useEffect } from "react";

// export default function ThemeToggle() {
//   const dispatch = useDispatch();
//   const mode = useSelector((state) => state.theme.mode);

//   // Sync Redux with localStorage on mount
//   useEffect(() => {
//     const saved = localStorage.getItem("theme");
//     if (saved) {
//       dispatch(setTheme(saved));
//     }
//   }, [dispatch]);

//   function handleToggle() {
//     dispatch(toggleTheme());

//     const next = mode === "dark" ? "light" : "dark";
//     document.documentElement.classList.toggle("dark");
//     localStorage.setItem("theme", next);
//   }

//   return (
//     <button
//       type="button"
//       onClick={handleToggle}
//       className="px-3 py-1.5 rounded-md text-sm
//                  border border-slate-300 dark:border-slate-700
//                  bg-white dark:bg-slate-900
//                  hover:bg-slate-100 dark:hover:bg-slate-800
//                  transition"
//     >
//       {mode === "dark" ? "Light Mode" : "Dark Mode"}
//     </button>
//   );
// }






















"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "@/redux/slices/themeSlice";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted (client-only)
  useEffect(() => {
    setMounted(true);

    // Sync Redux with localStorage
    const saved = localStorage.getItem("theme");
    if (saved) {
      dispatch(setTheme(saved));
    }
  }, [dispatch]);

  function handleToggle() {
    const next = mode === "dark" ? "light" : "dark";

    dispatch(toggleTheme());
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", next);
  }

  // 🚨 CRITICAL: prevent hydration mismatch
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="px-3 py-1.5 rounded-md text-sm
                 border border-slate-300 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 hover:bg-slate-100 dark:hover:bg-slate-800
                 transition"
    >
      {mode === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

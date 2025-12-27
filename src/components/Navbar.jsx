// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import { toggleTheme } from "@/lib/store/slices/themeSlice";
// import { useEffect } from "react";

// export default function Navbar({ onAddWidget }) {
//   const dispatch = useDispatch();
//   const theme = useSelector((state) => state.theme.mode);

//   useEffect(() => {
//     // Apply theme to document
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [theme]);

//   return (
//     <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="text-2xl">📊</div>
//           <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//             Finance Dashboard
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => dispatch(toggleTheme())}
//             className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
//             title="Toggle theme"
//           >
//             {theme === "dark" ? "🌞" : "🌙"}
//           </button>

//           <button
//             onClick={onAddWidget}
//             className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
//           >
//             + Add Widget
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }




















// just added
















// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import { toggleTheme } from "@/lib/store/slices/themeSlice";
// import { useEffect } from "react";

// export default function Navbar({ onAddWidget }) {
//   const dispatch = useDispatch();
//   const theme = useSelector((state) => state.theme.mode);

//   useEffect(() => {
//     // Apply theme to document immediately
//     const applyTheme = (mode) => {
//       if (mode === "dark") {
//         document.documentElement.classList.add("dark");
//         localStorage.setItem("theme", "dark");
//       } else {
//         document.documentElement.classList.remove("dark");
//         localStorage.setItem("theme", "light");
//       }
//     };

//     applyTheme(theme);
//   }, [theme]);

//   return (
//     <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="text-2xl">📊</div>
//           <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//             Finance Dashboard
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => dispatch(toggleTheme())}
//             className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
//             title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
//           >
//             {theme === "dark" ? "🌞" : "🌙"}
//           </button>

//           <button
//             onClick={onAddWidget}
//             className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
//           >
//             + Add Widget
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }








// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import { toggleTheme, setTheme } from "@/lib/store/slices/themeSlice";
// import { useEffect, useState } from "react";

// export default function Navbar({ onAddWidget }) {
//   const dispatch = useDispatch();
//   const theme = useSelector((state) => state.theme.mode);
//   const [mounted, setMounted] = useState(false);

//   // Load theme from localStorage on mount (client-side only)
//   useEffect(() => {
//     setMounted(true);
    
//     // Read stored theme preference
//     const storedTheme = localStorage.getItem("theme");
//     if (storedTheme && storedTheme !== theme) {
//       dispatch(setTheme(storedTheme));
//     }
    
//     // Apply theme immediately
//     if (storedTheme === "dark") {
//       document.documentElement.classList.add("dark");
//     }
//   }, []);

//   // Apply theme changes
//   useEffect(() => {
//     if (!mounted) return;
    
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [theme, mounted]);

//   return (
//     <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="text-2xl">📊</div>
//           <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//             Finance Dashboard
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => dispatch(toggleTheme())}
//             className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
//             title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
//             suppressHydrationWarning
//           >
//             {mounted ? (theme === "dark" ? "🌞" : "🌙") : "🌙"}
//           </button>

//           <button
//             onClick={onAddWidget}
//             className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
//           >
//             + Add Widget
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

















"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "@/lib/store/slices/themeSlice";
import { useEffect, useState } from "react";

export default function Navbar({ onAddWidget }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const widgets = useSelector((state) => state.widgets);
  const [mounted, setMounted] = useState(false);
  
  const widgetCount = widgets.length;

  // Load theme from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Read stored theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      dispatch(setTheme(storedTheme));
    }
    
    // Apply theme immediately
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme, mounted]);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Finance Dashboard
            </h1>
            {mounted && widgetCount > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {widgetCount} {widgetCount === 1 ? 'widget' : 'widgets'} live
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Widget counter badge */}
          {mounted && widgetCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {widgetCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                active
              </span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
          )}

          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            suppressHydrationWarning
          >
            {mounted ? (theme === "dark" ? "🌞" : "🌙") : "🌙"}
          </button>

          <button
            onClick={onAddWidget}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition flex items-center gap-2"
          >
            <span>+</span>
            <span>Add Widget</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
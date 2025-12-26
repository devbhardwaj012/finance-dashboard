"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode, mounted]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="
        px-3 py-1 rounded-md border
        border-slate-300 dark:border-slate-700
        bg-white dark:bg-slate-800
        text-slate-900 dark:text-slate-100
        hover:bg-slate-100 dark:hover:bg-slate-700
        transition
      "
    >
      {mode === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="px-3 py-2 rounded-md border
                 border-slate-300 dark:border-slate-700
                 text-slate-700 dark:text-slate-200
                 hover:bg-slate-200 dark:hover:bg-slate-800"
    >
      {mode === "dark" ? "Light" : "Dark"}
    </button>
  );
}

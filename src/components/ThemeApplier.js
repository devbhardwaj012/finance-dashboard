"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/redux/slices/themeSlice";

export default function ThemeApplier() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  // 1️⃣ Detect system theme ONCE
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    dispatch(setTheme(prefersDark ? "dark" : "light"));
  }, [dispatch]);

  // 2️⃣ Sync Redux → <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return null;
}

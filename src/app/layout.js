import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import ThemeApplier from "@/components/ThemeApplier";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ThemeApplier />
          <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f19] transition-colors">
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}

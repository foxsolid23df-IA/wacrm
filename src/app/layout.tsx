import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemedToaster } from "@/components/themed-toaster";
import { LanguageProvider } from "@/hooks/use-language";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "@/lib/i18n/config";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODE_STORAGE_KEY,
  STORAGE_KEY,
} from "@/lib/themes";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "wacrm",
    template: "%s \u2014 wacrm",
  },
  description: "Self-hostable CRM template for WhatsApp.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [{ url: "/icon" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark light",
};

// Inline boot script \u2014 runs before React hydrates so the user\u2019s
// chosen accent (data-theme), mode (data-mode), and language (lang) are
// on the <html> element before first paint. Without this every page load
// flashes the server-rendered defaults for a frame before the React tree
// mounts and applies the picked values.
//
// Kept dependency-free (no imports, no JSX) \u2014 must be a string the
// browser can run as a single <script>. Knowledge of valid ids is
// sourced from the THEME_IDS / MODES / LOCALES constants so adding one
// doesn\u2019t silently break the boot path.
const THEME_BOOT_SCRIPT = `
(function(){
  var d = document.documentElement;
  try {
    var THEME_KEY = '${STORAGE_KEY}';
    var THEME_DEFAULT = '${DEFAULT_THEME}';
    var THEMES = ['violet','emerald','cobalt','amber','rose'];
    var savedTheme = localStorage.getItem(THEME_KEY);
    d.dataset.theme = THEMES.indexOf(savedTheme) !== -1 ? savedTheme : THEME_DEFAULT;

    var MODE_KEY = '${MODE_STORAGE_KEY}';
    var MODE_DEFAULT = '${DEFAULT_MODE}';
    var MODES = ['light','dark'];
    var savedMode = localStorage.getItem(MODE_KEY);
    d.dataset.mode = MODES.indexOf(savedMode) !== -1 ? savedMode : MODE_DEFAULT;

    var LOCALE_KEY = '${LOCALE_STORAGE_KEY}';
    var LOCALE_DEFAULT = '${DEFAULT_LOCALE}';
    var LOCALES = ['en','es'];
    var savedLocale = localStorage.getItem(LOCALE_KEY);
    d.lang = LOCALES.indexOf(savedLocale) !== -1 ? savedLocale : LOCALE_DEFAULT;
  } catch (_e) {
    d.dataset.theme = '${DEFAULT_THEME}';
    d.dataset.mode = '${DEFAULT_MODE}';
    d.lang = '${DEFAULT_LOCALE}';
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      data-theme={DEFAULT_THEME}
      data-mode={DEFAULT_MODE}
      className={`${inter.variable} h-full antialiased`}
      // The `theme-boot` script below rewrites `data-theme`, `data-mode`,
      // and `lang` on <html> from localStorage before React hydrates, so
      // for any non-default choice the client DOM intentionally differs
      // from the server-rendered defaults. suppressHydrationWarning
      // silences the expected mismatch \u2014 it only applies to this
      // element\u2019s own attributes, so genuine mismatches in children
      // still surface.
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

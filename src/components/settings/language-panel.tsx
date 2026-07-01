"use client";

import { Check, Globe } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";
import { LOCALES } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { SettingsPanelHead } from "./settings-panel-head";

const LOCALE_LABELS: Record<string, { name: string; flag: string }> = {
  en: { name: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  es: { name: "Espa\u00f1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
};

export function LanguagePanel() {
  const { locale, setLocale } = useLanguage();

  return (
    <section className="max-w-3xl animate-in fade-in-50 duration-200">
      <SettingsPanelHead
        title="Language"
        description="Choose the language used across the app. Saved to this device."
      />

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe className="size-4 text-muted-foreground" />
          Language
        </h3>

        <div
          role="radiogroup"
          aria-label="App language"
          className="grid max-w-md grid-cols-2 gap-3"
        >
          {LOCALES.map((l) => {
            const meta = LOCALE_LABELS[l];
            const isActive = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="radio"
                onClick={() => setLocale(l)}
                aria-checked={isActive}
                className={cn(
                  "flex items-center gap-3 rounded-lg border bg-card p-4 text-left transition-colors",
                  isActive
                    ? "border-primary/60 ring-2 ring-primary/40"
                    : "border-border hover:border-border hover:bg-muted/40",
                )}
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-lg"
                >
                  {meta.flag}
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  {meta.name}
                </span>
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                    <Check className="h-3 w-3" />
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

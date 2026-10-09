/** The four languages every OPUS screen speaks. The names are the ones the Portal and WayHand show. */
export const LOCALES = ["en", "ko", "ja", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
    en: "English",
    ko: "한국어",
    ja: "日本語",
    zh: "简体中文",
};

export const isLocale = (value: unknown): value is Locale => (LOCALES as readonly unknown[]).includes(value);

/** The first language in the browser's list that OPUS has, else English. */
export function pickLocale(languages: readonly string[]): Locale {
    for (const tag of languages) {
        const base = tag.toLowerCase().split("-")[0];
        if (isLocale(base)) return base;
    }
    return "en";
}

/**
 * The language to start in: `?lang=` in the address, else the one chosen last time, else English. The browser's own
 * language is not used.
 */
export function initialLocale(fromUrl: string | null | undefined, saved: string | null | undefined): Locale {
    if (isLocale(fromUrl)) return fromUrl;
    return isLocale(saved) ? saved : "en";
}

/** The value for `<html lang>`. */
export const htmlLang = (locale: Locale): string => (locale === "zh" ? "zh-Hans" : locale);

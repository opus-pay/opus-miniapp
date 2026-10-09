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
 * The language to start in, in this order: `?lang=` in the address, the one chosen last time (kept in a cookie), the
 * first language of the browser's own list that OPUS has, English.
 */
export function initialLocale(
    fromUrl: string | null | undefined,
    saved: string | null | undefined,
    browser: readonly string[] = []
): Locale {
    if (isLocale(fromUrl)) return fromUrl;
    if (isLocale(saved)) return saved;
    return pickLocale(browser);
}

/** The value of a cookie in a `document.cookie` string, or `null`. */
export function readCookie(cookies: string, name: string): string | null {
    for (const part of cookies.split(";")) {
        const at = part.indexOf("=");
        if (at > 0 && part.slice(0, at).trim() === name) {
            try {
                return decodeURIComponent(part.slice(at + 1).trim());
            } catch {
                return null;
            }
        }
    }
    return null;
}

const YEAR = 365 * 24 * 60 * 60;

/**
 * The cookie text that remembers a choice for a year on every page of this site: it is a preference, read only by
 * this browser's own page, never sent anywhere else (`SameSite=Lax`), and `Secure` on https.
 */
export function choiceCookie(name: string, value: string, secure: boolean): string {
    return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${YEAR}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

/** The value for `<html lang>`. */
export const htmlLang = (locale: Locale): string => (locale === "zh" ? "zh-Hans" : locale);

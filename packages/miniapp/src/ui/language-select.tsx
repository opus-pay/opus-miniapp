"use client";

import { LOCALES, LOCALE_NAMES, isLocale, translate, type Locale } from "../core";

/** The language list: the same four languages, with the same names, in every OPUS screen. */
export function LanguageSelect({
    locale,
    onChange,
    className = "",
}: {
    locale: Locale;
    onChange: (locale: Locale) => void;
    className?: string;
}) {
    return (
        <select
            aria-label={translate(locale, "nav.language")}
            className={`h-8 rounded-lg border border-line bg-surface pl-2 pr-6 text-[13px] font-medium text-ink-soft hover:border-ink-soft ${className}`}
            value={locale}
            onChange={(event) => {
                if (isLocale(event.target.value)) onChange(event.target.value);
            }}
        >
            {LOCALES.map((code) => (
                <option key={code} value={code}>
                    {LOCALE_NAMES[code]}
                </option>
            ))}
        </select>
    );
}

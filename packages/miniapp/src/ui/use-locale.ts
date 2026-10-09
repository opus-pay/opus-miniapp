"use client";

import { useCallback, useEffect, useState } from "react";

import { htmlLang, initialLocale, isLocale, type Locale } from "../core";

/**
 * The visitor's language for a mini-app, in this order: `?lang=ko` in the address (the Portal passes it when it
 * opens a mini-app, so the language carries over), the language they chose here before, English. The browser's
 * language is not used. A choice, or a language that came in the address, is kept in this browser and `<html lang>`
 * follows it. Storage can be refused (a private window); the choice then lasts for the visit.
 */
export function useLocale(storageKey = "opus.locale"): [Locale, (locale: Locale) => void] {
    const [locale, setState] = useState<Locale>("en");
    useEffect(() => {
        let fromUrl: string | null = null;
        let saved: string | null = null;
        try {
            fromUrl = new URLSearchParams(window.location.search).get("lang");
            saved = window.localStorage.getItem(storageKey);
        } catch {
            // no storage
        }
        setState(initialLocale(fromUrl, saved));
        if (isLocale(fromUrl)) {
            try {
                window.localStorage.setItem(storageKey, fromUrl);
            } catch {
                // the language still holds for this visit
            }
        }
    }, [storageKey]);
    useEffect(() => {
        document.documentElement.lang = htmlLang(locale);
    }, [locale]);
    const set = useCallback(
        (next: Locale) => {
            setState(next);
            try {
                window.localStorage.setItem(storageKey, next);
            } catch {
                // the choice still holds for this visit
            }
        },
        [storageKey]
    );
    return [locale, set];
}

"use client";

import { useCallback, useEffect, useState } from "react";

import { addressWithLanguage, choiceCookie, htmlLang, initialLocale, isLocale, readCookie, type Locale } from "../core";

/**
 * The visitor's language for a mini-app, in this order: `?lang=ko` in the address (the Portal passes it when it
 * opens a mini-app, so the language carries over), the language they chose here before (a cookie), the browser's own
 * language if OPUS has it, English. A choice, or a language that came in the address, is remembered in a cookie of
 * this site, `<html lang>` follows it, and an existing `?lang=` in the address is changed to the new choice. If cookies are refused, the choice lasts for the visit.
 */
export function useLocale(cookieName = "opus_locale"): [Locale, (locale: Locale) => void] {
    const [locale, setState] = useState<Locale>("en");
    const remember = useCallback(
        (value: Locale) => {
            try {
                document.cookie = choiceCookie(cookieName, value, window.location.protocol === "https:");
            } catch {
                // the choice still holds for this visit
            }
        },
        [cookieName]
    );
    /** A choice made here also changes `?lang=` in the address when it has one, so a reload does not undo it. */
    const followInAddress = useCallback((value: Locale) => {
        try {
            const next = addressWithLanguage(window.location.href, value);
            if (next !== null) window.history.replaceState(window.history.state, "", next);
        } catch {
            // The address stays as it is.
        }
    }, []);
    useEffect(() => {
        let fromUrl: string | null = null;
        let saved: string | null = null;
        let browser: readonly string[] = [];
        try {
            fromUrl = new URLSearchParams(window.location.search).get("lang");
            saved = readCookie(document.cookie, cookieName);
            browser = navigator.languages?.length ? navigator.languages : [navigator.language];
        } catch {
            // no cookies, no browser list: English
        }
        setState(initialLocale(fromUrl, saved, browser));
        if (isLocale(fromUrl)) remember(fromUrl);
    }, [cookieName, remember]);
    useEffect(() => {
        document.documentElement.lang = htmlLang(locale);
    }, [locale]);
    const set = useCallback(
        (next: Locale) => {
            setState(next);
            remember(next);
            followInAddress(next);
        },
        [remember, followInAddress]
    );
    return [locale, set];
}

"use client";

import type { ReactNode } from "react";

import { goToPortalInApp, portalLink, translate, type Locale } from "../core";
import { LanguageSelect } from "./language-select";
import { LogoMark } from "./logo";

/**
 * The thin bar above every mini-app: the way back to the OPUS Portal at the top left, the language at the top
 * right, and between them on the right the app's own small controls (a notification bell, a help menu) when it
 * gives some. It scrolls away with the page; the app's own header below it stays.
 *
 * In a browser the way back is an ordinary link. Inside the OPUS wallet app it is a message to the app, which
 * shows its Portal screen (the page cannot open that screen itself).
 */
export function PortalBar({
    locale,
    onLocaleChange,
    portalUrl,
    newTab = false,
    right,
}: {
    locale: Locale;
    onLocaleChange: (locale: Locale) => void;
    /** The Portal's address. Defaults to the public Portal; anything that is not https is ignored. */
    portalUrl?: string;
    /** Open the Portal in a new tab instead of this one. */
    newTab?: boolean;
    /** The app's own small controls, shown on the right just before the language. */
    right?: ReactNode;
}) {
    const title = translate(locale, "portal.title");
    return (
        <div className="border-b border-line bg-canvas">
            <div className="mx-auto flex max-w-[64rem] items-center gap-2 px-4 py-1.5">
                <a
                    href={portalLink(portalUrl, locale)}
                    title={title}
                    aria-label={title}
                    {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={(event) => {
                        if (goToPortalInApp()) event.preventDefault();
                    }}
                    className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface pl-2 pr-3 text-[13px] font-medium text-ink-soft no-underline hover:border-ink-soft"
                >
                    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
                        <path
                            d="M10 3 5 8l5 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <LogoMark size={18} />
                    {translate(locale, "portal.back")}
                </a>
                <span className="ml-auto flex shrink-0 items-center gap-2">
                    {right}
                    <LanguageSelect locale={locale} onChange={onLocaleChange} />
                </span>
            </div>
        </div>
    );
}

import type { ReactNode } from "react";

/**
 * The OPUS mark: a ring open at the upper right with a dot in the opening (the escrow, and the money moving out
 * by its rules), white on the accent colour in a rounded square. The same drawing as the Portal's tab icon.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
            <rect width="32" height="32" rx="9" fill="var(--color-accent-fill)" />
            <path
                d="M23.73 13.93A8 8 0 1 1 18.07 8.27"
                fill="none"
                stroke="#fff"
                strokeWidth="3.2"
                strokeLinecap="round"
            />
            <circle cx="21.66" cy="10.34" r="2.6" fill="#fff" />
        </svg>
    );
}

/**
 * With no tagline the name sits alone beside the mark, so its capital letters, not its line box, are what has to be
 * centred on the mark: a font's line box carries space for descenders and accents that makes the capitals look high or
 * low. `text-box` trims the box to the capitals and the baseline (Chrome, Edge and Safari; elsewhere the plain line box
 * is used).
 */
const NAME_ALONE = "[text-box:trim-both_cap_alphabetic]";

/**
 * A mini-app's own mark and name for the top bar. `mark` is the app's logo drawing (32 px square); `tagline` is
 * the small line under the name (hidden on a phone). The name may carry markup, e.g. `Way<span>Hand</span>`.
 */
export function AppLogo({ name, mark, tagline }: { name: ReactNode; mark?: ReactNode; tagline?: string }) {
    return (
        <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
            {mark ?? <LogoMark />}
            <span className="flex min-w-0 flex-col leading-none">
                <span
                    className={`font-display text-[20px] font-bold tracking-tight text-ink ${
                        tagline === undefined ? NAME_ALONE : ""
                    }`}
                >
                    {name}
                </span>
                {tagline !== undefined && (
                    <span className="mt-1 hidden truncate text-[11px] font-medium text-muted sm:block">{tagline}</span>
                )}
            </span>
        </span>
    );
}

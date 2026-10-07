"use client";

import { useState } from "react";

import { displayAddress, shortAddress, translate, type Locale } from "../core";

/**
 * A wallet address as OPUS shows it: the checksum spelling (short or whole) with a copy button. Clipboard access
 * can be refused (a private window), so a failed copy is quiet.
 */
export function AddressText({ address, locale, short = false }: { address: string; locale: Locale; short?: boolean }) {
    const [done, setDone] = useState(false);
    const full = displayAddress(address);
    return (
        <span className="inline-flex min-w-0 items-center gap-2">
            <span className="min-w-0 break-all font-mono text-[13.5px] text-ink" title={full}>
                {short ? shortAddress(address) : full}
            </span>
            <button
                type="button"
                aria-label={`${translate(locale, "common.copy")}: ${translate(locale, "common.address")}`}
                className="shrink-0 rounded-md border border-line px-2 py-0.5 text-[12.5px] font-medium text-ink-soft hover:border-ink-soft"
                onClick={() => {
                    void navigator.clipboard
                        ?.writeText(full)
                        .then(() => {
                            setDone(true);
                            setTimeout(() => setDone(false), 1500);
                        })
                        .catch(() => undefined);
                }}
            >
                {done ? translate(locale, "common.copied") : translate(locale, "common.copy")}
            </button>
        </span>
    );
}

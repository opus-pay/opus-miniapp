"use client";

import { useState } from "react";

import { isUnsupportedChain, portalLink, translate, type Locale } from "../core";

export type SwitchTarget = "polygon" | "amoy";

/**
 * A bar under the header when the connected wallet is on a chain other than Polygon or Polygon Amoy. Money sent
 * on the wrong network can be lost, so it says so and offers a switch. It shows nothing when no wallet is
 * connected or the wallet is on a chain OPUS runs on.
 *
 * `onSwitch` asks the wallet to switch and answers whether it worked; without it the buttons are not shown.
 * The "network settings" link goes to the Portal's Network page.
 */
export function NetworkWarning({
    connected,
    chainId,
    locale,
    onSwitch,
    portalUrl,
}: {
    connected: boolean;
    chainId: number | undefined;
    locale: Locale;
    onSwitch?: (target: SwitchTarget) => Promise<boolean>;
    portalUrl?: string;
}) {
    const [failed, setFailed] = useState(false);
    if (!connected || !isUnsupportedChain(chainId)) return null;
    const t = (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) =>
        translate(locale, key, vars);
    const go = async (target: SwitchTarget) => {
        setFailed(false);
        try {
            if (!(await onSwitch?.(target))) setFailed(true);
        } catch {
            setFailed(true);
        }
    };
    return (
        <div role="alert" className="border-b border-warn bg-warn-wash">
            <div className="mx-auto flex max-w-[64rem] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                <p className="m-0 flex-1 text-[14px] font-semibold leading-snug text-warn">
                    {t("network.warn.text", { chainId: chainId ?? 0 })}
                    {failed && <span className="ml-1 font-normal">{t("network.warn.failed")}</span>}
                </p>
                {onSwitch !== undefined && (
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex h-9 items-center rounded-lg bg-accent-fill px-3 text-[13.5px] font-bold text-white hover:bg-accent-deep"
                            onClick={() => void go("polygon")}
                        >
                            {t("network.warn.switch")}
                        </button>
                        <button
                            type="button"
                            className="inline-flex h-9 items-center rounded-lg border border-line bg-surface px-3 text-[13.5px] font-semibold text-ink hover:border-ink-soft"
                            onClick={() => void go("amoy")}
                        >
                            {t("network.warn.amoy")}
                        </button>
                        <a href={portalLink(portalUrl, locale, "network/")} className="text-[13.5px] font-semibold">
                            {t("network.label")} →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

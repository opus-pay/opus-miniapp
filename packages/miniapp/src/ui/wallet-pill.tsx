"use client";

import { chainOf, displayAddress, shortAddress, translate, type Locale } from "../core";

export type WalletState = {
    /** The connected wallet's address; undefined when none is connected. */
    address?: string;
    chainId?: number;
    connecting?: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
};

const buttonClass =
    "inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-accent-fill px-3 text-[14px] font-bold text-white hover:bg-accent-deep disabled:opacity-60 sm:px-4";

/**
 * The wallet in the top bar: "Connect wallet", or the address (short, checksum spelling) with the network and a
 * way to disconnect. On a phone the network name is hidden and "Disconnect" becomes a ✕.
 */
export function WalletPill({ wallet, locale }: { wallet: WalletState; locale: Locale }) {
    const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
    if (wallet.address === undefined) {
        return (
            <button type="button" className={buttonClass} disabled={wallet.connecting} onClick={wallet.onConnect}>
                {wallet.connecting ? t("wallet.connecting") : t("wallet.connect")}
            </button>
        );
    }
    const chain = chainOf(wallet.chainId);
    return (
        <div className="flex items-center gap-2" aria-label={t("wallet.connected")}>
            <span className="inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2 text-[13px] font-medium sm:gap-2 sm:px-3 sm:text-[14px]">
                <span aria-hidden className="h-2 w-2 rounded-full bg-money" />
                <span className="font-mono" title={displayAddress(wallet.address)}>
                    {shortAddress(wallet.address)}
                </span>
                {wallet.chainId !== undefined && (
                    <span
                        className={`hidden sm:inline ${chain === undefined ? "font-semibold text-warn" : "text-muted"}`}
                    >
                        {chain?.name ?? `${t("network.label")} ⚠`}
                    </span>
                )}
            </span>
            <button
                type="button"
                aria-label={t("wallet.disconnect")}
                className="h-10 shrink-0 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-[14px] font-medium text-ink-soft hover:border-ink-soft sm:px-3"
                onClick={wallet.onDisconnect}
            >
                <span aria-hidden className="sm:hidden">
                    ✕
                </span>
                <span className="hidden sm:inline">{t("wallet.disconnect")}</span>
            </button>
        </div>
    );
}

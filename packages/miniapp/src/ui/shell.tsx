"use client";

import type { AnchorHTMLAttributes, ComponentType, ReactNode } from "react";

import { translate, type Locale } from "../core";
import { AppLogo } from "./logo";
import { NetworkWarning, type SwitchTarget } from "./network-warning";
import { PortalBar } from "./portal-bar";
import { WalletPill, type WalletState } from "./wallet-pill";

export type NavItem = {
    href: string;
    /** Already in the visitor's language. */
    label: string;
    icon?: ReactNode;
    /** True for the page being shown. */
    active?: boolean;
};

/** Anything that renders a link: a plain `<a>`, or a framework's own (for example Next's `Link`). */
export type LinkComponent = ComponentType<AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;

const Anchor: LinkComponent = (props) => <a {...props} />;

export type MiniAppShellProps = {
    /** The mini-app's own name and logo, top left of the header. */
    app: { name: ReactNode; mark?: ReactNode; tagline?: string; homeHref?: string };
    locale: Locale;
    onLocaleChange: (locale: Locale) => void;
    /** The Portal's address; defaults to the public Portal. */
    portalUrl?: string;
    wallet: WalletState;
    /**
     * Replaces the standard wallet pill with the app's own control (for example a menu with sign-in). The
     * `wallet` state is still used for the wrong-network bar, so the control must show the address the same way
     * (checksum spelling, first 6 and last 4 characters).
     */
    walletSlot?: ReactNode;
    /** Switches the wallet's network for the wrong-network bar; without it the bar only warns. */
    onSwitchChain?: (target: SwitchTarget) => Promise<boolean>;
    /** The app's pages: a menu in the header on a PC, a tab bar at the bottom on a phone. */
    nav?: readonly NavItem[];
    /** Extra controls next to the wallet (a notification bell, a help menu). */
    headerRight?: ReactNode;
    /** Shown under the page (links, legal text). */
    footer?: ReactNode;
    /** Use the framework's link for the app's own pages (client-side navigation). */
    Link?: LinkComponent;
    children: ReactNode;
};

/**
 * The frame every OPUS mini-app puts around its pages, top to bottom:
 *
 *  1. the thin bar: the way back to the Portal (top left) and the language (top right), scrolls away;
 *  2. the wrong-network bar, only when the wallet is on a chain OPUS does not use;
 *  3. the sticky header: the app's logo, its menu (PC), extra controls and the wallet;
 *  4. the page, at most 64 rem wide;
 *  5. the footer;
 *  6. on a phone, the menu as a tab bar fixed to the bottom.
 */
export function MiniAppShell({
    app,
    locale,
    onLocaleChange,
    portalUrl,
    wallet,
    walletSlot,
    onSwitchChain,
    nav = [],
    headerRight,
    footer,
    Link = Anchor,
    children,
}: MiniAppShellProps) {
    const menuLabel = translate(locale, "nav.menu");
    return (
        <>
            <PortalBar locale={locale} onLocaleChange={onLocaleChange} portalUrl={portalUrl} />
            <NetworkWarning
                connected={wallet.address !== undefined}
                chainId={wallet.chainId}
                locale={locale}
                onSwitch={onSwitchChain}
                portalUrl={portalUrl}
            />
            <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 border-b border-line bg-surface">
                <div className="mx-auto flex max-w-[64rem] items-center gap-2 px-4 py-2.5">
                    <Link href={app.homeHref ?? "/"} className="mr-auto shrink-0 no-underline lg:mr-0">
                        <AppLogo name={app.name} mark={app.mark} tagline={app.tagline} />
                    </Link>
                    {nav.length > 0 && (
                        <>
                            <span aria-hidden className="mx-2 hidden h-6 w-px bg-line lg:block" />
                            <nav aria-label={menuLabel} className="mr-auto hidden gap-1 lg:flex">
                                {nav.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-current={item.active ? "page" : undefined}
                                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[15px] font-medium text-muted no-underline hover:text-ink aria-[current=page]:bg-accent-wash aria-[current=page]:font-bold aria-[current=page]:text-accent"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </>
                    )}
                    {headerRight}
                    {walletSlot ?? <WalletPill wallet={wallet} locale={locale} />}
                </div>
            </header>
            <main
                className={`mx-auto max-w-[64rem] px-4 pt-5 lg:pb-12 lg:pt-7 ${
                    nav.length > 0 ? "pb-[calc(110px+env(safe-area-inset-bottom,0px))]" : "pb-12"
                }`}
            >
                {children}
            </main>
            {footer !== undefined && <footer className="border-t border-line">{footer}</footer>}
            {nav.length > 0 && (
                <nav
                    aria-label={menuLabel}
                    style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
                    className="fixed inset-x-0 bottom-0 z-20 grid border-t border-line bg-surface px-1 pb-[calc(8px+env(safe-area-inset-bottom,0px))] pt-1.5 lg:hidden"
                >
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={item.active ? "page" : undefined}
                            className="flex min-h-[50px] flex-col items-center justify-center gap-0.5 text-center text-[12px] leading-tight text-muted no-underline aria-[current=page]:font-bold aria-[current=page]:text-accent"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            )}
        </>
    );
}

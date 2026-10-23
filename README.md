# opus-miniapp

English · [한국어](README.ko.md)

The **shared UI kit** for services built on OPUS (`@opus/miniapp`). It gives a service the same colours, fonts, address format and language list as OPUS Portal (`opus-portal`), plus, in one step, a **"back to the Portal" button in the top-left corner**, a wallet pill and a wrong-network warning. Every mini app built on OPUS (for example WayHand) follows this standard ([docs/standard.md](docs/standard.md)).

```
┌──────────────────────────────────────────────────────────┐
│ [‹ ◎ OPUS]                                  [Language ▾] │  ← Portal bar (scrolls away)
├──────────────────────────────────────────────────────────┤
│ ⚠ Your wallet is on a network OPUS does not use … [Switch]│  ← only on the wrong network
├──────────────────────────────────────────────────────────┤
│ ◎ App name │ Home  Tasks  Me        [Bell] [0xf39F…2266 ✕] │  ← app header (sticky)
├──────────────────────────────────────────────────────────┤
│                       page content                       │
├──────────────────────────────────────────────────────────┤
│  Home        Tasks        Me                             │  ← phones only: bottom tab bar
└──────────────────────────────────────────────────────────┘
```

## What is in it

| Name                                | What it does                                                                                                                        |
| :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `MiniAppShell`                      | The whole frame above. Takes the app name and logo, the menu, the wallet, the language and the Portal address                       |
| `PortalBar`                         | "‹ OPUS" in the top-left (back to the Portal), the app's small buttons on the right (`right`: bell, help) and the language select   |
| `WalletPill`                        | "Connect wallet", or the address (short, checksum spelling), the network name and a disconnect button                               |
| `NetworkWarning`                    | A warning strip and a switch button when the wallet is on a network other than Polygon or Polygon Amoy                              |
| `AddressText`                       | An address in checksum spelling with a copy button                                                                                  |
| `LanguageSelect`, `useLocale`       | The four-language select and its state (`?lang=` → saved choice → browser language → English)                                       |
| `LogoMark`, `AppLogo`               | The OPUS mark and a slot for the app's logo                                                                                         |
| `Button`, `Card`, `Badge`, `Notice` | Button, card, badge and notice box                                                                                                  |
| `tokens.css`                        | Colours (light and dark) and fonts. The same values as the Portal                                                                   |
| `core` (`@opus/miniapp/core`)       | Functions that need no screen: `displayAddress`, `shortAddress`, `LOCALES`, `translate`, `resolvePortalUrl`, `isUnsupportedChain` … |

The kit **does not know any wallet library.** It only takes an address, a chain and callbacks. The mini app connects wagmi or anything else.

## Using it (Next.js + Tailwind v4)

The kit is not on npm yet. Reference the folder, the same way the SDK is used.

1. Install: in `package.json`, `"@opus/miniapp": "file:../opus-miniapp/packages/miniapp"` (a sibling folder).
2. `next.config.ts`: `transpilePackages: ["@opus/miniapp"]` (the kit ships TypeScript source, so Next compiles it with your app).
3. `app/globals.css`:

```css
@import "tailwindcss";
@import "@opus/miniapp/tokens.css";
@source "../node_modules/@opus/miniapp/src"; /* so Tailwind also generates the kit's classes */
```

4. Wrap your pages in the shell (wagmi example):

```tsx
"use client";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { MiniAppShell, useLocale } from "@opus/miniapp";
import Link from "next/link";

export function Frame({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useLocale("opus.myapp.locale");
    const { address, chainId } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChainAsync } = useSwitchChain();
    return (
        <MiniAppShell
            app={{ name: "MyApp", mark: <MyLogo /> }}
            locale={locale}
            onLocaleChange={setLocale}
            portalUrl={process.env.NEXT_PUBLIC_PORTAL_URL}
            Link={Link}
            nav={[{ href: "/", label: "Home", active: true }]}
            wallet={{
                address,
                chainId,
                connecting: isPending,
                onConnect: () => connect({ connector: connectors[0] }),
                onDisconnect: () => disconnect(),
            }}
            onSwitchChain={async (target) => {
                try {
                    await switchChainAsync({ chainId: target === "polygon" ? 137 : 80002 });
                    return true;
                } catch {
                    return false;
                }
            }}
        >
            {children}
        </MiniAppShell>
    );
}
```

If `NEXT_PUBLIC_PORTAL_URL` is empty or not https, the default Portal address (`DEFAULT_PORTAL_URL`) is used.

## Opened inside another app

When a mini app is opened inside another app (a web view, say), "back to the Portal" is not a link but a **message sent to that app** (`{"channel":"opus-nav","action":"portal"}`). What to do with the message is up to that app. In a normal browser it is a link. Inside a wallet app's own browser, `window.ethereum` is used as it is when present.

## Looking at the kit, and changing it

```bash
yarn install
yarn dev          # http://localhost:3300 , a demo with every part and buttons for wallet and network states
yarn test         # rules that run without a screen + a server-render check
yarn lint && yarn formatting:check && yarn build
```

-   Messages (`core/messages.ts`) must have the same keys and the same `{slots}` in en/ko/ja/zh (a test checks it).
-   Check the demo on a phone (360–390 px) and on a desktop (1280 px).
-   A change to the kit affects every mini app that uses it, so a visible change goes together with [docs/standard.md](docs/standard.md).

## What it does not do

OPUS is a neutral protocol and the Portal only lists services. The kit gives **shape and rules** only. It carries no service's revenue, policy or logic. How to connect a wallet, how to sign in and how payment works are each mini app's own business.

## License

MIT. See [LICENSE](LICENSE).

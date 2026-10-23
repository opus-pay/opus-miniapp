# The OPUS mini app standard

English · [한국어](standard.ko.md)

The screen rules a mini app built on OPUS (for example WayHand) must follow. If you use the kit (`@opus/miniapp`), rules 1–7 are met automatically. A mini app that does not use the kit must look the same.

## Must

1. **A back-to-the-Portal button in the top-left.** In the thin bar at the very top, on the left: "‹ ◎ OPUS". It goes to the Portal in the same tab. On the right: the language select. The bar scrolls away.
2. **An app header (sticky).** The app logo and name on the left, the menu in the middle (desktop), the wallet on the right. On phones the menu moves to a tab bar at the bottom.
3. **A wrong-network warning.** If the wallet is not on Polygon (137) or Polygon Amoy (80002), show a warning strip under the header with a switch button.
4. **Address format.** Checksum (EIP-55) spelling everywhere. Shortened as the first 6 characters … the last 4 (`0xf39F…2266`). The full address on hover. A copy button wherever the full address is shown.
5. **Four languages.** English, Korean, Japanese, Chinese, named `English`, `한국어`, `日本語`, `简体中文`. Order of choice: `?lang=` in the address → the saved choice (cookie) → the browser language (the first of the four that fits; Chinese for traditional and simplified) → English. **Only a language the user picks in the language menu** is saved, in a cookie of this site for one year (`Path=/`, `SameSite=Lax`, `Secure` on https). A `?lang=` that came in the address is used for that visit only and is not saved (so a link set to another language does not overwrite the user's own choice). If cookies are blocked, the choice lasts for this visit only. Changing the language with the select also changes a `?lang=` already in the address (and leaves the address alone if it has none); otherwise the old value in the address would win on reload.
6. **Responsive.** No horizontal overflow on a phone (360–390 px) or a desktop (1280 px). The page is at most 64 rem wide.
7. **Colours and fonts from tokens.** Use only the colours in `tokens.css` (light and dark). Do not write colours by hand (except an app logo's own picture).
8. **The same screen inside another app.** When opened in a web view or a wallet app's own browser and `window.ethereum` is present, use that wallet automatically (do not show a choice of connection methods). Inside another app, "back to the Portal" becomes a message to that app (the kit handles it).

## What the Portal does

-   It opens a mini app's link with the current language added, for example `?lang=ko`. The kit's "back to the Portal" and network links add the current language the same way (`portalLink`).
-   The Portal's network page (`/network/`) is the target of the "network" link in the warning strip.

## What not to do

-   Do not put the Portal's ranking, ads or payment into a mini app's screen. The Portal bar is only a way back.
-   Do not handle private keys or recovery phrases. The wallet belongs to a wallet app or the browser's wallet.

## How to follow this standard

The easiest way is to use the kit ([README](../README.md)). When you build your own screens, check the list above one by one. Pass the app name and logo, the menu and the wallet display to `MiniAppShell` as `app`, `nav`, `headerRight` and `wallet`, and import `@opus/miniapp/tokens.css` for the colours.

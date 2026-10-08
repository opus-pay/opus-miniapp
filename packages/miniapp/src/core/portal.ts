/** Where the OPUS Portal lives, unless a mini-app is told otherwise (its `portalUrl` setting). */
export const DEFAULT_PORTAL_URL = "https://www.opusportal.org/";

/**
 * The Portal address a mini-app may link to: an https address (or http on localhost, for development).
 * Anything else, or nothing, falls back to the default, so a bad setting can never turn the way back into a
 * `javascript:` link.
 */
export function resolvePortalUrl(url: string | undefined): string {
    const text = url?.trim();
    if (text === undefined || text === "") return DEFAULT_PORTAL_URL;
    try {
        const parsed = new URL(text);
        const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
        if (parsed.protocol === "https:" || (parsed.protocol === "http:" && local)) return parsed.toString();
    } catch {
        // not a web address
    }
    return DEFAULT_PORTAL_URL;
}

/**
 * When a mini-app runs inside the OPUS wallet app, the app (not the page) knows where its Portal screen is, so
 * the way back is a message to the app instead of a link. The app answers by showing its home screen.
 */
export const APP_NAV_CHANNEL = "opus-nav";
export const APP_NAV_PORTAL = "portal";

export const portalNavMessage = (): string => JSON.stringify({ channel: APP_NAV_CHANNEL, action: APP_NAV_PORTAL });

type AppWebView = { ReactNativeWebView?: { postMessage(message: string): void } };

/** The wallet app's bridge, when this page runs inside it. */
export function appBridge(
    win: AppWebView | undefined = typeof window === "undefined" ? undefined : (window as unknown as AppWebView)
) {
    return win?.ReactNativeWebView;
}

/** Sends the visitor back to the Portal from inside the wallet app. Returns false when there is no app. */
export function goToPortalInApp(win?: AppWebView): boolean {
    const bridge = appBridge(win);
    if (bridge === undefined) return false;
    bridge.postMessage(portalNavMessage());
    return true;
}

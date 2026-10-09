import { expect } from "chai";

import {
    CHAINS,
    addressWithLanguage,
    DEFAULT_PORTAL_URL,
    LOCALES,
    LOCALE_NAMES,
    MESSAGES,
    chainOf,
    displayAddress,
    goToPortalInApp,
    isUnsupportedChain,
    choiceCookie,
    initialLocale,
    pickLocale,
    portalLink,
    portalNavMessage,
    readCookie,
    resolvePortalUrl,
    shortAddress,
    translate,
} from "../src/core";

const slots = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join(",");
const CHECKSUM = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

describe("addresses", () => {
    it("shows the checksum spelling, short as first 6 and last 4", () => {
        expect(displayAddress(CHECKSUM.toLowerCase())).to.equal(CHECKSUM);
        expect(shortAddress(CHECKSUM.toLowerCase())).to.equal("0xf39F…2266");
        expect(shortAddress("0x123")).to.equal("0x123");
        expect(displayAddress("not an address")).to.equal("not an address");
    });
});

describe("languages", () => {
    it("are the four OPUS languages with the names the Portal and WayHand use", () => {
        expect(LOCALES).to.deep.equal(["en", "ko", "ja", "zh"]);
        expect(LOCALE_NAMES).to.deep.equal({ en: "English", ko: "한국어", ja: "日本語", zh: "简体中文" });
    });

    it("picks the first language OPUS has, else English", () => {
        expect(pickLocale(["fr-FR", "ja-JP"])).to.equal("ja");
        expect(pickLocale(["zh-Hans-CN"])).to.equal("zh");
        expect(pickLocale(["de"])).to.equal("en");
        expect(pickLocale([])).to.equal("en");
    });

    it("starts in the address's language, else the last choice, else the browser's, else English", () => {
        expect(initialLocale("ko", "ja", ["zh-CN"])).to.equal("ko");
        expect(initialLocale(null, "ja", ["zh-CN"])).to.equal("ja");
        expect(initialLocale(null, null, ["fr-FR", "ko-KR"])).to.equal("ko");
        expect(initialLocale(null, null, ["zh-TW"])).to.equal("zh");
        expect(initialLocale(null, null, ["de"])).to.equal("en");
        expect(initialLocale(null, null)).to.equal("en");
        // a value that is not one of the four is ignored, so the next step decides
        expect(initialLocale("fr", "de", ["ja"])).to.equal("ja");
        expect(initialLocale("fr", "de")).to.equal("en");
    });

    it("keeps the chosen language in a cookie that is read back", () => {
        const text = choiceCookie("opus_locale", "ko", true);
        expect(text).to.contain("opus_locale=ko").and.to.contain("Path=/").and.to.contain("SameSite=Lax");
        expect(text).to.contain("Secure").and.to.contain("Max-Age=31536000");
        expect(choiceCookie("opus_locale", "ko", false)).to.not.contain("Secure");
        expect(readCookie("a=1; opus_locale=ja; b=2", "opus_locale")).to.equal("ja");
        expect(readCookie("a=1", "opus_locale")).to.equal(null);
        expect(readCookie("opus_locale=%E0%A4%A", "opus_locale")).to.equal(null);
        expect(readCookie("xopus_locale=ja", "opus_locale")).to.equal(null);
    });

    it("puts a language chosen with the control into the address, only when the address has one", () => {
        expect(addressWithLanguage("https://www.opusportal.org/?lang=ko", "en")).to.equal(
            "https://www.opusportal.org/?lang=en"
        );
        expect(addressWithLanguage("https://x.app/post?a=1&lang=ja#top", "zh")).to.equal(
            "https://x.app/post?a=1&lang=zh#top"
        );
        expect(addressWithLanguage("https://www.opusportal.org/", "en")).to.equal(null);
        expect(addressWithLanguage("not an address", "en")).to.equal(null);
    });

    it("links back to the Portal in the reader's language", () => {
        expect(portalLink(undefined, "ko")).to.equal("https://www.opusportal.org/?lang=ko");
        expect(portalLink("https://portal.example.org/", "ja", "network/")).to.equal(
            "https://portal.example.org/network/?lang=ja"
        );
        // a bad setting still falls back to the default Portal
        expect(portalLink("javascript:alert(1)", "zh")).to.equal("https://www.opusportal.org/?lang=zh");
    });

    it("gives every language the same keys and the same {slots}, with no empty text", () => {
        const keys = Object.keys(MESSAGES.en).sort();
        for (const locale of LOCALES) {
            expect(Object.keys(MESSAGES[locale]).sort(), locale).to.deep.equal(keys);
            for (const key of keys) {
                const k = key as keyof (typeof MESSAGES)["en"];
                expect(MESSAGES[locale][k].trim(), `${locale} ${key}`).to.not.equal("");
                expect(slots(MESSAGES[locale][k]), `${locale} ${key}`).to.equal(slots(MESSAGES.en[k]));
            }
        }
    });

    it("fills slots and leaves unknown ones", () => {
        expect(translate("en", "network.warn.text", { chainId: 56 })).to.contain("chain ID 56");
        expect(translate("ko", "network.warn.text")).to.contain("{chainId}");
    });
});

describe("the way back to the Portal", () => {
    it("uses the default Portal unless given an https address (or http on localhost)", () => {
        expect(resolvePortalUrl(undefined)).to.equal(DEFAULT_PORTAL_URL);
        expect(resolvePortalUrl("  ")).to.equal(DEFAULT_PORTAL_URL);
        expect(resolvePortalUrl("https://portal.example.org/")).to.equal("https://portal.example.org/");
        expect(resolvePortalUrl("http://localhost:3200")).to.equal("http://localhost:3200/");
    });

    it("never turns a bad setting into a link that runs code or leaves https", () => {
        for (const bad of ["javascript:alert(1)", "data:text/html,x", "http://evil.example", "ftp://x.org", "nope"]) {
            expect(resolvePortalUrl(bad), bad).to.equal(DEFAULT_PORTAL_URL);
        }
    });

    it("tells the wallet app to show its Portal when the page runs inside it", () => {
        const sent: string[] = [];
        expect(goToPortalInApp({ ReactNativeWebView: { postMessage: (m) => sent.push(m) } })).to.equal(true);
        expect(JSON.parse(sent[0])).to.deep.equal({ channel: "opus-nav", action: "portal" });
        expect(sent[0]).to.equal(portalNavMessage());
        // in an ordinary browser there is no bridge, so the link works as a link
        expect(goToPortalInApp({})).to.equal(false);
    });
});

describe("chains", () => {
    it("knows Polygon and Polygon Amoy, and warns for any other chain", () => {
        expect(CHAINS.map((c) => c.chainId)).to.deep.equal([137, 80002]);
        expect(chainOf(137)?.name).to.equal("Polygon");
        for (const other of [1, 56, 10, 8453, 31337, 80001])
            expect(isUnsupportedChain(other), String(other)).to.equal(true);
        expect(isUnsupportedChain(137)).to.equal(false);
        expect(isUnsupportedChain(80002)).to.equal(false);
        expect(isUnsupportedChain(undefined)).to.equal(false);
    });
});

import { expect } from "chai";
import { renderToStaticMarkup } from "react-dom/server";

import { MiniAppShell, NetworkWarning, PortalBar, WalletPill } from "../src";

const noop = () => undefined;
const wallet = { onConnect: noop, onDisconnect: noop };
const ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cffFb92266".toLowerCase();

describe("portal bar", () => {
    it("links back to the Portal at the left, before the language, with a label in the visitor's language", () => {
        const html = renderToStaticMarkup(<PortalBar locale="ko" onLocaleChange={noop} />);
        expect(html).to.contain('href="https://opus-pay.github.io/opus-portal/"');
        expect(html).to.contain('aria-label="OPUS 포털로 돌아가기"');
        // the link comes first (top left), the language select after it (top right)
        expect(html.indexOf("<a ")).to.be.lessThan(html.indexOf("<select"));
        // the same tab by default; a new tab only when asked
        expect(html).to.not.contain("_blank");
        expect(renderToStaticMarkup(<PortalBar locale="en" onLocaleChange={noop} newTab />)).to.contain(
            'rel="noopener noreferrer"'
        );
    });

    it("uses the given Portal address, and ignores one that is not https", () => {
        expect(
            renderToStaticMarkup(
                <PortalBar locale="en" onLocaleChange={noop} portalUrl="https://portal.example.org/" />
            )
        ).to.contain('href="https://portal.example.org/"');
        expect(
            renderToStaticMarkup(<PortalBar locale="en" onLocaleChange={noop} portalUrl="javascript:alert(1)" />)
        ).to.not.contain("javascript:");
    });

    it("lists the four languages by their names", () => {
        const html = renderToStaticMarkup(<PortalBar locale="en" onLocaleChange={noop} />);
        for (const name of ["English", "한국어", "日本語", "简体中文"]) expect(html).to.contain(name);
    });
});

describe("wallet pill", () => {
    it("offers to connect when no wallet is connected", () => {
        expect(renderToStaticMarkup(<WalletPill wallet={wallet} locale="en" />)).to.contain("Connect wallet");
    });

    it("shows the short checksum address and the network name, and warns on an unknown chain", () => {
        const on137 = renderToStaticMarkup(
            <WalletPill wallet={{ ...wallet, address: ADDRESS, chainId: 137 }} locale="en" />
        );
        expect(on137).to.contain("0xf39F…2266").and.to.contain("Polygon");
        const other = renderToStaticMarkup(
            <WalletPill wallet={{ ...wallet, address: ADDRESS, chainId: 1 }} locale="en" />
        );
        expect(other).to.contain("Network ⚠");
    });
});

describe("network warning", () => {
    const render = (connected: boolean, chainId: number | undefined, onSwitch?: () => Promise<boolean>) =>
        renderToStaticMarkup(
            <NetworkWarning connected={connected} chainId={chainId} locale="en" onSwitch={onSwitch} />
        );

    it("shows only for a connected wallet on a chain other than Polygon or Amoy", () => {
        expect(render(true, 1)).to.contain("chain ID 1");
        expect(render(true, 137)).to.equal("");
        expect(render(true, 80002)).to.equal("");
        expect(render(false, 1)).to.equal("");
        expect(render(true, undefined)).to.equal("");
    });

    it("offers the switch buttons only when the app can switch", () => {
        expect(render(true, 1, async () => true)).to.contain("<button");
        expect(render(true, 1)).to.not.contain("<button");
    });
});

describe("mini-app shell", () => {
    const shell = (nav?: { href: string; label: string; active?: boolean }[]) =>
        renderToStaticMarkup(
            <MiniAppShell
                app={{ name: "Demo" }}
                locale="ja"
                onLocaleChange={noop}
                wallet={wallet}
                nav={nav}
                footer={<p>footer text</p>}
            >
                <p>the page</p>
            </MiniAppShell>
        );

    it("puts the way back to the Portal first, then the header, the page and the footer", () => {
        const html = shell();
        const order = ['aria-label="OPUSポータルに戻る"', "<header", "the page", "footer text"].map((s) =>
            html.indexOf(s)
        );
        expect(order.every((i) => i >= 0)).to.equal(true);
        expect([...order].sort((a, b) => a - b)).to.deep.equal(order);
        expect(html).to.contain("ウォレットを接続");
    });

    it("shows the menu in the header and as a bottom tab bar, marking the current page", () => {
        const html = shell([
            { href: "/", label: "Home", active: true },
            { href: "/work", label: "Work" },
        ]);
        expect(html.match(/aria-current="page"/g)).to.have.length(2); // header menu and tab bar
        expect(html).to.contain("fixed inset-x-0 bottom-0");
        // no menu, no tab bar
        expect(shell()).to.not.contain("fixed inset-x-0 bottom-0");
    });
});

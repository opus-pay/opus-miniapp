"use client";

import { useState } from "react";

import {
    AddressText,
    Badge,
    Button,
    Card,
    LogoMark,
    MiniAppShell,
    Notice,
    useLocale,
    type NavItem,
} from "@opus/miniapp";

const ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cffffb92266";

const TEXTS = {
    en: {
        app: "Demo",
        home: "Home",
        tasks: "Tasks",
        me: "Me",
        title: "OPUS mini-app kit",
        intro: "Every part of the kit on one page. Use the buttons to try the wallet and the network states.",
        wallet: "Wallet",
        none: "Not connected",
        polygon: "On Polygon",
        amoy: "On Amoy (test)",
        other: "On Ethereum (wrong network)",
        parts: "Parts",
        footer: "Footer text goes here.",
    },
    ko: {
        app: "데모",
        home: "홈",
        tasks: "할 일",
        me: "내 정보",
        title: "OPUS 미니앱 키트",
        intro: "키트의 모든 부분을 한 페이지에 모았습니다. 버튼으로 지갑과 네트워크 상태를 바꿔 보세요.",
        wallet: "지갑",
        none: "연결 안 됨",
        polygon: "Polygon",
        amoy: "Amoy (테스트)",
        other: "이더리움 (잘못된 네트워크)",
        parts: "구성 요소",
        footer: "여기에 바닥글이 들어갑니다.",
    },
    ja: {
        app: "デモ",
        home: "ホーム",
        tasks: "タスク",
        me: "自分",
        title: "OPUSミニアプリキット",
        intro: "キットのすべてを1ページに集めました。ボタンでウォレットとネットワークの状態を試せます。",
        wallet: "ウォレット",
        none: "未接続",
        polygon: "Polygon",
        amoy: "Amoy(テスト)",
        other: "Ethereum(誤ったネットワーク)",
        parts: "部品",
        footer: "ここにフッターが入ります。",
    },
    zh: {
        app: "演示",
        home: "首页",
        tasks: "任务",
        me: "我的",
        title: "OPUS 迷你应用工具包",
        intro: "工具包的所有部分都在这一页。用按钮试试钱包和网络状态。",
        wallet: "钱包",
        none: "未连接",
        polygon: "Polygon",
        amoy: "Amoy(测试)",
        other: "以太坊(错误网络)",
        parts: "组成部分",
        footer: "页脚文字放在这里。",
    },
} as const;

/** The kit on one page, with buttons for the wallet and network states a mini-app has to handle. */
export function Demo() {
    const [locale, setLocale] = useLocale();
    const t = TEXTS[locale];
    const [state, setState] = useState<"none" | "polygon" | "amoy" | "other">("none");
    const [page, setPage] = useState("/");
    const chainId = { none: undefined, polygon: 137, amoy: 80002, other: 1 }[state];
    const nav: NavItem[] = [
        { href: "/", label: t.home, active: page === "/" },
        { href: "/tasks", label: t.tasks, active: page === "/tasks" },
        { href: "/me", label: t.me, active: page === "/me" },
    ];
    return (
        <MiniAppShell
            app={{ name: t.app, tagline: "OPUS mini-app", mark: <LogoMark /> }}
            locale={locale}
            onLocaleChange={setLocale}
            portalUrl={process.env.NEXT_PUBLIC_PORTAL_URL}
            wallet={{
                address: state === "none" ? undefined : ADDRESS,
                chainId,
                onConnect: () => setState("polygon"),
                onDisconnect: () => setState("none"),
            }}
            onSwitchChain={async (target) => {
                setState(target === "polygon" ? "polygon" : "amoy");
                return true;
            }}
            nav={nav}
            footer={<p className="m-0 mx-auto max-w-[64rem] px-4 py-6 text-[13px] text-muted">{t.footer}</p>}
        >
            <div className="flex flex-col gap-6">
                <section className="flex max-w-[46rem] flex-col gap-2">
                    <h1 className="m-0 font-display text-[28px] font-bold leading-tight sm:text-[34px]">{t.title}</h1>
                    <p className="m-0 text-[16px] leading-relaxed text-ink-soft">{t.intro}</p>
                </section>
                <Card>
                    <h2 className="m-0 mb-3 font-display text-[18px] font-bold">{t.wallet}</h2>
                    <div className="flex flex-wrap gap-2">
                        {(["none", "polygon", "amoy", "other"] as const).map((key) => (
                            <Button
                                key={key}
                                variant={state === key ? "primary" : "secondary"}
                                onClick={() => setState(key)}
                            >
                                {t[key]}
                            </Button>
                        ))}
                    </div>
                    <p className="m-0 mt-3">
                        <AddressText address={ADDRESS} locale={locale} />
                    </p>
                </Card>
                <Card>
                    <h2 className="m-0 mb-3 font-display text-[18px] font-bold">{t.parts}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge>neutral</Badge>
                        <Badge tone="accent">accent</Badge>
                        <Badge tone="money">money</Badge>
                        <Badge tone="warn">warn</Badge>
                        <Button variant="danger">danger</Button>
                        <Button variant="secondary" onClick={() => setPage(page === "/" ? "/tasks" : "/")}>
                            {t.tasks}
                        </Button>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                        <Notice>info</Notice>
                        <Notice tone="warn">warn</Notice>
                    </div>
                </Card>
            </div>
        </MiniAppShell>
    );
}

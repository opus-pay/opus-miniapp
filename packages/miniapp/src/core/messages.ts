import type { Locale } from "./locales";

/**
 * The words the shell itself uses (the way back to the Portal, the wallet pill, the network warning, copy). A
 * mini-app writes its own texts; these are the shared chrome, so every mini-app says them the same way in all
 * four languages. The keys and the {slots} are the same in every language (a test checks it).
 */
const en = {
    "portal.back": "OPUS",
    "portal.title": "Back to the OPUS Portal",
    "nav.language": "Language",
    "nav.menu": "Menu",
    "wallet.connect": "Connect wallet",
    "wallet.connecting": "Connecting…",
    "wallet.disconnect": "Disconnect",
    "wallet.connected": "Connected wallet",
    "network.label": "Network",
    "network.warn.text":
        "Your wallet is on a network OPUS does not use (chain ID {chainId}). Switch to Polygon, or to Polygon Amoy for tests. Money sent on another network can be lost.",
    "network.warn.switch": "Switch to Polygon",
    "network.warn.amoy": "Use the test network",
    "network.warn.failed": "The wallet could not do it.",
    "common.copy": "Copy",
    "common.copied": "Copied",
    "common.address": "Wallet address",
} as const;

export type MessageKey = keyof typeof en;

const ko: Record<MessageKey, string> = {
    "portal.back": "OPUS",
    "portal.title": "OPUS 포털로 돌아가기",
    "nav.language": "언어",
    "nav.menu": "메뉴",
    "wallet.connect": "지갑 연결",
    "wallet.connecting": "연결 중…",
    "wallet.disconnect": "연결 끊기",
    "wallet.connected": "연결된 지갑",
    "network.label": "네트워크",
    "network.warn.text":
        "지갑이 OPUS가 쓰지 않는 네트워크에 있습니다 (체인 ID {chainId}). Polygon으로 바꾸세요. 시험할 때는 Polygon Amoy입니다. 다른 네트워크로 보낸 돈은 잃을 수 있습니다.",
    "network.warn.switch": "Polygon으로 바꾸기",
    "network.warn.amoy": "테스트 네트워크로 바꾸기",
    "network.warn.failed": "지갑이 요청을 처리하지 못했습니다.",
    "common.copy": "복사",
    "common.copied": "복사됨",
    "common.address": "지갑 주소",
};

const ja: Record<MessageKey, string> = {
    "portal.back": "OPUS",
    "portal.title": "OPUSポータルに戻る",
    "nav.language": "言語",
    "nav.menu": "メニュー",
    "wallet.connect": "ウォレットを接続",
    "wallet.connecting": "接続中…",
    "wallet.disconnect": "接続を解除",
    "wallet.connected": "接続中のウォレット",
    "network.label": "ネットワーク",
    "network.warn.text":
        "ウォレットがOPUSの使わないネットワークにあります(チェーンID {chainId})。Polygonに切り替えてください。試す場合はPolygon Amoyです。別のネットワークに送ったお金は失う恐れがあります。",
    "network.warn.switch": "Polygonに切り替え",
    "network.warn.amoy": "テストネットワークに切り替え",
    "network.warn.failed": "ウォレットが処理できませんでした。",
    "common.copy": "コピー",
    "common.copied": "コピーしました",
    "common.address": "ウォレットアドレス",
};

const zh: Record<MessageKey, string> = {
    "portal.back": "OPUS",
    "portal.title": "返回 OPUS 门户",
    "nav.language": "语言",
    "nav.menu": "菜单",
    "wallet.connect": "连接钱包",
    "wallet.connecting": "连接中…",
    "wallet.disconnect": "断开连接",
    "wallet.connected": "已连接的钱包",
    "network.label": "网络",
    "network.warn.text":
        "你的钱包所在网络不是 OPUS 使用的网络(链 ID {chainId})。请切换到 Polygon;测试时用 Polygon Amoy。发送到其他网络的资金可能丢失。",
    "network.warn.switch": "切换到 Polygon",
    "network.warn.amoy": "切换到测试网",
    "network.warn.failed": "钱包无法处理该请求。",
    "common.copy": "复制",
    "common.copied": "已复制",
    "common.address": "钱包地址",
};

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = { en, ko, ja, zh };

/** The text for a key in a language, with `{slots}` filled. Unknown slots stay as written. */
export function translate(locale: Locale, key: MessageKey, vars: Record<string, string | number> = {}): string {
    const text = MESSAGES[locale][key] ?? en[key];
    return text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
}

# opus-miniapp

OPUS 미니앱이 함께 쓰는 **공통 UI 키트**입니다 (`@opus/miniapp`). 포털(`opus-portal`)과 같은 색·글꼴·주소 표기·언어 목록을 쓰고, **왼쪽 위에서 포털로 돌아가는 버튼**, 지갑 표시, 잘못된 네트워크 경고를 한 번에 줍니다. WayHand를 비롯한 모든 미니앱이 이 규격을 따릅니다 ([docs/standard.md](docs/standard.md)).

```
┌──────────────────────────────────────────────────────────┐
│ [‹ ◎ OPUS]                                   [언어 ▾]    │  ← 포털 바 (스크롤하면 사라짐)
├──────────────────────────────────────────────────────────┤
│ ⚠ 지갑이 OPUS가 쓰지 않는 네트워크에 있습니다 … [바꾸기] │  ← 잘못된 네트워크일 때만
├──────────────────────────────────────────────────────────┤
│ ◎ 앱 이름 │ 홈  할 일  내 정보      [알림] [0xf39F…2266 ✕] │  ← 앱 헤더 (고정)
├──────────────────────────────────────────────────────────┤
│                       페이지 내용                         │
├──────────────────────────────────────────────────────────┤
│  홈        할 일        내 정보                           │  ← 휴대폰에서만, 아래 탭 바
└──────────────────────────────────────────────────────────┘
```

## 들어 있는 것

| 이름                                | 하는 일                                                                                                                   |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `MiniAppShell`                      | 위의 틀 전체. 앱 이름·로고, 메뉴, 지갑, 언어, 포털 주소를 받는다                                                          |
| `PortalBar`                         | 왼쪽 위 "‹ OPUS" (포털로 돌아가기), 오른쪽 위 앱의 작은 버튼(`right`: 알림 종, 도움말)과 언어 선택                        |
| `WalletPill`                        | "지갑 연결", 또는 주소(짧게, 체크섬 철자)와 네트워크 이름과 연결 끊기                                                     |
| `NetworkWarning`                    | Polygon·Polygon Amoy가 아닌 네트워크에 있을 때의 경고 띠와 바꾸기 버튼                                                    |
| `AddressText`                       | 체크섬 철자의 주소와 복사 버튼                                                                                            |
| `LanguageSelect`, `useLocale`       | 4개 언어 선택과 상태 (`?lang=` → 저장된 값 → 브라우저 언어 → 영어)                                                        |
| `LogoMark`, `AppLogo`               | OPUS 마크, 앱 로고 칸                                                                                                     |
| `Button`, `Card`, `Badge`, `Notice` | 버튼·카드·배지·안내 상자                                                                                                  |
| `tokens.css`                        | 색(밝은/어두운 화면)과 글꼴. 포털·WayHand와 같은 값                                                                       |
| `core` (`@opus/miniapp/core`)       | 화면 없이 쓰는 함수: `displayAddress`, `shortAddress`, `LOCALES`, `translate`, `resolvePortalUrl`, `isUnsupportedChain` … |

키트는 **지갑 라이브러리를 모릅니다.** 주소·체인·콜백만 받습니다. wagmi든 다른 것이든 미니앱이 연결해 주면 됩니다.

## 쓰는 법 (Next.js + Tailwind v4)

1. 설치: `package.json`에 `"@opus/miniapp": "file:../opus-miniapp/packages/miniapp"` (옆 폴더 참조, SDK와 같은 방식).
2. `next.config.ts`: `transpilePackages: ["@opus/miniapp"]` (키트는 TypeScript 소스로 들어 있어 Next가 함께 컴파일).
3. `app/globals.css`:

```css
@import "tailwindcss";
@import "@opus/miniapp/tokens.css";
@source "../node_modules/@opus/miniapp/src"; /* Tailwind가 키트의 클래스도 만들게 */
```

4. 페이지를 틀로 감쌉니다 (wagmi 예):

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

`NEXT_PUBLIC_PORTAL_URL`이 비어 있거나 https가 아니면 기본 포털 주소(`DEFAULT_PORTAL_URL`)를 씁니다.

## 지갑 앱 안에서

OPUS 지갑 앱(`opus-app`)은 미니앱을 웹뷰로 엽니다. 이때 페이지는 앱 안에 있으므로 "포털로 돌아가기"는 링크가 아니라 **앱에 보내는 메시지**(`{"channel":"opus-nav","action":"portal"}`)가 되고, 앱이 자기 포털 화면을 보여 줍니다. 브라우저에서는 보통 링크로 동작합니다. 앱 쪽 처리는 opus-app에 있습니다.

## 키트를 보는 법 / 바꾸는 법

```bash
yarn install
yarn dev          # http://localhost:3300 , 키트의 모든 부분과 지갑·네트워크 상태 버튼이 있는 데모
yarn test         # 화면 없이 도는 규칙 + 서버 렌더 확인
yarn lint && yarn formatting:check && yarn build
```

-   문구(`core/messages.ts`)는 en/ko/ja/zh가 같은 키와 같은 `{슬롯}`을 가져야 합니다 (테스트가 검사).
-   휴대폰(360~390px)과 PC(1280px) 모두에서 데모를 확인합니다.
-   키트를 바꾸면 이를 쓰는 미니앱 전부에 영향이 가므로, 눈에 보이는 변화는 [docs/standard.md](docs/standard.md)와 함께 바꿉니다.

## 하지 않는 것

OPUS는 중립 프로토콜이고 포털은 서비스를 나열할 뿐입니다. 키트는 **모양과 규칙**만 줍니다. 어떤 서비스의 수익·정책·로직도 넣지 않습니다. 지갑 연결 방식, 로그인, 결제 흐름은 각 미니앱의 몫입니다.

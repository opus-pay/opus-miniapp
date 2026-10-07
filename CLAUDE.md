# OPUS 미니앱 키트 작업 안내 (Claude용)

README.md와 docs/standard.md를 먼저 읽으세요. 이 저장소는 포털(`opus-portal`)과 WayHand 등 미니앱이 함께 쓰는 **공통 UI 키트**입니다.

## 사용자와 소통

-   사용자는 한국인 1인 창업자입니다. **보고와 질문은 한국어로, 쉬운 말로** 합니다. 결정이 필요한 곳(정책, 되돌리기 어려운 일)에서만 멈추고 묻습니다.
-   GitHub 푸시와 PR은 사용자가 요청할 때만 합니다. 비밀값(`.env*`)은 읽거나 커밋하지 않습니다.

## 지켜야 할 것

-   **중립:** 특정 서비스(WayHand 등)의 수익·정책·로직을 넣지 않습니다. 모양과 규칙만 줍니다.
-   **키트는 지갑 라이브러리를 모릅니다.** wagmi 같은 것을 의존성에 넣지 않고 주소·체인·콜백만 받습니다.
-   **규격이 기준:** 눈에 보이는 변화는 `docs/standard.md`와 함께 바꿉니다. 이를 쓰는 미니앱 전부가 영향을 받습니다.
-   **4개 언어:** `core/messages.ts`의 en/ko/ja/zh는 같은 키와 같은 `{슬롯}` (테스트가 검사).
-   **주소는 체크섬 철자:** 어디서나 `displayAddress`/`shortAddress`를 씁니다.
-   **반응형:** 휴대폰(360~390px)과 PC(1280px)를 데모에서 확인합니다.
-   색을 직접 적지 않고 `tokens.css`의 토큰을 씁니다.
-   포털 주소는 https만 허용합니다(`resolvePortalUrl`). `javascript:` 같은 값으로 링크를 만들지 않습니다.

## 명령

```bash
yarn install
yarn dev                  # http://localhost:3300 (데모)
yarn test                 # mocha (규칙 + 서버 렌더)
yarn lint                 # 타입 검사
yarn formatting:check     # Prettier
yarn build                # 데모 빌드
```

커밋 전에 `yarn formatting:check && yarn lint && yarn test && yarn build`가 통과해야 합니다. 커밋 메시지는 영어, 명령형 제목과 "왜"를 설명하는 본문.

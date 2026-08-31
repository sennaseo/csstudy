# csStudy 개인정보처리방침

- **앱 이름**: csStudy
- **패키지명**: `io.github.sennaseo.csstudy`
- **시행일**: 2026년 8월 31일
- **문의**: senna077@gmail.com

---

## 한 줄 요약

csStudy는 **계정이 없습니다.** 회원가입도, 로그인도 없습니다. 학습 기록은 전부 사용자의 기기 안에만 저장되며, 개발자는 그 기록을 볼 수 없습니다.

---

## 1. 수집하지 않는 정보

csStudy는 아래 정보를 **수집하지 않습니다.** 앱에 이 정보를 요청하거나 전송하는 코드 자체가 없습니다.

- 이름, 이메일 주소, 전화번호, 생년월일 등 신원 정보
- 계정 정보 (앱에 로그인 기능이 없습니다)
- 위치 정보 (GPS·네트워크 위치 권한을 선언하지 않았습니다)
- 연락처, 통화기록, 문자메시지
- 사진, 동영상, 카메라, 마이크
- 기기의 다른 앱 목록, 설치된 앱 정보
- 광고 식별자(AAID), 기기 고유 식별자
- 결제·금융 정보 (앱 내 결제나 구독이 없습니다)

## 2. 앱이 사용자 기기에 저장하는 정보

아래 정보는 **사용자의 안드로이드 기기 내부에만** 저장됩니다. 앱을 삭제하면 함께 사라지며, 개발자를 포함한 어느 누구도 외부에서 접근할 수 없습니다.

### 2-1. 학습 데이터 (앱 내부 저장소, 키: `csStudy:v1`)

| 항목 | 내용 |
|---|---|
| 문제 풀이 기록 | 문제 ID, 자기평가(이해함/애매함/모름), 마지막 복습 시각, 복습 횟수 |
| 일별 학습량 | 날짜별로 그날 푼 문제 수 (예: `2026-08-31: 5`) — 스트릭 계산용 |
| 레슨 진행도 | 레슨별 맞힌 개수·총 문제 수·최초 완료 시각 |
| 캐릭터(버디) | 보유 캐릭터 ID, 누적 경험치, 획득 시각, 대표 캐릭터 |
| 게임 상태 | 남은 하트 수와 회복 기준 시각, 역대 최고 콤보, 일일 목표 보상 수령 날짜 |
| 화면 설정 | 선택한 카테고리·그룹·학습 트랙 |

여기에 사용자가 직접 입력한 자유 텍스트나 신원과 연결되는 값은 포함되지 않습니다. 저장되는 것은 앱이 만든 문제 ID, 숫자, 날짜뿐입니다.

### 2-2. 동기화 설정 (앱 내부 저장소, 키: `csStudy:syncConfig`)

아래 3번의 동기화 기능을 사용자가 직접 켠 경우에만, 사용자가 입력한 **서버 주소와 비밀 토큰**이 기기에 저장됩니다. 사용하지 않으면 이 값은 생성되지 않습니다.

### 2-3. 홈 화면 위젯

홈 화면에 위젯을 배치하면, 위젯이 지금 보여주는 **카드의 번호(정수)** 와 **카드가 뒤집혀 있는지 여부(참/거짓)** 두 값을 위젯별로 저장합니다. 개인정보가 아니며, 외부로 전송되지 않습니다. 위젯이 보여주는 CS 용어 카드 내용은 앱 설치 파일 안에 포함되어 있어 인터넷 없이 동작합니다.

## 3. 클라우드 동기화 (선택 기능 — 기본은 꺼져 있습니다)

csStudy에는 여러 기기에서 진행상황을 이어서 볼 수 있는 동기화 기능이 있습니다. 이 기능은 **다음 사항을 정확히 이해하고 사용하셔야 합니다.**

**개발자가 운영하는 공용 서버는 존재하지 않습니다.** csStudy에는 사용자의 데이터를 받는 개발자 서버가 없습니다.

동기화를 쓰려면 사용자 본인이 **자신의 AWS 계정에 직접 백엔드(AWS Lambda + DynamoDB)를 배포**한 뒤, 앱 안의 동기화 설정 화면에 **그 서버의 주소와 본인이 정한 비밀 토큰을 손으로 입력**해야 합니다. 즉 데이터가 가는 곳은 언제나 **사용자 본인이 소유하고 요금을 내는 사용자 본인의 서버**입니다.

- **기본 상태**: 꺼짐. 주소와 토큰이 입력되기 전까지 앱은 어떤 서버에도 접속하지 않습니다.
- **전송되는 데이터**: 위 2-1의 학습 데이터 전체(JSON 한 덩어리). 그 외 어떤 정보도 함께 보내지 않습니다.
- **전송 시점**: 앱 실행 시, 다른 앱에서 돌아왔을 때(최소 30초 간격), 그리고 문제를 푼 뒤 2초가 지났을 때.
- **끄는 방법**: 동기화 설정 창의 "동기화 끄기". 즉시 전송이 중단되고 기기에 저장된 주소·토큰이 삭제됩니다. (사용자 서버에 이미 저장된 데이터는 사용자가 본인의 AWS 콘솔에서 직접 삭제해야 합니다.)

개발자는 사용자의 서버 주소, 토큰, 그곳에 저장된 데이터에 **일절 접근할 수 없습니다.**

## 4. 외부 서비스로의 접속 (없음)

**csStudy는 제3자 서비스에 접속하지 않습니다.** 광고망, 분석 서버, 콘텐츠 전송 네트워크(CDN), 폰트 서버 어느 것도 사용하지 않습니다.

앱 화면에 쓰이는 글꼴 파일은 **앱 설치 파일 안에 포함되어 있습니다.** 예전 버전은 Google Fonts와 jsDelivr CDN에서 글꼴을 내려받았고, 그때는 요청이 나갈 때 사용자의 IP 주소가 해당 서비스에 전달됐습니다. 현재 버전은 글꼴을 앱에 내장하도록 바꾸어 **그 외부 요청을 완전히 제거했습니다.** 문제·카드 등 학습 콘텐츠도 마찬가지로 설치 파일 안에 들어 있습니다.

따라서 앱이 인터넷으로 내보내는 요청은 **3번의 클라우드 동기화 한 가지뿐이며**, 그 기능은 기본적으로 꺼져 있고 사용자가 직접 주소를 입력한 사용자 본인의 서버로만 향합니다. 동기화를 켜지 않으면 앱은 어떤 서버에도 접속하지 않으며, 비행기 모드에서도 모든 학습 기능이 정상 동작합니다.

(웹 버전 역시 동일합니다. 글꼴을 같은 주소에서 함께 배포하므로 외부 서비스로 나가는 요청이 없습니다.)

## 5. 사용하지 않는 것

csStudy에는 아래 기능이 **포함되어 있지 않습니다.**

- 광고 및 광고 SDK
- 분석·통계 도구 (Google Analytics, Firebase Analytics 등)
- 크래시 리포팅 (Crashlytics 등)
- 푸시 알림 서비스
- 앱 내 결제 및 구독
- 제3자 로그인(소셜 로그인)

## 6. 제3자 제공 및 판매

csStudy는 사용자의 정보를 **제3자에게 제공하거나 판매하지 않습니다.** 애초에 개발자가 사용자의 학습 데이터를 보유하고 있지 않으므로 제공할 데이터가 없습니다. 위 4번과 같이 제3자 서비스로 나가는 통신 자체가 없습니다.

법령에 따른 수사기관의 적법한 요청이 있더라도, 개발자가 보유한 사용자 데이터가 없으므로 제출할 수 있는 것이 없습니다.

## 7. 앱이 요청하는 권한

csStudy가 선언한 안드로이드 권한은 **한 개**입니다.

| 권한 | 이유 |
|---|---|
| `android.permission.INTERNET` | 3번의 클라우드 동기화를 사용자가 켰을 때, 사용자 본인의 서버와 통신하기 위해서만 필요합니다. 동기화를 쓰지 않으면 이 권한으로 나가는 통신이 없습니다. |

위치, 카메라, 마이크, 저장소, 연락처, 알림 등 다른 어떤 권한도 요청하지 않습니다.

## 8. 만 14세 미만 아동

csStudy는 개발자 학습을 위한 앱으로, 아동을 대상으로 만들어지지 않았습니다. 개발자는 사용자의 나이를 포함해 어떤 개인정보도 수집하지 않으므로, 아동으로부터 개인정보를 수집하는 일 또한 발생하지 않습니다. 아동이 이 앱을 사용하더라도 그 학습 기록은 아동의 기기 안에만 남습니다.

만 14세 미만 자녀의 데이터에 관해 문의사항이 있으시면 senna077@gmail.com 으로 연락해 주세요.

## 9. 데이터 보관 기간과 삭제 방법

기기에 저장된 데이터는 사용자가 삭제하기 전까지 보관됩니다. 개발자 측에는 보관되는 데이터가 없습니다.

**전부 삭제하려면 (택 1)**

1. **앱 삭제** — 안드로이드 설정 → 애플리케이션 → csStudy → 제거. 앱 내부 저장소가 함께 삭제됩니다.
2. **데이터만 삭제** — 안드로이드 설정 → 애플리케이션 → csStudy → 저장공간 → **데이터 삭제**. 앱은 남고 학습 기록만 초기화됩니다.
3. **위젯 삭제** — 홈 화면에서 위젯을 길게 눌러 제거하면 위젯이 저장한 값이 사라집니다.

**클라우드 동기화를 썼다면**, 위 방법으로는 사용자 본인의 AWS 서버에 있는 데이터가 지워지지 않습니다. 그 데이터는 사용자 소유이므로, 본인의 AWS 콘솔에서 DynamoDB 테이블(기본 이름 `csstudy`)의 항목을 삭제하거나 테이블 자체를 삭제하시면 됩니다.

## 10. 방침 변경

앱의 동작이 바뀌어 이 방침을 고쳐야 할 경우, 수정된 방침을 이 주소에 게시하고 상단의 시행일을 갱신합니다. 수집 항목이 늘어나는 등 중요한 변경이 있을 때는 앱 업데이트 설명에도 함께 알립니다.

## 11. 문의

개인정보 처리에 관한 질문, 요청, 신고는 아래로 연락해 주세요.

**senna077@gmail.com**

---
---

# Privacy Policy (English Summary)

- **App**: csStudy
- **Package**: `io.github.sennaseo.csstudy`
- **Effective date**: August 31, 2026
- **Contact**: senna077@gmail.com

## In short

csStudy has no accounts, no sign-up, and no login. All study data stays on your device. The developer operates no server that receives your data and cannot access your study records.

## What we do NOT collect

We do not collect names, email addresses, phone numbers, location, contacts, photos, camera or microphone input, installed-app lists, advertising identifiers, device identifiers, or payment information. The app contains no code that requests or transmits any of these.

## What is stored on your device

Stored locally in the app's own storage and never transmitted by default:

- **Study data** (key `csStudy:v1`): question IDs with your self-assessment (understood / fuzzy / unknown), last-review timestamps, review counts, per-date counts of questions answered, lesson progress, collected in-app characters and their XP, remaining hearts, best combo, and your selected category/track. No free-text or identity-linked values.
- **Sync settings** (key `csStudy:syncConfig`): only if you enable the optional sync described below — the server URL and secret token you typed in.
- **Home-screen widget**: the current card index (an integer) and whether the card is flipped (a boolean). Nothing else.

## Optional cloud sync — your server, not ours

**There is no developer-operated server.** To use sync, you must deploy your own backend (AWS Lambda + DynamoDB) to **your own AWS account**, then manually enter that server's URL and your own secret token in the app. Data therefore always goes to a server you own and pay for.

- Off by default. With no URL and token entered, the app contacts no server.
- What is sent: the study data listed above, as a single JSON object. Nothing else.
- When: on app launch, on returning to the app (at most once per 30 seconds), and 2 seconds after answering a question.
- Turning it off: "동기화 끄기" (Turn off sync) in the sync dialog. This stops transmission and deletes the stored URL and token from the device.

The developer cannot access your server, your token, or the data stored there.

## Third-party connections (none)

**csStudy contacts no third-party services** — no ad networks, no analytics servers, no CDNs, no font servers.

Display fonts are **bundled inside the app**. Earlier versions loaded them from Google Fonts and jsDelivr, which exposed your IP address to those services; the current version embeds the font files and that outbound request has been removed entirely. Study content (questions, cards) is likewise bundled in the install package.

The only request the app can make to the internet is the **optional cloud sync described above** — off by default, and directed solely at a server you deploy and enter yourself. With sync disabled the app contacts no server at all and works fully in airplane mode. (The web version is identical: fonts are served from the same origin as the app.)

## Not included

No ads, no ad SDKs, no analytics (Google Analytics, Firebase, etc.), no crash reporting, no push notifications, no in-app purchases, no social login.

## Third-party sharing

We do not share or sell your information. The developer holds no user data to share, and as noted above the app makes no connections to third-party services.

## Permissions

csStudy declares exactly one Android permission: `android.permission.INTERNET`, used solely for the optional sync with your own server. No location, camera, microphone, storage, contacts, or notification permissions are requested.

## Children under 14

csStudy is not directed at children. We collect no personal information from anyone, including age, so no children's personal information is collected. Questions: senna077@gmail.com.

## Data retention and deletion

Data remains on your device until you delete it; the developer retains nothing. To delete everything: uninstall the app, or go to Android Settings → Apps → csStudy → Storage → **Clear data**. Remove the home-screen widget to clear its stored values. If you enabled cloud sync, delete the data from your own AWS DynamoDB table (default name `csstudy`) — it lives in your account, not ours.

## Changes

Updates to this policy will be posted at this URL with a revised effective date, and significant changes will be noted in the app's update description.

## Contact

**senna077@gmail.com**

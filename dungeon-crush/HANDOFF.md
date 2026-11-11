# 던전크러시 새 채팅 인수인계

이 파일을 먼저 읽고 `dungeon-crush/`만 이어서 작업하세요. 사용자에게는 한국어 존댓말을 사용하세요.

## 프로젝트와 금지 범위

- GitHub: https://github.com/ohohhyun/CatHome
- 작업 브랜치: `codex/ashen-rift-apk`, PR #1. main에 병합하지 않습니다.
- 게임 소스는 `dungeon-crush/`, Android 패키지는 `com.dungeoncrush.game`입니다.
- 집사 사절 원본인 루트 `app/`, `legacy/`, 루트 Gradle/README/tests, Ground·BizRoot는 수정하지 않습니다.
- 원본 보호 트리: app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, tests `07eea64ee955f5580a13a9f237490d346ceefe7a`.
- main 기준 SHA: `3651e3d734e754a1a08f7bd62d031f40e4eef70c`.

## 현재 게임

6직업(카엘·린·베인·세라·아리아·프리스트 엘리안), 최대 100레벨, 12챕터·36던전, 던전별 몬스터/보스 외형, 60/80/100레벨 스킬 18종입니다. 100레벨 이후 전직은 아직 만들지 않습니다.
같은 Wi-Fi 협동과 30레벨부터 2~4인 개인전을 지원합니다. 개인전은 팀 없이 능력치·장비·기본 스킬을 보정하고 3라운드 중 2라운드 선승이며, 방장 연결 종료 시 취소합니다. 프로토콜은 8입니다.
스킬은 가로 6칸에 직접 장착·해제·교체합니다. 던전용과 개인전용 배치는 별도입니다. 기본 공격은 이 6칸과 별도이며 영구 고정입니다. 각종 확인창은 누른 버튼/아이템 앞에 뜹니다.

## 2.10.1 패치 범위

1. 원본 그림이 좌/우로 섞인 몬스터 72종을 확인하고 walk/attack 은행마다 `facing`을 지정했습니다. 월드 `e.dir`은 변경하지 않고 렌더러에서 방향을 보정합니다. 원화 SHA와 방향 검수는 `art-source/enemy-facing-review.json`입니다.
2. PvE 일반 적 이동 40%, 보스 이동 25%를 올리고 회복/재공격 간격과 접근/공격 거리를 조정했습니다. 초반 일반 적 배치를 가깝게 하고 원거리 보스 패턴도 멀리서 시작합니다. 공격 예고 시간은 유지하고 법사 위협은 플레이어당 최대 2개로 제한합니다. 사망 시 준비 중 공격·소유 투사체 취소와 PvP 보정은 유지합니다.
3. 빈 스킬 칸의 0을 기본 공격 0으로 혼동하던 경로를 분리했습니다. 새 스킬 학습은 기존 장착을 보존합니다. 기본 공격은 고정 무기 아이콘이며, 눌렀을 때 남아 있던 스킬 입력/버퍼를 지웁니다. 스킬 슬롯 기본 배치 복구는 습득 랭크/SP를 건드리지 않습니다.
4. 흰/회색 배경이 남았던 furnace-serpent, mushroom-shaman, dune-raider, comet-hound를 image_gen으로 투명 처리했습니다.
5. 금색 선택/비활성 버튼의 글자 대비를 보강하고, 장비 일괄 분해를 왼쪽 상단 고정 영역으로 옮겼습니다.
6. 달릴 때 기존 4직업의 색과 체형이 달라지던 문제를 수정했습니다. 다리는 새 팔레트의 8포즈를 사용하고 상체는 같은 캐릭터의 canonical reaction 은행을 사용합니다. `bodyScale`은 1로 통일합니다. 가이트/8포즈/기존 점프·대시·공격 모션은 유지합니다.

## 중요한 코드와 검증

- `app/src/main/assets/actors.js`: 모션 데이터·타일 캐시·몬스터 방향·고정 상체 합성.
- `engine.js`: 전투/AI/입력. `rpg.js`: 저장·장비·스킬 배치. `app.js`: HUD·멀티터치·LAN. `town.js`, `expansion.css`: NPC 메뉴·확인창·가독성.
- 새 이미지: `art/motion211/`, 원본/압축 정보 `art-source/motion211-sources.json`. 8개 대체 자산은 Gradle에서 예전 파일을 제외합니다. manifest 268개 중 APK에는 228개를 포함합니다.
- `tests/hotfix.test.cjs`: 72종 방향·기본 공격/빈칸/복구·AI 속도·초반 전투.
- `tests/hotfix-presentation.test.cjs`: 실제 이미지 디코딩/alpha·방향·idle/run 상체 픽셀·터치 입력·글자/버튼·일괄 분해 위치.
- 기존 JavaScript 15개·Java TCP 4인·Chrome 17개에 새 검사 2개를 더해 총 35개를 실행합니다. 빌드/배포 정보는 아래 완료 기록과 릴리스를 확인하세요.

## 작업 환경 팁

- 로컬 체크아웃에 `.git`이 없을 수 있습니다. GitHub blob/tree/commit/ref 도구로 지정 브랜치만 갱신해 왔습니다.
- 브라우저 실행은 기본 샌드박스에서 Crashpad socket 권한 오류가 날 수 있습니다. 파일 URL은 관리 Chrome 정책에 막힐 수 있으므로 로컬 HTTP를 쓰거나 GitHub Actions Chrome 검사를 이용합니다.
- 사용자가 반복 권한 확인에 불편을 호소했습니다. 이미 허용된 범위와 연결 앱을 재사용하고, 꼭 필요한 요청은 한 번에 묶으세요.
- 큰 Actions APK 다운로드는 환경에서 Azure redirect가 차단될 수 있습니다. APK manifest와 20MiB 조각 artifact를 GitHub 도구로 받아 SHA/CRC 검증 후 재조립합니다.
- APK 서명 SHA256은 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`을 유지합니다. 기존 앱을 삭제하지 않고 업데이트합니다.
- 새 APK는 기존 서명을 유지하는 GitHub Actions 빌드를 사용하세요. 별도 로컬 debug keystore로 서명을 바꾸면 업데이트 설치가 깨집니다. 빌드 명령과 전체 검사 순서는 `.github/workflows/build-dungeon-crush.yml`에 있습니다.
- 배포는 전용 `.github/workflows/publish-dungeon-crush.yml`에서 검증 빌드와 APK 크기/SHA를 고정하고, ZIP_STORED 공유 ZIP을 만듭니다. 압축 해제 후 APK 해시를 확인하고 공개 assets의 크기/SHA도 비교하세요.
- 실제 휴대폰/공유기의 프레임률·조작감은 이 환경에서 검증하지 못했습니다. 사용자의 특정 저장 데이터에서 스킬이 사라졌던 정확한 절차는 재현되지 않았으므로, 재발하면 직업·스킬명·업데이트 버전과 저장 배치를 먼저 확인하세요.

## 완료 기록

- 버전: **2.10.1-facing-tempo**, versionCode **31**, 프로토콜 **8**.
- 검증 소스: `5501e808bc9a02f3b8b709a09891c348df6f7631`.
- 자동 검증 빌드: https://github.com/ohohhyun/CatHome/actions/runs/42441280165 (35개 시나리오 통과).
- 배포: https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.10.1
- APK: `DungeonCrush-2.10.1.apk`, 238,992,846 bytes.
- APK SHA256: `a4e4bb85eeb904f25323a973cdbc516a7489cf9635e7f4f388af569c0cdddff7`.
- 공유 ZIP: `DungeonCrush-2.10.1-Share.zip` (APK·설치 안내·이 인수인계 문서 포함).
- APK 서명/패키지·압축 CRC·최종 원화 228개·스크립트·한글 글꼴 검사 완료. 원본 집사 사절 파일은 변경하지 않았습니다.

새 채팅에서는 이 문서와 릴리스부터 읽고 작업 브랜치 최신 HEAD를 확인하세요. 로컬 도구 상태에 의존하지 말고 GitHub의 소스를 기준으로 이어가세요.

## 프리스트 그래픽 후속 수정 (2026-11-08)

- versionCode 32, versionName `2.10.1-priest-hotfix`; 프로토콜 8과 저장 형식 유지.
- 프리스트 run 은행은 `fullBody: true`로 상하체 분할 합성을 우회합니다. 4x4 모션 시트의 첫 8개 셀 전체를 사용하며 원래 피벗·스케일·보행 주기를 유지합니다. 다른 직업의 고정 상체 합성은 유지합니다.
- 프리스트 기본/성장/궁극기 3개 VFX 시트의 흰색·베이지 배경을 image_gen으로 제거했습니다. 프레임 크기/배치와 손실 없는 alpha를 유지하고 두 원화 manifest를 갱신했습니다. 출처: `art-source/priest-presentation-fix.json`.
- `tests/priest-presentation.cjs`는 기존 hotfix Chrome 검사에서 실행됩니다. 양방향 8프레임을 전신 원본과 비교하고, 3개 스킬 시트의 실제 alpha와 어두운 배경 합성을 검사합니다.
- 집사 사절 원본과 루트 워크플로는 수정하지 않습니다. APK는 기존 서명 보존 Actions에서 빌드하며 artifact 파일명은 기존 `DungeonCrush-2.10.1.apk`를 사용합니다.

### 프리스트 수정판 검증 완료

- 검증 소스: `382ffdde539bbb7961f5d5e7df8732fcfd48a06b`.
- 빌드: https://github.com/ohohhyun/CatHome/actions/runs/42447699140 (JavaScript 16개·Java TCP 4인·Chrome 18개, 총 35개 검사와 신규 프리스트 픽셀/alpha 검사 통과).
- 설치 파일 ZIP: https://github.com/ohohhyun/CatHome/actions/runs/42447699140/artifacts/13603829434
- APK: `DungeonCrush-2.10.1.apk`, 238,741,207 bytes, versionCode 32.
- APK SHA256: `374d349c122eb9cd74e56fffb3c5dc35fbaa2526ead220471b274aef0db99b2c`. 기존 서명 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 검증 통과.
- `tools/verify-apk-identity.py`의 기대 설치 버전도 32로 갱신했습니다.
- ZIP을 풀고 APK를 기존 앱에 업데이트 설치합니다. 앱을 삭제하지 않습니다. 수정판은 위 Actions artifact이며 기존 공개 2.10.1 릴리스 APK는 versionCode 31입니다.
- 집사 사절 보호 트리(app/legacy/tests)와 루트 파일은 변경하지 않았습니다. 실제 휴대폰에서의 체감 확인은 별도입니다.

## 6직업 전체 모션 검수 (versionCode 33)

- versionName `2.10.1-motion-audit`, 프로토콜 8·저장 형식·설치 서명 유지. APK 기대 버전 검사도 33으로 갱신합니다.
- 카엘·린·베인·세라의 이동 원화를 각각 canonical reaction 체형 기준으로 새로 제작했습니다. 세라는 굵어진 허벅지/달리기 체형 대신 기본 체형의 짧은 보폭 걷기/조깅을 사용합니다.
- 6직업 모두 허리에서 자르는 상하체 합성을 제거하고 전신 단일 프레임을 표시합니다. 이동·점프·대시는 전체 원화 셀을 보존하고, 나머지 포즈도 경계 여유와 기존 월드 피벗을 보존했습니다. 744개 포즈 검수 내역과 새 원화 SHA는 `art-source/all-hero-motion-review.json`입니다.
- 공격 타임라인에서 `poseHold`로 중간 프레임으로 되돌아가던 렌더링을 제거했습니다. 타격 판정·대미지·입력 시간은 유지하며 원화 프레임 사이를 가중 합성합니다. 로컬 화면도 물리 스텝 사이의 시간을 보간합니다.
- 전투 참가 직업의 1/2/3타와 시전 이미지를 모두 미리 로딩·고정하고 준비가 끝나야 전투 조작을 엽니다. 전투 타일은 256px 기준으로 제한하고 캐시 한도는 160MiB입니다.
- 기존의 '상체 픽셀을 강제로 고정'하던 검사는 전신 셀 대조 검사로 교체했습니다. `tests/all-hero-motion.cjs`가 744개 실제 렌더링을 비교하고, `tests/all-hero-combat.cjs`는 작은 터치 화면에서 6직업 실제 3연타·스킬과 도중 로딩/누락/되감김을 검사합니다. 두 검사는 기존 hotfix Chrome 시나리오에 포함됩니다.
- 집사 사절 원본·루트 파일은 수정하지 않습니다.

### 6직업 모션 수정판 검증 완료

- 검증 소스: `ba7434c06747cb3d90dcf617dc8b9c927bcd2613`.
- 검증 빌드: https://github.com/ohohhyun/CatHome/actions/runs/42460800665 (기존 35개 검사와 744개 전신 포즈 대조·6직업 실제 첫 3연타/시전·18개 공격 타임라인 검사 통과).
- 수정 APK ZIP: https://github.com/ohohhyun/CatHome/actions/runs/42460800665/artifacts/13609808268
- APK: `DungeonCrush-2.10.1.apk`, 237,657,135 bytes, versionCode **33**, versionName `2.10.1-motion-audit`.
- APK SHA256: `222ea3c54e8b1a6fa3f917d9da97d81c4fd88f00b21b35b4396ecae324f2c605`. 기존 설치 서명 검증 통과.
- 집사 사절 보호 트리·루트 파일 미변경. 앱을 삭제하지 않고 위 수정 APK를 업데이트 설치합니다. 실제 휴대폰의 프레임률/체감은 별도 확인 대상입니다.

## 고정 ZIP 다운로드 (채팅 임시 링크 대체)

- 공개 다운로드 페이지: https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.10.1-motion-audit
- 파일: `DungeonCrush-MotionFix-33.zip` (APK·설치 안내·인수인계 포함).
- 전용 배포 작업: https://github.com/ohohhyun/CatHome/actions/runs/42465613789 (완료). 검증 빌드 42460800665의 APK를 재빌드 없이 그대로 사용하고 SHA/크기/ZIP CRC와 공개 asset digest를 확인했습니다.
- 공개 ZIP SHA256: `03484af930d4aaa30d3fd45bac544d06f58e4991e9d0ea4d9303edef5f629cae`, 237,669,677 bytes.
- 채팅의 임시 OAI 링크와 로그인 필요한 Actions artifact 대신 위 공개 릴리스 페이지의 Assets에서 ZIP을 받습니다.

## 체크 일괄 판매 및 장착 장비 보호 (versionCode 34)

- versionName `2.10.1-safe-sale`, 설치 기대 버전 검사 34. 기존 저장 형식·프로토콜·설치 서명 유지.
- 상인 판매 화면에 판매 체크박스, 현재 페이지 선택/선택 해제, 선택 개수·총액, 체크한 장비 일괄 판매 확인창을 추가했습니다. 기본 선택은 0개이며 화면/직업을 다시 열면 선택을 초기화합니다. 페이지 이동 중 선택은 유지합니다.
- 장착·잠금 장비를 숨기는 대신 별도의 판매 불가 목록에 표시합니다. `장착 중 · 판매 불가` 배지와 비활성 체크박스를 사용하며 판매 화면에서 장비를 해제하지 않습니다.
- `RiftRPG.salePreview`/`sellGears`가 선택 ID를 재검증합니다. 장착·잠금·삭제된 장비가 하나라도 있으면 전체 판매를 거부하며 골드/아이템은 전혀 바꾸지 않습니다. 중복 ID는 1개로 계산합니다. 개별 판매도 동일한 보호 경로를 사용합니다.
- 확인창은 선택 장비 목록과 총액을 표시하고 명시적 확정 후에만 저장합니다. 확인창을 연 뒤 장착/잠금 상태가 바뀌는 경우도 재검증합니다.
- `tests/bulk-sale.cjs`는 기존 장비 서비스 테스트에서, `tests/bulk-sale-ui.cjs`는 기존 마을 서비스 Chrome 검사에서 실행됩니다. 체크/취소 무변경·확정 중 상태 변경·현재 장비 보호·정확한 판매 금액·중복/오래된 ID·작은 화면·재시작 저장을 검사합니다.
- 이미 판매된 과거 장비의 원본 기록은 저장되어 있지 않으므로 이 패치는 과거 판매 장비를 추정 복원하지 않습니다.

### 체크 판매 수정판 검증·배포 완료

- 검증 소스: `b68d1185048a64b3c417bd85293cdba1ce824c5a`. 빌드: https://github.com/ohohhyun/CatHome/actions/runs/42467263908 (기존 35개 검사와 신규 6직업 원자적 판매/실제 체크·취소·확정/확인 도중 장착 변경/작은 화면 버튼 노출/재시작 검사 통과).
- 공개 다운로드: https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.10.1-safe-sale
- ZIP: `DungeonCrush-SafeSale-34.zip`. 배포 작업: https://github.com/ohohhyun/CatHome/actions/runs/42468199947 (성공).
- APK: 237,659,167 bytes, SHA256 `d8478806635a922de54f3078a1d3dc56577d1cb6e4fa4fc83d2cdde42eb0e556`, versionCode **34**. 기존 설치 서명 검증 통과. 앱을 삭제하지 않고 업데이트 설치합니다.
- 집사 사절 보호 트리는 변경하지 않았습니다.


## 2.10.2 출시 후보 보완

- 집사 사절 보호 범위를 유지하고 `dungeon-crush/`와 전용 빌드/배포 workflow만 수정합니다.
- `progress.js`를 `app.js` 전에 로드합니다. 저장소 4개 복제본(브라우저/Android 현재+이전 정상)에서 최신 revision을 고르고, 전부 손상되면 덮어쓰기를 막습니다. `transaction` 실패/예외/저장 실패는 JSON 원본으로 복구하며 캐릭터 선택/목적지 변경도 저장 실패 시 되돌립니다.
- `release.js`는 설정의 백업 파일 내보내기·검사·6직업 요약·확정 복원을 담당합니다. Android Bridge는 SAF를 사용합니다. 파일 최대 2MB. 백업은 암호화되지 않으며 체크섬은 우발적 손상 확인용입니다.
- `RiftRPG.lastSale`은 마지막 판매 1회만 보관합니다. `buybackPreview`/`undoSale`은 동일 직업·골드·가방 여유·ID 충돌을 확인하고 원래 아이템을 되돌립니다. 이전 버전의 판매를 소급 복원하지 않습니다.
- 로딩 실패 재시도와 마을 복귀를 제공합니다. `cancelLoading`은 실제 전투 시간 0인 심연만 입장료를 반환합니다. 반환 저장 실패 시 복귀하지 않고 재시도할 수 있습니다.
- versionCode 35 / versionName 2.10.2, compile/target API 36, AGP 8.10.1 / Gradle 8.11.1. 기존 APK 테스트 서명은 유지합니다. API 33+ 뒤로가기 콜백과 시스템 영역 여백을 적용합니다.
- 신규 검사: `tests/release.test.cjs`, `tests/release-presentation.test.cjs`. 정확한 rollback, 복제본/손상/용량 문제, 실제 다운로드 파일, 복원 취소/확정, 최근 판매 되돌리기, 3개 화면 크기, 리소스 실패 후 재시도, 심연 입장료 반환을 검증합니다.
- CI는 기존 모든 검사 + 새 검사 + release AAB + lintRelease를 실행합니다. `DungeonCrush-Unsigned-Store-AAB`는 서명 전 번들이며 업로드할 수 없습니다. 실제 운영 키/Play Console과 물리 단말 검증은 `release/RELEASE-CHECKLIST.md`에 기록했습니다. 개인정보 안내와 스토어 설명 초안도 같은 폴더에 있습니다.
- 아래 검증 기록에 명시된 성공 빌드만 배포해야 합니다. 실행 중 검사나 실제 단말 성능을 완료로 표현하지 않습니다.

- Android `SharedPreferences.commit()` 실패가 메모리에도 새 값을 남기는 점을 처리합니다. 실패 시 현재/백업 값을 기존 값으로 되돌리고, 손상된 필드를 정상 백업으로 순환시키지 않도록 숫자·캐릭터 구조를 확인합니다.

- Android lint가 기존 LAN의 `Map.remove(key,value)` API 24 요구를 발견했습니다. 원래 구현인 ConcurrentHashMap의 타입을 API 1부터 지원하는 `ConcurrentMap`으로 선언해 원자적 조건부 제거를 유지하면서 Android 6(API 23) 호환성을 복구했습니다. CI는 Android 컴파일/정적 검사를 UI 검사보다 먼저 실행하여 호환성 오류를 먼저 검출합니다.

- 저장 파일의 장비 배열 구조와 ID도 검사합니다. 배열에 null 항목 등이 있으면 정상 백업으로 순환시키지 않으며, 변환에 실패하는 복제본은 건너뛰어 다음 정상 기록을 찾습니다. 모든 복제본이 손상된 경우 원본을 덮어쓰지 않습니다. 해당 실패 형태를 회귀 검사에 포함했습니다.


## 2.10.2 RC1 검증 완료 · 공개 다운로드

- 실제 검증한 소스는 `f685dbbf27308ac08c59d0c5aadca017635b7c8b`입니다. 뒤의 배포/문서 커밋은 앱 구현을 변경하지 않습니다.
- 빌드: https://github.com/ohohhyun/CatHome/actions/runs/42957696478 (**성공**). JavaScript 17개, 실제 TCP LAN 1개, Chrome 19개 = 37개 검사와 Android lintRelease, APK 및 release 모드 AAB 빌드가 통과했습니다.
- APK: `DungeonCrush-2.10.2.apk`, 237,670,859 bytes. SHA256 `243e8dc58ebb77f9eaa9a4b879cc23a3e4ce45f27a99ca69d1bb34574fad8315`.
- 패키지 `com.dungeoncrush.game`, versionCode **35**, versionName **2.10.2**, targetSdk **36**. 기존 APK 서명 SHA256 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 검증 통과.
- 공개 페이지: https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.10.2-rc1 — Assets에서 `DungeonCrush-2.10.2-RC1.zip`을 선택합니다. 익명 HTTP 200과 파일 링크를 확인했습니다. 사용자에게 임시 signed URL을 주지 않습니다.
- ZIP: 237,699,602 bytes. SHA256 `099b2de94efcfc73d023adaa308a6347283648812a47b31ec420596da565287e`. APK/설치 안내/인수인계/출시 점검표/개인정보 안내/스토어 설명 초안을 포함합니다.
- 성공 배포: https://github.com/ohohhyun/CatHome/actions/runs/42959541040. ZIP을 다시 열어 APK 해시를 검사하고 GitHub 공개 asset의 크기·SHA256이 같은지 확인했습니다.
- CI의 `DungeonCrush-Unsigned-Store-AAB`는 서명 전 release 번들입니다. 그대로 스토어에 업로드하지 않습니다. 운영 업로드 키, 지원 이메일/개인정보 안내 공개 URL, 실제 휴대폰 검수 및 Play Console 등록이 남아 있습니다. `release/RELEASE-CHECKLIST.md`를 참조하세요.
- 첫 정적 검사에서 발견한 Android 6의 Map.remove API 호환성 오류는 ConcurrentMap으로 수정했습니다. 오류를 숨기거나 최소 지원 버전을 올리지 않았습니다.
- 배포 자동화: 검증 소스에 workflow 변경이 포함되면 GITHUB_TOKEN의 릴리스 공개 전환이 403이 될 수 있습니다. owner 권한으로 검증 SHA의 태그와 draft를 먼저 만들고, Actions는 이미 정해진 target을 다시 쓰지 않은 채 upload/publish합니다. 현재 태그는 위 검증 소스를 가리킵니다.
- 집사 사절 보호 트리 유지: app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, 원본 tests `07eea64ee955f5580a13a9f237490d346ceefe7a`.


## 2.10.3 추가 편의 개선 (versionCode 36)

- 이펙트 간소화: `DungeonSound`의 `reducedEffects` 설정을 기기에 저장합니다. 기본은 꺼짐. `DungeonEffects`는 장식 입자를 48개로 제한하고 발광/먼지/각성 컷인/섬광을 줄입니다. `DungeonArt.cell`의 추가 bloom과 장식 accent도 줄입니다. 원화·전신 모션·공격 판정·공격 경고는 유지합니다.
- pause 메뉴에 게임 설정 버튼을 추가합니다. 솔로/방장은 일시정지하고, 개인전/진행 중인 클라이언트는 전투가 계속됨을 안내하고 캐릭터 입력을 비웁니다. 원격 방장이 멈춘 경우의 문구도 분리합니다. 설정을 닫으면 pause 화면으로 돌아갑니다. 개인전 Back이 메뉴를 다시 열던 오류를 고쳤습니다.
- 원정 나가기 확인 후 같은 runId가 여전히 진행 중일 때만 나갑니다. 방장/개인전 이탈 안내를 구분합니다. 상태 알림은 입력을 가로채지 않습니다.
- 완료 정산이 저장 실패하면 `pendingSettlement`에 원정 입력·직업·추첨 seed·기준 날짜를 보관합니다. 동일 seed/date로 재시도하고 원자적 transaction/원정 ledger로 중복 지급을 막습니다. 저장 전 마을/다음 원정 이동을 막으며, 클라이언트가 새 원정을 수신해도 저장에 실패하면 방을 나가 결과를 보존합니다. PvE 성공 시 기존 build 동기화를 유지합니다.
- 보상 재시도는 결과 화면을 유지하는 동안 가능합니다. 저장 공간이 없어 정산이 실패한 뒤 OS가 앱을 강제 종료한 경우까지 보상을 영구 보존하는 기능은 아닙니다. UI에서 화면을 유지하도록 안내합니다.
- `tests/polish-presentation.cjs`를 기존 release Chrome 검사에서 실행합니다. 실제 설정 체크/저장·중립 입력·경고 픽셀 동일성·효과 예산·나가기 취소/확정·여러 차례 저장 실패 후 같은 보상 1회 지급·재실행·개인전 메뉴 Back과 전적 재시도를 검사합니다.
- versionName 2.10.3, versionCode 36. API 36·기존 설치 서명·프로토콜 8·저장 형식은 유지합니다. 집사 사절 app/legacy/tests를 변경하지 않습니다.


### 2.10.3 검증·공개 배포 완료

- 검증 소스: `5ee46c9c4963ea9161b1ac1643e80546e356cfb6`. 후속 배포·문서 커밋은 앱 코드를 바꾸지 않습니다.
- 성공 빌드: https://github.com/ohohhyun/CatHome/actions/runs/42973385498 — 37개 검사(17 JavaScript, 실제 TCP LAN 1, Chrome 19)와 신규 polish 검사, Android lintRelease, APK/AAB 빌드, 기존 서명 및 최종 리소스 일치 확인 통과.
- 신규 실제 브라우저 검증: 설정 체크/저장·일시정지/입력 초기화/재개, 원정 나가기 취소/확정, 간소화 시 입자 48개 이하/추가 발광 제거/공격 경고 픽셀 동일, 저장 실패 반복 후 동일 보상·골드·경험치 1회 지급, 재실행 유지, 개인전 메뉴 Back·설정 중 경기 종료·전적 저장 재시도.
- APK: `DungeonCrush-2.10.3.apk`, 237,672,394 bytes, SHA256 `92426eb61c2d38f182b5334631b31124373fdcabc4adce59d069549a6daee702`. versionCode **36**, versionName **2.10.3**, targetSdk **36**. 기존 `com.dungeoncrush.game` 및 서명 유지.
- 공개 다운로드: https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.10.3-rc1 — Assets → `DungeonCrush-2.10.3-RC1.zip`. 익명 페이지 HTTP 200과 파일 링크 확인.
- ZIP: 237,707,325 bytes, SHA256 `d32332e90cf6996f5644d0c72e384ad60cf15f2893f6deacd1c0161ab7a347a0`. APK·설치 안내·인수인계·출시 점검표·개인정보 안내·스토어 설명 초안 포함.
- 성공 배포 및 ZIP 검증: https://github.com/ohohhyun/CatHome/actions/runs/42975875688. owner 권한으로 검증 SHA의 태그/draft를 먼저 만들고 Actions에서 업로드/공개했습니다.
- 보상 재시도는 결과 화면을 유지하는 동안의 기능입니다. 저장 공간이 없는 상태에서 앱이 강제 종료된 미저장 결과까지 복원하지는 않습니다. 실기기 FPS/발열, Android 파일 선택기, 운영 서명·Play Console 등록은 별도입니다.
- 집사 사절 app/legacy/tests 보호 트리 변경 없음. 아래 해시는 이전 기록과 같습니다.


## 2.11.0 랭킹 메뉴와 UI 개선 (versionCode 37)

- 최신 사용자 지시: 전체 이용자 온라인 랭킹을 원하지만 **‘서버는아직임기능만만들어메뉴랑’**이라고 범위를 조정했습니다. 이번 버전은 서버·DB를 생성/변경하지 않고 기능/화면만 준비합니다. 추후 연결 지시 전까지 서버를 만들지 않습니다.
- `rankings.js`는 읽기 전용 기록 모델입니다. 6캐릭터의 현재 전투력, 누적 경험치, 최고 균열(싱글/파티 포함), 정복 횟수, 개인전 승수/승률을 집계합니다. 동점은 공동 순위(1,1,3), 같은 순위의 표시 순서는 직업 ID로 고정합니다. 기록 보기를 위해 save/revision/장비/골드/성장을 수정하지 않습니다.
- `ranking-ui.js`는 독립 modal입니다. 메인·마을·선택 화면의 랭킹 버튼, 전체 랭킹/내 기록, 종목/직업 필터, 프로필, 요약, 새로고침, Back/Escape/Tab 조작을 제공합니다. 열려 있는 동안 마을 이동을 중지하고 원정 시작 시 닫습니다.
- 전체 랭킹 기본 provider는 null입니다. ‘서버 연결 전’으로 안내하며 가짜 전역 순위·샘플 이용자를 앱에 넣지 않습니다. `DungeonRankingUI.setProvider({load(query)})`가 추후 읽기 어댑터의 연결점입니다. 응답 유효성/텍스트 표시/10초 시간 제한/로딩·빈 결과·오류/오래된 응답·닫힌 창 응답 무시를 준비했습니다. 실제 인증/제출/서버 검증/시즌/운영 기능은 포함하지 않습니다.
- `refinement.css`로 메인 보조 메뉴, 헤더 행동, 캐릭터/콘텐츠/던전 카드, 선택선, 메뉴 프레임·포커스와 명예의 전당 화면을 정리했습니다. 다른 게임의 이미지/로고를 복사하지 않았습니다. 참고 자료는 `release/UI-REFERENCES.md`입니다.
- 새 검사 `tests/rankings.test.cjs`, `tests/rankings-presentation.test.cjs`. 전체 workflow는 JS 19, 네이티브 2, Chrome 20 = **41개**입니다. 기존 8개 화면/확대 글자 감사도 실행합니다.
- versionName 2.11.0 / versionCode 37. API 36, 기존 앱 서명, 프로토콜 8, 저장 형식 유지. 집사 사절 app/legacy/tests를 변경하지 않습니다.
- 새 파일 `rankings.js`, `ranking-ui.js`, `refinement.css`도 APK 포함 바이트 검사에 추가했습니다. 이전 네트워크·모션·판매 보호·저장 재시도 기능을 유지합니다.


- 후속 사용자 재확인: **‘연결해 하면 연결되게만 만들어놓으라고’**. 지금 서버 생성·연결은 금지하고 나중에 연결을 켤 수 있는 구조만 준비합니다.
- `ranking-config.js`가 단일 연결 설정입니다. JSON 호환 객체이며 enabled=false, endpoint/publicKey 빈 값으로 배포합니다. `ranking-client.js`는 설정을 켰을 때만 HTTPS GET, 종목/직업/조회 수, 공개 키/런타임 세션 토큰, 응답 크기·형식·상태·취소를 처리합니다.
- 일반 브라우저는 fetch, Android는 `RankingHttpClient`/Bridge의 읽기 전용 HTTPS 전송을 준비했습니다. Android도 같은 설정을 읽어 활성화된 호스트/포트/경로와 허용 쿼리만 조회합니다. 기본 설정에서는 네이티브 클라이언트도 생성하지 않습니다. 범용 파일 접근이나 저장소 출처 변경은 하지 않습니다.
- 네이티브 요청은 별도 실행기, 최대 8개 활성/대기 작업, 5초 연결/읽기 시간 제한, 리다이렉트 금지, 256KiB 응답 제한을 둡니다. 결과는 JSON으로 인코딩하고 취소/종료 시 연결을 닫습니다. 장기 토큰/운영 비밀 키는 앱 설정에 넣지 않습니다.
- 새 연결 검사 `tests/ranking-client.test.cjs`, `tests/RankingHttpClientTest.java`와 실제 화면의 설정 켜기/끄기-요청 규격 시험을 추가했습니다. 모든 원격 응답은 테스트 안에서만 대체하며 실제 서버 호출은 하지 않습니다. 성공 빌드 전에는 검증 완료로 표시하지 않습니다.

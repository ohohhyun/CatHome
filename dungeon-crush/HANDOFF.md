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
- 배포는 전용 `.github/workflows/publish-dungeon-crush.yml`에서 검증 빌드와 APK 크기/SHA를 고정하고, ZIP_STORED 공유 ZIP을 만듭니다. 압축 해제 후 APK 해시를 확인하고 공개 assets의 크기/SHA도 비교하세요.
- 실제 휴대폰/공유기의 프레임률·조작감은 이 환경에서 검증하지 못했습니다. 사용자의 특정 저장 데이터에서 스킬이 사라졌던 정확한 절차는 재현되지 않았으므로, 재발하면 직업·스킬명·업데이트 버전과 저장 배치를 먼저 확인하세요.

## 완료 기록

BUILD_AND_RELEASE_RECORD_PENDING

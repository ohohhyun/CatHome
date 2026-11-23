## 최신 공개 버전: 2.20.4 RC1 · 장비 그림·강화·가방 비교

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.4-rc1/DungeonCrush-2.20.4.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.4-rc1/DungeonCrush-2.20.4-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.20.4-rc1). 로그인 없이 내려받습니다. 카톡에는 주소를 공유하고 기존 앱을 삭제하지 않은 채 업데이트 설치합니다.
- 장비36개·재화6개를 각각의 그림 영역으로 분리해 옆 아이템 조각이 섞이는 문제를 수정했습니다. 아리아·엘리안 장비12개도 다른4직업과 같은 무테·투명 배경으로 통일했습니다. 기존 스킬 그림과4직업의 장비 원본은 유지하고 새 PNG·무손실 WebP·알파 검수를 기록합니다. 무기·물약·착용·가방·상세·제작·판매·강화에 공통 적용합니다.
- 강화는 대상 목록,현재→다음 능력치·증가량,보유/필요 골드·철편,100% 성공 안내,최종 확인으로 정리했습니다. 작은 화면은 내용만 스크롤하고 실행 버튼을 유지합니다. 기존 비용·효과·최대+15·저장 규칙은 유지합니다.
- 가방 미착용 장비는 **하나라도 옵션이 오르면 녹색↑**, 상승 옵션이 없으면 빨간색↓입니다. 같은 수치도 상승 없음이며 착용 중에는 화살표를 붙이지 않습니다. 레벨 제한과 상세 비교의 개별/세트 손실 안내는 유지합니다.
- [원인·공식 게임 참고·비교 화면](EQUIPMENT-UPGRADE-NOTES.md) · [상세 검수](EQUIPMENT-UPGRADE-VERIFICATION.json).42개 아이콘×두 화면 비율84개 실제 렌더를 독립 원본 추출과 비교하고,576개 강화 예측과6개 일반/확대 안전영역 화면·취소/중복/상태 변경/저장 실패/재료 부족/최대/빈 가방을 검사했습니다.
- 검증 소스 `c33902aceec4385eef28ffdff69062616b131135`. [최종 전체 **71개 검사(코드34 + Java2 + Chrome35)**와 APK/AAB·Android lint·기존 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/45144912234). 이 최종 빌드의 검사 실패0건입니다. 기존 전수 이동·장비 비교·보스 효과·터치/4인·닉네임/변경권·성장/랭킹/저장 회귀를 포함합니다.
- APK **514,337,684 bytes**, SHA-256 `85f017acf5a4568afb854623a6f28a40074848f0a202772e4030d38278a4b499`. ZIP **514,339,302 bytes**, SHA-256 `93b13c1672b8bc5250631bff76aee7963c0f175238b67bc72cc397a7a11a5751`. [공개 게시·익명 전체 다운로드 검증](https://github.com/ohohhyun/CatHome/actions/runs/45149719690): 크기·해시·ZIP CRC·내부 APK 일치. 별도 익명 HEAD도 두 파일 HTTP200입니다. [배포 기록](2.20.4-VERIFICATION.json).
- versionName2.20.4 / versionCode53 / 저장2 / Wi-Fi12 / 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 유지. 기존 이름·ID·계급·성장·장비·XP·외형·보상 기록을 보존합니다. 닉네임 최초 무료 저장/이후 변경권1개·3,900원/결제 전 구매 불가,4모드·공유 AI PK·기존5종 랭킹·매주 보상/2주 초기화·걷기 없는 미리보기·자동 저장을 유지합니다. 기존 양발 이동·메뉴12칸·오른쪽 아래 접기/펼치기·왼쪽 위 정보만·타이틀 상점 제거도 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수:** Android52→53 업데이트/저장·변경권 보존, 실제 손가락 조작감과 보행 체감, 시스템 글자/키보드/터치 스크롤, 물리 Wi-Fi2~4대, 장시간 FPS/발열/음량. 자동 검사 통과를 모든 환경의 무결함 보장이나 실기기 완료로 표현하지 않습니다.
- 집사 사절 원본 보호: app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 게시/문서 커밋은 검증 앱 소스를 바꾸지 않습니다.

## 이전 공개 버전: 2.20.3 RC1 · 전 캐릭터 양발 이동·전체 메뉴 칸 수정

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.3-rc1/DungeonCrush-2.20.3.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.3-rc1/DungeonCrush-2.20.3-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.20.3-rc1). 로그인 없이 내려받습니다. 카톡에는 주소를 공유하고 기존 앱을 삭제하지 않은 채 업데이트 설치합니다.
- 기본6종·외형30종의 이동을 새 전신8포즈로 교체했습니다. 양발의 교대가 읽히도록 가까운 다리/먼 다리를 구분하고, 느린 이동은 접지, 달리기는 공중 포즈를 유지합니다. 일반 이동의 발을 가리던 먼지·속도 선·문양을 제거했습니다. 물리 이동 속도·좌우 입력·전투·성장은 유지합니다.
- **전체 모험가 메뉴12칸**의 폭·높이·제목 줄과 마지막 행을 맞췄습니다.4열×3행이며 중복 복귀 카드는 제거합니다. 작은 화면·안전영역·1.4배 글자를 검사했습니다. 오른쪽 아래 기본 접기/펼치기, 왼쪽 위 정보만 모서리 배치, 타이틀 상점 제거는 유지합니다.
- [구현·화면·95초 연속 이동 영상](FOOTWORK-MENU-NOTES.md) · [전수 검수](FOOTWORK-MENU-VERIFICATION.json).36종×느린 이동/달리기×두 방향×8시점1,152개 실제 접지 렌더, 원본 알파에서 독립 측정한 발바닥,128개 캐릭터·몬스터30,720회 렌더와36종 좌우 픽셀 비교,744개 기본 포즈·6직업 실제 연속 전투를 포함합니다.
- 검증 소스 `12451dfba010ed432a566702cbe2444c86203eb7`. [최종 전체 **71개 검사(코드34 + Java2 + Chrome35)**와 APK/AAB·Android lint·기존 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/44176222151). 이 최종 빌드의 검사 실패0건입니다. 기존 장비 비교/세트 효과·보스 마법·터치/4인·닉네임/변경권·성장/랭킹/저장 회귀를 포함합니다.
- APK **512,926,747 bytes**, SHA-256 `062b2211476d5fcaada67fff9e0c6a12fac7a86121fb330bf07fedc783643ec7`. ZIP **512,928,091 bytes**, SHA-256 `7903badc67ae388fc8f7a5ec77788e75323724b8d2abf478536d224763468c1d`. [공개 게시·익명 전체 다운로드 검증](https://github.com/ohohhyun/CatHome/actions/runs/45106532129): 크기·해시·ZIP CRC·내부 APK 일치. 별도 익명 HEAD도 두 파일 HTTP200입니다. [배포 기록](2.20.3-VERIFICATION.json).
- versionName2.20.3 / versionCode52 / 저장2 / Wi-Fi12 / 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 유지. 기존 이름·ID·계급·성장·장비·XP·외형·보상 기록을 보존합니다. 닉네임 최초 무료 저장/이후 변경권1개·3,900원/결제 전 구매 불가,4모드·공유 AI PK·기존5종 랭킹·매주 보상/2주 초기화·걷기 없는 미리보기·자동 저장을 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수:** Android51→52 업데이트/저장·변경권 보존, 실제 손가락 조작감과 보행 체감, 시스템 글자/키보드/터치 스크롤, 물리 Wi-Fi2~4대, 장시간 FPS/발열/음량. 자동 검사 통과를 모든 환경의 무결함 보장이나 실기기 완료로 표현하지 않습니다.
- 집사 사절 원본 보호: app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 게시/문서 커밋은 검증 앱 소스를 바꾸지 않습니다.

## 이전 공개 버전: 2.20.2 RC1 · 걸음 박자·장비 비교·메뉴 정렬·보스 마법 수정

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.2-rc1/DungeonCrush-2.20.2.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.2-rc1/DungeonCrush-2.20.2-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.20.2-rc1). 로그인 없이 내려받습니다. 카톡에는 주소를 공유하고 기존 앱을 삭제하지 않은 채 업데이트 설치합니다.
- 2.20.1의 가변 포즈 시간과 주기 끝 조기 복귀를 제거했습니다.8개 전신 포즈를 같은 시간씩 표시하고, 키×260 보폭으로 다리 회전만 낮춥니다. **물리 이동 속도·조이스틱·좌우 보정은 그대로**입니다. 픽셀 차이별 재생 시간 조절을 다시 적용하지 않습니다. 원화·기준점·몸 배율도 보존합니다.
- 가방 상세·비교는 왼쪽 착용 장비/오른쪽 선택 장비를 나란히 표시합니다. 각 옵션 차이와 전체 장비·세트 효과를 반영한 교체 후 수치/전투력 증감을 ↑상승/↓하락/변화 없음으로 구분합니다.4세트 HP·6세트 집중 손실을 포함하며, 레벨 제한 장비에는 잘못된 전체 감소 예측을 표시하지 않습니다. 빈 슬롯·같은 장비·읽기 전용·안전영역·1.4배 글자도 검사했습니다.
- 오른쪽8개 메뉴 칸의 폭/높이와 전체 메뉴 카드의 행 정렬을 맞췄습니다. 기본 접기/펼치기·접기, 왼쪽 위 정보만 모서리 배치, 타이틀 상점 제거 지시는 유지합니다.
- 보스 마법의 시전/폭발/잔류/투사체를 크게 보강했습니다. 보스 폭발0.9초·발사광0.35초입니다. **피해·범위·패턴·경고선·충돌·랜덤·보상은 바꾸지 않습니다.**16속성/효과 줄이기/96·24장식/48텍스처 제한과 도넛 중앙 안전지대를 유지합니다. [방법·범위·비교 화면](CADENCE-COMPARE-BOSS-NOTES.md) · [상세 검수](CADENCE-COMPARE-BOSS-VERIFICATION.json).
- 검증 소스 `4fc1030fc23183809203565df41d789a4bf4b33c`. [전체 **71개 검사(코드34 + Java2 + Chrome35)**와 APK/AAB·Android lint·기존 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/44020842900). 수행한 검사 실패0건입니다. 전수 모션·실제 터치/4인·장비 교체/세트 손실·글자/메뉴 칸·보스 효과 표시 면적/안전지대/부하·552회 이펙트 외 상태 비교 및 기존 성장/랭킹/이름/저장 회귀를 포함합니다.
- APK **490,023,153 bytes**, SHA-256 `3f3ca5ce6a7421f12baa30607f75b526e1c5b79fde82336944917fdb602fd0e6`. ZIP **490,024,501 bytes**, SHA-256 `104daaf1bba5fa83cc3c907ddf8b25086fbff7810b3e36e6e76fa7d7da70aece`. [공개 게시·익명 전체 다운로드 검증](https://github.com/ohohhyun/CatHome/actions/runs/44024668652): 크기·해시·ZIP CRC·내부 APK 일치. 별도 익명 HEAD도 두 파일 HTTP200입니다. [배포 기록](2.20.2-VERIFICATION.json).
- versionName2.20.2 / versionCode51 / 저장2 / Wi-Fi12 / 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 유지. 기존 이름·ID·계급·성장·장비·XP·외형·보상 기록을 보존합니다. 닉네임 최초 무료 저장/이후 변경권1개·3,900원/결제 전 구매 불가,4모드·공유 AI PK·기존5종 랭킹·매주 보상/2주 초기화·걷기 없는 미리보기·자동 저장을 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수:** Android50→51 업데이트/저장·변경권 보존, 실제 손가락 조작감과 보행 체감, 시스템 글자/키보드/터치 스크롤, 물리 Wi-Fi2~4대, 장시간 FPS/발열/음량. 자동 검사 통과를 모든 환경의 무결함 보장이나 실기기 완료로 표현하지 않습니다.
- 집사 사절 원본 보호: app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 게시/문서 커밋은 검증 앱 소스를 바꾸지 않습니다.

## 이전 공개 버전: 2.20.1 RC1 · 좌우 달리기와 마을 화면 수정

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.1-rc1/DungeonCrush-2.20.1.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.1-rc1/DungeonCrush-2.20.1-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.20.1-rc1). 로그인 없이 내려받습니다. 카톡에는 파일 대신 주소를 공유하고 기존 앱을 삭제하지 않은 채 업데이트 설치합니다.
- **최신 UI 지시:** 타이틀에는 외형·펫 상점을 넣지 않습니다. 마을에서 이용합니다. 마을 왼쪽 위는 계급·닉네임·골드·직업·레벨·EXP만 안전영역+6px에 붙이며 중복 조작을 넣지 않습니다. 오른쪽 아래는 기본 접기 상태에서 펼치기·접기로 이용합니다.8개 바로가기/12개 전체 메뉴 기능을 유지하고 Wi-Fi 파티는 대기실로 바로 엽니다. 이후 변경도 이 배치 지시를 우선합니다.
- 터치의 작은 수평 흔들림과 달리기 구간을 보정하고 반전 시 이전 속도로 뒤로 미끄러지는 구간을 제거했습니다.6캐릭터/30외형의 하체 포즈 간격을 실측해 재생 시점을 조정했으며 전신 원화·접지 기준·몸 배율과 기본 이동 속도·전투 수치를 보존합니다. [방법·범위](TOWN-RUN-REPAIR-NOTES.md) · [상세 검수](TOWN-RUN-REPAIR-VERIFICATION.json).
- 검증 소스 `3da2e76db4fc9d7f39e0825d857fe4efbf6bbcc3`. [전체 **71개 검사(코드34 + Java2 + Chrome35)**와 APK/AAB·Android lint·기존 설치 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43976495111). 수행한 검사 실패0건입니다. 세 화면의 실제 터치/서로 다른 좌우 밀기 거리, 전직업30/60/120Hz 출발·반전,36종×8포즈의 실제 좌우 화면 픽셀 비교,128개 캐릭터·몬스터30,720렌더,4인 전투 및 기존 성장/랭킹/이름/저장/확대 글자 회귀를 포함합니다. 파일 실행 출처에서도 화면 비교를 검증했습니다.
- APK **490,022,398 bytes**, SHA-256 `66ae1f357eec8da4b4f4271800807a4d6fc4338df8828eebdeb8a6d6376f1a5b`. ZIP **490,023,730 bytes**, SHA-256 `6eb327eec28c8f5c42d6c55a57219e8170875eb2142c68af601348a5c3c0e29d`. [공개 게시·익명 전체 다운로드 검증](https://github.com/ohohhyun/CatHome/actions/runs/43980778067): 크기·해시·ZIP CRC·내부 APK 일치. 별도 익명 HEAD도 두 파일 HTTP200입니다. [배포 기록](2.20.1-VERIFICATION.json).
- versionName2.20.1 / versionCode50 / 저장2 / Wi-Fi12 / 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 유지. 기존 이름·ID·계급·성장·장비·XP·소유 외형·보상 기록을 보존합니다.
- 닉네임 최초 무료 저장 / 이후 변경권1개 사용·3,900원 / 등록된 결제 상품이 없어 현재 구매 불가를 유지합니다. 무료 테스트 외형 상품에 변경권을 넣지 않습니다.4모드·공유 코드/파일 AI PK·기존5종 랭킹·매주 보상/2주 초기화·걷기 없는 미리보기·자동 저장/복구·몬스터 음성을 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수:** Android49→50 업데이트/저장·변경권 보존, 시스템 글자/키보드/터치 스크롤, 물리 Wi-Fi2~4대, 장시간 FPS/발열/실제 조작감/음량. 자동 검사 통과를 모든 환경의 무결함 보장이나 실기기 검수 완료로 표현하지 않습니다.
- 집사 사절 원본 보호: root app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 게시/문서 커밋은 검증한 앱 소스를 바꾸지 않습니다.

## 이전 공개 버전: 2.20.0 RC1 · 텍스트 겹침/랭킹/닉네임 변경권 수정 완료

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.0-rc1/DungeonCrush-2.20.0.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.20.0-rc1/DungeonCrush-2.20.0-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.20.0-rc1). 로그인 없이 내려받습니다. 카톡에는 파일 대신 주소를 공유합니다. **기존 앱을 삭제하지 말고 업데이트 설치합니다.**
- 타이틀 버튼/하단 문구·마을 왼쪽 정보창·모험가 메뉴의 겹침을 수정했습니다. 이름/골드/직업/레벨/EXP/조작을 하나의 패널에 모으고, 확대된 메뉴 카드는 내용 높이를 따라갑니다. 랭킹은 공식 게임의 필터/표를 참고해 장식 사이드바를 제거하고 기록 표 중심으로 정리했습니다. 서버 미연결에서는 내 기록부터 표시합니다. [원인·참고·비교 화면](MENU-REPAIR-NOTES.md).
- 닉네임 최초 등록은 무료 **저장**, 이후는 **변경**이며 닉네임 변경권1개가 있어야 바뀝니다.3,900원 소모성 상품이고 정확히1개를 사용합니다. 같은 이름·잘못된 이름·취소·저장 실패·PK 진행 중에는 소모하지 않습니다. ID/계급/점수/성장/보상 기록을 유지합니다. Wi-Fi 이름 입력은 읽기 전용입니다.
- **사용자가 확인한 범위: 등록된 Google Play 결제 상품 없음 → 결제 연결 전까지 구매 불가.** 상품은 가격/보유 수/용도와 ‘구매 준비 중’으로 표시합니다. 실제 결제·가짜 구매 완료·무료 대체 지급은 없습니다. 무료 테스트 상품40종에도 변경권을 넣지 않았습니다. 향후 실결제/검증을 연결하기 전 이 제한을 해제하지 않습니다.
- 검증 소스 `c7f09d5a3b55ad6c482ca66c0c08226364bbe802`. [전체 **71개 검사(코드34 + Java2 + Chrome35)** 및 APK/AAB·Android lint·기존 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43861978409). 수행한 검사 실패0건입니다. 세 화면 크기/1.4배 글자의 실제 텍스트 겹침과 카드 경계, 기존10화면/안전영역, 변경권/취소/저장 실패/우회, 기존 성장/전투/전수 모션/4인/주간 보상/2주 초기화/랭킹을 포함합니다. [배포 검증](2.20.0-VERIFICATION.json) · [기능 검수](MENU-REPAIR-VERIFICATION.json).
- APK **490,019,558 bytes**, SHA-256 `1483bf7ef4854043315d46fac8ae3d7c85e2b118f5bc14c6e157cb283fc62a92`. ZIP **490,020,680 bytes**, SHA-256 `bd5ba220653b65155479ca30a446ef550f805bff0228605e112e65e09e05c9b2`. [공개 게시와 익명 전체 다운로드 검증](https://github.com/ohohhyun/CatHome/actions/runs/43866901781)에서 크기/해시/ZIP CRC/내부 APK 일치를 확인했습니다. 별도 익명 HEAD도 두 파일 HTTP200입니다.
- versionName2.20.0 / versionCode49 / 저장2 / Wi-Fi12 / 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 유지. 기존 정상 이름은 등록 상태/보유0개로 이행하며 기존 이름·ID·장비·XP·보상·소유 외형을 보존합니다. 부적합한 이름만 남은 구버전 기록의 필수 정정은1회 무료로 처리합니다.2.20 등록 후에는 빈 이름이어도 등록 상태를 지워 무료 변경으로 우회하지 않습니다.
- 4가지 모드·공유 코드/파일 AI PK·기존5종 랭킹·매주 보상/2주 초기화·자동 저장/복구·걷기 없는 미리보기와 모션/몬스터 음성을 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수**: Android48→49 업데이트/저장·변경권 보존, 시스템 글자 크기/키보드/터치 스크롤·물리 Wi-Fi2~4대·장시간 FPS/발열/조작감/음량. 수행한 검사 실패0건을 모든 환경의 무결함 보장이나 실기기 검수 완료로 표현하지 않습니다.
- 집사 사절 원본 보호: root app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 배포/문서 커밋은 검증한 앱 소스를 바꾸지 않습니다.

## 이전 공개 버전: 2.19.0 RC1 · 닉네임/이동/메뉴/몬스터 음성 개선 완료

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.19.0-rc1/DungeonCrush-2.19.0.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.19.0-rc1/DungeonCrush-2.19.0-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.19.0-rc1). 로그인 없이 내려받을 수 있습니다. 카톡에는 파일 대신 주소를 공유합니다. **기존 앱을 삭제하지 말고 업데이트 설치합니다.**
- 첫 실행은 닉네임 생성 → 캐릭터 선택입니다. 한글2~8/영문4~16자와 혼합 길이, 비속어·선정성·혐오·운영자 사칭/변형 필터를 적용했습니다. 설정·유저 정보 공유·Wi-Fi 입장도 같은 규칙을 사용합니다. 기존 규칙에 맞지 않는 이름은 다시 정하며 ID/성장/점수는 유지합니다.
- 6직업·30외형의 키에 맞춘 보폭과 좌우 반전 자세/접지 위상을 개선하고 메뉴·버튼·패널·선택 표시를 다듬었습니다. 몬스터8계열 시전/피격/사망24음을 추가했습니다. 플레이어용 성장 백업 파일 기능은 제거하고 **자동 저장/복구와 공유 코드·파일 AI PK는 유지**합니다. [변경·공식 게임/음원 출처](PLAYER-EXPERIENCE-NOTES.md) · [변경 전](PlayerExperience-2.19-Before.png) · [변경 후](PlayerExperience-2.19-After.png).
- 검증 소스 `80b24b41b15a08ee216f007a77fd983e264c5d65`. [전체 **69개 검사(코드33 + Java2 + Chrome34)**와 Android 컴파일·APK/AAB·Android lint·기존 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43818547972). 수행한 검사 실패0건입니다. 이름/IME/저장 실패·기존 기록/3크기·확대 글자/24실제 음원·전수 모션/4인 전투를 포함합니다. [배포 검증](2.19.0-VERIFICATION.json) · [상세 검수](PLAYER-EXPERIENCE-VERIFICATION.json).
- APK **490,012,528 bytes**, SHA-256 `e14652c71a0d1f1ba9e0d4d35e2beea026026d28607be7bde5556aa130f04a99`. ZIP **490,013,621 bytes**, SHA-256 `776a9bf742b83f880409b25d2e25ef495749a8a5c55951620e697aa555e6657d`. [공개 게시·익명 전체 다운로드 성공](https://github.com/ohohhyun/CatHome/actions/runs/43823028013): APK 크기/해시, ZIP 크기/해시/CRC와 내부 APK 일치를 검증했습니다. 별도 익명 HEAD도 두 파일 모두 HTTP200입니다.
- versionName2.19.0 / versionCode48 / 저장 형식2 / **Wi-Fi 프로토콜12, 파티원 전원 업데이트**. 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`을 유지합니다. 기존 전투 수치·물리 이동 속도·성장·장비·보상·소유 외형과 저장 기록을 보존합니다.
- 4가지 모드·공유 코드/파일 AI PK·계급·기존 랭킹·매주 월요일00:00 KST 보상/2주마다 초기화·미수령 보상·걷기 없는 미리보기를 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수**: Android47→48 업데이트/저장 보존, 닉네임 키보드/파일 선택/클립보드, 2~4대 물리 Wi-Fi, 장시간 FPS·발열·터치 조작·몬스터 음량. 자동 검사 결과를 모든 환경의 오류0 보장이나 실기기 완료로 표현하지 않습니다.
- 집사 사절 원본 보호 트리 유지: root app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 배포/문서 커밋은 검증한 앱 소스를 바꾸지 않습니다.

## 이전 공개 버전: 2.18.0 RC1 · 몬스터 스킬 이펙트 개선 완료

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.18.0-rc1/DungeonCrush-2.18.0.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.18.0-rc1/DungeonCrush-2.18.0-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.18.0-rc1). 로그인 없이 내려받을 수 있습니다. 카톡에는 파일 대신 주소를 공유합니다. **기존 앱을 삭제하지 말고 업데이트 설치합니다.**
- 몬스터16속성의 시전·타격·잔류·투사체를 개선하고, 적 투사체 타격의 속성 정보 누락을 수정했습니다. 모든 외형에서 경고선을 마지막에 표시하며 도넛 안전지대·직선 경계·효과 줄이기를 보존합니다. 장식은 프레임96개/축소 모드24개, 텍스처는48개 약6MB로 제한합니다. [변경·공식 게임 참고](ENEMY-EFFECTS-NOTES.md) · [변경 전](MonsterEffects-2.18-Before.png) · [변경 후](MonsterEffects-2.18-After.png).
- 검증 소스 `1ae345bc8e5609abeae782a5405faa5dfa5aff2e`. [전체 **65개 검사(코드30 + Java2 + Chrome33)**와 APK/AAB·Android lint·기존 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43525483476). 552회 전투 상태 비교, 92종/368장면, 16속성×4단계×2모드, 실제4인 브라우저 전투와3크기 화면을 포함합니다. [배포 검증](2.18.0-VERIFICATION.json) · [효과 상세 수치](MONSTER-EFFECTS-VERIFICATION.json).
- APK **489,858,364 bytes**, SHA-256 `564aa9c671c98615df4b5eed66eb014799be7a7c2bdd2c71133698ec741fe34e`. ZIP **489,859,273 bytes**, SHA-256 `161f5a5aac52273ae498693f2d67a5d7940680e95430e459ed17306cca9e8072`. [공개 게시·익명 전체 다운로드 성공](https://github.com/ohohhyun/CatHome/actions/runs/43529456802): APK 크기/해시, ZIP 크기/해시/CRC와 내부 APK 일치를 검증했습니다. 별도 익명 HEAD도 두 파일 모두 HTTP200입니다.
- versionName2.18.0 / versionCode47 / 저장 형식2 / Wi-Fi 프로토콜11. 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`을 유지합니다. 기존 전투 수치·공격 범위/시간·모션·성장·장비·보상과 모든 저장 기록을 보존합니다.
- 4가지 모드·공유 코드/파일 AI PK·닉네임/계급·기존 랭킹·매주 월요일00:00 KST 보상/2주마다 초기화·미수령 보상·걷기 없는 미리보기를 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수**: Android46→47 업데이트/저장 보존, 파일 선택/클립보드, 2~4대 물리 Wi-Fi, 장시간 FPS·발열·터치 조작. 브라우저 수치를 실기기 검수 완료로 표현하지 않습니다.
- 집사 사절 원본 보호 트리 유지: root app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 배포/문서 커밋은 검증한 앱 소스를 바꾸지 않습니다.

## 이전 공개 버전: 2.17.0 RC1 · 성장/전투/파밍/스킬 수정 완료

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.17.0-rc1/DungeonCrush-2.17.0.apk)** · [설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.17.0-rc1/DungeonCrush-2.17.0-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.17.0-rc1). 로그인 없이 내려받으며 카톡에는 주소를 공유합니다. **기존 앱을 삭제하지 말고 업데이트 설치합니다.**
- 퀘스트/처치/클리어 XP 속도와 PvE 몬스터 강도·반복 경직·방 회복을 조정했습니다. 던전별 목표 부위와 난이도 최소 등급, 같은 던전/난이도 3회마다 강화 재료를 추가했습니다. **실제 만렙100과 기존 레벨·XP·장비·스킬 랭크는 보존합니다.**
- 해금 스킬 첫 습득은 무료, SP는 랭크 강화에 사용합니다. 전직·각성/SP 조건 표시, 지원 스킬 랭크 효과, 공격 중 짧은 스킬 터치·키 입력을 수정했습니다. [원인·변경·공식 게임 참고](PROGRESSION-BALANCE-NOTES.md) · [비교 수치](PROGRESSION-BALANCE-MEASUREMENTS.json).
- 검증 소스 `d57b3b94c2c4f75523b29ceaf5899c3f5d9c32bd`. [전체 **63개 검사(코드29 + Java2 + Chrome32)** 및 APK/AAB·Android lint·기존 서명·포함 파일 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43442017010). 48개 실제 습득/장착/저장, 짧은 터치/키보드 실제 발동, 저장 실패 롤백, 같은 입력 정책의 6직업 초반/60레벨 악몽 비교를 포함합니다. [검증 기록](2.17.0-VERIFICATION.json).
- APK **489,855,478 bytes**, SHA-256 `8de648f54a9d83cb4317273ab53d2c63f2d1bc80bbc3965b527ee3649b2dc8f9`. ZIP **489,856,678 bytes**, SHA-256 `680689ed14dc13c3921b311257ee0742e5bcbde1080f76c84c90a6a9770e9199`. [공개 게시·익명 전체 다운로드 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43447303767): APK 크기/해시, ZIP 크기/해시/CRC/내부 APK 일치를 확인했습니다. 별도 익명 HEAD도 두 파일 모두 HTTP 200입니다.
- versionName2.17.0 / versionCode46 / 저장 형식2 / **Wi-Fi 프로토콜11**. 파티원 전원이 업데이트합니다. 기존 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`을 유지합니다.
- 기존 4가지 모드·공유 코드/파일 AI PK·닉네임/계급·기존 랭킹·선택 배경/직업별 키·모션/걷기 없는 미리보기를 유지합니다. **매주 월요일00:00 KST 보상 / 점수·계급·시즌 전적 초기화는 2주마다**, 미수령 보상과 모든 성장 기록은 유지합니다. 서버·DB·실결제는 연결하지 않습니다.
- **남은 실기기 검수**: 실제 Android45→46 업데이트/저장 보존, 파일 선택/클립보드, 2~4대 실제 Wi-Fi 기기, 장시간 FPS·발열·조작감. 자동 검사 결과를 실기기 검수 완료로 표현하지 않습니다.
- 집사 사절 원본 보호 트리는 그대로입니다: root app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 배포/기록 커밋은 검증한 앱 소스를 변경하지 않습니다.

## 이전 공개 버전: 2.16.0 RC1 · 검증·공개 다운로드 완료

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.16.0-rc1/DungeonCrush-2.16.0.apk)** · [APK+설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.16.0-rc1/DungeonCrush-2.16.0-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.16.0-rc1). 로그인 없이 내려받을 수 있습니다. 카톡에는 파일 대신 APK 주소를 공유합니다. **기존 앱을 삭제하지 말고 업데이트 설치합니다.**
- **최신 사용자 지시: 보상은 매주 / 멀티 PK 점수·계급·시즌 전적 초기화는 2주마다.** 월요일 00:00 KST 기준이며, 다음 초기화는 2026-11-23 00:00 KST입니다. 초기화 전에 확정한 미수령 주간 보상·닉네임·유저 ID·성장·기존 랭킹 누적 기록은 유지합니다.
- 플레이 방식은 싱글 / 와이파이 멀티 / 와이파이 PK / 멀티 PK 4가지입니다. 멀티 PK는 **사용자가 명시 선택한 공유 코드·파일 방식, 서버 미연결 유지**입니다. 가까운 점수(±200)의 실제 유저 스냅샷을 찾아 AI가 조작합니다. 이전 시즌 스냅샷은 새 시즌 매칭에서 제외합니다.
- 설정에서 닉네임을 저장하고 실제 유저 이름 앞에 브론즈·실버·골드·다이아·마스터·챌린저 계급을 표시합니다. 기존 랭킹 메뉴와 5종 종목은 유지합니다. [게임 참고·대전/보상 규칙](PK-MODES-NOTES.md).
- 선택창 성채 회랑 배경과 투명 전신 원화 5장을 추가하고 엘리안 기존 원화를 유지했습니다. 눈높이~발바닥 기준 키는 카엘 100%, 린 108%, 베인 116%, 세라 92%, 아리아 84%, 엘리안 104%입니다. 선택·마을·전투·외형 30벌·미리보기에 적용합니다. 원래 점프 높이와 전투 수치를 보존합니다. [변경·검수 범위](CHARACTER-HEIGHT-NOTES.md).
- 미리보기는 걷기 없이 달리기·공격·점프·스킬 하나를 자동 반복합니다. 기존 모션 안정화도 유지합니다.
- 검증 소스 `8a864f446b599e352af240d5444f6f960804189e`. [전체 **61개 검사(코드28 + Java2 + Chrome31)**, APK/AAB·Android lint·기존 설치 서명·포함 자원 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43421801822). 날짜 경계·주간/2주 분리·재시작/저장 실패·정산 중복·장기 미접속 보존, 실제 두 유저 정보 공유→AI 전투→점수 정산, 전체 캐릭터/몬스터 모션과 UI를 확인했습니다. [검증 기록](2.16.0-VERIFICATION.json).
- APK **489,853,833 bytes**, SHA-256 `12ee6211943885413c294bd7427c34217497cff8ae7aabd9247807c5c7584ac4`. ZIP **489,854,880 bytes**, SHA-256 `3704f2ee0b8ba2841be1a556596b65731083a7490729451cd5f319c8dc2a6081`. [공개 게시·익명 전체 다운로드 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43426684449): APK 전체 크기/해시, ZIP 전체 크기/해시/CRC/내부 APK 일치를 확인했습니다. 별도 익명 HEAD도 두 파일 모두 HTTP 200입니다.
- versionName 2.16.0 / versionCode 45 / 저장 형식 2 / Wi-Fi 프로토콜 10. 기존 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`을 유지합니다.
- **남은 실기기 검수**: 실제 Android 44→45 업데이트와 저장 보존, 새 PK 파일 선택/클립보드, 2~4대 실제 Wi-Fi 기기, 장시간 FPS·발열·조작감. 실기기 검수를 완료했다고 표현하지 않습니다. 운영 서명/스토어 등록도 별도입니다. 서버·DB·실결제는 연결하지 않았습니다. 로컬 PK 점수·시간·공유 데이터는 서버 검증 기록이 아닙니다.
- 집사 사절 원본 보호 트리는 그대로입니다: root app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 배포·문서 커밋은 검증한 앱 소스를 변경하지 않습니다.

## 2.15.2 RC1 공개 다운로드 완료

- [로그인 없는 APK ZIP 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.15.2-rc1/DungeonCrush-2.15.2-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.15.2-rc1). 카톡에는 파일 대신 이 링크를 공유합니다.
- 공개 ZIP 482,247,129 bytes / SHA-256 `6c17367f0a6cffbfc1328b568e5c48eee34c2c0e7c47d34eba9b816cd179ebfe`. [배포·익명 전체 다운로드 검증](https://github.com/ohohhyun/CatHome/actions/runs/43398285152) 성공: ZIP 전체 크기·해시·CRC와 내부 APK 해시 일치를 확인했습니다. 별도 익명 HEAD도 HTTP 200입니다.
- 앱 구현은 검증한 `44fddcf235bd1144ad933e1650290d847ae4fa17` 그대로이며, APK SHA-256은 `33803a1f8dc4d4abd569079d409d084cac0079f294a5140b725850f9ee08d95e`입니다. 버전 2.15.2 / 설치 버전 44 / 기존 서명을 유지합니다. 앱을 삭제하지 말고 업데이트 설치합니다.

# 2.15.2 미리보기 걷기 제거 · 검증 완료

- 미리보기에서 걷기를 제거하고 달리기·공격·점프·스킬 하나를 자동 재생합니다. 주기는 동작 시간 합계로 계산합니다.
- [전체 57개 검사와 APK/AAB·Android lint·기존 서명·포함 리소스 확인 통과](https://github.com/ohohhyun/CatHome/actions/runs/43392615202). 검증 소스 `44fddcf235bd1144ad933e1650290d847ae4fa17`.
- [APK ZIP](https://github.com/ohohhyun/CatHome/actions/runs/43392615202/artifacts/14023301817) (GitHub 로그인 필요). APK 482,246,354 bytes / SHA-256 `33803a1f8dc4d4abd569079d409d084cac0079f294a5140b725850f9ee08d95e`. 설치 버전 44, 저장 형식 2, Wi-Fi 프로토콜 10. 앱을 삭제하지 말고 업데이트 설치합니다.
- 이전 모션 안정화와 집사 사절 원본 보호를 유지합니다. 실제 단말 장시간 FPS·발열은 별도입니다. 아래는 이전 버전 기록입니다.

# 2.15.1 모션 안정화 · 미리보기 간소화 검증 완료

- [전체 57개 검사와 APK/AAB·Android lint·기존 서명·포함 리소스 확인 통과](https://github.com/ohohhyun/CatHome/actions/runs/43385971872). 검증 소스 `02c6d87d87bceab7a3175b1fe34d008675aa3c44`.
- [APK artifact ZIP](https://github.com/ohohhyun/CatHome/actions/runs/43385971872/artifacts/14020027552), GitHub 로그인 후 내려받아 압축을 풉니다. `DungeonCrush-2.15.1.apk`는 482,246,354 bytes / SHA-256 `fc97b1490514daf165040ef20261875ffa7cb501fdda2987c1ea0ba2f8532773`. 분할 CRC·SHA 및 재조립한 APK의 CRC/해시와 포함 스크립트·기존 인증서까지 확인했습니다.
- versionCode 43, 저장 형식 2, Wi-Fi 프로토콜 10. 기존 앱을 삭제하지 않고 업데이트합니다. 현재 공개 릴리스 2.15.0 RC1은 교체하지 않았습니다.
- [상세 검수](MOTION-STABILITY-NOTES.md) · [검증 기록](MOTION-STABILITY-VERIFICATION.json). 실제 단말 42→43 업데이트·저장 보존, 2~4대 Wi-Fi, 장시간 FPS/발열/조작감은 별도로 확인합니다. 아래 운영 서명/스토어 제출 기준도 유지합니다.

# 2.15.0 캐릭터 원화 · 외형 미리보기 — 최종 검증 완료

- 기본 6명 + 외형 30벌의 원화 36장 고유 매핑, 해시, 전신 및 디코딩을 확인했습니다. 30벌 실제 장착/해제, 맞는 선택창 원화, 마을·전투 재진입 후 외형 유지, 기본 몸 복귀를 확인했습니다.
- 하체/무기 잘림과 몸 비율, 공격·달리기·점프·회피·스킬 미리보기 배율, 상품 전환·로딩 실패 재시도, 좁은 휴대폰·노치·1.4배 글자를 검사했습니다.
- [검수 상세](UI-KEYART-NOTES.md) · [측정 자료](UI-KEYART-QA.json) · [마을/전투 비교](Appearance-2.15.0-World-Comparison.png).
- 전체 55개 자동 검사(코드25 + Java2 + Chrome28), APK/AAB, Android lint, 기존 서명과 최종 포함 리소스 검증 통과: [빌드 43366493827](https://github.com/ohohhyun/CatHome/actions/runs/43366493827). 소스 `f616e095a66be0d3d31c8e030d9022b3cad536e3`.
- APK 482231241 bytes / SHA-256 `e8af843d3462e8a28ebed202faeed6d7d787b392a77a22452e544a4aba8369ef`. [공개 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.15.0-rc1/DungeonCrush-2.15.0-RC1.zip) 484004107 bytes / SHA-256 `d463deeefc147a8fa370ab52dbd108fbcf8b61b83e1bd94b295e0b2147dbc49c`. 로그인 없는 전체 다운로드, HTTP 200·asset 노출·ZIP CRC·안쪽 APK 크기/해시 검증 통과: [게시 작업 43379978484](https://github.com/ohohhyun/CatHome/actions/runs/43379978484).
- versionCode 42 / 저장 형식 2 / Wi-Fi 프로토콜 10. 실기기 장시간 FPS·발열은 측정하지 않았습니다. 외형/펫은 무료 테스트 구매입니다.

# 2.14.1 외형 몸 크기 점검

- 기본 캐릭터와 유료 외형 30벌을 같은 월드 높이·발 위치로 나란히 표시하고, 장식과 무기를 제외한 몸 기준점을 비교합니다.
- 대기·3단 공격·시전 5동작/양방향 300건의 실제 렌더 좌표, 달리기·점프·대시 기준 공유, 장착·해제와 저장을 확인합니다.
- 몸의 가로·세로 비율과 동작 안의 배율을 고정하고, 75개 원화 바이트와 스킬/전투 결과를 보존합니다. 기준점 검수 원화 SHA와 포장 후 재적용을 확인합니다.
- 기존 모든 검사와 새 몸 크기 검사를 합친 52개 후 APK/AAB·lint·서명·포함 리소스를 검증하고, 공개 ZIP을 실제 다운로드해 크기/SHA/CRC/내부 APK 일치를 확인합니다.
- 2.14.1 / versionCode 41, 저장 형식 2 / 프로토콜 10. 실제 단말 장시간 FPS·발열은 별도입니다.

[52개 전체 검사 및 APK/AAB·lint·서명·리소스 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43311412102). [공개 ZIP 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43315777693). 로그인 없이 공개 파일 전체를 내려받아 크기/SHA256/CRC와 내부 APK도 확인했습니다. APK SHA256 `a43a0533140a05270115a650d583d78333d1665fd43cb4746d6187bd8b5b13c8`, ZIP SHA256 `264baa3a917d57c00dd66dfd2a6af6bcda592ca7f4e3aeedb0c782c47976da2c`. [다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.14.1-rc1/DungeonCrush-2.14.1-RC1.zip).

# 2.14.0 외형 · 펫 상점 점검

- package com.dungeoncrush.game, versionCode 40, versionName 2.14.0, minSdk 23, targetSdk 36, Wi-Fi 프로토콜 10.
- 6직업×5외형, 크리스마스 6벌, 10펫, 40개 고유 SKU와 상품별 예정가 9,900원. 실제 결제 없이 무료 테스트 보유권으로만 동작해야 합니다.
- 구매 취소/중복 구매/모두 받기, 소유·직업별 장착 제한, 장착 표시/해제, 재시작·백업/복원·저장 실패 복구를 확인합니다.
- 기존 골드·장비·스킬·능력치를 보존하고, 외형별 동일 입력의 전투 결과가 기본 외형과 정확히 같아야 합니다.
- 모든 전신 모션/무기 끝·투명 셀 경계, 상점 30외형×9스킬·10펫, 방향/이동/연계/점프/대시를 확인합니다. 기본보다 큰 콘셉트 효과와 적 위험 경계, 원격 장식 상한·효과 줄이기를 확인합니다.
- 작은 화면·확대 글자·필터·포커스·Back, 필수 원화 실패 시 전투 정지와 재시도, 지연 로딩/캐시를 확인합니다.
- 크리스마스 외 24벌의 이동·공격 48시트가 새 의상·무기 형태인지, 6직업의 대기/달리기/3단 공격 크기와 연속 재생 영상에서 하체·무기·전환이 자연스러운지 확인합니다.
- 휴대폰의 주요 조작 44px 높이, 확대된 글자·장비 카드, 노치 여백과 1.4배 글자, 상품 목록을 스크롤한 뒤에도 구매·장착·해제 버튼을 실제로 누를 수 있는지 확인합니다. 같은 직업의 서로 다른 외형 4인도 캐시 상한 안에서 표시되어야 합니다.
- 기존 판매 보호/되돌리기, 48던전·4정예 레이드·24배경, 소리·기합 25%·보스 음악·랭킹 연결 대기와 4인 통신 검사도 수행합니다.
- 모든 검사 후 APK/AAB·Android lint·기존 서명·포함 리소스를 확인하고, 통과한 소스로만 ZIP을 공개합니다.
- 실제 단말에서 39→40 업데이트, 저장 보존, 동일 버전 Wi-Fi 파티, 외형/펫 전환과 장시간 FPS·발열·조작감을 별도로 확인합니다.

전체 **51개 자동 검사**와 APK/AAB·Android lint·기존 서명·리소스 검증 성공: https://github.com/ohohhyun/CatHome/actions/runs/43292372306. 공개 ZIP CRC/내부 APK/공개 digest 검증 성공: https://github.com/ohohhyun/CatHome/actions/runs/43297288266. APK SHA256 `8df16c4326ca22e1450ec449b5f3b0b2ae78fefe6b82f5c79532b1897b555bc0`. ZIP SHA256 `6cbd5e15a64ed237f3ee1a94d15ababd388fff5a6106f3c564e209b6ce9e9637`. [공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.14.0-rc1).

# 2.13.0 지역 확장 점검

- package com.dungeoncrush.game, versionCode 39, versionName 2.13.0, minSdk 23, targetSdk 36, Wi-Fi 프로토콜 9.
- 실제 2.12 저장의 6캐릭터·장비·골드·의뢰를 보존하고, 완료한 36번째 의뢰 다음부터 이어갑니다. 48개 의뢰 완료 시 종료하고 저장/재시작 후 유지해야 합니다.
- 신규 12던전·정예 레이드 4개의 입장 조건/보상/5개 전장 진행, 4인 중 미달 참가자, 100레벨 장비와 중복 정산 방지를 확인합니다.
- 48개 던전의 배경 연결과 24장 디코딩, 신규 몬스터 20종/320포즈의 alpha·전신/무기 경계·양방향 표시를 검사합니다. 원본 PNG→WebP는 무손실 RGBA 일치를 확인합니다.
- 직선/십자/고리/장판의 경고와 실제 피해 판정, 가장자리 안전지대, 적 사망 후 취소, 결정적 LAN 재생, 이펙트 줄이기에서도 위험 경계를 확인합니다.
- 배경 캐시 최대 3장, 다음 레이드 전장 준비, 로딩 실패 시 전투 정지·재시도·마을 복귀를 확인합니다.
- 작은 가로 화면과 확대 글자에서 4개 레이드 메뉴·선택 표시·입장 버튼을 확인하고 기존 6직업 모션·체크 판매/착용 보호·백업/랭킹/사운드 검사를 모두 실행합니다.
- 모든 코드/Java/Chrome 검사 후 APK/AAB 빌드와 Android lint, 기존 설치 서명·최종 원화/음원/스크립트 검증을 실행합니다. 통과한 소스로만 공유 ZIP을 만들고 APK/ZIP 해시와 공개 다운로드를 확인합니다.
- 실제 단말에서는 versionCode 38→39 업데이트 설치 후 성장 기록, Wi-Fi 전원 동일 버전, 신규 12던전과 4개 정예 레이드, 장시간 FPS/발열/조작감을 확인합니다. 자동 검사만으로 실기기 결과를 주장하지 않습니다.

전체 **47개 자동 검사**와 APK/AAB·Android lint·기존 서명·리소스 검증 성공: https://github.com/ohohhyun/CatHome/actions/runs/43162834939. 공개 ZIP CRC/내부 APK/공개 digest 검증 성공: https://github.com/ohohhyun/CatHome/actions/runs/43165066976. APK SHA256 `3576db3cb9ebfe12c080a5042b51e24732152e4326f09bd80e56f6e0c6578721`. ZIP SHA256 `c7c6a7e3f7557510b2bbdb36acdec8b3ed9a01ea7e3cde411cd2c8ecbb479cca`. [공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.13.0-rc1). 아래는 이전 검증 기록입니다.

# 2.12.0 사운드 보완 점검

- [검증 빌드](https://github.com/ohohhyun/CatHome/actions/runs/43007690959): JavaScript 20 + 네이티브 2 + Chrome 22 = **44개 자동 검사 통과**. Android lint, APK/AAB, 기존 서명·최종 원화/음원/스크립트 확인도 통과했습니다. [ZIP 공개 검증](https://github.com/ohohhyun/CatHome/actions/runs/43009990794) 성공.
- APK SHA256 `d635ae849384be7c537da0c1feb554a6eb7b552016bbb26dc0c79e8414160ad6`, ZIP SHA256 `f88722237d479e44110897273e3611d491cb89cf26d86ed1f95d5f3abe78f635`. [공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.12.0-rc1).
- package com.dungeoncrush.game, versionCode 38, versionName 2.12.0, minSdk 23, targetSdk 36.
- 6직업 실제 공격 기합, 직업별 스킬 효과음, 보스 루프곡을 실제 APK 포함 바이트/해시와 함께 확인합니다.
- 목소리 반복 간격·같은 소리 연속 방지·내 캐릭터 우선·4인 동시 재생 상한, 음높이 보존, 기존 게임 기록 불변을 확인합니다.
- 일반 전투→보스 구역→정리/다음 방→마을, 레이드 연속 보스, 새 원정/PVP, 일시정지/앱 전환/음소거·재개 때 음악 위치와 잔여 효과음을 확인합니다.
- 설정의 기합·목소리 0%/65%, 재실행 유지, 작은 가로 화면/글씨 확대와 스크롤을 확인합니다.
- 실제 단말에서는 기존 37→38 업데이트와 6직업·4인 동시 스킬의 음량 균형/지연/이어폰·스피커·블루투스·앱 전환을 확인합니다. 자동 검사만으로 실기기 음향/FPS를 측정했다고 표현하지 않습니다.
- 아래 이전 버전의 운영 서명·스토어 제출 기준을 유지합니다.

# 2.11.0 랭킹 · 마을 메뉴 · 가독성 점검

- 전체 랭킹 기본 상태는 서버 연결 전입니다. 이 버전에서는 서버를 만들거나 연결하지 않습니다.
- 내 기록의 6캐릭터·5종목·직업 필터·공동 순위·상세·새로고침을 확인합니다. 저장 데이터가 바뀌지 않아야 합니다.
- 메인·마을·캐릭터/콘텐츠/던전 선택에서 열기/닫기/Back/Escape/Tab을 확인합니다. 창 뒤 마을 이동은 멈추고 원정 시작 시 닫혀야 합니다.
- 작은 가로 화면/태블릿/글자 확대에서 닫기·종목·직업 필터·내 기록 보기 버튼과 스크롤을 확인합니다.
- 추후 서버 조회 어댑터는 로딩/빈 결과/오류/지연 응답/닫기/종목·직업 변경을 처리합니다. 실제 서버 연결 전까지 외부 요청은 발생하지 않습니다.
- 마을 6개 바로가기/전체 메뉴, 직접 원정 진입, 상점·대장간·스킬의 서비스 문맥과 착용 장비 판매 보호, NPC 접근 취소, 뒤로가기·입력 중립을 확인합니다.
- 새 메뉴는 9개 화면/가장자리 여백과 1.4배 글자에서 검사합니다. 기존 전체 화면 8개 크기 감사도 수행합니다.
- [검증 빌드](https://github.com/ohohhyun/CatHome/actions/runs/42997397968): JavaScript 19개 + 네이티브 2개 + Chrome 21개 = **42개 자동 검사 통과**. Android lint, APK/AAB 빌드, 기존 서명과 포함 리소스도 확인했습니다. [ZIP 공개 검증](https://github.com/ohohhyun/CatHome/actions/runs/42999740790) 성공.
- APK SHA256 `8e884109b29dbcbc5e9f4c5d22ca2ffb2b4969c047d1a18079854bdcc05d5592`. ZIP SHA256 `1db02a3c201a362819cead19dc6dadf93aafd3fd686dd82c419b4de84194ca8b`. [공개 ZIP](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.11.0-rc1).
- 실제 단말에서는 기존 versionCode 36 → 37 업데이트 후 기록 유지, 6직업 모션·메뉴/글자·Wi-Fi·뒤로가기·노치, 30분 플레이를 확인합니다.
- package com.dungeoncrush.game, versionCode 37, versionName 2.11.0. 아래는 이전 버전의 공통 배포 기준입니다.

# 2.10.3 출시 후보 점검

package `com.dungeoncrush.game`, versionCode 36, versionName 2.10.3, minSdk 23, targetSdk 36.

## 검증된 변경

- 일시정지 화면에서 게임 설정을 열고 닫은 뒤 계속합니다. 전투가 계속되는 상황을 안내하며 설정/메뉴 입력은 중립으로 처리합니다.
- 이펙트 간소화는 기본 꺼짐이며 기기에 저장합니다. 장식 입자·발광·잔상·전체 화면 연출을 줄이고 캐릭터 모션·공격 판정·경고를 유지합니다.
- 원정 나가기 확인, 개인전 메뉴 뒤로가기, 설정 중 경기 종료 시 결과 화면 전환을 보완했습니다.
- 완료 보상/개인전 전적 저장 실패 시 결과 화면에서 같은 보상을 다시 저장합니다. 중복 지급·재추첨을 방지하며 저장 전 이동을 막습니다. **결과 화면을 유지하는 동안** 가능하고 앱 강제 종료 후 미저장 결과 복원은 포함하지 않습니다.
- 기존 자동 저장 복구·파일 백업/복원·체크 일괄 판매·장착/잠금 보호·최근 판매 되돌리기를 유지합니다.

## 자동 검증

[빌드 42973385498](https://github.com/ohohhyun/CatHome/actions/runs/42973385498): 37개 기존 검사에 새 편의·보상 재시도 검증을 포함해 통과했습니다. Android lintRelease, API 36 APK 및 release 모드 AAB 빌드, 기존 APK 서명·최종 포함 리소스도 확인했습니다.

[ZIP 배포 검증](https://github.com/ohohhyun/CatHome/actions/runs/42975875688): 내부 APK와 공개 파일 크기/SHA256 확인 성공. [공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.10.3-rc1).

## 실제 Android 기기로 남은 점검

- 기존 versionCode 35에 36을 업데이트 설치하여 6직업 레벨/장비/스킬/설정 유지 확인
- 최소 지원 Android 6(업데이트된 System WebView), Android 13/16의 실행·뒤로가기·노치/제스처 영역·휴대폰/태블릿/분할 화면 확인
- 시스템 파일 선택기의 백업 저장/취소/잘못된 파일/정상 복원 확인
- 솔로/방장/클라이언트/개인전에서 일시정지·설정·입력 초기화·앱 전환/화면 잠금 후 복귀 확인
- 보급형/중급형 단말 30분 플레이, 4인 스킬 동시 사용과 간소화 켜기/끄기의 프레임률·메모리·발열·가독성 비교
- 실제 기기 2~4대로 참가/이탈/방장 종료/공유기 격리 환경 확인
- 저장 실패 시 결과 화면 유지 후 공간 확보/재시도와 1회 지급 확인

## APK와 스토어 제출

공개 APK는 기존 설치와 같은 테스트 서명입니다. 앱을 삭제하지 말고 업데이트 설치하고, 설정에서 파일 백업을 보관합니다.

CI의 `DungeonCrush-Unsigned-Store-AAB`는 release 모드의 **서명 전 번들**이며 그대로 제출할 수 없습니다. 운영자가 관리하는 업로드 키와 Play App Signing을 설정해야 합니다. 기존 테스트 키를 운영 키로 사용하지 않습니다. 스토어 앱 서명이 다르면 테스트 APK 위에 설치되지 않으므로 파일 백업으로 성장 기록을 옮깁니다.

실제 서명 키/계정 자격 증명은 저장소나 채팅에 넣지 말고 소유자가 관리하는 비밀 저장소와 Play Console에서 처리합니다. 스토어 제출에는 지원 이메일, 개인정보 안내의 최종 공개 URL, 콘텐츠 등급/대상 연령/데이터 보안 설문, 실제 최종 화면 이미지와 내부 테스트·사전 출시 보고서 검토가 필요합니다. `STORE-LISTING-KO.md`와 `PRIVACY-KO.md`를 준비 자료로 사용합니다.

정책 참고: https://support.google.com/googleplay/android-developer/answer/11926878 . 제출 당일 Console 요구사항을 다시 확인합니다.

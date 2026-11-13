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

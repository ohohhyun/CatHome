# 던전크러시 새 채팅 인수인계

이 파일을 먼저 읽고 `dungeon-crush/`만 이어서 작업하세요. 사용자에게는 한국어 존댓말을 사용하세요.

## 최신 공개 버전: 2.16.0 RC1 · 검증·공개 다운로드 완료

- **[APK 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.16.0-rc1/DungeonCrush-2.16.0.apk)** · [APK+설치 안내 ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.16.0-rc1/DungeonCrush-2.16.0-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.16.0-rc1). 로그인 없이 내려받을 수 있습니다. 카톡에는 파일 대신 APK 주소를 공유합니다. **기존 앱을 삭제하지 말고 업데이트 설치합니다.**
- **최신 사용자 지시: 보상은 매주 / 멀티 PK 점수·계급·시즌 전적 초기화는 2주마다.** 월요일 00:00 KST 기준이며, 다음 초기화는 2026-11-23 00:00 KST입니다. 초기화 전에 확정한 미수령 주간 보상·닉네임·유저 ID·성장·기존 랭킹 누적 기록은 유지합니다.
- 플레이 방식은 싱글 / 와이파이 멀티 / 와이파이 PK / 멀티 PK 4가지입니다. 멀티 PK는 **사용자가 명시 선택한 공유 코드·파일 방식, 서버 미연결 유지**입니다. 가까운 점수(±200)의 실제 유저 스냅샷을 찾아 AI가 조작합니다. 이전 시즌 스냅샷은 새 시즌 매칭에서 제외합니다.
- 설정에서 닉네임을 저장하고 실제 유저 이름 앞에 브론즈·실버·골드·다이아·마스터·챌린저 계급을 표시합니다. 기존 랭킹 메뉴와 5종 종목은 유지합니다. [게임 참고·대전/보상 규칙](release/PK-MODES-NOTES.md).
- 선택창 성채 회랑 배경과 투명 전신 원화 5장을 추가하고 엘리안 기존 원화를 유지했습니다. 눈높이~발바닥 기준 키는 카엘 100%, 린 108%, 베인 116%, 세라 92%, 아리아 84%, 엘리안 104%입니다. 선택·마을·전투·외형 30벌·미리보기에 적용합니다. 원래 점프 높이와 전투 수치를 보존합니다. [변경·검수 범위](release/CHARACTER-HEIGHT-NOTES.md).
- 미리보기는 걷기 없이 달리기·공격·점프·스킬 하나를 자동 반복합니다. 기존 모션 안정화도 유지합니다.
- 검증 소스 `8a864f446b599e352af240d5444f6f960804189e`. [전체 **61개 검사(코드28 + Java2 + Chrome31)**, APK/AAB·Android lint·기존 설치 서명·포함 자원 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43421801822). 날짜 경계·주간/2주 분리·재시작/저장 실패·정산 중복·장기 미접속 보존, 실제 두 유저 정보 공유→AI 전투→점수 정산, 전체 캐릭터/몬스터 모션과 UI를 확인했습니다. [검증 기록](release/2.16.0-VERIFICATION.json).
- APK **489,853,833 bytes**, SHA-256 `12ee6211943885413c294bd7427c34217497cff8ae7aabd9247807c5c7584ac4`. ZIP **489,854,880 bytes**, SHA-256 `3704f2ee0b8ba2841be1a556596b65731083a7490729451cd5f319c8dc2a6081`. [공개 게시·익명 전체 다운로드 검증 성공](https://github.com/ohohhyun/CatHome/actions/runs/43426684449): APK 전체 크기/해시, ZIP 전체 크기/해시/CRC/내부 APK 일치를 확인했습니다. 별도 익명 HEAD도 두 파일 모두 HTTP 200입니다.
- versionName 2.16.0 / versionCode 45 / 저장 형식 2 / Wi-Fi 프로토콜 10. 기존 설치 인증서 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`을 유지합니다.
- **남은 실기기 검수**: 실제 Android 44→45 업데이트와 저장 보존, 새 PK 파일 선택/클립보드, 2~4대 실제 Wi-Fi 기기, 장시간 FPS·발열·조작감. 실기기 검수를 완료했다고 표현하지 않습니다. 운영 서명/스토어 등록도 별도입니다. 서버·DB·실결제는 연결하지 않았습니다. 로컬 PK 점수·시간·공유 데이터는 서버 검증 기록이 아닙니다.
- 집사 사절 원본 보호 트리는 그대로입니다: root app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, root tests `07eea64ee955f5580a13a9f237490d346ceefe7a`. 이후 배포·문서 커밋은 검증한 앱 소스를 변경하지 않습니다.

## 2.15.2 RC1 공개 다운로드 완료

- [로그인 없는 APK ZIP 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.15.2-rc1/DungeonCrush-2.15.2-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.15.2-rc1). 카톡에는 파일 대신 이 링크를 공유합니다.
- 공개 ZIP 482,247,129 bytes / SHA-256 `6c17367f0a6cffbfc1328b568e5c48eee34c2c0e7c47d34eba9b816cd179ebfe`. [배포·익명 전체 다운로드 검증](https://github.com/ohohhyun/CatHome/actions/runs/43398285152) 성공: ZIP 전체 크기·해시·CRC와 내부 APK 해시 일치를 확인했습니다. 별도 익명 HEAD도 HTTP 200입니다.
- 앱 구현은 검증한 `44fddcf235bd1144ad933e1650290d847ae4fa17` 그대로이며, APK SHA-256은 `33803a1f8dc4d4abd569079d409d084cac0079f294a5140b725850f9ee08d95e`입니다. 버전 2.15.2 / 설치 버전 44 / 기존 서명을 유지합니다. 앱을 삭제하지 말고 업데이트 설치합니다.

## 이전 검증 빌드: 2.15.2 완료 · 미리보기 걷기 제거

- 사용자 요청으로 **미리보기의 걷기 구간과 안내 문구를 제거**했습니다. 달리기→공격→점프→기본 스킬 하나를 자동 반복하며, 짧은 대기를 포함한 주기는 9.7초입니다. 실제 게임의 이동과 이전 떨림 개선은 유지합니다.
- [APK ZIP 다운로드](https://github.com/ohohhyun/CatHome/actions/runs/43392615202/artifacts/14023301817) (GitHub 로그인 필요, Actions 보관 기간 30일). 압축을 풀고 기존 앱을 삭제하지 않은 채 업데이트 설치합니다.
- 검증 소스 `44fddcf235bd1144ad933e1650290d847ae4fa17`. [전체 57개 검사 및 APK/AAB·Android lint·기존 서명·포함 리소스 검증 통과](https://github.com/ohohhyun/CatHome/actions/runs/43392615202). 미리보기 자동 순환 중 걷기가 없고, 달리기·공격·점프·스킬과 반복 재생·저장 불변을 확인했습니다.
- APK 482,246,354 bytes / SHA-256 `33803a1f8dc4d4abd569079d409d084cac0079f294a5140b725850f9ee08d95e`. 빌드 manifest ZIP CRC와 버전 파일명을 확인했습니다. versionCode 44 / 저장 형식 2 / Wi-Fi 프로토콜 10, 기존 설치 서명을 유지합니다.
- 집사 사절 원본 보호 트리는 유지합니다. 현재 공개 릴리스는 위 2.15.2 RC1입니다. 아래 2.15.1 기록은 이전 빌드입니다.

## 이전 검증 빌드: 2.15.1 완료 · APK 제공

- [검증 APK ZIP 다운로드](https://github.com/ohohhyun/CatHome/actions/runs/43385971872/artifacts/14020027552) (GitHub 로그인 필요, Actions 보관 기간 30일). ZIP 안의 `DungeonCrush-2.15.1.apk`를 기존 앱 위에 업데이트 설치합니다. 앱을 삭제하지 않습니다.
- 검증 소스 `02c6d87d87bceab7a3175b1fe34d008675aa3c44`. [전체 57개 검사 통과](https://github.com/ohohhyun/CatHome/actions/runs/43385971872): 코드 26 + Java 2 + Chrome 29. APK/AAB·Android lint·기존 설치 서명·최종 포함 리소스까지 통과했습니다.
- APK 482,246,354 bytes / SHA-256 `fc97b1490514daf165040ef20261875ffa7cb501fdda2987c1ea0ba2f8532773`. 23개 분할 artifact의 CRC·SHA를 검증해 재조립한 APK의 크기·SHA·내부 ZIP CRC·새 미리보기/이동 스크립트 일치를 확인했습니다. 포함 서명 인증서도 기존 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`입니다.
- ‘동작’은 **미리보기**로 바꾸고 원화/미리보기 두 탭으로 간소화했습니다. 선택한 외형으로 걷기·달리기·공격·점프·기본 스킬 하나를 자동 반복합니다. 동작/스킬/방향/배율 선택을 제거했습니다.
- 기본 6직업·외형 30벌·몬스터 92종을 전수 점검했습니다. 추적 초과 이동과 빠른 방향 반전을 막고, 이동/대기 164개 은행의 1,424개 포즈 기준점을 보정했습니다. 전신 crossfade 잔상을 제거하고 로컬 표시 보간과 프레임 내 좌표 일관성을 보완했습니다. 원화 픽셀·몸 배율과 게임 수치는 유지합니다.
- [변경·검수 기록](release/MOTION-STABILITY-NOTES.md) · [검증 수치](release/MOTION-STABILITY-VERIFICATION.json). 실제 전투 가시 늑대 재현과 128개 캐릭터/몬스터의 양방향 이동/공격 30,720개 렌더 표본, 1,104개 추적 회귀 사례를 통과했습니다. 아래 원본 보호 트리는 그대로입니다.
- versionCode 43 / 저장 형식 2 / Wi-Fi 프로토콜 10. 서버·DB·실결제는 연결하지 않았습니다. 실제 Android 단말의 장시간 FPS·발열·조작감은 별도입니다.
- **현재 공개 릴리스는 아래 2.15.0 RC1을 유지합니다.** 2.15.1은 위 검증 빌드 artifact로 제공하며 새 공개 릴리스를 게시하지 않았습니다. 후속 문서/비교 화면 커밋은 앱 코드를 바꾸지 않습니다.

## 이전 공개 릴리스: 2.15.0 RC1 완료

- [APK ZIP 바로 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.15.0-rc1/DungeonCrush-2.15.0-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.15.0-rc1). 기존 앱을 삭제하지 말고 업데이트 설치합니다. versionCode 42 / 저장 형식 2 / Wi-Fi 프로토콜 10.
- 검증 소스 `f616e095a66be0d3d31c8e030d9022b3cad536e3`. [전체 55개 검사 통과](https://github.com/ohohhyun/CatHome/actions/runs/43366493827) — 코드 25 + Java 2 + Chrome 28. APK/AAB, Android lint, 기존 서명과 최종 포함 리소스도 통과했습니다.
- APK: 482231241 bytes, SHA-256 `e8af843d3462e8a28ebed202faeed6d7d787b392a77a22452e544a4aba8369ef`. ZIP: 484004107 bytes, SHA-256 `d463deeefc147a8fa370ab52dbd108fbcf8b61b83e1bd94b295e0b2147dbc49c`. 로그인 없는 전체 다운로드와 ZIP CRC, 안쪽 APK 크기/해시를 검증했습니다. [배포 작업](https://github.com/ohohhyun/CatHome/actions/runs/43379978484).
- 기본 캐릭터 6명과 외형 30벌 원화 36장을 확인했습니다. 30벌 모두 상점 장착/해제→맞는 선택창 원화→마을/전투 재진입 보존을 실제 UI로 검사하고, 몸 크기·하체·무기 경계와 모션을 비교했습니다. 두 차례 15분 이상 상점 전환 검사도 통과했습니다.
- 무료 테스트 구매만 지원하며 실제 결제/서버 연결은 없습니다. 실기기 장시간 FPS·발열, 스토어 업로드, 운영 서명은 별도입니다. 집사 사절 원본과 루트 앱은 수정하지 않았습니다.

## 이전 검증 버전: 2.14.1 RC1

- [APK ZIP 다운로드](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.14.1-rc1/DungeonCrush-2.14.1-RC1.zip) · [릴리스 페이지](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.14.1-rc1). 기존 앱을 삭제하지 않고 업데이트합니다. versionCode **41**, 저장 형식 **2**, Wi-Fi 프로토콜 **10**입니다.
- [30벌 크기 비교 화면](https://github.com/ohohhyun/CatHome/blob/6905dca217f0ac5d15f652a75b31f136e9e4eee8/dungeon-crush/release/SkinSize-2.14.1-Comparison.png)에서 기본 외형과 함께 확인할 수 있습니다.
- **유료 외형 30벌의 몸 크기를 기본 6직업과 대조하여 보정했습니다.** 장식·투구·무기 전체 높이로 몸을 추정하던 기준을 없애고, 확대 검수한 눈높이·부츠 접지점을 사용합니다. 대기/연계 공격 3단/시전은 각각 보정하고 이동·점프·대시는 대기 몸 기준을 공유합니다. [수정 내용](release/SKIN-SIZE-NOTES.md)
- 몸의 가로·세로 비율과 동작 안의 배율을 유지합니다. 원화 75개, 의상·무기·스킬 효과, 전투 수치·판정·속도는 바꾸지 않았습니다. 머리 위나 몸 바깥으로 돌출되는 장식 디자인은 유지합니다.
- 검증 소스 `4e48719605ffe8f1eecd055f152529ecdfe21e2c`. [전체 **52개 검사 통과**](https://github.com/ohohhyun/CatHome/actions/runs/43311412102): 코드 24 + Java 2 + Chrome 26. 실제 구매/장착/해제 후 30벌×5동작×양방향 몸 기준 300건, 모든 모션과 9스킬·펫·4인 통신·UI·저장을 확인한 뒤 APK/AAB·Android lint·기존 서명·포함 리소스를 검증했습니다.
- APK: 413,229,894 bytes, SHA256 `a43a0533140a05270115a650d583d78333d1665fd43cb4746d6187bd8b5b13c8`.
- ZIP: 413,320,142 bytes, SHA256 `264baa3a917d57c00dd66dfd2a6af6bcda592ca7f4e3aeedb0c782c47976da2c`. [공개 배포 검증](https://github.com/ohohhyun/CatHome/actions/runs/43315777693) 성공. 로그인 없이 공개 ZIP 전체를 내려받아 크기·SHA256·CRC와 내부 APK 일치도 확인했습니다.
- 상품은 계속 무료 테스트 구매이며 실제 결제는 연결하지 않았습니다. 집사 사절 원본과 서버/DB는 수정하지 않았습니다. 실제 단말의 장시간 FPS·발열 검사는 별도입니다.

## 이전 검증 버전: 2.14.0 RC1

- [APK ZIP 공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.14.0-rc1) → Assets → **DungeonCrush-2.14.0-RC1.zip**. versionCode 40. 기존 앱을 삭제하지 않고 업데이트합니다.
- 검증 소스 `e27860f1b70632c0a5edcc3cfc0d70542d4b2613`, [전체 51개 검사 성공](https://github.com/ohohhyun/CatHome/actions/runs/43292372306). 코드 24 + Java 통신 2 + Chrome 25개를 통과한 뒤 APK/AAB와 Android lint, 기존 서명·포함 원화/음원/스크립트를 검증했습니다.
- **6직업별 5벌씩 외형 30개, 펫 10종**과 외형·펫 상점을 추가했습니다. 크리스마스 외형 6벌/펫 2종과 5개 콘셉트의 더 큰 스킬 효과를 포함합니다. [변경 내용](release/PREMIUM-SHOP.md) · [참고 자료](release/PREMIUM-REFERENCES.md)
- 크리스마스 외 24벌은 용갑·달 의식 예복·수정 갑주·해군 외투·잠수복 등 의상과 무기 형태를 바꾼 48개 이동·공격 시트로 제작했습니다. 6직업의 크기·비율과 연속 모션 영상을 검수했습니다. 점프 미리보기 배율을 조정하고 30벌의 모든 점프 자세가 화면 안에 들어오는지 검사했습니다.
- 휴대폰 주요 버튼을 44px 이상으로 키우고 글자·장비 카드·메뉴 스크롤을 다듬었습니다. 외형 상점의 구매·장착·해제는 목록 스크롤과 분리해 항상 누를 수 있으며, 노치 여백·1.4배 글자·스크롤 후 실제 버튼 가림을 확인했습니다.
- 상품별 예정가 **9,900원**, 현재는 실제 청구·골드 소모 없는 **무료 테스트 구매**입니다. 구매/취소/모두 받기, 장착/해제·보유 표시, 저장/백업, 2,080개 신규 셀과 모든 외형의 모션/9스킬·실제 발동 300건·4인 외형 전달을 검사했습니다. 외형/펫은 능력치를 바꾸지 않습니다.
- 48던전·4정예 레이드·24배경, 기존 6직업 모션과 최대 100레벨, 기합 음량 25%·보스 음악, 판매 보호·되돌리기·백업을 유지합니다. Wi-Fi 프로토콜 **10**이므로 파티원 모두 업데이트합니다.
- APK: 413,225,877 bytes, SHA256 `8df16c4326ca22e1450ec449b5f3b0b2ae78fefe6b82f5c79532b1897b555bc0`.
- 공유 ZIP: 413,309,133 bytes, SHA256 `6cbd5e15a64ed237f3ee1a94d15ababd388fff5a6106f3c564e209b6ce9e9637`. [공개 배포 검증](https://github.com/ohohhyun/CatHome/actions/runs/43297288266) 성공. 로그인 없이 공개 ZIP 전체를 직접 내려받아 크기·SHA256·CRC와 내부 APK 일치도 확인했습니다.
- 집사 사절 원본과 서버/DB는 수정하지 않았습니다. 랭킹 연결은 꺼져 있고 endpoint/publicKey는 비어 있습니다. 실제 결제, 실제 단말 FPS·발열·조작감, 운영 서명·스토어 등록은 별도입니다.

## 이전 검증 버전: 2.13.0 RC1

- [APK ZIP 공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.13.0-rc1) → Assets → **DungeonCrush-2.13.0-RC1.zip**. versionCode 39. 기존 앱을 삭제하지 않고 업데이트합니다.
- 검증 소스 `7b3813ff519ec52effd1c201daae939835be333c`, [전체 47개 검사 성공](https://github.com/ohohhyun/CatHome/actions/runs/43162834939). 코드 22 + Java 통신 2 + Chrome 23개를 통과한 뒤 APK/AAB와 Android lint, 기존 서명·포함 원화/음원/스크립트를 검증했습니다.
- 16챕터·48던전, 100레벨 정예 레이드 4개, 신규 몬스터 20종/320포즈, 실제 전투 배경 24장, 적 지역별 효과 16계열을 포함합니다. [변경 내용](release/FRONTIER-NOTES.md)
- 2.12 저장과 최대 100레벨, 6직업 모션, 기합 음량 25%·보스 음악, 판매 보호·되돌리기·백업을 유지합니다. Wi-Fi 프로토콜 9이므로 파티원 모두 업데이트합니다.
- APK: 311,026,186 bytes, SHA256 `3576db3cb9ebfe12c080a5042b51e24732152e4326f09bd80e56f6e0c6578721`.
- 공유 ZIP: 311,094,327 bytes, SHA256 `c7c6a7e3f7557510b2bbdb36acdec8b3ed9a01ea7e3cde411cd2c8ecbb479cca`. [공개 배포 검증](https://github.com/ohohhyun/CatHome/actions/runs/43165066976) 성공.
- 집사 사절 원본과 서버/DB는 수정하지 않았습니다. 랭킹 연결은 꺼져 있고 endpoint/publicKey는 비어 있습니다. 실제 단말 FPS·발열·조작감과 운영 서명·스토어 등록은 별도입니다.

## 이전 검증 버전: 2.12.0 RC1

- [APK ZIP 공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.12.0-rc1) → Assets → DungeonCrush-2.12.0-RC1.zip. versionCode 38. 기존 앱을 지우지 않고 업데이트합니다.
- 검증 소스 `e75c2b59ba2a51f89a2f2445f4e87d11647236cf`, [전체 44개 검사 성공](https://github.com/ohohhyun/CatHome/actions/runs/43007690959).
- 6직업 기합 녹음 21개·새 효과음 15개·보스 루프곡·기본 25%의 독립 목소리 음량·보스 음악 전환/재개를 포함합니다.
- 마을 바로가기/UI, 착용 판매 보호, 기존 모션·성장·백업 기능을 유지합니다. 집사 사절 원본과 서버/DB를 변경하지 않았습니다. 랭킹 연결은 꺼져 있습니다.

## 프로젝트와 금지 범위

- GitHub: https://github.com/ohohhyun/CatHome
- 작업 브랜치: `codex/ashen-rift-apk`, PR #1. main에 병합하지 않습니다.
- 게임 소스는 `dungeon-crush/`, Android 패키지는 `com.dungeoncrush.game`입니다.
- 집사 사절 원본인 루트 `app/`, `legacy/`, 루트 Gradle/README/tests, Ground·BizRoot는 수정하지 않습니다.
- 원본 보호 트리: app `a70564ab782100b61cf07077e52753370e199045`, legacy `8bb4cd16f95ce641b3fa31296b021d8f976cb7e6`, tests `07eea64ee955f5580a13a9f237490d346ceefe7a`.
- main 기준 SHA: `3651e3d734e754a1a08f7bd62d031f40e4eef70c`.

## 현재 게임

6직업(카엘·린·베인·세라·아리아·프리스트 엘리안), 최대 100레벨, 16챕터·48던전, 던전별 몬스터/보스 외형, 60/80/100레벨 스킬 18종입니다. 100레벨 이후 전직은 아직 만들지 않습니다.
같은 Wi-Fi 협동과 30레벨부터 2~4인 개인전을 지원합니다. 개인전은 팀 없이 능력치·장비·기본 스킬을 보정하고 3라운드 중 2라운드 선승이며, 방장 연결 종료 시 취소합니다. 프로토콜은 10입니다.
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
- 새 검사 `tests/rankings.test.cjs`, `tests/rankings-presentation.test.cjs`. 전체 workflow는 JS 19, 네이티브 2, Chrome 21 = **42개**입니다. 기존 8개 화면/확대 글자 감사도 실행합니다.
- versionName 2.11.0 / versionCode 37. API 36, 기존 앱 서명, 프로토콜 8, 저장 형식 유지. 집사 사절 app/legacy/tests를 변경하지 않습니다.
- 새 파일 `rankings.js`, `ranking-ui.js`, `refinement.css`도 APK 포함 바이트 검사에 추가했습니다. 이전 네트워크·모션·판매 보호·저장 재시도 기능을 유지합니다.


- 후속 사용자 재확인: **‘연결해 하면 연결되게만 만들어놓으라고’**. 지금 서버 생성·연결은 금지하고 나중에 연결을 켤 수 있는 구조만 준비합니다.
- `ranking-config.js`가 단일 연결 설정입니다. JSON 호환 객체이며 enabled=false, endpoint/publicKey 빈 값으로 배포합니다. `ranking-client.js`는 설정을 켰을 때만 HTTPS GET, 종목/직업/조회 수, 공개 키/런타임 세션 토큰, 응답 크기·형식·상태·취소를 처리합니다.
- 일반 브라우저는 fetch, Android는 `RankingHttpClient`/Bridge의 읽기 전용 HTTPS 전송을 준비했습니다. Android도 같은 설정을 읽어 활성화된 호스트/포트/경로와 허용 쿼리만 조회합니다. 기본 설정에서는 네이티브 클라이언트도 생성하지 않습니다. 범용 파일 접근이나 저장소 출처 변경은 하지 않습니다.
- 네이티브 요청은 별도 실행기, 최대 8개 활성/대기 작업, 5초 연결/읽기 시간 제한, 리다이렉트 금지, 256KiB 응답 제한을 둡니다. 결과는 JSON으로 인코딩하고 취소/종료 시 연결을 닫습니다. 장기 토큰/운영 비밀 키는 앱 설정에 넣지 않습니다.
- 새 연결 검사 `tests/ranking-client.test.cjs`, `tests/RankingHttpClientTest.java`와 실제 화면의 설정 켜기/끄기-요청 규격 시험을 추가했습니다. 모든 원격 응답은 테스트 안에서만 대체하며 실제 서버 호출은 하지 않습니다. 성공 빌드 전에는 검증 완료로 표시하지 않습니다.


### 마을 메뉴와 전체 가독성 재검수

- 사용자 후속 지시: ‘텍스트겹치거나안보이는거체킹하고 다른게임들보고 유아이디자인좀 참고해 지금뭔가불편해’.
- `navigation.js`와 `refinement.css`로 마을에 원정/가방/스킬/상점/랭킹/메뉴 6개 바로가기를 추가했습니다. 원정은 지역 선택으로 바로 진입하고 정비 기능은 같은 기존 RPG 화면을 엽니다. NPC 접근과 포탈은 계속 동작합니다. 상점의 착용·잠금 보호/확인 판매 코드를 바꾸지 않았습니다.
- 전체 메뉴는 11개 기능과 마을 복귀로 구성하며, 화면/글자 확대에서는 메뉴 영역이 독립적으로 스크롤됩니다. Back/Escape/Tab 포커스, 메뉴 뒤 이동 중지, NPC 경로 취소, 전투 진입 중 닫기/전투 중 열기 방지를 포함합니다. 마을에서 중복 상단 메뉴와 전투용 회피/점프 버튼을 숨기고 겹치던 안내문을 상태줄 아래로 이동했습니다. 전투 조작 배치는 유지했습니다.
- `tests/navigation-presentation.test.cjs`는 9개 크기/가장자리 여백, 1.4배 글자, 실제 버튼 접근/동선, 서비스별 탭과 착용 판매 보호, 저장 불변/전투 제어를 검증합니다. 기존 inventory-ui 감사는 8개 화면에서 6직업과 전체 메뉴/전투 화면의 글자·아이콘 겹침 및 잘림을 검사합니다.
- 전체 workflow: JavaScript 19 + 네이티브 2 + Chrome 21 = 42개. `navigation.js`도 APK 포함 바이트 검사에 추가했습니다. 실제 휴대폰의 FPS/발열을 측정했다는 뜻은 아닙니다.

- 추가로 640×296 + 가장자리 여백 + 1.4배 글자에서 랭킹 목록 공간이 한 줄보다 작아지는 경우를 보완했습니다. 짧은 화면의 랭킹 본문은 필요한 만큼 스크롤되고 목록은 최소 높이를 확보합니다. 글로벌/개인 기록 모두 실제 글자 경계 감사로 검증합니다.


## 2.11.0 RC1 검증 배포 완료

- 검증 소스 `ed53dc8ad26d1b2b082f0a44d9d4e9925176dc2e`. [검증 빌드](https://github.com/ohohhyun/CatHome/actions/runs/42997397968): JavaScript 19개 + 네이티브 2개 + Chrome 21개 = **42개 자동 검사 통과**. Android lint, APK/AAB 빌드, 기존 서명과 포함 리소스도 확인했습니다. [ZIP 공개 검증](https://github.com/ohohhyun/CatHome/actions/runs/42999740790) 성공.
- APK `DungeonCrush-2.11.0.apk`: 237,697,239 bytes, SHA256 `8e884109b29dbcbc5e9f4c5d22ca2ffb2b4969c047d1a18079854bdcc05d5592`. versionCode 37, 기존 서명 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 유지.
- ZIP: [공개 다운로드](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.11.0-rc1), 237,747,748 bytes, SHA256 `1db02a3c201a362819cead19dc6dadf93aafd3fd686dd82c419b4de84194ca8b`. APK/설치 안내/인수인계/출시 점검표/개인정보/스토어 설명/랭킹 연결 규격/UI 참고 자료를 포함합니다. ZIP 내부 APK와 공개 asset 크기·digest 확인 성공.
- 실제 휴대폰 FPS·발열과 스토어 운영 서명·등록은 별도입니다. API 36 AAB는 서명 전 번들입니다.
- 집사 사절 원본 app/legacy/tests의 보호 트리 변경 없음.


## 2.12.0 사운드 보완 (versionCode 38)

- 사용자 지시: ‘기합소리같은거 자연스럽게 넣을수있냐? 스킬효과음이랑 먼가심심해’, 후속 ‘보스배경음도좀넣어줘’.
- CC0의 실제 공격 기합 녹음 21개(Brandon Song, cicifyre)와 직접 설계한 짧은 효과음 15개, Juhani Junkala의 Epic Boss Battle 루프를 오프라인으로 묶었습니다. `combat-audio-sources.json`에 원본/아카이브/출력 해시, 저자·라이선스·가공 내용을 기록합니다. `audio-source/*.ogg.b64`는 검증된 최종 파일이며 빌드 중 외부 음성 사이트에 의존하지 않습니다.
- `tools/render-combat-audio.py`는 유지보수용 원본 가져오기/효과음 렌더 도구입니다. 실행은 원본 ZIP/WAV와 ffmpeg가 필요합니다. 앱/CI 빌드는 `tools/fetch-audio.py`에서 base64와 SHA256을 검사해 디코드만 합니다. 기존 CC0 배경음/폴리는 기존 핀 해시 검증을 유지합니다.
- `sound.js`: 직업별 발사/적중/광역/회복/방어/궁극 효과음을 분리했습니다. 단일 기합 채널, 내 캐릭터 우선, 로컬 2.6초/원격 4.8초 간격, 일반 공격은 강한 연계 때만 확률 재생, 즉시 같은 샘플 반복 방지, 원격 거리 감쇠, 최대 10개 효과음+1개 목소리, 최대 30개 캐시 키/소리별 2개 재생기를 둡니다. 목소리 원래 음높이를 보존합니다.
- 공격 승인 시 `playerwind.owner`를 실제 플레이어 ID로 태그합니다. 게임 수치·판정·진행은 변경하지 않습니다. 사운드 관찰기는 상태를 읽기만 하며 동일 FX/스냅샷의 소리를 중복 재생하지 않습니다.
- 보스가 나타난 구역에서 전용 곡을 래치하고 550ms 페이드로 전환합니다. 보스가 죽은 뒤 잔여 적을 정리하는 동안 유지하며, 다음 일반 구역/새 원정/PVP/마을 전환을 처리합니다. 매 프레임 음악을 다시 시작하지 않습니다. 일시정지/음소거는 즉시 멈추고 다시 켜면 위치를 이어갑니다. 보스 음원 실패 시 일반 전투곡을 사용합니다.
- 설정에 기합·목소리 독립 음량을 추가했습니다(기본 25%). 기존 음악/효과음/설정을 읽고 새 기본값을 병합합니다. 기합 중 음악을 잠시 85%로 낮춰 가독성을 확보합니다. 전투/화면 전환·앱 중단 시 남은 효과음과 목소리를 정리합니다.
- 새 검사: `sound.test.cjs`, `sound-presentation.test.cjs`. 전체는 JavaScript 20 + 네이티브 2 + Chrome 22 = 44개입니다. 37개 실제 음원 디코딩/피크/무음, 6직업 실제 스킬 승인·발사·기합, 게임 상태 불변, 보스 음악 전환/재시작 방지/음소거·일시정지, 3개 화면 설정, 4인 동시 재생 상한을 검사합니다. 기존 글자 감사도 다시 수행합니다.
- 기존 APK 서명/API 36/프로토콜 8/저장 형식 2를 유지합니다. 랭킹 연결은 enabled=false 그대로이며 서버/DB를 만들지 않습니다. 집사 사절 app/legacy/tests 보호 트리를 변경하지 않습니다.

- 후속 사용자 지시 ‘기합소리를 좀 작게’: 기본 목소리를 25%로 낮추고 직업별 믹스도 줄였습니다. 기본 실제 재생 gain은 0.21 이하이며, 특히 베인의 큰 기합을 줄였습니다. 음성 중 음악 감소도 15%만 적용합니다. 목소리 슬라이더는 독립적으로 유지합니다.


## 2.12.0 RC1 검증 배포 완료

- 검증 소스 `e75c2b59ba2a51f89a2f2445f4e87d11647236cf`. [검증 빌드](https://github.com/ohohhyun/CatHome/actions/runs/43007690959): JavaScript 20 + 네이티브 2 + Chrome 22 = **44개 자동 검사 통과**. Android lint, APK/AAB, 기존 서명·최종 원화/음원/스크립트 확인도 통과했습니다. [ZIP 공개 검증](https://github.com/ohohhyun/CatHome/actions/runs/43009990794) 성공.
- APK `DungeonCrush-2.12.0.apk`: 239,928,970 bytes, SHA256 `d635ae849384be7c537da0c1feb554a6eb7b552016bbb26dc0c79e8414160ad6`. versionCode 38 / versionName 2.12.0, 기존 서명 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708` 유지.
- [공개 ZIP](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.12.0-rc1): 239,990,265 bytes, SHA256 `f88722237d479e44110897273e3611d491cb89cf26d86ed1f95d5f3abe78f635`. ZIP 내부 APK CRC/해시와 GitHub 공개 asset 크기·digest 일치 확인. 설치/인수인계/출시 점검/개인정보/스토어 설명/랭킹 연결/UI 참고/음원 출처 문서를 포함합니다.
- 실제 휴대폰 음향·Bluetooth 지연·FPS/발열과 운영 서명/Play 등록은 별도입니다. 집사 사절 app/legacy/tests 보호 트리를 유지했습니다.

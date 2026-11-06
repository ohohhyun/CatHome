# 던전크러시 2.1 패치 참고자료

집사 사절의 app, tests, Gradle 설정과 빌드 워크플로는 변경하지 않는다.
이번 작업은 dungeon-crush와 전용 APK 워크플로만 변경한다.

## UI / 플레이 흐름

- 던파 공식 캐릭터 생성 가이드: https://www.dfoneople.com/gameinfo/guide/Getting-Started/Character-Creation
- 던파 공식 캐릭터 생성 UI 개편: https://www.dfoneople.com/news/updates/2560/System-Update/Character-Creation-UI
- 던파 공식 시스템 UI 개편: https://www.dfoneople.com/news/updates/1622/SYSTEM/UI-Renewal

참고한 패턴: 타이틀 시작, 별도 캐릭터 선택과 직업 정보, 마을 정비, 콘텐츠/지역/난이도 선택, 전투 HUD 스킬 슬롯, 결과 정산 후 마을 복귀.
공식 게임의 원본 UI 이미지·스프라이트·캐릭터·음원을 복제하지 않는다.
새 세계관·직업·몬스터·진행 시스템은 추가하지 않는다. 기존 4직업과 저장 데이터를 유지한다.

## 모션 / 이펙트

기존 fighters/enemies 텍스처를 팔·무기·상체·다리로 나누어 관절 회전한다.
대기/이동/공격/점프/회피/피격/다운을 상태 및 공격 타이머와 연결한다.
기존 스킬 종류에 맞춰 베기 궤적, 직선 빔, 범위 파동, 잔상, 타격 파편, 각성 컷인을 표시한다.
이는 기존 그림의 런타임 컷아웃 애니메이션이다. 상용 게임 수준의 수작업 프레임 스프라이트가 아니다.

## 사운드

기존 CC0 BGM/SFX를 고정 커밋에서 받아 Git blob SHA로 검증하고 APK 안에 포함한다.
출처와 저자는 app/src/main/assets/audio/CREDITS.txt, 파일별 출처는 audio-sources.json 참조.
재생 중 인터넷 다운로드는 없다. 타이틀 시작 터치로 음악을 활성화한다.
배경 음악과 효과음 볼륨, 화면 흔들림을 별도로 저장한다. 앱 백그라운드 진입 시 재생을 중지한다.

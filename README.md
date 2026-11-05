# 집사 사절! · 퇴근길 대작전

집으로 가는 길, 달려드는 고양이에게 집사로 간택되는 것을 피하는 세로형 모바일 아케이드 게임입니다. 10개 골목을 모두 완료하면 **무한 모드**가 해금됩니다.

## APK 받기

이 저장소의 **Actions → Build installable APK → 가장 최근 성공한 실행**을 엽니다. 아래쪽 **Artifacts → CatHome-APK**를 내려받아 압축을 풀면 `app-debug.apk`가 있습니다. GitHub 로그인이 필요합니다.

휴대폰에 APK를 옮겨 설치합니다. 설치한 파일 앱에 '알 수 없는 앱 설치' 허용이 필요할 수 있습니다. 테스트용 APK이며 Play 스토어 배포용 서명은 아닙니다.

## Android Studio에서 열기

1. 이 페이지의 초록색 **Code → Download ZIP**을 눌러 압축을 풉니다.
2. Android Studio의 **Open**으로 `settings.gradle` 파일과 `app` 폴더가 들어 있는 폴더를 엽니다.
3. **Trust Project**를 선택하고 Gradle Sync를 기다립니다. 처음에는 인터넷으로 도구를 받습니다.
4. SDK 설치가 필요하다고 나오면 Android SDK 35 설치를 허용합니다. Gradle JVM은 Android Studio의 내장 JDK 17 이상을 사용합니다.
5. **Build → Generate App Bundles or APKs → Generate APKs** 또는 버전에 따라 **Build APK(s)** 실행.
6. `app/build/outputs/apk/debug/app-debug.apk`가 생성됩니다.

Windows 터미널에서는 프로젝트 폴더에서 `gradlew.bat assembleDebug`를 실행할 수도 있습니다. 기본 Android Studio 설치 경로의 내장 Java를 사용하며, 다른 위치에 설치했다면 `JAVA_HOME`을 맞춰야 합니다.

## 바로 플레이

`app/src/main/assets/index.html`을 브라우저로 열어 실행합니다. 게임은 외부 리소스나 서버 없이 한 파일로 동작하며 Android 앱에도 그대로 포함됩니다.

- 좌우 버튼 한 번 탭: 한 차선 이동. 게임 화면 좌우 스와이프도 지원합니다.
- 가운데 **슬쩍!**: 0.7초 회피, 재사용 대기시간 6초.
- PC: 방향키 또는 A/D 이동, Space 슬쩍 회피, Esc 일시 정지.
- 각 골목에서 세 번 간택되면 같은 단계부터 재도전합니다.
- 아슬아슬 회피 보너스, 연속 회피 콤보, 5콤보마다 배수 증가(최대 5배), 동전 점수가 있습니다.
- 고양이에게 닿지 않고 통과하면 별 3개, 한 번 닿으면 2개, 두 번 닿으면 1개를 기록합니다.
- 10단계 엔딩에서 무한 모드로 바로 진입합니다. 이후 메인 화면에서도 선택할 수 있습니다.
- 무한 모드에서는 18초마다 난도가 증가합니다. 속도와 생성 주기는 최대/최소 한도가 있습니다.
- 진행도, 별, 최고기록은 기기에 저장합니다. 앱/브라우저 데이터를 지우면 초기화됩니다.
- 앱을 떠나면 자동 일시 정지. 소리 버튼으로 효과음을 켭니다.

## 검증 및 현재 상태

`node tests/game.test.cjs`로 캠페인 10단계, 무한 해금, 최고기록 복원, 충돌, 회피, 콤보, 생성 패턴을 검사합니다. GitHub Actions는 이 검사와 Android APK 컴파일을 수행합니다. 실제 Android 기기에서 터치감·화면 배치·소리·성능은 추가 확인이 필요합니다. 상용 게임과 동등한 품질로 검증된 상태는 아닙니다.

Android 6.0 이상을 대상으로 하며 인터넷 권한, 광고, 계정 또는 서버가 없습니다.

## 빌드 구성

Gradle 8.9, Android Gradle Plugin 8.7.3, compile/target SDK 35. Gradle Wrapper JAR는 Gradle 공식 저장소의 v8.9.0에서 가져왔으며 JAR 안에 라이선스가 포함되어 있습니다. SHA-256: `498495120a03b9a6ab5d155f5de3c8f0d986a449153702fb80fc80e134484f17`.

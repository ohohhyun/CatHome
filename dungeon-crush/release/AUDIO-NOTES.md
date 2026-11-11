# 기합 · 스킬 효과음 · 보스 음악

설정의 **기합·목소리**를 0%로 내리면 목소리만 끌 수 있습니다. 배경 음악과 효과음은 별도로 조절합니다. 모든 음원은 APK에 포함되어 인터넷 연결 없이 재생됩니다.

6직업에 맞춰 짧은 공격 기합을 배치했습니다. 같은 소리는 바로 연속해서 나오지 않으며, 일반 공격에서는 강한 연계 동작 때만 가끔 재생됩니다. 내 캐릭터의 목소리를 우선하고 멀리 있는 파티원의 소리는 줄입니다. 기합이 겹치거나 공격마다 반복되지 않도록 간격과 동시 재생 수를 제한했습니다.

검격·창·격투·총성·불·얼음·번개·성광·치유·방어·궁극 효과음을 구분하고 시전/발사/적중에 맞췄습니다. 보스가 등장한 구역에서는 전용 루프 음악으로 0.55초 동안 부드럽게 전환합니다. 일시정지와 음소거를 풀면 같은 음악 위치에서 이어지고, 마을로 돌아가면 마을 음악으로 바뀝니다.

## 사용 음원과 출처

- [Voice Clip Pack - Male Adventurer RPG](https://opengameart.org/content/voice-clip-pack-male-adventurer-rpg): Brandon Song / wolfwoot, CC0. 짧은 공격 녹음만 선택했습니다.
- [Female RPG Voice Starter Pack](https://opengameart.org/content/female-rpg-voice-starter-pack): cicifyre, CC0. 세 가지 톤의 비언어적 공격 기합을 선택했습니다. 영어 마법 이름이나 사망 비명은 사용하지 않았습니다.
- [Epic Boss Battle — Boss Battle Music](https://opengameart.org/content/boss-battle-music): Juhani Junkala / SubspaceAudio, CC0. 원래의 연속 루프를 유지하고 음량을 낮춰 Ogg Vorbis로 묶었습니다.
- 짧은 효과음 15개: Dungeon Crush의 필터 노이즈·검풍·타격·성속성 울림 설계, CC0. 새 음악이나 합성 음성은 만들지 않았습니다.

기합은 실제 녹음 파일입니다. 원래 음높이를 유지하고 앞뒤 여백, 음량과 짧은 경계 페이드만 다듬었습니다. 출처·원본 아카이브와 출력 파일의 정확한 해시는 `combat-audio-sources.json`, 전체 기존 음원 크레딧은 앱에 포함된 `audio/CREDITS.txt`에 있습니다.

자동 검사는 실제 음원 디코딩·무음/피크, 6직업 스킬의 효과음과 기합, 보스 전환/연속 재생/음소거/일시정지, 작은 화면의 설정 및 4인 재생 상한을 확인합니다. 실제 휴대폰 스피커/이어폰/블루투스의 음색과 지연은 단말에서 확인해야 합니다.

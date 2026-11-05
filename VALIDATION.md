# 2.0 validation

Local checks passed:

- JavaScript syntax and all 24 dungeons at all four difficulties through five-room progression.
- Door entry after room clear, co-op revival, telegraphs, dodge/jump/shield, skill gates/resources, deterministic simulation and bounded effects.
- Population and HP scaling across 1/2/3/4 players and all difficulties; downscaling after a peer leaves.
- Persistent v1→v2 migration and reload, all 24 story quests to level 60, advancement and awakening, mastery and repeatable rift unlocks.
- Reward ID deduplication, epic pity, equipment stats and sets, enhancement, protected dismantling, targeted crafting, SP budgets/reset, entry gates and material charges, daily/weekly bonuses and party reward differences.

CI is configured to additionally verify:

- Actual native TCP host + three clients, pairing/capacity rejection, UTF-8/large packets and disconnect.
- Four browser clients with Android bridge simulation: mobile multi-touch movement/attack, clear→quest report→level unlock, equip/skill growth and reload, party entry gates and monster scaling, live movement, pause, persistent rewards, party town return and a subsequent dungeon.
- Android SDK 35 compilation, APK signature and manifest inspection.

Consult the matching workflow result before claiming CI passed for a particular commit. Actual Android installation, native Wi-Fi on physical phones, Android SharedPreferences behavior on-device, long-session performance and human pacing/balance remain unverified here. The browser bridge test does not emulate Android networking or storage internals.

Only ohohhyun/CatHome is in scope. The original CatHome v0.7 source remains in legacy/cathome-0.7/.

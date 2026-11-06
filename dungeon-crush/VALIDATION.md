# 2.1 validation

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

## App identity separation correction

The Dungeon Crush now uses com.dungeoncrush.game. Original CatHome remains com.cathome.game on main. CI verifies the compiled package name and launch activity, does not build the original game. Previous 1.0/2.0 AshenRift APKs used the original app ID and could replace it on a phone; do not distribute those as coexistence builds. A separate package does not automatically import the previous shared package's save data. Physical coexistence/recovery/data restoration remains unverified on a real phone.


## Presentation regression coverage

- Title → character selection → town → content → stage/difficulty → combat, back navigation and locked raid requirements.
- Existing character selection persists after reload; compact landscape primary actions remain in view.
- Independent arm/leg joint angles change during running; screenshots capture four class skills plus movement/jump.
- Existing bundled music decodes and advances playback, town/battle track changes, pause/resume and independently saved music/SFX volumes.
- Actual phone Wi-Fi co-op, audio hardware behavior, visual quality and performance across devices still require physical testing.


## 2.1.1 layout regression

The layout suite covers 1280×591 (reported phone screenshot), 1280×580/581, 960×480, 740×360, 640×320, 640×296 (1280×592 at 2× device scale), 1024×768, 1920×1080 and simulated notch/navigation insets. It measures complete text bounds for all four classes, six skill labels, title footer/start CTA, character confirmation, town tabs, inventory, skills, forge, stage/difficulty and sound settings. Title name/start move to the right. Height-aware grid rows and scrollable information panels keep the confirmation/entry controls in view.


## 2.2 combat presentation and caster timing

The caster suite checks every difficulty and party size: 1.35s fixed warning, minimum 3.4s recast, staggered same-target spells, fixed ground markers, walking out, player-hit interruption and delayed damage. It also checks acceleration/braking and distance-driven gait. The presentation suite decodes all 24 real SVG icons, measures one-row skill HUD area (<5.5% at tested sizes), verifies 36px+ controls and attack-button separation, captures running and four class effects, and tests the visible caster warning/dodge. Existing layout, progression and four-client LAN coverage remain enabled. These automated captures do not establish commercial-art animation quality or replace physical-device testing.


## 2.3 ranged combat and slower enemy attacks

The ranged suite verifies real projectile flight/collision at 800+ distance in both directions, no instant damage, maximum range, lane aim, first-hit/piercing limits, remote blast/rift/chain/ultimate and remote pull centers. Swept collision and serialized deterministic state are covered. All four enemy types are checked across four difficulties and 1–4 players for minimum warnings and recovery. Caster orbs launch after the warning, travel at a fixed slow speed and never home. Browser tests capture visible bullets and remote spell impacts without moving the shooter; four-client LAN tests verify a guest's projectile and damage arriving through host snapshots. Existing progression/layout/audio tests stay enabled.

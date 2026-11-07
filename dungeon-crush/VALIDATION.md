# 2.9.5 equipment actions, comparisons and town NPCs — verified APK

Source `cc5f9b68d3d076718240b87a01dca4b3d919e7e5`; [build 42320234613](https://github.com/ohohhyun/CatHome/actions/runs/42320234613) and [publisher 42321133132](https://github.com/ohohhyun/CatHome/actions/runs/42321133132) passed. [Share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.5/DungeonCrush-2.9.5-Share.zip): 99175820 bytes, SHA256 `4b4afcb6fa99ab353dd59ac2dd580dcfaf39343c73c422e84ffced864e55f584`. APK: 99174988 bytes, SHA256 `85bc369b6197324d6a3a08a68a7b6147bb3057ad50b42edafb4c329289262431`. VersionCode 25 / 2.9.5-town-equipment; com.dungeoncrush.game and unchanged signer e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708. 13 JavaScript suites, native host + 3 actual TCP peers, 15 Chromium scenarios, compiled identity/signature/art/font/source verification and every public asset size/digest check passed. All 38 original CatHome protected files and app/legacy/tests Git subtrees are unchanged; the PR remains open and this patch does not update main.

Equipment slot taps unequip immediately; bag taps equip/replace and retain the previous item. A real touch hold/release or the explicit detail button previews without mutating equipment. Description dialogs explain slots/options, compare equipped and selected gear and calculate replacement deltas with actual set bonuses and power. Empty slots survive serialization/reload and Android Back closes the top inspection before the underlying inventory.

Three generated, alpha-preserving NPCs are bundled offline with the original PNG and exact runtime hashes in generated-art-sources.json. Clicking a resident approaches them before opening merchant, blacksmith or training services; manual movement/jump/dash cancels approach. Header service buttons and inventory forge/salvage actions lead through residents. Merchant purchases use the current level and validated slot/normal-or-magic grade, preserve equipped items and check gold/capacity. Sales require confirmation and reject worn/locked/missing items; existing crafting/enhancement/salvage/training rules are retained.

New pure-rule tests cover six-slot unequip and reload, replacement, set-aware immutable comparisons matching the actual final profile, invalid grades/slots/funds/capacity, level limits and worn/locked/double-sale guards. New real Chromium tests cover taps, physical touch hold/release, Android Back, NPC decoding/approach/cancel, purchase and confirmed sale, enhancement/training and three comparison viewports. The text/art audit now covers inspection dialogs plus shops/salvage at all eight screen/inset conditions. Original combat/motion assets and protected CatHome files remain unchanged. Physical phones and long sessions remain separate validation.

---

# 2.9.4 inventory and global text — verified APK

Source `7a3c8b0709b312f08dcf278ccf882b2f2c00cd56`; [build 42292102026](https://github.com/ohohhyun/CatHome/actions/runs/42292102026) and [publisher 42293083861](https://github.com/ohohhyun/CatHome/actions/runs/42293083861) succeeded. [Share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.4/DungeonCrush-2.9.4-Share.zip): 98660856 bytes, SHA256 `62c0bbabd1473288ef12ff51055ee67f19ded407003fd59efae3000397ffe97f`. APK: 98660024 bytes, SHA256 `ec0276be6f1cb86ca3e0eadf9524a46f92ddcb2fbf3c43f6af8499269d69b556`. VersionCode 24 / 2.9.4-inventory-ui, com.dungeoncrush.game, unchanged signer `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`. 12 JavaScript suites, native host + 3 actual TCP peers, 14 Chromium scenarios, APK identity/signature/art/font verification and public asset size/digest checks passed. All 38 protected original CatHome files and original app/legacy/tests Git subtrees are unchanged. PR stays open; this patch does not update main.

Equipped items use a left-side panel, explicit checkmarked worn badges and a distinct card treatment. Status/art/name/metadata use separate normal-flow rows. Enhancement is attached to the slot/item name, never the worn badge. Slot/rarity/worn filters, four sort keys and ascending/descending directions operate on a copied view; saved item order and equipment state are unchanged. Filter changes reset the page, equipped selection locates its page, empty results clear the detail, and enhancement refreshes the selected item. New tabs reset their scroll while same-view updates preserve it.

Responsive inventory panels, normal-flow HP/name/party rows, wrapping modal labels, a true town footer, world nameplates clear of each other, character silhouettes, HUD and controls and notices clear of action controls address discovered text collisions. Artwork and motion scales/physics are retained. The bundled Noto Sans CJK KR font now covers all 11172 modern Hangul syllables, old UI symbols and arrows; the original source font license is retained. The mastery EXP label explicitly uses the bundled font instead of an unavailable system fallback. Font SHA and glyph mapping checks cover all Korean text in scripts/HTML/CSS. APK verification also checks exact font and new UI layout script bytes.

New browser audits cover title/four classes, town and every main modal/tab, content/stages, long-name four-player lobby/HUD, pause and results at eight sizes/insets. They inspect glyph boxes, text-to-text and artwork-to-text intersections, scroll ends, worn badges, name suffixes, grade/slot/worn filtering, both sorting directions, empty results, real ring enhancement and unchanged saved item order. World nameplate placement has deterministic unit and live browser bounds/collision checks including bodies, buttons, joystick and departing/reappearing offscreen peers; it only reads current-frame render coordinates and never advances movement smoothing; active battle notices cannot cover the action controls. Captures are test characters with long counters. Physical Android phone installation, actual phone-to-phone Wi-Fi and long-session performance remain separate.

---

# 2.9.3 action size normalization — verified APK

Published by [release workflow 42269243724](https://github.com/ohohhyun/CatHome/actions/runs/42269243724). The public APK, share ZIP, recording and all four comparison PNGs have the same byte counts and SHA256 digests as the locally verified files. [Download share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.3/DungeonCrush-2.9.3-Share.zip).

Source `e5bdabc767cdf46c796b886ad8cd6a80f2a8e98a`; [successful build 42267804355](https://github.com/ohohhyun/CatHome/actions/runs/42267804355). Nine JavaScript suites, real native TCP host plus three clients, thirteen Chromium scenarios, APK identity/signer and exact embedded presentation bytes passed. Original app/legacy/tests Git subtrees and 38 protected local files remain unchanged.

APK versionCode 23 / versionName 2.9.3-body-scale, 97297331 bytes, SHA256 `929d96f7551f2311da85e2fd4e7100fc43da2c5aa5bcde97a3dc253b7aefbc6d`. Reconstructed download parts match the build manifest. Local APK CRC, compiled package/activity/label, retained signing certificate and every embedded presentation script/image were checked. The share ZIP contains exactly that APK and UTF-8 installation notes, 97298072 bytes, SHA256 `4a5f3b8c56a7a76d54990c39573cbcbcc31f6193425eebffe54cc3788cf8b981`. The movement recording is 65.60 seconds / 7908983 bytes / SHA256 `11591c7198249c7b29e317f091ac253e7e00290f0ee9f140ffb42ab391bde1ad`.

The new 2.9.2 run artwork has larger anatomical head/torso proportions than the retained attack/cast/mobility/reaction art. Equal reference heights therefore did not mean equal character body sizes. The run composite now has reviewed per-class scales of 0.76/0.76/0.78/0.67 about the shared ground origin. Both clipped run layers receive the same transform. Other pose scales stay at 1; movement, gait timing, jump rise and collision state remain unchanged. All original/runtime artwork bytes are retained.

The new Chromium comparison renders all four classes in idle/run/three basic attack stages/cast/jump/dash at the same caller height. It records actual Canvas transforms and grounded origins, and repeats transitions in both directions at every run phase to catch scale leakage/history overshoot. Before/after captures accompany the existing body-pixel, cold mobility, combat, layout and LAN checks. Physical phone testing remains separate.

---

# 2.9.2 coherent movement — verified APK

Published by [release workflow 42265363981](https://github.com/ohohhyun/CatHome/actions/runs/42265363981). Public APK, share ZIP and motion recording byte counts and SHA256 digests match the locally verified files. [Download share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.2/DungeonCrush-2.9.2-Share.zip).

Source `3c349808e78f76f5a9f81da84200f9cf6e052a19`; [successful build 42264284734](https://github.com/ohohhyun/CatHome/actions/runs/42264284734). Nine JavaScript suites, native TCP host plus three clients, twelve Chromium scenarios and APK identity/art/signer checks passed.

APK: versionCode 22 / versionName 2.9.2-coherent-motion, 97297283 bytes, SHA256 `bcfb46ded4606ad6b627b67224de3401f4ad1aa7fefb1563f633b062b4094b8b`. Dedicated package/activity/label and signing certificate are unchanged. Locally reconstructed parts match the build manifest; ZIP CRC, embedded exact scripts/art and compiled Android identity are verified. Share ZIP: 97298024 bytes, SHA256 `070dee3f94971f9e3e800d80f57d86f84592b36c0326e3b257486dbded0e5f7c`, exactly the verified APK and UTF-8 installation notes. The movement recording is 50.88 seconds, 6412739 bytes, SHA256 `e27802a8188a3fe0c60e33bec156a9cac2f9ba414331e326972e9ca5316be06d`.

Original app/legacy/tests Git subtrees and 38 protected local files remain unchanged. Root CatHome settings and main are untouched.

This supersedes the ineffective 2.9.1 run registration. A single eight-pose source atlas per class replaces mixed run sources, with one fixed upper-body layer and animated lower body. Dedicated original eight-pose jump and four held dash poses replace mixed intermediates. Display state follows actual dash/jump timers. Per-render finite-difference acceleration has been removed.

Participating classes' run/jump/dash and all idle/reaction banks are prepared and pinned. The own character's starter combo/cast banks are pinned too, so eviction cannot close the input-readiness gate. Battle reveal waits for critical assets and pauses simulation during loading. The old animated player rig is no longer used during a missing authored pose.

The active pose count is 496, not 704. Incorrect/interleaved locomotion poses have been removed rather than counted as quality. Four new original PNGs are preserved unchanged; runtime lossless WebP decodes identically. Sixteen superseded locomotion atlases are archived but excluded from the APK. Existing combat/effect timings and saved progression remain.

New production-mode Chromium checks exercise the first moving jump and dash for every class in town and battle, facing both directions. Actual rendered upper-body screenshot pixels are identical across all eight running phases while lower-body pixels change. A four-class enemy/combat cache-pressure case checks critical retention. These tests do not call preloadAll(). Existing real combat, dead-caster cancellation, four-player protocol, ranged collisions, potion, XP and mobile layout regressions also remain mandatory.

Physical Android installation, phone-to-phone Wi-Fi, frame pacing and long sessions require device testing. The provided recording is automated browser gameplay.

---

# 2.9.1 run and cast fixes

Published by [release workflow 42252938506](https://github.com/ohohhyun/CatHome/actions/runs/42252938506). ZIP SHA256: `16f0ba6ac027e1ff6e180fdafb46405235e9d2682f6b3460932a9328fc9be077`.

Source `d13dd641b9e76096e7aa1035153f133514fecce0`; [successful build 42251175699](https://github.com/ohohhyun/CatHome/actions/runs/42251175699). Signed APK versionCode 21 / versionName 2.9.1-run-fix; package, activity, app label and signing certificate remain the dedicated Dungeon Crush identity.

- Nine JavaScript suites, real native TCP host plus three clients, and eleven Chromium scenarios passed. Existing ten-size layout, party XP persistence, potion, ranged collision, campaign and deterministic combat regressions remain covered.
- Running now groups the existing 24 registered crops into one stride with two footfalls per 320 world units. Registered head/root coordinates stay stable across source sheets. Acceleration lean, cruise and stop recovery, heading during reversal and immutable display state are checked.
- Production browser tests cover all four classes during start/cruise/stop/reverse/dodge. They assert one body render per frame, no invulnerability opacity strobe, normal on-demand loading, no page errors and a recorded actual gameplay video.
- Wider regular skill images, 0.9-second regular spell effects and 1.8-second ultimates are checked. Actual browser screenshots retain the ultimate over one second after release. A crowded FX list cannot immediately evict the ultimate.
- Real knight/caster/brute/boss casts are killed during windup in unit tests. Pending warnings, owned enemy projectiles and source windup graphics disappear; player HP does not drop later. Stale serialized casts with absent owners cannot fire. The browser repeats boss/caster deaths during real casts.
- All approved source/runtime artwork bytes are unchanged from 2.9. APK CRC, exact script/image bytes, compiled identity, version and apksigner checks passed. Certificate SHA256: e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708.
- Original app/legacy/tests Git subtrees and 38 protected files remain unchanged. Only Dungeon Crush and its dedicated workflows are patched; main is not merged or updated.

APK: 109023951 bytes, SHA256 ce53438ce46971d57f2b7a8ad4e99f4bbf2d1e4edd9763632667233535dccc98. The share ZIP contains exactly that signed APK and installation instructions; ZIP CRC and embedded APK hash are verified. Public release digests match the locally checked files.

Physical phone installation, phone-to-phone Wi-Fi, perceived frame pacing and long-session performance still require device testing. The supplied recording is automated browser gameplay.

---

# 2.9 verified presentation release

Final source: `2c655234b41c1dbbb13e60705b0e2899e9c6920a`. Successful build: [42236159924](https://github.com/ohohhyun/CatHome/actions/runs/42236159924). Direct signed APK: [DungeonCrush-2.9.apk](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9/DungeonCrush-2.9.apk).

Published by [release workflow 42237289644](https://github.com/ohohhyun/CatHome/actions/runs/42237289644). The public release APK size and SHA256 digest match the locally verified signed artifact.

- CI passed eight JavaScript suites, the real native TCP host plus three clients, and ten Chromium presentation/protocol scenarios. The layout suite covers ten landscape/tablet sizes including the reported 1280×591 clipping case, compact controls, safe-area insets and Korean text.
- All seven principal motions per class use 24 unique authored crops. Runtime drawing includes 704 character poses, 192 monster poses, 192 retained individual spell cels, 32 new ultimate cels, 24 painted skill icons and 30 equipment/resource icons.
- All 101 new runtime atlases and their 101 original PNG sources were checked by SHA256 and Git blob identity. Alpha encoding is exact; opaque RGB PSNR is at least 35 dB, with lossless fallback below that threshold. Bounded crops, contact timing and immutable LAN presentation are checked.
- New and old four-class motion comparison, all real held combos, all 24 skills, jump, running, ranged collisions, enemy telegraphs and recorded combat passed in Chromium. The title/footer now both display 2.9.
- Four browser peers passed shared kill XP persistence/reload/settlement deduplication, own-only dealt damage text, remote short-tap potions, 50% maximum HP healing, 180-second cooldown, readable HP, illustrated inventory/forge and 14 decoded combat Foley clips.
- Android build, ZIP CRC, compiled package/activity/label/version, exact packaged image/script hashes and apksigner verification passed. Version code is 20; package is `com.dungeoncrush.game`; label is `던전크러시!`; certificate SHA256 is `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`, matching 2.8.
- The installed APK was reconstructed from six individually checksummed artifact chunks for local verification. It is the original signed build output, without rebuilding or repacking. Final APK: 109022767 bytes; SHA256 `e3120a47911a8c3ff9da1c6bb57f285bc999add3d678ca41751b90b2da81db61`.
- Original app/legacy/tests Git subtrees and 38 protected original files match the pre-patch snapshot. Changes are limited to Dungeon Crush and its two dedicated workflows. Main was not merged or updated by this task.

Actual physical Android installation, phone-to-phone Wi-Fi, device audio hardware and long-session performance were not exercised in this environment. Frame counts and automated tests do not establish an objective percentage of Dungeon & Fighter's commercial production quality. The supplied comparison and combat recordings are browser captures.

---

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


## 2.4 walkable town, controls and camera

Unit coverage checks shared town/combat movement, simultaneous move+jump/dodge, town bounds without dungeon progression, immediate camera follow and foreground/distant layer offsets. Browser coverage starts at the town entrance, rejects portal entry from afar, uses actual two-finger mobile input and releases the right finger while keeping movement active, walks to and taps the end portal, selects a stage, then repeats movement/jump/dodge in combat. It checks actual ground pixel changes under camera movement and icon-only, nonoverlapping controls at 1280×591, 960×480 and 640×296 with safe-area insets. Older layout/party/ranged suites arrange at the portal for entry; the navigation suite exercises the actual full walk.


## 2.5 camera and locomotion regression

- Unit checks cover central screen position at town/dungeon spawn and both world edges, movement and reversal, class speed/acceleration/braking, distance-driven stance and swing, finite two-bone poses for all four classes, continuous dodge displacement/distance at 30/60/120 Hz, and jump landing.
- Browser checks cover the real portal flow and independent two-finger controls, centred dungeon spawn/reversal/dodge and actual scrolling pixels. Four-class contact/passing/flight/jump previews are uploaded with navigation previews.
- Ranged attacks, slow non-homing enemy projectiles, difficulty/party counts, deterministic combat and saves retain their existing regression suites. Protocol 4 requires the same 2.5 build on every party phone.
- Existing artwork remains a runtime cutout rig; there are no new hand-drawn animation frames. Physical phone play, subjective animation quality and sustained frame rate still need on-device evaluation.


## 2.6 generated artwork regression

- Seven original image_gen PNG outputs are tracked without pixel edits. Their SHA-256 hashes, dimensions, frame counts and provenance are recorded in generated-art-sources.json. All 80 actor crop rectangles fit their actual source image; uniform scaling and authored foot baselines avoid stretching and neighboring-cell fragments.
- Frame selection is tested for running by distance, basic/skill timers, jump/landing and down state. The four original class designs have 20 full-body frames each; three VFX flipbooks have 16 frames each.
- Browser CI verifies all seven images decode, generated bodies and painted effects are actually drawn in live combat, four basic attacks/four area skills/healing and five four-class pose previews. Dedicated GPT-Art previews are uploaded.
- Existing camera, touch, ranged travel/collision, slow enemy windups/orbs, deterministic combat, save progression and native/browser four-player suites remain required. Source and asset hashes are checked again against the downloadable APK. Actual phone performance/appearance and physical Wi-Fi play remain outside this environment's verification.


## 2.7 combat timing and presentation

- Original PNGs and lossless WebP counterparts are hashed; local authoring compares decoded RGBA byte-for-byte. Atlas bounds cover 208 active character cels and 24 distinct eight-frame skill flipbooks. Browser tests preload/decode all banks; production lazily loads role banks and caches only idle rows.
- Deterministic tests verify damage/muzzle release waits for windup, no repeated hit per frame, three distinct combo stages, released-tap buffering, dodge cancellation and one-time resource cost, continuous skill rush, knockback/contact hold, split-damage two-barrel finisher, serialized pending/buffer state and non-mutating client animation interpolation.
- Full browser input runs capture movement/jumps, held three-stage combos and all 24 skills, including defenses/healing. A live combat WebM is recorded. Whole-pose transitions check stale afterimages never address another sheet's frame bounds.
- Existing campaign/save/scaling/caster/ranged/navigation/multitouch/mobile layout/native TCP/browser four-player checks remain required. APK verification checks all packaged asset hashes and scripts against source, exact app identity/install version and signature. Physical phone performance and subjective smoothness remain outside this environment's checks.

# 2.10.1 최종 검증

검증 소스 `5501e808bc9a02f3b8b709a09891c348df6f7631`의 [전체 빌드](https://github.com/ohohhyun/CatHome/actions/runs/42441280165)와 [배포 검증](https://github.com/ohohhyun/CatHome/actions/runs/42442430463)이 성공했으며 공개 APK·ZIP·인수인계 파일의 크기와 SHA를 로컬 검증본과 비교했습니다.

- **35개 통과:** JavaScript 16개, 실제 Java TCP 4인 연결 1개, Chrome 18개. 로그의 PASS 줄도 35개입니다.
- 실제 원화를 디코딩하여 72종 walk/attack 방향을 양쪽 및 idle/walk/windup/recover에서 검사했습니다. 원화 해시와 방향 기록을 함께 보존합니다.
- 투명 처리/달리기 교체 자산 8개의 실제 alpha를 확인했습니다. 기존 4직업의 대기/달리기 상체 색과 크기는 8포즈 픽셀 비교, 전환 크기는 실제 Canvas 변환으로 확인했습니다.
- 6직업의 스킬 학습·장착·해제·기본 배치 복구·재접속과 실제 두 손가락 스킬/기본 공격 입력을 검사했습니다. 기본 공격은 code 0, 6칸은 별도입니다. 사용자가 경험한 특정 저장 데이터의 전체 배치 소실 절차는 재현되지 않아 빈 칸과 잔류 입력 경로를 보완했으며, 재발 시 직업/스킬/저장 배치를 확인해야 합니다.
- 선택/비활성 금색 버튼의 글자 대비와 왼쪽 일괄 분해를 1280×591, 740×360, 640×296에서 확인했습니다. 기존 작은 화면·확대 글씨·긴 이름·상점·가방·퀘스트·NPC 검사도 통과했습니다.
- 일반 적/보스 이동과 재공격 템포, 원거리 보스의 교전 거리, 초반 정지 플레이어 피격, 경고 시간 유지와 동시 법사 위협 상한을 확인했습니다. 회피/사망 시 시전 취소/PvP 보정도 보존합니다.
- 기존 파티 EXP/저장/클리어·자기 피해 수치만 표시·HP·50%/180초 물약·실제 4개 브라우저 개인전 검사를 통과했습니다.
- 독립 바이너리 AndroidManifest 검사: `com.dungeoncrush.game`, `com.dungeoncrush.game.MainActivity`, 이름 던전크러시!, versionCode 31, versionName `2.10.1-facing-tempo`.
- 기존 서명 SHA256: `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`. CI apksigner 검증과 별도 APK 서명 블록 인증서 검사를 수행했습니다.
- 원화 manifest 268개 중 최종 228개 포함·40개 제외, 그림/스크립트/전체 한글 글꼴 SHA 일치 및 APK CRC를 확인했습니다.
- APK **238,992,846 bytes**, SHA256 `a4e4bb85eeb904f25323a973cdbc516a7489cf9635e7f4f388af569c0cdddff7`.
- 공유 ZIP **239,000,751 bytes**, SHA256 `8e0cc4a8e8fa769e437e848562da22d2d594a3e7697b4264dcf8047906a205b5`. APK·UTF-8 BOM 설치 안내·완성된 HANDOFF.md를 classic ZIP_STORED로 포장하고 실제 압축 해제 후 APK 해시를 비교했습니다.
- 원본 38개 파일의 SHA와 root app/legacy/tests 트리가 그대로입니다. main 병합은 수행하지 않았습니다.

[공개 릴리스](https://github.com/ohohhyun/CatHome/releases/tag/dungeon-crush-v2.10.1) · [새 채팅 인수인계](HANDOFF.md). 물리 휴대폰/실제 공유기에서의 프레임률·터치 감각은 미검증입니다.

---

## 2.10.0 최종 검증

소스 `d67541aa5e7eb1308d6e0076a12a1c3be4d1fb97`의 [전체 빌드](https://github.com/ohohhyun/CatHome/actions/runs/42426416837)와 [배포 검증](https://github.com/ohohhyun/CatHome/actions/runs/42428203105)이 성공했습니다.

- **33개 시나리오:** JavaScript 15개, Java 실제 TCP 4인 연결 1개, Chrome 17개. 기존 모션·장비·상점·퀘스트·파티 경험치·물약·캔버스 이름표를 포함합니다.
- 새 UI: 던전/개인전용 가로 6칸, 해제·빈칸·위치 교환·재접속 저장, 3번 칸에서 100레벨 궁극기 사용, 누른 위치에 뜨는 판매·구매·강화 확인창을 실제 조작했습니다.
- 네 독립 브라우저가 실제 네이티브 브리지 패킷을 교환했습니다. 레벨 29 제한과 30 해제, 4인 개인전 보정, 다른 세 명 공격, 자기만 치유, 물약 제한, 메뉴 중 계속 진행, 이탈·라운드·전적과 PvE 기록 보존을 검증했습니다.
- 전체 글씨: 작은 가로 화면·태블릿·안전 영역, 6개 캐릭터, 130%/140% 확대 글씨, 여러 스크롤 위치와 모든 메뉴를 검사했습니다. 정지 메인/선택과 기존 달리기·점프·대시·몸 크기·24포즈 공격 검사도 유지했습니다.
- 새 런타임 WebP 85개. 캐릭터 744포즈, 적 1,664포즈, 스킬 이펙트 432셀, 궁극기 48셀, 스킬 아이콘 54개. 등재된 260개 중 228개는 APK에 포함하며 32개 대체 자산은 의도적으로 제외합니다. 새 이미지의 불투명 RGB PSNR은 35dB 이상입니다.
- 설치 패키지 `com.dungeoncrush.game`, Activity `com.dungeoncrush.game.MainActivity`, 앱 이름 `던전크러시!`, 설치 버전 30을 컴파일된 APK에서 확인했습니다. 기존 서명과 전체 한글 글꼴을 유지합니다.
- APK: **238,656,266 bytes**, SHA-256 `e8b2331339132ef7d0fb62b8e5f08125981a922a8f764167aced5c2bb19d1a15`. 기존 서명 `e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708`.
- Share ZIP: **238,657,103 bytes**, SHA-256 `d61971eb0ac5d6eaa76b206975554a497505d79da81560f6c027053eda251ff6`. 일반 ZIP_STORED, UTF-8 BOM 한글 안내문, CRC와 **실제 압축 해제 후 APK 해시 일치**를 확인했습니다. 12개 전송 아카이브와 각 조각도 검증했습니다.
- 공개 APK·ZIP·검수 화면 7개의 크기와 SHA-256이 배포 과정에서 확인되었습니다. 공개 APK·ZIP은 로컬 검증 파일과도 일치합니다.
- 집사 사절 원본 38개 파일과 원본 app/legacy/tests 트리 및 main 브랜치를 변경하지 않았습니다. 변경은 독립 dungeon-crush와 전용 workflow에 한정합니다.
- 물리 휴대폰/공유기 하드웨어에서의 프레임률·터치 감각은 이 환경에서 검증하지 못했습니다.

---

이하 이전 버전 검증 기록입니다.

# 2.9.9 mage, regional encounters and text audit — verified APK

Source `737ab4c029d1f984649bf8469982a409bf9188a7`; [build 42354101717](https://github.com/ohohhyun/CatHome/actions/runs/42354101717) and [publisher 42355289178](https://github.com/ohohhyun/CatHome/actions/runs/42355289178) passed. [Share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.9/DungeonCrush-2.9.9-Share.zip): 141111024 bytes, SHA256 `e7c5953a8b20990ea0828fa1a42e8a4fb3a545d34d64e218223cc69daa8e8313`. APK: 141110192 bytes, SHA256 `ef91777a7b685684ed01711b9fff194f8a0dbd2dc71bb2c10af4c361576a873a`. VersionCode 29 / 2.9.9-aria-regions; com.dungeoncrush.game, label 던전크러시!, unchanged signer e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708.

14 JavaScript suites, native host + three actual TCP peers and 16 Chromium scenarios passed. Exact APK identity, signing certificate, ZIP CRC, reconstructed part hashes, 175 artwork entries (143 packaged hashes and the intentional absence of 32 superseded assets), embedded scripts/styles/HTML and the complete offline Korean font were checked. Public release assets match reviewed local files by byte length and SHA256. The share ZIP contains the original signed APK unchanged and UTF-8 installation notes. No physical Android handset or real phone-to-phone Wi-Fi run was performed in this environment; frame rate, thermal behavior and long sessions remain unverified.

New content includes the fifth elemental mage Aria, her six ranged/support/ultimate skills and own illustrated gear/icons; 124 new hero poses; five new normal and seven new boss appearances (eight of each total), 576 new enemy poses and eight regional rosters with 24 boss names and three genuinely distinct pattern sets per chapter. Raid rooms and rifts rotate regions. Reaction windows, source-owned cast cancellation, safe-center annulus geometry and party HP/count/EXP rules are exercised. New actor banks retain shared anatomical references, fixed torso running, distinct jump/dash and common ground anchors.

The new browser scenario exercises actual sale selection/cancel/confirmed price at 1280/740/640 widths, right-card ownership and first-child confirmation, unchanged currency/item state before confirmation and preserved left scroll. It verifies selected mage persistence, original four saved records, own equipment art/inspection, all eight decoded boss banks and actual six-skill inputs, with PNG and WebM evidence. The visual review also found ultimate titles hidden under HP; the final cut-in uses measured glyph width and avoids HUD, touch controls and world names, with 15 live layouts across all five ultimates and three phone widths. Player names and enemy notices render above large spell effects; a real rendered-screenshot pixel check exercises four simultaneous ultimates. Boss cast/BREAK labels use the same HUD-safe placement with readable phone-size fonts, and 48 additional live layouts cover all eight bosses at three widths. A frozen 2.9.8 RPG fixture independently verifies migration preserves old records and unique starter IDs.

Expanded text report: zero failures. Eight viewport/inset conditions include 640×296, DPR 2 and the supplied wide device capture. Five progressions × three widths × text scales 1/1.2/1.4 cover locked/current/cleared stages and scroll positions. All five character profiles also run at 130% and 140% text with roster scroll ends; the original swordsman and new mage run all eight town tabs at 130%, including active right-item sale confirmation, long counters and 120-piece inventories, top/middle/bottom/left scroll, item comparison, guide/LAN/settings, HUD/pause/results. Checks include glyph-own-box and owning-card containment plus text/text and art/text collisions. Close icons and the world NPC sign boundary retain meaningful accessible names and intentional world anchoring.

All 38 protected original CatHome files and app/legacy/tests Git subtrees remain unchanged. Source/release changes stay inside dungeon-crush and its two dedicated workflows. Main is unchanged and PR #1 remains open and unmerged. Existing four character records, equipped-first sorting, 4-player party capacity and 50% HP/180-second potion rules remain. LAN protocol is 7; all peers must update to 2.9.9 without uninstalling their existing app.

---

# 2.9.8 text containment and responsive card sizing — verified APK

The supplied 1280×591 screenshot shows stage status text painting outside each stage button and between grid rows. The previous audit clipped glyph rectangles through scroll containers and compared visible text/art, but did not require glyphs to fit their owning semantic card. This allowed text outside a button to evade detection when hidden by another row.

Stage buttons now use a vertical flex flow, non-shrinking text blocks, content-sized grid rows and automatic height. The same readable fonts remain; labels are not hidden, truncated or scaled down to conceal overflow. Client screen header rows can grow with wrapped headings, and the entrance-condition paragraph avoids splitting a Korean word. Enlarged text exposed another real defect: the × close glyph escaped its fixed 32px control and overlapped enhancement-list text. All six close controls now use a fixed-size SVG with their existing accessible names, and the audit checks these icons against text. World NPC signs intentionally float above world-space hit targets; their own .npc-label panel is the semantic containment boundary, while sign/text and visible collisions remain audited. Equipment priority remains worn first, then rarity, then the selected tie-break key within that rarity.

The enhanced Chromium audit measures glyphs against every owning button/card in addition to text/text and text/art intersections. It covers eight viewport/safe-area cases, story progress 0/3/12/23/24 at levels 1/8/32/60/60, three phone sizes and text scales 1/1.2/1.4, top/middle/bottom list positions and scrolled details. Town menus, description/comparison dialogs, LAN, settings, guide, pause and results are also checked with enlarged text. Enlarged-text cases are CSS-based test simulations, not a claim of having tested every Android font setting. Physical phone/WebView verification remains separate.

Source `9c3ae8d47fb38f79e3b90ff35fc9bb168945d5eb`; [build 42336220129](https://github.com/ohohhyun/CatHome/actions/runs/42336220129) and [publisher 42336971134](https://github.com/ohohhyun/CatHome/actions/runs/42336971134) passed. [Share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.8/DungeonCrush-2.9.8-Share.zip): 99184580 bytes, SHA256 `04527f23ff101e2e31497381aaa4a67d62646b628a4d789801e73f0e61ebe76b`. APK: 99183748 bytes, SHA256 `b078efd8293c2caf77ec8305230b88c794966ef4c4c0e6980a5962af153a9fa8`. VersionCode 28 / 2.9.8-text-fit; com.dungeoncrush.game and unchanged signer e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708. 13 JS suites, native host + 3 TCP peers, 15 Chromium scenarios, zero failures in the expanded text containment report, exact compiled identity/signature/assets/scripts/font checks and every public asset digest/byte check passed. All 38 protected original CatHome files and app/legacy/tests Git subtrees are unchanged; the PR remains open and this patch does not update main.

# 2.9.7 equipped-first rarity ordering — verified APK

Source `91d74d6106a96aa4ad846e7aae7b7c1ad30b8c13`; [build 42330052474](https://github.com/ohohhyun/CatHome/actions/runs/42330052474) and [publisher 42330862671](https://github.com/ohohhyun/CatHome/actions/runs/42330862671) passed. [Share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.7/DungeonCrush-2.9.7-Share.zip): 99183988 bytes, SHA256 `7f4103732b791f8068f9c5c65cadda76b15bf3bd3d76926f8306a96dc392fdc5`. APK: 99183156 bytes, SHA256 `9c3c75249a96b4d5e00f2de516b72c132300f4b5941e8950ea11a86ee33097d4`. VersionCode 27 / 2.9.7-equipped-first; com.dungeoncrush.game and unchanged signer e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708. 13 JS suites, native host + 3 TCP peers, 15 Chromium scenarios, exact compiled identity/signature/assets/scripts/font checks and every public asset digest/byte check passed. All 38 protected original CatHome files and app/legacy/tests Git subtrees are unchanged; the PR remains open and this patch does not update main.

Inventory ordering now fixes worn status as the first priority independently of direction, then rarity in the requested direction. The selected level/enhancement/acquisition criterion only breaks ties within the same rarity. A worn common item always precedes a spare epic. Enhancement target lists use the same ordering. The helper filters and sorts a copy; saved item order, IDs, locks, equipped state and gameplay values remain unchanged.

Rule tests cover all keys/directions over 205 items, conflicting worn/rarity/level/enhancement/ID cases, filters, stable ties and immediate reordering after equipping/unequipping. The live browser audit requires all six worn items before spare epics for every key and direction, then verifies within-group rarity and within-rarity criteria. Existing 13 JS suites, native host plus three TCP peers and 15 browser scenarios remain required. Original CatHome paths and existing graphics/motions remain unchanged. Physical-phone validation remains separate.

---

# 2.9.6 left descriptions and right lists — verified APK

Source `6a119215bbdbc9d1ee9176d899e7666b0037263a`; [build 42328011453](https://github.com/ohohhyun/CatHome/actions/runs/42328011453) and [publisher 42328901346](https://github.com/ohohhyun/CatHome/actions/runs/42328901346) passed. [Share ZIP](https://github.com/ohohhyun/CatHome/releases/download/dungeon-crush-v2.9.6/DungeonCrush-2.9.6-Share.zip): 99183913 bytes, SHA256 `aeb2e8d30ace565ba68ceb5053f8ab144b04e0c7ebf01853bb33c413f3596355`. APK: 99183081 bytes, SHA256 `f4dd62e7e893d8cd7da6a92a5479db55456392b2d4ff94e972b21ec0e4e8b1e8`. VersionCode 26 / 2.9.6-split-menus; com.dungeoncrush.game and unchanged signer e43fedd9099e7b5df82eccfa3e92fc020d429ad99795463abbe40e2af4880708. 13 JavaScript suites, native host + 3 actual TCP peers, 15 Chromium scenarios, compiled identity/signature/art/font and exact menu script/CSS verification, and every public asset size/digest check passed. All 38 protected original CatHome files and app/legacy/tests Git subtrees are unchanged; this patch does not update main and the PR remains open.

Town menus now have an independently scrolling left sidebar for headings, navigation, descriptions, equipped information and bag filters, and a right workspace for item lists and actions. The same columns remain at short-phone sizes; the inventory no longer places its detail below the bag. Selection returns the description pane to its start while same-view updates otherwise preserve both panes. Shop artwork selects a left-side option/price preview, enhancement uses an item grid and crafting is a separate blacksmith tab.

Quests provide all/main/daily/history filters, selected explanations, status badges, real goal progress bars and exact reward icons, with reporting/claiming in right-side cards. Settings, guide, LAN, pause, results and inspection dialogs also split descriptions and choices into separate scroll panes. Expedition content and stage selection use left explanations and right content/stage lists, difficulty and entry choices. Close controls have a reserved fixed area. Large currency labels use compact Korean units with exact amounts retained in titles/accessibility labels. Saved values, item ordering, transaction rules, protocol and combat/animation assets are unchanged.

The browser audit checks left/right geometry, usable list height and independent scrolling as well as glyph/art overlap at eight viewport/inset conditions. It audits scroll ends in both columns and actual main reporting, daily reward claiming and quest filter transitions. Existing 13 JS suites, native TCP host + three peers and 15 Chromium scenarios remain required. New menu screenshots use max-level test characters/counters; physical phones and long sessions remain separate validation. Original CatHome paths remain protected.

---

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

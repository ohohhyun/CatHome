# ASHEN RIFT validation

- Local: JavaScript syntax checks and `node tests/game.test.cjs` passed. Covers all four classes, 24 unique skills, resource/cooldown rules, movement bounds, jump edge triggering, telegraphed damage and defenses, all three dungeons at all three difficulties, co-op revival, defeat, deterministic simulation, effect bounds, packaged assets and manifest basics.
- CI: `tests/LanTransportTest.java` opens real loopback TCP sockets for a host and three clients, verifies authentication rejection, capacity rejection, UTF-8 inputs, 30KB snapshot broadcasts, disconnect and shutdown.
- CI: `tests/browser.test.cjs` drives four browser clients with a simulated Android bridge, checks lobby, start, remote movement, pause, terminal state and rewards. Captures menu, combat, lobby and results as workflow artifacts.
- CI passed for commit 2eeb1602470df8e22bbefc44d27d3510390f76c7: combat/campaign tests, native TCP tests, four-client UI/protocol tests, Android SDK 35 compile, APK signer verification and manifest inspection. That build also includes the bundled Korean UI font. The subsequent merge preserves CatHome v0.7 in legacy/ and raises versionCode to 8; verify its matching workflow separately.
- Not verified here: physical Android install, actual router/mobile Wi-Fi communication, device-specific multitouch/performance, long sessions and background transitions. CI pass confirms only the checks that actually ran successfully; inspect the matching workflow run.

Only the `ohohhyun/CatHome` repository is in scope.

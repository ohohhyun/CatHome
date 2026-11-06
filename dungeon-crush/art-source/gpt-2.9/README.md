# Dungeon Crush 2.9 motion artwork

The 101 PNG atlases in this directory are original OpenAI image_gen outputs. Runtime atlases are encoded into `app/src/main/assets/art/motion29/`; `generated-art-sources.json` records the source and runtime SHA256, dimensions, grid layout, and measured opaque RGB PSNR. Source PNGs are preserved unchanged. Alpha is checked for exact equality after encoding. Images below 35 dB use lossless WebP.

Each main motion has 24 authored pose crops. Running uses eight alternating key poses from the 16-pose run sheet plus sixteen intermediate poses. Jump and dodge use eight keys from the mobility sheet plus sixteen intermediate poses. Each of three basic combos, casting, and monster walk/attack uses eight keys and two additional eight-pose sheets interleaved in temporal order. Reaction sheets contain four idle poses, two hurt poses, landing, and defeat. Four ultimate sheets have eight visual-effect frames each; the painted icon atlas contains 24 icons.

`actors.js` contains the approved crop rectangles, anchors, and reference heights. Attack phase maps its middle key to the authoritative engine impact time. This is 24 drawings per motion, not a fixed 24 FPS; the game renders on requestAnimationFrame and preserves the existing 60 Hz simulation and LAN snapshots.

Large source atlases are cropped into bounded runtime canvases on demand. Production uses an LRU cache with a 128 MiB target; the exhaustive presentation tests deliberately preload all poses. Superseded 2.8 body atlases remain in source for comparison tests and are excluded from the APK.

No Dungeon & Fighter or Guilty Gear game assets were copied. These are dedicated Dungeon Crush character drawings and effects. A frame count is not a percentage score against a commercial game's animation quality.

## 2.9.1 run registration correction

Inspection found that each run sheet repeated the same eight gait phases twice. Runtime now groups 24 distinct existing crops into one eight-phase left/right stride, registers their head/root positions and advances the stride once per 320 world units. No artwork bytes were edited. Running/dodging draw one body per frame; acceleration/stop lean and footfall dust provide motion cues without duplicate bodies.

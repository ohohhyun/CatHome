"""Prepare an update-installable recovery build from the preserved CatHome source.

Only the temporary build copy changes. The legacy snapshot and main are untouched.
"""
import re
import shutil
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
source = root.parent / 'legacy' / 'cathome-0.7'
target = Path(sys.argv[1]).resolve()
if not source.is_dir():
    raise SystemExit('Preserved CatHome v0.7 snapshot is missing')
if target.exists():
    raise SystemExit('Recovery build directory must be new')
shutil.copytree(source, target, ignore=shutil.ignore_patterns('.git', '.gradle', 'build', '.signing'))
gradle = target / 'app' / 'build.gradle'
text = gradle.read_text()
if "applicationId 'com.cathome.game'" not in text:
    raise SystemExit('Unexpected original application ID')
text, count = re.subn(r'versionCode\s+\d+', 'versionCode 10', text, count=1)
if count != 1:
    raise SystemExit('Original versionCode was not found')
text = re.sub(r"versionName\s+'[^']+'", "versionName '0.7-restore'", text, count=1)
gradle.write_text(text)
print('Prepared preserved original CatHome recovery build:', target)

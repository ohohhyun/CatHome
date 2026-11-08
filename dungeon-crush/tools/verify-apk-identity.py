"""Verify the compiled APK identity; do not rely only on Gradle source text."""
import re
import subprocess
import sys

aapt, apk, expected_package, expected_activity, *label = sys.argv[1:]
badging = subprocess.check_output([aapt, 'dump', 'badging', apk], text=True)
package = re.search(r"^package: name='([^']+)' versionCode='([^']+)'", badging, re.M)
activity = re.search(r"^launchable-activity: name='([^']+)'", badging, re.M)
if not package or package.group(1) != expected_package:
    raise SystemExit('Unexpected APK package: ' + badging)
if not activity or activity.group(1) != expected_activity:
    raise SystemExit('Unexpected APK launch activity: ' + badging)
if label and "application-label:'" + label[0] + "'" not in badging:
    raise SystemExit('Unexpected APK app name: ' + badging)
if package.group(2) != '31':
    raise SystemExit('Expected install version 31')
print(badging)
print('Verified application identity:', expected_package)

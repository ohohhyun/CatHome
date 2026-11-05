"""Package existing CC0 audio from pinned revisions; no runtime downloads."""
import concurrent.futures
import hashlib
import json
import time
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parent.parent
target = root / 'app/src/main/assets/audio'
target.mkdir(parents=True, exist_ok=True)
def git_sha(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
def fetch(entry):
    path = target / entry['name']
    if path.exists() and git_sha(path.read_bytes()) == entry['git_sha']:
        return entry['name']
    for attempt in range(3):
        try:
            with urllib.request.urlopen(entry['url'], timeout=45) as response:
                data = response.read()
            if git_sha(data) != entry['git_sha']:
                raise ValueError('Audio integrity mismatch: ' + entry['name'])
            path.write_bytes(data)
            return entry['name']
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for name in pool.map(fetch, json.loads((root / 'audio-sources.json').read_text())):
        print('Verified audio:', name)

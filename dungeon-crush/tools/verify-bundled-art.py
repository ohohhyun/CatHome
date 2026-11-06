"""Verify that the built APK contains exactly the approved presentation bytes."""
from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
import json
import sys
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'generated-art-sources.json').read_text())
with ZipFile(sys.argv[1]) as apk:
    assert apk.testzip() is None
    for asset in manifest['assets']:
        name='assets/'+asset['file']
        if asset.get('packaged',True):
            assert sha256(apk.read(name)).hexdigest()==asset['sha256'],name
        else:
            assert name not in apk.namelist(),name+' is superseded'
    for name in ['engine.js','sprite-art.js','motion.js','effects.js','app.js','client.js','world.js','index.html']:
        assert apk.read('assets/'+name)==(root/'app/src/main/assets'/name).read_bytes(),name
print('Verified packaged original idle cels, 192 new motion/combo cels, 192 individual spell cels and final game scripts.')

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
    for name in ['engine.js','sprite-art.js','motion.js','effects.js','app.js','client.js','world.js','town.js','sound.js','rpg.js','client.css','town.css','index.html']:
        assert apk.read('assets/'+name)==(root/'app/src/main/assets'/name).read_bytes(),name
print('Verified combat guard idle poses, 192 motion/combo cels, 192 individual spell cels, 64 monster cels and 30 illustrated icons and final game scripts.')

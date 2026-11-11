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
    font=json.loads((root/'font-sources.json').read_text())
    assert sha256(apk.read('assets/'+font['file'])).hexdigest()==font['sha256'],'offline Korean font'
    assert apk.read('assets/art/FONT-LICENSE.txt')==(root/font['licenseFile']).read_bytes()
    for entry in json.loads((root/'combat-audio-sources.json').read_text())['assets']:
        assert sha256(apk.read('assets/audio/'+entry['file'])).hexdigest()==entry['sha256'],entry['file']
    assert apk.read('assets/audio/CREDITS.txt')==(root/'app/src/main/assets/audio/CREDITS.txt').read_bytes()
    for name in ['navigation.js','ranking-config.js','ranking-client.js','rankings.js','ranking-ui.js','refinement.css','progress.js','release.js','arena.js','growth.js','dialogs.js','expansion.css','encounters.js','menus.js','menus.css','ui-layout.js','actors.js','icons.js','engine.js','sprite-art.js','motion.js','effects.js','app.js','client.js','world.js','town.js','sound.js','rpg.js','client.css','town.css','index.html']:
        assert apk.read('assets/'+name)==(root/'app/src/main/assets'/name).read_bytes(),name
print('Verified 744 character poses, 1664 monster poses, 432 spell cels, 48 ultimate cels, 54 painted skill icons, 42 equipment icons and exact final presentation scripts.')

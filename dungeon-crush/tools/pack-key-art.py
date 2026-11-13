"""Package approved image_gen illustrations with exact RGB preservation."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--sources', required=True, help='JSON array of {id,path} generator outputs')
parser.add_argument('--final', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
assets = root / 'app/src/main/assets'
plan = json.loads((root / 'art-source/premium-plan.json').read_text())
expected = ['kael', 'rin', 'bane', 'sera', 'aria', 'elian'] + [o['id'] for o in plan['outfits']]
dest = assets / 'art/key-art'
dest.mkdir(exist_ok=True)
entries = {}
old = root / 'art-source/key-art-sources.json'
if old.exists():
    for entry in json.loads(old.read_text())['assets']:
        assert hashlib.sha256((assets / entry['file']).read_bytes()).hexdigest() == entry['sha256']
        entries[entry['id']] = entry
for job in json.loads(Path(args.sources).read_text()):
    identity, source = job['id'], Path(job['path'])
    assert identity in expected
    original = Image.open(source)
    mode = 'RGBA' if 'A' in original.getbands() and original.getchannel('A').getextrema()[0] < 255 else 'RGB'
    image = original.convert(mode)
    output = dest / (identity + '.webp')
    original_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    if identity not in entries or entries[identity]['originalSha256'] != original_hash:
        temporary = output.with_name('.' + output.stem + '.tmp.webp')
        image.save(temporary, 'WEBP', lossless=True, method=6, exact=True)
        assert Image.open(temporary).convert(mode).tobytes() == image.tobytes()
        temporary.replace(output)
    assert Image.open(output).convert(mode).tobytes() == image.tobytes()
    entries[identity] = dict(id=identity, file=str(output.relative_to(assets)), width=image.width,
        height=image.height, sha256=hashlib.sha256(output.read_bytes()).hexdigest(),
        originalOutput=source.name, originalSha256=original_hash, tool='OpenAI image_gen',
        encoding='lossless WebP; exact ' + mode + ' preserved', packaged=True)
    if source.resolve().is_relative_to(assets.resolve()):
        entries[identity]['reusedFrom'] = str(source.resolve().relative_to(assets.resolve()))
    inset = job.get('frameInset', 1)
    assert .75 <= inset <= 1
    if inset != 1:
        entries[identity]['frameInset'] = inset
pending = [identity for identity in expected if identity not in entries]
manifest = dict(version='2.15.0', assets=[entries[i] for i in expected if i in entries], pending=pending)
old.write_text(json.dumps(manifest, indent=2) + '\n')
catalog = {i: entries[i]['file'] for i in expected if i in entries}
(assets / 'key-art-catalog.js').write_text('/* Packaged, individually illustrated character art. */\nwindow.DungeonKeyArtAssets=' + json.dumps(catalog, separators=(',', ':')) + ';\n')
insets = {a['id']: a['frameInset'] for a in manifest['assets'] if 'frameInset' in a}
with (assets / 'key-art-catalog.js').open('a') as stream:
    stream.write('window.DungeonKeyArtInset=' + json.dumps(insets, separators=(',', ':')) + ';\n')
if args.final:
    assert not pending, 'Missing illustrations: ' + ', '.join(pending)
general_file = root / 'generated-art-sources.json'
general = json.loads(general_file.read_text())
general['version'] = '2.15.0'
general['keyArtCount'] = len(entries)
general['assets'] = [a for a in general['assets'] if not a['file'].startswith('art/key-art/')]
general['assets'] += [dict(a, id='key-art-' + a['id']) for a in manifest['assets']]
general_file.write_text(json.dumps(general, indent=2) + '\n')
print('Packaged', len(entries), 'illustrations; pending:', ', '.join(pending) or 'none')

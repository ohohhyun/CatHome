"""Apply reviewed body landmarks without changing sprite pixels or action timing."""
import hashlib
import json


def apply_body_calibration(root, data):
    review = json.loads((root / 'art-source/premium-body-calibration.json').read_text())
    assets = root / 'app/src/main/assets'
    checked = set()
    for costume_id, costume in data['costumes'].items():
        item = review['costumes'][costume_id]
        assert item['cls'] == costume['cls'], costume_id
        targets = review['base'][item['base']]['banks']
        for name, landmark in item['banks'].items():
            source = targets[name]
            for point in (source, landmark):
                if point['src'] not in checked:
                    assert hashlib.sha256((assets / point['src']).read_bytes()).hexdigest() == point['sha256'], point['src'] + ' requires a new body review'
                    checked.add(point['src'])
            bank = costume['banks'][name]
            frame = bank['frames'][landmark['frame']]
            assert bank['src'] == landmark['src'] and frame[:4] == landmark['rect'], costume_id + '/' + name
            target = (source['soleY'] - source['eyeY']) / source['reference']
            reference = round((landmark['soleY'] - landmark['eyeY']) / target, 6)
            assert reference > 45 and target > .5, costume_id + '/' + name
            # Movement shares the neutral body's scale; crouches and jumps retain their authored poses.
            names = ('reaction', 'run', 'jump', 'dash') if name == 'reaction' else (name,)
            for target_name in names:
                clip = costume['banks'][target_name]
                clip['reference'] = reference
                for cel in clip['frames']:
                    cel[6] = reference
            bank['bodyCalibration'] = {'frame': landmark['frame'], 'eyeY': landmark['eyeY'], 'soleY': landmark['soleY'], 'targetEyeHeight': target}
    data['bodyCalibrationVersion'] = review['version']


if __name__ == '__main__':
    from pathlib import Path
    root = Path(__file__).resolve().parents[1]
    path = root / 'app/src/main/assets/premium-art-data.js'
    text = path.read_text()
    prefix, payload = text.split('window.DungeonPremiumArtData=', 1)
    data = json.loads(payload.strip().removesuffix(';'))
    apply_body_calibration(root, data)
    path.write_text(prefix + 'window.DungeonPremiumArtData=' + json.dumps(data, separators=(',', ':')) + ';\n')
    print('Calibrated all thirty outfits against the six basic character bodies; original sprite pixels unchanged')

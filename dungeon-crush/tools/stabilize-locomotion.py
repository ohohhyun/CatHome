"""Audit locomotion torso registration and update pivots, without editing source images.
Requires Pillow and numpy. First poses keep their established world anchor and scale.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'app/src/main/assets'
records = []

def read_data(name, marker):
    path = ASSETS / name
    text = path.read_text()
    start = text.index(marker) + len(marker)
    data, end = json.JSONDecoder().raw_decode(text[start:])
    return path, text[:start], data, text[start + end:]

def stabilize(identity, bank, premium=False, limit=None):
    pidx, ridx = (4, 6) if premium else (5, 7)
    original = bank.setdefault('authoredPivots', [r[pidx:pidx+2] for r in bank['frames']])
    frames = bank['frames'][:limit] if limit else bank['frames']
    original = original[:len(frames)]
    sources = [bank['src']] if premium else bank['sources']
    images = [Image.open(ASSETS / src).convert('RGBA') for src in sources]
    centers = []
    for r, pivot in zip(frames, original):
        channel, x, y, w, h = (0, *r[:4]) if premium else r[:5]
        alpha = np.asarray(images[channel].crop((x,y,x+w,y+h)))[:,:,3]
        yy, xx = np.nonzero(alpha > 200)
        # Ignore the walking feet; measure the persistent upper silhouette.
        upper = yy < np.quantile(yy, .65)
        centers.append([(xx[upper].mean()-pivot[0])/r[ridx],
                        (yy[upper].mean()-pivot[1])/r[ridx]])
    before = np.asarray(centers)
    smooth = (np.roll(before,2,axis=0)+4*np.roll(before,1,axis=0)+6*before+
              4*np.roll(before,-1,axis=0)+np.roll(before,-2,axis=0))/16
    correction = before-smooth
    correction = np.clip(correction, -.06, .06)
    correction -= correction[0]  # Preserve the calibrated first pose.
    after = before-correction
    for r, pivot, delta in zip(frames, original, correction):
        r[pidx] = round(pivot[0]+float(delta[0])*r[ridx], 4)
        r[pidx+1] = round(pivot[1]+float(delta[1])*r[ridx], 4)
    def jerk(points):
        acc = np.roll(points,-2,axis=0)-2*np.roll(points,-1,axis=0)+points
        return round(float(np.sqrt((acc*acc).sum(axis=1).mean())*160), 4)
    records.append({'id':identity,'frames':len(original),'beforeRmsAccelerationAt160px':jerk(before),
                    'afterRmsAccelerationAt160px':jerk(after),'maxPivotAdjustmentAt160px':round(float(np.abs(correction).max()*160),4),
                    'sourceSha256':{src:hashlib.sha256((ASSETS/src).read_bytes()).hexdigest() for src in sources}})
    for image in images:image.close()

path, prefix, data, suffix = read_data('actors.js', 'const DATA=')
for hero in data['heroes']:
    stabilize(hero['id']+'/run', hero['run'])
    stabilize(hero['id']+'/reaction', hero['reaction'], limit=4)
for enemy in data['enemies']:stabilize(enemy['id']+'/walk', enemy['walk'])
path.write_text(prefix+json.dumps(data,ensure_ascii=False,separators=(',',':'))+suffix)
path, prefix, data, suffix = read_data('premium-art-data.js', 'window.DungeonPremiumArtData=')
for identity, outfit in data['costumes'].items():
    stabilize(identity+'/run', outfit['banks']['run'], True)
    stabilize(identity+'/reaction', outfit['banks']['reaction'], True, limit=4)
path.write_text(prefix+json.dumps(data,ensure_ascii=False,separators=(',',':'))+suffix)
report={'method':'Five-tap cyclic upper-silhouette registration; first pose and scale preserved; no source pixel changes.',
        'baseHeroes':6,'outfits':30,'enemies':92,'banks':records}
(ROOT/'art-source/locomotion-stability-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
assert len(records)==164
assert all(r['afterRmsAccelerationAt160px']<=r['beforeRmsAccelerationAt160px']+.0001 for r in records)
print('Audited and stabilized',len(records),'locomotion banks;',sum(r['frames'] for r in records),'registered poses. Source images unchanged.')
print('thornwolf:',next(r for r in records if r['id']=='thornwolf/walk'))

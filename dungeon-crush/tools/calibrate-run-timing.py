"""Measure existing lower-body pose spacing; preserve pixels, pivots and contact cadence.
Each authored half-stride occupies half a cycle. Near-duplicate cels receive less
travel time, so equally spaced display ticks do not linger then jump between poses.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'app/src/main/assets'
records = []

def calibrate(identity, bank, premium=False):
    planes = []
    sources = [bank['src']] if premium else bank['sources']
    images = [Image.open(ASSETS / src).convert('RGBA') for src in sources]
    for frame in bank['frames']:
        r = [0, *frame] if premium else frame
        image = images[r[0]].crop((r[1], r[2], r[1]+r[3], r[2]+r[4]))
        scale = 160/r[7]
        image = image.resize((round(image.width*scale), round(image.height*scale)), Image.Resampling.LANCZOS)
        canvas = Image.new('RGBA', (240, 200))
        canvas.paste(image, (round(120-r[5]*scale), round(184-r[6]*scale)))
        rgba = np.asarray(canvas)[105:188,65:175].astype(float)/255
        planes.append(np.concatenate((rgba[:,:,:3]*rgba[:,:,3:4], rgba[:,:,3:4]), axis=2))
    edges = [max(.0001, float(np.abs(planes[i]-planes[(i+1)%8]).mean())) for i in range(8)]
    times = []
    for start in [0, 4]:
        # Keep every source cel reachable even at ordinary mobile frame rates.
        weights = np.asarray(edges[start:start+4])
        weights = np.maximum(weights, weights.mean()*.55)
        weights = weights/weights.sum()*.5
        times.extend([round(start/8+float(sum(weights[:i])), 9) for i in range(4)])
    bank['runTimes'] = times
    records.append({'id':identity, 'times':times, 'lowerBodyPoseDistances':edges,
                    'sourceSha256':{src:hashlib.sha256((ASSETS/src).read_bytes()).hexdigest() for src in sources}})
    for im in images: im.close()

for file, marker, premium in [('actors.js','const DATA=',False),('premium-art-data.js','window.DungeonPremiumArtData=',True)]:
    path=ASSETS/file; text=path.read_text(); start=text.index(marker)+len(marker)
    data,end=json.JSONDecoder().raw_decode(text[start:])
    if premium:
        for identity,outfit in data['costumes'].items():calibrate(identity,outfit['banks']['run'],True)
    else:
        for hero in data['heroes']:calibrate(hero['id'],hero['run'])
    path.write_text(text[:start]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+text[start+end:])
(ROOT/'art-source/run-timing-review.json').write_text(json.dumps({'method':__doc__.strip(),'baseHeroes':6,'outfits':30,'banks':records},ensure_ascii=False,indent=2)+'\n')
print('Measured and calibrated 36 complete run banks; source images and combat poses unchanged.')

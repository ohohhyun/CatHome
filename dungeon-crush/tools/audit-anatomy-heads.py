"""Actual source-pixel anatomy audit, with no runtime ML or artwork deformation."""
from pathlib import Path
from PIL import Image
import cv2,numpy as np,json,math,concurrent.futures,hashlib
cv2.setNumThreads(1)
R=Path(__file__).resolve().parents[1];review=json.loads((R/'art-source/anatomy2206-review.json').read_text());manifest=json.loads((R/'generated-art-sources.json').read_text());assets={a.get('id'):a for a in manifest['assets']};DEST=R/'build/head-pixel-authoring-cache';DEST.mkdir(parents=True,exist_ok=True)
def model(id,kind):
 entry=assets[id+'-'+kind];source=R/entry['originalFile'];actual=hashlib.sha256(source.read_bytes()).hexdigest();assert actual==entry['originalSha256'],'Approve the changed source PNG before calibration';return dict(source=str(source),sha256=actual,frames=[dict(rect=cell)for cell in entry['cells']])
def check(id):
 look=review['looks'][id];metas={};anns={};images={}
 fingerprint=hashlib.sha256(json.dumps([(k,[(p['sourceFrame'],p['rawSha256'],p.get('face'),review['models'][p['rawSha256']]['reference'])for p in v])for k,v in look['banks'].items()],sort_keys=True).encode()).hexdigest()
 sourceHashes={k:model(id,k)['sha256']for k in ['movement','locomotion','combat']}
 cached=DEST/f'{id}.json'
 if cached.exists():
  prior=json.loads(cached.read_text())
  if prior.get('templateVersion')==2 and prior.get('sourceSha256')==sourceHashes and prior.get('faceInputSha256')==fingerprint:return prior
 for kind in ['movement','locomotion','combat']:
  metas[kind]=model(id,kind);anns[kind]=dict(frames={});images[kind]=Image.open(metas[kind]['source']).convert('RGBA')
 for name,points in look['banks'].items():
  kind='movement'if name in ['reaction','jump','dash']else'locomotion'if name in ['walk','run']else'combat'
  for point in points:anns[kind]['frames'][point['sourceFrame']]=point
 def cel(kind,i,raw):
  f=metas[kind]['frames'][i];x,y,w,h=f['rect'];im=images[kind].crop((x,y,x+w,y+h));ref=review['models'][raw]['reference'];scale=400/ref;im=im.resize((round(w*scale),round(h*scale)),Image.Resampling.LANCZOS);a=np.array(im);rgb=a[:,:,:3].copy();rgb[a[:,:,3]<180]=96;gray=cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY);q=anns[kind]['frames'][i];face=q['face'];return gray,a[:,:,3],face,scale
 neutral=look['banks']['reaction'][0];g,a,f,k=cel('movement',8,neutral['rawSha256']);box=np.array(f['boxQuad'])*k;x0,y0=box.min(axis=0);x1,y1=box.max(axis=0);w=x1-x0;h=y1-y0;left=max(0,int(x0-w*.05));right=min(g.shape[1],int(x1+w*.05));top=max(0,int(y0-h*.05));bottom=min(g.shape[0],int(y1+h*.05));template=g[top:bottom,left:right];mask=(a[top:bottom,left:right]>200).astype(np.uint8)*255
 templates=[]
 for angle in [-45,-30,-15,0,15,30,45]:
  mat=cv2.getRotationMatrix2D((template.shape[1]/2,template.shape[0]/2),angle,1);gg=cv2.warpAffine(template,mat,(template.shape[1],template.shape[0]),borderValue=96);mm=cv2.warpAffine(mask,mat,(template.shape[1],template.shape[0]),flags=cv2.INTER_NEAREST)
  for scale in np.arange(.65,1.401,.05):
   ww,hh=round(gg.shape[1]*scale),round(gg.shape[0]*scale)
   if min(ww,hh)<10:continue
   templates.append((float(scale),angle,cv2.resize(gg,(ww,hh)),cv2.resize(mm,(ww,hh),interpolation=cv2.INTER_NEAREST)))
 rows=[]
 for name,points in look['banks'].items():
  kind='movement'if name in ['reaction','jump','dash']else'locomotion'if name in ['walk','run']else'combat'
  for p in points:
   g,a,f,k=cel(kind,p['sourceFrame'],p['rawSha256']);best=(-1,None,None)
   if f:
    eye=np.array(f['eye'])*k;rx=max(50,template.shape[1]*1.3);ry=max(55,template.shape[0]*1.4);roi=g[max(0,int(eye[1]-ry)):min(g.shape[0],int(eye[1]+ry)),max(0,int(eye[0]-rx)):min(g.shape[1],int(eye[0]+rx))]
    for scale,angle,gg,mm in templates:
     if gg.shape[0]>=roi.shape[0]or gg.shape[1]>=roi.shape[1]:continue
     match=cv2.matchTemplate(roi,gg,cv2.TM_CCOEFF_NORMED,mask=mm);score=float(np.nan_to_num(match,nan=-1,posinf=-1,neginf=-1).max())
     if score>best[0]:best=(score,scale,angle)
   rows.append(dict(bank=name,frame=p['frame'],sourceFrame=p['sourceFrame'],score=round(best[0],4),scale=round(best[1],4)if best[1]else None,angle=best[2],manual=best[0]<.65 or best[1]is None or abs(best[1]-1)>.15))
 out=dict(id=id,templateVersion=2,faceInputSha256=fingerprint,sourceSha256={k:v['sha256']for k,v in metas.items()},method='Actual RGBA facial-anatomy template matching, excluding hats/hair/weapons, at one normalized body scale, seven rotations and 16 sizes; uncertain or excess-scale cases require visual inspection.',rows=rows);(DEST/f'{id}.json').write_text(json.dumps(out,indent=2));print(id,'manual',sum(r['manual']for r in rows),'of',len(rows),flush=True);return out
if __name__=='__main__':
 import argparse
 parser=argparse.ArgumentParser(description='Authoring only: recompute source facial-pixel correlations. Requires Pillow, numpy and OpenCV; never bundled in the APK.')
 parser.add_argument('--only',action='append',help='Review only these look IDs; use a separate output for partial reports.')
 parser.add_argument('--output',type=Path,default=R/'art-source/anatomy2206-head-pixels.json')
 args=parser.parse_args();ids=args.only or list(review['looks'])
 assert all(id in review['looks']for id in ids)
 with concurrent.futures.ThreadPoolExecutor(max_workers=3)as pool:results=list(pool.map(check,ids))
 args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(results,indent=2)+'\n');print('Reviewed',len(results),'looks; no art pixels modified')

"""Register authored bodies by a single semantic root; never resize individual frames."""
from pathlib import Path
from PIL import Image
import numpy as np,json,statistics,math
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
f=A/'actors.js';s=f.read_text();st=s.index('const DATA=')+len('const DATA=');D,n=json.JSONDecoder().raw_decode(s[st:]);pf=A/'premium-art-data.js';pre,ps=pf.read_text().split('window.DungeonPremiumArtData=',1);P=json.loads(ps.strip().removesuffix(';'));V=read(R/'art-source/anatomy2206-review.json');M={x.get('id'):x for x in read(R/'generated-art-sources.json')['assets']};audit=[]
def boot(im,rect):
 x,y,w,h=rect;alpha=np.array(im.crop((x,y,x+w,y+h)))[:,:,3]>200;minimum=max(5,round(h*.02))
 for yy in range(h-1,int(h*.55),-1):
  row=np.r_[False,alpha[yy],False];changes=np.flatnonzero(row[1:]!=row[:-1]);segments=[(l,r)for l,r in zip(changes[::2],changes[1::2])if r-l>=minimum]
  if segments:
   l,r=max(segments,key=lambda q:q[1]-q[0]);return yy,(l+r-1)/2
 raise ValueError('No boot row')
for id,look in V['looks'].items():
 basic='-'not in id;banks=D['heroes'][look['cls']]if basic else P['costumes'][id]['banks'];neutral=look['banks']['reaction'][:4]
 offsets=[(q['eye'][0]-q['hip'][0])/q['reference']for q in neutral if q['eye']and q['hip']and abs(q['eye'][0]-q['hip'][0])<q['reference']*.2];offset=statistics.median(offsets)if offsets else .025
 for name in ['walk','run']:
  bank=banks[name];points=look['banks'][name];im=Image.open(R/M[id+'-locomotion']['originalFile']).convert('RGBA')
  for q,r in zip(points,bank['frames']):
   sole,x=boot(im,r[1:5]if basic else r[:4]);q.update(sole=sole,supportFoot=dict(x=x,sole=sole,method='lowest contiguous opaque boot segment; thin weapon tips excluded; all 36 contact pairs visually reviewed'),previousPoseSole=q['sole']);q['feet']=[foot for foot in q['feet']if foot.get('side')!='support'];q['feet'].append(dict(side='support',sole=sole,x=x,confidence=1));bank['soles'][q['frame']]=sole
  valid=[q for q in points if q['eye']]
  assert len(valid)>=6,(id,name,'face registration unavailable')
  # Use the closest neighboring actual face label for rare occlusion; no switch
  # between a hip coordinate and a face coordinate is allowed.
  for q in points:
   if not q['eye']:
    near=min(valid,key=lambda z:min(abs(z['frame']-q['frame']),8-abs(z['frame']-q['frame'])));q['eye']=list(near['eye']);q['rootEyeEstimated']=True
  spans=[(q['sole']-q['eye'][1])/q['reference']for q in points];contacts=[spans[0],spans[4]]
  # A small twice-per-cycle rise replaces the old foot/tucked-knee-based whole
  # body translation. Native bone lengths and frame scale remain untouched.
  for i,(q,r)in enumerate(zip(points,bank['frames'])):
   ref=q['reference'];phase=i/8;py=q['sole']
   if name=='run':
    height=(contacts[0]+contacts[1])/2+(contacts[0]-contacts[1])/2*math.cos(2*math.pi*phase)+.018*math.sin(2*math.pi*phase)**2
    height=max(height,spans[i]);py=q['eye'][1]+height*ref
   r[-3]=round(q['eye'][0]-offset*ref,4);r[-2]=round(py,4)
  bank['authoredPivots']=[[r[-3],r[-2]]for r in bank['frames']];bank['rootRegistrationVersion']=2
  projected=[dict(frame=i,eyeX=(q['eye'][0]-r[-3])*260/r[-1],eyeY=(q['eye'][1]-r[-2])*260/r[-1],supportY=(q['sole']-r[-2])*260/r[-1])for i,(q,r)in enumerate(zip(points,bank['frames']))]
  audit.append(dict(id=id,bank=name,contactHeightDifference=abs(contacts[0]-contacts[1])*260,eyeVerticalRange=max(q['eyeY']for q in projected)-min(q['eyeY']for q in projected),points=projected))
 # Standing idles keep the same semantic root even if the pose detector misses a hip.
 for q,r in zip(look['banks']['reaction'][:4],banks['reaction']['frames'][:4]):
  if q['eye']:r[-3]=round(q['eye'][0]-offset*q['reference'],4)
 banks['reaction']['authoredPivots']=[[r[-3],r[-2]]for r in banks['reaction']['frames']]
f.write_text(s[:st]+json.dumps(D,separators=(',',':'))+s[st+n:]);pf.write_text(pre+'window.DungeonPremiumArtData='+json.dumps(P,separators=(',',':'))+';\n');V['rootRegistration']='Constant semantic face-to-neutral-root offset for locomotion; actual opaque boot contact, smooth two-step run flight, constant clip scale. No per-frame resizing or anatomical deformation.';write(R/'art-source/anatomy2206-review.json',V);write(R/'art-source/anatomy2206-root-registration.json',dict(version=2,method=V['rootRegistration'],banks=audit));print('Registered',len(audit),'gaits');print('Worst contact differences',sorted([(round(q['contactHeightDifference'],2),q['id'],q['bank'])for q in audit],reverse=True)[:10]);print('Worst head ranges',sorted([(round(q['eyeVerticalRange'],2),q['id'],q['bank'])for q in audit],reverse=True)[:10])

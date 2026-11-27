"""Constant physical stature with independent source-head diagnostics; never reshape anatomy."""
from pathlib import Path
import json,statistics,math
R=Path(__file__).resolve().parents[1];A=R/'app/src/main/assets'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
review=read(R/'art-source/anatomy2206-review.json');records={q['id']:q for q in read(R/'art-source/anatomy2206-head-pixels.json')};file=A/'actors.js';text=file.read_text();start=text.index('const DATA=')+len('const DATA=');D,consumed=json.JSONDecoder().raw_decode(text[start:]);pf=A/'premium-art-data.js';prefix,payload=pf.read_text().split('window.DungeonPremiumArtData=',1);P=json.loads(payload.strip().removesuffix(';'));results=[]
for id,look in review['looks'].items():
 basic='-'not in id;banks=D['heroes'][look['cls']]if basic else P['costumes'][id]['banks'];raw=records[id]['rows'];out=[]
 for name,points in look['banks'].items():
  bank=banks[name];groups={q['rawSha256']for q in points}
  for source in groups:
   indices={p['frame']for p in points if p['rawSha256']==source};measurements=[q for q in raw if q['bank']==name and q['frame']in indices and q['scale']is not None];valid=[q for q in measurements if q['score']>=.7 and .65<q['scale']<1.4]
   if len(valid)<min(2,len(indices)):valid=[]
   diagnostic=statistics.median(q['scale']for q in valid)if valid else None
   factor=1 if name=='reaction'or not valid else diagnostic
   original=review['models'][source]['reference'];reference=round(original*factor,6)
   standing=name.startswith('combo')or name=='cast'
   if standing:
    guards=[q for q in points if q['frame']in [0,7]and q['rawSha256']==source and q.get('eye')]
    if guards:
     reference=round(statistics.median(q['sole']-q['eye'][1]for q in guards)/review['commonEyeRatio'],6);factor=reference/original
   if name=='walk':
    contacts=[q for q in points if q['rawSha256']==source and q.get('eye')]
    if contacts:
     reference=max(reference,round(max(q['sole']-q['eye'][1]for q in contacts)/(review['commonEyeRatio']*1.02),6));factor=reference/original
   for p in points:
    if p['rawSha256']!=source:continue
    r=bank['frames'][p['frame']];r[-1]=reference;p['reference']=reference
   out.append(dict(bank=name,rawSha256=source,originalReference=original,reference=reference,factor=factor,facePixelScaleDiagnostic=diagnostic,standingPhysicalHeight=standing,samples=len(valid),medianCorrelation=round(statistics.median(q['score']for q in valid),4)if valid else None,method='constant clip scale from upright first/last guard stature for combat; facial template is an independent diagnostic, not an instruction to grow the whole body; other actions retain native head-pixel calibration; no per-frame or per-axis scaling',requiresVisualReview=(not valid and name!='reaction')or bool(standing and diagnostic and abs(diagnostic/factor-1)>.08)))
  bank['reference']=bank['frames'][0][-1]
 look['clipCalibration']=out;results.append(dict(id=id,calibration=out))
# Match footfall cadence to measured stance separation, shared by a class and its five outfits.
gaits=[]
for cls in range(6):
 profile={}
 for name,limits in [('walk',(125,210)),('run',(210,340))]:
  samples=[]
  for id,look in review['looks'].items():
   if look['cls']!=cls:continue
   for n in [0,4]:
    q=look['banks'][name][n];feet=q['feet']
    if len(feet)<2:continue
    separation=abs(feet[0]['x']-feet[1]['x']);distance=2*separation*260/q['reference']
    if 60<distance<400:samples.append(dict(id=id,frame=n,stride=distance))
  value=statistics.median(p['stride']for p in samples)if samples else(176.8 if name=='walk' else 260);profile[name]=round(max(limits[0],min(limits[1],value)),4)
  for id,look in review['looks'].items():
   if look['cls']!=cls:continue
   bank=D['heroes'][cls][name]if '-'not in id else P['costumes'][id]['banks'][name];bank['stride']=profile[name]
  profile[name+'Measurements']=samples
 gaits.append(dict(cls=cls,**profile))
review['gaits']=gaits;review['scaleMethod']='Physical neutral eye/boot baseline and constant combat clip scale from authored upright first/last guards. Independent head/body proportion and facial-pixel checks reject bad source anatomy; facial style matching never enlarges the standing body. Other actions retain constant source-head calibration; walking cannot exceed standing stature by more than 2 percent. No per-frame scaling, head edits or body warps.'
file.write_text(text[:start]+json.dumps(D,separators=(',',':'))+text[start+consumed:]);pf.write_text(prefix+'window.DungeonPremiumArtData='+json.dumps(P,separators=(',',':'))+';\n');write(R/'art-source/anatomy2206-review.json',review);write(R/'art-source/anatomy2206-head-pixels.json',read(R/'art-source/anatomy2206-head-pixels.json'));write(R/'art-source/anatomy2206-head-calibration.json',dict(version='2.20.6',method=review['scaleMethod'],looks=results,gaits=gaits));print('Calibrated',len(results),'looks; measured class gait profiles',[(q['walk'],q['run'])for q in gaits])

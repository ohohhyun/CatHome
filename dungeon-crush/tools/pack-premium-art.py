"""Authoring only: exact format conversion and read-only atlas geometry; never edits sprite pixels."""
from pathlib import Path
from PIL import Image
import json,hashlib,statistics,sys,argparse
from premium_atlas_geometry import cells
parser=argparse.ArgumentParser(description='Pack approved premium art without changing RGBA pixels. Existing approved WebPs fill unmapped keys.');parser.add_argument('--sources',required=True,help='JSON object mapping sheet keys to new image_gen PNG paths');parser.add_argument('--final',action='store_true');args=parser.parse_args()
root=Path(__file__).resolve().parents[1];assets=root/'app/src/main/assets';dest=assets/'art/premium';dest.mkdir(exist_ok=True)
plan=json.loads((root/'art-source/premium-plan.json').read_text());m={j['key']:str(dest/(j['key']+'.webp')) for j in plan['jobs'] if (dest/(j['key']+'.webp')).exists()};m.update(json.loads(Path(args.sources).read_text()));oldfile=root/'premium-art-sources.json';old={a['id']:a for a in json.loads(oldfile.read_text()).get('assets',[])} if oldfile.exists() else {};entries=[];banks={};reviews=[]
for job in plan['jobs']:
 key=job['key']
 if key not in m:continue
 src=Path(m[key]);digest=hashlib.sha256(src.read_bytes()).hexdigest();out=dest/(key+'.webp');im=Image.open(src).convert('RGBA');cols,rows=(4,6) if job.get('clip')=='movement' else (4,8) if job.get('clip')=='combat' else (8,6) if job['type']=='fx' else (4,4)
 reused=key in old and old[key]['sha256']==digest
 if not (key in old and (old[key]['originalSha256']==digest or reused) and out.exists() and hashlib.sha256(out.read_bytes()).hexdigest()==old[key]['sha256']):im.save(out,'WEBP',lossless=True,method=6,exact=True)
 assert Image.open(out).convert('RGBA').tobytes()==im.tobytes(),key+' lossless RGBA'
 alpha=im.getchannel('A');rects,rowcuts=cells(im,cols,rows,job['type']=='fx');frames=[];bounds=[];edges=[];corners=[];centers=[]
 for n,(x,y,w,h) in enumerate(rects):
  x2=x+w;y2=y+h;b=alpha.crop((x,y,x2,y2)).point(lambda v:255 if v>=100 else 0).getbbox();assert b,key+' empty frame '+str(n);bounds.append(b);cel=alpha.crop((x,y,x2,y2));top=b[3]-max(6,round((b[3]-b[1])*.08));mass=total=0
  for yy in range(top,b[3]):
   for xx in range(b[0],b[2]):
    value=cel.getpixel((xx,yy));weight=(value if value>=100 else 0)*(yy-top+1)**2;mass+=weight;total+=xx*weight
  centers.append(total/max(1,mass));frames.append([x,y,x2-x,y2-y,(x2-x)/2,b[3]]);corners.append(alpha.getpixel((x+3,y+3)))
  if min(b[0],b[1],x2-x-b[2],y2-y-b[3])<2:edges.append(n)
 review=dict(id=key,type=job['type'],edgeFrames=edges,cornerAlpha=corners,bounds=bounds,groundCenters=[round(v,3) for v in centers],cells=rects,rowCuts=rowcuts);reviews.append(review)
 entry=dict(id=key,file=str(out.relative_to(assets)),width=im.width,height=im.height,columns=cols,rows=rows,frames=cols*rows,cells=rects,rowCuts=rowcuts,sha256=hashlib.sha256(out.read_bytes()).hexdigest(),originalOutput=old[key]['originalOutput'] if reused else src.name,originalSha256=old[key]['originalSha256'] if reused else digest,tool='OpenAI image_gen',encoding='lossless WebP; exact decoded RGBA preserved',packaged=True)
 entries.append(entry);banks[key]=dict(src=entry['file'],frames=frames,width=im.width,height=im.height,cellHeight=im.height/rows,bounds=bounds,centers=centers)
data=dict(version=1,costumes={},pets={},effects={})
for o in plan['outfits']:
 key=o['id'];move=banks.get(key+'-movement');combat=banks.get(key+'-combat')
 if not move:continue
 reference=statistics.median(b[3]-b[1] for b in move['bounds'][8:12])*.94
 def bank(source,start,count,ref):
  indices=[0,7,8,15,16,23,24,31] if source is combat else [8,9,10,11];pivot=statistics.median(source['centers'][i] for i in indices)
  return dict(src=source['src'],frames=[r[:4]+[round(pivot,4),r[5],round(ref,4)] for r in source['frames'][start:start+count]],bounds=source['bounds'][start:start+count],reference=round(ref,4),facing=1)
 clips=dict(run=bank(move,0,8,reference),reaction=bank(move,8,8,reference),jump=bank(move,16,4,reference),dash=bank(move,20,4,reference))
 if combat:
  combatref=statistics.median(combat['bounds'][i][3]-combat['bounds'][i][1] for i in [0,7,8,15,16,23,24,31])*.94
  for i,k in enumerate(['combo0','combo1','combo2','cast']):clips[k]=bank(combat,i*8,8,combatref)
 data['costumes'][key]=dict(cls=o['cls'],theme=o['theme'],banks=clips,complete=bool(combat))
for pet in plan['pets']:
 if pet['id'] in banks:
  b=banks[pet['id']];ref=statistics.median(bb[3]-bb[1] for bb in b['bounds'][8:12])*.96;data['pets'][pet['id']]=dict(src=b['src'],frames=[r[:4]+[round(statistics.median(b['centers'][8:12]),4),r[5],round(ref,4)] for r in b['frames']],bounds=b['bounds'],facing=1,flying=pet['id'] in ['cinder-drake','aurora-griffin','clockwork-owl','star-jelly'])
for theme in plan['themes']:
 k='fx-'+theme['id']
 if k in banks:
  b=banks[k];# Uniform row crop removes authored safety padding without resizing each phase.
  effect_frames=[]
  for row in range(6):
   boxes=b['bounds'][row*8:row*8+8];left=max(0,min(v[0] for v in boxes)-12);top=max(0,min(v[1] for v in boxes)-12);right=min(b['frames'][row*8][2],max(v[2] for v in boxes)+12);bottom=min(b['frames'][row*8][3],max(v[3] for v in boxes)+12)
   for f in b['frames'][row*8:row*8+8]:effect_frames.append([f[0]+left,f[1]+top,right-left,bottom-top,(right-left)/2,(bottom-top)/2])
  data['effects'][theme['id']]=dict(src=b['src'],frames=effect_frames,columns=8,rows=6)
(assets/'premium-art-data.js').write_text('/* Authored premium outfit, companion and spell flipbooks. */\nwindow.DungeonPremiumArtData='+json.dumps(data,separators=(',',':'))+';\n')
oldfile.write_text(json.dumps(dict(version='2.14.0',generator='OpenAI image_gen',assets=entries),indent=2)+'\n');(root/'premium-art-review.json').write_text(json.dumps(dict(alphaBodyThreshold=100,assets=reviews),indent=2)+'\n')
if args.final:
 assert all(not r['edgeFrames'] and max(r['cornerAlpha'])<=2 for r in reviews),'Unresolved body edge or backing; do not finalize'
 assert len(entries)==75 and len(data['costumes'])==30 and all(v['complete'] for v in data['costumes'].values()) and len(data['pets'])==10 and len(data['effects'])==5
 manifest=json.loads((root/'generated-art-sources.json').read_text());manifest['assets']=[a for a in manifest['assets'] if not a['file'].startswith('art/premium/')]+entries;manifest['version']='2.14.0';manifest['premiumCharacterFrames']=1680;manifest['premiumPetFrames']=160;manifest['premiumEffectFrames']=240;(root/'generated-art-sources.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('PACKED',len(entries),'of75 sheets; complete costumes',sum(v['complete'] for v in data['costumes'].values()),'; edge review',[(r['id'],r['edgeFrames']) for r in reviews if r['edgeFrames']])

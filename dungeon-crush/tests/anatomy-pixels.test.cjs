/* Independent source-pixel/scale regression check for the reported big-head defect. */
const fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict'),pixels=require('./png-pixels.cjs');
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),root='app/src/main/assets/';
const M=read('generated-art-sources.json'),V=read('art-source/anatomy2206-review.json'),C=read('art-source/anatomy2206-head-calibration.json'),N=read('art-source/anatomy2206-head-pixels.json'),entries=new Map(M.assets.map(q=>[q.file,q])),head=new Map(N.map(q=>[q.id,q]));
assert.deepEqual(Object.values(V.heightCm),[185,170,200,165,160,190]);assert.equal(Object.keys(V.looks).length,36);assert.equal(C.looks.length,36);assert.equal(N.length,36);
const context={Image:class{set src(v){}}};context.window=context;vm.createContext(context);for(const file of ['actors','premium-art-data'])vm.runInContext(fs.readFileSync(root+file+'.js','utf8'),context);
let sourceFrames=0,bodyFrames=0,headSamples=0;const sourceImages=new Map();
for(const entry of M.assets.filter(q=>q.originalFile?.startsWith('art-source/anatomy2206/')&&q.cells)){
 const im=pixels(fs.readFileSync(entry.originalFile));assert.equal(im.channels,4);assert.equal(im.width,entry.width);assert.equal(im.height,entry.height);assert.equal(sha(entry.originalFile),entry.originalSha256);assert.equal(sha(root+entry.file),entry.sha256);const covered=new Uint8Array(im.width*im.height);
 for(const rect of entry.cells){const[x,y,w,h]=rect;let opaque=0;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const at=yy*im.width+xx;assert(!covered[at],entry.id+' disjoint whole-body cells');covered[at]=1;if(im.data[at*4+3]>200){opaque++;assert(xx-x>=2&&yy-y>=2&&x+w-1-xx>=2&&y+h-1-yy>=2,entry.id+' complete boots/weapon/head have source padding');}}assert(opaque>300,entry.id+' actual nonempty sprite');sourceFrames++;}
 for(let at=0;at<covered.length;at++)assert(covered[at]||im.data[at*4+3]<=2,entry.id+' no anatomy lost outside registered crops');sourceImages.set(entry.file,im);
}
const median=a=>{const v=[...a].sort((a,b)=>a-b);return v.length%2?v[Math.floor(v.length/2)]:(v[v.length/2-1]+v[v.length/2])/2;};
function adult(eye,mouth,sole){const unit=Math.hypot(eye[0]-mouth[0],eye[1]-mouth[1]);return(sole-eye[1])/unit>=18;}
for(const[id,look]of Object.entries(V.looks)){
 const basic=!id.includes('-'),banks=basic?context.DungeonActors.actors[look.cls]:context.DungeonPremiumArtData.costumes[id].banks,scan=head.get(id);assert(scan,id+' source head-pixel review');const neutral=look.banks.reaction[0];assert(neutral.face&&neutral.eye);assert(adult(neutral.eye,neutral.face.mouth,neutral.sole),id+' adult neutral anatomy, excluding hat/halo/weapon');
 const rb=banks.reaction.frames[0],neutralSrc=basic?banks.reaction.sources[0]:banks.reaction.src,ni=sourceImages.get(neutralSrc),nr=Array.from(basic?rb.slice(1,5):rb.slice(0,4));for(const p of [neutral.eye,neutral.face.mouth]){let opaque=0;for(let yy=Math.floor(p[1])-1;yy<=Math.ceil(p[1])+1;yy++)for(let xx=Math.floor(p[0])-1;xx<=Math.ceil(p[0])+1;xx++)if(xx>=0&&yy>=0&&xx<nr[2]&&yy<nr[3]&&ni.data[((nr[1]+yy)*ni.width+nr[0]+xx)*4+3]>200)opaque++;assert(opaque,id+' eye/mouth labels lie on actual opaque head pixels');}assert(Math.abs((neutral.sole-neutral.eye[1])/rb.at(-1)-V.commonEyeRatio)<1e-5,id+' canonical physical height');
 for(const[name,points]of Object.entries(look.banks)){
  const b=banks[name];if(name.startsWith('combo')||name==='cast'){
   const standing=(neutral.sole-neutral.eye[1])/rb.at(-1),headUnit=median(look.banks.reaction.slice(0,4).filter(p=>p.face).map(p=>p.face.unit/p.reference));
   for(const n of [0,7]){const point=points[n];assert(point.eye&&point.face,id+'/'+name+' both upright guards need actual facial pixel landmarks');const guard=(point.sole-point.eye[1])/b.frames[n].at(-1);assert(guard/standing>=.97&&guard/standing<=1.03,id+'/'+name+' standing body must retain physical height within 3%, without growing to fit a facial template');const relativeHead=point.face.unit/b.frames[n].at(-1)/headUnit;assert(relativeHead>=.85&&relativeHead<=1.15,id+'/'+name+' actual facial anatomy must remain within 15% of canonical head size at the same standing height');}
  }const src=basic?b.sources[0]:b.src,entry=entries.get(src),kind=['walk','run'].includes(name)?'locomotion':['reaction','jump','dash'].includes(name)?'movement':'combat';assert.equal(scan.sourceSha256[kind],entry.originalSha256,id+' head measurements are bound to these actual PNG pixels');assert.equal(points.length,b.frames.length);
  const scales=new Map();for(const point of points){const r=b.frames[point.frame],ref=r.at(-1);assert(Number.isFinite(ref)&&ref>80);assert.equal(ref,point.reference);if(scales.has(point.rawSha256))assert.equal(scales.get(point.rawSha256),ref,id+'/'+name+' uses a constant clip scale, no frame-by-frame pumping');else scales.set(point.rawSha256,ref);const rect=basic?r.slice(1,5):r.slice(0,4);assert.deepEqual(Array.from(rect),entry.cells[point.sourceFrame]);bodyFrames++;}
  for(const rawSha of scales.keys()){
   const calibration=look.clipCalibration.find(q=>q.bank===name&&q.rawSha256===rawSha);assert(calibration);assert.equal(scales.get(rawSha),calibration.reference);assert.equal(calibration.reference,Math.round(calibration.originalReference*calibration.factor*1e6)/1e6);
   const indices=new Set(points.filter(p=>p.rawSha256===rawSha).map(p=>p.frame)),samples=scan.rows.filter(q=>q.bank===name&&indices.has(q.frame)&&q.score>=.7&&q.scale>.65&&q.scale<1.4);headSamples+=samples.length;if(name==='reaction'||name.startsWith('combo')||name==='cast'||samples.length<2)continue;const values=samples.map(q=>q.scale/calibration.factor).sort((a,b)=>a-b),median=values.length%2?values[Math.floor(values.length/2)]:(values[values.length/2-1]+values[values.length/2])/2;assert(Math.abs(median-1)<.08,id+'/'+name+' actual head pixels retain the canonical world size');
  }
 }
}
// Real source eyes must follow a smooth root: hip-detection failures used to shift
// faces by tens of pixels, and anchoring to a tucked knee bounced whole bodies.
let rejectedOldHipRoot=false;
for(const[id,look]of Object.entries(V.looks)){
 const banks=id.includes('-')?context.DungeonPremiumArtData.costumes[id].banks:context.DungeonActors.actors[look.cls];
 for(const name of ['walk','run']){
  const points=look.banks[name],b=banks[name],x=[],y=[];
  for(const p of points){const r=b.frames[p.frame],k=260/r.at(-1);x.push((p.eye[0]-r.at(-3))*k);y.push((p.eye[1]-r.at(-2))*k);assert((p.sole-r.at(-2))*k<=.001,id+'/'+name+' support foot never sinks below the floor');}
  assert(Math.max(...x)-Math.min(...x)<.001,id+'/'+name+' no horizontal head jitter from alternating hip/face roots');
  assert(Math.max(...y)-Math.min(...y)<20,id+'/'+name+' controlled body rise rather than knee-based bouncing');
  const legacy=points.map(p=>(p.eye[0]-(p.hip?.[0]??p.eye[0]))*260/p.reference);if(Math.max(...legacy)-Math.min(...legacy)>30)rejectedOldHipRoot=true;
 }
}
assert(rejectedOldHipRoot,'actual source poses demonstrate the previous hip/fallback registration defect');
assert.equal(bodyFrames,2328);assert.equal(sourceFrames,2640);assert(headSamples>1000,'actual independent head pixels cover the entire roster');
// The exact previously shipped Sera image must fail the same policy; a matrix-only test missed it.
const controls=read('tests/fixtures/anatomy2206/negative-controls.json');const bad=controls.find(q=>q.id==='reported-sera-aurora');assert.equal(sha(bad.file),bad.sha256);assert(!adult(bad.eye,bad.mouth,bad.sole),'reported old big-head source is a real negative control');const normalHead=V.looks['sera-aurora'].banks.reaction[0],relativeBad=Math.hypot(bad.eye[0]-bad.mouth[0],bad.eye[1]-bad.mouth[1])/(bad.sole-bad.eye[1])/(normalHead.face.unit/(normalHead.sole-normalHead.eye[1]));assert(relativeBad>1.15,'standing-height normalization alone must not hide the exact previously reported oversized head');
function palette(im,rect,chin,sole){let total=0,red=0,white=0;const[x,y,w,h]=rect;for(let yy=Math.max(0,Math.ceil(chin));yy<=Math.min(h-1,Math.floor(sole));yy++)for(let xx=0;xx<w;xx++){const at=((y+yy)*im.width+x+xx)*4;if(im.data[at+3]<=200)continue;const r=im.data[at],g=im.data[at+1],b=im.data[at+2];total++;if(r>g*1.35&&r>b*1.35&&r>80)red++;if(Math.max(r,g,b)-Math.min(r,g,b)<50&&(r+g+b)/3>120)white++;}assert(total>100);return{red:red/total,white:white/total};}
const golden=V.looks['kael-aurora'],gb=context.DungeonPremiumArtData.costumes['kael-aurora'].banks,gp=golden.banks.reaction[0],gr=Array.from(gb.reaction.frames[0]),canonical=palette(sourceImages.get(gb.reaction.src),gr.slice(0,4),Math.max(...gp.face.boxQuad.map(p=>p[1])),gp.sole);
for(const name of ['combo0','combo1','combo2','cast'])for(const n of [0,7]){const point=golden.banks[name][n],r=Array.from(gb[name].frames[n]);if(!point.face)continue;const actual=palette(sourceImages.get(gb[name].src),r.slice(0,4),Math.max(...point.face.boxQuad.map(p=>p[1])),point.sole);assert(actual.red<=canonical.red+.18,'Aurora must not change into a red coat during '+name);assert(actual.white>=canonical.white*.45,'Aurora white/gold armor remains visible during '+name);}
const wrong=controls.find(q=>q.id==='unapproved-kael-aurora-red');assert.equal(sha(wrong.file),wrong.sha256);const wi=pixels(fs.readFileSync(wrong.file)),wrongPalette=palette(wi,[0,0,wi.width,wi.height],wrong.faceBottom,wrong.sole);assert(wrongPalette.red>canonical.red+.18&&wrongPalette.white<canonical.white*.45,'real unreleased wrong-costume fixture is rejected');
console.log('PASS: 108 RGBA atlases / 2,640 complete source cels, 2,328 active hero poses, 36 adult neutral bodies, exact height profiles, '+headSamples+' independent source-head pixel samples, constant per-clip anatomy scale and the previously reported Sera negative control.');

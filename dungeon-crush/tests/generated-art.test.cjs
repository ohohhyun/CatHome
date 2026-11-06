const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root='app/src/main/assets/',manifest=JSON.parse(fs.readFileSync('generated-art-sources.json','utf8')),assets=new Map(manifest.assets.map(a=>[a.file,a]));
assert.equal(manifest.characterFrames,80);assert.equal(manifest.effectFrames,48);assert.equal(assets.size,7);
for(const a of assets.values()){const b=fs.readFileSync(root+a.file);assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(b.readUInt32BE(16),a.width);assert.equal(b.readUInt32BE(20),a.height);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),a.sha256,'original generated output stays intact');}
const c={window:{},Image:class{set src(path){const a=assets.get(path);assert(a,path);this.width=this.naturalWidth=a.width;this.height=this.naturalHeight=a.height;this.onload();}}};c.window=c;vm.createContext(c);for(const n of ['rpg','engine','sprite-art'])vm.runInContext(fs.readFileSync(root+n+'.js','utf8'),c);const A=c.DungeonArt;assert(A.ready());assert.equal(A.status().actors,4);assert.equal(A.status().effects,3);
for(const [cls,a]of A.actors.entries()){
 const meta=assets.get(a.src);assert.equal(a.frames.length,20);assert(a.reference>100);
 for(const [x,y,w,h,ax,ay]of a.frames){assert(x>=0&&y>=0&&x+w<=meta.width&&y+h<=meta.height);assert(w>20&&h>30);assert(Number.isFinite(ax)&&Number.isFinite(ay));}
 const p=c.Rift.player(0,'프레임',cls);let frames=new Set();p.action='run';for(let i=0;i<40;i++){p.gait=i/40*Math.PI*2;const f=A.frame(p,0);assert.equal(f.row,1);frames.add(f.index);}assert.equal(frames.size,4,'distance-driven running uses four distinct drawn poses');
 for(const action of ['basic','cone']){p.action=action;p.actionDuration=.45;frames.clear();for(let i=0;i<30;i++){p.at=.45*(1-i/30);const f=A.frame(p,0);assert.equal(f.row,action==='basic'?2:3);frames.add(f.index);}assert.equal(frames.size,4);}
 p.at=0;p.action='idle';p.jump=.36;assert.equal(A.frame(p,0).state,'jump');assert(A.frame(p,0).rise<-.3);p.jump=0;p.landing=.1;assert.equal(A.frame(p,0).state,'landing');p.landing=0;p.hp=0;assert.equal(A.frame(p,0).state,'down');
}
assert(!fs.readFileSync(root+'engine.js','utf8').includes('DungeonArt'),'cosmetic asset loader never changes authoritative combat');console.log('PASS: seven original GPT PNGs with SHA/dimensions, 80 bounded actor frames, 48 VFX frames, actual run/attack/skill/jump/landing/down selection and gameplay/render separation.');

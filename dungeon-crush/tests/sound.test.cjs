const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const manifest=JSON.parse(fs.readFileSync('combat-audio-sources.json'));
assert.equal(manifest.assets.filter(a=>a.kind==='voice').length,21);
assert.equal(manifest.assets.filter(a=>a.kind==='effect').length,15);
for(const a of manifest.assets){const bytes=Buffer.from(fs.readFileSync('audio-source/'+a.source,'utf8').trim(),'base64');assert.equal(bytes.length,a.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);assert.equal(bytes.toString('ascii',0,4),'OggS');assert.equal(a.license,'CC0-1.0');if(a.kind==='voice')assert(a.duration>.15&&a.duration<1.5);}
function fixture(saved={}){
 let now=0,id=0;const timers=new Map(),audios=[],storage={dungeonCrushAudio:JSON.stringify(saved)};
 class Audio{constructor(src){this.src=src;this.paused=true;this.ended=false;this.currentTime=0;this.volume=1;this.readyState=4;this.duration=manifest.assets.find(a=>src.endsWith(a.file))?.duration||.4;this.plays=0;audios.push(this);}play(){this.paused=false;this.ended=false;this.plays++;return Promise.resolve();}pause(){this.paused=true;}load(){}removeAttribute(k){delete this[k];}}
 function step(next){const dt=(next-now)/1000;for(const a of audios)if(!a.paused){a.currentTime+=dt*(a.playbackRate||1);if(a.currentTime>=a.duration){if(a.loop)a.currentTime%=a.duration;else{a.ended=true;a.paused=true;}}}now=next;}
 function advance(ms){const end=now+ms;for(;;){const entry=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!entry)break;timers.delete(entry[0]);step(entry[1].at);entry[1].fn();}step(end);}
 const c={Audio,performance:{now:()=>now},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},setTimeout:(fn,ms)=>{timers.set(++id,{fn,at:now+ms});return id;},clearTimeout:n=>timers.delete(n),Math:Object.assign(Object.create(Math),{random:()=>.17}),RiftApp:{getClass:()=>0}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('app/src/main/assets/sound.js','utf8'),c);
 return {s:c.DungeonSound,c,advance,audios,storage};
}
function game(cls=0){return {runId:'run-'+cls,kind:'story',room:1,players:[{id:0,cls,hp:100,x:0,action:'idle'}],enemies:[],fx:[]};}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const f=fixture({music:.42,sfx:.35}),S=f.s;
 assert.equal(S.settings().voice,.25,'existing two-slider settings migrate');assert.equal(f.audios.reduce((n,a)=>n+a.plays,0),0,'no autoplay before gesture');
 S.unlock();S.scene('battle');f.advance(600);assert.equal(S.state().track,'battle');assert(Math.abs(S.state().musicLevels.battle-.42)<.001);
 for(let cls=0;cls<6;cls++){
  S.scene('town');S.scene('battle');const g=game(cls);S.observe(g);const heard=[];
  for(let n=1;n<=7;n++){f.advance(3000);g.fx.push({id:n,type:'playerwind',owner:0,cls,index:1,code:1,x:0,stage:0});const before=JSON.stringify(g);S.observe(g);await flush();assert.equal(JSON.stringify(g),before,'audio reads game state without mutation');const v=S.state().heard.filter(x=>x.startsWith('voice-')).at(-1);assert(v.includes(['kael','rin','bane','sera','aria','elian'][cls]));assert.notEqual(v,heard.at(-1),'no immediate repeat across a shuffled bag');heard.push(v);const count=S.state().played;S.observe(g);await flush();assert.equal(S.state().played,count,'snapshot replay produces no duplicate sound');assert.equal(S.state().activeVoices,1);assert(f.audios.filter(a=>a._channel==='voice'&&!a.paused).every(a=>a.volume<=.21&&a.preservesPitch&&a.playbackRate>=.98&&a.playbackRate<=1.02));}
 }
 f.advance(3000);const g=game(0);S.observe(g);await flush();let voices=f.audios.filter(a=>a._channel==='voice').reduce((n,a)=>n+a.plays,0);
 for(let n=1;n<20;n++){g.fx.push({id:n,type:'playerwind',owner:0,cls:0,index:0,code:0,x:0,stage:n%2});S.observe(g);f.advance(90);}await flush();assert.equal(f.audios.filter(a=>a._channel==='voice').reduce((n,a)=>n+a.plays,0),voices,'ordinary held attacks do not chant on every hit');
 f.advance(3000);g.fx.push({id:30,type:'playerwind',owner:0,cls:0,index:0,code:0,x:0,stage:2});S.observe(g);await flush();assert.equal(S.state().activeVoices,1,'strong combo can trigger effort');
 S.set('voice',0);assert.equal(S.state().activeVoices,0);assert.equal(S.play('voice-kael-1'),false);assert(S.play('gun-shot',.6),'voice mute keeps skill effects');assert.equal(JSON.parse(f.storage.dungeonCrushAudio).voice,0);
 S.set('voice',.6);f.advance(4000);g.players.push({id:1,cls:1,hp:100,x:100,action:'idle'},{id:2,cls:3,hp:100,x:300,action:'idle'},{id:3,cls:5,hp:100,x:400,action:'idle'});
 g.fx=Array.from({length:40},(_,n)=>({id:100+n,type:n<4?'playerwind':'hit',owner:n%4,cls:g.players[n%4].cls,index:1,code:1,x:100,stage:2}));S.observe(g);assert(S.state().activeVoices<=1);assert(S.state().activeEffects<=11,'four-player burst has a bounded mixer');
 S.pause(true);assert(f.audios.every(a=>a.paused));S.pause(false);f.advance(600);assert.equal(S.state().track,'battle');
 g.enemies=[{type:'boss',hp:10}];S.observe(g);assert.equal(S.state().track,'boss');f.advance(250);assert(S.state().musicLevels.battle>0&&S.state().musicLevels.boss>0,'music crossfades');f.advance(400);assert.equal(S.state().musicLevels.battle,0);const boss=f.audios.find(a=>a.src==='audio/boss.ogg'),starts=boss.plays;
 for(let i=0;i<100;i++)S.observe(g);assert.equal(boss.plays,starts,'boss loop does not restart each frame');g.enemies[0].hp=0;S.observe(g);assert.equal(S.state().track,'boss','music stays through boss-room cleanup');
 S.pause(true);const position=boss.currentTime;assert(boss.paused);S.pause(false);f.advance(600);assert.equal(S.state().track,'boss');assert(boss.currentTime>=position,'resume retains boss playback position');
 S.set('music',0);assert(f.audios.filter(a=>a.loop).every(a=>a.paused));S.set('music',.5);f.advance(600);assert.equal(S.state().track,'boss');
 g.room=2;g.enemies=[];S.observe(g);f.advance(600);assert.equal(S.state().track,'battle');g.enemies=[{type:'boss',hp:1}];S.observe(g);f.advance(600);g.runId='new-pvp';g.kind='pvp';S.observe(g);f.advance(600);assert.equal(S.state().track,'battle','PVP never inherits boss music');S.scene('town');f.advance(600);assert.equal(S.state().track,'town');assert.equal(S.state().activeEffects,0);
 S.scene('battle');g.runId='boss-fallback';g.kind='story';g.enemies=[{type:'boss',hp:10}];S.observe(g);assert.equal(S.state().track,'boss');boss.onerror();f.advance(600);assert.equal(S.state().track,'battle','unavailable boss audio falls back to normal battle music');assert.equal(S.state().bossFallback,true);
 const c={};c.window=c;vm.createContext(c);for(const name of ['rpg','engine'])vm.runInContext(fs.readFileSync('app/src/main/assets/'+name+'.js','utf8'),c);const state=c.Rift.create(),p=c.Rift.player(3,'party',2);state.players=[p];assert(c.Rift.attack(state,p,0));assert.equal(state.fx.find(f=>f.type==='playerwind').owner,3,'accepted attacks carry exact voice ownership');
 console.log('PASS: 37 licensed/pinned offline assets; six class voices, shuffled non-repeating effort/cooldowns, real owner tags, read-only observation, independent voice mute, bounded four-player audio, boss crossfade/loop/pause/mute/cleanup/new-run/PVP transitions.');
})().catch(e=>{console.error(e);process.exit(1);});

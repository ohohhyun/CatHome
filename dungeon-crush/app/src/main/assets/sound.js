/* Offline recordings and authored combat transients. No runtime downloads or speech synthesis. */
(function(root){'use strict';
const files={click:'click.wav',confirm:'confirm.wav',select:'select.wav',swing:'slash1.ogg',town:'town.ogg',battle:'battle.mp3',boss:'boss.ogg',hit:'metal1.ogg',hurt:'soft.ogg',block:'plate.ogg',charge:'glass.ogg',step:'step.ogg',slash1:'slash1.ogg',slash2:'slash2.ogg',draw:'draw.ogg',cloth1:'cloth1.ogg',cloth2:'cloth2.ogg',chop:'chop.ogg',punch1:'punch1.ogg',punch2:'punch2.ogg',metal1:'metal1.ogg',metal2:'metal2.ogg',glass:'glass.ogg',plate:'plate.ogg',soft:'soft.ogg',potion:'potion.ogg'};
const effects=['blade-wave','spear-wind','fist-crack','earth-break','gun-shot','gun-blast','arc-chain','fire-cast','ice-break','arcane-wave','holy-cast','holy-hit','holy-heal','ward-rise','ultimate-burst'];
for(const name of effects)files[name]=name+'.ogg';
const roles=['kael','rin','bane','sera','aria','elian'],voiceCounts=[4,3,4,3,3,4];
for(let cls=0;cls<6;cls++)for(let n=1;n<=voiceCounts[cls];n++)files['voice-'+roles[cls]+'-'+n]='voice-'+roles[cls]+'-'+n+'.ogg';
const classEffects=[['blade-wave','fire-cast'],['spear-wind','ice-break'],['fist-crack','earth-break'],['gun-shot','gun-blast','arc-chain'],['fire-cast','ice-break','arc-chain','arcane-wave'],['holy-cast','holy-hit','holy-heal']];
let settings={music:.38,sfx:.7,voice:.25,shake:true,reducedEffects:false};
try{settings={...settings,...JSON.parse(localStorage.getItem('dungeonCrushAudio')||'{}')};}catch{}
for(const k of ['music','sfx','voice'])settings[k]=Math.max(0,Math.min(1,Number(settings[k])||0));
settings.reducedEffects=settings.reducedEffects===true;
let bossFailed=false,unlocked=false,suspended=false,scene='town',track=null,bossRoom='',lastRun='',lastFx=-1,lastStep=0,played=0,fadeTimer=0,duckTimer=0,duckUntil=0,lastVoiceAt=-10000,lastVoiceOwner=-1;
const music={},pools={},times={},heard=[],voiceTimes=new Map(),voiceBags=new Map();
function make(key){const a=new Audio('audio/'+files[key]);a.preload='auto';return a;}
for(const k of ['town','battle','boss']){music[k]=make(k);music[k].loop=true;music[k].volume=0;}
music.boss.onerror=()=>{bossFailed=true;if(track==='boss')sync();};
function save(){try{localStorage.setItem('dungeonCrushAudio',JSON.stringify(settings));}catch{}}
function active(a){return !a.paused&&!a.ended;}
function stopEffects(){for(const pool of Object.values(pools))for(const a of pool){a.pause();try{a.currentTime=0;}catch{}}clearTimeout(duckTimer);duckUntil=0;}
function trimCache(){if(Object.keys(pools).length<30)return;const key=Object.keys(pools).filter(k=>pools[k].every(a=>!active(a))).sort((a,b)=>(times[a]||0)-(times[b]||0))[0];if(key){for(const a of pools[key]){a.pause();a.removeAttribute('src');a.load();}delete pools[key];}}
function play(key,volume=1,rate=1,owner=-1){
 const channel=key.startsWith('voice-')?'voice':'sfx';
 if(!unlocked||suspended||!settings[channel]||!files[key])return false;
 const now=performance.now(),limit=key==='step'?150:channel==='voice'?300:['click','select','confirm'].includes(key)?35:effects.includes(key)?100:65;
 if(now-(times[key]??-1000)<limit)return false;
 const all=Object.values(pools).flat().filter(active),voices=all.filter(a=>a._channel==='voice');
 if(channel==='voice'){if(voices.length)return false;}else if(all.filter(a=>a._channel!=='voice').length>=10)return false;
 if(!pools[key]){trimCache();pools[key]=[];}
 const pool=pools[key];let a=pool.find(a=>!active(a));
 if(!a){if(pool.length>=(channel==='voice'?1:2))return false;a=make(key);pool.push(a);}
 a._channel=channel;a._gain=Math.max(0,Math.min(1,volume));a._owner=owner;
 a.volume=Math.max(0,Math.min(1,settings[channel]*a._gain));a.playbackRate=channel==='voice'?Math.max(.98,Math.min(1.02,rate)):Math.max(.55,Math.min(1.6,rate));a.preservesPitch=channel==='voice';
 try{a.currentTime=0;const promise=a.play();promise?.then(()=>{played++;heard.push(key);if(heard.length>96)heard.shift();}).catch(()=>{});}catch{return false;}
 times[key]=now;return true;
}
function sync(){
 clearTimeout(fadeTimer);
 const desired=!unlocked||suspended||settings.music===0?null:scene==='battle'&&bossRoom&&!bossFailed?'boss':scene;
 if(!desired){for(const a of Object.values(music)){a.pause();a.volume=0;}track=null;return;}
 const starts=Object.fromEntries(Object.entries(music).map(([k,a])=>[k,a.volume])),started=performance.now();
 track=desired;if(music[desired].paused)music[desired].play().catch(()=>{});
 function fade(){const t=Math.min(1,(performance.now()-started)/550),gain=settings.music*(performance.now()<duckUntil?.85:1);for(const [k,a]of Object.entries(music)){const goal=k===desired?gain:0;a.volume=Math.max(0,Math.min(1,starts[k]+(goal-starts[k])*t));if(t===1&&k!==desired)a.pause();}if(t<1)fadeTimer=setTimeout(fade,20);}
 fade();
}
function warmClass(cls){if(!unlocked||!Number.isInteger(cls)||cls<0||cls>5)return;const keys=[...classEffects[cls],'ward-rise','ultimate-burst'];for(let i=1;i<=voiceCounts[cls];i++)keys.push('voice-'+roles[cls]+'-'+i);for(const key of keys)if(!pools[key]){trimCache();pools[key]=[make(key)];}}
function unlock(){if(!unlocked)for(const key of ['slash1','slash2','punch1','punch2','metal1','metal2','glass','plate','cloth1','cloth2','chop','potion'])pools[key]=[make(key)];unlocked=true;suspended=false;warmClass(root.RiftApp?.getClass()??0);sync();}
function change(next){const value=next==='battle'?'battle':'town';if(scene!==value){stopEffects();bossRoom='';}scene=value;suspended=false;sync();}
function chooseVoice(cls){let state=voiceBags.get(cls);if(!state){state={bag:[],last:''};voiceBags.set(cls,state);}if(!state.bag.length){state.bag=Array.from({length:voiceCounts[cls]},(_,i)=>'voice-'+roles[cls]+'-'+(i+1));for(let i=state.bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.bag[i],state.bag[j]]=[state.bag[j],state.bag[i]];}if(state.bag.at(-1)===state.last)[state.bag[0],state.bag[state.bag.length-1]]=[state.bag.at(-1),state.bag[0]];}const key=state.bag.pop();state.last=key;return key;}
function effort(f,owner,myId,volume){
 if(!owner||owner.hp<=0||scene!=='battle'||!unlocked||suspended||!settings.voice)return;
 const now=performance.now(),local=owner.id===myId,code=f.code??f.index??0;
 if(now-(voiceTimes.get(owner.id)??-10000)<(local?2600:4800))return;
 if(!code&&(!local||f.stage!==2||Math.random()>.55))return;
 if(!local&&(volume<.25||now-lastVoiceAt<1800||Math.random()>.25))return;
 const activeVoices=Object.values(pools).flat().filter(a=>a._channel==='voice'&&active(a));
 if(activeVoices.some(a=>a._owner===myId)||now-lastVoiceAt<900&&lastVoiceOwner===myId)return;
 if(local)for(const a of activeVoices)a.pause();else if(activeVoices.length)return;
 const cls=owner.cls,key=chooseVoice(cls),gain=local?[.78,.72,.82,.7,.62,.7][cls]:.25*volume;
 if(play(key,gain,1+(Math.random()-.5)*.018,owner.id)){voiceTimes.set(owner.id,now);lastVoiceAt=now;lastVoiceOwner=owner.id;duckUntil=now+1000;clearTimeout(duckTimer);sync();duckTimer=setTimeout(sync,1020);}
}
function skillEffect(f,cls,volume,variation){const type=f.type,index=f.index||0;
 if(type==='ultimate'){play('ultimate-burst',.64*volume,.96);play(classEffects[cls].at(-1),.32*volume,.9);return;}
 if(type==='heal'){play(cls===5?'holy-heal':'holy-cast',.58*volume,variation);return;}
 if(type==='shield'){play('ward-rise',.48*volume,variation);return;}
 if(cls===0)play(type==='circle'?'fire-cast':'blade-wave',.6*volume,variation);
 else if(cls===1)play(index===4||type==='circle'?'ice-break':'spear-wind',.56*volume,variation);
 else if(cls===2)play(['circle','pull'].includes(type)?'earth-break':'fist-crack',.63*volume,variation);
 else if(cls===3)play(type==='chain'?'arc-chain':'gun-blast',.6*volume,variation);
 else if(cls===4)play(type==='chain'?'arc-chain':index===2?'ice-break':type==='pull'?'arcane-wave':'fire-cast',.56*volume,variation);
 else play(type==='circle'?'holy-cast':'holy-hit',.58*volume,variation);
}
function observe(game,myId=0){
 let moodChanged=false;
 if(lastRun!==game.runId){stopEffects();lastVoiceOwner=-1;lastFx=-1;lastRun=game.runId;moodChanged=true;bossRoom='';voiceTimes.clear();lastVoiceAt=-10000;try{music.boss.currentTime=0;}catch{}}
 if(scene==='battle'&&game.kind!=='pvp'){
  const room=String(game.runId)+':'+game.room,isBoss=game.enemies?.some(e=>e.type==='boss'&&e.hp>0);
  if(isBoss&&bossRoom!==room){bossRoom=room;moodChanged=true;}else if(bossRoom&&bossRoom!==room){bossRoom='';moodChanged=true;}
 }
 if(moodChanged)sync();
 const local=game.players.find(p=>p.id===myId);let impacts=0;
 for(const f of game.fx.filter(f=>f.id>lastFx)){
  lastFx=Math.max(lastFx,f.id);const owner=game.players.find(p=>p.id===f.owner),cls=f.cls??owner?.cls??0,distance=local?Math.abs(f.x-local.x):0,volume=(f.owner===myId?1:.43)*Math.max(.12,1-distance/1800),variation=1+((f.id%5)-2)*.025,heavy=f.stage===2,index=f.index||0;
  if(f.type==='playerwind'){
   effort(f,owner,myId,volume);
   if(cls===4||cls===5)play('cloth2',.3*volume,.85);else if(cls===3)play('draw',.25*volume,variation);else play(cls===2?'cloth1':f.id%2?'slash1':'slash2',.55*volume,variation*(cls===1?1.12:.92));
  }else if(f.type==='muzzle'){
   if(f.caster)play('cloth2',.3*volume,.68);else play(cls===3?'gun-shot':index===1?'fire-cast':cls===5?'holy-cast':'arcane-wave',.62*volume,variation);
  }else if(f.type==='hit'){
   if(impacts++>=3)continue;
   play(cls===2?'fist-crack':cls===5?'holy-hit':cls===4?(index===2?'ice-break':'glass'):cls===3?'metal2':f.id%2?'metal1':'metal2',volume*(heavy?.7:.48),variation);
   if(heavy||f.crit)play('soft',.28*volume,.88);
  }else if(['basic','cone','line','lift','rush','circle','pull','chain','ultimate','heal','shield'].includes(f.type)){
   if(index>0||heavy||['heal','shield','ultimate'].includes(f.type))skillEffect(f,cls,volume,variation);
   else if(cls===5)play('holy-hit',.4*volume,variation);
  }else if(f.type==='hurt')play('soft',f.owner===myId?.6:.2,.85);
  else if(f.type==='impact')play('earth-break',.33*volume,.9);
  else if(f.type==='dash')play('cloth1',.5*volume,1.12);
 }
 if(local?.action==='run'&&performance.now()-lastStep>270){lastStep=performance.now();play('step',.22,1+(local.id%3)*.04);}
}
function pause(value=true){suspended=value;if(value)stopEffects();sync();}
function set(key,value){if(['shake','reducedEffects'].includes(key))settings[key]=!!value;else if(['music','sfx','voice'].includes(key))settings[key]=Math.max(0,Math.min(1,Number(value)||0));else return;save();if(key==='sfx'||key==='voice')for(const pool of Object.values(pools))for(const a of pool)if(a._channel===key){a.volume=settings[key]*a._gain;if(!settings[key])a.pause();}sync();}
root.DungeonSound={isReducedEffects:()=>settings.reducedEffects,unlock,play,scene:change,observe,pause,set,warmClass,settings:()=>({...settings}),state:()=>({unlocked,suspended,track,played,currentTime:track?music[track].currentTime:0,ready:music[track||scene].readyState,duration:music[track||scene].duration,heard:[...heard],combatSamples:29,voiceSamples:21,bossRoom,bossFallback:bossFailed,activeEffects:Object.values(pools).flat().filter(active).length,activeVoices:Object.values(pools).flat().filter(a=>a._channel==='voice'&&active(a)).length,musicLevels:Object.fromEntries(Object.entries(music).map(([k,a])=>[k,a.volume]))})};
})(window);

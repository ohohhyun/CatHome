/* Offline CC0 foley: attacks never use interface switch/confirmation recordings. */
(function(root){'use strict';
const files={click:'click.wav',confirm:'confirm.wav',select:'select.wav',swing:'slash1.ogg',town:'town.ogg',battle:'battle.mp3',hit:'metal1.ogg',hurt:'soft.ogg',block:'plate.ogg',charge:'glass.ogg',step:'step.ogg',slash1:'slash1.ogg',slash2:'slash2.ogg',draw:'draw.ogg',cloth1:'cloth1.ogg',cloth2:'cloth2.ogg',chop:'chop.ogg',punch1:'punch1.ogg',punch2:'punch2.ogg',metal1:'metal1.ogg',metal2:'metal2.ogg',glass:'glass.ogg',plate:'plate.ogg',soft:'soft.ogg',potion:'potion.ogg'};
let settings={music:.38,sfx:.7,shake:true};try{settings={...settings,...JSON.parse(localStorage.getItem('dungeonCrushAudio')||'{}')};}catch{}for(const k of ['music','sfx'])settings[k]=Math.max(0,Math.min(1,Number(settings[k])||0));
let unlocked=false,suspended=false,scene='town',track=null,played=0,lastFx=-1,lastRun='',lastStep=0;const pools={},times={},music={},heard=[];
function make(key){const a=new Audio('audio/'+files[key]);a.preload='auto';return a;}
for(const k of ['town','battle']){music[k]=make(k);music[k].loop=true;}
function save(){try{localStorage.setItem('dungeonCrushAudio',JSON.stringify(settings));}catch{}}
function play(key,volume=1,rate=1){if(!unlocked||suspended||!settings.sfx||!files[key])return;const now=performance.now(),limit=key==='step'?150:['click','select','confirm'].includes(key)?35:65;if(now-(times[key]??-1000)<limit)return;const voices=Object.values(pools).flat().filter(a=>!a.paused&&!a.ended);if(voices.length>=12)return;times[key]=now;const pool=pools[key]||(pools[key]=[]);let a=pool.find(a=>a.paused||a.ended);if(!a){if(pool.length>=3)return;a=make(key);pool.push(a);}a.volume=Math.max(0,Math.min(1,settings.sfx*volume));a.playbackRate=Math.max(.55,Math.min(1.6,rate));a.preservesPitch=false;a.currentTime=0;a.play().then(()=>{played++;heard.push(key);if(heard.length>64)heard.shift();}).catch(()=>{});}
function sync(){const desired=!unlocked||suspended||settings.music===0?null:scene;for(const [key,a]of Object.entries(music)){a.volume=settings.music;if(key!==desired)a.pause();}track=desired;if(track)music[track].play().catch(()=>{});}
function unlock(){if(!unlocked)for(const key of ['slash1','slash2','punch1','punch2','metal1','metal2','glass','plate','cloth1','cloth2','chop','potion'])pools[key]=[make(key)];unlocked=true;suspended=false;sync();}
function change(next){scene=next==='battle'?'battle':'town';suspended=false;sync();}
function observe(game,myId=0){if(lastRun!==game.runId){lastFx=-1;lastRun=game.runId;}const local=game.players.find(p=>p.id===myId);for(const f of game.fx.filter(f=>f.id>lastFx)){lastFx=Math.max(lastFx,f.id);const owner=game.players.find(p=>p.id===f.owner),cls=f.cls??owner?.cls??0,distance=local?Math.abs(f.x-local.x):0,volume=(f.owner===myId?1:.48)*Math.max(.15,1-distance/1800),variation=1+((f.id%5)-2)*.035,heavy=f.stage===2||f.type==='ultimate',index=f.index||0;
 if(f.type==='playerwind'){if(cls===4)play('cloth2',.42*volume,variation*.83);else if(cls===3)play(index>=2?'cloth2':'draw',.30*volume,variation*(index>=2?.72:1.1));else play(f.id%2?'slash1':'slash2',.75*volume,variation*(cls===2?.78:cls===1?1.12:.92));}
 else if(f.type==='muzzle'){if(cls===4&&!f.caster){play('glass',.65*volume,index===1?.75:1.15);play('cloth1',.3*volume,.8);}else if(f.caster)play('cloth2',.38*volume,.68);else{play('punch2',.65*volume,variation*1.3);play('metal2',.24*volume,variation*1.15);}}
 else if(f.type==='hit'){play(cls===2?(heavy?'punch1':'punch2'):cls>=3?'glass':f.id%2?'metal1':'metal2',volume*(heavy?.95:.72),variation*(heavy?.78:1));if(heavy||f.crit)play('soft',.55*volume,.78);}
 else if(['basic','cone','line','lift','rush'].includes(f.type)&&cls<3){if(index>0||heavy)play(cls===2?'punch1':'chop',.65*volume,variation*.82);}
 else if(['circle','pull','chain','ultimate'].includes(f.type)){play(cls===2?'punch1':cls===0?'chop':'glass',.85*volume,variation*(f.type==='ultimate'?.62:.83));play('plate',.34*volume,f.type==='ultimate'?.6:.83);}
 else if(f.type==='hurt')play('soft',f.owner===myId?.8:.28,.85);
 else if(f.type==='shield')play('plate',.4*volume,.8);
 else if(f.type==='heal'){play('potion',.85*volume,.95);play('cloth1',.3*volume,.8);}
 else if(f.type==='impact')play('punch1',.5*volume,.72);
 else if(f.type==='dash')play('cloth1',.6*volume,1.12);
 }
 if(local?.action==='run'&&performance.now()-lastStep>270){lastStep=performance.now();play('step',.25,1+(local.id%3)*.04);}}
function pause(value=true){suspended=value;if(value)for(const pool of Object.values(pools))for(const a of pool)a.pause();sync();}
function set(key,value){if(key==='shake')settings[key]=!!value;else if(['music','sfx'].includes(key))settings[key]=Math.max(0,Math.min(1,Number(value)||0));save();if(key==='sfx')for(const pool of Object.values(pools))for(const a of pool)a.volume=settings.sfx;sync();}
root.DungeonSound={unlock,play,scene:change,observe,pause,set,settings:()=>({...settings}),state:()=>({unlocked,suspended,track,played,currentTime:track?music[track].currentTime:0,ready:music[scene].readyState,duration:music[scene].duration,heard:[...heard],combatSamples:14})};
})(window);

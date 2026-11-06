(function(root){'use strict';
const files={click:'click.wav',confirm:'confirm.wav',select:'select.wav',swing:'swing.wav',town:'town.ogg',battle:'battle.mp3',hit:'hit.ogg',hurt:'hurt.ogg',block:'block.ogg',charge:'charge.ogg',step:'step.ogg'};
let settings={music:.38,sfx:.7,shake:true};try{settings={...settings,...JSON.parse(localStorage.getItem('dungeonCrushAudio')||'{}')};}catch{}for(const k of ['music','sfx'])settings[k]=Math.max(0,Math.min(1,Number(settings[k])||0));
let unlocked=false,suspended=false,scene='town',track=null,played=0,lastFx=-1,lastRun='',lastStep=0;const pools={},times={},music={};
function make(key){const a=new Audio('audio/'+files[key]);a.preload='auto';return a;}
for(const k of ['town','battle']){music[k]=make(k);music[k].loop=true;}
function save(){try{localStorage.setItem('dungeonCrushAudio',JSON.stringify(settings));}catch{}}
function play(key,volume=1){if(!unlocked||suspended||!settings.sfx||!files[key])return;const now=performance.now();if(now-(times[key]||-1000)<(key==='hit'?55:key==='step'?160:35))return;times[key]=now;const pool=pools[key]||(pools[key]=[]);let a=pool.find(a=>a.paused||a.ended);if(!a){if(pool.length>=3)return;a=make(key);pool.push(a);}a.volume=settings.sfx*volume;a.currentTime=0;a.play().then(()=>played++).catch(()=>{});}
function sync(){const desired=!unlocked||suspended||settings.music===0?null:scene;for(const [key,a]of Object.entries(music)){a.volume=settings.music;if(key!==desired)a.pause();}track=desired;if(track)music[track].play().catch(()=>{});}
function unlock(){unlocked=true;suspended=false;sync();}
function change(next){scene=next==='battle'?'battle':'town';suspended=false;sync();}
function observe(game){if(lastRun!==game.runId){lastFx=-1;lastRun=game.runId;}const fresh=game.fx.filter(f=>f.id>lastFx);for(const f of fresh){lastFx=Math.max(lastFx,f.id);if(f.type==='windup'&&f.caster)play('charge',.3);else if(['basic','cone','line','lift','rush'].includes(f.type))play('swing');else if(['circle','pull','chain','ultimate'].includes(f.type))play('charge');else if(f.type==='hit')play('hit');else if(f.type==='hurt')play('hurt');else if(f.type==='shield')play('block');else if(f.type==='heal')play('confirm');else if(f.type==='impact')play('hit',.7);}const p=game.players[0];if(p?.action==='run'&&performance.now()-lastStep>280){lastStep=performance.now();play('step',.3);}}
function pause(value=true){suspended=value;if(value)for(const pool of Object.values(pools))for(const a of pool)a.pause();sync();}
function set(key,value){if(key==='shake')settings[key]=!!value;else if(['music','sfx'].includes(key))settings[key]=Math.max(0,Math.min(1,Number(value)||0));save();if(key==='sfx')for(const pool of Object.values(pools))for(const a of pool)a.volume=settings.sfx;sync();}
root.DungeonSound={unlock,play,scene:change,observe,pause,set,settings:()=>({...settings}),state:()=>({unlocked,suspended,track,played,currentTime:track?music[track].currentTime:0,ready:music[scene].readyState,duration:music[scene].duration})};
})(window);

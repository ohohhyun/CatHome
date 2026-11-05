const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../app/src/main/assets/index.html','utf8');
function boot(storage={},seed=12345){
 const rng=Object.create(Math);rng.random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296};
 const elements=new Map(),events={};const noop=()=>{};
 const context=new Proxy({createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop,set:(o,k,v)=>(o[k]=v,true)});
 function element(id){if(!elements.has(id)){const classes=new Set(['hidden']);elements.set(id,{style:{},textContent:'',innerHTML:'',disabled:false,children:[],firstElementChild:{textContent:''},classList:{toggle(k,v){if(v)classes.add(k);else classes.delete(k)},add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k)},getContext:()=>context,getBoundingClientRect:()=>({width:384,height:720,left:0}),addEventListener:(name,cb)=>{events[id+':'+name]=cb},setPointerCapture:noop,setAttribute:noop,replaceChildren(){this.children=[]},append(b){this.children.push(b)},click(){if(!this.disabled)this.onclick?.()}})}return elements.get(id)}
 const env={console,Math:rng,performance:{now:()=>0},localStorage:storage,requestAnimationFrame:noop,document:{getElementById:element,addEventListener:(e,f)=>events[e]=f,createElement:()=>element('new'+Math.random()),hidden:false},window:{addEventListener:(e,f)=>events[e]=f}};
 vm.createContext(env);vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],env);return {env,element,events,storage,run:code=>vm.runInContext(code,env)};
}

const {run,element,storage,events}=boot();
assert.equal(run('CAMPAIGN_COUNT'),20);assert.equal(run('ENDLESS_UNLOCK'),10);
assert.equal(run("start(0,'endless')"),false);assert.equal(run('state'),'menu');
assert.match(html,/<div id="mode-select">/);assert.match(html,/<b>일반 모드<\/b>/);assert.match(html,/<b>무한 모드<\/b>/);
element('start').click();assert.equal(run('mode'),'story');assert.equal(run('level'),0);
run('move(-1);update(.1)');assert.equal(run('lane'),0);assert(run('px')<192);run('move(-1)');assert.equal(run('lane'),0);run('move(1);move(1);move(1)');assert.equal(run('lane'),2);
function collide(){run('px=192;lane=1;invincible=0;cats=[{lane:1,x:192,base:192,y:py(),age:0,speed:0,type:0,col:"#fff",hit:false,passed:false,warn:0}];freeze=0;update(.01)')}
collide();assert.equal(run('hits'),1);run('freeze=0;cats[0].hit=false;update(.01)');assert.equal(run('hits'),1);collide();collide();assert.equal(run('state'),'fail');element('next').click();assert.equal(run('state'),'play');assert.equal(run('hits'),0);
run('dash()');assert.equal(run('dashTime'),.42);assert.equal(run('cooldown'),8);run('cooldown=4;dash()');assert.equal(run('cooldown'),4);
run("panel('pause');let before=elapsed;update(1);if(elapsed!==before)throw Error('pause advanced');resume()");assert.equal(run('state'),'play');
run('start(0);cats=[{x:240,passed:false}];combo=4;award(cats[0])');assert.equal(run('combo'),5);assert.equal(run('near'),1);assert.equal(run('score'),60);
for(let l=0;l<20;l++){
 run(`start(${l});elapsed=STAGES[level][2]-.01;cats=[];update(.02)`);
 assert.equal(run('state'),l===19?'win':'clear');assert.equal(JSON.parse(storage.catHomeSave).cleared,l+1);assert.equal(run(`medals[${l}]`),3);
 assert.equal(element('endless').disabled,l<9,'unlock at stage 10, not stage 20');
 if(l===8){assert.equal(run("start(0,'endless')"),false);assert.equal(run('state'),'clear')}
 if(l===9){assert.equal(element('unlock').classList.contains('hidden'),false);assert.equal(run('unlocked'),11)}
 if(l<19){element('next').click();assert.equal(run('mode'),'story','campaign continues, never switches to endless');assert.equal(run('level'),l+1)}
}
element('next').click();assert.equal(run('state'),'menu','stage 20 ends at mode selection');
element('endless').click();assert.equal(run('mode'),'endless');assert.equal(run('endlessRound()'),1);
run('elapsed=19.99;cats=[];update(.02)');assert.equal(run('endlessRound()'),2);assert.equal(run('state'),'play');assert.match(element('stage').textContent,/무한 모드.*2구간/);assert.equal(JSON.parse(storage.catHomeSave).bestRound,2);
run('elapsed=39.99;cats=[];update(.02)');assert.equal(run('endlessRound()'),3);
run("score=1234;panel('fail')");assert.equal(JSON.parse(storage.catHomeSave).best,1234);element('next').click();assert.equal(run('mode'),'endless');assert.equal(run('endlessRound()'),1);assert.equal(run('score'),0);assert.equal(run('bestRound'),3);
run('dash()');assert.equal(run('dashTime'),.32);assert.equal(run('cooldown'),9);
const reload=boot(storage);assert.equal(reload.run('cleared'),20);assert.equal(reload.run('best'),1234);assert.equal(reload.run('bestRound'),3);assert.equal(reload.element('endless').disabled,false);
// Existing players who completed the old 10-stage game can choose either mode immediately.
const migrated=boot({catCleared:'10',catUnlocked:'10',catInfiniteBest:'900',catMedals:'{"9":3}'});
assert.equal(migrated.run('cleared'),10);assert.equal(migrated.run('unlocked'),11);assert.equal(migrated.run('best'),900);
assert.equal(migrated.run('state'),'menu');assert.equal(migrated.element('endless').disabled,false);
migrated.element('start').click();assert.equal(migrated.run('mode'),'story');assert.equal(migrated.run('level'),10);
assert(migrated.run('difficulty().speed')>migrated.run('STAGES[9][3]'));
migrated.run('goHome()');migrated.element('select').click();assert.equal(migrated.element('levelgrid').children.length,20);assert.equal(migrated.element('levelgrid').children.filter(b=>!b.disabled).length,11);
migrated.run("hide('levels')");migrated.element('endless').click();assert.equal(migrated.run('mode'),'endless');assert.equal(migrated.run('endlessRound()'),1);
assert(migrated.run('difficulty().speed')>migrated.run('STAGES[9][3]'));
migrated.run('elapsed=120;cats=[];update(.02)');assert.equal(migrated.run('state'),'play');assert.equal(migrated.run('cleared'),10,'endless does not advance normal stages');
migrated.run('goHome()');migrated.element('start').click();assert.equal(migrated.run('level'),10,'normal stage 11 remains available after endless');
run("goHome();$('select').click()");assert.equal(element('levelgrid').children.length,20);assert(element('levelgrid').children.every(b=>!b.disabled));
for(let l=0;l<19;l++){assert(run(`STAGES[${l+1}][3]>STAGES[${l}][3]`));assert(run(`STAGES[${l+1}][4]<STAGES[${l}][4]`))}
for(let l=0;l<20;l++)for(let n=0;n<30;n++){
 run(`mode='story';level=${l};cats=[];coins=[];{let oldSafe=previousLane;wave();if(previousLane===oldSafe)throw Error('unchanged safe lane');if(level<5&&Math.abs(previousLane-oldSafe)>1)throw Error('early cross pattern')}`);
 assert(run('cats.length')>=1&&run('cats.length')<=2);assert(run('cats.every(c=>c.lane!==previousLane)'));
 if(l>0)assert.equal(run('cats.length'),2);
}
run('start(2);elapsed=STAGES[2][2]-.1;cats=[];spawn=0;update(.01)');assert.equal(run('cats.length'),0);
run('start(6)');events.visibilitychange();assert.equal(run('state'),'play');events.blur();assert.equal(run('state'),'pause');
for(const h of [590,720,900]){
 assert(Math.abs(run(`H=${h};(py()-125)/(400*travelScale())`)-415/400)<.00001);
 const idle=boot();idle.run(`H=${h};start(9)`);for(let n=0;n<1200&&idle.run('state')==='play';n++)idle.run('update(1/60)');assert.equal(idle.run('state'),'fail','idling no longer wins');
 const bot=boot({catCleared:'10'});bot.run(`H=${h};start(0,'endless');elapsed=240;invincible=0`);
 for(let n=0;n<3600&&bot.run('state')==='play';n++)bot.run(`{const front=cats.filter(c=>!c.passed&&!c.hit&&c.y<=py()+29).sort((a,b)=>b.y-a.y)[0];if(front&&front.y>py()-160){if(lane<front.safe)move(1);else if(lane>front.safe)move(-1)}update(1/60)}`);
 assert.equal(bot.run('state'),'play','valid route at maximum difficulty');assert.equal(bot.run('hits'),0);
}
run("cleared=20;start(0,'endless')");for(const e of [0,20,100,1000,100000]){run(`elapsed=${e}`);assert(run('difficulty().speed')<=600);assert(run('difficulty().interval')>=.38)}
for(let l=0;l<20;l++)run(`mode='story';level=${l};render()`);
for(const s of ['menu','play','fail','win'])run(`state='${s}';render()`);
// Cached artwork stays bounded; all three requested coats actually spawn.
const smooth=boot({catCleared:'20'});assert.equal(smooth.run('spriteCache.size'),10);assert.equal(smooth.run('buildingCache.size'),60);
smooth.run('start(19)');const skins=new Set();for(let n=0;n<12;n++){smooth.run('cats=[];wave()');for(const skin of smooth.run('cats.map(c=>c.skin)'))skins.add(skin)}assert.deepEqual([...skins].sort(),['calico','cheese','tuxedo']);
for(let n=0;n<100;n++)smooth.run('render()');assert.equal(smooth.run('spriteCache.size'),10);assert.equal(smooth.run('buildingCache.size'),60);
smooth.run('burst(100,100,"#fff",1000)');assert(smooth.run('particles.length')<=96);for(let n=0;n<100;n++)smooth.run('float("+10",100,100)');assert.equal(smooth.run('floaters.length'),12);
smooth.run('start(0);elapsed=5;layoutLanes()');assert.deepEqual(Array.from(smooth.run('lanes')),[112,192,272]);
smooth.run('start(5);elapsed=5;layoutLanes()');assert.notDeepEqual(Array.from(smooth.run('lanes')),[112,192,272]);
for(let n=0;n<240;n++){smooth.run(`elapsed=${n};layoutLanes()`);assert(smooth.run('lanes[1]-lanes[0]>=70&&lanes[2]-lanes[1]>=70'))}
// Fixed-step loop advances consistently on a 120Hz display and stops during pause.
smooth.run('start(0);last=0;frameAccumulator=0;frame(1000)');for(let n=1;n<=120;n++)smooth.run(`frame(${1000+n*1000/120})`);assert(Math.abs(smooth.run('elapsed')-61/60)<.02);
smooth.run("panel('pause');let held=elapsed;frame(3000);if(elapsed!==held)throw Error('paused frame advances')");
// Save writes can wait until idle; lifecycle flushing preserves the most recent data.
const asyncSave=boot(),idleTasks=[];asyncSave.env.window.requestIdleCallback=cb=>idleTasks.push(cb);
asyncSave.run('cleared=10;save();cleared=11;save()');assert.equal(idleTasks.length,1);assert.equal(asyncSave.storage.catHomeSave,undefined);asyncSave.run('flushSave()');assert.equal(JSON.parse(asyncSave.storage.catHomeSave).cleared,11);idleTasks[0]();
assert.equal(boot(asyncSave.storage).run('cleared'),11);
console.log('PASS: 20-stage campaign and independent endless mode; coat variants; moving lane geometry; cached artwork bounds; bounded effects; 120Hz fixed-step timing; deferred saves; migration; maximum-difficulty route simulations.');
module.exports={boot};

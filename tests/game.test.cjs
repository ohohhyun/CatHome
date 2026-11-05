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
assert.equal(run("start(0,'endless')"),false,'endless locked');assert.equal(run('state'),'menu');
run('start(0);move(-1);update(.1)');assert.equal(run('lane'),0);assert(run('px')<192);run('move(-1)');assert.equal(run('lane'),0);run('move(1);move(1);move(1)');assert.equal(run('lane'),2);
function collide(){run('px=192;lane=1;invincible=0;cats=[{lane:1,x:192,base:192,y:py(),age:0,speed:0,type:0,col:"#fff",hit:false,passed:false,warn:0}];freeze=0;update(.01)')}
collide();assert.equal(run('hits'),1);run('freeze=0;cats[0].hit=false;update(.01)');assert.equal(run('hits'),1,'invincible');collide();collide();assert.equal(run('state'),'fail');run("$('next').click()");assert.equal(run('state'),'play');assert.equal(run('hits'),0);
run('dash()');assert(run('dashTime')>0);assert.equal(run('cooldown'),8);run('cooldown=4;dash()');assert.equal(run('cooldown'),4,'cannot spam dash');
run("panel('pause');let before=elapsed;update(1);if(elapsed!==before)throw Error('pause advanced');resume()");assert.equal(run('state'),'play');
run('start(0);cats=[{x:240,passed:false}];combo=4;award(cats[0])');assert.equal(run('combo'),5);assert.equal(run('near'),1);assert.equal(run('score'),60);assert.equal(run('maxCombo'),5);
for(let l=0;l<10;l++){run(`start(${l});elapsed=STAGES[level][2]-.01;cats=[];update(.02)`);assert.equal(run('state'),l===9?'win':'clear');assert.equal(+storage.catCleared,l+1);assert.equal(run(`medals[${l}]`),3);if(l<9){run("$('next').click()");assert.equal(run('level'),l+1)}}
assert.equal(element('endless').disabled,false);run("$('next').click()");assert.equal(run('mode'),'endless');assert.equal(run('state'),'play');
run('elapsed=100;cats=[];update(.02)');assert.equal(run('state'),'play','endless has no story finish');const initial=run('elapsed=0;difficulty().speed');const later=run('elapsed=180;difficulty().speed');assert(later>initial);assert(run('difficulty().interval')>=.38);
run("score=1234;panel('fail')");assert.equal(+storage.catInfiniteBest,1234);run("$('next').click()");assert.equal(run('mode'),'endless');assert.equal(run('score'),0);assert.equal(run('best'),1234);
const reload=boot(storage);assert.equal(reload.run('cleared'),10);assert.equal(reload.run('best'),1234);assert.equal(reload.element('endless').disabled,false);assert.equal(reload.run("start(0,'endless')"),true);
run("goHome();$('select').click()");assert.equal(element('levelgrid').children.length,10);assert(element('levelgrid').children.every(b=>!b.disabled));
for(let l=0;l<10;l++)for(let n=0;n<50;n++){run(`mode='story';level=${l};cats=[];coins=[];{let oldSafe=previousLane;wave();if(previousLane===oldSafe)throw Error('unchanged safe lane');if(level<5&&Math.abs(previousLane-oldSafe)>1)throw Error('early cross pattern')}`);assert(run('cats.length')>=1&&run('cats.length')<=2);assert(run('cats.every(c=>c.lane!==previousLane)'))}
run('start(2);elapsed=STAGES[2][2]-.1;cats=[];spawn=0;update(.01)');assert.equal(run('cats.length'),0,'stop spawns early to finish all arrivals');
run('start(6)');events['visibilitychange']();assert.equal(run('state'),'play');events.blur();assert.equal(run('state'),'pause');
for(const s of ['menu','play','fail','win'])run(`state='${s}';render()`);
// Unlock must survive updates and start endless at stage 11, above story stage 10.
const migrated=boot({catCleared:'10',catUnlocked:'10',catInfiniteBest:'900',catMedals:'{"9":3}'});
assert.equal(migrated.run('cleared'),10);assert.equal(migrated.run('best'),900);
assert.equal(migrated.run("start(0,'endless')"),true);assert.equal(migrated.run('endlessStage()'),11);
assert(migrated.run('difficulty().speed')>run('mode="story";level=9;difficulty().speed'));
assert(migrated.run('difficulty().interval')<run('difficulty().interval'));
migrated.run('elapsed=19.99;cats=[];update(.02)');assert.equal(migrated.run('endlessStage()'),12);assert.match(migrated.element('stage').textContent,/12탄/);
assert.equal(migrated.run('state'),'play');assert.equal(+migrated.storage.catInfiniteStage,12);
migrated.run('elapsed=39.99;cats=[];update(.02)');assert.equal(migrated.run('endlessStage()'),13);
migrated.run("panel('fail');$('next').click()");assert.equal(migrated.run('endlessStage()'),11);assert.equal(migrated.run('bestStage'),13);
migrated.run('dash()');assert.equal(migrated.run('dashTime'),.32);assert.equal(migrated.run('cooldown'),9);
// Every story stage is faster and denser than the previous stage.
for(let l=0;l<9;l++){assert(run(`STAGES[${l+1}][3]>STAGES[${l}][3]`));assert(run(`STAGES[${l+1}][4]<STAGES[${l}][4]`))}
for(const e of [0,20,100,1000,100000]){migrated.run(`elapsed=${e}`);assert(migrated.run('difficulty().speed')<=600);assert(migrated.run('difficulty().interval')>=.38)}
// Small/tall screens have equal travel time from the visible playfield boundary.
for(const h of [590,720,900])assert(Math.abs(run(`H=${h};(py()-125)/(400*travelScale())`)-415/400)<.00001);
// Actual play simulation: idling must lose; a bot that reads the incoming gap must survive.
for(const h of [590,720,900]){
 const idle=boot();idle.run(`H=${h};start(9)`);for(let n=0;n<1200&&idle.run('state')==='play';n++)idle.run('update(1/60)');assert.equal(idle.run('state'),'fail','idling no longer wins');
 const bot=boot({catCleared:'10'});bot.run(`H=${h};start(0,'endless');elapsed=240;invincible=0`);
 for(let n=0;n<3600&&bot.run('state')==='play';n++)bot.run(`{const front=cats.filter(c=>!c.passed&&!c.hit&&c.y<=py()+29).sort((a,b)=>b.y-a.y)[0];if(front&&front.y>py()-160){if(lane<front.safe)move(1);else if(lane>front.safe)move(-1)}update(1/60)}`);
 assert.equal(bot.run('state'),'play','a valid route must exist at maximum difficulty');assert.equal(bot.run('hits'),0,'oracle gap-following route should be collision free');
}
console.log('PASS: campaign difficulty, stage-10 gate, endless stages 11/12/13, continuous survival, harder endless entry, retry, old save migration, best-stage persistence, dash limits, idle failure, gap-following simulation at 3 screen sizes, collisions, combo, pause and rendering.');
module.exports={boot};

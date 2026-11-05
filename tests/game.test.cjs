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
 assert.equal(run('state'),l===19?'win':'clear');assert.equal(+storage.catCleared,l+1);assert.equal(run(`medals[${l}]`),3);
 assert.equal(element('endless').disabled,l<9,'unlock at stage 10, not stage 20');
 if(l===8){assert.equal(run("start(0,'endless')"),false);assert.equal(run('state'),'clear')}
 if(l===9){assert.equal(element('unlock').classList.contains('hidden'),false);assert.equal(run('unlocked'),11)}
 if(l<19){element('next').click();assert.equal(run('mode'),'story','campaign continues, never switches to endless');assert.equal(run('level'),l+1)}
}
element('next').click();assert.equal(run('state'),'menu','stage 20 ends at mode selection');
element('endless').click();assert.equal(run('mode'),'endless');assert.equal(run('endlessRound()'),1);
run('elapsed=19.99;cats=[];update(.02)');assert.equal(run('endlessRound()'),2);assert.equal(run('state'),'play');assert.match(element('stage').textContent,/무한 모드.*2구간/);assert.equal(+storage.catInfiniteRound,2);
run('elapsed=39.99;cats=[];update(.02)');assert.equal(run('endlessRound()'),3);
run("score=1234;panel('fail')");assert.equal(+storage.catInfiniteBest,1234);element('next').click();assert.equal(run('mode'),'endless');assert.equal(run('endlessRound()'),1);assert.equal(run('score'),0);assert.equal(run('bestRound'),3);
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
console.log('PASS: all 20 normal stages, stage-10-only unlock, independent start-screen mode choices, stage 11 normal continuation, old save migration, endless isolation/retry/records, difficulty progression, idle failure and playable maximum-difficulty routes at 3 screen sizes.');
module.exports={boot};

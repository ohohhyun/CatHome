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
assert.equal(run('CAMPAIGN_COUNT'),30);assert.equal(run('ENDLESS_UNLOCK'),10);
assert.equal(run("start(0,'endless')"),false);assert.equal(run('state'),'menu');
assert.match(html,/<div id="mode-select">/);assert.match(html,/<b>일반 모드<\/b>/);assert.match(html,/<b>무한 모드<\/b>/);
element('start').click();assert.equal(run('mode'),'story');assert.equal(run('level'),0);
run('move(-1);update(.1)');assert.equal(run('lane'),0);assert(run('px')<192);run('move(-1)');assert.equal(run('lane'),0);run('move(1);move(1);move(1)');assert.equal(run('lane'),2);
function collide(){run('px=192;lane=1;invincible=0;cats=[{lane:1,x:192,base:192,y:py(),age:0,speed:0,type:0,col:"#fff",hit:false,passed:false,warn:0}];freeze=0;update(.01)')}
collide();assert.equal(run('hits'),1);run('freeze=0;cats[0].hit=false;update(.01)');assert.equal(run('hits'),1);collide();collide();assert.equal(run('state'),'fail');element('next').click();assert.equal(run('state'),'play');assert.equal(run('hits'),0);
run('dash()');assert.equal(run('dashTime'),.42);assert.equal(run('cooldown'),8);run('cooldown=4;dash()');assert.equal(run('cooldown'),4);
run("panel('pause');let before=elapsed;update(1);if(elapsed!==before)throw Error('pause advanced');resume()");assert.equal(run('state'),'play');
run('start(0);cats=[{x:240,passed:false}];combo=4;award(cats[0])');assert.equal(run('combo'),5);assert.equal(run('near'),1);assert.equal(run('score'),60);
for(let l=0;l<30;l++){
 run(`start(${l});elapsed=STAGES[level][2]-.01;cats=[];update(.02)`);
 assert.equal(run('state'),l===29?'win':'clear');assert.equal(JSON.parse(storage.catHomeSave).cleared,l+1);assert.equal(run(`medals[${l}]`),3);
 assert.equal(element('endless').disabled,l<9,'unlock at stage 10, not stage 20');
 if(l===8){assert.equal(run("start(0,'endless')"),false);assert.equal(run('state'),'clear')}
 if(l===9){assert.equal(element('unlock').classList.contains('hidden'),false);assert.equal(run('unlocked'),11)}
 if(l<29){element('next').click();assert.equal(run('mode'),'story','campaign continues, never switches to endless');assert.equal(run('level'),l+1)}
}
element('next').click();assert.equal(run('state'),'menu','stage 20 ends at mode selection');
element('endless').click();assert.equal(run('mode'),'endless');assert.equal(run('endlessRound()'),1);
run('elapsed=19.99;cats=[];update(.02)');assert.equal(run('endlessRound()'),2);assert.equal(run('state'),'play');assert.match(element('stage').textContent,/무한 모드.*2탄/);assert.equal(JSON.parse(storage.catHomeSave).bestRound,2);
run('elapsed=39.99;cats=[];update(.02)');assert.equal(run('endlessRound()'),3);
run("score=1234;panel('fail')");assert.equal(JSON.parse(storage.catHomeSave).best,1234);element('next').click();assert.equal(run('mode'),'endless');assert.equal(run('endlessRound()'),1);assert.equal(run('score'),0);assert.equal(run('bestRound'),3);
run('dash()');assert.equal(run('dashTime'),.32);assert.equal(run('cooldown'),9);
const reload=boot(storage);assert.equal(reload.run('cleared'),30);assert.equal(reload.run('best'),1234);assert.equal(reload.run('bestRound'),3);assert.equal(reload.element('endless').disabled,false);
// Existing players who completed the old 10-stage game can choose either mode immediately.
const migrated=boot({catCleared:'10',catUnlocked:'10',catInfiniteBest:'900',catMedals:'{"9":3}'});
assert.equal(migrated.run('cleared'),10);assert.equal(migrated.run('unlocked'),11);assert.equal(migrated.run('best'),900);
assert.equal(migrated.run('state'),'menu');assert.equal(migrated.element('endless').disabled,false);
migrated.element('start').click();assert.equal(migrated.run('mode'),'story');assert.equal(migrated.run('level'),10);
assert(migrated.run('difficulty().speed')>migrated.run('STAGES[9][3]'));
migrated.run('goHome()');migrated.element('select').click();assert.equal(migrated.element('levelgrid').children.length,30);assert.equal(migrated.element('levelgrid').children.filter(b=>!b.disabled).length,11);
migrated.run("hide('levels')");migrated.element('endless').click();assert.equal(migrated.run('mode'),'endless');assert.equal(migrated.run('endlessRound()'),1);
assert(migrated.run('difficulty().speed')>migrated.run('STAGES[9][3]'));
migrated.run('elapsed=120;cats=[];update(.02)');assert.equal(migrated.run('state'),'play');assert.equal(migrated.run('cleared'),10,'endless does not advance normal stages');
migrated.run('goHome()');migrated.element('start').click();assert.equal(migrated.run('level'),10,'normal stage 11 remains available after endless');
run("goHome();$('select').click()");assert.equal(element('levelgrid').children.length,30);assert(element('levelgrid').children.every(b=>!b.disabled));
for(let l=0;l<19;l++){assert(run(`STAGES[${l+1}][3]>STAGES[${l}][3]`));assert(run(`STAGES[${l+1}][4]<STAGES[${l}][4]`))}
for(let l=0;l<30;l++)for(let n=0;n<30;n++){
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
run("cleared=20;start(0,'endless')");for(const e of [0,20,100,1000,100000]){run(`elapsed=${e}`);assert(run('difficulty().speed')<=900);assert(run('difficulty().interval')>=.22)}
for(let l=0;l<30;l++)run(`mode='story';level=${l};render()`);
for(const s of ['menu','play','fail','win'])run(`state='${s}';render()`);
// Cached artwork stays bounded; all three requested coats actually spawn.
const smooth=boot({catCleared:'20'});assert.equal(smooth.run('spriteCache.size'),20);assert.equal(smooth.run('buildingCache.size'),60);
smooth.run('start(9)');const skins=new Set();for(let n=0;n<12;n++){smooth.run('cats=[];wave()');for(const skin of smooth.run('cats.map(c=>c.skin)'))skins.add(skin)}assert.deepEqual([...skins].sort(),['calico','cheese','tuxedo']);
for(let n=0;n<100;n++)smooth.run('render()');assert.equal(smooth.run('spriteCache.size'),20);assert.equal(smooth.run('buildingCache.size'),60);
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
// Persistent coins and pre-game purchases, including maximum stock and rejected transactions.
const shop=boot();assert.equal(shop.run('ITEM_PRICE'),24);assert.equal(shop.run('wallet'),0);assert.equal(shop.run("buyItem('water',1)"),false);
shop.run('wallet=2400');assert.equal(shop.run("buyItem('water',99)"),true);assert.equal(shop.run('inventory.water'),99);assert.equal(shop.run('wallet'),24);assert.equal(shop.run("buyItem('water',1)"),false);assert.equal(shop.run('wallet'),24);
for(const quantity of [0,-1,1.5,100,NaN])assert.equal(shop.run(`buyItem('umbrella',${quantity})`),false);
assert.equal(shop.run("buyItem('umbrella',1)"),true);assert.equal(shop.run('wallet'),0);
const savedShop=boot(shop.storage);assert.equal(savedShop.run('inventory.water'),99);assert.equal(savedShop.run('inventory.umbrella'),1);assert.equal(savedShop.run('wallet'),0);
shop.run('start(0)');assert.equal(shop.run("buyItem('continue',1)"),false,'no mid-game shopping');
// Umbrella gives exactly two seconds, water gives three seconds, each kind once per attempt.
const items=boot();items.run('inventory={continue:2,umbrella:2,water:2,fish:2};start(0)');
assert.equal(items.run("useItem('umbrella')"),true);assert.equal(items.run('umbrellaTime'),2);assert.equal(items.run('inventory.umbrella'),1);assert.equal(items.run("useItem('umbrella')"),false);
items.run('cats=[];spawn=999;update(1)');assert.equal(items.run('umbrellaTime'),1);items.run('cats=[];update(1)');assert.equal(items.run('umbrellaTime'),0);
assert.equal(items.run("useItem('water')"),true);assert.equal(items.run('waterTime'),3);assert.equal(items.run("useItem('water')"),false);
items.run("cats=[{lane:1,fromLane:0,x:px,base:px,y:py()-90,lift:0,kind:'straight',type:0,age:0,skin:'cheese',hit:false,passed:false,flee:0}];update(.12)");assert(items.run('cats[0].flee')>0,'a water hit makes the cat flee');assert.equal(items.run('hits'),0);assert.equal(items.run('inventory.water'),1);
items.run('updateWater(3.1)');assert.equal(items.run('waterTime'),0);assert(items.run('shots.length')<=24);
items.run("elapsed=8;score=321;runCoins=4;hits=3;panel('fail')");assert.equal(items.run("useItem('continue')"),true);assert.equal(items.run('state'),'play');assert.equal(items.run('hits'),0);assert.equal(items.run('elapsed'),8);assert.equal(items.run('score'),321);assert.equal(items.run('runCoins'),4);assert.equal(items.run('inventory.continue'),1);assert.equal(items.run('usedItems.water'),1);assert.equal(items.run('usedItems.umbrella'),1);
items.run("panel('fail')");assert.equal(items.run("useItem('continue')"),false);items.run('start(0)');assert.equal(items.run('usedItems.continue'),0);
// Coin pickups are banked as currency, separately from points, even on a failed attempt.
const money=boot();money.run('start(0);spawn=999;cats=[];coins=[{lane:1,x:px,y:py(),age:0,taken:false}];update(.001)');assert.equal(money.run('wallet'),1);assert.equal(money.run('runCoins'),1);money.run("panel('fail');flushSave()");assert.equal(boot(money.storage).run('wallet'),1);
// New final ten stages add movement patterns without increasing the stage-20 speed.
for(let l=20;l<30;l++)assert.equal(run(`STAGES[${l}][3]`),run('STAGES[19][3]'));
const patterns=new Set();for(let l=20;l<30;l++)for(let n=0;n<12;n++){run(`level=${l};mode='story';cats=[];wave()`);for(const k of run('cats.map(c=>c.kind)'))patterns.add(k)}for(const k of ['diagonal','pounce','feint'])assert(patterns.has(k));
run("level=29;mode='story';elapsed=2;layoutLanes();let diagonal={lane:2,fromLane:0,y:45,age:0,kind:'diagonal',type:0};positionCat(diagonal);if(diagonal.x!==lanes[0])throw Error('diagonal start');diagonal.y=py()-110;positionCat(diagonal);if(Math.abs(diagonal.x-lanes[2])>.01||Math.abs(diagonal.lift)>.01)throw Error('diagonal landing')");
for(let l=20;l<30;l++)run(`level=${l};cats=[];wave();render()`);
// Fish attracts only the cats actually intersecting the viewport at throw time.
const fish=boot();fish.run('inventory.fish=2;start(6);spawn=999;waterTime=0;shots=[]');
fish.run("cats=[{tag:'visible',lane:0,x:112,y:200,lift:0,kind:'straight',age:0,type:0,flee:0,hit:false,passed:false},{tag:'edge',lane:2,x:272,y:-15,lift:0,kind:'straight',age:0,type:0,flee:0,hit:false,passed:false},{tag:'above',lane:1,x:192,y:-100,lift:0,kind:'straight',age:0,type:0,flee:0,hit:false,passed:false},{tag:'below',lane:1,x:192,y:H+100,lift:0,kind:'straight',age:0,type:0,flee:0,hit:false,passed:false},{tag:'outside',lane:0,x:-100,y:200,lift:0,kind:'straight',age:0,type:0,flee:0,hit:false,passed:false},{tag:'already-left',lane:1,x:190,y:250,lift:0,kind:'straight',age:0,type:0,flee:.5,fleeDir:-1,passed:true}]");
assert.equal(fish.run("useItem('fish')"),true);assert.equal(fish.run('inventory.fish'),1);assert.equal(fish.run("useItem('fish')"),false);
assert(fish.run("cats.filter(c=>['visible','edge','already-left'].includes(c.tag)).every(c=>c.fleeKind==='fish'&&c.fleeDir===1)"));
assert(fish.run("cats.filter(c=>['above','below','outside'].includes(c.tag)).every(c=>!c.fleeKind)"));
fish.run("cats.push({tag:'later',lane:2,x:272,y:100,lift:0,kind:'straight',age:0,type:0,flee:0,hit:false,passed:false});update(.05)");
assert.equal(fish.run("cats.find(c=>c.tag==='later').flee"),0);assert(fish.run("cats.find(c=>c.tag==='visible').x>112"));
fish.run("for(let i=0;i<40;i++)update(.05)");assert(!fish.run("cats.some(c=>c.tag==='visible'||c.tag==='edge'||c.tag==='already-left')"),'selected cats exit to the right');
assert.equal(fish.run('fishThrow'),null);assert.equal(boot(fish.storage).run('inventory.fish'),1);
const oldStock=boot({catHomeSave:JSON.stringify({cleared:7,unlocked:8,best:300,medals:{},wallet:90,inventory:{continue:2,umbrella:3,water:4}})});
assert.equal(oldStock.run('wallet'),90);assert.equal(oldStock.run('inventory.water'),4);assert.equal(oldStock.run('inventory.fish'),0);
assert(!html.includes("text('이동하는 칸'"),'remove the duplicated under-player canvas text');
// Chonky two-lane rolls and forward-jumping bruisers start exactly at normal stage 11.
assert(html.includes('길냥이들의 집사 모집!'));assert(!html.includes('삼색이·턱시도·치즈냥의 집사 모집!'));
const newcomers=boot();const newcomersSeen=new Set();
for(let l=0;l<10;l++)for(let n=0;n<12;n++){newcomers.run(`start(${l});cats=[];wave()`);assert(newcomers.run("cats.every(c=>c.kind!=='roll'&&c.kind!=='forward')"))}
newcomers.run('start(10)');for(let n=0;n<12;n++){newcomers.run('cats=[];wave()');for(const kind of newcomers.run('cats.map(c=>c.kind)'))newcomersSeen.add(kind);assert(newcomers.run("cats.filter(c=>c.kind==='roll').every(c=>Math.abs(c.fromLane-c.lane)===1&&c.skin==='chonky'&&c.rollPair.length===2)"));assert(newcomers.run("cats.filter(c=>c.kind==='forward').every(c=>c.skin==='bruiser')"))}
assert(newcomersSeen.has('roll'));assert(newcomersSeen.has('forward'));
newcomers.run("let bully={lane:1,kind:'forward',y:45+(py()-190)/2,age:0};positionCat(bully);if(catScreenY(bully)<=bully.y||bully.lift<=0)throw Error('forward jump must leap toward player')");
// Rolling encounters have one shuttle in an adjacent two-cell corridor and one fixed third-cell blocker.
let rollingRows=0;
for(const height of [590,720,900])for(let seed=1;seed<=4;seed++){
 const paired=boot({},seed);paired.run(`H=${height};start(10)`);
 for(let n=0;n<24;n++){
  paired.run('cats=[];wave()');if(!paired.run("cats.some(c=>c.kind==='roll')"))continue;rollingRows++;
  assert.equal(paired.run("cats.filter(c=>c.kind==='roll').length"),1);
  assert.equal(paired.run('cats.length'),2);
  assert(paired.run("{const roll=cats.find(c=>c.kind==='roll'),other=cats.find(c=>c.rollBlocker);Math.abs(roll.rollPair[0]-roll.rollPair[1])===1&&roll.rollPair.includes(roll.fromLane)&&roll.rollPair.includes(roll.lane)&&roll.safe===roll.fromLane&&!!other&&!roll.rollPair.includes(other.lane)&&other.kind==='straight'&&other.type===0&&other.row===roll.row&&other.y===roll.y}"));
  paired.run("var shuttle=cats.find(c=>c.kind==='roll'),blocker=cats.find(c=>c.rollBlocker)");
  const positions=[];for(let i=0;i<=100;i++)positions.push(paired.run(`shuttle.y=-42+(py()+42)*${i}/100;positionCat(shuttle);shuttle.x`));
  let changes=0,lastDirection=0;for(let i=1;i<positions.length;i++){const direction=Math.sign(positions[i]-positions[i-1]);if(direction&&lastDirection&&direction!==lastDirection)changes++;if(direction)lastDirection=direction}assert(changes>=4,'must roll back and forth repeatedly, not cross once');
  for(let i=0;i<=10;i++){
   paired.run(`shuttle.y=py()-collisionHalfY()+2*collisionHalfY()*${i}/10;blocker.y=shuttle.y;positionCat(shuttle);positionCat(blocker)`);
   assert(paired.run('Math.abs(shuttle.x-lanes[shuttle.fromLane])>29&&Math.abs(blocker.x-lanes[shuttle.fromLane])>29'),'a free cell inside the rolling pair must exist at passage time');
   assert(paired.run('Math.abs(blocker.x-lanes[blocker.lane])<.001'),'third lane must actually be occupied');
   assert(paired.run('shuttle.x>=lanes[shuttle.rollPair[0]]-.001&&shuttle.x<=lanes[shuttle.rollPair[1]]+.001'),'roller never enters the third lane');
  }
 }
}
assert(rollingRows>20);

const endlessNewCats=boot({catCleared:'10'});endlessNewCats.run("start(0,'endless')");
for(let r=1;r<=10;r++){endlessNewCats.run(`elapsed=(${r}-1)*20;cats=[];wave()`);assert(endlessNewCats.run("cats.every(c=>c.kind!=='roll'&&c.kind!=='forward')"))}
endlessNewCats.run('elapsed=10*20');const endlessKinds=new Set();for(let i=0;i<12;i++){endlessNewCats.run('cats=[];wave()');for(const k of endlessNewCats.run('cats.map(c=>c.kind)'))endlessKinds.add(k)}assert(endlessKinds.has('roll'));assert(endlessKinds.has('forward'));
// Endless now continues scaling beyond the old cap, with a hard tier starting at 51.
const expert=boot({catCleared:'10'});expert.run("start(0,'endless')");const stats=[];
for(const r of [50,51,60,75,90,100,150,200])stats.push(expert.run(`elapsed=(${r}-1)*ENDLESS_STAGE_SECONDS;difficulty()`));
assert.equal(stats[0].expert,false);assert.equal(stats[1].expert,true);
for(let n=1;n<stats.length;n++){assert(stats[n].speed>stats[n-1].speed);assert(stats[n].interval<stats[n-1].interval)}
assert.equal(stats[5].speed,840);assert(Math.abs(stats[5].interval-.24)<.000001);assert.equal(stats[7].speed,900);
for(const r of [51,75,100,200])for(let n=0;n<8;n++)expert.run(`elapsed=(${r}-1)*20;waveIndex=${n};if(nextWaveDelay(difficulty())<.22-1e-8)throw Error('too-short beat')`);
// A fast, rate-limited input bot must retain a collision-free route without items at stage 100.
for(const h of [590,720,900])for(const r of [51,75,100,200]){
 const skilled=boot({catCleared:'10'},h+r);skilled.run(`H=${h};start(0,'endless');elapsed=(${r}-1)*20;invincible=0;let nextTap=0`);
 for(let n=0;n<(r===100?3600:1200)&&skilled.run('state')==='play';n++)skilled.run(`{const front=cats.filter(c=>!c.passed&&!c.hit&&c.y<=py()+29).sort((a,b)=>b.y-a.y)[0];if(front&&front.y>py()-Math.max(160,.23*difficulty().speed*travelScale())&&elapsed>=nextTap){if(lane<front.safe){move(1);nextTap=elapsed+.075}else if(lane>front.safe){move(-1);nextTap=elapsed+.075}}update(1/60)}`);
 assert.equal(skilled.run('state'),'play',`expert ${r}, height ${h} must have a route`);assert.equal(skilled.run('hits'),0,`expert ${r}, height ${h} must be fair`);
}
// Endless items: three separate uses of each kind, with one inventory unit consumed each time.
const multi=boot({catCleared:'10'});multi.run("inventory={continue:5,umbrella:5,water:5,fish:5};start(0,'endless');spawn=999");assert.equal(multi.run('itemUseLimit()'),3);
for(const key of ['umbrella','water','fish']){
 for(let use=1;use<=3;use++){
  assert.equal(multi.run(`useItem('${key}')`),true);assert.equal(multi.run(`usedItems.${key}`),use);assert.equal(multi.run(`inventory.${key}`),5-use);assert.equal(multi.run(`itemUsesLeft('${key}')`),3-use);
  if(key==='umbrella'){assert.equal(multi.run("useItem('umbrella')"),false,'active umbrella cannot waste another stock');multi.run('cats=[];update(2.01)')}
  if(key==='water'){assert.equal(multi.run("useItem('water')"),false,'active water cannot waste another stock');multi.run('updateWater(3.01)')}
 }
 assert.equal(multi.run(`useItem('${key}')`),false);assert.equal(multi.run(`inventory.${key}`),2,'fourth use must not consume stock');
}
for(let use=1;use<=3;use++){
 multi.run("elapsed=37;score=500;panel('fail')");assert.equal(multi.run("useItem('continue')"),true);assert.equal(multi.run('state'),'play');assert.equal(multi.run('elapsed'),37);assert.equal(multi.run('score'),500);assert.equal(multi.run('usedItems.continue'),use);assert.equal(multi.run('inventory.continue'),5-use);
 for(const key of ['umbrella','water','fish'])assert.equal(multi.run(`usedItems.${key}`),3,'continue must not refresh other item limits');
}
multi.run("panel('fail')");assert.equal(multi.run("useItem('continue')"),false);assert.equal(multi.run('inventory.continue'),2);assert.equal(multi.element('continue-run').disabled,true);
assert.equal(boot(multi.storage).run('inventory.continue'),2);
multi.run("start(0,'endless')");for(const key of ['continue','umbrella','water','fish'])assert.equal(multi.run(`usedItems.${key}`),0);
// Limit is independent of stock, and general mode remains one per kind.
multi.run("inventory.fish=1;start(0,'endless')");assert.equal(multi.run("useItem('fish')"),true);assert.equal(multi.run("itemUsesLeft('fish')"),2);assert.equal(multi.run("useItem('fish')"),false,'remaining allowance is not free inventory');
multi.run('inventory.fish=5;start(0)');assert.equal(multi.run('itemUseLimit()'),1);assert.equal(multi.run("useItem('fish')"),true);assert.equal(multi.run("useItem('fish')"),false);
console.log('PASS: endless three uses per item including continue, independent counters, stock consumption, fourth-use rejection, usage preserved across continues, fresh-run reset, and all previous game tests.');
module.exports={boot};

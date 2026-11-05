const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../app/src/main/assets/index.html','utf8');
function boot(storage={}){
 const elements=new Map(),events={};const noop=()=>{};
 const context=new Proxy({createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop,set:(o,k,v)=>(o[k]=v,true)});
 function element(id){if(!elements.has(id)){const classes=new Set(['hidden']);elements.set(id,{style:{},textContent:'',innerHTML:'',disabled:false,children:[],firstElementChild:{textContent:''},classList:{toggle(k,v){if(v)classes.add(k);else classes.delete(k)},add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k)},getContext:()=>context,getBoundingClientRect:()=>({width:384,height:720,left:0}),addEventListener:(name,cb)=>{events[id+':'+name]=cb},setPointerCapture:noop,setAttribute:noop,replaceChildren(){this.children=[]},append(b){this.children.push(b)},click(){if(!this.disabled)this.onclick?.()}})}return elements.get(id)}
 const env={console,Math,performance:{now:()=>0},localStorage:storage,requestAnimationFrame:noop,document:{getElementById:element,addEventListener:(e,f)=>events[e]=f,createElement:()=>element('new'+Math.random()),hidden:false},window:{addEventListener:(e,f)=>events[e]=f}};
 vm.createContext(env);vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],env);return {env,element,events,storage,run:code=>vm.runInContext(code,env)};
}
const {run,element,storage,events}=boot();
assert.equal(run("start(0,'endless')"),false,'endless locked');assert.equal(run('state'),'menu');
run('start(0);move(-1);update(.1)');assert.equal(run('lane'),0);assert(run('px')<192);run('move(-1)');assert.equal(run('lane'),0);run('move(1);move(1);move(1)');assert.equal(run('lane'),2);
function collide(){run('px=192;lane=1;invincible=0;cats=[{lane:1,x:192,base:192,y:py(),age:0,speed:0,type:0,col:"#fff",hit:false,passed:false,warn:0}];freeze=0;update(.01)')}
collide();assert.equal(run('hits'),1);run('freeze=0;cats[0].hit=false;update(.01)');assert.equal(run('hits'),1,'invincible');collide();collide();assert.equal(run('state'),'fail');run("$('next').click()");assert.equal(run('state'),'play');assert.equal(run('hits'),0);
run('dash()');assert(run('dashTime')>0);assert.equal(run('cooldown'),6);run('cooldown=4;dash()');assert.equal(run('cooldown'),4,'cannot spam dash');
run("panel('pause');let before=elapsed;update(1);if(elapsed!==before)throw Error('pause advanced');resume()");assert.equal(run('state'),'play');
run('start(0);cats=[{x:240,passed:false}];combo=4;award(cats[0])');assert.equal(run('combo'),5);assert.equal(run('near'),1);assert.equal(run('score'),60);assert.equal(run('maxCombo'),5);
for(let l=0;l<10;l++){run(`start(${l});elapsed=STAGES[level][2]-.01;cats=[];update(.02)`);assert.equal(run('state'),l===9?'win':'clear');assert.equal(+storage.catCleared,l+1);assert.equal(run(`medals[${l}]`),3);if(l<9){run("$('next').click()");assert.equal(run('level'),l+1)}}
assert.equal(element('endless').disabled,false);run("$('next').click()");assert.equal(run('mode'),'endless');assert.equal(run('state'),'play');
run('elapsed=100;cats=[];update(.02)');assert.equal(run('state'),'play','endless has no story finish');const initial=run('elapsed=0;difficulty().speed');const later=run('elapsed=180;difficulty().speed');assert(later>initial);assert(run('difficulty().interval')>=.68);
run("score=1234;panel('fail')");assert.equal(+storage.catInfiniteBest,1234);run("$('next').click()");assert.equal(run('mode'),'endless');assert.equal(run('score'),0);assert.equal(run('best'),1234);
const reload=boot(storage);assert.equal(reload.run('cleared'),10);assert.equal(reload.run('best'),1234);assert.equal(reload.element('endless').disabled,false);assert.equal(reload.run("start(0,'endless')"),true);
run("goHome();$('select').click()");assert.equal(element('levelgrid').children.length,10);assert(element('levelgrid').children.every(b=>!b.disabled));
for(let l=0;l<10;l++)for(let n=0;n<50;n++){run(`mode='story';level=${l};cats=[];coins=[];{let oldSafe=previousLane;wave();if(Math.abs(previousLane-oldSafe)>1)throw Error('unreachable safe lane')}`);assert(run('cats.length')>=1&&run('cats.length')<=2);assert(run('cats.every(c=>c.lane!==previousLane)'))}
run('start(2);elapsed=23;cats=[];spawn=0;update(.01)');assert.equal(run('cats.length'),0,'stop spawns early to finish all arrivals');
run('start(6)');events['visibilitychange']();assert.equal(run('state'),'play');events.blur();assert.equal(run('state'),'pause');
for(const s of ['menu','play','fail','win'])run(`state='${s}';render()`);
console.log('PASS: lock/unlock, 10-stage campaign, medals, endless beyond stage time, difficulty caps, best persistence/reload, retry, movement bounds, dash cooldown, near-miss multiplier, invincibility, pause, safe waves, rendering calls.');
module.exports={boot};

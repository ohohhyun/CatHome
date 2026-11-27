const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 fs.mkdirSync('build/previews',{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1600,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(process.env.DUNGEON_TEST_URL||'file://'+path.resolve('app/src/main/assets/index.html'));await page.waitForFunction(()=>window.DungeonActors);await page.evaluate(()=>DungeonActors.preloadAll());await page.waitForFunction(()=>DungeonActors.readyAll(),null,{timeout:120000});
  // Actual state switches must retain one opaque, uniformly scaled authored body.
  const switches=await page.evaluate(()=>{
   const c=document.createElement('canvas').getContext('2d'),draw=c.drawImage.bind(c),samples=[];let hero;
   c.drawImage=(...args)=>{const m=c.getTransform();samples.push({state:hero.action,scale:Math.hypot(m.a,m.b),alpha:c.globalAlpha});return draw(...args);};
   for(let cls=0;cls<6;cls++)for(const dir of [-1,1])for(let phase=0;phase<8;phase++){
    hero=Rift.player(90000+cls*100+phase,'',cls);
    for(const state of ['run','basic','run','circle','run','jump','run','dash','idle']){
     Object.assign(hero,{action:state==='jump'?'idle':state,vx:state==='run'?dir*Rift.CLASSES[cls].speed:0,gait:phase/8*Math.PI*2*DungeonActors.strideLength(hero,'run')/210,jump:state==='jump'?.4:0,dashTime:state==='dash'?.16:0,at:['basic','circle'].includes(state)?.25:0,actionDuration:.4,impactTime:.1,landing:0,hurt:0});
     const before=JSON.stringify(hero),count=samples.length;
     if(!DungeonActors.actor(c,cls,300,500,400,dir,hero,20+phase*.1))throw Error('Missing state '+state);
     if(samples.length!==count+1||JSON.stringify(hero)!==before)throw Error('State switch repeats or mutates body');
    }
   }
   return samples;
  });
  assert.equal(switches.length,864);assert(switches.every(s=>Math.abs(s.scale-1)<1e-6&&s.alpha===1),'state changes preserve native aspect and one opaque body');
  await require('./all-look-anatomy.cjs')(page);await require('./canvas-cover.cjs')(page);assert.deepEqual(errors,[]);
  console.log('PASS: 864 real state transitions in six classes/both directions; 432 actual full-color body comparisons in all 36 looks, source-pixel anatomy and height checks, and actual screen aspect pixels.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});

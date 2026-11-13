const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 fs.mkdirSync('build/previews/stability',{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']}),p=await browser.newPage({viewport:{width:1440,height:1120}}),errors=[],audit=[];p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(process.env.DUNGEON_TEST_URL||'file://'+path.resolve('app/src/main/assets/index.html'));await p.waitForFunction(()=>window.DungeonPremiumArt);await p.evaluate(()=>document.fonts.ready);
  await p.locator('#title-cover-open').click();await p.locator('#game-start').click();await p.evaluate(()=>RiftApp.choose(1));await p.locator('#enter-character').click();await p.evaluate(()=>RiftApp.solo());await p.locator('#loading-screen').waitFor({state:'hidden'});
  await p.evaluate(()=>{const g=RiftApp.getState(),h=g.players[0];Object.assign(h,{x:900,y:600,inv:99999});g.enemies=[{...DungeonEncounters.NORMALS.thornwolf,id:987,x:900.3,y:480,hp:1e9,maxHp:1e9,dir:-1,cd:9999,at:0,stun:0}];window.thornwolfTrace=[];const draw=DungeonActors.enemy;DungeonActors.enemy=(...args)=>{const e=args[6];if(e.id===987)thornwolfTrace.push({x:e.x,y:e.y,dir:e.dir,gait:e.gait,at:e.at});return draw(...args);};});
  await p.waitForFunction(()=>thornwolfTrace.length>30,null,{timeout:30000});const chase=await p.evaluate(()=>thornwolfTrace);assert(chase.length>30,'actual battle renderer observes thornwolf movement');assert(new Set(chase.map(e=>e.dir)).size<=1,'thornwolf lane approach does not flip its entire body');assert(chase.every(e=>e.x>=900&&e.x<=900.31&&e.y<=600),'actual render has no chase overshoot');await p.screenshot({path:'build/previews/stability/thornwolf-battle.png'});await p.evaluate(()=>RiftApp.home());
  await p.evaluate(()=>{const cv=document.createElement('canvas');cv.id='stability-review';cv.width=1440;cv.height=1120;Object.assign(cv.style,{position:'fixed',inset:0,width:'100vw',height:'100vh',zIndex:100000});document.body.append(cv);window.stabilityDraw=(kind,index,id)=>{
   const c=cv.getContext('2d'),original=c.drawImage.bind(c);let draws=0,nonOpaque=0,states=new Set();c.drawImage=(...args)=>{draws++;if(c.globalAlpha<.999)nonOpaque++;return original(...args);};
   try{for(const dir of [-1,1])for(let tick=0;tick<120;tick++){
    const phase=(tick%60+.37)/60,h=Rift.player(5000+index,'검수',kind==='enemy'?0:index,100,{costume:id||''});Object.assign(h,{x:0,y:0,hp:100,dir,action:'run',vx:dir*300,gait:phase*Math.PI*2*320/210});
    if(kind==='enemy'){Object.assign(h,{cls:undefined,moving:true,gait:phase*Math.PI*2});}
    let bank='run';if(tick>=60){bank='attack';if(kind==='enemy')Object.assign(h,{moving:false,at:(1.65+.8)*(1-(tick-60+.37)/60),castDuration:1.65,recovery:.8});else Object.assign(h,{action:'basic',at:.44*(1-(tick-60+.37)/60),actionDuration:.44,impactTime:.105,comboStage:tick%3});}
    const before=draws;c.clearRect(0,0,1440,1120);c.save();let ok;if(kind==='enemy')ok=DungeonActors.enemy(c,index,720,800,260,-dir,h,phase);else if(id)ok=DungeonPremiumArt.actor(c,index,720,800,260,dir,h,phase);else ok=DungeonActors.actor(c,index,720,800,260,dir,h,phase);c.restore();if(!ok||draws-before!==1)throw Error(kind+'/'+index+'/'+tick+' draws '+(draws-before)+' full bodies');states.add(bank);
   }}finally{c.drawImage=original;}if(nonOpaque)throw Error(kind+'/'+index+' has '+nonOpaque+' translucent full-body poses');return {kind,index,id,draws,states:[...states]};
  };});
  const enemies=await p.evaluate(()=>DungeonActors.enemies.map(a=>a.id));assert.equal(enemies.length,92);
  for(let index=0;index<enemies.length;index++){
   await p.evaluate(index=>DungeonActors.prepareEnemies([index]),index);await p.waitForFunction(index=>DungeonActors.enemiesReady([index]),index,{timeout:60000});
   audit.push(await p.evaluate(index=>stabilityDraw('enemy',index,''),index));
   if(index%8===0)await p.evaluate(()=>{const c=document.getElementById('stability-review').getContext('2d');c.fillStyle='#142030';c.fillRect(0,0,1440,1120);});
   // A separate contact sheet below keeps every authored pose visible for review.
  }
  for(let start=0;start<92;start+=8){const indices=Array.from({length:Math.min(8,92-start)},(_,i)=>start+i);await p.evaluate(ids=>DungeonActors.prepareEnemies(ids),indices);await p.waitForFunction(ids=>DungeonActors.enemiesReady(ids),indices,{timeout:60000});
   await p.evaluate(indices=>{const c=document.getElementById('stability-review').getContext('2d');c.fillStyle='#142030';c.fillRect(0,0,1440,1120);for(const[row,index]of indices.entries()){c.fillStyle='#eedcba';c.font='14px sans-serif';c.fillText(index+' '+DungeonActors.enemies[index].id,5,row*140+16);for(let n=0;n<8;n++){const phase=(n%4+.3)/4,h={id:index,hp:100,dir:n%2?-1:1,moving:n<4,gait:phase*Math.PI*2,at:n<4?0:(1.65+.8)*(1-phase),castDuration:1.65,recovery:.8};DungeonActors.enemy(c,index,90+n*180,row*140+135,100,-h.dir,h,phase);}}},indices);await p.screenshot({path:'build/previews/stability/enemies-'+start+'.png'});
  }
  for(let cls=0;cls<6;cls++){
   await p.evaluate(cls=>{DungeonActors.setActiveClasses([cls]);DungeonActors.warmCombat(cls);},cls);await p.waitForFunction(cls=>DungeonActors.combatReady(cls),cls,{timeout:60000});audit.push(await p.evaluate(cls=>stabilityDraw('hero',cls,''),cls));
   const ids=await p.evaluate(cls=>DungeonPremium.ITEMS.filter(i=>i.kind==='outfit'&&i.cls===cls).map(i=>i.id),cls);for(const id of ids){await p.evaluate(id=>DungeonPremiumArt.prepare([],id),id);await p.waitForFunction(id=>DungeonPremiumArt.readyCostume(id),id,{timeout:60000});audit.push(await p.evaluate(({cls,id})=>stabilityDraw('outfit',cls,id),{cls,id}));}
  }
  assert.equal(audit.length,128);assert(audit.every(a=>a.draws===240));assert.deepEqual(errors,[]);fs.writeFileSync('build/previews/motion-stability-audit.json',JSON.stringify({passed:true,actors:128,samples:audit.reduce((s,a)=>s+a.draws,0),audit,errors},null,2));console.log('PASS: actual Chromium rendering of all 92 monsters, six base heroes and thirty outfits, 30,720 moving/attack samples in both directions; exactly one opaque body per sample, no missing frames, twelve enemy review sheets.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

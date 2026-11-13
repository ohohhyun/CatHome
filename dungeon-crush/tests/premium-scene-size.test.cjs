const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const review=JSON.parse(fs.readFileSync('art-source/premium-body-calibration.json'));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await browser.newPage({viewport:{width:740,height:360},hasTouch:true}),errors=[],records=[],bases=[];
 p.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('build/previews/scene-size',{recursive:true});
 try{
  await p.goto(process.env.DUNGEON_TEST_URL||'file://'+path.resolve('app/src/main/assets/index.html'));
  await p.waitForFunction(()=>window.DungeonKeyArt&&window.DungeonPremiumUI);await p.evaluate(()=>document.fonts.ready);
  await p.locator('#title-cover-open').click();await p.locator('#game-start').click();
  await p.evaluate(()=>{RiftApp.transaction(s=>{for(const it of DungeonPremium.ITEMS)DungeonPremium.purchase(s,it.id);for(const ch of s.chars){ch.xp=RiftRPG.xpAt(100);ch.advanced=true;ch.awakened=true;}return {ok:true};});});
  await p.evaluate(review=>{
   window.sceneReview=review;window.sceneDraws=[];
   const actor=DungeonArt.actor;
   DungeonArt.actor=function(c,...args){if(c.canvas.id==='premium-preview'){const m=c.getTransform();window.previewPixelsPerWorldUnit=Math.hypot(m.a,m.b)*c.canvas.getBoundingClientRect().height/c.canvas.height;}return actor(c,...args);};
   const draw=DungeonMotion.draw;
   DungeonMotion.draw=function(...args){
    const [c,,cls,x,y,height,dir,hero,time,enemy]=args;
    if(enemy||hero.id!==0)return draw(...args);
    const frame=hero.costume?DungeonPremiumArt.frame(hero,time):DungeonActors.frame(hero,time),calls=[],original=c.drawImage;
    c.drawImage=function(...a){const m=this.getTransform();calls.push({m:{a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f},rect:a.slice(1)});return original.apply(this,a);};
    try{return draw(...args);}finally{
     c.drawImage=original;
     if(sceneDraws.length>40000)sceneDraws.splice(0,10000);
     const basic=Object.values(sceneReview.base).find(b=>b.cls===cls),point=hero.costume?sceneReview.costumes[hero.costume]?.banks[frame.bank]:basic?.banks[frame.bank];let eyeError=null,soleError=null;
     if(point&&frame.index===point.frame&&calls.length===1&&calls[0].rect.length===8&&frame.state==='idle'){
      const a=calls[0].rect,m=calls[0].m,b=basic.banks[frame.bank],sourceHeight=point.rect[3];
      const eye=m.f+m.d*(a[5]+point.eyeY*a[7]/sourceHeight),sole=m.f+m.d*(a[5]+point.soleY*a[7]/sourceHeight);
      eyeError=eye-(y-height*DungeonArt.bodyScale(cls)*(b.soleY-b.eyeY)/b.reference);soleError=sole-y;
     }
     sceneDraws.push({scene:RiftApp.getMode()==='playing'?'battle':'town',id:hero.costume||'base-'+cls,cls,bank:frame.bank,index:frame.index,height,dir,eyeError,soleError,calls:calls.length});
    }
   };
  },review);
  let referencePreviewScale=null;
  for(let cls=0;cls<6;cls++){
   await p.locator('.char-card').nth(cls).click();await p.waitForFunction(()=>document.getElementById('select-key-art').dataset.state==='ready');
   assert((await p.locator('#select-key-art').getAttribute('src')).endsWith(['kael','rin','bane','sera','aria','elian'][cls]+'.webp'));
   await p.screenshot({path:'build/previews/scene-size/selection-'+cls+'.png'});await p.locator('#enter-character').click();
   await p.waitForFunction(cls=>DungeonActors.ready(cls),cls,{timeout:60000});await p.evaluate(()=>sceneDraws.length=0);
   await p.waitForFunction(cls=>sceneDraws.some(r=>r.id==='base-'+cls&&r.scene==='town'&&r.eyeError!==null),cls,{timeout:10000});
   await p.screenshot({path:'build/previews/scene-size/base-'+cls+'-town.png'});
   await p.evaluate(()=>RiftApp.solo());await p.locator('#loading-screen').waitFor({state:'hidden',timeout:60000});await p.evaluate(()=>{const g=RiftApp.getState(),hero=g.players[0];hero.inv=0;hero.hurt=0;g.enemies=[{...g.enemies[0],id:9001,type:'brute',skin:2,x:2000,y:hero.y,hp:1e12,maxHp:1e12,stun:99999,cd:99999,at:0}];g.projectiles=[];g.telegraphs=[];g.clearTime=0;});
   await p.waitForFunction(cls=>sceneDraws.some(r=>r.id==='base-'+cls&&r.scene==='battle'&&r.eyeError!==null),cls,{timeout:10000});
   await p.screenshot({path:'build/previews/scene-size/base-'+cls+'-battle.png'});
   const baseline=await p.evaluate(cls=>sceneDraws.filter(r=>r.id==='base-'+cls&&r.eyeError!==null),cls);assert(baseline.every(r=>Math.abs(r.eyeError)<1.5&&Math.abs(r.soleError)<1),'actual basic-body eye/sole reference');bases.push({cls,maxEyeError:Math.max(...baseline.map(r=>Math.abs(r.eyeError)))});
   await p.evaluate(()=>RiftApp.home());
   const ids=Object.keys(review.costumes).filter(id=>review.costumes[id].cls===cls);
   for(const id of ids){
    await p.locator('#town-shortcuts [data-shortcut=premium]').click();await p.locator('[data-premium-item="'+id+'"]').click();
    await p.waitForFunction(()=>DungeonPremiumUI.state().ready);
    if(await p.evaluate(id=>!!DungeonKeyArt.source(DungeonPremium.item(id).cls,id),id)){
     await p.waitForFunction(()=>document.getElementById('premium-key-art').dataset.state==='ready');
     assert((await p.locator('#premium-key-art').getAttribute('src')).endsWith(id+'.webp'));
    }else{
     assert(await p.locator('[data-premium-view=art]').isDisabled());assert.equal(await p.evaluate(()=>DungeonPremiumUI.state().view),'motion');
    }
    await p.locator('[data-premium-view=motion]').click();
    const zoom=await p.evaluate(()=>DungeonPremiumUI.state().zoom);
    for(const mode of ['idle','run','combo','jump','dash','skill']){
     await p.evaluate(mode=>{DungeonPremiumUI.setMode(mode);return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},mode);
     assert.equal(await p.evaluate(()=>DungeonPremiumUI.state().zoom),zoom,id+' camera must not resize the body when the motion changes');
     const pixels=await p.evaluate(()=>window.previewPixelsPerWorldUnit);assert(pixels>0);
     if(referencePreviewScale===null)referencePreviewScale=pixels;
     assert(Math.abs(pixels-referencePreviewScale)<.001,id+'/'+mode+' actual CSS pixel camera size changed: '+pixels+' expected '+referencePreviewScale);
    }
    await p.evaluate(()=>DungeonPremiumUI.setMode('idle'));await p.locator('#premium-equip').click();
    await p.locator('#premium-close').click();assert.equal(await p.evaluate(()=>DungeonClient.getTown().hero.costume),id);
    await p.evaluate(()=>sceneDraws.length=0);await p.waitForFunction(id=>sceneDraws.some(r=>r.id===id&&r.scene==='town'&&r.eyeError!==null),id,{timeout:10000});
    await p.screenshot({path:'build/previews/scene-size/'+id+'-town.png'});
    await p.keyboard.down('KeyD');await p.waitForTimeout(1400);await p.keyboard.up('KeyD');
    await p.evaluate(()=>{RiftApp.solo();});await p.locator('#loading-screen').waitFor({state:'hidden',timeout:60000});
    assert.equal(await p.evaluate(()=>RiftApp.getState().players[0].costume),id);
    await p.evaluate(()=>{const g=RiftApp.getState(),hero=g.players[0];hero.inv=0;hero.hurt=0;hero.hp=hero.maxHp;g.enemies=[{...g.enemies[0],id:9001,type:'brute',skin:2,x:2000,y:hero.y,hp:1e12,maxHp:1e12,stun:99999,cd:99999,at:0}];g.projectiles=[];g.telegraphs=[];g.clearTime=0;});
    await p.waitForFunction(id=>sceneDraws.some(r=>r.id===id&&r.scene==='battle'&&r.eyeError!==null),id,{timeout:10000});
    await p.screenshot({path:'build/previews/scene-size/'+id+'-battle.png'});
    await p.keyboard.down('KeyD');await p.waitForTimeout(900);await p.keyboard.up('KeyD');
    await p.keyboard.down('KeyJ');await p.waitForTimeout(1700);await p.keyboard.up('KeyJ');
    await p.keyboard.down('Space');await p.waitForFunction(()=>RiftApp.getState().players[0].jump>0);await p.keyboard.up('Space');await p.waitForFunction(()=>RiftApp.getState().players[0].jump<=0);await p.keyboard.down('ShiftLeft');await p.waitForFunction(()=>RiftApp.getState().players[0].dashTime>0);await p.keyboard.up('ShiftLeft');await p.waitForTimeout(350);
    const draws=await p.evaluate(id=>sceneDraws.filter(r=>r.id===id),id);
    for(const scene of ['town','battle']){
     const rows=draws.filter(r=>r.scene===scene),neutral=rows.filter(r=>r.eyeError!==null);
     assert(neutral.length,id+' actual '+scene+' neutral must be visible');assert(rows.every(r=>r.height===260&&r.calls>0),id+' full gameplay body at fixed world size');
     assert(neutral.every(r=>Math.abs(r.eyeError)<1.5&&Math.abs(r.soleError)<1),id+' '+scene+' independently measured eye/sole projection');
     assert(rows.some(r=>r.bank==='run'),id+' actual '+scene+' running');
    }
    assert(draws.some(r=>r.scene==='battle'&&r.bank.startsWith('combo')),id+' actual basic attack');
    for(const name of ['jump','dash'])assert(draws.some(r=>r.scene==='battle'&&r.bank===name),id+' actual '+name);
    records.push({id,cls,scenes:['town','battle'],samples:draws.length,banks:[...new Set(draws.map(r=>r.bank))],maxEyeError:Math.max(...draws.filter(r=>r.eyeError!==null).map(r=>Math.abs(r.eyeError)))});
    fs.writeFileSync('build/previews/premium-scene-size-progress.json',JSON.stringify(records,null,2));
    await p.evaluate(()=>{RiftApp.home();DungeonClient.go('town');});
    await p.locator('#town-shortcuts [data-shortcut=premium]').click();await p.locator('#premium-remove').click();await p.locator('#premium-close').click();await p.evaluate(()=>sceneDraws.length=0);
    assert.equal(await p.evaluate(()=>DungeonClient.getTown().hero.costume),'');
    await p.waitForFunction(cls=>sceneDraws.some(r=>r.id==='base-'+cls&&r.scene==='town'&&r.eyeError!==null),cls,{timeout:10000});
    assert(await p.evaluate(()=>sceneDraws.filter(r=>r.eyeError!==null).every(r=>Math.abs(r.eyeError)<1.5&&Math.abs(r.soleError)<1)),'unequip restores the actual basic body');
   }
   await p.evaluate(()=>DungeonClient.go('characters'));
  }
  assert.equal(records.length,30);assert.deepEqual(errors,[]);
  fs.writeFileSync('build/previews/premium-scene-size-audit.json',JSON.stringify({passed:true,bases,records,errors},null,2));
  console.log('PASS: thirty real shop equips/removals through six character selections, illustrated product details, invariant preview camera, actual town and battle movement/attack renders, measured world eye/sole size and screenshots.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

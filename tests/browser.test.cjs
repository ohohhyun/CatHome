const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const [width,height] of [[320,568],[390,844],[480,960]]){
   const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{window.CatHomeTestOptions={unlockAll:false};if(!localStorage.catHomeSave)localStorage.catHomeSave=JSON.stringify({cleared:9,unlocked:10,best:0,bestRound:1,medals:{},wallet:120,inventory:{continue:0,umbrella:0,water:0,fish:0},musicEnabled:true,sound:false})});
   await page.goto((process.env.GAME_URL||pathToFileURL(path.resolve(__dirname,'../app/src/main/assets/index.html')).href));
   await page.waitForFunction(()=>typeof STAGES!=='undefined');
   assert.equal(await page.locator('#endless').isDisabled(),true);
   assert.match(await page.locator('#story-detail').textContent(),/1~30/);
   assert.match(await page.locator('#home .subtitle').textContent(),/길냥이들의 집사 모집!/);
   const output=path.resolve(process.env.PREVIEW_DIR||'build/previews');fs.mkdirSync(output,{recursive:true});
   await page.locator('#shop-open').click();
   for(const kind of ['continue','umbrella','water','fish'])await page.locator('#buy-'+kind).click();
   assert.equal(await page.evaluate(()=>wallet),24);
   assert.deepEqual(await page.evaluate(()=>({...inventory})),{continue:1,umbrella:1,water:1,fish:1});
   await page.locator('#qty-water').fill('99');await page.locator('#buy-water').click();assert.match(await page.locator('#shop-message').textContent(),/99/);
   assert.equal(await page.evaluate(()=>inventory.water),1);await page.locator('#qty-water').fill('1');
   await page.screenshot({path:path.join(output,`shop-${width}.png`)});
   await page.locator('#shop-close').click();await page.locator('#start').click();
   assert.deepEqual(await page.evaluate(()=>({state,mode,level})),{state:'play',mode:'story',level:9});
   const geometry=await page.evaluate(()=>{const game=document.getElementById('game').getBoundingClientRect(),controls=document.getElementById('controls').getBoundingClientRect(),items=document.getElementById('item-controls').getBoundingClientRect();return {bottomGap:game.bottom-controls.bottom,itemGap:controls.top-items.bottom}});
   assert(Math.abs(geometry.bottomGap-44.4)<2,'controls rise only another 7.4px');assert(geometry.itemGap>=12,'item buttons do not overlap movement controls');
   const hintGeometry=await page.evaluate(()=>{const hint=document.getElementById('hint'),rect=hint.getBoundingClientRect(),game=document.getElementById('game').getBoundingClientRect();return {parent:hint.parentElement.id,bottom:rect.bottom,actorTop:game.top+(py()-40)*game.height/H}});
   assert.equal(hintGeometry.parent,'hud');assert(hintGeometry.bottom<hintGeometry.actorTop-10,'guide does not overlap player or platform');
   assert.equal(await page.locator('#use-fish').isVisible(),true);
   await page.screenshot({path:path.join(output,`patched-controls-${width}.png`)});
   assert.equal(await page.locator('#sound').isVisible(),false);assert.equal(await page.locator('#settings-open').isVisible(),false);
   await page.waitForFunction(()=>document.getElementById('bgm').readyState>=2);
   assert.equal(await page.evaluate(()=>document.getElementById('bgm').paused),false,'calm background music plays after start');
   await page.locator('#pause').click();await page.locator('#pause-settings').click();await page.locator('#sound').click();
   assert.equal(await page.evaluate(()=>Object.keys(soundBuffers).length),6);
   await page.locator('#music-toggle').click();assert.equal(await page.evaluate(()=>document.getElementById('bgm').paused),true);
   await page.locator('#music-toggle').click();await page.locator('#settings-close').click();await page.locator('#next').click();
   await page.locator('#use-umbrella').click();assert.equal(await page.evaluate(()=>usedItems.umbrella),1);assert.equal(await page.evaluate(()=>inventory.umbrella),0);
   await page.locator('#use-water').click();assert.equal(await page.evaluate(()=>usedItems.water),1);assert.equal(await page.evaluate(()=>inventory.water),0);
   await page.evaluate(()=>{shots=[];shotTimer=0;cats=[{lane:1,fromLane:0,x:px,base:px,y:py()-90,lift:0,kind:'straight',type:0,age:0,skin:'cheese',hit:false,passed:false,flee:0}];update(.1)});
   assert(await page.evaluate(()=>cats.some(c=>c.flee>0)),'water hit makes a cat run away');
   await page.evaluate(()=>{waterTime=0;shots=[];spawn=999;cats=[{tag:'now',lane:0,x:112,base:112,y:py()-130,age:0,kind:'straight',type:0,skin:'calico',flee:0,hit:false,passed:false},{tag:'hidden',lane:2,x:272,base:272,y:-350,age:0,kind:'straight',type:0,skin:'tuxedo',flee:0,hit:false,passed:false}]});
   await page.locator('#use-fish').click();
   assert.equal(await page.evaluate(()=>inventory.fish),0);assert.equal(await page.evaluate(()=>cats.find(c=>c.tag==='now').fleeKind),'fish');
   assert.equal(await page.evaluate(()=>cats.find(c=>c.tag==='hidden').flee),0);
   await page.evaluate(()=>{cats.push({tag:'later',lane:1,x:192,base:192,y:80,age:0,kind:'straight',type:0,skin:'cheese',flee:0,hit:false,passed:false});update(.02)});
   assert.equal(await page.evaluate(()=>cats.find(c=>c.tag==='later').flee),0);
   await page.evaluate(()=>{elapsed=8;hits=3;panel('fail')});await page.locator('#continue-run').click();
   assert.deepEqual(await page.evaluate(()=>({state,used:usedItems.continue,stock:inventory.continue})),{state:'play',used:1,stock:0});
   await page.evaluate(()=>{hits=3;panel('fail')});assert.equal(await page.locator('#continue-run').isDisabled(),false);await page.locator('#continue-run').click();assert.equal(await page.evaluate(()=>state),'fail');
   await page.locator('#next').click();
   await page.evaluate(()=>{cats=[];elapsed=STAGES[9][2]-.001;update(.02)});assert.equal(await page.evaluate(()=>state),'clear');
   await page.locator('#next').click();assert.deepEqual(await page.evaluate(()=>({mode,level})),{mode:'story',level:10});
   await page.evaluate(()=>goHome());assert.equal(await page.locator('#endless').isEnabled(),true);await page.locator('#endless').click();
   assert.deepEqual(await page.evaluate(()=>({mode,round:endlessRound(),cleared})),{mode:'endless',round:1,cleared:10});
   await page.evaluate(()=>{cats=[];elapsed=19.99;update(.02)});assert.equal(await page.evaluate(()=>endlessRound()),2);
   await page.evaluate(()=>{start(19);cats=[];elapsed=STAGES[19][2]-.001;update(.02)});assert.equal(await page.evaluate(()=>state),'clear','normal mode continues beyond stage 20');
   await page.locator('#next').click();assert.equal(await page.evaluate(()=>level),20);
   await page.evaluate(()=>{start(29);cats=[];elapsed=STAGES[29][2]-.001;update(.02)});assert.equal(await page.evaluate(()=>state),'win');
   await page.locator('#next').click();await page.locator('#select').click();assert.equal(await page.locator('#levelgrid button').count(),30);
   await page.locator('#levelgrid button').last().click();assert.equal(await page.evaluate(()=>level),29);
   assert.equal(await page.evaluate(()=>spriteCache.size),20);
   await page.evaluate(()=>{elapsed=5;layoutLanes();state='pause';cats=['diagonal','pounce','feint'].map((kind,i)=>{const c={skin:['siamese','silver','black'][i],kind,lane:i,fromLane:2-i,x:lanes[i],y:py()-160-i*45,age:1,type:0};positionCat(c);return c});render()});
   await page.screenshot({path:path.join(output,`jump-patterns-${width}.png`)});
   const newKinds=await page.evaluate(()=>{start(10);wave();wave();return cats.map(c=>c.kind)});
   assert(newKinds.includes('roll'));assert(newKinds.includes('forward'));
   const pairedRoll=await page.evaluate(()=>{cats=[];let found=false;for(let n=0;n<12;n++){cats=[];wave();if(cats.some(c=>c.kind==='roll')){found=true;break}}if(!found)throw Error('no rolling encounter');state='pause';const roll=cats.find(c=>c.kind==='roll'),blocker=cats.find(c=>c.rollBlocker),positions=[];for(let i=0;i<=40;i++){roll.age=roll.rollArrival-2+10*i/40;positionCat(roll);positions.push(roll.x)}roll.y=blocker.y=py()-95;roll.age=roll.rollArrival;positionCat(roll);positionCat(blocker);render();return {pair:roll.rollPair,blocked:blocker.lane,sameRow:roll.row===blocker.row,sameY:roll.y===blocker.y,positions}});
   assert.equal(pairedRoll.pair.length,2);assert.equal(Math.abs(pairedRoll.pair[0]-pairedRoll.pair[1]),1);assert(!pairedRoll.pair.includes(pairedRoll.blocked));assert(pairedRoll.sameRow&&pairedRoll.sameY);
   let rollReversals=0,lastDir=0;for(let n=1;n<pairedRoll.positions.length;n++){const dir=Math.sign(pairedRoll.positions[n]-pairedRoll.positions[n-1]);if(dir&&lastDir&&dir!==lastDir)rollReversals++;if(dir)lastDir=dir}assert(rollReversals>=4,'roller must repeatedly reverse, not cross once');
   await page.screenshot({path:path.join(output,`paired-shuttle-${width}.png`)});
   const expertStats=await page.evaluate(()=>{start(0,'endless');elapsed=99*20;sync();wave();return {stage:document.getElementById('stage').textContent,label:document.getElementById('mode-label').textContent,speed:difficulty().speed,gap:nextWaveDelay(difficulty())}});
   assert.match(expertStats.stage,/100탄/);assert.match(expertStats.label,/EXPERT/);assert.equal(expertStats.speed,840);assert(expertStats.gap>=.24&&expertStats.gap<=.27);
   await page.screenshot({path:path.join(output,`expert-stage-100-${width}.png`)});
   await page.evaluate(()=>{start(0,'endless');inventory={continue:4,umbrella:4,water:4,fish:4};cats=[];spawn=999;sync()});
   for(const kind of ['umbrella','water','fish']){
    for(let use=1;use<=3;use++){
     await page.locator('#use-'+kind).click();assert.equal(await page.evaluate(key=>usedItems[key],kind),use);assert.equal(await page.evaluate(key=>inventory[key],kind),4-use);
     if(use<3)assert.match(await page.locator('#use-'+kind+' small').textContent(),new RegExp((3-use)+'/3'));
     if(kind==='umbrella')await page.evaluate(()=>{umbrellaTime=0;invincible=0;sync()});
     if(kind==='water')await page.evaluate(()=>{waterTime=0;shots=[];sync()});
    }
    assert.equal(await page.locator('#use-'+kind).isDisabled(),true,'fourth use blocked despite remaining inventory');
   }
   for(let use=1;use<=3;use++){
    await page.evaluate(()=>{hits=3;panel('fail')});assert.equal(await page.locator('#continue-run').isEnabled(),true);assert.match(await page.locator('#continue-run').textContent(),new RegExp((4-use)+'/3'));
    await page.locator('#continue-run').click();assert.equal(await page.evaluate(()=>usedItems.continue),use);assert.equal(await page.evaluate(()=>inventory.continue),4-use);
    assert.deepEqual(await page.evaluate(()=>({umbrella:usedItems.umbrella,water:usedItems.water,fish:usedItems.fish})),{umbrella:3,water:3,fish:3});
   }
   await page.evaluate(()=>{hits=3;panel('fail')});assert.equal(await page.locator('#continue-run').isDisabled(),true);assert.match(await page.locator('#continue-run').textContent(),/3회 사용 완료/);
   await page.screenshot({path:path.join(output,`endless-three-item-uses-${width}.png`)});
   const recovery=await page.evaluate(()=>{start(0,'endless');waveIndex=0;const kinds=new Set();for(let n=0;n<12;n++){cats=[];wave();for(const c of cats)kinds.add(c.kind)}cats=[];spawn=999;hits=2;elapsed=199.99;update(.02);state='pause';sync();return {kinds:[...kinds],hits,round:endlessRound(),toast:document.getElementById('toast').textContent}});
   assert(recovery.kinds.includes('roll')&&recovery.kinds.includes('forward'));assert.equal(recovery.hits,1);assert.equal(recovery.round,11);assert.match(recovery.toast,/하트 1개 회복/);
   await page.screenshot({path:path.join(output,`endless-heart-recovery-${width}.png`)});
   await page.evaluate(()=>{goHome();wallet=321;save()});
   await page.locator('#skin-open').click();assert.equal(await page.locator('#skin-shop').isVisible(),true);const shopBounds=await page.evaluate(()=>{const shop=document.getElementById('skin-shop').getBoundingClientRect(),game=document.getElementById('game').getBoundingClientRect();return {offset:Math.abs(shop.top-game.top),height:Math.abs(shop.height-game.height),scroll:document.getElementById('game').scrollTop}});assert(shopBounds.offset<1&&shopBounds.height<1&&shopBounds.scroll===0,'shop covers game viewport without scrolling the game');
   assert.equal(await page.evaluate(()=>window.CatHomeStore.products.length),9);
   for(const category of ['hero','cats','map']){
    await page.locator('#skin-tab-'+category).click();assert.equal(await page.locator('#skin-cards button').count(),3);
    const products=await page.evaluate(c=>SKIN_CATALOG.filter(p=>p.category===c).map(p=>p.id),category);
    for(const id of products){
     await page.locator('#skin-card-'+id.replace('.','-')).click();assert.equal(await page.locator('#skin-price').textContent(),'₩1,100');
     await page.locator('#skin-buy').click();assert.equal(await page.evaluate(c=>equippedSkins[c],category),id);assert.equal(await page.evaluate(()=>wallet),321);
     assert.equal(await page.locator('#skin-buy').textContent(),'장착 중');assert.equal(await page.locator('#skin-buy').isDisabled(),true);
    }
    await page.evaluate(()=>document.getElementById('skin-shop').scrollTop=0);
    const shot=await page.screenshot({path:path.join(output,`skin-store-${category}-${width}.png`)});
    if(width===390&&process.env.SKIN_REVIEW==='1')console.log('SKIN_REVIEW_'+category+' '+shot.toString('base64'));
    const previewHash=await page.locator('#skin-preview').evaluate(c=>c.toDataURL());assert(previewHash.length>2000,'preview has rendered artwork');
    await page.locator('#skin-reset').click();assert.equal(await page.evaluate(c=>equippedSkins[c],category),'default');
    await page.locator('#skin-buy').click();assert.equal(await page.evaluate(c=>equippedSkins[c],category),products[2]);
   }
   await page.locator('#skin-close').click();assert.equal(await page.locator('#skin-shop').isVisible(),false);
   await page.reload();await page.waitForFunction(()=>typeof SKIN_CATALOG!=='undefined');
   assert.deepEqual(await page.evaluate(()=>({...equippedSkins})),{hero:'hero.duck',cats:'cats.bakery',map:'map.snow'});
   assert.equal(await page.evaluate(()=>Object.keys(skinOwnership).length),9);assert.equal(await page.evaluate(()=>wallet),321);
   const physics=await page.evaluate(()=>{start(0,'endless');spawn=999;invincible=999;const first={...difficulty()};for(let n=0;n<60;n++)update(1/60);return {hits,elapsed,first,cache:spriteCache.size,buildings:buildingCache.size}});
   assert.equal(physics.hits,0);assert(Math.abs(physics.elapsed-1)<1e-7);assert.equal(physics.first.speed,400);assert(physics.cache<=100&&physics.buildings<=78,'bounded artwork caches');
   await page.screenshot({path:path.join(output,`skins-equipped-game-${width}.png`)});
   assert.deepEqual(errors,[],`Browser exceptions at ${width}x${height}`);
   await context.close();console.log(`PASS browser ${width}x${height}: three endless uses for each item and continue, per-kind remaining labels, no resets after continue, plus existing 30-stage game`);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

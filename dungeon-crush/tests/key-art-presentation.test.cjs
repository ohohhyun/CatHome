const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const source=JSON.parse(fs.readFileSync('art-source/key-art-sources.json')),url=process.env.DUNGEON_TEST_URL||'file://'+path.resolve('app/src/main/assets/index.html');
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await browser.newPage({viewport:{width:1280,height:640},hasTouch:true}),errors=[],audit=[];p.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync('build/previews/key-art',{recursive:true});
 try{
  await p.goto(url);await p.waitForFunction(()=>window.DungeonKeyArt&&window.DungeonPremiumUI);await p.evaluate(()=>document.fonts.ready);
  const decoded=await p.evaluate(async assets=>{
   const results=[];for(const a of assets){const im=new Image();im.src=a.file;await im.decode();if(im.naturalWidth!==a.width||im.naturalHeight!==a.height)throw Error(a.id+' bitmap mismatch');results.push(a.id);}return results;
  },source.assets);assert.equal(decoded.length,source.assets.length);
  await p.locator('#title-cover-open').click();await p.locator('#game-start').click();
  for(const size of [{width:1280,height:640},{width:740,height:360},{width:640,height:296},{width:1024,height:768},{width:740,height:360,insets:{left:28,right:18,top:6,bottom:10}}]){
   await p.setViewportSize({width:size.width,height:size.height});await p.evaluate(insets=>{for(const edge of ['left','right','top','bottom'])document.documentElement.style.setProperty('--safe-'+edge,(insets[edge]||0)+'px');},size.insets||{});
   for(let cls=0;cls<6;cls++){
    await p.locator('.char-card').nth(cls).click();await p.waitForFunction(()=>document.getElementById('select-key-art').dataset.state==='ready');
    const result=await p.locator('#select-key-art').evaluate(img=>{const r=img.getBoundingClientRect(),roster=document.querySelector('.select-roster').getBoundingClientRect(),profile=document.querySelector('.selection-profile').getBoundingClientRect(),style=getComputedStyle(img);return {src:img.getAttribute('src'),fit:style.objectFit,left:r.left,right:r.right,top:r.top,bottom:r.bottom,profileRight:profile.right,rosterLeft:roster.left,alt:img.alt};});
    const expected=await p.evaluate(cls=>DungeonKeyArt.source(cls,DungeonPremium.appearance(RiftApp.getSave(),cls).costume),cls);
    assert.equal(result.src,expected);assert.equal(result.fit,'contain');assert(result.alt.includes('일러스트'));
    assert(result.left>=0&&result.right<=size.width+1&&result.top>=0&&result.bottom<=size.height+1,'whole art surface stays on the phone');assert(result.left>=result.profileRight-1&&result.right<=result.rosterLeft+1,'art never covers profile or roster');
    assert.equal(await p.locator('.char-card[aria-pressed=true]').count(),1);
    if(size.height<=550){const visible=await p.locator('#character-slot').evaluate(slot=>{const r=slot.getBoundingClientRect();return [...slot.querySelectorAll('.char-card')].every(card=>{const b=card.getBoundingClientRect();return b.top>=r.top-1&&b.bottom<=r.bottom+1&&b.left>=r.left-1&&b.right<=r.right+1;});});assert(visible,'all six phone character choices must be visible together');}
    audit.push({size,cls,source:result.src});if(cls===4||cls===5)await p.screenshot({path:'build/previews/key-art/selection-'+size.width+'-'+cls+'.png'});
   }
  }
  await p.evaluate(()=>{for(const edge of ['left','right','top','bottom'])document.documentElement.style.setProperty('--safe-'+edge,'0px');});await p.setViewportSize({width:740,height:360});
  await p.evaluate(()=>{for(const cls of [0,5,1,4,2,3,0])RiftApp.choose(cls);DungeonClient.refresh();});await p.waitForFunction(()=>document.getElementById('select-key-art').dataset.state==='ready');assert((await p.locator('#select-key-art').getAttribute('src')).endsWith('kael.webp'));
  await p.locator('#enter-character').click();await p.locator('#town-shortcuts [data-shortcut=premium]').click();
  await p.locator('[data-premium-view=effect]').click();await p.locator('#premium-fit-effect').click();assert.equal(await p.locator('#premium-zoom').inputValue(),'0.6');
  await p.locator('[data-premium-view=motion]').click();assert(await p.locator('#premium-fit-effect').isVisible());await p.locator('#premium-fit-effect').click();assert.equal(await p.locator('#premium-zoom').inputValue(),'1.3');
  for(let cls=0;cls<6;cls++){
   await p.locator('#premium-class').selectOption(String(cls));
   for(const id of await p.locator('[data-premium-item]').evaluateAll(ns=>ns.map(n=>n.dataset.premiumItem))){
    await p.locator('[data-premium-item="'+id+'"]').click();const exists=source.assets.some(a=>a.id===id);
    if(exists){await p.waitForFunction(()=>document.getElementById('premium-key-art').dataset.state==='ready');assert.equal(await p.evaluate(()=>DungeonPremiumUI.state().view),'art');assert((await p.locator('#premium-key-art').getAttribute('src')).endsWith(id+'.webp'));assert(await p.locator('#premium-preview').isHidden());}
    else{assert(await p.locator('[data-premium-view=art]').isDisabled());assert.equal(await p.evaluate(()=>DungeonPremiumUI.state().view),'motion');}
    for(const view of ['motion','effect']){await p.locator('[data-premium-view='+view+']').click();assert(await p.locator('#premium-preview').isVisible());}
    if(exists)await p.locator('[data-premium-view=art]').click();
   }
  }
  await p.locator('[data-premium-tab=pet]').click();assert(await p.locator('[data-premium-view=art]').isDisabled());assert.equal(await p.evaluate(()=>DungeonPremiumUI.state().view),'motion');assert(await p.locator('#premium-preview').isVisible());
  await p.locator('#premium-close').click();await p.evaluate(()=>DungeonClient.go('characters'));await p.locator('.char-card').nth(5).click();await p.reload();await p.waitForFunction(()=>window.DungeonPremiumUI);await p.locator('#title-cover-open').click();await p.locator('#game-start').click();await p.waitForFunction(()=>document.getElementById('select-key-art').dataset.state==='ready');assert((await p.locator('#select-key-art').getAttribute('src')).endsWith('elian.webp'));
  const q=await browser.newPage({viewport:{width:640,height:296}});q.on('pageerror',e=>errors.push(e.message));let fail=true;await q.route('**/art/key-art/kael.webp',route=>fail?route.abort():route.continue());await q.goto(url);await q.waitForFunction(()=>window.DungeonPremiumUI);await q.locator('#title-cover-open').click();await q.locator('#game-start').click();await q.waitForFunction(()=>document.getElementById('select-key-art').dataset.state==='error');assert(await q.locator('.selection-art .key-art-status button').isVisible());fail=false;await q.locator('.selection-art .key-art-status button').click();await q.waitForFunction(()=>document.getElementById('select-key-art').dataset.state==='ready');await q.screenshot({path:'build/previews/key-art/recovered-640.png'});await q.close();
  const r=await browser.newPage({viewport:{width:640,height:296}});r.on('pageerror',e=>errors.push(e.message));let blockBody=true;await r.route('**/art/premium/kael-noel-movement.webp',route=>blockBody?route.abort():route.continue());await r.goto(url);await r.waitForFunction(()=>window.DungeonPremiumUI);await r.evaluate(()=>{RiftApp.transaction(s=>DungeonPremium.purchase(s,'kael-noel'));DungeonPremiumUI.open();});await r.waitForFunction(()=>DungeonPremiumArt.status().failures.length>0);assert(await r.locator('#premium-equip').isDisabled());assert(await r.locator('#premium-preview-retry').isVisible(),'sprite retry must remain reachable while viewing the illustration');blockBody=false;await r.locator('#premium-preview-retry').click();await r.waitForFunction(()=>!document.getElementById('premium-equip').disabled,null,{timeout:60000});await r.close();
  assert.deepEqual(errors,[]);fs.writeFileSync('build/previews/key-art-audit.json',JSON.stringify({passed:true,decoded,audit,productArts:source.assets.length-6,pending:source.pending,recovery:true,spriteRecoveryInArtView:true,errors},null,2));
  console.log('PASS: '+decoded.length+' decoded key arts; six illustrated selections at five phone/tablet layouts; exact outfit/product mapping, art/motion/effect tabs, pet fallback, rapid selection, reload, isolated load failure and retry.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

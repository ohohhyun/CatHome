const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const sizes=[{width:1280,height:591},{width:1024,height:472},{width:960,height:480},{width:740,height:360},{width:640,height:296},{width:1024,height:768},{width:1920,height:1080},{width:1280,height:591,insets:{left:38,right:30,top:8,bottom:20}},{width:640,height:296,insets:{left:22,right:18,top:6,bottom:10}}];
(async()=>{
 fs.mkdirSync('build/previews',{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await browser.newPage({viewport:sizes[0],hasTouch:true}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.addInitScript(()=>{window.RiftNative={send:()=>{},disconnect:()=>{},saveProgress:()=>true,vibrate:()=>{}};});
  await p.goto(process.env.DUNGEON_TEST_URL||'file://'+path.resolve('app/src/main/assets/index.html'));
  await p.waitForFunction(()=>window.DungeonNavigation);await p.evaluate(()=>document.fonts.ready);
  await p.locator('#title-cover-open').click();await p.locator('#game-start').click();await p.locator('#enter-character').click();
  // Existing quest refresh initializes the current daily ledger; prime it before the read-only snapshot.
  await p.evaluate(()=>{RiftTown.open('quests');appBack();});
  const original=await p.evaluate(()=>JSON.stringify(RiftApp.getSave()));
  const dock=key=>p.locator('#town-shortcuts [data-shortcut='+key+']');
  const tile=key=>p.locator('#quick-menu-grid [data-shortcut='+key+']');
  // Inspect actual painted glyphs against their button and ancestor clipping boundaries.
  async function fit(selector){
   const failures=await p.locator(selector).evaluate(root=>{
    const issues=[],canvas=document.createElement('canvas'),ctx=canvas.getContext('2d'),records=[];
    const overlap=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1.5;
    for(const button of root.querySelectorAll('button')){
     const br=button.getBoundingClientRect();if(!br.width||!br.height)continue;
     const walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);let node;
     while(node=walker.nextNode()){
      const el=node.parentElement,s=getComputedStyle(el);if(!node.textContent.trim()||!el.getClientRects().length||s.display==='none')continue;
      ctx.font=s.font||[s.fontStyle,s.fontWeight,s.fontSize,s.fontFamily].join(' ');const metrics=ctx.measureText(node.textContent.trim()),range=document.createRange();range.selectNodeContents(node);
      for(const rr of range.getClientRects()){
       const rect={left:rr.left,right:rr.right,top:rr.top+(metrics.fontBoundingBoxAscent||metrics.actualBoundingBoxAscent)-metrics.actualBoundingBoxAscent,bottom:rr.top+(metrics.fontBoundingBoxAscent||metrics.actualBoundingBoxAscent)+metrics.actualBoundingBoxDescent};
       if(rect.left<br.left-2||rect.right>br.right+2||rect.top<br.top-3||rect.bottom>br.bottom+3)issues.push({kind:'glyph escapes button',text:node.textContent,rect,button:{left:br.left,right:br.right,top:br.top,bottom:br.bottom}});
       let visible={...rect};for(let n=el.parentElement;n;n=n.parentElement){const cs=getComputedStyle(n),r=n.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(cs.overflowX)){visible.left=Math.max(visible.left,r.left);visible.right=Math.min(visible.right,r.right);}if(/auto|scroll|hidden|clip/.test(cs.overflowY)){visible.top=Math.max(visible.top,r.top);visible.bottom=Math.min(visible.bottom,r.bottom);}}
       if(visible.right>visible.left&&visible.bottom>visible.top&&visible.bottom>0&&visible.top<innerHeight)records.push({rect:visible,el,text:node.textContent});
      }
     }
    }
    for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++)if(records[i].el!==records[j].el&&overlap(records[i].rect,records[j].rect))issues.push({kind:'overlapping text',a:records[i].text,b:records[j].text});
    return issues;
   });assert.deepEqual(failures,[],selector+' text fit at '+JSON.stringify(p.viewportSize()));
  }
  for(const size of sizes){
   await p.setViewportSize({width:size.width,height:size.height});
   await p.evaluate(insets=>{for(const edge of ['left','right','top','bottom'])document.documentElement.style.setProperty('--safe-'+edge,(insets[edge]||0)+'px');DungeonClient.go('town');},size.insets||{});
   await fit('#town-shortcuts');
   const targets=await p.locator('#town-shortcuts button').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect(),c=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return {w:b.width,h:b.height,reachable:n.contains(c),left:b.left,right:b.right,top:b.top,bottom:b.bottom};}));
   assert.equal(targets.length,8);assert(targets.every(v=>v.w>=44&&v.h>=44&&v.reachable&&v.left>=0&&v.top>=0&&v.right<=size.width&&v.bottom<=size.height),'eight reachable finger-sized shortcuts');
   await dock('menu').click();assert.equal(await p.locator('#quick-menu-grid button').count(),13);
   const shell=await p.locator('.quick-menu-shell').boundingBox();assert(shell.x>=0&&shell.y>=0&&shell.x+shell.width<=size.width+1&&shell.y+shell.height<=size.height+1);
   for(const scale of [1,1.4]){
    if(scale!==1)await p.locator('#quick-menu-screen').evaluate(root=>{window.navFonts=[...root.querySelectorAll('strong,small,span,h2,p,button')].filter(n=>[...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())).map(n=>[n,n.style.fontSize,n.style.lineHeight,parseFloat(getComputedStyle(n).fontSize)]);for(const[n,,,font]of navFonts){n.style.fontSize=font*1.4+'px';n.style.lineHeight='1.65';}});
    await fit('#quick-menu-screen');await tile('back').scrollIntoViewIfNeeded();await fit('#quick-menu-screen');assert(await tile('back').isVisible());
    await p.screenshot({path:'build/previews/navigation-'+size.width+'-'+size.height+'-'+scale+(size.insets?'-safe':'')+'.png'});
    if(scale!==1)await p.evaluate(()=>{for(const[n,size,line]of navFonts){n.style.fontSize=size;n.style.lineHeight=line;}});
   }
   await p.locator('#quick-menu-close').click();assert(await dock('menu').evaluate(n=>n===document.activeElement));
  }
  await p.setViewportSize({width:1280,height:591});
  await p.evaluate(()=>{for(const edge of ['left','right','top','bottom'])document.documentElement.style.setProperty('--safe-'+edge,'0px');DungeonClient.visitNPC('trainer');});
  await dock('menu').click();assert.equal(await p.evaluate(()=>DungeonClient.getTown().destination),null,'opening menus stops a pending NPC route');
  const x=await p.evaluate(()=>DungeonClient.getTown().hero.x);await p.keyboard.press('KeyD');await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>DungeonClient.getTown().hero.x),x,'no movement behind the menu');
  await p.locator('#quick-menu-close').focus();await p.keyboard.press('Shift+Tab');assert(await p.locator('#quick-menu-screen').evaluate(n=>n.contains(document.activeElement)));await p.keyboard.press('Escape');assert(await p.locator('#quick-menu-screen').isHidden());
  for(const key of ['inventory','skills','shop']){await dock(key).click();assert(await p.locator('#rpg-screen').isVisible());assert.equal(await p.locator('#quick-menu-screen').isHidden(),true);await p.evaluate(()=>appBack());assert(await p.locator('#rpg-screen').isHidden());}
  // Direct services retain the same context, protected sales and confirmation flow.
  await dock('shop').click();assert(await p.locator('#town-tabs [data-town=sell]').isVisible());assert(await p.locator('#town-tabs [data-town=forge]').isHidden());await p.locator('#town-tabs [data-town=sell]').click();assert.equal(await p.locator('.shop-card[data-item-id]').count(),0,'initial worn gear cannot be sold');await p.evaluate(()=>appBack());
  await dock('menu').click();await tile('forge').click();assert(await p.locator('#town-tabs [data-town=craft]').isVisible());assert(await p.locator('#town-tabs [data-town=sell]').isHidden());await p.evaluate(()=>appBack());
  for(const [key,id]of [['quests','rpg-screen'],['guide','guide-screen'],['settings','settings-screen'],['ranking','ranking-screen']]){await dock('menu').click();await tile(key).click();assert(await p.locator('#'+id).isVisible(),key+' opens from full menu');assert(await p.locator('#quick-menu-screen').isHidden());await p.evaluate(()=>appBack());assert(await p.locator('#'+id).isHidden());}
  await dock('menu').click();await tile('lan').click();assert.equal(await p.evaluate(()=>DungeonClient.playMode()),'wifi');assert.equal(await p.evaluate(()=>DungeonClient.phase()),'contents','Wi-Fi shortcut selects a co-op expedition before room setup');await p.evaluate(()=>appBack());assert.equal(await p.evaluate(()=>DungeonClient.phase()),'modes');await p.evaluate(()=>appBack());assert.equal(await p.evaluate(()=>DungeonClient.phase()),'town');
  await dock('menu').click();await p.evaluate(()=>appBack());assert(await p.locator('#quick-menu-screen').isHidden());
  assert.equal(await p.evaluate(()=>JSON.stringify(RiftApp.getSave())),original,'navigation and inspections preserve progress');
  await dock('menu').click();await tile('characters').click();assert.equal(await p.evaluate(()=>DungeonClient.phase()),'characters');await p.locator('#enter-character').click();
  assert.equal(await p.evaluate(()=>DungeonClient.getTown().near),false);await dock('expedition').click();assert.equal(await p.evaluate(()=>DungeonClient.phase()),'modes','expedition no longer requires walking to the distant portal');await p.locator('[data-playmode=single]').click();await p.locator('[data-content=story]').click();assert.equal(await p.evaluate(()=>DungeonClient.phase()),'stages');await p.locator('#stage-start').click();await p.locator('#loading-screen').waitFor({state:'hidden',timeout:40000});assert(await p.locator('#town-shortcuts').isHidden());assert(await p.locator('#mobility-actions').isVisible());assert.equal(await p.evaluate(()=>DungeonNavigation.open()),false,'town menu cannot cover combat');
  assert.deepEqual(errors,[]);fs.writeFileSync('build/previews/navigation-audit.json',JSON.stringify({passed:true,sizes,scales:[1,1.4],shortcuts:8,functions:12,expeditionDirect:true,serviceContexts:true,readOnlyNavigation:true},null,2));
  console.log('PASS: eight reachable 44px town shortcuts; full menu glyph/overlap audit at nine viewports/insets and 1.4x fonts; service contexts and equipped-sale protection, focus/Back/Escape/input isolation, all menu destinations, read-only navigation, direct expedition and combat controls.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});

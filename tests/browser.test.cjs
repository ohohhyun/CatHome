const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const [width,height] of [[320,568],[390,844],[480,960]]){
   const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{localStorage.catCleared='9';localStorage.catUnlocked='10'});
   await page.goto(pathToFileURL(path.resolve(__dirname,'../app/src/main/assets/index.html')).href);
   await page.waitForFunction(()=>typeof STAGES!=='undefined');
   assert.equal(await page.locator('#start').isVisible(),true);
   assert.equal(await page.locator('#endless').isVisible(),true);
   assert.equal(await page.locator('#endless').isDisabled(),true);
   assert.match(await page.locator('#story-detail').textContent(),/1~20/);
   await page.locator('#start').click();
   assert.deepEqual(await page.evaluate(()=>({state,mode,level})),{state:'play',mode:'story',level:9});
   // Complete stage 10 through the real update function; campaign must continue normally.
   await page.evaluate(()=>{cats=[];elapsed=STAGES[9][2]-.001;update(.02)});
   assert.equal(await page.evaluate(()=>state),'clear');
   await page.locator('#next').click();
   assert.deepEqual(await page.evaluate(()=>({mode,level})),{mode:'story',level:10});
   await page.evaluate(()=>goHome());
   assert.equal(await page.locator('#endless').isEnabled(),true);
   assert.match(await page.locator('#endless-detail').textContent(),/끝없이/);
   const output=path.resolve(process.env.PREVIEW_DIR||'build/previews');fs.mkdirSync(output,{recursive:true});
   await page.screenshot({path:path.join(output,`mode-menu-${width}.png`)});
   await page.locator('#endless').click();
   assert.deepEqual(await page.evaluate(()=>({mode,round:endlessRound(),cleared})),{mode:'endless',round:1,cleared:10});
   await page.evaluate(()=>{cats=[];elapsed=19.99;update(.02)});
   assert.equal(await page.evaluate(()=>endlessRound()),2);
   await page.evaluate(()=>goHome());await page.locator('#start').click();
   assert.deepEqual(await page.evaluate(()=>({mode,level})),{mode:'story',level:10});
   await page.evaluate(()=>{start(19);cats=[];elapsed=STAGES[19][2]-.001;update(.02)});
   assert.equal(await page.evaluate(()=>state),'win');await page.locator('#next').click();
   assert.equal(await page.evaluate(()=>state),'menu');
   await page.locator('#select').click();assert.equal(await page.locator('#levelgrid button').count(),20);
   await page.locator('#levelgrid button').last().click();
   assert.deepEqual(await page.evaluate(()=>({mode,level})),{mode:'story',level:19});
   assert.deepEqual(errors,[],`Browser exceptions at ${width}x${height}`);
   await context.close();console.log(`PASS browser ${width}x${height}: mode menu, stage 10 unlock, normal 11, independent endless, normal 20 ending and scrollable stage map`);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

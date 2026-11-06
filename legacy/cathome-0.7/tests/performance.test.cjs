const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const baseline=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'cathome-perf-')),'baseline.html');
fs.writeFileSync(baseline,execFileSync('git',['show','af3af5a18f7967187fb4b977aa7ec79def3c2286:app/src/main/assets/index.html']));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 async function measure(file){
  const context=await browser.newContext({viewport:{width:384,height:720}}),page=await context.newPage();
  await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;let seed=99;Math.random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296}});
  const session=await context.newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(pathToFileURL(file).href);
  const result=await page.evaluate(()=>{
   cleared=20;start(19);sound=false;elapsed=10;score=500;combo=10;invincible=10000;coins=[];particles=[];floaters=[];
   cats=Array.from({length:12},(_,i)=>({lane:i%3,x:112+i%3*80,base:112+i%3*80,y:140+i%6*65,age:i/3,speed:300,col:['#e6ac74','#c6c5d0','#eee1bf'][i%3],skin:['calico','tuxedo','cheese'][i%3],type:i%3,passed:true,hit:false,warn:0}));
   function tick(){t+=1/60;road+=2;score+=1/6;if(typeof hudTimer!=='undefined')hudTimer-=1/60;for(const cat of cats)cat.age+=1/60;sync(false);render()}
   for(let i=0;i<120;i++)tick();
   let fillRects=0,images=0,labels=0;const fr=ctx.fillRect,di=ctx.drawImage,ft=ctx.fillText;
   ctx.fillRect=function(...args){fillRects++;return fr.apply(this,args)};ctx.drawImage=function(...args){images++;return di.apply(this,args)};ctx.fillText=function(...args){labels++;return ft.apply(this,args)};
   render();ctx.fillRect=fr;ctx.drawImage=di;ctx.fillText=ft;
   const observer=new MutationObserver(()=>{});observer.observe(document.getElementById('hud'),{subtree:true,attributes:true,childList:true,characterData:true});observer.observe(document.getElementById('dash'),{subtree:true,attributes:true,childList:true});observer.observe(document.getElementById('combo'),{subtree:true,attributes:true,childList:true});
   const before=performance.now();for(let i=0;i<360;i++)tick();const cpuMs=performance.now()-before;
   const mutations=observer.takeRecords().length;observer.disconnect();
   return {frames:360,cpuMs,meanWorkMs:cpuMs/360,mutations,paintCalls:fillRects+images+labels,fillRects,images,labels};
  });
  await context.close();return result;
 }
 try{
  const before=await measure(baseline),after=await measure(path.resolve(__dirname,'../app/src/main/assets/index.html'));
  assert(after.paintCalls<before.paintCalls*.5,'cached artwork must cut draw command count by at least half');
  assert(after.mutations<before.mutations*.4,'HUD must avoid repeated DOM reconstruction');
  console.log('PERFORMANCE_COMPARISON '+JSON.stringify({scenario:'12 cats, moving-lane renderer, HUD, 360 frames; Chrome 4x CPU throttle; scripting/render submission only',before,after,paintReductionPercent:Math.round((1-after.paintCalls/before.paintCalls)*100),mutationReductionPercent:Math.round((1-after.mutations/before.mutations)*100)}));
 }finally{await browser.close();fs.rmSync(path.dirname(baseline),{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});

const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});const pages=[],errors=[];fs.mkdirSync('build/previews',{recursive:true});
try{
 for(let i=0;i<4;i++){
  const p=await browser.newPage({viewport:{width:960,height:480},deviceScaleFactor:1,hasTouch:true});pages.push(p);p.on('pageerror',e=>errors.push(e.message));
  await p.exposeFunction('nativeSend',async raw=>{let body=JSON.parse(raw);if(i===0){for(let j=1;j<pages.length;j++)await pages[j].evaluate(b=>window.onNativeEvent({kind:'packet',peer:0,body:b}),body);}else await pages[0].evaluate(({peer,body})=>window.onNativeEvent({kind:'packet',peer,body}),{peer:i,body});});
  await p.addInitScript(({id})=>{window.RiftNative={send:s=>window.nativeSend(s),disconnect:()=>{},localIp:()=> '192.168.1.20',vibrate:()=>{},host:()=>setTimeout(()=>window.onNativeEvent({kind:'hosting',peer:0,message:'192.168.1.20|1234'}),10),join:()=>setTimeout(()=>window.onNativeEvent({kind:'connected',peer:id,message:''}),10)};},{id:i});
  await p.goto('file://'+path.resolve('app/src/main/assets/index.html'));await p.waitForFunction(()=>window.RiftApp);await p.evaluate(()=>document.fonts.ready);await p.locator('.char-card').nth(i).click();
 }
 await pages[0].screenshot({path:'build/previews/01-menu.png'});await pages[0].locator('#solo').click();await pages[0].waitForFunction(()=>RiftApp.getMode()==='playing');await pages[0].screenshot({path:'build/previews/02-combat.png'});await pages[0].locator('#pause').click();await pages[0].locator('#exit').click();
 await pages[0].locator('#guide-open').click();assert.equal(await pages[0].locator('.skill-catalog>div').count(),6);await pages[0].locator('[data-close="guide-screen"]').click();
 await pages[0].locator('#lan-open').click();await pages[0].locator('#host-room').click();await pages[0].waitForFunction(()=>!document.getElementById('lobby').hidden);
 for(let i=1;i<4;i++){const p=pages[i];await p.locator('#lan-open').click();await p.locator('#nickname').fill('동료'+i);await p.locator('#host-ip').fill('192.168.1.20');await p.locator('#join-code').fill('1234');await p.locator('#join-room').click();await pages[0].waitForFunction(n=>document.querySelectorAll('.roster-player').length===n,i+1);}
 await pages[0].screenshot({path:'build/previews/03-lan-lobby.png'});await pages[0].locator('#party-start').click();for(const p of pages)await p.waitForFunction(()=>RiftApp.getMode()==='playing'&&RiftApp.getState().players.length===4);
 const initial=await pages[0].evaluate(()=>RiftApp.getState().players.find(p=>p.id===2).x);await pages[2].keyboard.down('KeyD');await pages[2].waitForTimeout(450);await pages[2].keyboard.up('KeyD');await pages[0].waitForFunction(x=>RiftApp.getState().players.find(p=>p.id===2).x>x+20,initial);
 await pages[0].locator('#pause').click();for(const p of pages)await p.waitForFunction(()=>!document.getElementById('pause-screen').hidden);await pages[0].locator('#resume').click();
 await pages[1].screenshot({path:'build/previews/04-four-player.png'});await pages[0].evaluate(()=>RiftApp.getState().phase='victory');for(const p of pages){await p.waitForFunction(()=>RiftApp.getMode()==='result');assert((await p.evaluate(()=>RiftApp.getSave().gold))>=0);}
 await pages[0].screenshot({path:'build/previews/05-results.png'});assert.deepEqual(errors,[]);console.log('PASS: offline art/menu, solo start/pause, six class skills, four-client lobby and start, remote movement, host pause/resume, terminal state delivery and rewards.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});

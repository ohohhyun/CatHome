const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
(async()=>{
 const review=JSON.parse(fs.readFileSync('art-source/premium-body-calibration.json'));
 for(const item of [...Object.values(review.base),...Object.values(review.costumes)])for(const point of Object.values(item.banks))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('app/src/main/assets/'+point.src)).digest('hex'),point.sha256,'body landmarks must match the actual sprite');
 fs.mkdirSync('build/previews',{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']}),p=await browser.newPage({viewport:{width:1920,height:1640}}),errors=[],audit=[];
 p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(process.env.DUNGEON_TEST_URL||'file://'+path.resolve('app/src/main/assets/index.html'));await p.waitForFunction(()=>window.DungeonPremiumArt);await p.evaluate(()=>document.fonts.ready);
  await p.evaluate(()=>{const cv=document.createElement('canvas');cv.id='premium-body-review';cv.width=1920;cv.height=1640;Object.assign(cv.style,{position:'fixed',inset:0,width:'100vw',height:'100vh',zIndex:99999});document.body.append(cv);});
  for(let cls=0;cls<6;cls++){
   const ids=Object.keys(review.costumes).filter(id=>review.costumes[id].cls===cls),base=Object.values(review.base).find(v=>v.cls===cls);
   await p.evaluate(cls=>{DungeonActors.ensure(cls);DungeonActors.warmCombat(cls);},cls);await p.waitForFunction(cls=>DungeonActors.combatReady(cls),cls,{timeout:60000});
   await p.evaluate(()=>{const c=document.getElementById('premium-body-review').getContext('2d');c.fillStyle='#102536';c.fillRect(0,0,1920,1640);});
   for(const[col,id]of ['',...ids].entries()){
    if(id){await p.evaluate(id=>DungeonPremiumArt.prepare([],id),id);await p.waitForFunction(id=>DungeonPremiumArt.readyCostume(id),id,{timeout:60000});}
    const item=id?review.costumes[id]:base;
    const records=await p.evaluate(({cls,col,id,item,base})=>{
     const c=document.getElementById('premium-body-review').getContext('2d'),out=[],names=['reaction','combo0','combo1','combo2','cast'];
     if(id)RiftApp.transaction(s=>{DungeonPremium.purchase(s,id);return DungeonPremium.equip(s,cls,id,'outfit');});
     else RiftApp.transaction(s=>DungeonPremium.equip(s,cls,'','outfit'));
     for(const[row,name]of names.entries())for(const dir of [1,-1]){
      const hero=Rift.player(0,'body review',cls,100,RiftRPG.profile(RiftApp.getSave(),cls));
      Object.assign(hero,{action:name.startsWith('combo')?'basic':name==='cast'?'circle':'idle',comboStage:name.startsWith('combo')?Number(name.slice(5)):0,at:name==='reaction'?0:1e-8,actionDuration:1,impactTime:.25,vx:0,vy:0,jump:0,dashTime:0,landing:0,hurt:0});
      if(hero.costume!==id)throw Error('equipped profile mismatch '+id);
      const f=id?DungeonPremiumArt.frame(hero,0):DungeonActors.frame(hero,0),bank=id?DungeonPremiumArt.DATA.costumes[id].banks[name]:DungeonActors.actors[cls][name],mark=item.banks[name],target=base.banks[name],frame=bank.frames[f.index];
      if(f.bank!==name||f.index!==mark.frame)throw Error('review must render the measured guard pose '+id+'/'+name);
      const x=col*320+160,y=40+row*320+300,draw=c.drawImage.bind(c),calls=[];
      c.drawImage=(...args)=>{const m=c.getTransform();calls.push({m:{a:m.a,d:m.d,e:m.e,f:m.f},args:args.slice(1)});draw(...args);};
      c.save();if(dir===-1)c.globalAlpha=0;DungeonArt.actor(c,cls,x,y,200,dir,hero,0);c.restore();c.drawImage=draw;
      if(calls.length!==1||calls[0].args.length!==8)throw Error('expected a complete body cel '+id+'/'+name);
      const call=calls[0],a=call.args,sourceWidth=id?frame[2]:frame[3],sourceHeight=id?frame[3]:frame[4],scaleX=Math.abs(call.m.a)*a[6]/sourceWidth,scaleY=Math.abs(call.m.d)*a[7]/sourceHeight;if(Math.abs(scaleX-scaleY)>1e-7)throw Error('body aspect ratio changed '+id+'/'+name);const actualEye=call.m.f+call.m.d*(a[5]+mark.eyeY*a[7]/sourceHeight),actualSole=call.m.f+call.m.d*(a[5]+mark.soleY*a[7]/sourceHeight),expectedEye=y-200*DungeonArt.bodyScale(cls)*(target.soleY-target.eyeY)/target.reference;
      out.push({id:id||'base-'+cls,cls,bank:name,dir,actualEye,expectedEye,actualSole,expectedSole:y,error:actualEye-expectedEye});
      if(dir===1){c.font='14px sans-serif';c.fillStyle='#efd7a6';c.fillText((id||'BASE')+' / '+name,col*320+8,40+row*320+18);c.strokeStyle='#74c9c480';c.beginPath();c.moveTo(col*320+5,expectedEye);c.lineTo((col+1)*320-5,expectedEye);c.stroke();c.strokeStyle='#688495';c.beginPath();c.moveTo(col*320+5,y);c.lineTo((col+1)*320-5,y);c.stroke();}
     }
     if(id)RiftApp.transaction(s=>DungeonPremium.equip(s,cls,'','outfit'));
     if(DungeonPremium.appearance(RiftApp.getSave(),cls).costume)throw Error('unequip did not restore the basic appearance');
     return out;
    },{cls,col,id,item,base});
    for(const r of records){assert(Math.abs(r.error)<.75,JSON.stringify(r));assert(Math.abs(r.actualSole-r.expectedSole)<.75,'shared boot sole '+JSON.stringify(r));}audit.push(...records);
   }
   await p.screenshot({path:'build/previews/premium-body-size-'+cls+'.png'});
  }
  assert.equal(audit.filter(r=>!r.id.startsWith('base-')).length,300);assert.deepEqual(errors,[]);fs.writeFileSync('build/previews/premium-body-size-audit.json',JSON.stringify({passed:true,costumes:30,banks:5,directions:2,measurements:audit,errors},null,2));console.log('PASS: all thirty equipped skins versus six basic bodies, five measured idle/attack/cast banks in both directions, actual Canvas eye/sole positions, uniform body scaling and unequip.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

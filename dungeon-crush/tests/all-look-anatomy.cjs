const fs=require('node:fs'),assert=require('node:assert/strict');
module.exports=async page=>{
 const review=JSON.parse(fs.readFileSync('art-source/anatomy2206-review.json'));fs.mkdirSync('build/previews/anatomy',{recursive:true});await page.setViewportSize({width:1800,height:1620});
 await page.evaluate(()=>{document.getElementById('size-review')?.remove();const cv=document.createElement('canvas');cv.id='anatomy-review';cv.width=1800;cv.height=1620;Object.assign(cv.style,{position:'fixed',left:0,top:0,width:'1800px',height:'1620px',zIndex:2147483646});document.body.append(cv);});
 const reports=[];
 for(const[id,look]of Object.entries(review.looks)){
  const costume=id.includes('-')?id:'';await page.evaluate(({cls,costume})=>{DungeonActors.setActiveClasses([cls]);DungeonActors.warmCombat(cls);if(costume)DungeonPremiumArt.prepare([],costume);},{cls:look.cls,costume});
  await page.waitForFunction(({cls,costume})=>DungeonActors.combatReady(cls)&&(!costume||DungeonPremiumArt.readyCostume(costume)),{cls:look.cls,costume},{timeout:90000});
  const result=await page.evaluate(({id,look,costume,serial})=>{
   const cls=look.cls,cv=document.getElementById('anatomy-review'),c=cv.getContext('2d'),banks=costume?DungeonPremiumArt.DATA.costumes[costume].banks:DungeonActors.actors[cls],sequence=[['reaction',0],['walk',0],['run',0],['combo0',0],['combo0',4],['combo1',0],['combo1',4],['combo2',0],['combo2',4],['cast',7],['jump',Math.floor(banks.jump.frames.length/2)],['dash',2]],rows=[];
   c.setTransform(1,0,0,1,0,0);c.fillStyle='#213747';c.fillRect(0,0,1800,1620);
   for(const[n,[name,index]]of sequence.entries()){
    const h=Rift.player(710000+serial*100+n,'',cls,100,{costume}),bank=banks[name];let phase=(index+.01)/bank.frames.length;
    if(['walk','run'].includes(name)){h.action='run';h.vx=Rift.CLASSES[cls].speed*(name==='walk'?.35:1);h.gait=phase*Math.PI*2*DungeonActors.strideLength(h,name)/210;}
    else if(name==='jump')h.jump=.7*(1-phase);
    else if(name==='dash'){phase=((bank.stops[index-1]||0)+bank.stops[index])/2;h.action='dash';h.dashTime=.22*(1-phase);}
    else if(name!=='reaction'){h.action=name==='cast'?'circle':'basic';h.comboStage=name==='cast'?0:+name.slice(5);h.actionDuration=.4;h.impactTime=.1;const q=phase<.5?phase*.5:.25+(phase-.5)*1.5;h.at=.4*(1-q);}
    const f=costume?DungeonPremiumArt.frame(h,0):DungeonActors.frame(h,0);if(f.bank!==name||f.index!==index)throw Error(id+'/'+name+' wrong pose '+f.bank+'/'+f.index);
    const x=n%4*450+225,y=Math.floor(n/4)*540+470,height=260,draw=c.drawImage.bind(c),calls=[];c.drawImage=(...a)=>{calls.push({matrix:c.getTransform().toJSON(),args:a.slice(1),alpha:c.globalAlpha});return draw(...a);};const before=JSON.stringify(h);
    DungeonArt.actor(c,cls,x,y-f.rise*height,height,1,h,0);c.drawImage=draw;if(before!==JSON.stringify(h))throw Error('render changed actor');if(calls.length!==1||calls[0].alpha!==1)throw Error(id+' must show exactly one opaque whole body');
    const r=bank.frames[index],a=calls[0].args,m=calls[0].matrix,sourceH=r[costume?3:4],sourceW=r[costume?2:3],scale=Math.abs(m.d)*a[7]/sourceH;if(Math.abs(scale-Math.abs(m.a)*a[6]/sourceW)>1e-7)throw Error('anatomy stretched');const point=look.banks[name][index],body=point.eye?(point.sole-point.eye[1])*scale:null;
    c.strokeStyle='#9cbdc7';c.lineWidth=1;c.beginPath();c.moveTo(n%4*450+10,y);c.lineTo(n%4*450+440,y);c.stroke();c.fillStyle='#f2deb4';c.font='22px sans-serif';c.fillText(id+' / '+name+' '+index,n%4*450+16,Math.floor(n/4)*540+35);if(body)c.fillText('eye–boot '+body.toFixed(1),n%4*450+16,Math.floor(n/4)*540+65);
    rows.push({bank:name,index,body,headUnit:point.face?point.face.unit*scale:null,calls:calls.length,scaleX:Math.abs(m.a)*a[6]/sourceW,scaleY:scale});
   }
   return{id,cls,rows};
  },{id,look,costume,serial:reports.length});
  const neutral=result.rows[0].body,expected=260*review.commonEyeRatio*look.heightCm/185;assert(Math.abs(neutral-expected)<1,id+' real neutral physical height');for(const row of result.rows.filter(q=>['walk','run'].includes(q.bank)&&q.body)){assert(row.body/neutral<1.13,id+'/'+row.bank+' must not become a giant while moving: '+row.body/neutral);assert(row.body/neutral>.75,id+'/'+row.bank+' must not become a dwarf while moving');}
  for(const row of result.rows.filter(q=>(q.bank.startsWith('combo')&&q.index===0||q.bank==='cast')&&q.body)){assert(row.body/neutral>=.97,id+'/'+row.bank+' upright guard must preserve adult torso/leg proportions: '+row.body/neutral);assert(row.body/neutral<=1.03,id+'/'+row.bank+' guard must not enlarge the model');}for(const row of result.rows.filter(q=>(q.bank.startsWith('combo')&&q.index===0||q.bank==='cast'))){assert(row.headUnit>0,id+'/'+row.bank+' actual head pixels required');const ratio=row.headUnit/result.rows[0].headUnit;assert(ratio>=.85&&ratio<=1.15,id+'/'+row.bank+' canonical head size at fixed physical stature');}reports.push(result);await page.locator('#anatomy-review').screenshot({path:'build/previews/anatomy/'+id+'.png'});
 }
 assert.equal(reports.length,36);await page.locator('#anatomy-review').evaluate(n=>n.remove());fs.writeFileSync('build/previews/anatomy/audit.json',JSON.stringify({passed:true,looks:36,states:432,reports},null,2));console.log('PASS: 36 actual full-color body comparisons through idle, walk, run, attack, cast, jump and dash; source-pixel scale, physical height and no giant/dwarf movement transitions.');
};

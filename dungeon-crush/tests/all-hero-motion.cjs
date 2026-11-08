const assert=require('node:assert/strict');
module.exports=async(p,pixels)=>{
 for(let cls=0;cls<6;cls++){
  await p.evaluate(cls=>{DungeonActors.setActiveClasses([cls]);DungeonActors.warmCombat(cls);},cls);
  await p.waitForFunction(cls=>DungeonActors.combatReady(cls),cls,{timeout:90000});
  const report=await p.evaluate(async cls=>{
   const a=DungeonActors.actors[cls],cv=document.createElement('canvas'),expected=document.createElement('canvas');cv.id='all-hero-review';cv.width=expected.width=2400;cv.height=expected.height=5120;Object.assign(cv.style,{position:'fixed',inset:0,width:'2400px',height:'5120px',zIndex:100001});document.body.append(cv);window.allHeroExpected=expected;
   const c=cv.getContext('2d'),e=expected.getContext('2d');for(const q of [c,e]){q.fillStyle='#193044';q.fillRect(0,0,2400,5120);}
   const images=new Map();for(const b of Object.values(a))if(b?.sources)for(const src of b.sources)if(!images.has(src)){const im=new Image();im.src=src;await im.decode();images.set(src,im);}
   let count=0,clips=0,draws=0;const draw=c.drawImage.bind(c);c.drawImage=(...args)=>{draws++;return draw(...args);};c.clip=()=>{clips++;throw Error('Body is being sliced at the waist');};
   for(const [kind,b]of Object.entries(a)){if(kind==='id')continue;for(let i=0;i<b.frames.length;i++){
    const phase=kind==='dash'?((b.stops?.[i-1]||0)+(b.stops?.[i]||1))/2:(i+.00001)/b.frames.length,h=Rift.player(6000+cls*200+count,'',cls),x=count%8*300+150,y=Math.floor(count/8)*320+290,height=180;let time=0;
    if(kind==='run')Object.assign(h,{action:'run',gait:phase*Math.PI*2*320/210});
    else if(kind==='jump')h.jump=.7*(1-phase);
    else if(kind==='dash')h.dashTime=.22*(1-phase);
    else if(kind==='reaction'){if(i<4)time=i/2;else if(i<6)h.hurt=i===4?.1:.2;else if(i===6)h.landing=.07;else h.hp=0;}
    else{const q=phase<.5?phase*.5:.25+(phase-.5)*1.5;Object.assign(h,{action:kind==='cast'?'circle':'basic',comboStage:kind==='cast'?0:+kind.slice(5),at:.4*(1-q),actionDuration:.4,impactTime:.1});}
    const f=DungeonActors.frame(h,time);if(f.bank!==kind||f.index!==i)throw Error(cls+'/'+kind+'/'+i+' selected '+f.bank+'/'+f.index);
    const landing=f.state==='landing'?Math.sin(h.landing/.14*Math.PI)*3:0;const before=draws;if(!DungeonActors.actor(c,cls,x,y-f.rise*height-landing,height,1,h,time))throw Error('Missing '+cls+'/'+kind+'/'+i);if(draws-before!==1)throw Error('Duplicated/split body '+cls+'/'+kind+'/'+i);
    const r=b.frames[i],limit=kind==='reaction'?520:kind.startsWith('combo')||kind==='cast'?256:320,scale=Math.min(1,limit/r[7]),tile=document.createElement('canvas');tile.width=Math.ceil(r[3]*scale);tile.height=Math.ceil(r[4]*scale);tile.getContext('2d').drawImage(images.get(b.sources[r[0]]),r[1],r[2],r[3],r[4],0,0,tile.width,tile.height);
    e.save();e.translate(x,y);e.rotate(DungeonActors.locomotion(h,null,time).lean);if(f.state==='idle')e.scale(1,1+Math.sin(time*2.4+h.id)*.003);if(h.hp<=0)e.globalAlpha=.62;const k=height/r[7];e.drawImage(tile,0,0,tile.width,tile.height,-r[5]*k,-r[6]*k,r[3]*k,r[4]*k);e.restore();count++;
   }}
   const phases=[];for(let stage=0;stage<3;stage++){const h=Rift.player(8000+stage,'',cls);Object.assign(h,{action:'basic',comboStage:stage,actionDuration:.44,impactTime:.105});let previous=-1;for(let n=0;n<104;n++){h.at=.44*(1-(n+.01)/105);h.poseHold=n%6===0?.045:0;const f=DungeonActors.frame(h,n/240);if(f.phase<previous)throw Error('Hit feedback rewound attack');previous=f.phase;phases.push(f.phase);}}
   return {count,clips,fullBody:a.run.fullBody,status:DungeonActors.status(),phases:phases.length};
  },cls);
  assert.equal(report.count,124);assert.equal(report.clips,0);assert.equal(report.fullBody,true);assert.equal(report.status.poseMisses.attack||0,0);
  const actual=pixels(await p.locator('#all-hero-review').screenshot({path:'build/previews/motion-audit-poses-'+cls+'.png'}));
  await p.evaluate(()=>document.getElementById('all-hero-review').getContext('2d').drawImage(window.allHeroExpected,0,0));
  const expected=pixels(await p.locator('#all-hero-review').screenshot());assert.equal(actual.data.length,expected.data.length);let changed=0;for(let i=0;i<actual.data.length;i++)if(Math.abs(actual.data[i]-expected.data[i])>3)changed++;assert(changed<124*80,'All poses match a complete single cel; '+cls+' differs in '+changed+' channels');
  await p.locator('#all-hero-review').evaluate(n=>n.remove());await p.evaluate(()=>delete window.allHeroExpected);
 }
 console.log('PASS: all 744 hero poses match unsliced full-body source cels, six complete gait cycles, no cold combo misses, and all 18 attack timelines remain monotonic through hit feedback.');
};

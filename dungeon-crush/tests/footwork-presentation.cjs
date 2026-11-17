const assert=require('node:assert/strict'),fs=require('node:fs'),pixels=require('./png-pixels.cjs');
module.exports=async p=>{
 const manifest=JSON.parse(fs.readFileSync('generated-art-sources.json')),review=JSON.parse(fs.readFileSync('locomotion-review.json')),audit=[];
 assert.equal(review.looks.length,36);
 // Measure the source alpha independently: the renderer's contact metadata must match the artwork.
 for(const look of review.looks){const entry=manifest.assets.find(a=>a.file===look.src),im=pixels(fs.readFileSync(entry.originalFile));assert.equal(im.channels,4);for(const f of look.frames){const [x,y,w,h]=f.rect;let sole=-1,left=w,right=0,top=h;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(im.data[((y+yy)*im.width+x+xx)*4+3]>200){sole=yy;left=Math.min(left,xx);right=Math.max(right,xx);top=Math.min(top,yy);}assert.equal(sole,f.sole,look.id+' source sole');assert(Math.min(left,top,w-1-right,h-1-sole)>=2,look.id+' complete opaque body has cell padding');}}
 await p.evaluate(()=>{const cv=document.createElement('canvas');cv.id='footwork-review';cv.width=1600;cv.height=960;Object.assign(cv.style,{position:'fixed',inset:0,width:'1600px',height:'960px',zIndex:200001});document.body.append(cv);});
 for(let cls=0;cls<6;cls++){
  const ids=review.looks.filter(l=>l.cls===cls&&l.kind!=='base').map(l=>l.id);
  await p.evaluate(({cls,ids})=>{DungeonActors.setActiveClasses([cls]);DungeonPremiumArt.prepare([],'',ids);},{cls,ids});
  await p.waitForFunction(({cls,ids})=>DungeonActors.ready(cls)&&ids.every(id=>DungeonPremiumArt.readyCostume(id,false)),{cls,ids},{timeout:90000});
  for(const id of ['',...ids]){
   const result=await p.evaluate(({cls,id})=>{
    const cv=document.getElementById('footwork-review'),c=cv.getContext('2d'),bank=id?DungeonPremiumArt.DATA.costumes[id].banks.run:DungeonActors.actors[cls].run,samples=[];
    c.clearRect(0,0,cv.width,cv.height);let images=0,decorations=0;const image=c.drawImage.bind(c),fill=c.fill.bind(c),stroke=c.stroke.bind(c);
    c.drawImage=(...a)=>{if(c.globalAlpha<.999)throw Error('Translucent body '+id);images++;return image(...a);};c.fill=(...a)=>{decorations++;return fill(...a);};c.stroke=(...a)=>{decorations++;return stroke(...a);};
    try{for(let row=0;row<4;row++)for(let pose=0;pose<8;pose++){
     const dir=row%2?-1:1,walking=row<2,hero=Rift.player(95000+cls*100+row*8+pose,'',cls,100,{costume:id}),phase=(pose+.1)/8;
     Object.assign(hero,{action:'run',dir,vx:dir*Rift.CLASSES[cls].speed*(walking?.35:1),gait:phase*Math.PI*2*DungeonActors.strideLength(hero)/210});
     const before=JSON.stringify(hero),f=id?DungeonPremiumArt.frame(hero,1):DungeonActors.frame(hero,1),r=bank.frames[f.index],sole=bank.soles[f.index],pivot=walking?sole:r[id?5:6],height=130*DungeonArt.bodyScale(cls),reference=r[id?6:7];
     if(f.gaitKind!==(walking?'walk':'run'))throw Error('Wrong gait '+id);c.save();c.beginPath();c.rect(pose*200,row*240,200,240);c.clip();const n=images;
     DungeonEffects.actorTrail(c,hero,pose*200+100,row*240+220,130,dir,1);DungeonPremiumFX.trail(c,hero,pose*200+100,row*240+220,130,1);
     if(!DungeonArt.actor(c,cls,pose*200+100,row*240+220,130,dir,hero,1)||images-n!==1)throw Error('Missing or repeated body '+id);
     if(JSON.stringify(hero)!==before)throw Error('Rendering mutated movement '+id);
     c.globalCompositeOperation='source-in';c.fillStyle='#ffffff';c.fillRect(pose*200,row*240,200,240);c.restore();
     samples.push({row,pose,index:f.index,walking,offset:(sole-pivot)*height/reference});
    }}finally{c.drawImage=image;c.fill=fill;c.stroke=stroke;}
    c.save();c.globalCompositeOperation='destination-over';c.fillStyle='#000000';c.fillRect(0,0,cv.width,cv.height);c.restore();return {id:id||'base-'+cls,images,decorations,samples};
   },{cls,id});
   assert.equal(result.images,32);assert.equal(result.decorations,0,'normal feet remain unobstructed by movement FX');
   const im=pixels(await p.locator('#footwork-review').screenshot({path:'build/previews/footwork-'+result.id+'.png'}));
   for(const s of result.samples){let lowest=-1;for(let y=0;y<240;y++)for(let x=0;x<200;x++){const at=((s.row*240+y)*im.width+s.pose*200+x)*im.channels;if(im.data[at]>190&&im.data[at+1]>190&&im.data[at+2]>190)lowest=y;}
    assert(lowest>130,result.id+' complete visible body');assert(Math.abs(lowest-(220+s.offset))<4,result.id+'/'+s.row+'/'+s.pose+' actual sole '+lowest+' expected '+(220+s.offset));if(s.walking)assert(Math.abs(lowest-220)<4,'walking foot stays on the floor');
   }
   const runs=result.samples.filter(s=>s.row===2),walks=result.samples.filter(s=>s.row===0);assert.equal(new Set(runs.map(s=>s.index)).size,8);assert(new Set(walks.map(s=>s.index)).size>=6);assert.equal(walks[0].index,0);assert.equal(walks[4].index,4);audit.push(result);
  }
 }
 assert(audit.flatMap(a=>a.samples).filter(s=>!s.walking&&s.offset<-4).length>=10,'visible authored airborne poses are preserved across the collection');await p.locator('#footwork-review').evaluate(n=>n.remove());fs.writeFileSync('build/previews/footwork-audit.json',JSON.stringify({looks:36,samples:1152,passed:true,audit},null,2));console.log('PASS: 36 looks / 1,152 actual slow/full-speed body renders, both directions; source-alpha contact measurements, planted walking soles, preserved running flight, exactly one opaque body and no normal movement FX.');
};

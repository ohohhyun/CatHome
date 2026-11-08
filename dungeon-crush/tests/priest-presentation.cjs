const assert=require('node:assert/strict');
module.exports=async function priestPresentation(p){
 await p.evaluate(()=>{DungeonActors.setActiveClasses([5]);DungeonArt.ensure(5);});
 await p.waitForFunction(()=>DungeonArt.ready(5));
 const run=await p.evaluate(async()=>{
  const bank=DungeonActors.actors[5].run,im=new Image();im.src=bank.sources[0];await im.decode();
  const make=()=>{const cv=document.createElement('canvas');cv.width=480;cv.height=400;return cv;};
  const cv=make(),expected=make(),c=cv.getContext('2d'),e=expected.getContext('2d'),h=Rift.player(915,'프리스트',5),checks=[];
  const review=document.createElement('canvas');review.id='priest-review';review.width=1920;review.height=800;Object.assign(review.style,{position:'fixed',inset:0,width:'100vw',height:'100vh',zIndex:99999});document.body.append(review);const sheet=review.getContext('2d');sheet.fillStyle='#142638';sheet.fillRect(0,0,1920,800);
  for(const dir of [1,-1])for(let i=0;i<8;i++){
   c.clearRect(0,0,480,400);e.clearRect(0,0,480,400);Object.assign(h,{action:'run',gait:(i+.05)/8*Math.PI*2*320/210,vx:0,vy:0});
   if(!DungeonActors.actor(c,5,240,340,293,dir,h,0))throw Error('Priest run not loaded');
   const f=DungeonActors.frame(h,0),r=bank.frames[f.index];e.save();e.translate(240,340);e.scale(dir,1);e.drawImage(im,r[1],r[2],r[3],r[4],-r[5],-r[6],r[3],r[4]);e.restore();
   const actual=c.getImageData(0,0,480,400).data,full=e.getImageData(0,0,480,400).data;let changed=0;for(let k=0;k<actual.length;k++)if(actual[k]!==full[k])changed++;
   checks.push({dir,frame:i,changed});if(dir===1)sheet.drawImage(cv,i%4*480,Math.floor(i/4)*400);
  }
  return checks;
 });
 // Fractional pivots can differ at the cached tile's antialiased outermost edge (<0.03% of channels).
 assert(run.every(v=>v.changed<=200),'all 8 priest run frames in both directions retain every pixel of the full body: '+JSON.stringify(run));
 await p.locator('#priest-review').screenshot({path:'build/previews/priest-run-full-body.png'});
 const alpha=await p.evaluate(async()=>{
  const names=['elian-skills','elian-growth-skills','elian-ultimate'],out=[],cv=document.getElementById('priest-review'),c=cv.getContext('2d');cv.width=1536;cv.height=1536;c.fillStyle='#142638';c.fillRect(0,0,cv.width,cv.height);
  for(let i=0;i<names.length;i++){
   const im=new Image();im.src='art/motion210/'+names[i]+'.webp';await im.decode();const probe=document.createElement('canvas');probe.width=im.width;probe.height=im.height;const pc=probe.getContext('2d');pc.drawImage(im,0,0);const d=pc.getImageData(0,0,im.width,im.height).data;let clear=0,solid=0;for(let j=3;j<d.length;j+=4){if(d[j]<8)clear++;if(d[j]>128)solid++;}
   const corners=[3,(im.width-1)*4+3,(im.height-1)*im.width*4+3,d.length-1].map(j=>d[j]);out.push({name:names[i],clear:clear/(im.width*im.height),solid,corners});
   c.save();c.globalCompositeOperation='screen';c.drawImage(im,0,i*512,1536,512);c.restore();
  }
  return out;
 });
 for(const a of alpha){assert(a.clear>.35,a.name+' needs substantial true transparency');assert(a.solid>10000,a.name+' retains visible spell details');assert(a.corners.every(v=>v<=2),a.name+' has no rectangular white backdrop');}
 await p.locator('#priest-review').screenshot({path:'build/previews/priest-transparent-skills.png'});
 await p.locator('#priest-review').evaluate(n=>n.remove());
 console.log('PASS: priest 8 full-body run frames in both directions match uncropped source pixels; base/growth/ultimate spell alpha decoded and rendered over dark background.');
};

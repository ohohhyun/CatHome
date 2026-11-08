const assert=require('node:assert/strict'),fs=require('node:fs');
module.exports=async function priestPresentation(p,pixels){
 await p.evaluate(()=>{DungeonActors.setActiveClasses([5]);DungeonArt.ensure(5);});
 await p.waitForFunction(()=>DungeonArt.ready(5));
 await p.evaluate(async()=>{
  const bank=DungeonActors.actors[5].run,im=new Image();im.src=bank.sources[0];await im.decode();
  const make=()=>{const cv=document.createElement('canvas');cv.width=1920;cv.height=1600;const c=cv.getContext('2d');c.fillStyle='#142638';c.fillRect(0,0,cv.width,cv.height);return cv;};
  const cv=make(),expected=make(),c=cv.getContext('2d'),e=expected.getContext('2d'),h=Rift.player(915,'프리스트',5);
  cv.id='priest-review';Object.assign(cv.style,{position:'fixed',inset:0,width:'1920px',height:'1600px',zIndex:99999});document.body.append(cv);window.priestExpected=expected;
  for(const dir of [1,-1])for(let i=0;i<8;i++){
   const x=i%4*480+240,y=(Math.floor(i/4)+(dir===-1?2:0))*400+340;
   Object.assign(h,{action:'run',gait:(i+.05)/8*Math.PI*2*320/210,vx:0,vy:0});
   if(!DungeonActors.actor(c,5,x,y,293,dir,h,0))throw Error('Priest run not loaded');
   const f=DungeonActors.frame(h,0),r=bank.frames[f.index];e.save();e.translate(x,y);e.scale(dir,1);e.drawImage(im,r[1],r[2],r[3],r[4],-r[5],-r[6],r[3],r[4]);e.restore();
  }
 });
 // Browser screenshots work for both HTTP and CI file URLs; file-image canvases cannot use getImageData.
 const actual=pixels(await p.locator('#priest-review').screenshot({path:'build/previews/priest-run-full-body.png'}));
 await p.evaluate(()=>document.getElementById('priest-review').getContext('2d').drawImage(window.priestExpected,0,0));
 const expected=pixels(await p.locator('#priest-review').screenshot());
 assert.equal(actual.w,1920);assert.equal(actual.h,1600);assert.equal(actual.channels,expected.channels);
 const run=[];for(let frame=0;frame<16;frame++){let changed=0;for(let y=0;y<400;y++)for(let x=0;x<480;x++)for(let ch=0;ch<3;ch++){const at=(((frame>>2)*400+y)*actual.w+(frame%4)*480+x)*actual.channels+ch;if(Math.abs(actual.data[at]-expected.data[at])>3)changed++;}run.push({dir:frame<8?1:-1,frame:frame%8,changed});}
 // Fractional pivots can differ at the cached tile's antialiased outermost edge (<0.04% of RGB channels).
 assert(run.every(v=>v.changed<=200),'all 8 priest run frames in both directions retain the full body: '+JSON.stringify(run));
 const names=['elian-skills','elian-growth-skills','elian-ultimate'],sources=names.map(name=>({name,src:'data:image/webp;base64,'+fs.readFileSync('app/src/main/assets/art/motion210/'+name+'.webp').toString('base64')}));
 const alpha=await p.evaluate(async sources=>{
  const out=[],cv=document.getElementById('priest-review'),c=cv.getContext('2d');cv.width=1536;cv.height=1536;cv.style.width='100vw';cv.style.height='100vh';c.fillStyle='#142638';c.fillRect(0,0,cv.width,cv.height);
  for(let i=0;i<sources.length;i++){
   const im=new Image();im.src=sources[i].src;await im.decode();const probe=document.createElement('canvas');probe.width=im.width;probe.height=im.height;const pc=probe.getContext('2d');pc.drawImage(im,0,0);const d=pc.getImageData(0,0,im.width,im.height).data;let clear=0,solid=0;for(let j=3;j<d.length;j+=4){if(d[j]<8)clear++;if(d[j]>128)solid++;}
   const corners=[3,(im.width-1)*4+3,(im.height-1)*im.width*4+3,d.length-1].map(j=>d[j]);out.push({name:sources[i].name,clear:clear/(im.width*im.height),solid,corners});
   c.save();c.globalCompositeOperation='screen';c.drawImage(im,0,i*512,1536,512);c.restore();
  }
  return out;
 },sources);
 for(const a of alpha){assert(a.clear>.35,a.name+' needs substantial true transparency');assert(a.solid>10000,a.name+' retains visible spell details');assert(a.corners.every(v=>v<=2),a.name+' has no rectangular white backdrop');}
 await p.locator('#priest-review').screenshot({path:'build/previews/priest-transparent-skills.png'});
 await p.locator('#priest-review').evaluate(n=>n.remove());await p.evaluate(()=>delete window.priestExpected);
 console.log('PASS: priest 8 full-body run frames in both directions match uncropped source pixels; base/growth/ultimate spell alpha decoded and rendered over dark background.');
};

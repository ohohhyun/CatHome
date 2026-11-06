/* Shared scrolling ground and the existing licensed gate artwork. */
(function(root){'use strict';
const WIDTH=1600,HEIGHT=800,grounds=new WeakMap(),frames=new Map();
// Scenery extends beyond the walkable bounds so the hero stays central at both ends.
function cameraAt(x,world){return Math.max(60,Math.min(world-60,x))-WIDTH/2;}
function follow(current,x,world,dt){const target=cameraAt(x,world);return current+(target-current)*(1-Math.exp(-Math.min(.1,dt)*20));}
function ground(image){if(grounds.has(image))return grounds.get(image);const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=330;const c=canvas.getContext('2d');c.drawImage(image,0,image.height*.70,image.width,image.height*.295,0,0,1600,330);c.globalCompositeOperation='destination-in';const g=c.createLinearGradient(0,0,0,60);g.addColorStop(0,'#ffffff00');g.addColorStop(1,'#ffffffff');c.fillStyle=g;c.fillRect(0,0,1600,330);grounds.set(image,canvas);return canvas;}
function tiles(c,image,offset,y,height){const first=Math.floor(offset/1600);for(let i=first;i<=first+1;i++){const x=i*1600-offset;c.save();if(i%2){c.translate(x+1600,y);c.scale(-1,1);c.drawImage(image,0,0,1600,height);}else c.drawImage(image,x,y,1600,height);c.restore();}}
function background(c,image,camera,time){c.fillStyle='#121d2d';c.fillRect(0,0,WIDTH,HEIGHT);if(image){tiles(c,image,camera*.28,0,680);tiles(c,ground(image),camera,470,330);}const shade=c.createLinearGradient(0,0,0,800);shade.addColorStop(0,'#07101a44');shade.addColorStop(.55,'#07101a00');shade.addColorStop(1,'#07101a55');c.fillStyle=shade;c.fillRect(0,0,WIDTH,HEIGHT);for(let i=0;i<18;i++){const x=((i*149-camera*.7+Math.sin(time*.3+i)*13)%1600+1600)%1600,y=800-(time*13+i*83)%800;c.fillStyle=i%3?'#dba55d44':'#c5edff77';c.fillRect(x,y,1+i%2,1+i%2);}}
// Cached bevelled frame; only the energy, runes and particles animate per frame.
function oval(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
function gateFrame(){
 if(frames.has('arch'))return frames.get('arch');
 const canvas=document.createElement('canvas');canvas.width=384;canvas.height=512;const c=canvas.getContext('2d');c.translate(192,476);
 c.shadowColor='#020610';c.shadowBlur=18;c.shadowOffsetY=8;oval(c,0,-169,108,163);c.strokeStyle='#111b27';c.lineWidth=32;c.stroke();c.shadowBlur=0;c.shadowOffsetY=0;
 // Faceted stone/metal voussoirs give the rim a lit face, seams and a dark return.
 const count=22,point=(a,rx,ry)=>[Math.cos(a)*rx,-169+Math.sin(a)*ry];
 for(let i=0;i<count;i++){
  const a=i/count*Math.PI*2+.014,b=(i+1)/count*Math.PI*2-.014;
  c.beginPath();c.moveTo(...point(a,122,177));c.ellipse(0,-169,122,177,0,a,b);c.lineTo(...point(b,94,149));c.ellipse(0,-169,94,149,0,b,a,true);c.closePath();
  const g=c.createLinearGradient(-120,-335,105,-5);g.addColorStop(0,i%3?'#a29c89':'#beb49b');g.addColorStop(.42,'#536471');g.addColorStop(.7,i%3?'#354452':'#63717b');g.addColorStop(1,'#182937');c.fillStyle=g;c.fill();c.strokeStyle='#111e2b';c.lineWidth=1.5;c.stroke();
  const m=(a+b)/2;c.save();c.translate(...point(m,108,163));c.rotate(m+Math.PI/2);c.strokeStyle=i%2?'#c0ba9a99':'#8fb5c8aa';c.lineWidth=1;c.beginPath();c.moveTo(-3,-5);c.lineTo(3,-5);c.lineTo(-2,4);c.lineTo(3,4);c.moveTo(0,-7);c.lineTo(0,6);c.stroke();c.restore();
 }
 for(const [rx,ry,color,width]of [[123,178,'#131c27',3],[119,174,'#b6a779',1.5],[97,152,'#171d29',5],[93,148,'#83bfce',2]]){oval(c,0,-169,rx,ry);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 // Heavy feet and a raised threshold anchor the gate to the floor.
 for(const side of [-1,1]){const x=side*99;c.fillStyle='#17232e';c.fillRect(x-22,-33,44,39);const g=c.createLinearGradient(x-22,0,x+22,0);g.addColorStop(0,'#344653');g.addColorStop(.4,'#a49c7b');g.addColorStop(.52,'#5c6b70');g.addColorStop(1,'#1a2b3a');c.fillStyle=g;c.fillRect(x-18,-35,36,32);c.fillStyle='#bba77e';c.fillRect(x-22,-35,44,3);c.fillStyle='#09141e';c.fillRect(x-23,0,46,6);}
 c.beginPath();c.moveTo(-131,6);c.lineTo(119,6);c.lineTo(146,20);c.lineTo(-146,20);c.closePath();const sill=c.createLinearGradient(0,0,0,23);sill.addColorStop(0,'#788184');sill.addColorStop(.45,'#364757');sill.addColorStop(1,'#162536');c.fillStyle=sill;c.fill();c.strokeStyle='#b1a381';c.lineWidth=1;c.stroke();
 c.save();c.translate(0,-348);c.rotate(Math.PI/4);c.fillStyle='#172734';c.fillRect(-15,-15,30,30);c.strokeStyle='#b0a080';c.lineWidth=2;c.strokeRect(-14,-14,28,28);c.fillStyle='#80cadc';c.fillRect(-4,-4,8,8);c.restore();
 frames.set('arch',canvas);return canvas;
}
function portal(c,x,y,time,ready=true,scale=1){
 if(x<-240||x>1840)return;c.save();c.translate(x,y);c.scale(scale,scale);
 const intensity=ready?1:.65,TAU=Math.PI*2;
 oval(c,0,18,148,27);c.fillStyle='#030a1699';c.fill();
 // Soft light on the ground is separate from the stone frame.
 c.save();c.scale(1,.24);const pool=c.createRadialGradient(0,0,10,0,0,170);pool.addColorStop(0,'#79cdea44');pool.addColorStop(.55,'#388cbf27');pool.addColorStop(1,'#12304900');c.fillStyle=pool;c.fillRect(-180,-180,360,360);c.restore();
 const glow=c.createRadialGradient(0,-170,70,0,-170,230);glow.addColorStop(0,'#378cbd40');glow.addColorStop(1,'#10213600');c.fillStyle=glow;c.fillRect(-240,-400,480,430);
 c.save();oval(c,0,-169,94,149);c.clip();
 const depth=c.createRadialGradient(13,-188,2,0,-169,150);depth.addColorStop(0,'#020815');depth.addColorStop(.22,'#08142e');depth.addColorStop(.54,'#163d62');depth.addColorStop(.82,'#2b8aaa');depth.addColorStop(1,'#91d7db');c.fillStyle=depth;c.fillRect(-110,-330,220,330);
 c.globalCompositeOperation='lighter';
 // Curved filaments flow into the dark centre instead of flat nested circles.
 for(let arm=0;arm<7;arm++){
  c.beginPath();for(let i=0;i<=80;i++){const t=i/80,r=7+t*145,a=arm*TAU/7+time*.35-t*4.7,xx=13+Math.cos(a)*r*.65,yy=-188+Math.sin(a)*r;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}
  c.strokeStyle=arm%2?'#82ddec':'#4c8cf5';c.globalAlpha=(arm%2?.2:.12)*intensity;c.lineWidth=arm%3?5:11;c.stroke();c.globalAlpha=.35*intensity;c.lineWidth=.7;c.stroke();
 }
 for(let i=0;i<52;i++){
  const t=(i/52+time*.055)%1,r=14+(1-t)*136,a=i*2.399+time*.24+t*4.7;
  c.globalAlpha=Math.sin(t*Math.PI)*(.2+i%4*.13)*intensity;c.fillStyle=i%4?'#a9eaf4':'#faf3d9';const px=13+Math.cos(a)*r*.65,py=-188+Math.sin(a)*r;c.fillRect(px,py,i%7===0?2:1,i%7===0?2:1);
 }
 c.globalAlpha=.5*intensity;c.strokeStyle='#b0f1f3';c.lineWidth=2;oval(c,0,-169,92,147);c.stroke();c.restore();
 c.drawImage(gateFrame(),-192,-476);
 // Broken arcs and travelling glints light the bevel without washing it white.
 c.save();c.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const a=time*.22+i*TAU/4;c.globalAlpha=.45*intensity;c.strokeStyle=i%2?'#68b8eb':'#b5eadb';c.lineWidth=1.8;c.beginPath();c.ellipse(0,-169,96,151,0,a,a+.35);c.stroke();}
 for(let i=0;i<12;i++){const a=i*2.399+time*.3,r=112+Math.sin(i+time)*8;c.globalAlpha=(.2+.3*Math.sin(time+i)**2)*intensity;c.fillStyle='#c6e7f1';c.beginPath();c.arc(Math.cos(a)*r,-169+Math.sin(a)*172,1+i%2*.4,0,TAU);c.fill();}c.restore();c.restore();
}
root.DungeonWorld={cameraAt,follow,background,portal,layers:camera=>({ground:-camera,distant:-camera*.28}),gateReady:()=>true};
})(window);

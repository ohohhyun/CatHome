/* Enemy-only visual language. The warning boundary uses the same geometry as damage. */
(function(root){'use strict';
const TAU=Math.PI*2,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const profiles=[
 ['sentinel','수호 참격','#f29b73','#ffe3b5','crescent'],['forge','용광로 강타','#fa944e','#ffe2a4','hammer'],
 ['roots','가시 뿌리','#9fd184','#e3ffc4','vines'],['crystal','수정 파열','#8edfeb','#e8ffff','prism'],
 ['tide','심해 물결','#67bada','#c5fbff','surge'],['storm','폭풍 낙뢰','#b6a2ff','#f7eeff','lightning'],
 ['chrono','시간 낙인','#e3bf73','#fff1bc','dial'],['eclipse','월식 파동','#b487eb','#f1d1ff','eclipse'],
 ['frost','빙하 파쇄','#97e4ff','#efffff','snow'],['lava','용암 분출','#ff8b52','#ffe5a0','eruption'],
 ['astral','성운 유성','#9abaff','#ffeac1','meteor'],['void','공허 균열','#b08cf7','#dabfff','tentacle'],
 ['current','수로 압력','#5bd7d6','#cbffff','current'],['plague','독늪 포자','#a7cc64','#e3ffae','spores'],
 ['clockwork','혈철 태엽','#e89a78','#ffe0a8','gears'],['dawn','여명 심판','#f1d795','#fff6cc','sun']
].map(([id,name,color,accent,shape])=>({id,name,color,accent,shape}));
const byId=Object.fromEntries(profiles.map(p=>[p.id,p])),aliases={guardian:'sentinel',strike:'sentinel',slam:'forge',pounce:'roots',venom:'plague',tidebolt:'tide',runebolt:'chrono',turbine:'current',leviathan:'current',resonance:'current',brood:'plague',mire:'plague',pendulum:'clockwork',gearstorm:'clockwork',bloodmoon:'clockwork',judgement:'dawn',mirror:'dawn',corona:'dawn'};
let warningDraws=0,impactDraws=0,projectileDraws=0;const stylesSeen=new Set();
function profile(value){const id=typeof value==='string'?value:value?.vfx||value?.element;return byId[id]||byId[aliases[id]]||profiles[Number.isInteger(value?.region)?clamp(value.region,0,15):0];}
function lane(){return root.Rift?.LANE||2.6;}
function low(){return !!root.DungeonSound?.isReducedEffects?.();}
function contains(t,p){const L=lane();if(t.shape==='beam'){const ax=t.ax,ay=t.ay*L,bx=t.bx,by=t.by*L,dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy,k=len?clamp(((p.x-ax)*dx+(p.y*L-ay)*dy)/len,0,1):0;return Math.hypot(p.x-ax-dx*k,p.y*L-ay-dy*k)<t.r;}const d=Math.hypot(p.x-t.x,(p.y-t.y)*L);return d<t.r&&d>=(t.inner||0);}
function polygon(c,r,n,rotation=0,inner=1){c.beginPath();for(let i=0;i<n;i++){const angle=rotation+i*TAU/n,rr=r*(i%2?inner:1),x=Math.cos(angle)*rr,y=Math.sin(angle)*rr;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();}
function gear(c,r,time){polygon(c,r,24,time,.78);c.stroke();c.beginPath();c.arc(0,0,r*.5,0,TAU);c.stroke();for(let i=0;i<4;i++){const a=i*Math.PI/2+time;c.beginPath();c.moveTo(Math.cos(a)*r*.2,Math.sin(a)*r*.2);c.lineTo(Math.cos(a)*r*.7,Math.sin(a)*r*.7);c.stroke();}}
function star(c,x,y,r,color,rotation=0){c.save();c.translate(x,y);c.fillStyle=color;polygon(c,r,10,rotation,.35);c.fill();c.restore();}
function capsule(c,t,camera){const L=lane(),dx=t.bx-t.ax,dy=(t.by-t.ay)*L,len=Math.hypot(dx,dy);c.save();c.scale(1,1/L);c.translate(t.ax-camera,t.ay*L);c.rotate(Math.atan2(dy,dx));c.beginPath();c.moveTo(0,-t.r);c.lineTo(len,-t.r);c.arc(len,0,t.r,-Math.PI/2,Math.PI/2);c.lineTo(0,t.r);c.arc(0,0,t.r,Math.PI/2,Math.PI*1.5);c.closePath();c.restore();}
function footprint(c,t,camera){if(t.shape==='beam'){capsule(c,t,camera);return;}c.beginPath();c.ellipse(t.x-camera,t.y,t.r,t.r/lane(),0,0,TAU);if(t.inner)c.ellipse(t.x-camera,t.y,t.inner,t.inner/lane(),0,0,TAU,true);}
// All texture noise is deterministic and isolated from the combat random stream.
const textures=new Map(),DETAIL_LIMIT=96;let frameStamp=-1,detailUsed=0,peakDetail=0,windupDraws=0;
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const ease=v=>1-(1-clamp(v,0,1))**3;
function beginFrame(stamp){if(stamp!==frameStamp){frameStamp=stamp;detailUsed=0;}}
function budget(cost=1){const limit=low()?24:DETAIL_LIMIT;if(detailUsed+cost>limit)return false;detailUsed+=cost;peakDetail=Math.max(peakDetail,detailUsed);return true;}
function texture(p,kind){
 const key=p.id+':'+kind;if(textures.has(key))return textures.get(key);
 const cv=document.createElement('canvas');cv.width=kind==='trail'?256:192;cv.height=kind==='trail'?96:192;
 const c=cv.getContext('2d'),cx=cv.width/2,cy=cv.height/2,seed=profiles.indexOf(p)*43;
 if(kind==='trail'){
  for(let i=0;i<8;i++){const k=noise(seed+i),y=cy+(k-.5)*32,g=c.createLinearGradient(5,0,248,0);g.addColorStop(0,p.color+'00');g.addColorStop(.7,p.color+'55');g.addColorStop(1,p.accent+'dd');c.fillStyle=g;c.beginPath();c.moveTo(8,y);c.bezierCurveTo(70,y-10,148,cy-18-k*10,245,cy);c.bezierCurveTo(165,cy+12+k*15,85,y+10,8,y);c.fill();}
 }else if(kind==='haze'){
  for(let i=0;i<14;i++){const a=i*2.399,r=22+noise(seed+i)*37,x=cx+Math.cos(a)*r*.7,y=cy+Math.sin(a)*r*.55,sz=26+noise(seed+i+22)*24,g=c.createRadialGradient(x,y,0,x,y,sz);g.addColorStop(0,p.color+'25');g.addColorStop(.4,p.color+'15');g.addColorStop(1,p.color+'00');c.fillStyle=g;c.fillRect(x-sz,y-sz,sz*2,sz*2);}
 }else{
  const g=c.createRadialGradient(cx,cy,0,cx,cy,94);g.addColorStop(0,p.accent+'ee');g.addColorStop(.08,p.accent+'bb');g.addColorStop(.23,p.color+'66');g.addColorStop(.52,p.color+'22');g.addColorStop(1,p.color+'00');c.fillStyle=g;c.fillRect(0,0,192,192);
  c.translate(cx,cy);for(let i=0;i<12;i++){const a=i*TAU/12,reach=35+noise(seed+i)*50;c.save();c.rotate(a);const line=c.createLinearGradient(0,0,reach,0);line.addColorStop(0,p.accent+'88');line.addColorStop(1,p.color+'00');c.fillStyle=line;c.beginPath();c.moveTo(0,-2);c.lineTo(reach,0);c.lineTo(0,2);c.fill();c.restore();}
 }
 if(textures.size>=48)textures.delete(textures.keys().next().value);textures.set(key,cv);return cv;
}
function sprite(c,p,kind,x,y,w,h,alpha=1,angle=0){if(low()||!budget())return;c.save();c.translate(x,y);c.rotate(angle);c.globalAlpha*=alpha;c.globalCompositeOperation='screen';c.drawImage(texture(p,kind),-w/2,-h/2,w,h);c.restore();}
function line(c,points,color,width){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function facet(c,x,y,h,w,p,angle=0){
 c.save();c.translate(x,y);c.rotate(angle);c.lineJoin='round';c.beginPath();c.moveTo(0,-h);c.lineTo(w,-h*.26);c.lineTo(w*.55,4);c.lineTo(-w*.8,3);c.lineTo(-w,-h*.2);c.closePath();c.fillStyle=p.color;c.fill();c.strokeStyle='#071725aa';c.lineWidth=2;c.stroke();
 c.beginPath();c.moveTo(0,-h);c.lineTo(w,-h*.26);c.lineTo(w*.55,4);c.lineTo(w*.1,-h*.2);c.closePath();c.fillStyle=p.color+'88';c.fill();c.beginPath();c.moveTo(0,-h);c.lineTo(w*.1,-h*.2);c.lineTo(-w*.8,3);c.closePath();c.fillStyle=p.accent+'bb';c.fill();line(c,[[0,-h],[-w*.28,-h*.22],[-w*.8,3]],p.accent,1.8);c.restore();
}
function thorn(c,x,y,h,p,angle=0,voided=false){
 c.save();c.translate(x,y);c.rotate(angle);const sway=Math.sin(angle*4)*h*.2,g=c.createLinearGradient(-20,0,20,-h);g.addColorStop(0,voided?'#1a1036':'#173126');g.addColorStop(.5,p.color);g.addColorStop(1,p.accent);c.fillStyle=g;c.beginPath();c.moveTo(-13,5);c.bezierCurveTo(-27,-h*.35,35+sway,-h*.6,sway,-h);c.bezierCurveTo(12+sway,-h*.52,8,-h*.2,15,5);c.closePath();c.fill();line(c,[[3,0],[0,-h*.3],[15+sway,-h*.65],[sway,-h]],p.accent+'a0',1.4);
 for(let j=1;j<=3;j++){const yy=-h*j/4,xx=Math.sin(j)*8;c.fillStyle=j%2?p.color:p.accent;c.beginPath();c.moveTo(xx,yy+5);c.lineTo(xx+(j%2?-18:21),yy-11);c.lineTo(xx+6,yy-7);c.closePath();c.fill();}c.restore();
}
function flame(c,x,y,h,w,p,phase){
 c.save();c.translate(x,y);const g=c.createLinearGradient(0,-h,0,8);g.addColorStop(0,p.color+'00');g.addColorStop(.26,p.color+'b0');g.addColorStop(.7,p.color);g.addColorStop(1,p.accent);c.fillStyle=g;c.beginPath();c.moveTo(-w,3);c.bezierCurveTo(-w*1.3,-h*.4,w*.5,-h*.4,-w*.1,-h);c.bezierCurveTo(w*1.7,-h*.72,w*.7,-h*.48,w,3);c.closePath();c.fill();c.fillStyle=p.accent+'d0';c.beginPath();c.moveTo(-w*.35,2);c.quadraticCurveTo(-w*.45,-h*.26,w*.25,-h*.52);c.quadraticCurveTo(w*.7,-h*.18,w*.35,2);c.fill();c.restore();
}
function wave(c,x,y,r,h,p,phase){
 c.save();c.translate(x,y);const g=c.createLinearGradient(0,-h,0,15);g.addColorStop(0,p.accent+'c0');g.addColorStop(.3,p.color+'bb');g.addColorStop(1,p.color+'08');c.fillStyle=g;c.beginPath();c.moveTo(-r,7);c.bezierCurveTo(-r*.6,-h*1.05,r*.1,-h,r*.58,-h*.3);c.bezierCurveTo(r*.35,-h*.95,r*.8,-h*.9,r,1);c.lineTo(r,16);c.lineTo(-r,16);c.closePath();c.fill();c.strokeStyle=p.accent;c.lineWidth=2;c.beginPath();c.moveTo(-r,7);c.bezierCurveTo(-r*.6,-h*1.05,r*.1,-h,r*.58,-h*.3);c.stroke();if(!low()&&budget())for(let i=0;i<7;i++){const t=i/6,xx=-r+r*2*t,yy=-Math.sin(t*Math.PI)*h*.7;c.fillStyle=p.accent+'b0';c.beginPath();c.ellipse(xx,yy,2+i%3,1.3,0,0,TAU);c.fill();}c.restore();
}
function bolt(c,x,y,h,p,seed,width=7){
 const points=[[x+14,y-h]];for(let j=1;j<=7;j++)points.push([x+(noise(seed+j)-.5)*34,y-h+j*h/7]);line(c,points,p.color+'70',width*2.6);line(c,points,p.color,width);line(c,points,p.accent,Math.max(1.2,width*.3));if(!low()&&budget())for(let j=2;j<6;j+=2){const [xx,yy]=points[j];line(c,[[xx,yy],[xx-22,yy+8],[xx-32,yy+32]],p.color,2);}
}
function debris(c,x,y,size,p,angle,hot=false){c.save();c.translate(x,y);c.rotate(angle);polygon(c,size,5,.2,.7);c.fillStyle=hot?'#3c2b2a':'#384047';c.fill();c.strokeStyle=hot?p.color:p.accent+'80';c.lineWidth=1.6;c.stroke();line(c,[[-size*.5,0],[0,-size*.4],[size*.4,0]],p.color,1);c.restore();}
function dial(c,r,p,angle,mechanical=false){
 c.save();c.scale(1,1/lane());c.rotate(angle);c.strokeStyle=p.color;c.lineWidth=3;if(mechanical){gear(c,r,0);c.strokeStyle=p.accent;c.lineWidth=1;gear(c,r*.81,.12);}else if(p.shape==='sun'){for(const rr of [r,r*.73]){c.beginPath();c.arc(0,0,rr,0,TAU);c.stroke();}for(let i=0;i<12;i++){const a=i*TAU/12;line(c,[[Math.cos(a-.08)*r*.8,Math.sin(a-.08)*r*.8],[Math.cos(a)*r*.94,Math.sin(a)*r*.94],[Math.cos(a+.08)*r*.8,Math.sin(a+.08)*r*.8]],p.accent,1.6);}star(c,0,0,r*.2,p.accent,0);}else{for(const rr of [r,r*.78]){c.beginPath();c.arc(0,0,rr,.08,TAU-.08);c.stroke();}for(let i=0;i<12;i++){const a=i*TAU/12;line(c,[[Math.cos(a)*r*.84,Math.sin(a)*r*.84],[Math.cos(a)*r*.96,Math.sin(a)*r*.96]],p.accent,i%3?1.5:3);}line(c,[[0,-r*.62],[0,0],[r*.43,r*.2]],p.accent,3);}c.restore();
}
function warning(c,t,camera,time){
 if(!t.vfx)return false;const p=profile(t),progress=clamp(1-t.life/(t.duration||1),0,1),hot=t.life<.28,L=lane();
 c.save();footprint(c,t,camera);c.fillStyle=p.color+(hot?'38':'22');c.fill('evenodd');
 c.save();footprint(c,t,camera);c.clip('evenodd');
 if(!low()&&budget()){
  c.strokeStyle=p.color+'50';c.lineWidth=1;const x=t.x-camera,y=t.y;
  for(let i=0;i<7;i++){const a=i*2.399+profiles.indexOf(p)*.3,rr=(t.inner||0)+(t.r-(t.inner||0))*(.3+noise(i+20)*.6);line(c,[[x+Math.cos(a)*rr*.8,y+Math.sin(a)*rr*.8/L],[x+Math.cos(a+.12)*rr,y+Math.sin(a+.12)*rr/L]],p.color+'70',1.5);}
  if(t.shape!=='beam'){c.translate(x+(t.inner?(t.r+t.inner)*.5:0),y);c.scale(1,1/L);c.strokeStyle=p.accent+'90';c.lineWidth=1.5;const r=Math.min(28,(t.r-(t.inner||0))*.2);polygon(c,r,['prism','snow','sun'].includes(p.shape)?6:4,time*.16,.72);c.stroke();if(['dial','gears'].includes(p.shape))gear(c,r*.6,time*.25);}
 }
 c.restore();
 if(t.shape==='beam'){
  c.save();c.scale(1,1/L);c.strokeStyle=p.accent;c.lineWidth=2;c.setLineDash([9,10]);c.lineDashOffset=-time*25;line(c,[[t.ax-camera,t.ay*L],[t.ax-camera+(t.bx-t.ax)*progress,(t.ay+(t.by-t.ay)*progress)*L]],p.accent,2);c.restore();
 }else{
  c.strokeStyle=p.accent;c.lineWidth=3;c.beginPath();c.ellipse(t.x-camera,t.y,t.r,t.r/L,0,-Math.PI/2,-Math.PI/2+TAU*progress);c.stroke();
  if(t.inner){c.strokeStyle='#a8edcf';c.lineWidth=2;c.setLineDash([7,6]);c.beginPath();c.ellipse(t.x-camera,t.y,t.inner,t.inner/L,0,0,TAU);c.stroke();c.setLineDash([]);c.fillStyle='#c9ffe2';c.font='12px "Rift UI",sans-serif';c.textAlign='center';c.fillText('중앙 안전',t.x-camera,t.y+4);}
 }
 c.restore();edge(c,t,camera);warningDraws++;stylesSeen.add(p.id);return true;
}
function windup(c,f,camera,time,p,age){
 const height=f.height||135,focusY=-height*.72,r=f.caster?26:35,ready=ease(age);c.save();c.translate(f.x-camera,f.y);c.globalAlpha*=.22+ready*.5;
 c.save();c.scale(1,1/lane());c.strokeStyle=p.color;c.lineWidth=1.6;c.beginPath();c.arc(0,0,r+18*(1-ready),-age*2,TAU-age*2);c.stroke();c.restore();
 sprite(c,p,'burst',0,focusY,65+ready*40,65+ready*40,.55);
 const count=low()?2:5;for(let i=0;i<count;i++){const a=i*TAU/count+age*1.3,d=(1-ready)*48+12,x=Math.cos(a)*d,y=focusY+Math.sin(a)*d*.6;c.fillStyle=i%2?p.color:p.accent;c.beginPath();c.ellipse(x,y,1.2+ready*1.4,2+ready*2,a,0,TAU);c.fill();}
 c.strokeStyle=p.accent;c.lineWidth=1.3;c.beginPath();c.ellipse(0,focusY,r*(.65+ready*.35),r*.32,age*.5,0,TAU);c.stroke();if(!low()&&budget()){c.globalAlpha*=.45;for(let i=0;i<3;i++){c.beginPath();c.moveTo((i-1)*20,0);c.bezierCurveTo((i-1)*38,-height*.3,(1-i)*25,focusY-10,0,focusY);c.strokeStyle=p.color;c.stroke();}}
 c.restore();windupDraws++;stylesSeen.add(p.id);return true;
}
function beamImpact(c,f,camera,p,age){
 const L=lane(),ax=f.ax-camera,ay=f.ay*L,dx=f.bx-f.ax,dy=(f.by-f.ay)*L,len=Math.hypot(dx,dy);c.save();footprint(c,{...f,r:f.range||f.r},camera);c.clip();c.scale(1,1/L);c.translate(ax,ay);c.rotate(Math.atan2(dy,dx));
 const g=c.createLinearGradient(0,-(f.range||40),0,f.range||40);g.addColorStop(0,p.color+'08');g.addColorStop(.35,p.color+'99');g.addColorStop(.5,p.accent+'dd');g.addColorStop(.65,p.color+'99');g.addColorStop(1,p.color+'08');c.fillStyle=g;c.fillRect(-60,-(f.range||40),len+120,(f.range||40)*2);
 line(c,[[0,0],[len,0]],p.accent,(1-age)*8+1);if(!low()&&budget())for(let i=0;i<8;i++){const x=len*(i/8+age*.08);line(c,[[x-18,-12],[x,0],[x-18,12]],p.accent+'90',1.5);}c.restore();
}
function effect(c,f,camera,time){
 if(!f.enemy||!['impact','muzzle','windup'].includes(f.type))return false;const p=profile(f),age=clamp(1-f.life/(f.duration||(f.type==='muzzle'?.22:.55)),0,1),L=lane();
 if(f.type==='windup')return windup(c,f,camera,time,p,age);
 if(f.shape==='beam'){beamImpact(c,f,camera,p,age);impactDraws++;stylesSeen.add(p.id);return true;}
 const r=clamp(f.range||f.r||75,18,360),rise=ease(age/.22),fade=(1-age)**.8,n=low()?3:6;
 c.save();c.translate(f.x-camera,f.y-(f.height||0));c.globalAlpha*=fade;
 if(f.inner){const t={x:0,y:0,r,inner:f.inner};footprint(c,t,0);c.clip('evenodd');}
 if(f.type==='muzzle'||f.caster&&f.height){
  sprite(c,p,'burst',0,0,r*3.4,r*2.8,.8);const rr=r*(.4+ease(age)*.65);c.strokeStyle=p.color;c.lineWidth=3;c.beginPath();c.ellipse(0,0,rr,rr*.6,age*.4,0,TAU);c.stroke();for(let i=0;i<n;i++){const a=i*TAU/n,x=Math.cos(a)*rr,y=Math.sin(a)*rr*.65;line(c,[[x*.7,y*.7],[x,y]],i%2?p.color:p.accent,2);}c.restore();impactDraws++;stylesSeen.add(p.id);return true;
 }
 sprite(c,p,'haze',0,-r*.1,r*2.4,r*1.1,.65);sprite(c,p,'burst',0,-5,r*2.1,r*.85,.62*(1-age));
 const shock=r*(.3+ease(age)*.65);c.strokeStyle=p.color+'99';c.lineWidth=4*(1-age)+1;c.beginPath();c.ellipse(0,0,shock,shock/L,0,0,TAU);c.stroke();
 switch(p.shape){
  case 'crescent':{
   for(let i=0;i<(low()?1:3);i++){c.save();c.translate(0,-20-i*9);c.rotate(-.55+age*.9+i*.22);c.scale(1,.42);const rr=r*(.62+rise*.3),g=c.createLinearGradient(-rr,0,rr,0);g.addColorStop(0,p.color+'00');g.addColorStop(.5,p.color);g.addColorStop(.9,p.accent);g.addColorStop(1,p.accent+'00');c.fillStyle=g;c.beginPath();c.arc(0,0,rr,Math.PI*.87,Math.PI*1.94);c.arc(0,0,rr-9-i*2,Math.PI*1.94,Math.PI*.87,true);c.closePath();c.fill();c.restore();}
   break;}
  case 'hammer':case 'eruption':{
   for(let i=0;i<n;i++){const a=i*2.399,x=Math.cos(a)*r*.72,y=Math.sin(a)*r/L*.65,h=(p.shape==='eruption'?150:85)*(1-age)*rise+15;if(p.shape==='eruption')flame(c,x,y,h,12+i%3*3,p,age);else{c.save();c.translate(x,y);c.strokeStyle=p.accent;c.lineWidth=3;line(c,[[0,0],[-12,-18],[-7,-36]],p.color,4);c.restore();}debris(c,x*(1+age*.4),y-Math.sin(Math.PI*age)*(40+i%3*20),8+i%3*4,p,i+age*2,true);}
   if(p.shape==='hammer'){c.save();c.scale(1,1/L);for(let i=0;i<5;i++){const a=i*TAU/5;line(c,[[Math.cos(a)*r*.2,Math.sin(a)*r*.2],[Math.cos(a+.12)*r*.5,Math.sin(a+.12)*r*.5],[Math.cos(a)*r*.9,Math.sin(a)*r*.9]],p.color+'cc',2.5);}c.restore();}break;}
  case 'vines':case 'tentacle':
   for(let i=0;i<n;i++){const a=i*2.399,x=Math.cos(a)*r*.72,y=Math.sin(a)*r/L*.7,h=(65+i%3*22)*rise*(1-age*.65);thorn(c,x,y,h,p,Math.cos(a)*.28,p.shape==='tentacle');}break;
  case 'prism':case 'snow':
   for(let i=0;i<n;i++){const a=i*TAU/n;facet(c,Math.cos(a)*r*.66,Math.sin(a)*r/L*.68,(35+i%3*17+rise*50)*(1-age*.4),10+i%3*4,p,Math.cos(a)*.3);if(p.shape==='snow'&&!low()&&budget())star(c,Math.cos(a)*r*(.5+age*.5),Math.sin(a)*r/L-age*70,4+i%3,p.accent,age+i);}break;
  case 'surge':case 'current':
   for(let i=0;i<(low()?1:3);i++)wave(c,(i-1)*r*.1,12+i*9,r*(.6+i*.15),60*(1-age)*rise+15,p,age);if(p.shape==='current')dial(c,r*.43,p,age*1.6,true);break;
  case 'lightning':
   for(let i=0;i<(low()?2:4);i++)bolt(c,(i-1.5)*r*.42,Math.sin(i)*r/L*.4,(155+i%2*55)*(.85+rise*.15),p,i*19+(f.id||0),5*(1-age)+1);break;
  case 'dial':case 'gears':
   if(p.shape==='dial'){dial(c,r*.8,p,age*.6);dial(c,r*.45,p,-age*.9);}else for(let i=0;i<(low()?1:3);i++){c.save();c.translate((i-1)*r*.46,Math.sin(i)*r*.08-Math.sin(Math.PI*age)*30);dial(c,r*.34,p,age*3*(i%2?-1:1),true);c.restore();}break;
  case 'eclipse':{
   c.save();c.scale(1,1/L);const g=c.createRadialGradient(0,0,r*.15,0,0,r*.85);g.addColorStop(0,'#100d2066');g.addColorStop(.7,'#151027bb');g.addColorStop(.86,p.color+'99');g.addColorStop(1,p.color+'00');c.fillStyle=g;c.beginPath();c.arc(0,0,r*.85,0,TAU);c.fill();c.strokeStyle=p.accent;c.lineWidth=3;c.beginPath();c.arc(0,0,r*.68,-age*.7,TAU-age*.7);c.stroke();c.restore();for(let i=0;i<n;i++){const a=i*TAU/n;facet(c,Math.cos(a)*r*.8,Math.sin(a)*r/L*.8,25+rise*25,6,p,a*.1);}break;}
  case 'meteor':
   for(let i=0;i<n;i++){const x=Math.sin(i*2.399)*r*.7,y=Math.cos(i*2.399)*r/L*.7,fall=(1-rise)*120;sprite(c,p,'trail',x+25,y-fall-45,150*(1-age),26,.7,-.95);debris(c,x+fall*.3,y-fall,12+i%3*5,p,i+age,true);star(c,x,y,6+8*(1-age),p.accent,age+i);}break;
  case 'spores':
   sprite(c,p,'haze',0,-35-age*35,r*2.3,r*1.3,.8);for(let i=0;i<(low()?1:3);i++){const x=(i-1)*r*.32,h=(38+i%2*18)*rise*(1-age*.45),g=c.createLinearGradient(x,-h,x,12);g.addColorStop(0,p.accent+'00');g.addColorStop(.4,p.color+'66');g.addColorStop(1,p.color+'08');c.fillStyle=g;c.beginPath();c.moveTo(x-16,10);c.bezierCurveTo(x-28,-h*.45,x+25,-h*.55,x,-h);c.bezierCurveTo(x+40,-h*.8,x+10,-h*.2,x+19,10);c.fill();}for(let i=0;i<n;i++){const x=Math.sin(i*2.399)*r*.78,y=Math.cos(i*2.399)*r/L*.65-age*65,rr=6+i%3*3;c.strokeStyle=p.color;c.lineWidth=2;c.fillStyle=p.color+'35';c.beginPath();c.arc(x,y,rr,0,TAU);c.fill();c.stroke();c.fillStyle=p.accent;c.beginPath();c.arc(x-rr*.25,y-rr*.3,rr*.2,0,TAU);c.fill();}break;
  case 'sun':
   for(let i=0;i<n;i++){const a=i*TAU/n,x=Math.cos(a)*r*.68,y=Math.sin(a)*r/L*.7,h=(100+i%2*28)*rise*(1-age*.65);const g=c.createLinearGradient(x,y-h,x,y);g.addColorStop(0,p.accent+'00');g.addColorStop(.2,p.accent+'cc');g.addColorStop(.7,p.color+'88');g.addColorStop(1,p.color+'00');c.fillStyle=g;c.fillRect(x-6,y-h,12,h);line(c,[[x-9,y-h*.7],[x,y-h*.82],[x+9,y-h*.7]],p.accent,1.7);}dial(c,r*.6,p,age*.3);break;
 }
 if(!low()&&budget())for(let i=0;i<5;i++){const a=i*2.399,rr=r*(.3+age*.7),x=Math.cos(a)*rr,y=Math.sin(a)*rr/L-Math.sin(Math.PI*age)*35;line(c,[[x,y],[x+Math.cos(a)*8,y-4]],i%2?p.color:p.accent,1.5);}
 c.restore();impactDraws++;stylesSeen.add(p.id);return true;
}
function projectile(c,q,x,y,time){
 if(q.team!=='enemy')return false;const p=profile(q),r=clamp(q.radius||14,9,24),angle=Math.atan2(q.vy-(q.heightV||0),q.vx),phase=time*.8+(q.id||0)*.27;
 c.save();c.translate(x,y-(q.height||135));c.rotate(angle);sprite(c,p,'trail',-29,0,110,28,.85);sprite(c,p,'burst',0,0,r*4.3,r*3.5,.58);c.lineJoin='round';c.lineCap='round';c.strokeStyle=p.color;c.fillStyle=p.color;c.lineWidth=2;c.globalAlpha*=.95;
 switch(p.shape){
  case 'crescent':c.save();c.scale(1,.7);c.beginPath();c.arc(0,0,r,-1.3,1.3);c.arc(-r*.28,0,r*.78,1.3,-1.3,true);c.closePath();c.fill();c.strokeStyle=p.accent;c.lineWidth=1;c.stroke();c.restore();break;
  case 'hammer':case 'eruption':debris(c,0,0,r*.8,p,phase,true);if(p.shape==='eruption')flame(c,-r*.4,0,r*2,r*.6,p,phase);break;
  case 'vines':case 'tentacle':c.save();c.rotate(Math.PI/2);thorn(c,0,0,r*1.6,p,0,p.shape==='tentacle');c.restore();break;
  case 'prism':case 'snow':facet(c,0,0,r*1.5,r*.42,p,Math.PI/2);if(p.shape==='snow'){c.strokeStyle=p.accent;for(let i=0;i<3;i++){const a=i*TAU/3+phase;line(c,[[Math.cos(a)*r*.5,Math.sin(a)*r*.5],[Math.cos(a)*r,Math.sin(a)*r]],p.accent,1);}}break;
  case 'surge':case 'current':c.save();c.rotate(Math.PI/2);wave(c,0,0,r,r*1.5,p,phase);c.restore();if(p.shape==='current'){c.strokeStyle=p.accent;c.beginPath();c.arc(0,0,r*.7,phase,phase+Math.PI*1.4);c.stroke();}break;
  case 'lightning':c.save();c.rotate(Math.PI/2);bolt(c,0,0,r*2,p,q.id||0,3);c.restore();break;
  case 'dial':case 'gears':c.save();c.scale(1,lane());dial(c,r,p,phase,p.shape==='gears');c.restore();break;
  case 'eclipse':c.fillStyle='#110b23';c.beginPath();c.arc(0,0,r*.85,0,TAU);c.fill();c.strokeStyle=p.accent;c.lineWidth=2;c.beginPath();c.arc(0,0,r,phase,phase+Math.PI*1.7);c.stroke();break;
  case 'meteor':debris(c,0,0,r*.8,p,phase,true);star(c,r*.65,0,r*.4,p.accent,phase);break;
  case 'spores':for(let i=0;i<3;i++){const a=i*2.399+phase;c.fillStyle=p.color+'aa';c.strokeStyle=p.accent+'bb';c.beginPath();c.arc(Math.cos(a)*r*.4,Math.sin(a)*r*.4,r*.5,0,TAU);c.fill();c.stroke();}break;
  case 'sun':c.save();c.rotate(Math.PI/2);facet(c,0,0,r*1.7,r*.3,p);c.restore();c.strokeStyle=p.accent;line(c,[[0,-r*.6],[0,r*.6]],p.accent,1.5);break;
 }
 c.restore();projectileDraws++;stylesSeen.add(p.id);return true;
}
function soundFor(value){return {crescent:'blade-wave',hammer:'earth-break',vines:'spear-wind',prism:'ice-break',surge:'arcane-wave',lightning:'arc-chain',dial:'ward-rise',eclipse:'gun-blast',snow:'ice-break',eruption:'fire-cast',meteor:'arc-chain',tentacle:'gun-blast',current:'arcane-wave',spores:'holy-cast',gears:'earth-break',sun:'holy-hit'}[profile(value).shape];}
function edge(c,t,camera){c.save();c.globalCompositeOperation='source-over';footprint(c,t,camera);c.lineJoin='round';c.strokeStyle='#020712';c.lineWidth=t.life<.28?9:7;c.globalAlpha=.9;c.stroke();c.strokeStyle=t.life<.28?'#fff4d7':profile(t).color;c.lineWidth=t.life<.28?4:2.5;c.globalAlpha=.96;c.stroke();c.restore();}
root.DungeonEnemyFX={beginFrame,edge,profiles,profile,contains,warning,effect,projectile,soundFor,stats:()=>({warningDraws,impactDraws,projectileDraws,windupDraws,styles:[...stylesSeen],cachedTextures:textures.size,cacheBytes:[...textures.values()].reduce((n,v)=>n+v.width*v.height*4,0),detailUsed,peakDetail,detailLimit:DETAIL_LIMIT})};
})(typeof window!=='undefined'?window:globalThis);

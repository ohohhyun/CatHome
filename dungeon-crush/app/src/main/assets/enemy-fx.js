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
let warningDraws=0,impactDraws=0,projectileDraws=0;const stylesSeen=new Set(),auras=new Map();
function aura(c,p,x,y,w,h,alpha=1){let cv=auras.get(p.id);if(!cv){cv=document.createElement('canvas');cv.width=cv.height=128;const q=cv.getContext('2d'),g=q.createRadialGradient(64,64,2,64,64,64);g.addColorStop(0,p.accent+'cc');g.addColorStop(.16,p.color+'99');g.addColorStop(.48,p.color+'32');g.addColorStop(1,p.color+'00');q.fillStyle=g;q.fillRect(0,0,128,128);auras.set(p.id,cv);}c.save();c.globalAlpha*=alpha;c.globalCompositeOperation='lighter';c.drawImage(cv,x-w/2,y-h/2,w,h);c.restore();}
function profile(value){const id=typeof value==='string'?value:value?.vfx||value?.element;return byId[id]||byId[aliases[id]]||profiles[Number.isInteger(value?.region)?clamp(value.region,0,15):0];}
function lane(){return root.Rift?.LANE||2.6;}
function low(){return !!root.DungeonSound?.isReducedEffects?.();}
function contains(t,p){const L=lane();if(t.shape==='beam'){const ax=t.ax,ay=t.ay*L,bx=t.bx,by=t.by*L,dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy,k=len?clamp(((p.x-ax)*dx+(p.y*L-ay)*dy)/len,0,1):0;return Math.hypot(p.x-ax-dx*k,p.y*L-ay-dy*k)<t.r;}const d=Math.hypot(p.x-t.x,(p.y-t.y)*L);return d<t.r&&d>=(t.inner||0);}
function polygon(c,r,n,rotation=0,inner=1){c.beginPath();for(let i=0;i<n;i++){const angle=rotation+i*TAU/n,rr=r*(i%2?inner:1),x=Math.cos(angle)*rr,y=Math.sin(angle)*rr;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();}
function gear(c,r,time){polygon(c,r,24,time,.78);c.stroke();c.beginPath();c.arc(0,0,r*.5,0,TAU);c.stroke();for(let i=0;i<4;i++){const a=i*Math.PI/2+time;c.beginPath();c.moveTo(Math.cos(a)*r*.2,Math.sin(a)*r*.2);c.lineTo(Math.cos(a)*r*.7,Math.sin(a)*r*.7);c.stroke();}}
function star(c,x,y,r,color,rotation=0){c.save();c.translate(x,y);c.fillStyle=color;polygon(c,r,10,rotation,.35);c.fill();c.restore();}
function capsule(c,t,camera){const L=lane(),dx=t.bx-t.ax,dy=(t.by-t.ay)*L,len=Math.hypot(dx,dy);c.save();c.scale(1,1/L);c.translate(t.ax-camera,t.ay*L);c.rotate(Math.atan2(dy,dx));c.beginPath();c.moveTo(0,-t.r);c.lineTo(len,-t.r);c.arc(len,0,t.r,-Math.PI/2,Math.PI/2);c.lineTo(0,t.r);c.arc(0,0,t.r,Math.PI/2,Math.PI*1.5);c.closePath();c.restore();}
function footprint(c,t,camera){if(t.shape==='beam'){capsule(c,t,camera);return;}c.beginPath();c.ellipse(t.x-camera,t.y,t.r,t.r/lane(),0,0,TAU);if(t.inner)c.ellipse(t.x-camera,t.y,t.inner,t.inner/lane(),0,0,TAU,true);}
function warning(c,t,camera,time){if(!t.vfx)return false;const p=profile(t),progress=clamp(1-t.life/(t.duration||1),0,1),hot=t.life<.28;
 c.save();footprint(c,t,camera);c.fillStyle=p.color+(hot?'38':'22');c.fill('evenodd');c.strokeStyle=hot?'#fff0d5':p.color;c.lineWidth=hot?4:2;c.stroke();
 if(t.shape==='beam'){c.save();c.scale(1,1/lane());c.strokeStyle=p.accent;c.lineWidth=2;c.setLineDash([10,9]);c.lineDashOffset=-time*28;c.beginPath();c.moveTo(t.ax-camera,t.ay*lane());c.lineTo(t.ax-camera+(t.bx-t.ax)*progress,(t.ay+(t.by-t.ay)*progress)*lane());c.stroke();c.restore();}
 else{c.beginPath();c.ellipse(t.x-camera,t.y,t.r,t.r/lane(),0,-Math.PI/2,-Math.PI/2+TAU*progress);c.strokeStyle=p.accent;c.lineWidth=3;c.stroke();if(t.inner){c.beginPath();c.ellipse(t.x-camera,t.y,t.inner,t.inner/lane(),0,0,TAU);c.strokeStyle='#a8edcf';c.setLineDash([7,6]);c.lineWidth=2;c.stroke();c.setLineDash([]);c.fillStyle='#c9ffe2';c.font='12px "Rift UI",sans-serif';c.textAlign='center';c.fillText('중앙 안전',t.x-camera,t.y+4);}}
 if(!low()){c.save();c.translate(t.x-camera,t.y);c.scale(1,1/lane());c.strokeStyle=p.color;c.fillStyle=p.accent;c.lineWidth=2;c.globalAlpha=.55;const radius=Math.min(t.inner?Math.max(12,(t.r-t.inner)*.25):t.r*.22,30),angle=time*.7;
  if(t.inner)c.translate((t.r+t.inner)*.5,0);
  if(['dial','gears','current'].includes(p.shape))gear(c,radius,angle);
  else if(['prism','snow','sun'].includes(p.shape)){polygon(c,radius,p.shape==='sun'?12:6,angle,.65);c.stroke();}
  else if(p.shape==='spores'){for(let i=0;i<4;i++){c.beginPath();c.arc(Math.cos(i*2.4)*radius*.5,Math.sin(i*2.4)*radius*.5,4+i%2,0,TAU);c.stroke();}}
  else if(['vines','tentacle','surge'].includes(p.shape)){for(let i=0;i<3;i++){c.beginPath();c.moveTo(-radius,(-1+i)*8);c.bezierCurveTo(-radius*.3,-radius+i*8,radius*.3,radius+i*8,radius,(-1+i)*8);c.stroke();}}
  else{polygon(c,radius,p.shape==='eclipse'?8:4,angle,.45);c.stroke();}c.restore();}
 c.restore();warningDraws++;stylesSeen.add(p.id);return true;
}
function shard(c,x,y,size,color,angle=0){c.save();c.translate(x,y);c.rotate(angle);const g=c.createLinearGradient(-size*.3,-size,size*.3,size*.2);g.addColorStop(0,'#f1ffff');g.addColorStop(.3,color);g.addColorStop(1,color+'44');c.fillStyle=g;c.beginPath();c.moveTo(0,-size);c.lineTo(size*.22,-size*.2);c.lineTo(size*.12,size*.15);c.lineTo(-size*.28,size*.1);c.closePath();c.fill();c.strokeStyle='#eaffffc0';c.lineWidth=1;c.stroke();c.beginPath();c.moveTo(0,-size);c.lineTo(-size*.02,size*.1);c.stroke();c.restore();}
function effect(c,f,camera,time){if(!f.enemy||!['impact','muzzle'].includes(f.type))return false;const p=profile(f),age=clamp(1-f.life/(f.duration||.55),0,1),fade=(1-age)*.95,r=clamp(f.range||f.r||75,25,360),L=lane(),count=low()?3:7;
 c.save();c.globalAlpha=fade;c.translate(f.x-camera,f.y-(f.height||0));c.globalCompositeOperation='lighter';if(!low())aura(c,p,0,0,r*2.5,r*1.2,.7);
 if(f.shape==='beam'){c.save();c.translate(-(f.x-camera),-f.y);footprint(c,f,camera);c.fillStyle=p.color+'55';c.fill();c.strokeStyle=p.accent;c.lineWidth=(1-age)*6+1;c.stroke();c.restore();}
 if(f.inner){c.beginPath();c.ellipse(0,0,r,r/L,0,0,TAU);c.ellipse(0,0,f.inner,f.inner/L,0,0,TAU,true);c.clip('evenodd');}
 const energy=c.createLinearGradient(0,-170,0,35);energy.addColorStop(0,p.accent);energy.addColorStop(.35,p.color);energy.addColorStop(1,p.color+'55');c.strokeStyle=p.color;c.fillStyle=p.color;c.lineWidth=3;c.lineCap='round';
 if(p.shape==='crescent'){
  for(let i=0;i<3;i++){c.save();c.rotate(-.55+age*.7+i*.23);c.beginPath();c.ellipse(0,-20,r*(.5+age*.35),r*.23,0,Math.PI*.85,Math.PI*1.85);c.strokeStyle=i===1?p.accent:p.color;c.lineWidth=i===1?3:8;c.stroke();c.restore();}for(let i=0;i<count;i++)shard(c,(i-count/2)*r/count,-age*70,14,p.accent,i*.8);
 }else if(p.shape==='hammer'||p.shape==='eruption'){
  for(let i=0;i<count;i++){const x=Math.sin(i*2.4)*r*.85,y=Math.cos(i*2.4)*r/L*.7,h=(p.shape==='eruption'?150:85)*(1-age)+20;c.fillStyle=energy;c.beginPath();c.moveTo(x-12,y);c.quadraticCurveTo(x-20,y-h*.6,x+Math.sin(i)*15,y-h);c.quadraticCurveTo(x+20,y-h*.45,x+12,y);c.fill();c.save();c.translate(x*(1+age*.4),y-age*65);c.rotate(i+age*2);c.fillStyle=p.shape==='hammer'?'#8e8074':'#57413c';c.fillRect(-6,-7,12,14);c.restore();}
 }else if(p.shape==='vines'||p.shape==='tentacle'){
  for(let i=0;i<count;i++){const x=Math.cos(i*2.399)*r*.8,y=Math.sin(i*2.399)*r/L*.7,h=(80+i%3*22)*Math.sin(Math.PI*age);c.strokeStyle=i%2?p.color:p.accent;c.lineWidth=p.shape==='vines'?6:10;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-35,y-h*.4,x+45,y-h*.7,x+Math.sin(i+age*4)*25,y-h);c.stroke();if(p.shape==='vines')shard(c,x+8,y-h*.55,15,p.color,.8);}
 }else if(p.shape==='prism'||p.shape==='snow'){
  for(let i=0;i<count;i++){const a=i*TAU/count,x=Math.cos(a)*r*.72,y=Math.sin(a)*r/L*.72;shard(c,x,y,35+Math.sin(Math.PI*age)*70,p.accent,Math.cos(a)*.4);if(p.shape==='snow')star(c,x*(.8+age),y-40-age*60,8,p.color,age+i);}
 }else if(p.shape==='surge'||p.shape==='current'){
  for(let i=0;i<3;i++){const rr=r*(.38+age*.6)+i*16;c.strokeStyle=i===1?p.accent:p.color;c.lineWidth=i===1?3:8;c.beginPath();c.moveTo(-rr,10+i*8);c.bezierCurveTo(-rr*.5,-75*(1-age)-i*10,rr*.3,30,rr,-35*(1-age));c.stroke();}if(p.shape==='current'){c.save();c.scale(1,1/L);c.rotate(age*2);gear(c,r*.35,age);c.restore();}
 }else if(p.shape==='lightning'){
  for(let i=0;i<(low()?2:4);i++){const x=(i-1.5)*r*.43,y=Math.sin(i)*r/L*.5,h=160+i%2*70;c.beginPath();c.moveTo(x+25,y-h);for(let n=1;n<=5;n++)c.lineTo(x+(n%2?18:-13)*(1-age),y-h+n*h/5);c.strokeStyle=p.color;c.lineWidth=8;c.stroke();c.strokeStyle=p.accent;c.lineWidth=2;c.stroke();}
 }else if(p.shape==='dial'||p.shape==='gears'){
  c.save();c.scale(1,1/L);if(p.shape==='dial'){c.beginPath();c.arc(0,0,r*.75,0,TAU);c.stroke();for(let i=0;i<12;i++){const a=i*TAU/12;c.beginPath();c.moveTo(Math.cos(a)*r*.62,Math.sin(a)*r*.62);c.lineTo(Math.cos(a)*r*.72,Math.sin(a)*r*.72);c.stroke();}c.beginPath();c.moveTo(0,-r*.55);c.lineTo(0,0);c.lineTo(Math.cos(age*6)*r*.5,Math.sin(age*6)*r*.5);c.stroke();}else for(let i=0;i<3;i++){c.save();c.translate((i-1)*r*.42,Math.sin(i)*r*.18);gear(c,r*.35,age*4*(i%2?-1:1));c.restore();}c.restore();
 }else if(p.shape==='eclipse'){
  c.save();c.scale(1,1/L);c.fillStyle='#151026bb';polygon(c,r*.75,8,age,.7);c.fill();c.strokeStyle=p.accent;c.stroke();for(let i=0;i<count;i++)shard(c,Math.cos(i*TAU/count)*r*.8,Math.sin(i*TAU/count)*r*.8,30,p.color,i);c.restore();
 }else if(p.shape==='meteor'){
  for(let i=0;i<count;i++){const x=Math.sin(i*2.4)*r*.7,y=Math.cos(i*2.4)*r/L*.7;c.strokeStyle=p.color;c.lineWidth=4;c.beginPath();c.moveTo(x+65*(1-age),y-150*(1-age));c.lineTo(x,y);c.stroke();star(c,x,y,12+14*(1-age),i%2?p.accent:p.color,age+i);}
 }else if(p.shape==='spores'){
  c.save();c.scale(1,1/L);polygon(c,r*(.65+age*.2),16,age,.8);c.fillStyle=p.color+'88';c.fill();c.restore();for(let i=0;i<count;i++){const x=Math.sin(i*2.4)*r*.8,y=Math.cos(i*2.4)*r/L*.7-age*80;c.fillStyle=i%2?p.color:p.accent;c.beginPath();c.ellipse(x,y,5+i%3,7+i%2*4,0,0,TAU);c.fill();}
 }else if(p.shape==='sun'){
  for(let i=0;i<count;i++){const a=i*TAU/count,x=Math.cos(a)*r*.65,y=Math.sin(a)*r/L*.65,h=120*(1-age)+30;c.fillStyle=i%2?p.color+'99':p.accent+'aa';c.beginPath();c.moveTo(x-9,y);c.lineTo(x-3,y-h);c.lineTo(x+3,y-h);c.lineTo(x+9,y);c.closePath();c.fill();}c.save();c.scale(1,1/L);polygon(c,r*.7,12,age,.7);c.strokeStyle=p.accent;c.stroke();c.restore();
 }
 if(!low()){for(let i=0;i<5;i++){const a=i*2.399,x=Math.cos(a)*r*.6,y=Math.sin(a)*r/L*.6-age*35;c.strokeStyle=i%2?p.accent:p.color;c.lineWidth=1.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*18*(1-age),y-10*(1-age));c.stroke();}}c.restore();impactDraws++;stylesSeen.add(p.id);return true;
}
function projectile(c,q,x,y,time){if(q.team!=='enemy')return false;const p=profile(q),r=clamp(q.radius||14,9,24),angle=Math.atan2(q.vy,q.vx);c.save();c.translate(x,y-(q.height||135));c.rotate(angle);c.strokeStyle=p.color;c.fillStyle=p.color;c.lineWidth=2;c.globalAlpha=.9;if(!low())aura(c,p,0,0,r*4,r*3,.55);
 if(!low()){c.globalAlpha=.4;c.beginPath();c.moveTo(-35,0);c.lineTo(-5,-r*.45);c.lineTo(5,0);c.lineTo(-5,r*.45);c.closePath();c.fill();c.globalAlpha=.95;}
 switch(p.shape){
  case 'crescent':c.beginPath();c.arc(0,0,r,-1.2,1.2);c.lineTo(-r*.5,0);c.closePath();c.fill();break;
  case 'hammer':c.rotate(.5);c.fillRect(-r*.6,-r*.6,r*1.2,r*1.2);c.strokeStyle=p.accent;c.strokeRect(-r*.35,-r*.35,r*.7,r*.7);break;
  case 'vines':c.beginPath();c.moveTo(r,0);c.lineTo(-r,-r*.55);c.lineTo(-r*.35,0);c.lineTo(-r,r*.55);c.closePath();c.fill();break;
  case 'prism':shard(c,0,0,r*1.5,p.accent,Math.PI/2);break;
  case 'surge':c.beginPath();c.moveTo(r,0);c.quadraticCurveTo(-r*1.5,-r,r*-1.3,0);c.quadraticCurveTo(-r*1.5,r,r,0);c.fill();break;
  case 'lightning':c.beginPath();c.moveTo(-r*1.3,4);c.lineTo(-2,-5);c.lineTo(-4,3);c.lineTo(r*1.3,-4);c.strokeStyle=p.accent;c.lineWidth=4;c.stroke();break;
  case 'dial':c.rotate(time*3);c.beginPath();c.arc(0,0,r*.8,0,TAU);c.stroke();c.beginPath();c.moveTo(0,-r*.6);c.lineTo(0,0);c.lineTo(r*.5,0);c.stroke();break;
  case 'eclipse':polygon(c,r,8,time,.65);c.fillStyle='#211632';c.fill();c.strokeStyle=p.accent;c.stroke();break;
  case 'snow':for(let i=0;i<3;i++){const a=i*Math.PI/3;c.beginPath();c.moveTo(-Math.cos(a)*r,-Math.sin(a)*r);c.lineTo(Math.cos(a)*r,Math.sin(a)*r);c.stroke();}break;
  case 'eruption':c.beginPath();c.moveTo(r,0);c.lineTo(0,-r*.8);c.lineTo(-r,-r*.3);c.lineTo(-r,r*.5);c.lineTo(0,r*.9);c.closePath();c.fill();star(c,0,0,r*.4,p.accent);break;
  case 'meteor':star(c,0,0,r,p.accent,time);break;
  case 'tentacle':c.beginPath();c.moveTo(-r,0);c.bezierCurveTo(-r,-r,r,r,-r,r);c.stroke();star(c,r*.3,0,r*.6,p.accent);break;
  case 'current':c.rotate(time*3);c.beginPath();c.arc(0,0,r,-1.2,1.2);c.stroke();c.beginPath();c.arc(0,0,r*.6,1.9,4.4);c.stroke();break;
  case 'spores':for(let i=0;i<3;i++){c.beginPath();c.arc(Math.cos(i*2.4)*r*.45,Math.sin(i*2.4)*r*.45,r*.55,0,TAU);c.fill();}break;
  case 'gears':c.rotate(time*4);gear(c,r,time);break;
  case 'sun':polygon(c,r,6,time);c.stroke();c.strokeStyle=p.accent;c.beginPath();c.moveTo(-r*.5,0);c.lineTo(r*.5,0);c.moveTo(0,-r*.5);c.lineTo(0,r*.5);c.stroke();break;
 }
 c.restore();projectileDraws++;stylesSeen.add(p.id);return true;
}
function soundFor(value){return {crescent:'blade-wave',hammer:'earth-break',vines:'spear-wind',prism:'ice-break',surge:'arcane-wave',lightning:'arc-chain',dial:'ward-rise',eclipse:'gun-blast',snow:'ice-break',eruption:'fire-cast',meteor:'arc-chain',tentacle:'gun-blast',current:'arcane-wave',spores:'holy-cast',gears:'earth-break',sun:'holy-hit'}[profile(value).shape];}
root.DungeonEnemyFX={profiles,profile,contains,warning,effect,projectile,soundFor,stats:()=>({warningDraws,impactDraws,projectileDraws,styles:[...stylesSeen]})};
})(typeof window!=='undefined'?window:globalThis);

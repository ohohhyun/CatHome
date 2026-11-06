/* Dedicated spell flipbooks with authored motion banks and structured impact accents. */
(function(root){'use strict';
const ACTORS=root.DungeonActors.actors,TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pictures=new Map(),loading=new Set(),failed=new Set();let actorDraws=0,effectDraws=0;
function ensureSkills(cls){if(!ACTORS[cls])return;const key='skills'+cls;if(pictures.has(key)||loading.has(key)||failed.has(key))return;loading.add(key);const im=new Image();im.onload=()=>{pictures.set(key,im);loading.delete(key);};im.onerror=()=>{failed.add(key);loading.delete(key);};im.src='art/advanced/'+ACTORS[cls].id+'-skills.webp';}
function ensure(cls){root.DungeonActors.ensure(cls);ensureSkills(cls);}
function actor(...args){const ok=root.DungeonActors.actor(...args);if(ok)actorDraws++;return ok;}
function hasActor(cls){return root.DungeonActors.hasActor(cls);}
function ready(cls=root.RiftApp?.getClass?.()??0){return root.DungeonActors.ready(cls)&&pictures.has('skills'+cls);}
function preloadAll(){root.DungeonActors.preloadAll();ACTORS.forEach((_,i)=>ensureSkills(i));}
function cell(c,cls,row,col,x,y,w,h,options={}){
 ensureSkills(cls);const im=pictures.get('skills'+cls);if(!im)return false;const sx=Math.round(im.width*col/8),sy=Math.round(im.height*row/6),sw=Math.round(im.width*(col+1)/8)-sx,sh=Math.round(im.height*(row+1)/6)-sy;
 c.save();c.translate(x,y);c.rotate(options.angle||0);c.scale(options.dir||1,1);c.globalCompositeOperation='screen';c.globalAlpha*=options.alpha??1;
 c.drawImage(im,sx,sy,sw,sh,-w*(options.anchorX??.5),-h*(options.anchorY??.5),w,h);c.restore();effectDraws++;return true;
}
function classOf(f){if(Number.isInteger(f.cls)&&f.cls>=0&&f.cls<4)return f.cls;const i=root.Rift?.CLASSES.findIndex(p=>p.color===f.color);return i>=0?i:0;}
function effect(c,f,camera,time){
 if(['text','windup'].includes(f.type))return false;
 const cls=classOf(f),life=f.duration||(f.type==='ultimate'?1.8:f.type==='muzzle'?.22:.55),t=clamp(1-f.life/life,0,.999),col=f.type==='playerwind'?Math.min(3,Math.floor(t*4)):Math.min(7,4+Math.floor(t*4)),dir=f.dir||1,x=f.x-camera,y=f.y,range=f.range||160,alpha=Math.min(1,f.life/.08),index=clamp((f.index||1)-1,0,5),o={dir,alpha};
 if(f.type==='playerwind'){const support=f.index===5;return cell(c,cls,index,col,x+(cls===3&&!support?dir*36:0),y-(support?130:[135,165,185,190][cls]),support?230:155,support?300:180,{alpha:.34,dir});}
 if(f.type==='chain'&&f.points){const pts=f.points;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b.x-a.x,dy=b.y-a.y;cell(c,3,3,col,(a.x+b.x)/2-camera,(a.y+b.y)/2-145,Math.max(160,Math.hypot(dx,dy)*1.6),180,{alpha,angle:Math.atan2(dy,dx)});}return true;}
 if(f.type==='ultimate'&&root.DungeonActors.ultimate(c,cls,t,x,y-165,Math.min(1320,range*2.2),760,alpha*.94)){accents(c,f,camera,t);return true;}
 if(['shield','heal'].includes(f.type))return cell(c,cls,4,col,x,y-135,350,410,{alpha});
 if(f.type==='muzzle')return cell(c,f.caster?3:cls,f.caster?2:0,4,x,y-(f.caster?135:[135,165,185,190][cls]),110,95,{...o,alpha:alpha*.8});
 if(['hit','hurt','death','impact'].includes(f.type)){accents(c,f,camera,t);
  const w=f.type==='impact'?210:f.type==='death'?180:105+(f.stage===2?35:0);return cell(c,f.caster?3:cls,f.caster?1:cls===2?1:0,col,x,y-85,w,w*.8,{...o,alpha:alpha*(f.type==='hurt'?.55:1)});
 }
 if(f.type==='dash')return cell(c,cls,cls===0?2:0,col,x+dir*25,y-105,300,210,{...o,alpha:alpha*.45});
 if(['basic','cone','lift','line','rush','circle','pull','ultimate'].includes(f.type)){
  let row=f.type==='basic'?(f.stage===1?1:0):index;
  let w=f.type==='basic'?285:Math.min(f.type==='ultimate'?1100:820,(range*.95+170)*1.25),h=f.type==='basic'?190:w*.76,xx=x,yy=y-h*.32,angle=0;
  if(['basic','cone','line','rush'].includes(f.type)){xx+=dir*w*.27;yy=y-[135,165,185,190][cls];h=cls===1&&row===0?w*.40:w*.7;}
  if(f.type==='lift'){xx+=dir*70;w=320;h=390;yy=y-145;}
  if(cls===1&&index===3&&f.type!=='basic'){xx=x+dir*Math.min(430,range*.57);yy=y-125;w=460;h=390;}
  if(f.type==='rush'&&cls===1){xx=x+dir*range*.5;yy=y-115;w=410;h=400;}
  if(f.type==='basic'&&cls===2&&f.stage===2){row=1;angle=-dir*1.1;xx=x+dir*10;yy=y-180;w=270;h=230;}
  if(f.type==='basic'&&cls===0&&f.stage===2){angle=dir*.6;yy=y-110;}
  const drawn=cell(c,cls,row,col,xx,yy,w,h,{...o,angle,alpha:alpha*(f.owner!==undefined&&f.owner!==(root.RiftApp?.getMyId?.()??0)?.48:.76)});accents(c,f,camera,t);
  if(f.type==='ultimate'&&drawn)for(const side of [-1,1])cell(c,cls,5,col,xx+side*w*.30,yy+40,w*.55,h*.70,{alpha:alpha*.5});
  return drawn;
 }
 return false;
}
function projectile(c,q,x,y,time){const angle=Math.atan2(q.vy-(q.heightV||0),q.vx),yy=y-(q.height||(q.team==='enemy'?135:190));if(q.team==='enemy')return cell(c,3,2,3+(Math.floor(time*5)%3),x,yy,88,88,{alpha:.8,angle});
 if(q.kind==='bullet'){cell(c,3,0,4,x,yy,q.index===1?140:100,50,{angle,anchorX:.77,alpha:.42});c.save();c.translate(x,yy);c.rotate(angle);c.globalCompositeOperation='screen';const length=q.index===1?100:68,gradient=c.createLinearGradient(-length,0,9,0);gradient.addColorStop(0,'#a559ff00');gradient.addColorStop(.65,'#bf86ffbb');gradient.addColorStop(1,'#fff7ff');c.fillStyle=gradient;c.beginPath();c.moveTo(-length,-2);c.lineTo(0,-4);c.lineTo(10,0);c.lineTo(0,4);c.lineTo(-length,2);c.closePath();c.fill();c.fillStyle='#fff4ff';c.beginPath();c.ellipse(0,0,6,2.5,0,0,TAU);c.fill();c.restore();return true;}
 return cell(c,3,q.kind==='pull'?2:1,3+(Math.floor(time*5)%3),x,yy,110,110,{angle,alpha:.95});}
function accents(c,f,camera,t){const cls=classOf(f),color=f.color||root.Rift.CLASSES[cls].color,dir=f.dir||1,a=clamp(1-t,0,1),hit=['hit','hurt','death'].includes(f.type),x=f.x-camera,y=f.y-(hit?85:130);c.save();c.translate(x,y);c.scale(dir,1);c.globalCompositeOperation='screen';
 if(hit){const radius=20+t*85,heavy=f.stage===2||f.crit;c.globalAlpha=a*.8;for(let layer=0;layer<2;layer++){c.strokeStyle=layer?'#fff9e5':color;c.lineWidth=layer?2:heavy?7:4;c.beginPath();c.moveTo(-radius*.65,-radius*.55);c.lineTo(radius*.65,radius*.55);c.moveTo(-radius*.55,radius*.65);c.lineTo(radius*.55,-radius*.65);c.stroke();}c.globalAlpha=a*.35;c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.ellipse(0,0,radius*.8,radius*.35,0,0,TAU);c.stroke();}
 else if(['basic','cone','lift'].includes(f.type)&&cls<2){const sweep=(f.stage||0)%2?-1:1,reach=f.type==='basic'?(cls===1?220:170):Math.min(360,f.range||260);c.rotate(f.type==='lift'?-.9:sweep*(-.32+t*.36));for(let layer=0;layer<4;layer++){c.globalAlpha=a*(layer===3?.9:.12);c.strokeStyle=layer===3?'#fff4dc':color;c.lineWidth=layer===3?2:22-layer*4;c.beginPath();c.ellipse(12,0,reach-layer*5,(reach-layer*5)*.46,0,-1.25+t*.35,1.13+t*.12);c.stroke();}}
 else if(cls===2&&['basic','cone','rush'].includes(f.type)){const r=30+t*105;c.globalAlpha=a*.7;c.strokeStyle='#fff2cc';c.lineWidth=2;c.beginPath();c.ellipse(90,0,r,r*.7,0,-1.2,1.2);c.stroke();c.strokeStyle=color;c.lineWidth=5;c.beginPath();c.moveTo(-40,8);c.quadraticCurveTo(60,-18,160+t*25,0);c.stroke();}
 else if(f.type==='line'&&cls===1){const reach=f.range||470;c.globalAlpha=a*.7;const g=c.createLinearGradient(0,0,reach,0);g.addColorStop(0,'#74e8f400');g.addColorStop(.5,color);g.addColorStop(1,'#f0ffff');c.strokeStyle=g;c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.lineTo(reach,0);c.stroke();}
 c.restore();}
ensure(0);
root.DungeonArt={actor,effect,projectile,frame:(...a)=>root.DungeonActors.frame(...a),animationPhase:(...a)=>root.DungeonActors.animationPhase(...a),presentation:(...a)=>root.DungeonActors.presentation(...a),actors:ACTORS,cell,ensure,ensureSkills,hasActor,preloadAll,ready,readyAll:()=>root.DungeonActors.readyAll()&&ACTORS.every((_,i)=>pictures.has('skills'+i)),status:()=>({...root.DungeonActors.status(),effects:ACTORS.filter((_,i)=>pictures.has('skills'+i)).length,actorFrames:root.DungeonActors.status().actorFrames,skillFrames:192,actorDraws,effectDraws,failures:[...failed,...root.DungeonActors.status().failures],loading:loading.size+root.DungeonActors.status().pending})};
})(window);

/* Cutout rigs made from the game's existing artwork. No new character assets. */
(function(root){'use strict';
const cache=new Map(),TAU=Math.PI*2;
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const rigs=[
 {hip:[143,285],split:290,left:[[0,290],[138,284],[140,347],[64,496],[0,512]],right:[[139,288],[205,285],[256,512],[168,512],[165,382]],arms:[[[48,139],[100,126],[124,228],[153,235],[128,261],[61,218]],[[123,224],[139,132],[232,0],[256,0],[230,119],[170,225],[106,297],[83,295]]],pivots:[[100,147],[134,231]]},
 {hip:[145,291],split:301,left:[[0,300],[145,287],[145,341],[79,512],[31,512]],right:[[145,286],[190,284],[256,512],[211,512],[173,383]],arms:[[[98,145],[127,144],[125,206],[143,252],[112,272],[68,219]],[[0,436],[128,265],[232,0],[256,0],[189,174],[142,275],[0,460]]],pivots:[[121,157],[142,265]]},
 {hip:[143,287],split:302,left:[[0,302],[145,287],[150,337],[70,512],[0,512]],right:[[144,290],[205,286],[256,512],[175,512],[159,365]],arms:[[[0,147],[78,139],[94,211],[112,270],[45,288],[0,253]],[[193,146],[256,145],[256,268],[213,268],[180,222]]],pivots:[[77,153],[192,163]]},
 {hip:[146,282],split:293,left:[[0,293],[145,280],[154,325],[92,512],[0,512]],right:[[145,279],[197,287],[256,512],[185,512],[164,352]],arms:[[[0,71],[52,97],[85,136],[91,194],[61,239],[34,220],[30,140],[0,121]],[[182,150],[221,111],[256,93],[256,160],[224,169],[197,231],[170,214]]],pivots:[[83,155],[183,162]]}
];
function trace(c,points){c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.closePath();}
function build(image,index,enemy){const key=(enemy?'e':'p')+index;if(cache.has(key))return cache.get(key);const r=enemy?{hip:[128,308],split:310,left:rect(0,305,129,207),right:rect(128,305,128,207),arms:[rect(0,145,64,164),rect(195,145,61,164)],pivots:[[64,166],[195,166]]}:rigs[index];
 const pieces=[{name:'left',poly:r.left,pivot:r.hip},{name:'right',poly:r.right,pivot:r.hip},{name:'torso',poly:rect(0,0,256,r.split+4),pivot:r.hip},{name:'armL',poly:r.arms[0],pivot:r.pivots[0]},{name:'armR',poly:r.arms[1],pivot:r.pivots[1]}];
 for(const p of pieces){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;const c=canvas.getContext('2d');c.beginPath();trace(c,p.poly);c.clip();if(!enemy&&index===2){c.beginPath();trace(c,rect(0,0,256,512));trace(c,[[0,0],[70,0],[70,80],[35,124],[0,145]]);c.clip('evenodd');}if(p.name==='torso'){c.beginPath();trace(c,rect(0,0,256,512));for(const poly of r.arms)trace(c,poly);c.clip('evenodd');}else if(p.name==='left'||p.name==='right'){c.beginPath();trace(c,rect(0,0,256,512));for(const poly of r.arms)trace(c,poly);c.clip('evenodd');}c.drawImage(image,index*image.width/4,0,image.width/4,image.height,0,0,256,512);p.canvas=canvas;}
 const value={r,pieces};cache.set(key,value);return value;
}
function pose(p,time,enemy=false){const run=enemy?!!p.moving:p.action==='run',hurt=enemy?p.stun>0:p.hurt>0,attack=enemy?p.at>0:p.at>0&&!['run','idle','dash'].includes(p.action),duration=enemy?.9:(p.actionDuration||.45),q=attack?Math.max(0,Math.min(1,1-p.at/duration)):0,cycle=time*(enemy?10:15)+(p.id||0),stride=run?Math.sin(cycle):0,breath=Math.sin(time*3+(p.id||0));
 let body=run?.12:breath*.008,armL=-stride*.24,armR=stride*.27,left=stride*.29,right=-stride*.29,y=run?-Math.abs(Math.cos(cycle))*9:breath*2,stretch=1;
 if(attack){const wind=q<.24?q/.24:q<.58?1-(q-.24)/.34:-(1-q)/.42;const flip=p.combo%2===0?-1:1;body+=wind*.15*flip;armL+=wind*(p.cls===2?1.1:.65)*flip;armR+=wind*(p.cls===0?1.45:p.cls===1?1.05:.6)*flip;left-=.14;right+=.12;y-=Math.sin(q*Math.PI)*5;}
 if(p.action==='dash'&&p.at>0){body=.4;armL=-.5;armR=-.35;left=.5;right=-.48;y=12;}
 if(p.jump>0){const t=1-p.jump/.7;y-=Math.sin(t*Math.PI)*105;left=.26+Math.sin(t*Math.PI)*.45;right=-.25;armL=-.25;armR=.2;body=-.08;stretch=.98;}
 if(hurt){body=-.2;armL=-.45;armR=.4;left=-.18;right=.23;y+=5;}
 if(p.hp<=0){body=-1.35;left=.24;right=.1;armL=.7;armR=.4;y+=8;}
 return {body,armL,armR,left,right,y,stretch,state:p.hp<=0?'down':hurt?'hurt':p.jump>0?'jump':p.action==='dash'&&p.at>0?'dash':attack?'attack':run?'run':'idle',progress:q};
}
function draw(c,image,index,x,y,height,dir,p,time,enemy=false,alpha=1){if(!image)return;const rig=build(image,index,enemy),v=pose(p,time,enemy);c.save();c.translate(x,y+v.y*height/512);c.scale(dir*height/512,height/512);c.translate(-128,-512);c.globalAlpha*=alpha;c.translate(...rig.r.hip);c.rotate(v.body);c.scale(1,v.stretch);c.translate(-rig.r.hip[0],-rig.r.hip[1]);for(const part of rig.pieces){c.save();c.translate(...part.pivot);c.rotate(v[part.name]||0);c.translate(-part.pivot[0],-part.pivot[1]);c.drawImage(part.canvas,0,0);c.restore();}c.restore();}
root.DungeonMotion={draw,pose,rigCount:()=>cache.size};
})(window);

/* GPT-generated, complete animation cels and painted VFX. Original PNGs are bundled offline. */
(function(root){'use strict';
const ACTORS=[{"id":"kael","src":"art/generated/kael.png","reference":298.8,"frames":[[6,26,179,332,93.0,332],[202,26,179,332,95.0,332],[398,25,181,333,97.5,333],[604,31,182,327,90.0,327],[6,462,192,266,93.0,267],[198,452,198,271,99.0,277],[396,469,199,260,99.5,260],[596,466,195,262,98.0,263],[3,821,176,291,96.0,291],[198,886,190,225,99.0,226],[396,906,199,206,99.5,206],[607,846,176,266,87.0,266],[7,1317,182,193,92.0,193],[205,1247,187,254,92.0,263],[396,1190,183,313,99.5,320],[599,1231,188,272,95.0,279],[4,1733,184,194,95.0,194],[198,1598,198,227,99.0,227],[396,1616,196,276,99.5,276],[595,1698,192,229,99.0,229]]},{"id":"rin","src":"art/generated/rin.png","reference":244.8,"frames":[[71,12,179,254,69.0,255],[344,11,184,256,76.5,256],[617,8,182,256,84.5,259],[899,14,180,252,83.0,253],[28,326,240,212,112.0,212],[314,318,232,220,106.5,220],[598,311,221,203,103.5,227],[868,326,236,210,114.0,212],[38,582,210,228,102.0,235],[304,604,247,204,116.5,213],[572,611,270,198,129.5,206],[877,569,209,248,105.0,248],[42,914,226,182,98.0,182],[312,890,238,203,108.5,206],[590,841,222,251,111.5,255],[890,845,190,250,92.0,251],[34,1211,230,169,106.0,169],[326,1122,195,199,94.5,199],[592,1122,203,229,109.5,229],[861,1219,241,159,121.0,159]]},{"id":"bane","src":"art/generated/bane.png","reference":265.0,"frames":[[62,15,170,263,78.0,263],[339,13,170,265,81.5,265],[615,13,167,265,86.5,265],[882,13,171,265,100.0,265],[38,304,204,232,102.0,234],[329,300,199,227,91.5,238],[610,320,169,218,91.5,218],[889,303,191,222,93.0,235],[37,572,202,248,103.0,248],[310,567,216,253,110.5,253],[582,571,247,249,119.5,249],[875,564,192,256,107.0,256],[31,904,201,202,109.0,202],[308,899,214,206,112.5,207],[591,841,197,265,110.5,265],[861,929,213,173,121.0,177],[64,1214,151,175,76.0,175],[330,1122,170,210,90.5,210],[599,1134,183,219,102.5,219],[874,1217,175,172,108.0,172]]},{"id":"sera","src":"art/generated/sera.png","reference":266.5,"frames":[[56,9,183,267,84.0,267],[325,9,182,267,95.5,267],[594,10,182,266,107.5,266],[857,10,187,266,125.0,266],[25,309,214,243,115.0,243],[299,305,213,246,121.5,247],[578,308,214,244,123.5,244],[857,300,220,244,125.0,252],[37,570,201,261,103.0,261],[299,571,245,260,121.5,260],[570,570,208,261,131.5,261],[842,570,219,261,140.0,261],[46,853,192,258,94.0,258],[300,852,222,259,120.5,259],[562,852,260,259,139.5,259],[850,851,203,260,132.0,260],[44,1178,174,216,96.0,216],[317,1122,199,216,103.5,216],[580,1123,214,260,121.5,260],[857,1161,198,233,125.0,233]]}],TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pictures=new Map(),failures=[];
let actorDraws=0,effectDraws=0;
function load(key,src){const im=new Image();im.onload=()=>pictures.set(key,im);im.onerror=()=>failures.push(src);im.src=src;}
ACTORS.forEach((a,i)=>load('actor'+i,a.src));for(const key of ['attack','area','support'])load(key,'art/generated/'+key+'.png');
function frame(p,time){
 let row=0,col=((Math.floor(time*3)%4)+4)%4,state='idle',rise=0,tilt=0,offset=0;
 if(p.hp<=0){row=4;col=3;state='down';tilt=-1.35;}
 else if(p.jump>0){const t=clamp(1-p.jump/.7,0,1);row=4;col=t<.1?0:t<.53?1:t<.9?2:3;state='jump';rise=-Math.sin(t*Math.PI)*.34;}
 else if(p.action==='dash'&&p.at>0){row=1;col=1+((p.at<.11)?2:0);state='dash';tilt=.09;}
 else if(p.at>0&&!['idle','run'].includes(p.action)){const t=clamp(1-p.at/(p.actionDuration||.45),0,1);row=p.action==='basic'?2:3;col=t<.12?0:t<.43?1:t<.78?2:3;state='attack';offset=Math.sin(t*Math.PI)*(p.cls===2?8:4);}
 else if(p.landing>0){row=4;col=3;state='landing';}
 else if(p.action==='run'){row=1;const cycle=Number.isFinite(p.gait)?p.gait:time*12;col=Math.floor(((cycle/TAU)%1+1)%1*4);state='run';}
 if(p.hurt>0){tilt-=.07;offset-=Math.min(1,p.hurt/.28)*5;}
 return {row,col,index:row*4+col,state,rise,tilt,offset};
}
function actor(c,cls,x,y,height,dir,p,time,alpha=1){
 const im=pictures.get('actor'+cls);if(!im)return false;const a=ACTORS[cls],f=frame(p,time),r=a.frames[f.index],scale=height/a.reference;
 c.save();c.translate(x+f.offset*dir,y+f.rise*height);c.scale(dir,1);c.rotate(f.tilt);c.globalAlpha*=alpha*(p.hp<=0?.55:1);c.imageSmoothingEnabled=true;
 c.drawImage(im,r[0],r[1],r[2],r[3],-r[4]*scale,-r[5]*scale,r[2]*scale,r[3]*scale);c.restore();actorDraws++;return true;
}
function cell(c,key,row,col,x,y,w,h,options={}){
 const im=pictures.get(key);if(!im)return false;const sx=Math.round(im.width*col/4),sy=Math.round(im.height*row/4),sw=Math.round(im.width*(col+1)/4)-sx,sh=Math.round(im.height*(row+1)/4)-sy;
 c.save();c.translate(x,y);c.rotate(options.angle||0);c.scale(options.dir||1,1);c.globalCompositeOperation='screen';c.globalAlpha*=options.alpha??1;
 c.drawImage(im,sx,sy,sw,sh,-w*(options.anchorX??.5),-h*(options.anchorY??.5),w,h);c.restore();effectDraws++;return true;
}
function classOf(f){if(Number.isInteger(f.cls)&&f.cls>=0&&f.cls<4)return f.cls;const index=root.Rift?.CLASSES.findIndex(p=>p.color===f.color);return index>=0?index:0;}
function effect(c,f,camera,time){
 if(['text','windup'].includes(f.type))return false;
 const cls=classOf(f),life=f.duration||(f.type==='ultimate'?1.15:f.type==='muzzle'?.18:.55),t=clamp(1-f.life/life,0,.999),col=Math.min(3,Math.floor(t*4)),dir=f.dir||1,x=f.x-camera,y=f.y,range=f.range||160,alpha=Math.min(1,f.life/.1),o={dir,alpha};
 if(['basic','cone','lift','line'].includes(f.type)){
  const w=Math.min(560,(f.type==='basic'?240:range*.85+180)),h=f.type==='line'?w*.45:w*.7;
  if(cls===1&&f.type==='line'&&f.index===4)cell(c,'area',1,col,x+dir*Math.min(420,range*.6),y-125,440,370,{alpha:alpha*.85});
  return cell(c,'attack',cls,col,x+dir*w*.25,y-[125,165,190,190][cls],w,h,{...o,angle:f.type==='lift'?-dir*.8:f.type==='cone'&&f.combo%2===0?dir*.12:0});
 }
 if(f.type==='chain'&&f.points){for(const pt of f.points.slice(1))cell(c,'area',3,col,pt.x-camera,pt.y-95,240,240,{alpha:alpha*.8});return false;}
 if(['circle','pull','ultimate'].includes(f.type)){
  const w=Math.min(f.type==='ultimate'?880:680,range*1.1+180),h=w*(cls===0?.85:.72);
  const drawn=cell(c,'area',cls,col,x,y-h*.32,w,h,{alpha,angle:f.type==='pull'&&cls===3?t*.35:0});
  if(f.type==='ultimate'&&drawn){for(const side of [-1,1])cell(c,'area',cls,(col+1)%4,x+side*w*.33,y-h*.1,w*.52,h*.58,{alpha:alpha*.5});}
  return drawn;
 }
 if(['shield','heal'].includes(f.type))return cell(c,'support',f.type==='heal'?3:Math.min(2,cls),col,x,y-135,300,350,{alpha});
 if(f.type==='muzzle')return cell(c,'attack',f.caster?3:cls,0,x,y-(f.caster?135:[125,165,190,190][cls]),110,95,{...o,alpha:alpha*.9});
 if(['hit','hurt','death','impact'].includes(f.type)){
  const w=f.type==='impact'?260:f.type==='death'?190:130;
  return cell(c,'attack',cls,t<.45?2:3,x,y-85,w,w*.8,{...o,alpha:alpha*(f.type==='hurt'?.6:1)});
 }
 if(['rush','dash'].includes(f.type))return cell(c,'attack',cls,Math.min(2,col),x+dir*25,y-105,340,220,{...o,alpha:alpha*.55});
 return false;
}
function projectile(c,q,x,y,time){
 const a=Math.atan2(q.vy,q.vx);
 if(q.team==='player'&&q.kind==='bullet')return cell(c,'attack',3,1,x,y-190,q.index===1?190:145,q.index===1?95:76,{angle:a,anchorX:.77,alpha:.95});
 return cell(c,'area',3,Math.floor(time*8)%3,x,y-(q.team==='enemy'?135:190),q.team==='enemy'?92:110,q.team==='enemy'?92:110,{angle:a,alpha:q.team==='enemy'?.8:.95});
}
root.DungeonArt={actor,effect,projectile,frame,actors:ACTORS,cell,ready:()=>pictures.size===7,status:()=>({actors:ACTORS.filter((_,i)=>pictures.has('actor'+i)).length,effects:['attack','area','support'].filter(n=>pictures.has(n)).length,actorDraws,effectDraws,failures:[...failures]})};
})(window);

/* Host-authoritative, equalized 2-4 player free-for-all. No PvE rewards. */
(function(root){'use strict';
const E=root.Rift,ROUND_SECONDS=90,MAX_ROUNDS=3;
function active(s){return s.players.filter(p=>!p.retired);}
function clearActions(p){Object.assign(p,{pending:null,bufferIndex:-1,bufferTime:0,rushTime:0,dashTime:0,at:0,jump:0,hurt:0,poseHold:0,vx:0,vy:0,moveBlend:0,action:'idle'});}
function resetRound(s){const a=s.arena,list=active(s).sort((p,q)=>p.id-q.id),positions=list.length===2?[600,1800]:list.length===3?[450,1200,1950]:[420,940,1460,1980];
 a.stage='countdown';a.countdown=3;a.remaining=ROUND_SECONDS;a.roundWinner=null;s.projectiles=[];s.telegraphs=[];s.fx=[];
 for(const [i,p]of list.entries()){const slot=(i+a.round-1)%list.length;clearActions(p);Object.assign(p,{x:positions[slot],y:535+(slot%2)*80,dir:slot<list.length/2?1:-1,hp:p.maxHp,mp:100,rage:0,shield:0,buff:0,inv:.65,cd:Array(7).fill(0),dodgeCd:0,potionCd:0,pvpStun:0,pvpCc:0,potionHeld:false,jumpHeld:false,down:0,gait:0,basicChain:0,comboStage:0});}
}
function start(s){if(s.players.length<2||s.players.length>4||s.players.some(p=>p.level<30)){s.phase='ready';return false;}
 const participants=s.players.map(p=>({id:p.id,name:p.name,cls:p.cls,level:p.level,arenaLoadout:p.arenaLoadout}));
 s.players=participants.map(old=>{const p=E.player(old.id,old.name,old.cls,30,{ranks:[1,1,1,1,1,1],advanced:true,awakened:true});p.loadout=old.arenaLoadout||[1,2,3,4,5,6];p.sourceLevel=old.level;p.maxHp=Math.round(1100*E.CLASSES[p.cls].hp/270);p.hp=p.maxHp;p.damage=1.6;p.focus=0;p.aimHeight=165;p.height=260;p.retired=false;return p;});
 Object.assign(s,{phase:'playing',time:0,tick:0,nextId:1,score:0,gold:0,combatXP:0,enemies:[],telegraphs:[],projectiles:[],fx:[],room:1,roomCount:1,partySize:s.players.length,gate:false});
 s.arena={stage:'countdown',round:1,maxRounds:MAX_ROUNDS,remaining:ROUND_SECONDS,countdown:3,participants,wins:Object.fromEntries(participants.map(p=>[p.id,0])),damage:Object.fromEntries(participants.map(p=>[p.id,0])),winnerId:null,roundWinner:null,canceled:false,reason:''};resetRound(s);return true;
}
function finish(s,winnerId,reason){const a=s.arena;if(!a||a.stage==='finished')return;a.stage='finished';a.winnerId=winnerId;a.reason=reason;s.phase='victory';s.projectiles=[];s.telegraphs=[];for(const p of s.players)clearActions(p);}
function endRound(s,winnerId,reason){const a=s.arena;if(a.stage!=='live')return;a.roundWinner=winnerId;a.reason=reason;if(winnerId>=0)a.wins[winnerId]=(a.wins[winnerId]||0)+1;for(const p of s.players)clearActions(p);s.projectiles=[];s.telegraphs=[];
 if(winnerId>=0&&a.wins[winnerId]>=2){finish(s,winnerId,'2라운드 선승');return;}
 if(a.round>=MAX_ROUNDS){const scores=active(s).map(p=>({id:p.id,wins:a.wins[p.id]||0})).sort((p,q)=>q.wins-p.wins||p.id-q.id);finish(s,scores.length&&(!scores[1]||scores[0].wins>scores[1].wins)?scores[0].id:-1,'최종 라운드 종료');return;}
 a.stage='intermission';a.countdown=4;
}
function step(s,inputs,dt){const a=s.arena;if(!a||a.stage==='finished')return;s.time+=dt;const list=active(s);if(list.length<2){finish(s,list[0]?.id??-1,'다른 참가자 이탈');return;}
 if(a.stage==='countdown'||a.stage==='intermission'){a.countdown=Math.max(0,a.countdown-dt);if(a.countdown<=0){if(a.stage==='intermission'){a.round++;s.room=a.round;resetRound(s);}else a.stage='live';}return;}
 a.remaining=Math.max(0,a.remaining-dt);
 for(const p of s.players){p.pvpStun=Math.max(0,(p.pvpStun||0)-dt);p.pvpCc=Math.max(0,(p.pvpCc||0)-dt);const v=inputs[p.id]||{},input=p.pvpStun>0?{x:0,y:0,attack:false,skill:0,jump:false,dash:false,potion:false}:{...v,potion:false};if(p.retired)continue;E.updatePlayer(s,p,input,dt);}
 s.projectiles=s.projectiles.filter(q=>q.team!=='player'||s.players.some(p=>p.id===q.owner&&p.hp>0&&!p.retired));E.stepProjectiles(s,dt);
 const alive=list.filter(p=>p.hp>0);if(alive.length<=1){endRound(s,alive[0]?.id??-1,'마지막 생존자');return;}
 if(a.remaining<=0){const order=list.map(p=>({id:p.id,ratio:p.hp/p.maxHp})).sort((p,q)=>q.ratio-p.ratio||p.id-q.id);endRound(s,order[0].ratio-order[1].ratio>.005?order[0].id:-1,'시간 종료 · 남은 HP 비율');}
}
function damage(s,source,target,amount,kind,dir){if(s.arena?.stage!=='live'||source.id===target.id||source.hp<=0||source.retired||target.hp<=0||target.retired)return false;
 const sameStrike=target.lastPvpHitTick===s.tick&&target.lastPvpHitOwner===source.id;if(target.inv>0&&!sameStrike||target.jump>.50)return false;
 let value=Math.max(1,Math.round(amount*source.damage*.80*(source.buff>0?1.12:1))),absorbed=Math.min(target.shield||0,value);target.shield=Math.max(0,(target.shield||0)-absorbed);value-=absorbed;
 const dealt=Math.min(target.hp,value);target.hp=Math.max(0,target.hp-value);target.inv=Math.max(target.inv,.09);target.lastPvpHitTick=s.tick;target.lastPvpHitOwner=source.id;source.rage=Math.min(100,source.rage+(kind==='ultimate'?0:4));s.arena.damage[source.id]=(s.arena.damage[source.id]||0)+dealt;
 if(dealt>0){target.hurt=.18;target.pending=null;target.rushTime=0;target.bufferTime=0;target.bufferIndex=-1;target.at=Math.min(target.at,.075);if(target.pvpCc<=0){target.pvpStun=kind==='basic'?.055:.16;target.pvpCc=.7;}target.x=E.clamp(target.x+dir*(kind==='basic'?3:10),60,E.WORLD-60);E.fx(s,'text',target.x,target.y-150,{text:String(dealt),color:'#fff3d4',numberKind:'damage',owner:source.id});E.fx(s,'text',target.x,target.y-180,{text:'−'+dealt,color:'#ff8c7d',numberKind:'received',recipient:target.id});}
 E.fx(s,'hit',target.x,target.y-65,{cls:source.cls,index:source.skillIndex,owner:source.id,color:E.CLASSES[source.cls].color,dir});if(target.hp<=0){target.down=1;target.pending=null;source.kills++;E.fx(s,'death',target.x,target.y-65,{owner:source.id,color:E.CLASSES[source.cls].color});}return dealt>0;
}
function forfeit(s,id){const p=s.players.find(p=>p.id===id);if(!p||p.retired||s.arena?.stage==='finished')return false;p.retired=true;p.hp=0;clearActions(p);s.projectiles=s.projectiles.filter(q=>q.owner!==id);const list=active(s);if(list.length<=1)finish(s,list[0]?.id??-1,'다른 참가자 이탈');return true;}
function cancel(s){if(!s.arena)return;s.arena.canceled=true;finish(s,-1,'연결 종료로 대전 취소');}
root.RiftArena={start,step,damage,forfeit,cancel,ROUND_SECONDS,MAX_ROUNDS};
})(typeof window==='undefined'?globalThis:window);

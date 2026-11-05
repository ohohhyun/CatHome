const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={console};vm.createContext(context);vm.runInContext(fs.readFileSync('app/src/main/assets/rpg.js','utf8'),context);vm.runInContext(fs.readFileSync('app/src/main/assets/engine.js','utf8'),context);const E=context.Rift;
function arena(cls=0){const s=E.create();s.players=[E.player(0,'테스터',cls,60,{ranks:[1,1,1,1,1,1],advanced:true,awakened:true})];E.start(s);s.enemies=[{id:99,type:'knight',x:410,y:570,hp:10000,maxHp:10000,dir:-1,cd:10,stun:0,at:0}];return s;}
function tick(s,n=1,input={}){for(let i=0;i<n;i++)E.step(s,{0:input},1/60);}
assert.equal(E.CLASSES.length,4);assert.equal(E.DUNGEONS.length,24);assert.equal(new Set(E.CLASSES.flatMap(c=>c.skills.map(s=>s.name))).size,24);
for(let cls=0;cls<4;cls++){
 const s=arena(cls),p=s.players[0];assert.equal(p.hp,p.maxHp);assert.equal(p.cd.length,7);
 let hp=s.enemies[0].hp;assert(E.attack(s,p,0));assert(s.enemies[0].hp<hp);hp=s.enemies[0].hp;assert.equal(E.attack(s,p,0),false);assert.equal(s.enemies[0].hp,hp);
 for(let sk=1;sk<=6;sk++){p.mp=100;p.rage=100;p.at=0;p.cd.fill(0);p.x=330;s.enemies[0].x=410;let before=s.enemies[0].hp;assert(E.attack(s,p,sk),'class '+cls+' skill '+sk);if(sk===5){if(cls===3)assert(p.hp>0);else assert(p.shield>0);}else assert(s.enemies[0].hp<before,'damaging skill hits');assert(p.mp>=0&&p.mp<=100);assert(p.rage>=0&&p.rage<=100);}
 p.at=0;p.mp=0;p.cd.fill(0);assert.equal(E.attack(s,p,1),false);p.rage=99;assert.equal(E.attack(s,p,6),false);p.hp=0;p.mp=100;assert.equal(E.attack(s,p,0),false);
}
// Telegraphed hits respect jump, dodge invulnerability, shields and deaths.
for(const type of ['none','inv','jump','shield']){let s=arena(),p=s.players[0];p.inv=0;if(type==='inv')p.inv=1;if(type==='jump')p.jump=.6;if(type==='shield')p.shield=100;const hp=p.hp;s.telegraphs=[{x:p.x,y:p.y,r:150,life:.01,damage:30}];tick(s);assert.equal(p.hp,type==='none'?hp-30:hp,type);}
{const s=arena(),p=s.players[0];p.inv=0;tick(s,120,{jump:true});assert.equal(p.jump,0,'holding jump does not grant permanent invulnerability');tick(s,1,{jump:false});tick(s,1,{jump:true});assert(p.jump>0);}
{const s=arena(),p=s.players[0];p.inv=0;p.x=100;p.y=480;tick(s,120,{x:-1,y:-1});assert.equal(p.x,60);assert.equal(p.y,475);tick(s,1,{dash:true});assert(p.inv>0);assert(p.dodgeCd>0);}
// Every dungeon progresses through five rooms, revives downed allies, and completes.
for(let d=0;d<24;d++)for(let diff=0;diff<4;diff++){
 const s=E.create(d,diff);s.players=[E.player(0,'검사',0),E.player(1,'마도사',3)];E.start(s);s.players[1].hp=0;
 for(let room=1;room<=5;room++){assert.equal(s.room,room);if(room===5)assert(s.enemies.some(e=>e.type==='boss'));s.enemies=[];s.players[0].x=2280;tick(s,140);if(room<5){assert.equal(s.phase,'playing');assert(s.players[1].hp>0,'next room revives ally');}}
 assert.equal(s.phase,'victory');assert(s.gold>=300*(Math.floor(d/3)+1)*(diff+1));
}
{const s=arena();s.players[0].hp=0;tick(s);assert.equal(s.phase,'defeat');const before=s.time;tick(s,30);assert.equal(s.time,before);}
// Identical inputs have identical authoritative outcomes independent of renderer.
{const a=arena(2),b=arena(2);for(let i=0;i<600;i++){const v={x:i%120<60?1:-1,attack:i%3===0,skill:i%70===0?1:0};tick(a,1,v);tick(b,1,v);}assert.equal(JSON.stringify(a),JSON.stringify(b));assert(a.fx.length<=100);}
{const p=E.player(0,'<script>',99,999,{vit:999,atk:999,focus:999});assert.equal(p.cls,3);assert.equal(p.level,60);assert(!p.name.includes('<'));assert(p.focus<=20);}
for(const file of ['index.html','rpg.js','engine.js','app.js','town.js','game.css','town.css','art/fighters.webp','art/enemies.webp','art/sanctum.webp'])assert(fs.statSync('app/src/main/assets/'+file).size>100);
const manifest=fs.readFileSync('app/src/main/AndroidManifest.xml','utf8');assert(manifest.includes('android.permission.INTERNET'));assert(manifest.includes('sensorLandscape'));
// Party count and difficulty affect population, both HP pools, aggression and rewards.
for(let diff=0;diff<4;diff++){
 let previous=0;for(let n=1;n<=4;n++){const s=E.create(0,diff);s.players=Array.from({length:n},(_,i)=>E.player(i,'동료'+i));E.start(s);assert(s.enemies.length>previous);previous=s.enemies.length;const b=E.balance(n,diff);assert(b.bossHp>=b.normalHp);assert(b.reward>=1);if(n>1)assert(b.bossAdds>=2);}
}
{const one=E.balance(1,0),four=E.balance(4,3);assert(four.countBonus>one.countBonus);assert(four.cooldown<one.cooldown);assert(four.damage>one.damage);}
{const s=E.create();s.players=[0,1,2,3].map(i=>E.player(i,'동료'));E.start(s);const before=s.enemies.length,hp=s.enemies[0].maxHp;s.players=s.players.slice(0,1);tick(s);assert(s.enemies.length<before);assert(s.enemies[0].maxHp<hp);}
{const s=arena();s.enemies=[];tick(s,100);assert(s.gate);assert.equal(s.room,1);s.players[0].x=2280;tick(s);assert.equal(s.room,2);}
{const s=E.create(23,0,{kind:'raid'});s.players=[E.player(0,'원정대')];E.start(s);assert(s.enemies.some(e=>e.type==='boss'));assert.equal(s.roomCount,5);const r=E.create(23,0,{kind:'rift',tier:20});assert.equal(r.roomCount,3);}
console.log('PASS: 4 classes / 24 skills, cooldowns and resources, telegraphs and defenses, jump edge, movement bounds, all 96 dungeon/difficulty campaigns, co-op revival, deterministic simulation, bounded effects, bundled assets.');

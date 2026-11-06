const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const c={window:{}};c.window=c;vm.createContext(c);for(const file of ['rpg.js','engine.js','world.js','motion.js'])vm.runInContext(fs.readFileSync('app/src/main/assets/'+file,'utf8'),c);const E=c.Rift,W=c.DungeonWorld,M=c.DungeonMotion;
// The same centred view applies at the entrance, through the map and at the exit.
for(const world of [2400,3000])for(const x of [60,280,360,1000,world-60]){
 let camera=W.cameraAt(x,world);assert.equal(x-camera,800);
 let px=x;for(const dir of [-1,1]){for(let i=0;i<180;i++){px=Math.max(60,Math.min(world-60,px+dir*500/60));camera=W.follow(camera,px,world,1/60);assert(Math.abs(px-camera-800)<29,'hero stays near centre even on reversal');}}
}
const town={world:3000,fx:[],nextId:1},p=E.player(0,'마을',0);p.x=360;p.y=580;let camera=W.cameraAt(p.x,3000);for(let i=0;i<120;i++){E.move(town,p,{x:1},1/60);camera=W.follow(camera,p.x,3000,1/60);}assert(p.x>1170,'faster travel');assert(Math.abs(p.x-camera-800)<22);const layers=W.layers(camera);assert.equal(layers.ground,-camera);assert.equal(layers.distant,-camera*.28);assert(Math.abs(layers.ground)>Math.abs(layers.distant)*3);
const before=p.x;E.move(town,p,{x:1,jump:true},1/60);assert(p.x>before&&p.jump>0);E.move(town,p,{x:-1,dash:true},1/60);assert.equal(p.dir,-1);assert(p.inv>0&&p.dodgeCd>0);for(let i=0;i<1000;i++)E.move(town,p,{x:1},1/60);assert.equal(p.x,2940);assert(!Object.hasOwn(town,'room'));for(let i=0;i<200;i++)camera=W.follow(camera,p.x,3000,1/60);assert(Math.abs(p.x-camera-800)<.01,'exit stays central');for(let i=0;i<1000;i++)E.move(town,p,{x:-1},1/60);assert.equal(p.x,60);
for(let cls=0;cls<4;cls++){
 const state={world:3000,fx:[],nextId:1},hero=E.player(0,'속도',cls);hero.x=800;const start=hero.x;for(let i=0;i<60;i++)E.move(state,hero,{x:1},1/60);assert(hero.x-start>E.CLASSES[cls].speed*.95,'responsive acceleration');for(let i=0;i<12;i++)E.move(state,hero,{},1/60);assert(Math.abs(hero.vx)<1,'no long slide on release');
 for(let i=0;i<100;i++){const v=M.pose({...hero,action:'run',moveBlend:1,gait:i/100*Math.PI*2},0);assert(Object.values(v).filter(x=>typeof x==='number').every(Number.isFinite));assert(v.feet.some(f=>f.stance),'at least one foot is planted');for(const f of v.feet)if(f.stance)assert.equal(f.y,500);}
 const a=M.pose({...hero,action:'run',moveBlend:1,gait:.2},0),b=M.pose({...hero,action:'run',moveBlend:1,gait:2},0);assert(Math.abs(a.left-b.left)>.1);assert(Math.abs(a.armL-b.armL)>.1);
}
// Dodge covers the same distance at all common tick rates without a teleport.
for(const hz of [30,60,120]){const state={world:3000,fx:[],nextId:1},hero=E.player(0,'회피');hero.x=800;let last=hero.x;for(let i=0;i<Math.ceil(.22*hz);i++){E.move(state,hero,{dash:i===0,x:1},1/hz);assert(hero.x-last<=950*1.2/hz+.01,'continuous displacement');last=hero.x;}assert(Math.abs(hero.x-1009)<.1,'consistent dash distance');assert(hero.inv>0);}
{const state={world:3000,fx:[],nextId:1},hero=E.player(0,'착지');E.move(state,hero,{jump:true},1/60);for(let i=0;i<43;i++)E.move(state,hero,{},1/60);assert.equal(hero.jump,0);assert(hero.landing>0);}
console.log('PASS: centred town/dungeon camera including both map edges and direction changes; faster four-class movement, quick stop, distance-driven planted-foot gait, continuous tick-rate-independent dodge and jump landing.');

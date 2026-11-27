const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');const ctx={Image:class{set src(v){}},document:{createElement:()=>({getContext:()=>({drawImage(){}})})}};ctx.window=ctx;vm.createContext(ctx);for(const n of ['rpg','engine','actors'])vm.runInContext(fs.readFileSync('app/src/main/assets/'+n+'.js','utf8'),ctx);const E=ctx.Rift,A=ctx.DungeonActors;
for(let cls=0;cls<6;cls++){
 for(const strength of [.2,.55,1]){const pair=[];for(const dir of [-1,1]){const p=E.player(0,'모험가',cls);p.x=1200;p.y=550;const s={world:3000,fx:[],nextId:1};for(let tick=0;tick<120;tick++)E.move(s,p,{x:dir*strength},1/60);pair.push(p);}assert(Math.abs(Math.abs(pair[0].x-1200)-Math.abs(pair[1].x-1200))<1e-8);assert(Math.abs(A.runPhase(pair[0])-A.runPhase(pair[1]))<1e-7);assert.equal(A.frame(pair[0],1).index,A.frame(pair[1],1).index);}
 const p=E.player(0,'모험가',cls);p.action='run';p.hp=100;const stride=A.strideLength(p),hz=E.CLASSES[cls].speed/stride;assert(hz>1.1&&hz<2.1);for(let i=0;i<8;i++){p.gait=A.actors[cls].run.runTimes[i]*stride/210*Math.PI*2;assert.equal(A.frame(p,0).index,i);}
 for(const epsilon of [-1e-12,1e-12]){p.gait=(stride+epsilon)/210*Math.PI*2;assert.equal(A.frame(p,0).index,0,'same contact pose at floating-point cycle boundary');}
 Object.assign(p,{dir:-1,vx:200,vy:0});assert.equal(A.presentation(p,0).dir,1,'presentation faces actual travel through a reversal');assert.equal(A.locomotion(p,null,1).dir,1);Object.assign(p,{action:'basic',at:.3});assert.equal(A.presentation(p,0).dir,-1,'attacks retain input aiming');assert.equal(A.locomotion(p,null,1).dir,-1);
}
console.log('PASS: all six classes at three analog strengths have equal left/right distance, phase and frame; height-adjusted cadence, stable cycle contacts and no backward sliding through turns, with attack direction preserved.');
// The old parity check bypassed touch input and turns. Cover both explicitly.
for(const hz of [30,60,120])for(let cls=0;cls<6;cls++){
 for(const throwDistance of [.6,.8,1])for(const drift of [-.12,0,.12]){
  const distances=[];for(const dir of [-1,1]){
   const input=E.stickInput(dir*throwDistance,drift),p=E.player(0,'터치검수',cls),s={world:10000,fx:[],nextId:1};p.x=5000;
   assert.equal(input.x,dir);assert.equal(input.y,0,'small vertical thumb drift cannot slow horizontal running');
   for(let tick=0;tick<hz;tick++)E.move(s,p,input,1/hz);
   distances.push(Math.abs(p.x-5000));assert(Math.abs(p.vx-dir*E.CLASSES[cls].speed)<.001);
   const gait=p.gait;E.move(s,p,{x:-dir},1/hz);assert(Math.sign(p.vx)===-dir,'a turn must immediately travel in the new direction');assert(p.gait>gait,'turns preserve continuous gait without rewinding or resetting a leg');
  }assert(Math.abs(distances[0]-distances[1])<1e-8,'touch running has identical left/right distance');
 }
}
assert.deepEqual(JSON.parse(JSON.stringify(E.stickInput(.08,-.03))),{x:0,y:0},'resting thumb does not shuffle feet');
assert(E.stickInput(.3,0).x>0&&E.stickInput(.3,0).x<1,'precise slow movement remains available');
vm.runInContext(fs.readFileSync('app/src/main/assets/premium-art-data.js','utf8'),ctx);
const review=JSON.parse(fs.readFileSync('art-source/run-timing-review.json')),crypto=require('node:crypto');assert.equal(review.banks.length,36);
for(const record of review.banks){
 const bank=A.actors.find(a=>a.id===record.id)?.run||ctx.DungeonPremiumArtData.costumes[record.id].banks.run;
 assert.deepEqual(Array.from(bank.runTimes),record.times);assert.equal(bank.runTimes[0],0);assert.equal(bank.runTimes[4],.5,'both foot contacts remain half a stride apart');
 for(let i=0;i<8;i++)assert.equal(A.runIndex(bank,bank.runTimes[i]),i,'each complete source pose stays reachable');
 for(const [src,sha]of Object.entries(record.sourceSha256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('app/src/main/assets/'+src)).digest('hex'),sha,'measured source image preserved');
 const dwell=Array(8).fill(0);for(let tick=0;tick<480;tick++){const index=A.runIndex(bank,(tick+.25)/480);assert(index>=0&&index<8);dwell[index]++;}assert.deepEqual(dwell,Array(8).fill(60),'every run pose has the same hold duration; no short/long galloping beat');
}
console.log('PASS: real stick normalization, all six classes / 30–120Hz / three throws / thumb drift / both turns, immediate reversed travel with continuous gait; measured timing and unmodified full-body sources for all 36 run banks.');
// Render extrapolation can move slightly behind the previous visual sample when a LAN snapshot arrives.
for(let cls=0;cls<6;cls++){
 const p=E.player(88000+cls,'보간 검수',cls),top=E.CLASSES[cls].speed;p.action='run';p.vx=top*.35;p.gait=1;A.runPhase(p,'walk');p.vx=top;p.gait=1.5;const phase=A.runPhase(p,'run');p.gait=1.49;const corrected=A.runPhase(p,'run'),error=Math.abs(((corrected-phase+.5)%1+1)%1-.5);assert(error<.015,'small snapshot correction cannot reset a blended walk/run stride');
 p.gait=0;assert.equal(A.runPhase(p,'run'),0,'new scene/spawn starts at a clean contact phase');
}
for(let cls=0;cls<6;cls++){
 const p=E.player(89000+cls,'걷기 경계',cls),top=E.CLASSES[cls].speed;p.action='run';p.vx=top*.35;p.gait=1;A.frame(p,0);const banks=[];for(let n=0;n<30;n++){p.vx=top*(n%2?.54:.56);p.gait+=.05;banks.push(A.frame(p,n/60).bank);}assert(banks.every(k=>k==='walk'),'thumb noise must not alternate entire walk/run models');p.vx=top;assert.equal(A.frame(p,1).bank,'run');
}
console.log('PASS: small LAN visual corrections preserve continuous gait, scene resets remain clean, and analog threshold noise never alternates whole walking/running models.');

const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root={};root.window=root;vm.createContext(root);vm.runInContext(fs.readFileSync('app/src/main/assets/rpg.js','utf8'),root);const R=root.RiftRPG;
let save=R.sanitize(R.fresh());const c=save.chars[0],originalIds=c.items.map(it=>it.id);c.xp=R.xpAt(60);save.gold=100000;
for(const slot of R.SLOTS){const id=c.equipped[slot];assert(R.unequip(save,0,id).ok);assert(!(slot in c.equipped));assert(!R.unequip(save,0,id).ok);assert(c.items.some(it=>it.id===id));}
assert.equal(Object.keys(R.sanitize(JSON.parse(JSON.stringify(save))).chars[0].equipped).length,0,'empty equipment slots survive reload without auto-equipping');assert.deepEqual(c.items.map(it=>it.id),originalIds);
for(const it of c.items){assert(R.equip(save,0,it.id).ok);assert.equal(c.equipped[R.SLOTS[it.slot]],it.id);}
for(const it of c.items){it.rarity=3;it.set=0;it.plus=3;}
const replacement={id:save.nextId++,owner:0,slot:5,level:60,rarity:2,plus:8,set:0,locked:false};c.items.push(replacement);const before=JSON.stringify(save),comparison=R.compareEquipment(save,0,replacement.id),oldId=c.equipped.ring,profile=R.profile(save,0),power=R.power(save,0);assert.equal(JSON.stringify(save),before,'inspection cannot change saved gear, order or revision');assert.equal(comparison.current.id,oldId);assert.equal(comparison.before.setCount,6);assert.equal(comparison.after.setCount,5);assert.equal(comparison.delta.focus,comparison.after.gearFocus-profile.gearFocus,'comparison includes lost six-piece set bonus');
assert(R.equip(save,0,replacement.id).ok);assert.equal(c.equipped.ring,replacement.id);assert(c.items.some(it=>it.id===oldId),'replaced item stays in the bag');for(const k of ['atk','hp','focus'])assert.equal(comparison.delta[k],R.profile(save,0)[{atk:'gearAtk',hp:'gearHp',focus:'gearFocus'}[k]]-profile[{atk:'gearAtk',hp:'gearHp',focus:'gearFocus'}[k]]);assert.equal(comparison.delta.power,R.power(save,0)-power);assert.equal(comparison.beforePower,power);assert.equal(comparison.afterPower,R.power(save,0));
assert(!R.sellGear(save,0,replacement.id).ok);assert(!R.dismantle(save,0,replacement.id).ok);R.unequip(save,0,replacement.id);replacement.locked=true;assert(!R.sellGear(save,0,replacement.id).ok);replacement.locked=false;const gold=save.gold,sale=R.salePrice(replacement);assert(R.sellGear(save,0,replacement.id).ok);assert.equal(save.gold,gold+sale);assert(!c.items.some(it=>it.id===replacement.id));assert(!R.sellGear(save,0,replacement.id).ok,'cannot sell twice');
for(let slot=0;slot<6;slot++)for(let rarity=0;rarity<2;rarity++){const funds=save.gold,ids={...c.equipped},result=R.buyGear(save,0,slot,rarity);assert(result.ok);assert.equal(result.item.slot,slot);assert.equal(result.item.rarity,rarity);assert.equal(result.item.level,60);assert.equal(save.gold,funds-R.shopPrice(60,rarity));assert.equal(JSON.stringify(c.equipped),JSON.stringify(ids),'purchasing does not silently equip');assert(R.salePrice(result.item)<R.shopPrice(60,rarity));}
for(const [slot,rarity]of [[-1,0],[6,0],[1,4],[1,NaN],[1.5,0]]){const old=JSON.stringify(save);assert(!R.buyGear(save,0,slot,rarity).ok);assert.equal(JSON.stringify(save),old);}
save.gold=0;const count=c.items.length;assert(!R.buyGear(save,0,0,0).ok);assert.equal(c.items.length,count);save.gold=1e6;while(c.items.length<200)c.items.push({...c.items[0],id:save.nextId++});assert(!R.buyGear(save,0,0,0).ok);assert.equal(c.items.length,200);
const low=R.sanitize(R.fresh()),item=low.chars[0].items[0];item.level=60;const lowBefore=JSON.stringify(low);assert(!R.equip(low,0,item.id).ok);assert.equal(JSON.stringify(low),lowBefore);
console.log('PASS: six-slot unequip/reload, one-tap replacement preserving old items, immutable set-aware comparison matching the actual resulting build, level limits, shop gold/bag/rarity guards and worn/locked/double-sale protection.');
require('./bulk-sale.cjs')(R);
// A stronger individual piece can still remove a set bonus: compare the actual resulting build.
for(const setSize of [4,6]){
 const s=R.sanitize(R.fresh()),h=s.chars[0];h.xp=R.xpAt(60);
 const setSlots=setSize===4?[0,1,2,5]:[0,1,2,3,4,5];
 for(const it of h.items){Object.assign(it,{level:30,plus:0,rarity:setSlots.includes(it.slot)?3:0,set:0});}
 const old=h.items.find(it=>it.slot===5),next={...old,id:s.nextId++,rarity:2,plus:setSize===4?7:15};h.items.push(next);
 const state=JSON.stringify(s),cmp=R.compareEquipment(s,0,next.id);assert.equal(JSON.stringify(s),state);
 assert(R.gearStats(next).atk>R.gearStats(old).atk);
 assert(setSize===4?cmp.delta.hp<0:cmp.delta.focus<0,'set loss must appear as a decrease even for a stronger item');
 assert(R.equip(s,0,next.id).ok);const actual=R.profile(s,0);
 for(const [key,field]of [['atk','gearAtk'],['hp','gearHp'],['focus','gearFocus']])assert.equal(cmp.delta[key],actual[field]-cmp.before[field]);
 assert.equal(cmp.afterPower,R.power(s,0));
}

// Inventory hints deliberately mean ANY improved option, even when another option/set is lost.
for(let cls=0;cls<6;cls++) {
 const s=R.sanitize(R.fresh()),h=s.chars[cls];h.xp=R.xpAt(60);
 for(const slot of [0,1,2,3,4,5]){
  const worn=h.items.find(it=>it.id===h.equipped[R.SLOTS[slot]]);
  assert.equal(R.equipmentTrend(s,cls,worn.id).direction,'worn');
  const copy={...worn,id:s.nextId++};h.items.push(copy);
  assert.equal(R.equipmentTrend(s,cls,copy.id).direction,'down','equal gear has no improved option');
  copy.level=60;assert.equal(R.equipmentTrend(s,cls,copy.id).direction,'up');
  worn.level=60;worn.plus=15;copy.level=1;assert.equal(R.equipmentTrend(s,cls,copy.id).direction,'down');
  delete h.equipped[R.SLOTS[slot]];assert.equal(R.equipmentTrend(s,cls,copy.id).direction,'up','empty slot improves');
 }
 assert.equal(R.equipmentTrend(s,cls,-1),null);
}
{const s=R.sanitize(R.fresh()),h=s.chars[0];h.xp=R.xpAt(60);for(const it of h.items)Object.assign(it,{level:30,plus:0,rarity:3,set:0});const ring=h.items.find(it=>it.slot===5),candidate={...ring,id:s.nextId++,rarity:2,plus:15};h.items.push(candidate);const state=JSON.stringify(s),info=R.compareEquipment(s,0,candidate.id);assert(info.delta.focus<0);assert.equal(R.equipmentTrend(s,0,candidate.id).direction,'up','a higher attack option stays green despite lost set focus');assert.equal(JSON.stringify(s),state);h.xp=0;assert.equal(R.equipmentTrend(s,0,candidate.id).direction,'up','level-restricted gear still advertises its item improvement');assert(!R.equip(s,0,candidate.id).ok);}
// A read-only quote must exactly predict the existing guaranteed enhancement transaction.
for(let cls=0;cls<6;cls++)for(let slot=0;slot<6;slot++)for(let plus=0;plus<=15;plus++){
 const s=R.sanitize(R.fresh()),it=s.chars[cls].items.find(it=>it.slot===slot);Object.assign(it,{plus,rarity:plus%5,level:60});s.gold=1e9;s.mats.iron=1e6;
 const before=JSON.stringify(s),q=R.enhancePreview(s,cls,it.id);assert.equal(JSON.stringify(s),before);
 assert.equal(q.maximum,plus===15);assert.equal(q.canEnhance,plus<15);
 if(plus===15){assert.equal(q.cost,null);assert(!R.enhance(s,cls,it.id).ok);assert.equal(JSON.stringify(s),before);continue;}
 const gold=s.gold,iron=s.mats.iron;assert(R.enhance(s,cls,it.id).ok);assert.equal(s.gold,gold-q.cost.gold);assert.equal(s.mats.iron,iron-q.cost.iron);assert.equal(it.plus,q.to);assert.deepEqual(R.gearStats(it),q.after);
 for(const k of ['atk','hp','focus'])assert.equal(q.delta[k],q.after[k]-q.before[k]);
 s.gold=0;s.mats.iron=0;const short=R.enhancePreview(s,cls,it.id);if(it.plus<15){assert(!short.canEnhance);assert.deepEqual(short.shortfall,short.cost);const state=JSON.stringify(s);assert(!R.enhance(s,cls,it.id).ok);assert.equal(JSON.stringify(s),state);}
}
console.log('PASS: all six classes/six slots inventory trends, equal/empty/level guard/set-loss cases and 576 immutable enhancement quotes matched to exact costs, results, maximum and resource guards.');

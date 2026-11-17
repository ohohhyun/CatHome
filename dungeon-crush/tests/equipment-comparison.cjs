const assert=require('node:assert/strict'),fs=require('node:fs'),audit=require('./menu-geometry.cjs');
module.exports=async p=>{
 const f=await p.evaluate(()=>{let ids;RiftApp.choose(0);RiftApp.transaction(s=>{const c=s.chars[0];c.xp=RiftRPG.xpAt(60);c.items=Array.from({length:6},(_,slot)=>({id:s.nextId++,owner:0,slot,level:30,rarity:[0,1,2,5].includes(slot)?3:0,plus:0,set:0,locked:false}));c.equipped=Object.fromEntries(c.items.map(it=>[RiftRPG.SLOTS[it.slot],it.id]));const current=c.items[5],candidate={...current,id:s.nextId++,rarity:2,plus:7},high={...candidate,id:s.nextId++,level:100};c.items.push(candidate,high);ids={current:current.id,candidate:candidate.id,high:high.id};return {ok:true};});RiftTown.open('inventory');return ids;});
 const before=await p.evaluate(()=>JSON.stringify(RiftApp.getSave()));await p.evaluate(id=>RiftTown.showDescription(id),f.candidate);
 assert.equal(await p.locator('[data-side=current]').getAttribute('data-item-id'),String(f.current));assert.equal(await p.locator('[data-side=selected]').getAttribute('data-item-id'),String(f.candidate));
 const cmp=await p.evaluate(id=>RiftRPG.compareEquipment(RiftApp.getSave(),0,id),f.candidate);
 assert(cmp.delta.atk>0&&cmp.delta.hp<0,'stronger piece loses the four-piece HP bonus');
 assert.match(await p.locator('.compare-totals [data-stat=atk]').innerText(),/↑.*상승/);assert.match(await p.locator('.compare-totals [data-stat=hp]').innerText(),/↓.*하락/);
 assert.equal(await p.evaluate(()=>JSON.stringify(RiftApp.getSave())),before,'opening comparison does not equip or change saved data');
 const sizes=[{width:1280,height:591},{width:740,height:360},{width:640,height:296,insets:{left:22,right:18,top:6,bottom:10}}];
 for(const size of sizes){await p.setViewportSize(size);await p.evaluate(({id,insets})=>{for(const edge of ['left','right','top','bottom'])document.documentElement.style.setProperty('--safe-'+edge,(insets?.[edge]||0)+'px');RiftTown.showDescription(id);},{id:f.candidate,insets:size.insets});
  for(const scale of [1,1.4]){
   if(scale>1)await p.locator('#gear-inspect-body').evaluate(root=>{window.compareFonts=[...root.querySelectorAll('*')].filter(n=>[...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())).map(n=>[n,n.style.fontSize,n.style.lineHeight,parseFloat(getComputedStyle(n).fontSize)]);for(const[n,,,font]of compareFonts){n.style.fontSize=font*1.4+'px';n.style.lineHeight='1.65';}});
   await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const left=await p.locator('[data-side=current]').boundingBox(),right=await p.locator('[data-side=selected]').boundingBox();assert(left.x+left.width<=right.x+1&&Math.abs(left.y-right.y)<1,'current item stays on the left, candidate on the right');
   assert(Math.abs(left.width-right.width)<2,'both equipment columns have equal width');
   const panel=await p.locator('.gear-inspect-modal').boundingBox(),insets=size.insets||{};assert(panel.x>=(insets.left||0)&&panel.y>=(insets.top||0)&&panel.x+panel.width<=size.width-(insets.right||0)+1&&panel.y+panel.height<=size.height-(insets.bottom||0)+1,'comparison respects safe insets');
   for(const selector of ['.compare-table','.compare-total-section','.inspect-actions']){await p.locator(selector).scrollIntoViewIfNeeded();assert.deepEqual(await p.locator('#gear-inspect-body').evaluate(audit),[],'no overlapping comparison labels');}
   await p.locator('.gear-inspect-modal').evaluate(n=>n.scrollTop=0);await p.screenshot({path:'build/previews/comparison-'+size.width+'-'+scale+'.png'});
   if(scale>1)await p.evaluate(()=>{for(const[n,font,line]of compareFonts){n.style.fontSize=font;n.style.lineHeight=line;}});
  }
 }
 await p.evaluate(id=>{RiftApp.transaction(s=>{for(const it of s.chars[0].items.slice(0,6))it.rarity=3;s.chars[0].items.find(it=>it.id===id).plus=15;return {ok:true};});RiftTown.showDescription(id);},f.candidate);assert.match(await p.locator('.compare-totals [data-stat=focus]').innerText(),/↓.*하락/,'six-piece focus loss is shown');
 await p.evaluate(id=>RiftTown.showDescription(id),f.current);assert((await p.locator('.compare-totals [data-stat]').allTextContents()).every(t=>t==='변화 없음'),'same item has no false improvement');
 await p.evaluate(id=>RiftTown.showDescription(id),f.high);assert(await p.getByRole('button',{name:'이 장비로 교체',exact:true}).isDisabled());assert(await p.locator('.compare-blocked').isVisible());assert.equal(await p.locator('.compare-totals [data-stat]').count(),0,'blocked equipment cannot show a false unequip penalty');
 await p.evaluate(id=>{RiftApp.transaction(s=>RiftRPG.unequip(s,0,id));RiftTown.showDescription(id);},f.current);assert.match(await p.locator('[data-side=current]').innerText(),/착용 장비 없음/);
 await p.locator('#gear-inspect-close').click();await p.locator('#town-close').click();
 fs.writeFileSync('build/previews/equipment-comparison-audit.json',JSON.stringify({passed:true,sizes,scales:[1,1.4],leftWornRightSelected:true,setLoss:true,readOnly:true,sameItem:true,emptySlot:true,levelGuard:true},null,2));
};

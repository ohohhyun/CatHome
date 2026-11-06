const assert=require('node:assert/strict');
const {boot}=require('./game.test.cjs');
(async()=>{
 const game=boot({catCleared:'10'});assert.equal(game.run('SKIN_CATALOG.length'),9);assert.equal(game.run('new Set(SKIN_CATALOG.map(p=>p.productId)).size'),9);
 assert(game.run("SKIN_CATALOG.every(p=>p.price===1100&&p.productId.startsWith('cathome.'))"));
 for(const c of ['hero','cats','map'])assert.equal(game.run(`SKIN_CATALOG.filter(p=>p.category==='${c}').length`),3);
 assert.equal(game.run("equipSkin('hero','hero.starlight')"),false,'unowned skin rejected');
 game.run('wallet=80;openSkinShop()');assert.equal(game.run('overlayOpen()'),true);assert.equal(game.run('closeTopPanel()'),true);
 for(const id of game.run('SKIN_CATALOG.map(p=>p.id)')){
  const before=game.run('wallet'),category=id.split('.')[0];
  assert.equal(await game.run(`purchaseSkin('${id}')`),true);assert.equal(game.run(`equippedSkins.${category}`),id);
  assert.equal(game.run(`skinOwnership['${id}']`),'preview');assert.equal(game.run('wallet'),before,'no money or coin charge in preview mode');
  assert.equal(await game.run(`purchaseSkin('${id}')`),true,'owned purchase equips idempotently');
  game.run('render()');
 }
 const reload=boot(game.storage);assert.equal(reload.run('Object.keys(skinOwnership).length'),9);assert.equal(reload.run('equippedSkins.hero'),'hero.duck');assert.equal(reload.run('equippedSkins.cats'),'cats.bakery');assert.equal(reload.run('equippedSkins.map'),'map.snow');
 assert.equal(reload.run("equipSkin('hero','cats.royal')"),false);assert.equal(reload.run("equipSkin('hero','default')"),true);
 reload.run("start(0,'endless')");assert.equal(await reload.run("purchaseSkin('hero.starlight')"),false,'cannot buy during play');assert.equal(reload.run("equipSkin('hero','hero.duck')"),false,'cannot change during play');
 // Paid builds do not accept local preview unlocks, cancellation, pending or unverified receipts.
 const paid=boot(game.storage,99,'store');assert.equal(paid.run("ownsSkin('hero.duck')"),false);assert.equal(paid.run('equippedSkins.hero'),'default');
 assert.equal(paid.run("grantSkinEntitlement('hero.duck','preview')"),false);assert.equal(await paid.run("purchaseSkin('hero.duck')"),false,'no adapter: no unlock');
 const api=paid.env.window.CatHomeStore;
 for(const status of ['cancelled','pending']){api.registerBillingAdapter({purchase:async productId=>({status,productId}),restore:async()=>[]});assert.equal(await api.purchase('hero.duck'),false);assert.equal(paid.run("ownsSkin('hero.duck')"),false)}
 for(const result of [{status:'purchased',productId:'cathome.hero.duck',entitlementVerified:false},{status:'purchased',productId:'cathome.hero.courier',entitlementVerified:true}]){api.registerBillingAdapter({purchase:async()=>result,restore:async()=>[]});assert.equal(await api.purchase('hero.duck'),false);assert.equal(paid.run("ownsSkin('hero.duck')"),false)}
 let settle;api.registerBillingAdapter({purchase:productId=>new Promise(resolve=>{settle=()=>resolve({status:'purchased',productId,entitlementVerified:true})}),restore:async()=>[]});
 const pending=api.purchase('hero.duck');assert.equal(await api.purchase('hero.duck'),false,'duplicate request blocked');settle();assert.equal(await pending,true);assert.equal(paid.run("skinOwnership['hero.duck']"),'store');assert.equal(paid.run('skinBusy'),false);
 api.registerBillingAdapter({purchase:async()=>{throw Error('offline')},restore:async()=>[{status:'purchased',productId:'cathome.map.neon',entitlementVerified:true},{status:'purchased',productId:'cathome.cats.cosmic',entitlementVerified:false},{status:'pending',productId:'cathome.cats.royal',entitlementVerified:true}]});
 assert.equal(await api.purchase('hero.courier'),false);assert.equal(paid.run('skinBusy'),false);assert.equal(await api.restore(),true);assert.equal(paid.run("skinOwnership['map.neon']"),'store');assert.equal(paid.run("ownsSkin('cats.cosmic')"),false);assert.equal(paid.run("ownsSkin('cats.royal')"),false);
 const savedPaid=boot(paid.storage,100,'store');assert.equal(savedPaid.run("ownsSkin('hero.duck')"),true);assert.equal(savedPaid.run("ownsSkin('map.neon')"),true);
 console.log('PASS skins: nine products, free preview purchase/equip/persistence, currency unchanged, verified billing adapter success/cancel/pending/error/restore and duplicate guard.');
})().catch(error=>{console.error(error);process.exitCode=1});

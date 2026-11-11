const {boot}=require('./game.test.cjs');const assert=require('node:assert/strict');
(async()=>{
const g=boot({catCleared:'10'}),r=g.run;
assert.equal(r("start(0,'crazy')"),false);
r("start(0,'endless');elapsed=999.98;cats=[];update(.03)");assert.equal(r('crazyUnlocked'),true);assert.match(g.element('toast').firstElementChild.textContent,/50탄 클리어/);
r("goHome();start(0,'crazy');inventory={continue:9,umbrella:9,water:9,fish:9};wave()");assert.equal(r('itemUseLimit()'),1);assert(r('cats.every(c=>["rainbow","superman","wheel"].includes(c.kind))'));r('elapsed=2000;cats=[];hits=2;update(.01)');assert.equal(r('state'),'play');assert.equal(r('hits'),2);r("useItem('umbrella')");assert.equal(r("useItem('umbrella')"),false);r("panel('fail')");assert.equal(r("useItem('continue')"),false);assert.equal(await r('purchaseContinue()'),false);assert(r('rankings.crazy.length')>0);assert.equal(r('best'),0);
const again=boot(g.storage);assert.equal(again.run('crazyUnlocked'),true);assert(again.run('rankings.crazy.length')>0);
r("goHome();start(0);inventory.continue=0;panel('fail')");assert.equal(await r('purchaseContinue()'),false);assert.equal(r('state'),'fail');
r("window.CatHomeStore.registerBillingAdapter({purchase:async()=>({}),restore:async()=>[],purchaseConsumable:async()=>({status:'purchased',productId:'cathome.continue.once',entitlementVerified:true,consumed:true,transactionId:'test-1'})})");assert.equal(await r('purchaseContinue()'),true);assert.equal(r('state'),'play');assert.equal(r('paidUsed'),true);r("panel('fail')");assert.equal(await r('purchaseContinue()'),false);
console.log('PASS crazy unlock, endless stages, special cats, item caps, no revive/healing, rankings persistence, verified paid revive and once-per-run guard');
})();

const {boot}=require('./game.test.cjs'),assert=require('node:assert/strict');
const g=boot({},1,'preview',true),r=g.run;
assert.equal(g.element('crazy').disabled,false);assert.equal(g.element('endless').disabled,false);
g.element('select').click();assert.equal(g.element('levelgrid').children.filter(b=>!b.disabled).length,30);
for(const mode of ['story','endless','crazy']){assert.equal(r(`start(0,'${mode}')`),true);r('goHome()')}
assert.equal(r("equipSkin('map','map.neon')"),true);r('save();flushSave()');
const saved=JSON.parse(g.storage.catHomeSave);assert.equal(saved.cleared,0);assert.equal(saved.crazyUnlocked,false);assert.equal(saved.bestRound,1);assert.equal(Object.keys(saved.cosmetics.owned).length,0);
const release=boot(g.storage);assert.equal(release.element('crazy').disabled,true);assert.equal(release.element('endless').disabled,true);assert.equal(release.run('equippedSkins.map'),'default');
console.log('PASS prototype all modes, 30 stages and skins without fabricated progress or purchases');

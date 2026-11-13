const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const manifest=JSON.parse(fs.readFileSync('art-source/key-art-sources.json'));
const vm=require('node:vm'),context={};context.window=context;vm.createContext(context);
for(const file of ['premium.js','key-art-catalog.js','key-art.js'])vm.runInContext(fs.readFileSync('app/src/main/assets/'+file,'utf8'),context);
const heroes=['kael','rin','bane','sera','aria','elian'],all=heroes.concat(Array.from(context.DungeonPremium.ITEMS).filter(i=>i.kind==='outfit').map(i=>i.id));
assert.equal(all.length,36);assert.deepEqual(manifest.pending,all.filter(id=>!manifest.assets.some(a=>a.id===id)));
const expected=process.env.DUNGEON_ALLOW_PENDING_KEY_ART==='1'?36-manifest.pending.length:36;
assert.equal(manifest.assets.length,expected,'APK requires every commissioned illustration');
assert.equal(new Set(manifest.assets.map(a=>a.id)).size,expected);
assert.equal(new Set(manifest.assets.map(a=>a.sha256)).size,expected);
for(const a of manifest.assets){
 assert(all.includes(a.id));assert.equal(a.file,'art/key-art/'+a.id+'.webp');assert.equal(context.DungeonKeyArtAssets[a.id],a.file);
 assert((a.frameInset||1)>=.75&&(a.frameInset||1)<=1,'illustration framing uses a uniform safe inset');
 const bytes=fs.readFileSync('app/src/main/assets/'+a.file);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256,a.id);
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert(a.width>=1024&&a.height>=1536,a.id+' must be a separate detailed illustration');
 assert.equal(a.tool,'OpenAI image_gen');assert(a.packaged);
}
for(const [cls,id]of heroes.entries())assert.equal(context.DungeonKeyArt.source(cls),context.DungeonKeyArtAssets[id]);
assert.equal(context.DungeonKeyArt.source(1,'kael-noel'),context.DungeonKeyArtAssets.rin,'a costume for another class cannot replace the selected hero art');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
assert(html.indexOf('<script src="key-art.js"')<html.indexOf('<script src="client.js"'));
assert(html.includes('id="select-key-art"'));
console.log('PASS: '+expected+' distinct full-resolution character/outfit key arts, source provenance, packaged hashes and selection integration. Pending: '+manifest.pending.length);

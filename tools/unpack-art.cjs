const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'art-source'),target=path.join(root,'app/src/main/assets/art');
fs.mkdirSync(target,{recursive:true});
for(const name of fs.readdirSync(source).filter(n=>n.endsWith('.webp.b64')||n.endsWith('.otf.b64'))){const data=fs.readFileSync(path.join(source,name),'utf8').trim();if(!/^[A-Za-z0-9+/]*={0,2}$/.test(data))throw Error('Invalid asset '+name);fs.writeFileSync(path.join(target,name.slice(0,-4)),Buffer.from(data,'base64'));}
console.log('Offline game art unpacked.');

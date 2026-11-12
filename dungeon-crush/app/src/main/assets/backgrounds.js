/* Only the active panorama and the next encounter are pinned; decoded cache <= 3. */
(function(root){'use strict';
const sources=Array.from({length:24},(_,i)=>i===0?'art/sanctum.webp':i<8?'art/frontier/region-'+i+'.webp':i<12?'art/motion210/region-'+i+'.webp':(i-12)%3===0?'art/frontier/region-'+(12+Math.floor((i-12)/3))+'.webp':'art/frontier/stage-'+(36+i-12)+'.webp');
const cache=new Map(),failed=new Set();let clock=0,currentKey=0,pins=new Set([0]);
function key(s){if(!s||s.kind==='pvp')return 0;const R=root.RiftRPG,d=R.DUNGEONS[s.dungeon];if(!d)return 0;const region=root.DungeonEncounters?.theme(s)??d.chapter;const part=R.raidRoute(s)?[0,1,0,1,2][Math.max(0,Math.min(4,(s.room||1)-1))]:d.part;return region<12?region:12+(region-12)*3+part;}
function trim(){while(cache.size>3){const candidates=[...cache].filter(([k])=>!pins.has(k)).sort((a,b)=>a[1].used-b[1].used);if(!candidates.length)break;const [k,v]=candidates[0];v.cancelled=true;v.image.onload=v.image.onerror=null;cache.delete(k);}}
function load(k){if(cache.has(k)){cache.get(k).used=++clock;return;}if(failed.has(k))return;const image=new Image(),entry={image,ready:false,used:++clock,cancelled:false};cache.set(k,entry);trim();const reject=()=>{if(entry.cancelled)return;cache.delete(k);failed.add(k);};image.onerror=reject;image.onload=async()=>{try{if(image.decode)await image.decode();if(!entry.cancelled){entry.ready=true;image.onload=image.onerror=null;}}catch(_){reject();}};image.src=sources[k];}
function prepare(s){currentKey=key(s);pins=new Set([currentKey]);if(s?.kind==='raid'&&(s.room||1)<(s.roomCount||5))pins.add(key({...s,room:(s.room||1)+1}));for(const k of pins)load(k);trim();}
function current(s){const k=key(s),v=cache.get(k);if(v?.ready){v.used=++clock;return v.image;}return null;}
function ready(s){return !!cache.get(key(s))?.ready;}
function retryFailed(){for(const k of [...failed]){failed.delete(k);if(pins.has(k))load(k);}}
root.DungeonBackgrounds={sources,key,prepare,current,ready,retryFailed,status:()=>({key:currentKey,cached:cache.size,bytes:[...cache.values()].reduce((n,v)=>n+(v.ready?v.image.width*v.image.height*4:0),0),pending:[...cache].filter(([,v])=>!v.ready).map(([k])=>k),failures:[...failed].filter(k=>pins.has(k))})};
})(typeof window!=='undefined'?window:globalThis);

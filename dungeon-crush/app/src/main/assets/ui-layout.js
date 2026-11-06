/* Screen-only label placement. No simulation or saved state is modified. */
(function(root){'use strict';
function intersects(a,b,gap=5){return a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;}
let lastKey='',lastResult=[];
function nameplates(labels,obstacles=[],width=1600,height=800){
 const key=JSON.stringify([labels,obstacles,width,height]);if(key===lastKey)return lastResult.map(b=>({...b}));
 const placed=[];for(const label of [...labels].sort((a,b)=>a.id-b.id)){
  const w=Math.min(width-20,label.w),h=label.h,blocks=[...obstacles,...placed],xs=[label.x],ys=[label.y],step=h+7;
  for(let row=1;row<=7;row++){ys.push(label.y-row*step,label.y+row*step);}xs.push(label.x-w-10,label.x+w+10);
  for(const b of blocks){xs.push(b.x-w-8,b.x+b.w+8);ys.push(b.y-h-8,b.y+b.h+8);}
  const coordinates=(values,at,max)=>[...new Set(values.map(n=>Math.max(10,Math.min(max,n))))].sort((a,b)=>Math.abs(a-at)-Math.abs(b-at));
  let best=null;
  function scan(xValues,yValues){for(const x of xValues)for(const y of yValues){const cost=Math.abs(x-label.x)*.75+Math.abs(y-label.y);if(best&&cost>=best.cost)continue;const box={...label,x,y,w,h,cost};if(!blocks.some(other=>intersects(box,other)))best=box;}}
  scan(coordinates(xs,label.x,width-w-10),coordinates(ys,label.y,height-h-10));
  if(!best){const gx=[],gy=[];for(let x=10;x+w<width-10;x+=Math.max(12,w/3))gx.push(x);for(let y=10;y+h<height-10;y+=Math.max(10,h/2))gy.push(y);scan(gx,gy);}
  placed.push(best||{...label,x:10,y:Math.min(height-h-10,10+placed.length*(h+7)),w,h,cost:Infinity});
 }
 lastKey=key;lastResult=placed;return placed.map(b=>({...b}));
}
root.DungeonUILayout={nameplates,intersects};
})(typeof window==='undefined'?globalThis:window);

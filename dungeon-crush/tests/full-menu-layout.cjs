const assert=require('node:assert/strict');
module.exports=async(page,{baseline=false}={})=>{
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const state=await page.locator('#quick-menu-grid').evaluate(grid=>{const box=grid.getBoundingClientRect();return{scroll:grid.scrollHeight,client:grid.clientHeight,box:{top:box.top,bottom:box.bottom,left:box.left,right:box.right},tiles:[...grid.children].map(n=>{const r=n.getBoundingClientRect(),title=n.querySelector('strong').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom,right:r.right,title:title.y,label:n.textContent};})};});
 assert.equal(state.tiles.length,12,'twelve destinations, with closing in the header');
 for(const key of ['w','h'])assert(Math.max(...state.tiles.map(r=>r[key]))-Math.min(...state.tiles.map(r=>r[key]))<1,'ALL twelve menu cells share '+key);
 for(let row=0;row<3;row++){const cells=state.tiles.slice(row*4,row*4+4);for(const key of ['y','title'])assert(Math.max(...cells.map(r=>r[key]))-Math.min(...cells.map(r=>r[key]))<1,'four cards and titles align at each row');}
 if(baseline){assert(state.scroll<=state.client+1,'all three menu rows fit before text enlargement');assert(state.tiles.every(r=>r.y>=state.box.top&&r.bottom<=state.box.bottom+1),'normal text shows the complete last row');}
 return state;
};

const {boot}=require('./game.test.cjs');const fs=require('fs');
const b=boot(),ctx=b.env.document.getElementById('c').getContext('2d');let shapes=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
ctx.fillRect=function(x,y,w,h){const c=typeof this.fillStyle==='string'?this.fillStyle:'#10182a33';shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity="${this.globalAlpha??1}"/>`)};
ctx.fillText=function(s,x,y){const size=Number((this.font||'10px').match(/(\d+)px/)?.[1])||10;shapes.push(`<text x="${x}" y="${y}" font-family="Noto Sans CJK KR, sans-serif" font-weight="bold" font-size="${size}" text-anchor="${this.textAlign==='center'?'middle':this.textAlign==='right'?'end':'start'}" fill="${this.fillStyle}" opacity="${this.globalAlpha??1}">${esc(s)}</text>`)};
function write(name){shapes=[];b.run('render()');fs.writeFileSync('/workspace/artifacts/'+name+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="384" height="720" viewBox="0 0 384 720">${shapes.join('')}</svg>`)}
b.run('t=2;road=30');write('CatHome-title-art');
b.run("start(6);elapsed=8;road=90;t=3;px=192;invincible=0;cats=[{x:112,y:410,col:'#e6ac74',age:2,type:0},{x:272,y:340,col:'#c6c5d0',age:1,type:1},{x:192,y:190,col:'#eee1bf',age:1.3,type:2}];coins=[{x:192,y:380,age:2},{x:112,y:150,age:1}]");write('CatHome-game-art');

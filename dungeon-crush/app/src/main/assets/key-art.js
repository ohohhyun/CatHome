/* Illustrations are independent of the calibrated gameplay sprites. */
(function(root){'use strict';
const heroes=['kael','rin','bane','sera','aria','elian'];
function source(cls,costume=''){
 const item=root.DungeonPremium?.item(costume);
 const id=item?.kind==='outfit'&&item.cls===cls?item.id:heroes[cls];
 return root.DungeonKeyArtAssets?.[id]||'';
}
function selectionSource(cls,costume=''){return costume?source(cls,costume):root.DungeonSelectionArt?.[heroes[cls]]?.src||source(cls);}
function layout(img,cls,costume=''){
 const factor=(root.DungeonArt?.heightScale?.(cls)||1)/1.16,mark=img.id==='select-key-art'&&!costume?root.DungeonSelectionArt?.[heroes[cls]]:null;
 const scale=mark ? .76*factor*mark.height/(mark.soleY-mark.eyeY):factor*(root.DungeonKeyArtInset?.[img.dataset.source?.split('/').pop().replace('.webp','')]||1);
 const fitHeight=mark?Math.min(img.clientHeight,img.clientWidth*mark.height/mark.width):0,shift=mark?fitHeight*(scale*(1-mark.soleY/mark.height)-.08):0;
 img.dataset.heightScale=String(factor);img.style.transformOrigin='center bottom';img.style.transform='translateY('+shift+'px) scale('+scale+')';
}
function show(img,cls,costume=''){
 if(!img)return;const src=img.id==='select-key-art'?selectionSource(cls,costume):source(cls,costume);if(img.dataset.source===src){layout(img,cls,costume);return;}
 let status=img.parentElement.querySelector('.key-art-status');
 if(!status){status=document.createElement('div');status.className='key-art-status';status.setAttribute('role','status');img.parentElement.append(status);}
 status.hidden=false;status.textContent='원화를 불러오는 중입니다.';
 if(!src){img.dataset.source='';img.dataset.state='unavailable';img.style.visibility='hidden';img.removeAttribute('src');status.textContent='이 외형은 동작 미리보기에서 확인할 수 있습니다.';return;}
 img.dataset.source=src;img.dataset.state='loading';img.style.visibility='hidden';img.alt=(root.Rift?.CLASSES[cls]?.name||'캐릭터')+' '+(root.DungeonPremium?.item(costume)?.name||'기본 외형')+' 일러스트';
 layout(img,cls,costume);
 img.onload=()=>{if(img.getAttribute('src')===src){img.dataset.state='ready';img.style.visibility='visible';status.hidden=true;layout(img,cls,costume);}};
 img.onerror=()=>{if(img.getAttribute('src')===src){img.dataset.state='error';status.textContent='원화를 불러오지 못했습니다. ';const retry=document.createElement('button');retry.textContent='다시 불러오기';retry.onclick=()=>{delete img.dataset.source;show(img,cls,costume);};status.append(retry);}};
 img.src=src;
}
function selection(){
 if(document.getElementById('character-screen')?.hidden)return;
 const A=root.RiftApp,cls=A.getClass(),look=root.DungeonPremium?.appearance(A.getSave(),cls);
 if(!look?.costume)root.DungeonArt?.ensure(cls);
 show(document.getElementById('select-key-art'),cls,look?.costume);
 for(const [i,card]of [...document.querySelectorAll('.char-card')].entries()){
  card.setAttribute('aria-pressed',String(i===cls));
  const art=card.querySelector('.art');if(art){art.style.backgroundImage='url("'+source(i)+'")';art.style.backgroundPosition='center 18%';art.style.backgroundSize='cover';}
 }
}
root.addEventListener?.('resize',selection);
root.DungeonKeyArt={source,selectionSource,show,selection};
})(window);

/* Illustrations are independent of the calibrated gameplay sprites. */
(function(root){'use strict';
const heroes=['kael','rin','bane','sera','aria','elian'];
function source(cls,costume=''){
 const item=root.DungeonPremium?.item(costume);
 const id=item?.kind==='outfit'&&item.cls===cls?item.id:heroes[cls];
 return root.DungeonKeyArtAssets?.[id]||'';
}
function show(img,cls,costume=''){
 const src=source(cls,costume);if(!img||img.dataset.source===src)return;
 let status=img.parentElement.querySelector('.key-art-status');
 if(!status){status=document.createElement('div');status.className='key-art-status';status.setAttribute('role','status');img.parentElement.append(status);}
 status.hidden=false;status.textContent='원화를 불러오는 중입니다.';
 if(!src){img.dataset.source='';img.dataset.state='unavailable';img.style.visibility='hidden';img.removeAttribute('src');status.textContent='이 외형은 동작 미리보기에서 확인할 수 있습니다.';return;}
 img.dataset.source=src;img.dataset.state='loading';img.style.visibility='hidden';img.alt=(root.Rift?.CLASSES[cls]?.name||'캐릭터')+' '+(root.DungeonPremium?.item(costume)?.name||'기본 외형')+' 일러스트';
 img.style.transform='scale('+(root.DungeonKeyArtInset?.[src.split('/').pop().replace('.webp','')]||1)+')';
 img.onload=()=>{if(img.getAttribute('src')===src){img.dataset.state='ready';img.style.visibility='visible';status.hidden=true;}};
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
root.DungeonKeyArt={source,show,selection};
})(window);

(function(root){'use strict';
const names=[['sword-slice','shining-sword','fire-dash','fire-ring','fire-shield','sun-radiations'],['thrown-spear','moon','comet-spark','ice-spear','ice-shield','fragmented-meteor'],['punch-blast','mailed-fist','earth-crack','vortex','bordered-shield','meteor-impact'],['supersonic-bullet','bright-explosion','black-hole-bolas','arcing-bolt','shining-heart','evil-comet'],['bright-explosion','ice-spear','arcing-bolt','vortex','ice-shield','sun-radiations']];
function named(el,name){el.replaceChildren();el.classList.add('skill-icon');const img=document.createElement('img');img.src='icons/'+name+'.svg';img.alt='';img.draggable=false;el.append(img);el.setAttribute('aria-hidden','true');}
function apply(el,cls,index){named(el,names[cls][index]);el.classList.add('painted-skill');if(cls===4){el.style.backgroundImage='url(art/motion299/aria-icons.webp)';el.style.backgroundSize='600% 200%';el.style.backgroundPosition=(index*20)+'% 0%';}else{el.style.backgroundImage='';el.style.backgroundSize='';el.style.backgroundPosition=(index*20)+'% '+(cls*100/3)+'%';}}
const atlas=new Image();atlas.onload=()=>document.documentElement.classList.add('painted-icons-ready');atlas.src='art/motion29/skill-icons.webp';
let timer;function readout(name){const n=document.getElementById('combat-skill-name');if(!n)return;n.textContent=name;n.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>n.classList.remove('visible'),1000);}
root.DungeonIcons={apply,named,readout,names};
})(window);

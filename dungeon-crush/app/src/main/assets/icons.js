(function(root){'use strict';
const names=[['sword-slice','shining-sword','fire-dash','fire-ring','fire-shield','sun-radiations'],['thrown-spear','moon','comet-spark','ice-spear','ice-shield','fragmented-meteor'],['punch-blast','mailed-fist','earth-crack','vortex','bordered-shield','meteor-impact'],['supersonic-bullet','bright-explosion','black-hole-bolas','arcing-bolt','shining-heart','evil-comet']];
function apply(el,cls,index){el.textContent='';el.classList.add('skill-icon');const url='url("icons/'+names[cls][index]+'.svg")';el.style.setProperty('--icon',url);el.setAttribute('aria-hidden','true');}
let timer;function readout(name){const n=document.getElementById('combat-skill-name');if(!n)return;n.textContent=name;n.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>n.classList.remove('visible'),1000);}
root.DungeonIcons={apply,readout,names};
})(window);

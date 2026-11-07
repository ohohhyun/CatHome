/* Menus share a left description / right selection layout. IDs and game rules stay intact. */
(function(root){'use strict';
function split(id,choices){const screen=document.getElementById(id),modal=screen.querySelector('.modal'),copy=document.createElement('div'),options=document.createElement('div');copy.className='dialog-copy';options.className='dialog-options';copy.setAttribute('aria-label','메뉴 설명');options.setAttribute('aria-label','목록과 선택');for(const n of [...modal.children]){if(n.classList.contains('close'))continue;(n.matches(choices)?options:copy).append(n);}modal.classList.add('split-dialog');modal.append(copy,options);}
for(const [id,choices]of [['guide-screen','.guide,.skill-catalog'],['settings-screen','label,input'],['lan-screen','#lan-setup,#lobby,#lan-status'],['pause-screen','button'],['results','#rewards,button'],['forge-screen','#upgrades']])split(id,choices);
function inspect(body){const copy=document.createElement('div'),options=document.createElement('div');copy.className='dialog-copy';options.className='dialog-options';copy.setAttribute('aria-label','장비 설명');options.setAttribute('aria-label','비교와 장비 선택');for(const n of [...body.children])(n.matches('.gear-comparison,.inspect-actions')?options:copy).append(n);body.append(copy,options);}
root.DungeonMenus={inspect};
})(window);

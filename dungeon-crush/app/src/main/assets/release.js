/* Player-facing automatic-save health. Portable developer backup tools are removed. */
(function(root){'use strict';
const A=root.RiftApp,$=id=>document.getElementById(id),box=document.createElement('section');box.className='save-health';
const title=document.createElement('h3');title.textContent='자동 저장';const status=document.createElement('p');status.id='save-health-status';status.setAttribute('role','status');box.append(title,status);$('settings-screen').querySelector('.dialog-options').append(box);
const privacy=document.createElement('p');privacy.className='note privacy-note';privacy.textContent='모험과 설정은 이 기기에 자동으로 저장돼요. Wi-Fi 파티에서는 참가자끼리 게임 상태를 공유합니다.';$('settings-screen').querySelector('.dialog-copy').append(privacy);
function refresh(){const state=A.progressStatus();status.textContent=state.blocked?'기록을 읽지 못해 기존 기록을 보호하고 있어요. 앱을 다시 시작해 주세요.':state.recovered?'이전 기록을 안전하게 복구했어요.':state.lastSavedAt?'마지막 저장 '+new Date(state.lastSavedAt).toLocaleTimeString('ko-KR'):'모험을 진행하면 자동으로 저장돼요.';}
new MutationObserver(refresh).observe($('settings-screen'),{attributes:true,attributeFilter:['hidden']});refresh();
if(A.progressStatus().blocked)setTimeout(()=>{const toast=$('toast');toast.textContent='기록을 불러오지 못했어요. 기존 기록을 보호하고 있으니 앱을 다시 시작해 주세요.';toast.hidden=false;},900);
})(window);

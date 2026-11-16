/* Registered consumable catalogue. No store product is connected: never grant or charge. */
(function(root){'use strict';
const A=root.RiftApp,P=root.DungeonPK,product=P.NAME_TICKET;
function purchase(){return {ok:false,error:'스토어 판매 준비 중입니다. 현재는 구매할 수 없습니다.',charged:0};}
function open(){if(A.getMode()!=='menu'){root.toast('마을에서 유료 상점을 이용해 주세요.');return false;}A.resetControls();root.DungeonClient.cancelTownRoute();const body=document.createElement('div');body.className='cash-product';const tag=document.createElement('small');tag.textContent='소모성 아이템';const title=document.createElement('h3');title.textContent=product.name;const price=document.createElement('strong');price.id='nickname-ticket-price';price.textContent=product.price.toLocaleString('ko-KR')+'원';const owned=document.createElement('p');owned.textContent='보유 '+(A.getSave().pk?.nameTickets||0)+'개';const desc=document.createElement('p');desc.textContent='닉네임 변경 시 1개를 사용합니다. 최초 닉네임 저장은 무료입니다.';const status=document.createElement('p');status.className='cash-unavailable';status.textContent='스토어 판매 준비 중입니다. 현재는 결제하거나 구매할 수 없습니다.';body.append(tag,title,price,owned,desc,status);root.DungeonDialogs.open({title:'유료 상점',body,actions:[{label:'구매 준비 중',primary:true,disabled:true},{label:'닫기'}],className:'cash-shop-popover'});return true;}
root.DungeonCashShop={PRODUCT:product,open,purchase,billingConnected:false};
})(window);

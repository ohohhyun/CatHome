# 스킨 결제 연결

현재 APK는 `SKIN_CHECKOUT_MODE='preview'`입니다. 9종을 각각 1,100원으로 표시하되 실제 결제·코인 차감 없이 해금합니다. 체험 구매는 이 기기 앱 데이터에 저장됩니다. 결제수단 정보는 수집하지 않습니다.

## 비소모성 상품

| 종류 | 상품 ID | 표시 가격 |
|---|---|---|
| 별빛 마법사 | cathome.hero.starlight | KRW 1,100 |
| 심야 배달원 | cathome.hero.courier | KRW 1,100 |
| 오리 우비 | cathome.hero.duck | KRW 1,100 |
| 왕실 냥냥단 | cathome.cats.royal | KRW 1,100 |
| 우주 탐사냥 | cathome.cats.cosmic | KRW 1,100 |
| 갓 구운 냥이 | cathome.cats.bakery | KRW 1,100 |
| 벚꽃 밤산책 | cathome.map.sakura | KRW 1,100 |
| 네온 야시장 | cathome.map.neon | KRW 1,100 |
| 첫눈 온 마을 | cathome.map.snow | KRW 1,100 |

## 준비된 어댑터 경계

`window.CatHomeStore`는 product catalog, purchase(id), restore(), registerBillingAdapter(adapter)를 제공합니다. 게임의 상점·저장·장착·렌더링은 이미 구현되어 있습니다. Google Play Billing SDK, Android↔WebView 브리지, 구매 토큰 서버 검증은 아직 연결하지 않았습니다. 실제 결제 출시에는 이 구현과 Play Console 상품 등록이 필요합니다.

```js
window.CatHomeStore.registerBillingAdapter({
  // Play ProductDetails의 localized formattedPrice. 실제 결제 표시에는 플랫폼 가격 사용.
  prices: {'cathome.hero.starlight': '₩1,100'},
  async purchase(productId) {
    // Android BillingClient → PURCHASED 확인 → 서버에서 purchaseToken 검증
    // → 영구 권한 기록 + acknowledge. 성공한 경우에만 아래 형태 반환.
    return {status:'purchased', productId, entitlementVerified:true};
    // 취소: {status:'cancelled'} / 승인 대기: {status:'pending'}
    // 네트워크·검증 실패: throw Error(...)
  },
  async restore() {
    // queryPurchasesAsync + 서버의 유효한 비소모성 소유권 조회.
    return [{status:'purchased', productId:'cathome.hero.starlight', entitlementVerified:true}];
  }
});
```

이 예시의 반환값을 그대로 사용하면 안 됩니다. 실제 Android 결제/서버 검증 결과를 반환해야 합니다. 브리지는 신뢰할 수 있는 로컬 게임 페이지에만 노출하고 외부 URL에서는 사용할 수 없게 해야 합니다.

`index.html`의 `SKIN_CHECKOUT_MODE`를 `store`로 전환하면 무료 해금 경로가 꺼지고 어댑터 없이는 구매가 거부됩니다. 체험 권한(`preview`)은 실제 유료 소유권(`store`)과 구분되며, 유료 모드에서는 체험 권한으로 장착할 수 없습니다. 기존 게임 기록·코인·아이템은 유지됩니다. 취소/승인 대기/검증 실패에는 지급하지 않으며 같은 구매 중 중복 요청을 막습니다.

출시 전 실제 라이선스 테스터로 구매·취소·승인 대기·앱 재시작·구매 복원·미승인 거래 처리를 검증하고 서명된 배포 버전에서 최종 확인합니다. 로컬 저장만으로 결제 권한을 신뢰하는 용도로 사용하지 않습니다.

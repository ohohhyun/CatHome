"""Package the exact CI-verified APK with Korean installation/review documents."""
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_STORED
import json
import os
import re
import subprocess

root = Path('dungeon-crush')
source = os.environ['DUNGEON_RELEASE_SOURCE']
run = os.environ['DUNGEON_RELEASE_RUN']
expected = os.environ['DUNGEON_APK_SHA256']
expected_bytes = int(os.environ['DUNGEON_APK_BYTES'])
tag = os.environ['RELEASE_TAG']
assert re.fullmatch(r'[0-9a-f]{40}', source)
assert re.fullmatch(r'[0-9a-f]{64}', expected) and run.isdigit()
assert tag == 'dungeon-crush-v2.15.0-rc1'
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip() == source
apk = Path('apk/DungeonCrush-2.15.0.apk')
data = apk.read_bytes()
assert len(data) == expected_bytes and sha256(data).hexdigest() == expected
art = json.loads((root / 'art-source/key-art-sources.json').read_text())
assert len(art['assets']) == 36 and art['pending'] == []
assert len({a['id'] for a in art['assets']}) == 36
with ZipFile(apk) as z:
    assert z.testzip() is None
    for file in (root / 'app/src/main/assets').iterdir():
        if file.is_file() and file.suffix in ('.js', '.css', '.html'):
            assert z.read('assets/' + file.name) == file.read_bytes(), file.name
    for a in json.loads((root / 'generated-art-sources.json').read_text())['assets']:
        if a.get('packaged', True):
            assert sha256(z.read('assets/' + a['file'])).hexdigest() == a['sha256'], a['file']
    for a in json.loads((root / 'combat-audio-sources.json').read_text())['assets']:
        assert sha256(z.read('assets/audio/' + a['file'])).hexdigest() == a['sha256'], a['file']
    config = json.loads(re.search(r'Object.freeze\((.*)\)', z.read('assets/ranking-config.js').decode()).group(1))
    assert config == dict(enabled=False, endpoint='', publicKey='')
assert all(t in (root / 'app/src/main/assets/premium.js').read_text() for t in ["mode:'test'", 'allowTestPurchases:true', 'paymentProvider:null'])
build = 'https://github.com/ohohhyun/CatHome/actions/runs/' + run
release = 'https://github.com/ohohhyun/CatHome/releases/tag/' + tag
verified = f'전체 55개 검사 및 APK/AAB·Android lint·기존 서명·포함 리소스 검증 성공: {build}. APK SHA256 `{expected}`.'
summary = f'''## 최신 검증 버전: 2.15.0 RC1

- 검증 소스 `{source}`. {verified}
- 원화 36장과 캐릭터 선택/상품 상세 원화·동작·스킬 미리보기를 포함합니다. 미리보기의 동작별 자동 배율 변경을 수정했습니다.
- 외형 30벌을 실제 장착/해제하고 기본 6명의 마을·전투 몸 크기와 비교했습니다. 상세 내용은 release/UI-KEYART-NOTES.md입니다.
- 공개 다운로드: {release}
- versionCode 42 / 저장 형식 2 / Wi-Fi 프로토콜 10. 기존 앱을 삭제하지 말고 업데이트 설치합니다.
- 현재 실제 결제 없는 무료 테스트 상점입니다. 집사 사절 원본과 서버/DB는 수정하지 않았습니다.

'''
handoff = (root / 'HANDOFF.md').read_text()
handoff = re.sub(r'## 진행 중: 2\.15\.0.*?(?=## 최신 검증 버전:)', '', handoff, flags=re.S)
handoff = handoff.replace('## 최신 검증 버전:', '## 이전 검증 버전:', 1)
handoff = handoff.replace('## 이전 검증 버전:', summary + '## 이전 검증 버전:', 1)
notes = f'''던전크러시! 2.15.0 (설치 버전 42)

1. 압축을 풀고 DungeonCrush-2.15.0.apk를 설치하세요.
2. 기존 앱을 삭제하지 말고 업데이트 설치하세요. 성장 기록은 설정에서 파일로 백업할 수 있습니다.
3. 캐릭터 선택과 외형 상품 상세에서 해당 캐릭터/의상의 원화를 확인하세요.
4. 외형 상품의 원화·동작·스킬 효과 탭으로 바꿔 볼 수 있습니다. 구매 후 장착/기본 외형으로 버튼을 사용하세요.
5. 동작을 바꿔도 카메라 크기를 유지합니다. 큰 스킬은 넓게 보기/기본 배율 버튼으로 확인하세요.
6. 외형/펫은 무료 테스트 구매입니다. 실제 결제나 골드 소모가 없습니다.
7. 저장 형식 2 / Wi-Fi 프로토콜 10 / 기존 테스트 서명을 유지합니다. 집사 사절 원본은 수정하지 않았습니다.

검증 빌드: {build}
APK SHA256: {expected}
실제 단말 장시간 FPS·발열과 스토어 등록은 별도입니다.
'''.replace('\n', '\r\n')
docs = ['RELEASE-CHECKLIST.md', 'PRIVACY-KO.md', 'STORE-LISTING-KO.md', 'RANKING-INTEGRATION.md', 'UI-REFERENCES.md', 'AUDIO-NOTES.md', 'FRONTIER-NOTES.md', 'PREMIUM-SHOP.md', 'PREMIUM-REFERENCES.md', 'SKIN-SIZE-NOTES.md', 'UI-KEYART-NOTES.md', 'UI-KEYART-QA.json', 'Appearance-2.15.0-World-Comparison.png']
entries = [(apk.name, data), ('INSTALL-KO.txt', b'\xef\xbb\xbf' + notes.encode()), ('HANDOFF.md', handoff.encode())]
for name in docs:
    content = (root / 'release' / name).read_bytes()
    if name in ['UI-KEYART-NOTES.md', 'RELEASE-CHECKLIST.md']:
        content = content.decode().replace('최종 빌드와 공개 ZIP 검증 결과는 완료 후 기록합니다.', verified + ' 공개 ZIP 전체 다운로드 검증은 배포 후 수행합니다.').encode()
    entries.append((name, content))
output = Path('DungeonCrush-2.15.0-RC1.zip')
with ZipFile(output, 'w', compression=ZIP_STORED) as z:
    for name, content in entries:
        item = ZipInfo(name, date_time=(2026, 11, 13, 0, 0, 0))
        item.create_system = 3
        item.external_attr = 0o100644 << 16
        item.compress_type = ZIP_STORED
        z.writestr(item, content)
with ZipFile(output) as z:
    assert z.testzip() is None and sha256(z.read(apk.name)).hexdigest() == expected
print(json.dumps(dict(file=output.name, bytes=output.stat().st_size, sha256=sha256(output.read_bytes()).hexdigest())))

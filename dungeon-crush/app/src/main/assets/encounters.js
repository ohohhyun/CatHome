/* Regional rosters and readable, deterministic attack identities shared by solo/LAN. */
(function(root){'use strict';
const NORMALS={
 knight:{skin:0,type:'knight',name:'잿빛 보병',kit:'strike',speed:130,height:225,color:'#df886a'},
 caster:{skin:1,type:'caster',name:'성역의 사술사',kit:'bolt',speed:115,height:225,color:'#bc99ff'},
 brute:{skin:2,type:'brute',name:'철갑 파괴병',kit:'slam',speed:85,height:280,color:'#d7ac73'},
 automaton:{skin:4,type:'brute',name:'증기 강습병',kit:'forge',speed:102,height:250,color:'#ffad59'},
 thornwolf:{skin:5,type:'knight',name:'가시 늑대',kit:'pounce',speed:170,height:170,color:'#94cc8a'},
 sandscorpion:{skin:6,type:'caster',name:'유리 독침전갈',kit:'venom',speed:110,height:185,color:'#edc575'},
 drownedwraith:{skin:7,type:'caster',name:'익사자의 원혼',kit:'tidebolt',speed:108,height:240,color:'#73d9e6'},
 runepuppet:{skin:8,type:'caster',name:'서고의 자동인형',kit:'runebolt',speed:105,height:205,color:'#d5c0ff'}
};
const BOSSES=[
 {skin:3,id:'guardian',kit:'guardian',color:'#d596ec',height:365,speed:100},
 {skin:9,id:'forgewarden',kit:'forge',color:'#ffa65f',height:350,speed:90},
 {skin:10,id:'thornqueen',kit:'roots',color:'#9ce2a7',height:340,speed:112},
 {skin:11,id:'crystalcolossus',kit:'crystal',color:'#85dff2',height:360,speed:82},
 {skin:12,id:'tideking',kit:'tide',color:'#6de0e2',height:350,speed:98},
 {skin:13,id:'stormharpy',kit:'storm',color:'#e5d3ff',height:320,speed:130},
 {skin:14,id:'chronoscribe',kit:'chrono',color:'#f0d18e',height:330,speed:105},
 {skin:15,id:'eclipseruler',kit:'eclipse',color:'#c395ff',height:365,speed:108}
];
const ROSTERS=[['caster','knight','brute','knight'],['automaton','knight','automaton','caster'],['thornwolf','caster','thornwolf','brute'],['sandscorpion','knight','sandscorpion','automaton'],['drownedwraith','knight','drownedwraith','brute'],['caster','thornwolf','runepuppet','knight'],['runepuppet','automaton','runepuppet','caster'],['brute','drownedwraith','runepuppet','knight']];
function theme(s){const d=root.RiftRPG.DUNGEONS[s.dungeon];return (d.chapter+(s.kind==='raid'?s.room-1:s.kind==='rift'?(s.tier-1)%8:0))%8;}
function pick(s,boss,index){const region=theme(s),part=root.RiftRPG.DUNGEONS[s.dungeon].part;
 if(boss){const b=BOSSES[region];return {...b,archetype:b.id,type:'boss',name:root.RiftRPG.DUNGEONS[region*3+part].boss,region,variant:part};}
 const key=ROSTERS[region][(index+s.room-1+part)%ROSTERS[region].length];return {...NORMALS[key],archetype:key,region,variant:part};}
function pattern(e,sequence){const kit=e.kit||'guardian',part=e.variant||0,phase=(sequence+part)%3;
 if(e.type!=='boss')return {kit,phase,kind:['bolt','venom','tidebolt','runebolt'].includes(kit)?'bolt':kit==='pounce'?'pounce':kit==='forge'?'forge':'strike',name:{pounce:'가시 도약',forge:'증기 망치',venom:'유리 독침',tidebolt:'심해 탄환',runebolt:'봉인 마탄'}[kit]||''};
 const variants={
 guardian:[['strike','bolt','triad'],['forge','triad','strike'],['triad','eclipse','fan']],
 forge:[['strike','forge','triad'],['forge','furnace','cross'],['furnace','forge','fan']],
 roots:[['pounce','roots','strike'],['roots','triad','pounce'],['roots','tide','pounce']],
 crystal:[['strike','cross','triad'],['cross','fan','triad'],['cross','eclipse','fan']],
 tide:[['bolt','triad','strike'],['tide','fan','triad'],['tide','chrono','fan']],
 storm:[['fan','strike','triad'],['fan','storm','cross'],['storm','fan','tide']],
 chrono:[['bolt','cross','chrono'],['chrono','triad','fan'],['chrono','eclipse','cross']],
 eclipse:[['strike','triad','fan'],['eclipse','fan','chrono'],['eclipse','storm','fan']]
 };
 const kind=(variants[kit]||variants.guardian)[part][phase];return {kit,phase,kind,name:{forge:'용광로 망치',furnace:'연쇄 분출',roots:'가시 뿌리',pounce:'포식 도약',cross:'수정 십자',tide:'심해의 물결',fan:'폭풍 부채탄',storm:'폭풍 낙뢰',chrono:'시간의 낙인',eclipse:'월식의 파동',triad:'삼중 강타',strike:'수호자의 일격',bolt:'공허 포격'}[kind]};}
function skins(s){const region=theme(s),boss=BOSSES[region].skin,onlyBoss=s.kind==='raid'&&s.players?.length===1&&(s.difficulty||0)<2;return [...new Set([boss,...(onlyBoss?[]:ROSTERS[region].map(key=>NORMALS[key].skin))])];}
const aimHeights={knight:145,caster:140,brute:174,automaton:155,thornwolf:90,sandscorpion:85,drownedwraith:150,runepuppet:135,guardian:226,forgewarden:220,thornqueen:185,crystalcolossus:225,tideking:220,stormharpy:210,chronoscribe:205,eclipseruler:230};
for(const [key,v]of Object.entries(NORMALS))v.aimHeight=aimHeights[key];for(const b of BOSSES)b.aimHeight=aimHeights[b.id];
root.DungeonEncounters={NORMALS,BOSSES,ROSTERS,pick,theme,pattern,skins};
})(typeof window!=='undefined'?window:globalThis);

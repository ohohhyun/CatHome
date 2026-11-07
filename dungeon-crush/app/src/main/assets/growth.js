/* Learnable level 60/80/100 skills with six freely configurable touch slots. */
(function(root){'use strict';
const data=[
 [{name:'용왕 흑염참',kind:'cone',damage:145,range:460,cost:31,cd:8},{name:'흑일 검진',kind:'circle',damage:225,range:480,cost:40,cd:12},{name:'종언 · 천뢰흑일',kind:'ultimate',damage:660,range:1000,cost:0,cd:1}],
 [{name:'백야 성창',kind:'line',damage:150,range:1000,cost:29,cd:7},{name:'월영 천추',kind:'rush',damage:210,range:650,cost:38,cd:11},{name:'천월 · 은하강림',kind:'ultimate',damage:620,range:1150,cost:0,cd:1}],
 [{name:'철혈 붕권',kind:'circle',damage:190,range:420,cost:30,cd:8},{name:'만상 중력장',kind:'pull',damage:240,range:570,cost:40,cd:13},{name:'멸성 · 천지분쇄',kind:'ultimate',damage:800,range:900,cost:0,cd:1}],
 [{name:'황혼 심판탄',kind:'line',damage:155,range:1400,cost:30,cd:8},{name:'공허 붕괴',kind:'circle',damage:220,range:1400,cost:40,cd:12},{name:'심연 · 성운종말',kind:'ultimate',damage:650,range:1450,cost:0,cd:1}],
 [{name:'홍련 성운',kind:'line',damage:170,range:1400,cost:32,cd:8},{name:'원소 천재',kind:'circle',damage:240,range:1400,cost:41,cd:13},{name:'천체 · 초신성붕괴',kind:'ultimate',damage:740,range:1500,cost:0,cd:1}],
 [{name:'성창 강림',kind:'line',damage:160,range:950,cost:30,cd:8},{name:'대성역',kind:'circle',damage:210,range:850,radius:360,sanctuary:true,cost:40,cd:14},{name:'천상 · 창세심판',kind:'ultimate',damage:680,range:1200,cost:0,cd:1}]
];
const LEVELS=[60,80,100],BINDS=[1,2,6],ids=['kael','rin','vein','sera','aria','elian'];
for(const list of data)list.forEach((s,i)=>Object.assign(s,{level:LEVELS[i],bind:BINDS[i],growth:i}));
function tier(level){return level>=100?4:level>=80?3:level>=60?2:level>=30?1:0;}
function skill(cls,level,index,kind){if(kind==='pvp')return null;const value=data[cls]?.find(s=>s.bind===index&&level>=s.level);return value?{...root.Rift.CLASSES[cls].skills[index-1],...value}:null;}
function visual(cls,level,code,kind){const value=code>=7?data[cls]?.[code-7]:null;return kind!=='pvp'&&value&&level>=value.level?value.growth:-1;}
function byCode(cls,code){return code>=7&&code<=9&&data[cls]?.[code-7]?{...data[cls][code-7]}:null;}
function all(cls){return (data[cls]||[]).map(s=>({...s}));}
root.DungeonGrowth={data,LEVELS,BINDS,ids,tier,skill,visual,byCode,all};
root.Rift.activeSkills=(cls,level=1,kind='story',codes=[1,2,3,4,5,6],ranks=Array(9).fill(1))=>Array.from({length:6},(_,i)=>root.Rift.skillFor({cls,level,loadout:codes,ranks},i+1,{kind}));
})(typeof window==='undefined'?globalThis:window);

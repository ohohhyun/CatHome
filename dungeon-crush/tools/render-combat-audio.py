"""Author short SFX and import licensed, nonverbal voice takes into offline source files.

Maintainer tool: requires ffmpeg and the original archives in --input. Builds only
decode the checked, committed base64 outputs; they do not need ffmpeg or this network.
"""
import argparse, base64, hashlib, io, json, math, random, struct, subprocess, wave, zipfile
from pathlib import Path

root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--input',type=Path,required=True);args=parser.parse_args()
source=root/'audio-source';source.mkdir(exist_ok=True)
work=args.input/'rendered';work.mkdir(exist_ok=True)
assets=[]
def encode(name,raw,rate,provenance,voice=False):
    # Constant gain preserves attack transients and natural pauses in real speech.
    values=list(struct.unpack('<'+'h'*(len(raw)//2),raw));peak=max(map(abs,values),default=1)/32768
    rms=math.sqrt(sum((x/32768)**2 for x in values)/max(1,len(values)))
    gain=min(.78/max(peak,.001),(.15 if voice else .18)/max(rms,.001))
    if voice:
        active=[i for i,x in enumerate(values) if abs(x)>170]
        if active:values=values[max(0,active[0]-int(rate*.025)):min(len(values),active[-1]+int(rate*.045))]
    for i,x in enumerate(values):
        fade=min(1,i/(rate*.005), (len(values)-1-i)/(rate*(.025 if voice else .012)))
        values[i]=round(max(-.88,min(.88,x/32768*gain*fade))*32767)
    wav=work/(name+'.wav')
    with wave.open(str(wav),'wb') as f:f.setparams((1,2,rate,0,'NONE','not compressed'));f.writeframes(struct.pack('<'+'h'*len(values),*values))
    output=work/(name+'.ogg')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-c:a','libvorbis','-q:a','4',str(output)],check=True)
    data=output.read_bytes();(source/(name+'.ogg.b64')).write_text(base64.b64encode(data).decode()+'\n')
    assets.append(dict(file=name+'.ogg',source=name+'.ogg.b64',sha256=hashlib.sha256(data).hexdigest(),bytes=len(data),duration=round(len(values)/rate,4),kind='voice' if voice else 'effect',**provenance))

male=zipfile.ZipFile(args.input/'male.zip');female=zipfile.ZipFile(args.input/'female.zip')
packs={
 'male':dict(author='Brandon Song (wolfwoot)',license='CC0-1.0',page='https://opengameart.org/content/voice-clip-pack-male-adventurer-rpg',archive_sha256=hashlib.sha256((args.input/'male.zip').read_bytes()).hexdigest()),
 'female':dict(author='cicifyre',license='CC0-1.0',page='https://opengameart.org/content/female-rpg-voice-starter-pack',archive_sha256=hashlib.sha256((args.input/'female.zip').read_bytes()).hexdigest())}
roles=[('kael','male',['attack0','attack1','attack3','attackbig3']),('rin','female',['Type 2/attack1','Type 2/attack2','Type 2/attack3']),('bane','male',['attackbig2','attackbig5','attackbig4','attackbig1']),('sera','female',['Type 3/attack1','Type 3/attack2','Type 3/attack3']),('aria','female',['Type 1/attack1','Type 1/attack2','Type 1/attack3']),('elian','male',['attack2','attack4','attack8','attack5'])]
for role,pack,takes in roles:
    for i,take in enumerate(takes,1):
        entry=('RPG Male Adventurer/' if pack=='male' else 'RPG Voice Starter Pack/')+take+'.wav'
        data=(male if pack=='male' else female).read(entry)
        result=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i','pipe:0','-ac','1','-ar','32000','-af','highpass=f=85,lowpass=f=10000','-f','s16le','pipe:1'],input=data,stdout=subprocess.PIPE,check=True)
        encode('voice-'+role+'-'+str(i),result.stdout,32000,{**packs[pack], 'entry':entry,'original_sha256':hashlib.sha256(data).hexdigest()},True)

# Original procedural sound design; no voice synthesis, borrowed game recordings or UI beeps.
specs={'blade-wave':(.38,180,1900),'spear-wind':(.29,420,2300),'fist-crack':(.20,95,1250),'earth-break':(.65,62,750),'gun-shot':(.19,105,4900),'gun-blast':(.58,65,2100),'arc-chain':(.43,900,6500),'fire-cast':(.50,95,1700),'ice-break':(.55,1250,7200),'arcane-wave':(.62,260,3100),'holy-cast':(.52,660,4200),'holy-hit':(.34,880,6000),'holy-heal':(.90,550,3800),'ward-rise':(.62,330,3200),'ultimate-burst':(1.12,48,1700)}
for index,(name,(duration,freq,cutoff)) in enumerate(specs.items()):
    rate=32000;rand=random.Random(41000+index);values=[];low=0;phase=0
    for i in range(round(rate*duration)):
        t=i/rate;u=t/duration;noise=rand.uniform(-1,1)
        sweep=cutoff*(1.2-.85*u);a=1-math.exp(-2*math.pi*sweep/rate);low+=a*(noise-low)
        env=(1-math.exp(-t*260))*math.exp(-u*(6 if name in ['gun-shot','fist-crack'] else 4))
        phase+=2*math.pi*freq*(1.4-.9*u)/rate
        body=math.sin(phase)*.48+math.sin(phase*.503)*.18
        if name.startswith('holy') or name=='ward-rise':
            env=(1-math.exp(-t*90))*math.exp(-u*4)
            chime=sum(math.sin(2*math.pi*freq*p*t)*math.exp(-t*(1+p*.7))/p for p in [1,2,2.997,4.003])*.35
            sample=(chime+low*.12)*env
        elif name in ['ice-break','arc-chain']:
            crystals=sum(math.sin(2*math.pi*(freq*p+math.sin(t*30)*50)*t)/p for p in [1,1.47,2.31,3.89])*.18
            crackle=noise*(.28 if rand.random()>.95 else .015)
            sample=(crystals+crackle+low*.45)*env
        elif name in ['blade-wave','spear-wind','arcane-wave']:
            whoosh=math.sin(math.pi*min(1,u*1.7))**1.6
            sample=low*whoosh*.85+body*.11*env
        else:
            rumble=body*.55+low*.85+(noise-low)*(.3 if name=='gun-shot' else .08)
            sample=math.tanh(rumble*1.2)*env
            if name=='ultimate-burst':sample+=low*.35*math.exp(-((u-.32)/.13)**2)
        values.append(round(max(-.98,min(.98,sample))*32767))
    encode(name,struct.pack('<'+'h'*len(values),*values),rate,dict(author='Dungeon Crush sound design',license='CC0-1.0',recipe='tools/render-combat-audio.py'))

# The source WAV is already seamlessly looped. Apply constant gain, with no end fades.
original=args.input/'boss-original.wav';boss=work/'boss.ogg'
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(original),'-af','volume=0.7','-ar','44100','-c:a','libvorbis','-q:a','4',str(boss)],check=True)
data=boss.read_bytes();(source/'boss.ogg.b64').write_text(base64.b64encode(data).decode()+'\n')
duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(boss)],text=True))
assets.append(dict(file='boss.ogg',source='boss.ogg.b64',sha256=hashlib.sha256(data).hexdigest(),bytes=len(data),duration=duration,kind='music',author='Juhani Junkala (SubspaceAudio)',license='CC0-1.0',page='https://opengameart.org/content/boss-battle-music',original_sha256=hashlib.sha256(original.read_bytes()).hexdigest(),original_url='https://opengameart.org/sites/default/files/Juhani%20Junkala%20-%20Epic%20Boss%20Battle%20%5BSeamlessly%20Looping%5D.wav',processing='Constant gain 0.7; Ogg Vorbis quality 4, 44.1kHz; original seamless loop retained'))
(root/'combat-audio-sources.json').write_text(json.dumps(dict(version=1,assets=assets),ensure_ascii=False,indent=2)+'\n')
print('Prepared',len(assets),'offline assets:',sum(a['bytes'] for a in assets),'bytes')

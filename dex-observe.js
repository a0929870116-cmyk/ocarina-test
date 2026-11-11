/* 圖鑑「互動觀察」(C)：從 A 圖鑑書頁的植物卡進入。
   目前只有第 9 島「音符花」（點一下發亮的花，依序彈出一小段旋律；不需麥克風）。
   螢光蕨（5）、月光睡蓮（2）之後加進 GAMES。
   規則（使用者 11/11 19:40）：吹滿／彈完只有動畫，沒有任何獎勵數字；不記錄完成、不新增存檔。
   用法：DexObserve.has(n) / open(n,{note,onOpen,onClose}) / close() / isOpen() */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);};

/* ---------- 音效：Web Audio 合成，像小鐘琴 ---------- */
var ctx=null,master=null;
var played=[];                       /* 測試用：記錄實際發出的頻率 */
function audio(){
  if(!ctx){
    var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
    ctx=new AC();
    var comp=ctx.createDynamicsCompressor();master=ctx.createGain();master.gain.value=.55;
    master.connect(comp);comp.connect(ctx.destination);
  }
  if(ctx.state==='suspended'){try{ctx.resume();}catch(e){}}
  return ctx;
}
function tone(f,delay,dur,vol){
  played.push(Math.round(f*100)/100);
  var c=audio();if(!c)return;
  var t0=c.currentTime+(delay||0),d=dur||1.3,v=vol==null?.5:vol;
  var g=c.createGain();g.gain.setValueAtTime(0.0001,t0);
  g.gain.linearRampToValueAtTime(v,t0+.008);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+d);
  g.connect(master);
  [[1,'sine',1],[2,'triangle',.22],[3,'sine',.07]].forEach(function(p){
    var o=c.createOscillator(),og=c.createGain();
    o.type=p[1];o.frequency.value=f*p[0];og.gain.value=p[2];
    o.connect(og);og.connect(g);o.start(t0);o.stop(t0+d+.05);
  });
}

/* ---------- 音符花：do do sol sol la la sol（小星星前半句） ---------- */
var NOTE={C5:523.25,E5:659.25,G5:783.99,A5:880,C6:1046.5};
var MELODY=[['C5','do',0],['C5','do',0],['G5','sol',1],['G5','sol',1],['A5','la',2],['A5','la',2],['G5','sol',1]];
var LV=[0,44,72];                    /* 音越高，花越高（像音符站在五線譜上） */

function flowerSVG(){
  return '<svg viewBox="0 0 64 84" aria-hidden="true">'
   +'<ellipse cx="32" cy="79" rx="15" ry="3" fill="#000" opacity=".25"/>'
   +'<path d="M29 79C29 64 33 50 38 33" fill="none" stroke="#5aa86a" stroke-width="3.4" stroke-linecap="round"/>'
   +'<path d="M30 70C21 70 17 65 16 61C25 61 29 64 30 70Z" fill="#8ed17a" stroke="#4a2f1a" stroke-width="2" stroke-linejoin="round"/>'
   +'<g class="ob-bud"><path class="ob-fl" d="M42.5 28V9" fill="none" stroke="#4a2f1a" stroke-width="2.6" stroke-linecap="round"/>'
   +'<path class="ob-flag" d="M42.5 9C49 10 52 15 51 21C48 16 46 15 42.5 14Z" stroke="#4a2f1a" stroke-width="2" stroke-linejoin="round"/>'
   +'<ellipse class="ob-head" cx="36" cy="30" rx="9.5" ry="7" transform="rotate(-24 36 30)" stroke="#4a2f1a" stroke-width="2.2"/></g>'
   +'<path class="ob-spk" d="M20 22q0-4 4-4q-4 0-4-4q0 4-4 4q4 0 4 4Z" fill="#fff3a8"/>'
   +'</svg>';
}

var CSS=''
+'#ob{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:var(--vellum-2,#F9F0D6);color:var(--ink,#3A2A1A);overscroll-behavior:contain}'
+'#ob[hidden]{display:none}'
+'.ob-top{flex:none;display:flex;align-items:center;gap:10px;padding:calc(8px + env(safe-area-inset-top,0px)) 14px 8px;max-width:520px;width:100%;margin:0 auto;box-sizing:border-box}'
+'.ob-back{flex:none;width:44px;height:44px;border:2.5px solid var(--ink,#3A2A1A);border-radius:50%;background:var(--vellum,#EFE1BF);color:var(--ink,#3A2A1A);font-size:30px;line-height:1;padding:0 0 4px;cursor:pointer;box-shadow:0 3px 0 var(--shadow,#BFA470),inset 0 0 0 2px var(--gold,#C8963A)}'
+'.ob-ttl{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}.ob-ttl b{font-family:var(--font-head,inherit);font-size:20px}.ob-ttl small{font-size:12.5px;color:var(--ink-2,#6E5337)}'
+'.ob-body{flex:1;min-height:0;overflow-y:auto;padding:4px 14px 14px;display:flex;flex-direction:column;gap:12px;max-width:520px;width:100%;margin:0 auto;box-sizing:border-box}'
+'.ob-stage{position:relative;flex:none;height:clamp(264px,38vh,340px);border:2.5px solid var(--ink,#3A2A1A);border-radius:14px;overflow:hidden;background:linear-gradient(#0e1634 0%,#2a2058 55%,#4a2f6e 100%);box-shadow:inset 0 0 0 3px #1b1440,inset 0 0 0 4.5px var(--gold,#C8963A);user-select:none;-webkit-user-select:none;touch-action:manipulation}'
+'.ob-sky{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(1.6px 1.6px at 12% 18%,#fff 98%,transparent),radial-gradient(1.2px 1.2px at 27% 42%,#ffe9a8 98%,transparent),radial-gradient(2px 2px at 41% 12%,#fff 98%,transparent),radial-gradient(1.2px 1.2px at 56% 33%,#ffe9a8 98%,transparent),radial-gradient(1.6px 1.6px at 68% 15%,#fff 98%,transparent),radial-gradient(1.2px 1.2px at 80% 48%,#fff 98%,transparent),radial-gradient(1.6px 1.6px at 90% 30%,#ffe9a8 98%,transparent),radial-gradient(1.2px 1.2px at 7% 52%,#ffe9a8 98%,transparent),radial-gradient(1.6px 1.6px at 34% 62%,#fff 98%,transparent),radial-gradient(1.2px 1.2px at 74% 66%,#ffe9a8 98%,transparent);animation:obtw 3.2s ease-in-out infinite}'
+'.ob-moon{position:absolute;right:22px;top:20px;width:34px;height:34px;border-radius:50%;background:#fff6c9;box-shadow:0 0 22px 6px rgba(255,240,170,.45);pointer-events:none}'
+'.ob-moon:after{content:"";position:absolute;left:9px;top:-3px;width:30px;height:30px;border-radius:50%;background:#1a1646}'
+'.ob-grass{position:absolute;left:0;right:0;bottom:0;height:38px;background:linear-gradient(#2c4a3a,#18301f);border-top:2px solid #5aa86a;pointer-events:none}'
+'.ob-row{position:absolute;left:10px;right:10px;bottom:26px;display:flex;align-items:flex-end;gap:2px}'
+'.ob-f{position:relative;flex:1 1 0;min-width:0;max-width:66px;padding:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}'
+'.ob-f svg{display:block;width:100%;height:auto;overflow:visible;transition:filter .25s}'
+'.ob-head{fill:#5f6f98;transition:fill .25s}.ob-flag{fill:#7d8bb0;transition:fill .25s}.ob-spk{opacity:0}'
+'.ob-f.on .ob-head{fill:#c77dff}.ob-f.on .ob-flag{fill:#e1b3ff}'
+'.ob-f.on svg{filter:drop-shadow(0 0 7px rgba(214,150,255,.95))}'
+'.ob-f.on .ob-spk{opacity:1;animation:obtw 1.6s ease-in-out infinite}'
+'.ob-f.next:before{content:"";position:absolute;left:50%;top:18%;width:78%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,0);border:2.5px solid #ffe38a;box-shadow:0 0 12px 2px rgba(255,227,138,.7);animation:obpulse 1.2s ease-out infinite;pointer-events:none}'
+'.ob-f.next .ob-head{fill:#8f7fd0}'
+'.ob-f.pop svg{animation:obpop .42s ease-out}'
+'.ob-f.wig svg{animation:obwig .35s ease-in-out}'
+'.ob-stage.done .ob-f svg{animation:obwave 1.1s ease-in-out infinite;animation-delay:calc(var(--i)*.09s)}'
+'.ob-pt{position:absolute;pointer-events:none;font-size:22px;line-height:1;color:#ffe9a8;text-shadow:0 0 8px rgba(255,220,120,.9);animation:obrise 1.3s ease-out forwards}'
+'.ob-stat{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--ink-2,#6E5337)}'
+'.ob-seg{flex:1;display:flex;gap:4px}.ob-seg i{flex:1;height:10px;border:2px solid var(--ink,#3A2A1A);border-radius:99px;background:var(--vellum,#EFE1BF);transition:background .25s}.ob-seg i.on{background:#9b5fd6}'
+'.ob-hint{margin:0;text-align:center;font-family:var(--font-head,inherit);font-size:20px;line-height:1.4;min-height:1.4em}'
+'.ob-card{background:var(--vellum,#EFE1BF);border:2px solid var(--ink,#3A2A1A);border-radius:12px;padding:12px 14px;box-shadow:inset 0 0 0 3px var(--vellum-2,#F9F0D6),inset 0 0 0 4.5px rgba(217,178,91,.7)}'
+'.ob-card small{display:block;font-size:12.5px;font-weight:700;color:var(--ink-2,#6E5337);margin-bottom:2px}.ob-card p{margin:0;font-size:16.5px;line-height:1.6}'
+'.ob-btns{display:flex;gap:10px}.ob-btns button{flex:1;min-height:48px;border:2.5px solid var(--ink,#3A2A1A);border-radius:12px;font:inherit;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 3px 0 var(--shadow,#BFA470)}'
+'.ob-btns .a{background:var(--green,#2E5B46);color:var(--green-fg,#F6E7B4)}.ob-btns .b{background:var(--vellum,#EFE1BF);color:var(--ink,#3A2A1A)}'
+'@keyframes obpulse{0%{transform:translate(-50%,0) scale(.8);opacity:1}100%{transform:translate(-50%,0) scale(1.25);opacity:0}}'
+'@keyframes obpop{0%{transform:scale(1)}35%{transform:scale(1.28) translateY(-6px)}100%{transform:scale(1)}}'
+'@keyframes obwig{0%,100%{transform:rotate(0)}25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}'
+'@keyframes obwave{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}'
+'@keyframes obrise{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:1}100%{transform:translateY(-110px) scale(1.15);opacity:0}}'
+'@keyframes obtw{0%,100%{transform:scale(.8);opacity:.5}50%{transform:scale(1.2);opacity:1}}'
+'@media (prefers-reduced-motion:reduce){.ob-f.next:before,.ob-f.on .ob-spk,.ob-stage.done .ob-f svg{animation:none}}';

/* ---------- 畫面 ---------- */
var el=null,S=null,opts=null,openFlag=false;

function build(){
  if(el)return;
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  el=document.createElement('div');el.id='ob';el.hidden=true;
  el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','ob-title');
  el.innerHTML=
   '<header class="ob-top"><button class="ob-back" id="ob-close" aria-label="返回">‹</button>'
  +'<div class="ob-ttl"><b id="ob-title">互動觀察</b><small id="ob-sub"></small></div></header>'
  +'<div class="ob-body" id="ob-body"></div>';
  document.body.appendChild(el);
  $('#ob-close',el).addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(openFlag&&e.key==='Escape'){e.stopPropagation();close();}},true);
}

function newState(){return {step:0,done:false};}

function renderPlant(){
  var h='';
  MELODY.forEach(function(m,i){
    h+='<button class="ob-f" data-k="'+i+'" style="margin-bottom:'+LV[m[2]]+'px;--i:'+i+'" aria-label="第 '+(i+1)+' 朵音符花，唱「'+m[1]+'」">'+flowerSVG()+'</button>';
  });
  var seg='';for(var i=0;i<MELODY.length;i++)seg+='<i></i>';
  $('#ob-body',el).innerHTML=
   '<div class="ob-stage" id="ob-stage"><div class="ob-sky"></div><div class="ob-moon"></div><div class="ob-grass"></div>'
  +'<div class="ob-row" id="ob-row">'+h+'</div></div>'
  +'<p class="ob-hint" id="ob-hint"></p>'
  +'<div class="ob-stat"><span id="ob-cnt"></span><div class="ob-seg" id="ob-seg">'+seg+'</div></div>'
  +'<div class="ob-card"><small>觀察筆記</small><p>'+((opts&&opts.note)||'')+'</p></div>'
  +'<div class="ob-btns"><button class="b" id="ob-again">再彈一次</button><button class="a" id="ob-intro">看介紹</button></div>';
  $('#ob-row',el).addEventListener('click',onTap);
  $('#ob-again',el).addEventListener('click',reset);
  $('#ob-intro',el).addEventListener('click',close);
  sync();
}

function flowers(){return el.querySelectorAll('.ob-f');}

function sync(msg){
  var n=MELODY.length;
  Array.prototype.forEach.call(flowers(),function(f,i){
    f.classList.toggle('on',i<S.step);
    f.classList.toggle('next',!S.done&&i===S.step);
  });
  Array.prototype.forEach.call(el.querySelectorAll('#ob-seg i'),function(b,i){b.classList.toggle('on',i<S.step);});
  $('#ob-cnt',el).textContent='已彈 '+S.step+'／'+n;
  $('#ob-stage',el).classList.toggle('done',S.done);
  $('#ob-hint',el).textContent=msg||(S.done?'花園的歌，彈完了！':S.step===0?'點一下發亮的那朵花。':'很好，再點下一朵。');
}

function particle(f,txt){
  var st=$('#ob-stage',el),r=f.getBoundingClientRect(),sr=st.getBoundingClientRect();
  var p=document.createElement('span');p.className='ob-pt';p.textContent=txt||(Math.random()<.5?'♪':'♫');
  p.style.left=(r.left-sr.left+r.width*(.35+Math.random()*.3))+'px';
  p.style.top=(r.top-sr.top+r.height*.2)+'px';
  st.appendChild(p);setTimeout(function(){p.remove();},1400);
}
function anim(f,cls){f.classList.remove(cls);void f.offsetWidth;f.classList.add(cls);setTimeout(function(){f.classList.remove(cls);},500);}

function onTap(e){
  var f=e.target.closest('.ob-f');if(!f)return;
  var k=+f.dataset.k,m=MELODY[k],fr=NOTE[m[0]];
  if(S.done||k<S.step){tone(fr,0,1.1,.4);anim(f,'pop');particle(f);return;}   /* 彈完或已亮的花：自由彈，不影響進度 */
  if(k!==S.step){tone(fr,0,.7,.14);anim(f,'wig');sync('點發亮的那一朵。');return;}   /* 還沒輪到：輕輕響一下、搖一搖 */
  tone(fr,0,1.3,.5);anim(f,'pop');particle(f);
  S.step++;
  if(S.step>=MELODY.length){S.done=true;sync();finale();}else sync();
}

function finale(){
  /* 琴音彈完：短短一串琶音＋整排花一起發亮飄音符（只有動畫，沒有獎勵） */
  ['C5','E5','G5','C6'].forEach(function(n,i){tone(NOTE[n],.28+i*.11,1.8,.34);});
  var fs=flowers();
  Array.prototype.forEach.call(fs,function(f,i){setTimeout(function(){if(openFlag){particle(f,i%2?'♫':'♪');if(i%3===0)particle(f,'✦');}},300+i*90);});
}

function reset(){S=newState();sync();}

function has(n){return n===9;}
function open(n,o){
  if(!has(n))return;
  build();opts=o||{};S=newState();
  var A=window.ISLE_ART&&ISLE_ART.data[n-1];
  $('#ob-title',el).textContent='點點'+(A?A.plant:'音符花');
  $('#ob-sub',el).textContent='互動觀察'+(A?'・第 '+n+' 島 '+A.isle:'');
  renderPlant();
  el.hidden=false;openFlag=true;
  try{opts.onOpen&&opts.onOpen();}catch(e){}
}
function close(){
  if(!openFlag)return;
  el.hidden=true;openFlag=false;
  try{opts&&opts.onClose&&opts.onClose();}catch(e){}
}

window.DexObserve={has:has,open:open,close:close,isOpen:function(){return openFlag;},_played:played,_state:function(){return S;}};
})();

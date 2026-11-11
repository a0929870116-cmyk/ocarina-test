/* 12 座島的動物、植物與晶體圖示（SVG，暫定外型）。
   game-test.html（圖鑑）、ship-workshop.html（晶體）、isle-art-preview.html（預覽）共用。
   用法：ISLE_ART.plant(n,px) / animal(n,px) / crystal(n,px) 回傳 SVG 字串；crystalInner(n) 回傳 32x32 座標的內容（可嵌進別的 SVG）。 */
(function(){
'use strict';
const K='#4a2f1a';
/* ---- 各島資料（名稱第 5～12 島為暫擬） ---- */
const DATA=[
 {n:1,isle:'星光草原',plant:'星光草',animal:'毛球精靈',cid:'stardust',crystal:'星塵',c:'#f2c94c'},
 {n:2,isle:'月光湖',plant:'月光睡蓮',animal:'月亮魚',cid:'moonwater',crystal:'月光水',c:'#8fc1ff'},
 {n:3,isle:'彩虹雲島',plant:'彩虹苔',animal:'彩色小鳥',cid:'rainbow',crystal:'彩虹絲',c:'#ff8ad0'},
 {n:4,isle:'棉花雲島',plant:'雲絮花',animal:'小雲羊',cid:'cloud',crystal:'雲絮',c:'#dfe6f7'},
 {n:5,isle:'山谷河流',plant:'螢光蕨',animal:'螢火蟲',cid:'glowdew',crystal:'螢光露',c:'#7be0a0'},
 {n:6,isle:'燈籠森林',plant:'燈籠果',animal:'小蘑菇怪',cid:'lantern',crystal:'燈籠火',c:'#ff9a3d'},
 {n:7,isle:'星系燈塔',plant:'星塵花',animal:'小貓頭鷹',cid:'core',crystal:'星核砂',c:'#a3b1c6'},
 {n:8,isle:'海灘',plant:'海玻璃草',animal:'寄居蟹',cid:'seaglass',crystal:'海玻璃',c:'#3fc6c6'},
 {n:9,isle:'音符花園',plant:'音符花',animal:'蜜蜂',cid:'note',crystal:'音符晶',c:'#c77dff'},
 {n:10,isle:'極光冰原',plant:'極光冰花',animal:'小企鵝',cid:'aurora',crystal:'極光冰',c:'#7fe0ff'},
 {n:11,isle:'山頂星峰',plant:'星峰雪蓮',animal:'雪山羊',cid:'peak',crystal:'星峰石',c:'#c98b63'},
 {n:12,isle:'神祕城堡',plant:'影子玫瑰',animal:'小蝙蝠',cid:'ruby',crystal:'城堡紅玉',c:'#c0304f'}
];
/* ---- 小工具 ---- */
const P=(d,f,x)=>`<path d="${d}" fill="${f}" stroke="${K}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"${x||''}/>`;
const L=(d,s,w)=>`<path d="${d}" fill="none" stroke="${s||K}" stroke-width="${w||2.2}" stroke-linecap="round" stroke-linejoin="round"/>`;
const C=(x,y,r,f,sw)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${sw===0?'none':K}" stroke-width="${sw||2.2}"/>`;
const E=(x,y,rx,ry,f,rot,sw)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${sw===0?'none':K}" stroke-width="${sw||2.2}"${rot?` transform="rotate(${rot} ${x} ${y})"`:''}/>`;
const eye=(x,y,r)=>{r=r||2.5;return `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/><circle cx="${x+r*.35}" cy="${y-r*.4}" r="${r*.38}" fill="#fff"/>`;};
const blush=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="#ff9aa8" opacity=".7"/>`;
const star=(x,y,r,f,sw)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+','+(y+Math.sin(a)*rr).toFixed(1);}return `<path d="${d}Z" fill="${f}" stroke="${sw===0?'none':K}" stroke-width="${sw||1.6}" stroke-linejoin="round"/>`;};
const spark=(x,y,r,f)=>`<path d="M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}Z" fill="${f||'#fff3a8'}"/>`;
const ground=(c)=>`<ellipse cx="32" cy="57" rx="20" ry="3.2" fill="${c||'#000'}" opacity=".12"/>`;
const bez=(p0,p1,p2,t)=>[(1-t)*(1-t)*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)*(1-t)*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]];
const bezT=(p0,p1,p2,t)=>{const dx=2*(1-t)*(p1[0]-p0[0])+2*t*(p2[0]-p1[0]),dy=2*(1-t)*(p1[1]-p0[1])+2*t*(p2[1]-p1[1]);return Math.atan2(dy,dx)*180/Math.PI;};
const svg=(inner,px,vb)=>`<svg viewBox="${vb||'0 0 64 64'}" width="${px||64}" height="${px||64}" role="img" aria-hidden="true">${inner}</svg>`;

/* ================= 植物 ================= */
const PLANT={
1:()=>ground('#3a7a2f')+P('M32 56C28 42 23 32 17 20C26 28 31 40 32 56Z','#9be08a')+P('M32 56C31 40 33 26 37 12C41 27 38 42 32 56Z','#78c96b')+P('M33 56C37 44 43 36 50 28C47 40 40 50 33 56Z','#9be08a')
  +star(17,15,5.5,'#ffe066')+star(38,8,4.6,'#ffe066')+star(51,23,4,'#ffe066')+spark(26,30,3)+spark(46,44,2.6),
2:()=>`<ellipse cx="32" cy="52" rx="26" ry="6" fill="#7fb8e8" opacity=".5"/>`+E(32,50,20,6,'#4fa38a')+L('M32 50L46 47','#2f6e5b',1.6)
  +P('M32 46C22 42 19 32 26 24C29 32 32 38 32 46Z','#eae6ff')+P('M32 46C42 42 45 32 38 24C35 32 32 38 32 46Z','#eae6ff')+P('M32 46C26 38 27 26 32 18C37 26 38 38 32 46Z','#fff')
  +C(32,44,2.6,'#ffd86b',1.6)+P('M49 10A9 9 0 1 0 56 26A7.5 7.5 0 1 1 49 10Z','#ffe9a8')+spark(14,20,3)+spark(18,10,2.2),
3:()=>ground('#6b5aa8')+[['#ff7a7a',27],['#ffb35c',23],['#ffe066',19],['#8ed17a',15],['#6bb5ff',11],['#b79cff',7]].map(([c,w],i)=>`<path d="M${32-w} 54A${w} ${w*.95} 0 0 1 ${32+w} 54Z" fill="${c}" stroke="${i?'none':K}" stroke-width="2.2" stroke-linejoin="round"/>`).join('')
  +L('M5 54H59',K,2.2)+C(22,34,1.4,'#fff',0)+C(40,30,1.2,'#fff',0)+C(31,22,1.5,'#fff',0)+spark(50,24,3)+spark(12,26,2.4),
4:()=>ground('#8aa0d8')+L('M32 56C32 46 31 40 32 32','#5aa86a',3.4)+P('M32 50C24 50 20 44 18 40C26 40 30 44 32 50Z','#8ed17a')+P('M32 46C40 46 44 41 46 37C38 37 34 41 32 46Z','#8ed17a')
  +C(22,24,8,'#fff')+C(42,24,8,'#fff')+C(32,14,8.5,'#fff')+C(25,34,7.5,'#fff')+C(39,34,7.5,'#fff')+C(32,25,7,'#fff')+C(32,25,3.3,'#ffe28a',1.8)+spark(10,12,2.6,'#fff')+spark(54,10,2.2,'#fff'),
5:()=>{const p0=[30,57],p1=[28,28],p2=[48,9];let s=L(`M${p0}Q${p1} ${p2}`,'#2f8c5a',3.2);for(let i=1;i<=7;i++){const t=i/8,[x,y]=bez(p0,p1,p2,t),a=bezT(p0,p1,p2,t),sc=1-t*.55;[1,-1].forEach(sd=>{s+=E(x,y,9*sc,3.6*sc,'#7be0a0',a+sd*52+0,2);});}
  return ground('#1f6b3a')+s+C(44,22,1.6,'#f4ff9a',0)+C(24,26,1.5,'#f4ff9a',0)+C(38,40,1.7,'#f4ff9a',0)+C(20,44,1.5,'#f4ff9a',0)+C(50,12,2,'#f4ff9a',0);},
6:()=>`<circle cx="32" cy="32" r="22" fill="#ffd08a" opacity=".4"/>`+L('M32 3V14','#6b4a2f',2.6)+P('M26 14H38L36 19H28Z','#b9833f')+P('M22 29C22 19 42 19 42 29C42 41 36 49 32 49C28 49 22 41 22 29Z','#ff9a3d')+L('M32 19V49M26 21C22 31 25 42 30 48M38 21C42 31 39 42 34 48','#d96a14',1.6)
  +P('M28 49H36L34 53H30Z','#b9833f')+L('M32 53V58','#6b4a2f',2.2)+star(32,58,2.5,'#ffe066',0)+P('M40 14C48 12 52 16 52 22C44 22 40 19 40 14Z','#7bc96b')+spark(20,22,2.6,'#fff3a8'),
7:()=>ground('#4a4a9a')+L('M32 56V32','#5aa86a',3.2)+P('M32 50C24 50 20 45 19 41C27 41 31 44 32 50Z','#8ed17a')+P('M32 46C40 46 44 42 45 38C37 38 33 41 32 46Z','#8ed17a')
  +[0,72,144,216,288].map(a=>E(32+Math.cos((a-90)*Math.PI/180)*10,22+Math.sin((a-90)*Math.PI/180)*10,6.5,10,'#b8c6ff',a)).join('')+star(32,22,7.5,'#ffe066',1.8)+spark(10,14,2.6)+spark(54,28,2.4)+spark(50,8,2),
8:()=>ground('#2b8c8c')+P('M14 56C14 44 11 36 8 28C16 34 20 44 20 56Z','#4fc3b5')+P('M24 56C22 40 24 28 28 16C33 30 32 44 28 56Z','#38b0a2')+P('M40 56C42 44 46 36 52 30C52 42 48 50 44 56Z','#4fc3b5')
  +P('M44 48L51 44L54 51L47 55Z','#a7efe6','')+P('M12 52L19 49L21 55L14 57Z','#c9f6f0')+P('M30 52L36 48L39 54L32 57Z','#8fe3d8')+spark(36,20,2.6),
9:()=>ground('#7a4fb0')+L('M30 57C30 44 33 32 38 20','#5aa86a',3.2)+P('M31 50C22 50 18 45 17 41C26 41 30 44 31 50Z','#8ed17a')+P('M32 44C41 44 45 40 46 36C37 36 33 39 32 44Z','#8ed17a')
  +E(36,19,7.5,5.6,'#c77dff',-24)+L('M42.5 17V6','#4a2f1a',2.6)+P('M42.5 6C48 7 51 11 50 16C48 12 46 11 42.5 10Z','#e1b3ff')+spark(18,16,2.6,'#fff')+spark(52,34,2.4,'#fff')+L('M22 28q3-3 6 0',K,1.6),
10:()=>`<path d="M4 22C16 6 30 24 42 10C50 4 56 8 60 14" fill="none" stroke="#7bf0b8" stroke-width="5" opacity=".55" stroke-linecap="round"/><path d="M4 30C16 16 30 32 42 20C50 14 56 18 60 24" fill="none" stroke="#ff9fdc" stroke-width="3.4" opacity=".5" stroke-linecap="round"/>`
  +L('M32 57V38','#6fbcd6',3)+[0,60,120,180,240,300].map(a=>`<g transform="rotate(${a} 32 36)">${P('M32 36L28 24L32 12L36 24Z','#bff3ff')}</g>`).join('')+C(32,36,4,'#fff',2)+spark(12,44,3,'#e6faff')+spark(52,48,2.6,'#e6faff'),
11:()=>`<path d="M3 57L22 22L34 40L42 28L61 57Z" fill="#a9b3c6" stroke="${K}" stroke-width="2.2" stroke-linejoin="round"/><path d="M22 22L16.5 32L22 29L27 33Z" fill="#fff"/><path d="M42 28L37 36L42 34L47 38Z" fill="#fff"/>`
  +L('M32 57V42','#5aa86a',3)+[-62,-31,0,31,62].map(a=>`<g transform="rotate(${a} 32 42)">${P('M32 42C27 36 28 28 32 22C36 28 37 36 32 42Z','#fff')}</g>`).join('')+C(32,40,3,'#ffd86b',1.8)+spark(54,18,3)+spark(10,14,2.4),
12:()=>`<circle cx="32" cy="26" r="22" fill="#9a5fd8" opacity=".3"/>`+L('M32 57C32 47 33 40 32 34','#2f5a3a',3.4)+P('M33 50C41 50 46 46 47 41C39 41 35 44 33 50Z','#3f7a4a')+P('M31 44C24 44 20 40 19 36C26 36 30 39 31 44Z','#3f7a4a')
  +L('M32 48l4-3M32 41l-4-3',K,1.6)+C(32,24,13,'#7a2f5e')+P('M32 14C40 14 44 22 38 28C34 31 28 28 29 23C30 19 35 19 36 23','#a8447f')+L('M32 14C22 16 19 28 28 34M45 22C46 30 40 36 32 35','#4a1a3a',1.8)+spark(10,18,3,'#d9b8ff')+spark(54,30,2.6,'#d9b8ff')+spark(48,8,2.2,'#d9b8ff')
};

/* ================= 動物 ================= */
const ANIMAL={
1:()=>ground('#8a6a1a')+Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2;return C(32+Math.cos(a)*19,34+Math.sin(a)*17,7,'#ffd36e',2);}).join('')+C(32,34,19,'#ffd36e',0)
  +E(23,54,4.6,3,'#e0a93a')+E(41,54,4.6,3,'#e0a93a')+eye(25,32,3.2)+eye(39,32,3.2)+blush(20,39)+blush(44,39)+L('M29 39q3 3 6 0',K,2)+L('M32 15V8','#6b4a2f',2)+star(32,7,4.4,'#fff3a8',1.4),
2:()=>`<circle cx="14" cy="14" r="2.2" fill="#fff" opacity=".7"/><circle cx="20" cy="8" r="1.6" fill="#fff" opacity=".7"/>`+P('M10 36C10 22 24 16 38 20C48 23 52 30 52 36C52 42 48 49 38 52C24 55 10 50 10 36Z','#a9c7ff')
  +P('M50 36L61 24L58 36L61 48Z','#7ea6f0')+P('M28 21C34 12 42 14 44 22Z','#7ea6f0')+P('M22 50C26 58 34 58 36 52Z','#7ea6f0')+P('M22 30A8 8 0 1 0 28 44A6.4 6.4 0 1 1 22 30Z','#ffe9a8')+eye(18,33,2.8)+blush(15,40)+L('M13 40q3 3 6 1',K,1.8),
3:()=>ground('#c0507a')+P('M44 40L60 30L58 40L62 48L46 46Z','#6bb5ff')+P('M44 42L58 38L56 46Z','#8ed17a')+P('M44 38L56 26L56 36Z','#ffb35c')+E(30,38,17,15,'#ff9ec4')
  +P('M16 36C16 28 24 26 28 32L22 46C18 44 16 40 16 36Z','#ffe066')+E(32,40,10,7,'#ff7aa8',-20)+C(22,28,9,'#ff9ec4')+P('M13 28L5 31L13 34Z','#ffb35c')+eye(21,26,2.6)+blush(25,33)+P('M24 20L25 13L29 19Z','#ff7aa8')+L('M26 52V57M34 52V57',K,2.2),
4:()=>ground('#6a7ad0')+E(24,52,3,4,'#cfd8ff')+E(40,52,3,4,'#cfd8ff')+C(18,34,11,'#fff')+C(46,34,11,'#fff')+C(26,24,11,'#fff')+C(40,24,11,'#fff')+C(32,38,14,'#fff')+C(32,30,13,'#fff',0)
  +E(32,36,13,11,'#cfd8ff')+P('M21 28C19 22 22 19 25 22','#cfd8ff','')+P('M43 28C45 22 42 19 39 22','#cfd8ff','')+eye(27,34,2.8)+eye(37,34,2.8)+blush(23,40)+blush(41,40)+L('M29 41q3 3 6 0',K,2)+spark(10,14,2.4,'#fff')+spark(56,12,2,'#fff'),
5:()=>`<circle cx="32" cy="38" r="22" fill="#fff27a" opacity=".3"/><circle cx="32" cy="38" r="14" fill="#fff27a" opacity=".3"/>`+E(18,24,9,5,'#e6f4ff',-30)+E(46,24,9,5,'#e6f4ff',30)
  +E(32,44,10,12,'#fff27a')+E(32,31,8.5,7.5,'#6b4a2f')+L('M26 30Q23 20 18 17M38 30Q41 20 46 17',K,2)+C(18,17,1.8,'#fff27a',1.4)+C(46,17,1.8,'#fff27a',1.4)+eye(28,30,2.2)+eye(36,30,2.2)+L('M29 36q3 2 6 0',K,1.6)+L('M24 38L18 41M40 38L46 41M25 46L20 51M39 46L44 51',K,2),
6:()=>ground('#8a2a10')+P('M24 56L26 44H38L40 56Z','#fff0cf')+E(25,56,4.4,2.6,'#fff0cf')+E(39,56,4.4,2.6,'#fff0cf')+P('M10 40C10 20 22 8 32 8C42 8 54 20 54 40C54 44 50 44 46 42H18C14 44 10 44 10 40Z','#e8643c')
  +C(22,22,4.4,'#fff4dc',1.8)+C(40,18,3.4,'#fff4dc',1.8)+C(46,32,4,'#fff4dc',1.8)+C(30,30,3.2,'#fff4dc',1.8)+eye(28,48,2.4)+eye(36,48,2.4)+blush(24,52)+blush(40,52)+L('M30 52q2 2 4 0',K,1.6),
7:()=>ground('#3b3a8a')+P('M16 22L12 8L26 16Z','#8d7fd6')+P('M48 22L52 8L38 16Z','#8d7fd6')+E(32,34,19,21,'#8d7fd6')+E(32,42,12,13,'#d8d0ff',0,1.8)+star(32,44,5.2,'#ffe066',1.2)
  +P('M13 32C7 38 8 48 14 50C20 46 20 36 15 31Z','#6f61c0')+P('M51 32C57 38 56 48 50 50C44 46 44 36 49 31Z','#6f61c0')+C(24,28,7.4,'#fff')+C(40,28,7.4,'#fff')+C(24,28,3.4,'#4a2f1a',0)+C(40,28,3.4,'#4a2f1a',0)+C(25.2,26.8,1.2,'#fff',0)+C(41.2,26.8,1.2,'#fff',0)
  +P('M29 33L35 33L32 38Z','#ffb347')+L('M26 55V58M32 55V58M38 55V58',K,2),
8:()=>ground('#a0522d')+L('M12 44L7 52M17 47L13 56M52 44L57 52M47 47L51 56',K,2.6)+P('M6 22C2 14 10 8 16 14C14 18 12 22 16 28L12 32C8 30 7 26 6 22Z','#ff7f6a')+P('M58 22C62 14 54 8 48 14C50 18 52 22 48 28L52 32C56 30 57 26 58 22Z','#ff7f6a')
  +E(32,48,17,7,'#ff9a85')+L('M26 42L24 30M38 42L40 30',K,2.2)+C(24,28,3.4,'#fff',2)+C(40,28,3.4,'#fff',2)+C(24,28,1.4,K,0)+C(40,28,1.4,K,0)
  +C(32,36,15,'#ffc4ad')+L(`M32 36m0 0${Array.from({length:40},(_,i)=>{const t=i/39*Math.PI*2*2.1,r=1.2+i/39*12;return 'L'+(32+Math.cos(t)*r).toFixed(1)+' '+(36+Math.sin(t)*r).toFixed(1);}).join('')}`,'#e0805e',2)+L('M28 50q4 3 8 0',K,1.8),
9:()=>ground('#8a6a00')+E(21,24,9,13,'#e6f4ff',-28)+E(43,24,9,13,'#e6f4ff',28)+E(32,38,17,14,'#ffd23f')+P('M30 24C26 32 26 44 31 52L24 51C19 44 19 32 24 25Z','#4a2f1a','')+P('M40 26C44 33 44 44 40 51L46 50C50 44 50 33 46 27Z','#4a2f1a','')+E(32,38,17,14,'none')
  +P('M49 38L58 40L49 44Z','#4a2f1a')+C(20,32,8,'#ffd23f')+eye(17,31,2.4)+blush(18,37)+L('M20 36q2 2 4 0',K,1.5)+L('M18 24Q16 14 11 12M24 24Q25 14 30 11',K,2)+C(11,12,1.8,K,0)+C(30,11,1.8,K,0)+L('M46 14v8M46 14l5 2',K,1.8)+E(44,23,3,2.2,K,-20,1.2),
10:()=>ground('#1b2a4a')+E(32,38,17,20,'#34425e')+E(32,42,11,16,'#fff',0,1.8)+P('M17 34C10 38 10 48 14 52C20 48 20 40 19 34Z','#2a3650')+P('M47 34C54 38 54 48 50 52C44 48 44 40 45 34Z','#2a3650')
  +P('M26 56C22 58 22 60 28 60L32 57Z','#ffb347')+P('M38 56C42 58 42 60 36 60L32 57Z','#ffb347')+eye(25,26,2.6)+eye(39,26,2.6)+blush(22,32)+blush(42,32)+P('M28 30L36 30L32 35Z','#ffb347')
  +P('M16 21Q32 28 48 21L48 25Q32 32 16 25Z','#58e0a8')+P('M42 25L46 36L51 34L47 24Z','#58e0a8'),
11:()=>ground('#556')+L('M20 50V57M28 52V57M38 52V57M46 50V57',K,3.2)+E(32,42,19,12,'#f4f6fa')+C(46,30,9,'#f4f6fa')+P('M44 22C42 12 50 8 54 12C50 12 49 18 50 22Z','#c9b896')+P('M40 24C34 18 36 10 40 10C38 14 40 20 44 24Z','#c9b896')
  +P('M49 38L52 47L47 42Z','#f4f6fa')+eye(48,29,2.4)+C(54,31,1.3,K,0)+L('M52 34q2 2 3 0',K,1.5)+P('M15 36C10 36 9 42 12 44Z','#f4f6fa')+star(30,40,4.4,'#bcd2ff',1.2),
12:()=>`<circle cx="32" cy="34" r="22" fill="#9a5fd8" opacity=".25"/>`+P('M32 24C26 18 14 16 4 24C10 24 12 28 12 32C16 28 20 30 22 34C24 30 28 30 32 34Z','#5b4a9c')+P('M32 24C38 18 50 16 60 24C54 24 52 28 52 32C48 28 44 30 42 34C40 30 36 30 32 34Z','#5b4a9c')
  +E(32,38,10,13,'#6d5bb5')+P('M24 28L23 16L30 24Z','#6d5bb5')+P('M40 28L41 16L34 24Z','#6d5bb5')+C(32,32,9,'#6d5bb5')+eye(28,31,2.6)+eye(36,31,2.6)+P('M30 36L31 40L32 36Z','#fff',' stroke-width="1.2"')+P('M33 36L34 40L35 36Z','#fff',' stroke-width="1.2"')+star(32,46,3.6,'#ffe066',1.2)+L('M28 51V55M36 51V55',K,2)
};

/* ================= 晶體（32x32） ================= */
const F=(c,t)=>{ // 取亮/暗色用
  const h=c.slice(1),n=[0,2,4].map(i=>parseInt(h.substr(i,2),16)),m=t>0?255:0,a=Math.abs(t);
  return '#'+n.map(v=>Math.round(v+(m-v)*a).toString(16).padStart(2,'0')).join('');};
const GS=(d,f,w)=>`<path d="${d}" fill="${f}" stroke="${K}" stroke-width="${w||1.7}" stroke-linejoin="round" stroke-linecap="round"/>`;
const GL=(d,o)=>`<path d="${d}" fill="none" stroke="${K}" stroke-opacity="${o||.4}" stroke-width="1" stroke-linejoin="round"/>`;
const CRY={
1:c=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?6.2:14;d+=(i?'L':'M')+(16+Math.cos(a)*r).toFixed(1)+','+(17+Math.sin(a)*r).toFixed(1);}return GS(d+'Z',c)+GL('M16 17L16 3M16 17L29.3 12.8M16 17L24.2 28.2M16 17L7.8 28.2M16 17L2.7 12.8')+`<path d="M16 6L18 12L14 12Z" fill="#fff" opacity=".6"/>`;},
2:c=>GS('M16 2C16 2 6 14 6 20C6 26 10.5 30 16 30C21.5 30 26 26 26 20C26 14 16 2 16 2Z',c)+GL('M16 2L12 20L16 30L20 20Z')+`<path d="M10 19C10 23 12 26 15 27" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
3:c=>GS('M16 2L29 11L24 29H8L3 11Z',c)+`<path d="M3 11L16 9L29 11L16 29Z" fill="#ffb35c" opacity=".7"/><path d="M3 11L16 9L10 29L8 29Z" fill="#6bb5ff" opacity=".7"/><path d="M16 9L29 11L24 29L16 29Z" fill="#b79cff" opacity=".6"/>`+GL('M3 11H29M16 2L16 29')+GS('M16 2L29 11L24 29H8L3 11Z','none'),
4:c=>GS('M9 26C3 26 2 17 8 16C7 8 17 5 20 11C26 8 31 15 27 19C31 22 29 26 24 26Z',c)+GL('M9 26L14 17L19 26M14 17L20 11L24 26')+`<circle cx="12" cy="15" r="2" fill="#fff" opacity=".8"/>`,
5:c=>`<circle cx="16" cy="17" r="14" fill="${c}" opacity=".25"/>`+GS('M16 3C22 10 27 15 27 20C27 26 22 30 16 30C10 30 5 26 5 20C5 15 10 10 16 3Z',c)+GL('M16 3L11 20L16 30L21 20Z')+`<ellipse cx="11.5" cy="19" rx="2" ry="3.6" fill="#fff" opacity=".75" transform="rotate(12 11.5 19)"/><circle cx="26" cy="7" r="1.6" fill="#f4ff9a"/><circle cx="5" cy="9" r="1.2" fill="#f4ff9a"/>`,
6:c=>GS('M16 2C18 8 25 11 25 20C25 26 21 30 16 30C11 30 7 26 7 20C7 15 11 13 12 8C14 10 15 11 16 2Z',c)+GS('M16 14C18 18 21 20 21 24C21 27 19 29 16 29C13 29 11 27 11 24C11 20 14 18 16 14Z','#ffe28a',1.4)+`<circle cx="16" cy="25" r="2.4" fill="#fff6c9"/>`,
7:c=>GS('M16 2L28 9V23L16 30L4 23V9Z',c)+GL('M16 2V30M4 9L28 23M28 9L4 23')+`<circle cx="16" cy="16" r="4.4" fill="#fff" stroke="${K}" stroke-width="1.4"/>`+star(16,16,3,'#ffe066',0)+`<circle cx="9" cy="12" r="1" fill="#fff"/><circle cx="23" cy="20" r="1" fill="#fff"/>`,
8:c=>GS('M6 14C5 7 12 3 19 4C26 5 29 11 27 19C25 27 17 30 11 27C6 25 6 19 6 14Z',c)+`<ellipse cx="13" cy="11" rx="5" ry="3" fill="#fff" opacity=".55" transform="rotate(-25 13 11)"/><path d="M12 24C16 26 21 25 24 20" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>`+GL('M9 20L16 16L22 22'),
9:c=>GS('M13 25C13 28.5 9 30 6.5 28.4C4 26.6 5 22.5 9 21.6C11 21.2 13 22 13 25Z',c)+GS('M13 25V6L26 10V14L13 11',c)+GL('M13 11L26 14')+`<ellipse cx="8.5" cy="24.8" rx="1.6" ry="1" fill="#fff" opacity=".7" transform="rotate(-20 8.5 24.8)"/>`,
10:c=>GS('M16 1L23 7V25L16 31L9 25V7Z',c)+`<path d="M16 1L23 7L16 11L9 7Z" fill="#e6faff" opacity=".85"/><path d="M16 11L23 7V25L16 31Z" fill="#7bf0b8" opacity=".35"/><path d="M16 11L9 7V25L16 31Z" fill="#ff9fdc" opacity=".3"/>`+GL('M16 11V31')+GS('M16 1L23 7V25L16 31L9 25V7Z','none'),
11:c=>GS('M2 28L12 8L17 16L21 10L30 28Z',c)+`<path d="M12 8L8.2 15.6L12 13.6L15 17Z" fill="#fff"/><path d="M21 10L18.4 15L21 14L24 17Z" fill="#fff"/>`+GL('M12 17L8 28M17 16L16 28M21 14L25 28')+'<path d="M2 28H30" stroke="'+K+'" stroke-width="1.7" stroke-linecap="round"/>',
12:c=>GS('M10 3H22L29 10V22L22 29H10L3 22V10Z',c)+GS('M12 10H20L22 12V20L20 22H12L10 20V12Z',F(c,.3),1.2)+GL('M10 3L12 10M22 3L20 10M29 10L22 12M29 22L22 20M22 29L20 22M10 29L12 22M3 22L10 20M3 10L10 12')+`<path d="M13 12H17L13 16Z" fill="#fff" opacity=".6"/>`
};
const byN=n=>DATA[n-1];
/* ---- 凱爾特風格：螺旋紋樣＋編繩圓框 ---- */
const GOLD='#d9b25b';
const spiralD=(cx,cy,r,turns,flip)=>{let d='';const n=36;for(let i=0;i<=n;i++){const t=i/n,a=(flip?-1:1)*t*turns*Math.PI*2,rr=.6+(r-.6)*t;d+=(i?'L':'M')+(cx+Math.cos(a)*rr).toFixed(1)+','+(cy+Math.sin(a)*rr).toFixed(1);}return d;};
const SP=(cx,cy,r,flip)=>`<path d="${spiralD(cx,cy,r,1.9,flip)}" fill="none" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/><path d="${spiralD(cx,cy,r,1.9,flip)}" fill="none" stroke="${GOLD}" stroke-width="1.7" stroke-linecap="round"/>`;
const DECOR={
 plant:{1:[[24,51,3.6],[41,51,3.6,1]],2:[[46,51,3.2],[18,51,3.2,1]],3:[[32,45,5]],4:[[32,49,3.6]],5:[[48,10,5]],6:[[32,35,6]],7:[[45,49,3.4],[19,49,3.4,1]],8:[[32,52,4]],9:[[24,53,3.6]],10:[[32,50,3.6]],11:[[32,51,4]],12:[[22,47,3.6],[41,47,3.6,1]]},
 animal:{1:[[32,47,4]],2:[[34,36,6],[54,36,3.6,1]],3:[[32,40,5]],4:[[20,39,4.5],[44,39,4.5,1]],5:[[32,46,4]],6:[[32,17,6]],7:[[14,41,4],[50,41,4,1]],8:[[10,18,3.2],[54,18,3.2,1]],9:[[43,22,5]],10:[[32,45,5]],11:[[30,44,6]],12:[[14,28,4],[50,28,4,1]]}
};
const ringFrame=()=>{
  const cx=32,cy=32,R=29,a=1.5,k=10,N=200,pa=[],pb=[];
  for(let i=0;i<=N;i++){const th=i/N*Math.PI*2,d=Math.sin(th*k)*a;
    pa.push((cx+Math.cos(th)*(R+d)).toFixed(1)+','+(cy+Math.sin(th)*(R+d)).toFixed(1));
    pb.push((cx+Math.cos(th)*(R-d)).toFixed(1)+','+(cy+Math.sin(th)*(R-d)).toFixed(1));}
  const da='M'+pa.join('L')+'Z',db='M'+pb.join('L')+'Z';
  const st=d=>`<path d="${d}" fill="none" stroke="${K}" stroke-width="3.4"/><path d="${d}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>`;
  let o=`<circle cx="32" cy="32" r="27" fill="#f9f0d8"/>`+st(da)+st(db);
  for(let j=1;j<2*k;j+=2){const th=j*Math.PI/k;o+=`<clipPath id="cf${j}"><circle cx="${(cx+Math.cos(th)*R).toFixed(1)}" cy="${(cy+Math.sin(th)*R).toFixed(1)}" r="3.6"/></clipPath><g clip-path="url(#cf${j})">${st(da)}</g>`;}
  return o;
};
const celtic=(kind,n)=>ringFrame()+`<g transform="translate(8.5 8.5) scale(.735)">${(kind==='plant'?PLANT:ANIMAL)[n]()}${DECOR[kind][n].map(d=>SP(d[0],d[1],d[2],d[3])).join('')}</g>`;
window.ISLE_ART={
  data:DATA,
  plant:(n,px)=>svg(celtic('plant',n),px),
  animal:(n,px)=>svg(celtic('animal',n),px),
  crystal:(n,px)=>svg(CRY[n](byN(n).c),px,'0 0 32 32'),
  crystalInner:n=>CRY[n](byN(n).c),
  crystalByColor:(c,px)=>{const d=DATA.find(x=>x.c===c);return d?svg(CRY[d.n](d.c),px,'0 0 32 32'):''}
};
})();

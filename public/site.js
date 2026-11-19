document.getElementById('yr').textContent=new Date().getFullYear();
const nav=document.getElementById('nav');addEventListener('scroll',()=>nav.classList.toggle('s',scrollY>20),{passive:true});
const io=new IntersectionObserver(es=>es.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),i*70);io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
// tilt tiles
document.querySelectorAll('.tile').forEach(t=>{t.addEventListener('mousemove',e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform=`perspective(1200px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateY(-4px)`});t.addEventListener('mouseleave',()=>t.style.transform='')});
// 3D wireframe scene: stacked layers + orbiting icosahedron
(()=>{const c=document.getElementById('scene'),g=c.getContext('2d');let W,H,D;function rs(){D=devicePixelRatio||1;W=c.clientWidth;H=c.clientHeight;c.width=W*D;c.height=H*D}rs();addEventListener('resize',rs);
const p=(1+Math.sqrt(5))/2,V=[[-1,p,0],[1,p,0],[-1,-p,0],[1,-p,0],[0,-1,p],[0,1,p],[0,-1,-p],[0,1,-p],[p,0,-1],[p,0,1],[-p,0,-1],[-p,0,1]];const E=[];for(let i=0;i<12;i++)for(let j=i+1;j<12;j++){const d=Math.hypot(V[i][0]-V[j][0],V[i][1]-V[j][1],V[i][2]-V[j][2]);if(Math.abs(d-2)<.01)E.push([i,j])}
let ax=-.5,ay=.6,tx=-.5,ty=.6,drag=null;c.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY,ty,tx]});addEventListener('pointerup',()=>drag=null);
addEventListener('pointermove',e=>{if(drag){ty=drag[2]+(e.clientX-drag[0])*.01;tx=drag[3]+(e.clientY-drag[1])*.01}else{const r=c.getBoundingClientRect();tx=-.5+((e.clientY-r.top)/r.height-.5)*.5}});
function P(x,y,z){const cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax);let X=x*cy-z*sy,Z=x*sy+z*cy,Y=y*cx-Z*sx;Z=y*sx+Z*cx;const s=Math.min(W,H)*.9/(Z+6);return[W/2+X*s,H/2+Y*s,Z]}
function draw(t){ty+=drag?0:.003;ax+=(tx-ax)*.06;ay+=(ty-ay)*.06;g.setTransform(D,0,0,D,0,0);g.clearRect(0,0,W,H);
// layers (web / api / data)
['#0c0c0d','#0c0c0d','#e11d2e'].forEach((col,k)=>{const y=1.6-k*1.6+Math.sin(t/900+k)*.12,s=2.4;const q=[[-s,y,-s],[s,y,-s],[s,y,s],[-s,y,s]].map(v=>P(...v));g.beginPath();q.forEach((v,i)=>i?g.lineTo(v[0],v[1]):g.moveTo(v[0],v[1]));g.closePath();g.fillStyle=k==2?'rgba(225,29,46,.08)':'rgba(12,12,13,.035)';g.fill();g.strokeStyle=col;g.lineWidth=1.2;g.setLineDash(k==1?[5,5]:[]);g.stroke();g.setLineDash([]);
for(let i=-2;i<=2;i++){const a=P(i*s/2.5,y,-s),b=P(i*s/2.5,y,s);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.strokeStyle='rgba(12,12,13,.12)';g.stroke()}});
// icosahedron
const sc=.75,r=t/1600,pts=V.map(([x,y,z])=>{const X=x*Math.cos(r)-z*Math.sin(r),Z=x*Math.sin(r)+z*Math.cos(r);return P(X*sc,y*sc+Math.sin(t/700)*.15,Z*sc)});
E.forEach(([i,j])=>{const a=pts[i],b=pts[j],f=(a[2]+b[2])/2;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.strokeStyle=f<0?'#e11d2e':'rgba(225,29,46,.35)';g.lineWidth=f<0?2:1;g.stroke()});
pts.forEach(v=>{g.beginPath();g.arc(v[0],v[1],v[2]<0?3.5:2,0,7);g.fillStyle=v[2]<0?'#0c0c0d':'#999';g.fill()});
requestAnimationFrame(draw)}requestAnimationFrame(draw)})();

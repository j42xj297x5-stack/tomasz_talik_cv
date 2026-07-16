const FONT_FAMILY = 'ui-monospace, "Cascadia Code", "SFMono-Regular", Consolas, monospace';
const DEPTH = 620;
const FOCAL_LENGTH = 760;

const CODE = [
  'const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));',
  'const localize=(v,lang)=>v?.[lang]??v?.pl??"";',
  'const isVisible=(s,d)=>s==="published"||(d&&s==="draft");',
  'const assetUrl=p=>new URL(p,document.baseURI).href;',
  'const profile=id=>profiles.find(p=>p.id===id);',
  'const lang=navigator.language.startsWith("pl")?"pl":"en";',
  'const lerp=(a,b,t)=>a+(b-a)*t;',
  'const project=(v,f)=>f/(f+v.z);',
  'const radius=m=>Math.sqrt(Math.max(0,m));',
  'const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);',
  'const collides=(a,b)=>distance(a,b)<a.r+b.r;',
  'const isReady=()=>readyVersion>0;',
  'const updateWorld=dt=>world.step(dt);',
];

const SHAPES = {
  tetrahedron: { vertices: [[0,-34,0],[32,24,22],[-32,24,22],[0,24,-36]], edges: [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]] },
  cuboid: { vertices: [[-38,-25,-22],[38,-25,-22],[38,25,-22],[-38,25,-22],[-38,-25,22],[38,-25,22],[38,25,22],[-38,25,22]], edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]] },
  cube: { vertices: [[-29,-29,-29],[29,-29,-29],[29,29,-29],[-29,29,-29],[-29,-29,29],[29,-29,29],[29,29,29],[-29,29,29]], edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]] },
  octahedron: { vertices: [[0,-38,0],[38,0,0],[0,38,0],[-38,0,0],[0,0,38],[0,0,-38]], edges: [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4],[0,5],[1,5],[2,5],[3,5]] },
};

const DESKTOP = [
  { shape: 'tetrahedron', x: .955, y: .12, scale: .82, phase: .7, speed: [5e-5,-4e-5,2e-5], tape: 11 },
  { shape: 'cuboid', x: .045, y: .38, scale: .78, phase: 1.8, speed: [-4e-5,5e-5,2e-5], tape: 13 },
  { shape: 'cube', x: .955, y: .61, scale: .84, phase: 2.7, speed: [4e-5,4e-5,-2e-5], tape: 15 },
  { shape: 'octahedron', x: .045, y: .9, scale: .76, phase: 3.6, speed: [-5e-5,3e-5,2e-5], tape: 12 },
];
const MOBILE = [DESKTOP[1], DESKTOP[2]];

function rotate([x,y,z], rx, ry, rz) {
  const cx=Math.cos(rx), sx=Math.sin(rx), cy=Math.cos(ry), sy=Math.sin(ry), cz=Math.cos(rz), sz=Math.sin(rz);
  let yy=y*cx-z*sx, zz=y*sx+z*cx, xx=x*cy+zz*sy;
  zz=-x*sy+zz*cy;
  return [xx*cz-yy*sz, xx*sz+yy*cz, zz];
}

export function createCodeGeometricBackground(context) {
  let width=0, height=0, mobile=false, previousTime=0, frameDelta=0;
  const offsets = new Map();
  const widths = new Map();
  let palette = { front: '#64748b', back: '#94a3b8', node: '#64748b' };

  const font = size => `${size}px ${FONT_FAMILY}`;
  const resize = (nextWidth, nextHeight, nextPalette) => {
    width=nextWidth; height=nextHeight; mobile=width<=767; palette=nextPalette;
    widths.clear();
    for (let size=5; size<=7; size+=.5) {
      context.font=font(size);
      CODE.forEach((code, index) => widths.set(`${index}:${size}`, context.measureText(`${code}   `).width));
    }
  };

  const projected = (item, time, still) => {
    const angles=still ? [item.phase*.3,item.phase*.5,item.phase*.2] : item.speed.map((speed,index)=>time*speed+item.phase*(index+1));
    return SHAPES[item.shape].vertices.map(vertex => {
      const point=rotate(vertex.map(value=>value*item.scale),...angles);
      const perspective=FOCAL_LENGTH/Math.max(180,DEPTH+point[2]);
      return { x:item.x*width+point[0]*perspective, y:item.y*height+point[1]*perspective, z:point[2] };
    });
  };

  const renderEdge = (edge, itemIndex, edgeIndex, tapeSpeed, still) => {
    let { a, b }=edge;
    let dx=b.x-a.x, dy=b.y-a.y, angle=Math.atan2(dy,dx);
    if (angle>Math.PI/2 || angle<-Math.PI/2) { [a,b]=[b,a]; dx=-dx; dy=-dy; angle=Math.atan2(dy,dx); }
    const length=Math.hypot(dx,dy);
    if (length<2) return;
    const front=Math.tanh(-edge.z/30);
    const light=.5+.5*front;
    const size=Math.round((5.1+light*1.5)*2)/2;
    const codeIndex=(itemIndex*5+edgeIndex)%CODE.length;
    const segment=`${CODE[codeIndex]}   `;
    const segmentWidth=widths.get(`${codeIndex}:${size}`);
    const offset=offsets.get(`${itemIndex}:${edgeIndex}`) || 0;

    context.save();
    context.translate(a.x,a.y); context.rotate(angle);
    context.beginPath(); context.rect(0,-size, length, size*1.8); context.clip();
    context.font=font(size); context.textAlign='left'; context.textBaseline='middle';
    const start=((offset%segmentWidth)+segmentWidth)%segmentWidth-segmentWidth;
    const paint = color => { context.fillStyle=color; for (let x=start; x<length; x+=segmentWidth) context.fillText(segment,x,0); };
    context.globalAlpha=.35+.65*(1-light); paint(palette.back);
    context.globalAlpha=light; paint(palette.front);
    context.restore();

    if (!still) offsets.set(`${itemIndex}:${edgeIndex}`, offset-tapeSpeed*front*(frameDelta/1000));
  };

  const update = (time, still=false) => {
    frameDelta=still || !previousTime ? 0 : Math.min(50,time-previousTime);
    previousTime=time;
  };

  const render = (time, still=false) => {
    const composition=mobile ? MOBILE : DESKTOP;
    composition.forEach((item,itemIndex) => {
      const points=projected(item,time,still);
      SHAPES[item.shape].edges.map(([from,to],edgeIndex)=>({ a:points[from], b:points[to], z:(points[from].z+points[to].z)/2, edgeIndex }))
        .sort((left,right)=>right.z-left.z)
        .forEach(edge=>renderEdge(edge,itemIndex,edge.edgeIndex,item.tape,still));
    });
  };

  return { resize, update, render };
}

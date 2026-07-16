const MAX_DPR = 2;
const MOBILE_MAX_WIDTH = 767;
const FRAME_INTERVAL = 1000 / 30;
const DEPTH = 620;
const FOCAL_LENGTH = 760;
const SAFE_MARGIN = 96;

const SHAPES = {
  tetrahedron: {
    vertices: [
      [0, -36, 0],
      [34, 26, 24],
      [-34, 26, 24],
      [0, 26, -38],
    ],
    edges: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]],
  },
  cube: {
    vertices: [
      [-32, -32, -32], [32, -32, -32], [32, 32, -32], [-32, 32, -32],
      [-32, -32, 32], [32, -32, 32], [32, 32, 32], [-32, 32, 32],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]],
  },
  octahedron: {
    vertices: [
      [0, -42, 0], [42, 0, 0], [0, 42, 0], [-42, 0, 0], [0, 0, 42], [0, 0, -42],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4], [0, 5], [1, 5], [2, 5], [3, 5]],
  },
  irregular: {
    vertices: [
      [-42, -22, -16], [18, -38, 12], [48, 8, -20], [12, 42, 26], [-36, 26, 8], [-8, -2, 42],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [1, 5], [3, 5], [4, 5]],
  },
};

const DESKTOP_COMPOSITION = [
  { shape: 'cube', x: 0.09, y: 0.18, scale: 1.05, phase: 0.1, drift: 16, speed: [0.00006, 0.000045, 0.000025] },
  { shape: 'octahedron', x: 0.9, y: 0.25, scale: 0.95, phase: 1.4, drift: 18, speed: [0.00005, -0.000055, 0.00002] },
  { shape: 'tetrahedron', x: 0.14, y: 0.72, scale: 0.9, phase: 2.1, drift: 14, speed: [-0.000045, 0.00005, 0.000018] },
  { shape: 'irregular', x: 0.86, y: 0.78, scale: 1.0, phase: 3.2, drift: 15, speed: [0.00004, 0.000035, -0.00002] },
];

const STATIC_COMPOSITION = [DESKTOP_COMPOSITION[0], DESKTOP_COMPOSITION[1]];
const LOOSE_POINTS = [
  { x: 0.06, y: 0.39, z: -40 }, { x: 0.18, y: 0.48, z: 28 }, { x: 0.08, y: 0.86, z: 10 },
  { x: 0.82, y: 0.12, z: 24 }, { x: 0.94, y: 0.46, z: -24 }, { x: 0.78, y: 0.62, z: 36 },
];
const POINT_LINKS = [[0, 1], [1, 2], [3, 4], [4, 5]];

function readColor(name, fallback) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function rotate([x, y, z], rx, ry, rz) {
  const cosX = Math.cos(rx); const sinX = Math.sin(rx);
  const cosY = Math.cos(ry); const sinY = Math.sin(ry);
  const cosZ = Math.cos(rz); const sinZ = Math.sin(rz);
  let yy = y * cosX - z * sinX;
  let zz = y * sinX + z * cosX;
  let xx = x * cosY + zz * sinY;
  zz = -x * sinY + zz * cosY;
  const finalX = xx * cosZ - yy * sinZ;
  yy = xx * sinZ + yy * cosZ;
  return [finalX, yy, zz];
}

function clampPoint(point, width, height) {
  return {
    ...point,
    x: Math.min(width + SAFE_MARGIN, Math.max(-SAFE_MARGIN, point.x)),
    y: Math.min(height + SAFE_MARGIN, Math.max(-SAFE_MARGIN, point.y)),
  };
}

export function initGeometricBackground() {
  const canvas = document.createElement('canvas');
  canvas.className = 'geometric-background';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const context = canvas.getContext('2d');
  if (!context) {
    canvas.remove();
    return { stop() {} };
  }

  const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frameId = 0;
  let lastFrame = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now(), true);
  };

  const isStatic = () => width <= MOBILE_MAX_WIDTH || mediaMotion.matches;
  const colors = () => ({
    point: readColor('--background-point-color', 'rgb(82 102 128 / 0.46)'),
    line: readColor('--background-line-color', 'rgb(82 102 128 / 0.3)'),
    accent: readColor('--background-accent-color', 'rgb(37 99 235 / 0.42)'),
  });

  const project = ([x, y, z]) => {
    const depth = DEPTH + z;
    const perspective = FOCAL_LENGTH / Math.max(180, depth);
    return { x: width / 2 + x * perspective, y: height / 2 + y * perspective, z, perspective };
  };

  const drawShape = (item, time, palette) => {
    const shape = SHAPES[item.shape];
    const still = isStatic();
    const drift = still ? 0 : item.drift;
    const centerX = item.x * width + Math.sin(time * 0.00018 + item.phase) * drift;
    const centerY = item.y * height + Math.cos(time * 0.00015 + item.phase) * drift;
    const angles = still ? [item.phase * 0.3, item.phase * 0.5, item.phase * 0.2] : item.speed.map((speed, index) => time * speed + item.phase * (index + 1));
    const points = shape.vertices.map((vertex) => {
      const scaled = vertex.map((value) => value * item.scale);
      const rotated = rotate(scaled, angles[0], angles[1], angles[2]);
      return clampPoint(project([rotated[0] + centerX - width / 2, rotated[1] + centerY - height / 2, rotated[2]]), width, height);
    });
    context.strokeStyle = palette.line;
    context.lineWidth = 0.7;
    shape.edges.forEach(([a, b]) => {
      context.beginPath(); context.moveTo(points[a].x, points[a].y); context.lineTo(points[b].x, points[b].y); context.stroke();
    });
    points.forEach((point, index) => {
      context.fillStyle = index === 0 ? palette.accent : palette.point;
      context.beginPath(); context.arc(point.x, point.y, Math.max(1.2, 1.7 * point.perspective), 0, Math.PI * 2); context.fill();
    });
  };

  const drawLoosePoints = (palette) => {
    const points = LOOSE_POINTS.slice(0, isStatic() ? 4 : LOOSE_POINTS.length).map((point) => clampPoint(project([point.x * width - width / 2, point.y * height - height / 2, point.z]), width, height));
    context.strokeStyle = palette.line;
    context.lineWidth = 0.55;
    POINT_LINKS.filter(([a, b]) => points[a] && points[b]).forEach(([a, b]) => { context.beginPath(); context.moveTo(points[a].x, points[a].y); context.lineTo(points[b].x, points[b].y); context.stroke(); });
    context.fillStyle = palette.point;
    points.forEach((point) => { context.beginPath(); context.arc(point.x, point.y, Math.max(1, 1.35 * point.perspective), 0, Math.PI * 2); context.fill(); });
  };

  function draw(time, forceStatic = false) {
    context.clearRect(0, 0, width, height);
    const palette = colors();
    const composition = isStatic() || forceStatic ? STATIC_COMPOSITION : DESKTOP_COMPOSITION;
    composition.forEach((item) => drawShape(item, time, palette));
    drawLoosePoints(palette);
  }

  const loop = (time) => {
    if (document.hidden || isStatic()) { frameId = 0; return; }
    if (time - lastFrame >= FRAME_INTERVAL) { draw(time); lastFrame = time; }
    frameId = window.requestAnimationFrame(loop);
  };
  const start = () => { if (!frameId && !document.hidden && !isStatic()) { lastFrame = performance.now(); frameId = window.requestAnimationFrame(loop); } };
  const stop = () => { if (frameId) window.cancelAnimationFrame(frameId); frameId = 0; };
  const refresh = () => { resize(); stop(); start(); };
  const visibility = () => { if (document.hidden) stop(); else { lastFrame = performance.now(); draw(lastFrame, isStatic()); start(); } };

  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('orientationchange', refresh, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  mediaMotion.addEventListener?.('change', refresh);
  resize();
  start();

  return { stop() { stop(); window.removeEventListener('resize', refresh); window.removeEventListener('orientationchange', refresh); document.removeEventListener('visibilitychange', visibility); mediaMotion.removeEventListener?.('change', refresh); canvas.remove(); } };
}

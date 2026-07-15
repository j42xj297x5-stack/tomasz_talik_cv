import { appendChildren, createElement } from '../utils/dom.js';

const SIZE = 640;
const CENTER = SIZE / 2;
const RADIUS = 220;
const MAX_DELTA = 0.05;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
  return element;
}

function spherePoint(index, total) {
  if (total === 1) return { x: 0, y: 0, z: 1 };
  const offset = 2 / total;
  const increment = Math.PI * (3 - Math.sqrt(5));
  const y = index * offset - 1 + offset / 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = index * increment;
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
}

function rotate(point, angleX, angleY) {
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const y = point.y * cosX - point.z * sinX;
  const zX = point.y * sinX + point.z * cosX;
  const x = point.x * cosY + zX * sinY;
  const z = -point.x * sinY + zX * cosY;
  return { x, y, z };
}

function fontSize(weight) {
  return 14 + Math.max(1, Math.min(3, weight || 1)) * 4;
}

export function createSvgTagCloud(skills = [], labels = {}) {
  const reducedMotion = window.matchMedia?.(REDUCED_MOTION)?.matches === true;
  const container = createElement('div', {
    className: 'skills-cloud',
    attributes: { 'aria-label': labels.skillsCloudAria || 'Interactive skills cloud' },
  });
  const svg = createSvgElement('svg', { class: 'skills-cloud__svg', viewBox: `0 0 ${SIZE} ${SIZE}`, 'aria-hidden': 'true', focusable: 'false' });
  const accessibleList = createElement('ul', { className: 'skills-cloud__accessible-list' });
  const nodes = skills.map((skill, index) => {
    const text = createSvgElement('text', { class: 'skills-cloud__tag', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    text.textContent = skill.name;
    svg.appendChild(text);
    const item = createElement('li', { text: skill.isDraft ? `${skill.name} — ${labels.draft || 'Draft'}` : skill.name });
    accessibleList.appendChild(item);
    return { skill, text, point: spherePoint(index, skills.length) };
  });

  let angleX = reducedMotion ? -0.28 : -0.18;
  let angleY = reducedMotion ? 0.42 : 0.28;
  let currentSpeedX = 0.12;
  let currentSpeedY = 0.18;
  let targetSpeedX = currentSpeedX;
  let targetSpeedY = currentSpeedY;
  let active = false;
  let frameId = 0;
  let lastTime = 0;

  function render() {
    const rendered = nodes.map((node) => ({ ...node, rotated: rotate(node.point, angleX, angleY) }))
      .sort((a, b) => a.rotated.z - b.rotated.z);
    rendered.forEach((node) => {
      const depth = (node.rotated.z + 1) / 2;
      const perspective = 0.72 + depth * 0.48;
      node.text.setAttribute('x', CENTER + node.rotated.x * RADIUS * perspective);
      node.text.setAttribute('y', CENTER + node.rotated.y * RADIUS * perspective);
      node.text.setAttribute('font-size', fontSize(node.skill.cloudWeight) * (0.78 + depth * 0.34));
      node.text.setAttribute('opacity', 0.46 + depth * 0.54);
      svg.appendChild(node.text);
    });
  }

  function baseSpeed() {
    return window.matchMedia?.('(max-width: 39rem)')?.matches ? 0.45 : 0.75;
  }

  function tick(time) {
    if (!active || reducedMotion || !document.body.contains(container)) {
      active = false;
      frameId = 0;
      return;
    }
    const delta = Math.min(MAX_DELTA, (time - lastTime) / 1000 || 0);
    lastTime = time;
    currentSpeedX += (targetSpeedX - currentSpeedX) * 0.08;
    currentSpeedY += (targetSpeedY - currentSpeedY) * 0.08;
    angleX += currentSpeedX * delta;
    angleY += currentSpeedY * delta;
    render();
    frameId = window.requestAnimationFrame(tick);
  }

  function setTargetFromPointer(event) {
    if (reducedMotion) return;
    const rect = container.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    const speed = baseSpeed();
    targetSpeedX = -ny * speed;
    targetSpeedY = nx * speed;
  }

  function resetTarget() {
    const speed = baseSpeed();
    targetSpeedX = 0.16 * speed;
    targetSpeedY = 0.24 * speed;
  }

  container.addEventListener('pointermove', setTargetFromPointer, { passive: true });
  container.addEventListener('pointerleave', resetTarget);
  resetTarget();
  render();

  appendChildren(container, [svg, accessibleList]);

  return {
    element: container,
    setActive(nextActive) {
      active = Boolean(nextActive) && !reducedMotion && document.body.contains(container);
      if (!active && frameId) window.cancelAnimationFrame(frameId);
      if (!active) { frameId = 0; return; }
      if (!frameId) {
        lastTime = performance.now();
        frameId = window.requestAnimationFrame(tick);
      }
    },
    destroy() {
      active = false;
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    },
  };
}

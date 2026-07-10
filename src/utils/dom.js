export function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  const { className, text, attributes = {} } = options;

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  Object.entries(attributes).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== false) {
      element.setAttribute(name, String(value));
    }
  });

  return element;
}

export function appendChildren(parent, children) {
  children.filter(Boolean).forEach((child) => parent.appendChild(child));
  return parent;
}

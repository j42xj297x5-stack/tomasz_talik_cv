import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const root = process.cwd();
const errors = [];
const suspicious = new Set(['phone', 'address', 'secret', 'token', 'privateData']);
const sections = new Set(['about', 'projects', 'experience', 'education', 'skills', 'contact']);
const profileFields = new Set(['profileId', 'company', 'targetRole', 'headline', 'companyMessage', 'accent', 'sectionOrder', 'visibleSections', 'projectOrder', 'featuredProjectIds', 'skillOrder', 'featuredSkillIds', 'pdf', 'protectedScopes']);
const files = {
  'content/public/identity.json': 'content/schemas/identity.schema.json',
  'content/public/about.json': 'content/schemas/about.schema.json',
  'content/public/projects.json': 'content/schemas/projects.schema.json',
  'content/public/experience.json': 'content/schemas/experience.schema.json',
  'content/public/education.json': 'content/schemas/education.schema.json',
  'content/public/skills.json': 'content/schemas/skills.schema.json',
  'content/public/links.json': 'content/schemas/links.schema.json'
};
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const pointer = (parts) => '/' + parts.map(String).join('/');
const addError = (file, field, message) => errors.push({ file, field: field || '/', message });

const ajv = new Ajv({ allErrors: true, schemaId: 'auto' });
addFormats(ajv);
for (const schemaFile of fs.readdirSync(path.join(root, 'content/schemas')).filter((f) => f.endsWith('.json'))) {
  ajv.addSchema(readJson(`content/schemas/${schemaFile}`), schemaFile);
}

function walk(value, file, parts = []) {
  if (Array.isArray(value)) return value.forEach((item, i) => walk(item, file, [...parts, i]));
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (suspicious.has(key)) addError(file, pointer([...parts, key]), `Niedozwolony lub podejrzany klucz: ${key}`);
    walk(child, file, [...parts, key]);
  }
}
function collectIds(doc, file, seen) {
  const items = Array.isArray(doc.items) ? doc.items : [doc];
  for (const item of items) {
    const id = item?.id || item?.stableId;
    if (!id) continue;
    if (seen.has(id)) addError(file, item?.id ? '/id' : '/stableId', `Duplikat identyfikatora: ${id}`);
    seen.add(id);
  }
}
function dupes(values = []) { return [...new Set(values.filter((v, i) => values.indexOf(v) !== i))]; }

const data = {};
for (const [file, schema] of Object.entries(files)) {
  data[file] = readJson(file);
  const valid = ajv.getSchema(schema.split('/').pop())(data[file]);
  if (!valid) for (const err of ajv.getSchema(schema.split('/').pop()).errors) addError(file, err.instancePath, err.message);
  walk(data[file], file);
}
const allIds = new Set();
for (const file of Object.keys(files)) collectIds(data[file], file, allIds);
const projectIds = new Set(data['content/public/projects.json'].items.map((i) => i.id));
const skillsDoc = data['content/public/skills.json'];
const skillIds = new Set(skillsDoc.items.map((i) => i.id));

const projectDemoLinks = new Map();
(data['content/public/links.json'].items || []).forEach((link, index) => {
  const basePath = ['items', index];
  if (link?.projectLabel && !link?.projectId) {
    addError('content/public/links.json', pointer([...basePath, 'projectLabel']), 'projectLabel wymaga projectId.');
  }
  if (!link?.projectId) return;
  if (link.kind !== 'demo') {
    addError('content/public/links.json', pointer([...basePath, 'projectId']), 'projectId może występować tylko dla linku kind demo.');
  }
  if (!link.projectLabel) {
    addError('content/public/links.json', pointer([...basePath, 'projectId']), 'projectId wymaga projectLabel.');
  }
  if (!projectIds.has(link.projectId)) {
    addError('content/public/links.json', pointer([...basePath, 'projectId']), `Link projektu odwołuje się do nieistniejącego projektu: ${link.projectId}`);
  }
  const previous = projectDemoLinks.get(link.projectId);
  if (previous !== undefined) {
    addError('content/public/links.json', pointer([...basePath, 'projectId']), `Projekt ${link.projectId} ma więcej niż jeden przypisany link demonstracyjny.`);
    addError('content/public/links.json', pointer(['items', previous, 'projectId']), `Projekt ${link.projectId} ma więcej niż jeden przypisany link demonstracyjny.`);
  } else {
    projectDemoLinks.set(link.projectId, index);
  }
});

const stableIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const categoryIds = new Set();
(skillsDoc.categories || []).forEach((category, index) => {
  const field = pointer(['categories', index, 'id']);
  if (!category?.id || !stableIdPattern.test(category.id)) {
    addError('content/public/skills.json', field, 'Kategoria nie ma poprawnego id.');
    return;
  }
  if (categoryIds.has(category.id)) addError('content/public/skills.json', field, `Duplikat id kategorii: ${category.id}`);
  categoryIds.add(category.id);
});
(skillsDoc.items || []).forEach((skill, index) => {
  if (!skill?.categoryId) {
    addError('content/public/skills.json', pointer(['items', index, 'categoryId']), `Umiejętność ${skill?.id || index} nie ma categoryId.`);
  } else if (!categoryIds.has(skill.categoryId)) {
    addError('content/public/skills.json', pointer(['items', index, 'categoryId']), `Umiejętność ${skill.id} odwołuje się do nieistniejącej kategorii: ${skill.categoryId}`);
  }
  if (skill?.cloudWeight !== undefined && (!Number.isInteger(skill.cloudWeight) || skill.cloudWeight < 1 || skill.cloudWeight > 3)) {
    addError('content/public/skills.json', pointer(['items', index, 'cloudWeight']), `cloudWeight umiejętności ${skill.id} musi być liczbą całkowitą od 1 do 3.`);
  }
});

const profileDir = path.join(root, 'content/profiles');
for (const name of fs.readdirSync(profileDir).filter((f) => f.endsWith('.json'))) {
  const file = `content/profiles/${name}`;
  const profile = readJson(file);
  const validate = ajv.getSchema('profile.schema.json');
  if (!validate(profile)) for (const err of validate.errors) addError(file, err.instancePath, err.message);
  walk(profile, file);
  for (const key of Object.keys(profile)) if (!profileFields.has(key)) addError(file, `/${key}`, 'Niedozwolone nadpisanie lub pole profilu.');
  for (const key of ['sectionOrder', 'visibleSections', 'projectOrder', 'featuredProjectIds', 'skillOrder', 'featuredSkillIds', 'protectedScopes']) {
    for (const duplicate of dupes(profile[key])) addError(file, `/${key}`, `Duplikat w tablicy: ${duplicate}`);
  }
  for (const key of ['sectionOrder', 'visibleSections']) for (const id of profile[key] || []) if (!sections.has(id)) addError(file, `/${key}`, `Nieistniejąca sekcja: ${id}`);
  for (const key of ['projectOrder', 'featuredProjectIds']) for (const id of profile[key] || []) if (!projectIds.has(id)) addError(file, `/${key}`, `Odwołanie do nieistniejącego projektu: ${id}`);
  for (const key of ['skillOrder', 'featuredSkillIds']) for (const id of profile[key] || []) if (!skillIds.has(id)) addError(file, `/${key}`, `Odwołanie do nieistniejącej umiejętności: ${id}`);
  if (profile.profileId !== 'default' && profile.companyMessage?.pl) {
    const length = [...profile.companyMessage.pl].length;
    if (length < 300 || length > 500) addError(file, '/companyMessage/pl', `Wiadomość firmowa ma ${length} znaków, wymagane 300–500.`);
  }
}

if (errors.length) {
  for (const err of errors) console.error(`${err.file} ${err.field}: ${err.message}`);
  process.exit(1);
}
console.log('Content validation passed.');

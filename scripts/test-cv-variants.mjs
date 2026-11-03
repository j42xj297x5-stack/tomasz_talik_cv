import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { resolveProfile, getPrivateAccessToken } from '../src/app/profile-resolver.js';
import { createViewModel } from '../src/app/view-model.js';

const read = (path) => JSON.parse(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const content = Object.fromEntries(['identity', 'about', 'projects', 'experience', 'education', 'skills', 'links'].map((key) => [key, read(`content/public/${key}.json`)]));
content.variants = Object.fromEntries(['gamedev', 'it-ai'].map((key) => [key, read(`content/variants/${key}.json`)]));
const profile = read('content/profiles/default.json');
const token = 'company_token_for_variant_testing_12345';
const profiles = { default: profile, custom: { ...profile, profileId: 'custom', targetRole: { pl: 'Własna rola', en: 'Custom role' }, projectOrder: ['project-creative-ai'], featuredSkillIds: ['skill-python'], skillOrder: ['skill-python'], visibleSections: ['projects', 'skills'] } };
const resolve = (company, search = '') => resolveProfile(profiles, search, { hash: company ? `#p=${token}` : '', baseUrl: '/', fetcher: async () => ({ ok: true, json: async () => company }) });
const view = (resolved, language, source = content, extra = {}) => createViewModel(source, resolved.profile, language, { cvVariant: resolved.cvVariant, hasCompanyVariant: resolved.hasCompanyVariant, companyName: resolved.companyProfile?.companyName || '', ...extra });
const snapshot = JSON.stringify({ content, profiles });
function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } }
freeze(content); freeze(profiles);

for (const [label, company, expected] of [
  ['no company', null, 'gamedev'],
  ['legacy company', { id: token, companyName: 'Firma' }, 'gamedev'],
  ['Game Dev', { id: token, companyName: 'Firma', cvVariant: 'gamedev' }, 'gamedev'],
  ['IT / AI', { id: token, companyName: 'Firma', cvVariant: 'it-ai' }, 'it-ai'],
  ['unknown variant', { id: token, companyName: 'Firma', cvVariant: 'unknown' }, 'gamedev'],
]) {
  test(`${label}: resolver, PL/EN content, project and featured skill order`, async () => {
    const resolved = await resolve(company);
    assert.equal(resolved.cvVariant, expected);
    assert.equal(resolved.companyProfile?.companyName || '', company?.companyName || '');
    for (const language of ['pl', 'en']) {
      const vm = view(resolved, language);
      const variant = content.variants[expected];
      assert.equal(vm.hero.headline, variant.headline[language]);
      assert.equal(vm.hero.description, variant.about[0].text[language]);
      assert.equal(vm.about[0].text, variant.about[1].text[language]);
      assert.deepEqual(vm.projects.map((p) => p.id), variant.projectOrder);
      assert.deepEqual(vm.hero.skills.map((s) => s.id), variant.featuredSkillIds);
      for (const patch of variant.projects) assert.equal(vm.projects.find((p) => p.id === patch.id).summary, patch.summary[language]);
      for (const patch of variant.skills.filter((s) => s.name)) assert.equal(vm.skills.find((s) => s.id === patch.id).name, patch.name[language]);
      assert.equal(vm.hero.companyName, company?.companyName || '');
      assert.deepEqual(vm.education, view(await resolve(null), language).education);
      assert.equal(vm.projects.find((p) => p.id === 'project-dig-engine').demoMedia.src, 'assets/projects/DIG_engine.gif');
      assert.match(vm.projects.find((p) => p.id === 'project-orange-monkey-vr').projectLink.label, /film|video/);
    }
  });
}

test('strict company fields, type checking and failed fetch fallbacks', async () => {
  for (const company of [{ id: token, companyName: 'Firma', extra: true }, { id: token, companyName: 'Firma', cvVariant: 1 }, { id: 'wrong', companyName: 'Firma' }, { id: token, companyName: ' ' }]) {
    const resolved = await resolve(company);
    assert.equal(resolved.companyProfile, null);
    assert.equal(resolved.usedFallback, true);
    assert.equal(resolved.cvVariant, 'gamedev');
  }
  const result = await resolveProfile(profiles, '?p=missing', { hash: `#p=${token}`, baseUrl: '/', fetcher: async () => { throw Error('unavailable'); } });
  assert.equal(result.profileId, 'default');
  assert.equal(result.usedFallback, true);
  assert.equal(getPrivateAccessToken(`#p=${token}&k=${token}`), token);
});

test('repository selection preserved, explicit company variant has scoped precedence', async () => {
  const custom = view(await resolve(null, '?p=custom'), 'en');
  assert.equal(custom.hero.headline, 'Custom role');
  assert.equal(custom.projects[0].id, 'project-creative-ai');
  assert.deepEqual(custom.hero.skills.map((s) => s.id), ['skill-python']);
  assert.deepEqual(custom.about, []);
  const explicit = view(await resolve({ id: token, companyName: 'Firma', cvVariant: 'it-ai' }, '?p=custom'), 'en');
  assert.equal(explicit.hero.headline, content.variants['it-ai'].headline.en);
  assert.deepEqual(explicit.projects.map((p) => p.id), content.variants['it-ai'].projectOrder);
  assert.deepEqual(explicit.hero.skills.map((s) => s.id), content.variants['it-ai'].featuredSkillIds);
  assert.deepEqual(explicit.about, []);
});

test('publication filtering follows overlays in both variants and languages', async () => {
  const changed = structuredClone(content);
  for (const section of ['about', 'projects', 'experience', 'skills']) {
    changed[section].items[0].status = 'draft';
    changed[section].items[1].status = 'archived';
  }
  for (const cvVariant of ['gamedev', 'it-ai']) for (const language of ['pl', 'en']) {
    const resolved = await resolve({ id: token, companyName: 'Firma', cvVariant });
    const normal = view(resolved, language, changed);
    const preview = view(resolved, language, changed, { previewMode: 'draft' });
    assert.equal(normal.hero.description, '');
    assert.equal(preview.hero.description, changed.variants[cvVariant].about[0].text[language]);
    assert.equal(preview.hero.descriptionIsDraft, true);
    for (const section of ['projects', 'experience', 'skills']) {
      assert(!normal[section].some((item) => item.id === changed[section].items[0].id));
      assert(preview[section].some((item) => item.id === changed[section].items[0].id && item.isDraft));
      assert(!preview[section].some((item) => item.id === changed[section].items[1].id));
    }
    assert(!preview.hero.skills.some((item) => item.id === changed.skills.items[1].id));
  }
});

test('repeated variant/language creation does not mutate or contaminate source data', async () => {
  const game = await resolve({ id: token, companyName: 'Firma', cvVariant: 'gamedev' });
  const it = await resolve({ id: token, companyName: 'Firma', cvVariant: 'it-ai' });
  const before = view(game, 'pl');
  view(it, 'pl'); view(it, 'en'); view(game, 'en');
  assert.deepEqual(view(game, 'pl'), before);
  assert.equal(JSON.stringify({ content, profiles }), snapshot);
  for (const language of ['pl', 'en']) for (const id of ['project-haiku-cosmos', 'project-dig-engine']) {
    assert.equal(view(game, language).projects.find((p) => p.id === id).summary, content.projects.items.find((p) => p.id === id).summary[language]);
  }
});

test('project renderer preserves paragraphs as plain text without a browser', async () => {
  const { createProjectsSection } = await import('../src/sections/projects-section.js');
  const previous = globalThis.document;
  globalThis.document = { createElement: (tagName) => ({ tagName, children: [], setAttribute() {}, appendChild(child) { this.children.push(child); } }) };
  try {
    const summary = 'First paragraph.\n\nSecond paragraph with <text>, not HTML.';
    const section = createProjectsSection([{ title: 'Project', summary }]);
    const article = section.children[1].children[0];
    assert.deepEqual(article.children.filter((child) => child.tagName === 'p').map((child) => child.textContent), summary.split('\n\n'));
    assert.equal(article.children.filter((child) => child.tagName === 'p').length, 2);
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});

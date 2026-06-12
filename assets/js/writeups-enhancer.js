(function () {
  const OWNER = 'hackus-mans';
  const REPO = 'portofiolo';
  const BRANCH = 'main';
  const LEGACY_BASE = '/portofiolo';
  const IS_GITHUB_PAGES = location.hostname.includes('github.io');
  const SITE_BASE = (() => {
    if (!IS_GITHUB_PAGES) return '';
    const first = (location.pathname.split('/').filter(Boolean)[0] || '').trim();
    return first && !first.includes('.') ? '/' + first : '';
  })();

  const state = {
    mode: 'project',
    section: '',
    platform: '',
    category: '',
    search: '',
    pendingItem: '',
    projects: [],
    writeups: [],
    catalog: []
  };

  const byId = id => document.getElementById(id);
  const clean = value => String(value || '').trim();
  const esc = value => clean(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function normalize(value) {
    return clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function slugify(value) {
    return normalize(value).replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
  }

  function assetPath(path) {
    let p = clean(path);
    if (!p || /^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p)) return p;
    if (IS_GITHUB_PAGES) {
      if (SITE_BASE && p.startsWith(SITE_BASE + '/')) return p;
      if (SITE_BASE && p.startsWith(LEGACY_BASE + '/') && SITE_BASE !== LEGACY_BASE) return SITE_BASE + p.slice(LEGACY_BASE.length);
      if (p.startsWith(LEGACY_BASE + '/')) return p;
      if (p.startsWith('/')) return (SITE_BASE || '') + p;
      return p;
    }
    if (p.startsWith(LEGACY_BASE + '/')) return p.replace(LEGACY_BASE + '/', '/');
    if (SITE_BASE && p.startsWith(SITE_BASE + '/')) return p.slice(SITE_BASE.length) || '/';
    return p;
  }

  async function loadJSON(path) {
    const response = await fetch(assetPath(path), { cache: 'no-store' });
    if (!response.ok) throw new Error(path);
    return response.json();
  }

  async function loadText(path) {
    const response = await fetch(assetPath(path), { cache: 'no-store' });
    if (!response.ok) throw new Error(path);
    return response.text();
  }

  async function loadGithubFolder(folder) {
    try {
      const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${folder}?ref=${BRANCH}&t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) return [];
      const files = await response.json();
      if (!Array.isArray(files)) return [];
      const rows = [];
      for (const file of files) {
        if (file.type !== 'file' || !String(file.name || '').toLowerCase().endsWith('.json')) continue;
        try {
          const itemResponse = await fetch(file.download_url + '?t=' + Date.now(), { cache: 'no-store' });
          if (itemResponse.ok) rows.push(await itemResponse.json());
        } catch (error) {}
      }
      return rows;
    } catch (error) {
      return [];
    }
  }

  function asList(value) {
    if (Array.isArray(value)) return value.map(clean).filter(Boolean);
    return clean(value) ? [clean(value)] : [];
  }

  function parseYaml(yaml) {
    const data = {};
    let current = null;
    clean(yaml).split('\n').forEach(line => {
      const s = line.trim();
      if (!s) return;
      if (s.startsWith('- ') && current) {
        data[current] = Array.isArray(data[current]) ? data[current] : [];
        data[current].push(s.slice(2).trim().replace(/^["']|["']$/g, ''));
        return;
      }
      const match = s.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (match) {
        current = match[1];
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        data[current] = value || [];
      }
    });
    return data;
  }

  function splitFrontMatter(markdown) {
    const text = String(markdown || '');
    if (!text.startsWith('---')) return { meta: {}, body: text };
    const end = text.indexOf('\n---', 3);
    if (end === -1) return { meta: {}, body: text };
    return { meta: parseYaml(text.slice(3, end).trim()), body: text.slice(end + 4).trim() };
  }

  function firstParagraph(body) {
    const text = String(body || '')
      .replace(/<[^>]+>/g, '')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/!\[\[[^\]]+\]\]/g, '')
      .replace(/^#\s+.*$/m, '')
      .trim();
    const parts = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !p.startsWith('#') && !p.startsWith('```'));
    return parts[0] || 'Documentation technique disponible dans le contenu détaillé.';
  }

  function aliases(item) {
    const set = new Set();
    const add = value => {
      const v = clean(value);
      if (!v) return;
      set.add(normalize(v));
      set.add(slugify(v));
      const base = v.split('/').pop().replace(/\.md$/i, '');
      if (base) {
        set.add(normalize(base));
        set.add(slugify(base));
      }
    };
    add(item.slug);
    add(item.id);
    add(item.path);
    add(item.obsidianPath);
    add(item.publicTitle);
    add(item.title);
    return Array.from(set).filter(Boolean);
  }

  function mergeRows(base, controls) {
    const output = [];
    function put(item, override) {
      const keys = aliases(item);
      const index = output.findIndex(existing => aliases(existing).some(k => keys.includes(k)));
      if (index >= 0) output[index] = override ? { ...output[index], ...item } : { ...item, ...output[index] };
      else output.push(item);
    }
    base.forEach(item => put(item, false));
    controls.forEach(item => put(item, true));
    return output;
  }

  function projectPathCandidates(item) {
    const paths = [];
    const add = path => {
      let p = clean(path);
      if (!p) return;
      if (p.startsWith('/')) p = p.slice(1);
      if (!p.startsWith('content/projects/')) p = 'content/projects/' + p;
      if (!p.endsWith('.md')) p = p.replace(/\/$/, '') + '.md';
      if (!paths.includes(p)) paths.push(p);
    };
    add(item.path);
    add(item.obsidianPath);
    add(item.title ? slugify(item.title) + '.md' : '');
    add(item.publicTitle ? slugify(item.publicTitle) + '.md' : '');
    return paths;
  }

  function writeupPathCandidates(item) {
    const paths = [];
    const add = path => {
      let p = clean(path);
      if (!p) return;
      if (p.startsWith('/')) p = p.slice(1);
      if (p.startsWith(LEGACY_BASE + '/')) p = p.slice(LEGACY_BASE.length + 1);
      if (!p.startsWith('content/writeups/')) p = 'content/writeups/' + p;
      if (!p.endsWith('.md')) p = p.replace(/\/$/, '') + '.md';
      if (!paths.includes(p)) paths.push(p);
    };
    add(item.path);
    add(item.obsidianPath);
    add(item.title ? slugify(item.title) + '.md' : '');
    add(item.publicTitle ? slugify(item.publicTitle) + '.md' : '');
    return paths;
  }

  async function loadFirstText(paths) {
    for (const path of paths) {
      try {
        return { path, content: await loadText(path) };
      } catch (error) {}
    }
    return { path: paths[0] || '', content: '' };
  }

  async function loadProjectRows() {
    let base = [];
    try {
      const data = await loadJSON('content/projects/project-control.json');
      if (Array.isArray(data.items)) base = data.items;
    } catch (error) {}
    const controls = await loadGithubFolder('content/projects-control');
    return mergeRows(base, controls);
  }

  async function loadProjects() {
    const rows = (await loadProjectRows()).filter(item => item.publish === true || String(item.publish).toLowerCase() === 'true');
    return Promise.all(rows.map(async item => {
      const loaded = await loadFirstText(projectPathCandidates(item));
      const parsed = splitFrontMatter(loaded.content);
      const title = clean(item.publicTitle || parsed.meta.title || item.title);
      return {
        ...item,
        type: 'project',
        title,
        slug: slugify(item.slug || item.id || title || item.path || item.obsidianPath),
        category: clean(item.category || parsed.meta.category || 'Projet'),
        status: clean(item.status || parsed.meta.status || 'Publié'),
        description: clean(item.description || firstParagraph(parsed.body)),
        skills: asList(item.skills).length ? asList(item.skills) : asList(parsed.meta.skills),
        stack: asList(item.tools).length ? asList(item.tools) : asList(parsed.meta.tools),
        documentation: parsed.body,
        path: loaded.path
      };
    }));
  }

  async function loadWriteupRows() {
    let base = [];
    try {
      const data = await loadJSON('content/writeups/writeups.json');
      if (Array.isArray(data.items)) base = data.items;
    } catch (error) {}
    const controls = await loadGithubFolder('content/writeups-control');
    return mergeRows(base, controls);
  }

  async function loadWriteups() {
    const rows = (await loadWriteupRows()).filter(item => item.publish !== false && String(item.publish).toLowerCase() !== 'false');
    return Promise.all(rows.map(async item => {
      const loaded = await loadFirstText(writeupPathCandidates(item));
      const parsed = splitFrontMatter(loaded.content);
      const title = clean(item.publicTitle || parsed.meta.title || item.title);
      return {
        ...item,
        type: 'writeup',
        title,
        slug: slugify(item.slug || item.id || title || item.path || item.obsidianPath),
        sectionLabel: clean(item.sectionLabel || parsed.meta.sectionLabel || 'Writeup'),
        platform: clean(item.platform || parsed.meta.platform || 'Général'),
        category: clean(item.category || parsed.meta.category || 'Général'),
        difficulty: clean(item.difficulty || parsed.meta.difficulty || ''),
        description: clean(item.description || firstParagraph(parsed.body)),
        skills: asList(item.skills).length ? asList(item.skills) : asList(parsed.meta.skills),
        tags: asList(item.tags).length ? asList(item.tags) : asList(parsed.meta.tags),
        documentation: parsed.body,
        path: loaded.path
      };
    }));
  }

  async function loadCatalog() {
    try {
      const data = await loadJSON('content/writeups/writeups-catalog.json');
      return Array.isArray(data.items) ? data.items : [];
    } catch (error) {
      return [];
    }
  }

  function mdToHtml(markdown) {
    if (window.ObsidianFidelity && typeof window.ObsidianFidelity.render === 'function') return window.ObsidianFidelity.render(markdown);
    return '<pre class="obs-code"><code>' + esc(markdown) + '</code></pre>';
  }

  function currentPage() {
    return location.pathname.split('/').pop() || 'realisations.html';
  }

  function queryURL(params) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (clean(value)) q.set(key, clean(value));
    });
    return currentPage() + (q.toString() ? '?' + q.toString() : '');
  }

  function updateUrl(params, replace) {
    const url = queryURL(params);
    if (replace) history.replaceState(null, '', url);
    else history.pushState(null, '', url);
  }

  function readUrl() {
    const params = new URLSearchParams(location.search);
    const type = params.get('type') || params.get('mode') || 'project';
    state.mode = type === 'writeup' || type === 'writeups' ? 'writeup' : 'project';
    state.section = params.get('section') || '';
    state.platform = params.get('platform') || '';
    state.category = params.get('category') || '';
    state.search = params.get('q') || '';
    state.pendingItem = params.get('item') || '';
  }

  function markTabs() {
    document.querySelectorAll('.real-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === state.mode);
    });
  }

  function itemText(item) {
    return normalize([item.title, item.description, item.category, item.platform, item.sectionLabel, item.status, item.difficulty, ...asList(item.skills), ...asList(item.tags), ...asList(item.stack)].join(' '));
  }

  function matchSearch(item) {
    const query = normalize(state.search);
    return !query || itemText(item).includes(query);
  }

  function closeReader() {
    const modal = byId('realisation-reader');
    if (modal) modal.remove();
    document.body.classList.remove('modal-open');
  }

  function canExportPdf(item) {
    return (item.pdfEnabled === true || String(item.pdfEnabled).toLowerCase() === 'true') && clean(item.pdfAccess || 'private') === 'public';
  }

  async function openItem(item, keepUrl) {
    let body = item.documentation || '';
    try {
      if (item.path) body = splitFrontMatter(await loadText(item.path)).body;
    } catch (error) {}
    if (!keepUrl) updateUrl({ type: item.type, item: item.slug }, false);
    closeReader();

    const skills = asList(item.skills).map(skill => `<span class="tag">${esc(skill)}</span>`).join('');
    const tags = asList(item.tags || item.stack).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
    const pdfButton = canExportPdf(item) ? `<button class="real-reader-pdf" type="button" data-pdf-download>${esc(item.pdfLabel || 'Générer le PDF')}</button>` : '';

    const modal = document.createElement('div');
    modal.className = 'realisation-reader';
    modal.id = 'realisation-reader';
    modal.innerHTML = `
      <div class="real-reader-backdrop" data-close-reader="true"></div>
      <section class="real-reader-panel pro-reader" role="dialog" aria-modal="true">
        <header class="real-reader-header pro-reader-head">
          <div>
            <span class="card-kicker">${esc(item.type === 'writeup' ? 'Writeup' : 'Projet')} • ${esc(item.platform || item.category || item.status || 'Publié')}</span>
            <h2>${esc(item.title)}</h2>
            <p>${esc(item.description)}</p>
          </div>
          <div class="real-reader-top-actions">
            ${pdfButton}
            <button class="real-reader-close" type="button" data-close-reader="true">Fermer</button>
          </div>
        </header>
        <div class="real-reader-layout">
          <aside class="real-reader-sidebar">
            <p class="sidebar-title">Informations</p>
            <div class="real-meta">
              <span>${esc(item.type === 'writeup' ? item.sectionLabel : 'Projet')}</span>
              <span>${esc(item.platform || item.status || 'Publié')}</span>
              <span>${esc(item.category || item.difficulty || 'Général')}</span>
            </div>
            ${skills ? `<h4>Compétences</h4><div class="tags">${skills}</div>` : ''}
            ${tags ? `<h4>Tags / outils</h4><div class="tags">${tags}</div>` : ''}
          </aside>
          <article class="real-reader-document markdown-body obsidian-doc pro-doc">${mdToHtml(body)}</article>
        </div>
      </section>`;

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    modal.querySelectorAll('[data-close-reader="true"]').forEach(button => button.addEventListener('click', closeReader));
    setTimeout(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      if (window.ObsidianFidelity && window.ObsidianFidelity.enhance) window.ObsidianFidelity.enhance(modal);
    }, 80);
  }

  function card(item, index) {
    const skills = asList(item.skills).map(skill => `<span class="tag">${esc(skill)}</span>`).join('');
    const tags = asList(item.stack || item.tags).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
    const status = item.type === 'writeup' ? clean(item.difficulty || item.status || 'Publié') : clean(item.status || 'Publié');
    const kicker = item.type === 'writeup' ? `${esc(item.sectionLabel || 'Writeup')} • ${esc(item.platform || '')} • ${esc(item.category || '')}` : `Projet • ${esc(item.category || 'Projet')}`;
    return `<article class="real-card" data-index="${index}">
      <div class="real-card-head"><span class="card-kicker">${kicker}</span><div class="real-meta"><span>${esc(status)}</span></div></div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      ${skills ? `<div class="tags">${skills}</div>` : ''}
      ${tags ? `<div class="tags">${tags}</div>` : ''}
      <div class="real-actions"><button class="btn primary real-open" type="button">${item.type === 'writeup' ? 'Lire le writeup' : 'Lire le projet'}</button></div>
    </article>`;
  }

  function aggregate(list, key, filter = () => true) {
    const set = new Set();
    list.filter(filter).forEach(item => {
      if (item[key]) set.add(item[key]);
    });
    return Array.from(set);
  }

  function branch(label, active, level) {
    return `<button class="branch-card ${active ? 'active' : ''}" type="button" data-level="${level}" data-value="${esc(label)}"><span>${esc(label)}</span></button>`;
  }

  function refreshControls() {
    const controls = byId('writeup-controls');
    if (!controls) return;
    controls.hidden = state.mode !== 'writeup' || !!state.search;
    if (controls.hidden) return;

    const catalog = state.catalog.length ? state.catalog : state.writeups.map(item => ({ sectionLabel: item.sectionLabel, platform: item.platform, category: item.category }));
    const sections = aggregate(catalog, 'sectionLabel');
    const platforms = state.section ? aggregate(catalog, 'platform', item => item.sectionLabel === state.section) : [];
    const categories = state.platform ? aggregate(catalog, 'category', item => item.sectionLabel === state.section && item.platform === state.platform) : [];

    controls.innerHTML = `
      <div class="writeup-browser-head"><div><p class="eyebrow">Navigation Writeups</p><h2>Choisis progressivement</h2></div></div>
      <div class="writeup-step-stack">
        <section class="browser-level browser-level-wide"><div class="level-title"><span>01</span><h3>Type</h3></div><div class="branch-list branch-list-large">${sections.map(section => branch(section, section === state.section, 'section')).join('') || '<p class="level-empty">Aucune section disponible.</p>'}</div></section>
        ${state.section ? `<section class="browser-level browser-level-wide"><div class="level-title"><span>02</span><h3>Plateforme</h3></div><div class="branch-list branch-list-large">${platforms.map(platform => branch(platform, platform === state.platform, 'platform')).join('')}</div></section>` : ''}
        ${state.platform ? `<section class="browser-level browser-level-wide"><div class="level-title"><span>03</span><h3>Catégorie</h3></div><div class="branch-list branch-list-large">${categories.map(category => branch(category, category === state.category, 'category')).join('')}</div></section>` : ''}
      </div>`;

    controls.querySelectorAll('.branch-card').forEach(button => button.addEventListener('click', () => {
      const level = button.dataset.level;
      const value = button.dataset.value;
      if (level === 'section') {
        state.section = value;
        state.platform = '';
        state.category = '';
      }
      if (level === 'platform') {
        state.platform = value;
        state.category = '';
      }
      if (level === 'category') state.category = value;
      updateUrl({ type: 'writeup', section: state.section, platform: state.platform, category: state.category }, false);
      renderList();
    }));
  }

  function currentItems() {
    if (state.mode === 'project') return state.projects.filter(matchSearch);
    if (state.search) return state.writeups.filter(matchSearch);
    if (!state.section || !state.platform || !state.category) return [];
    return state.writeups.filter(item => item.sectionLabel === state.section && item.platform === state.platform && item.category === state.category && matchSearch(item));
  }

  function stepMessage() {
    if (state.search) return 'Aucun résultat trouvé pour cette recherche.';
    if (!state.section) return 'Choisis d’abord Challenges ou Machine/Lab, ou utilise la barre de recherche.';
    if (!state.platform) return 'Choisis maintenant une plateforme.';
    if (!state.category) return 'Choisis maintenant une catégorie.';
    return 'Aucun contenu disponible pour cette sélection.';
  }

  function tryOpenPending() {
    if (!state.pendingItem) return;
    const slug = slugify(state.pendingItem);
    const all = [...state.projects, ...state.writeups];
    const item = all.find(entry => entry.slug === slug || aliases(entry).includes(slug));
    if (!item) return;
    state.pendingItem = '';
    state.mode = item.type;
    state.section = item.sectionLabel || '';
    state.platform = item.platform || '';
    state.category = item.category || '';
    markTabs();
    setTimeout(() => openItem(item, true), 60);
  }

  function renderList() {
    const box = byId('realisations-list');
    if (!box) return;
    markTabs();
    refreshControls();
    const data = currentItems();
    if (!data.length) {
      box.innerHTML = `<div class="real-empty">${state.mode === 'writeup' ? stepMessage() : 'Aucun projet publié ou aucun résultat trouvé.'}</div>`;
      tryOpenPending();
      return;
    }
    box.innerHTML = (state.search ? `<div class="real-search-result">${data.length} résultat(s) trouvé(s)</div>` : '') + data.map((item, index) => card(item, index)).join('');
    box.querySelectorAll('.real-open').forEach(button => button.addEventListener('click', () => openItem(data[Number(button.closest('.real-card').dataset.index)])));
    tryOpenPending();
  }

  function initTabs() {
    document.querySelectorAll('.real-tab').forEach(tab => {
      tab.addEventListener('click', event => {
        event.preventDefault();
        state.mode = tab.dataset.filter === 'writeup' ? 'writeup' : 'project';
        state.section = '';
        state.platform = '';
        state.category = '';
        state.search = '';
        state.pendingItem = '';
        const input = byId('realisation-search');
        if (input) input.value = '';
        updateUrl({ type: state.mode }, false);
        renderList();
      });
    });
  }

  function initSearch() {
    const input = byId('realisation-search');
    const clear = byId('realisation-search-clear');
    if (!input) return;
    input.value = state.search;
    input.addEventListener('input', () => {
      state.search = input.value.trim();
      updateUrl({ type: state.mode, section: state.section, platform: state.platform, category: state.category, q: state.search }, true);
      renderList();
    });
    if (clear) clear.addEventListener('click', () => {
      input.value = '';
      state.search = '';
      updateUrl({ type: state.mode, section: state.section, platform: state.platform, category: state.category }, false);
      renderList();
      input.focus();
    });
  }

  async function init() {
    const box = byId('realisations-list');
    if (!box) return;
    box.innerHTML = '<div class="real-empty">Chargement des réalisations...</div>';
    readUrl();
    const [projects, writeups, catalog] = await Promise.all([loadProjects(), loadWriteups(), loadCatalog()]);
    state.projects = projects;
    state.writeups = writeups;
    state.catalog = catalog;
    initTabs();
    initSearch();
    renderList();
    window.addEventListener('popstate', () => {
      readUrl();
      renderList();
    });
  }

  setTimeout(init, 250);
})();

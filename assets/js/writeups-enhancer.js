(function(){
  const repoOwner = 'hackus-mans';
  const repoName = 'portofiolo';
  const repoBranch = 'main';

  const state = {
    mode: 'project',
    writeupSection: '',
    writeupPlatform: '',
    writeupCategory: '',
    projects: [],
    writeups: []
  };

  function safe(v){ return String(v || ''); }
  function byId(id){ return document.getElementById(id); }
  async function loadJSON(path){ const r = await fetch(path, {cache:'no-store'}); if(!r.ok) throw new Error(path); return r.json(); }
  async function loadText(path){ const r = await fetch(path, {cache:'no-store'}); if(!r.ok) throw new Error(path); return r.text(); }
  function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }
  function escapeHtml(v){ return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function countLabel(n){ return n > 1 ? `${n} éléments` : `${n} élément`; }

  function parseSimpleYaml(yaml){
    const obj = {};
    let current = null;
    safe(yaml).split('\n').forEach(line => {
      const trimmed = line.trim();
      if(!trimmed) return;
      if(trimmed.startsWith('- ') && current){
        obj[current] = obj[current] || [];
        if(Array.isArray(obj[current])) obj[current].push(trimmed.slice(2).trim().replace(/^['"]|['"]$/g,''));
        return;
      }
      const m = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if(m){
        current = m[1];
        const value = m[2].trim().replace(/^['"]|['"]$/g,'');
        obj[current] = value ? value : [];
      }
    });
    return obj;
  }

  function splitFrontMatter(md){
    const text = safe(md);
    if(!text.startsWith('---')) return {meta:{}, body:text};
    const end = text.indexOf('\n---', 3);
    if(end === -1) return {meta:{}, body:text};
    return { meta: parseSimpleYaml(text.slice(3, end).trim()), body: text.slice(end + 4).trim() };
  }

  function getMarkdownTitle(body, fallback){
    const m = safe(body).match(/^#\s+(.+)$/m);
    return m ? m[1].trim() : fallback;
  }

  function getFirstParagraph(body){
    const clean = safe(body).replace(/^#\s+.*$/m,'').trim();
    const parts = clean.split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !p.startsWith('#') && !p.startsWith('```') && !p.startsWith('!['));
    return parts[0] || 'Documentation publiée depuis Obsidian.';
  }

  function fileNameTitle(name){ return safe(name).replace(/\.md$/,'').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }

  async function loadMarkdownProjects(){
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/projects?ref=${repoBranch}`;
    try{
      const list = await loadJSON(apiUrl);
      const files = Array.isArray(list) ? list.filter(f => f.type === 'file' && f.name.endsWith('.md')) : [];
      const docs = await Promise.all(files.map(async f => ({name:f.name, content: await loadText(f.download_url)})));
      return docs.map(doc => {
        const parsed = splitFrontMatter(doc.content);
        const title = getMarkdownTitle(parsed.body, fileNameTitle(doc.name));
        return {
          type:'project',
          title,
          category: parsed.meta.category || 'Projet',
          level: parsed.meta.level || 'À définir',
          status: parsed.meta.status || 'À documenter',
          description: getFirstParagraph(parsed.body),
          stack: Array.isArray(parsed.meta.tools) ? parsed.meta.tools : [],
          skills: Array.isArray(parsed.meta.skills) ? parsed.meta.skills : [],
          github: parsed.meta.github || '#',
          demo: parsed.meta.demo || '#',
          documentation: parsed.body
        };
      });
    }catch(e){ return []; }
  }

  async function loadWriteups(){
    try{
      const data = await loadJSON('content/writeups/writeups.json');
      return Array.isArray(data.items) ? data.items.map(item => ({...item, type:'writeup'})) : [];
    }catch(e){ return []; }
  }

  function markdownToHtml(md){
    let text = safe(md);
    const codeBlocks = [];
    text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function(_, lang, code){
      const token = `@@CODE${codeBlocks.length}@@`;
      codeBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
      return token;
    });
    text = escapeHtml(text);
    text = text.replace(/^### (.*)$/gm,'<h4>$1</h4>').replace(/^## (.*)$/gm,'<h3>$1</h3>').replace(/^# (.*)$/gm,'<h2>$1</h2>');
    text = text.replace(/!\[(.*?)\]\((.*?)\)/g,'<img src="$2" alt="$1">');
    text = text.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2">$1</a>');
    text = text.replace(/^\- (.*)$/gm,'<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g,m=>`<ul>${m}</ul>`);
    text = text.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean).map(block => /^<(h\d|ul|pre|img)/.test(block) ? block : `<p>${block.replace(/\n/g,'<br>')}</p>`).join('\n');
    codeBlocks.forEach((html,i)=>{ text = text.replace(`@@CODE${i}@@`, html); });
    return text;
  }

  function closeReader(){ const m = byId('realisation-reader'); if(m) m.remove(); document.body.classList.remove('modal-open'); }

  function openReader(item, body){
    closeReader();
    const tags = (item.tags || item.stack || []).map(t => `<span class="tag">${safe(t)}</span>`).join('');
    const meta = `<div class="real-meta"><span>${safe(item.sectionLabel || item.category || 'Projet')}</span><span>${safe(item.platform || item.status || 'Publié')}</span><span>${safe(item.category || item.difficulty || 'À définir')}</span></div>`;
    const sidebar = `<aside class="real-reader-sidebar"><p class="sidebar-title">${item.type === 'writeup' ? 'Writeup info' : 'Project info'}</p>${meta}${tags ? `<h4>Tags / Outils</h4><div class="tags">${tags}</div>` : ''}</aside>`;
    const modal = document.createElement('div');
    modal.className = 'realisation-reader';
    modal.id = 'realisation-reader';
    modal.innerHTML = `<div class="real-reader-backdrop" data-close-reader="true"></div><section class="real-reader-panel" role="dialog" aria-modal="true"><header class="real-reader-header"><div><span class="card-kicker">${safe(item.sectionLabel || item.type)} • ${safe(item.platform || item.category)}</span><h2>${safe(item.title)}</h2><p>${safe(item.description)}</p></div><button class="real-reader-close" type="button" data-close-reader="true">Fermer</button></header><div class="real-reader-layout">${sidebar}<article class="real-reader-document markdown-body obsidian-doc">${markdownToHtml(body || item.documentation || '')}</article></div></section>`;
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    modal.querySelectorAll('[data-close-reader="true"]').forEach(btn => btn.addEventListener('click', closeReader));
    if(window.MutationObserver){ setTimeout(()=>document.dispatchEvent(new Event('DOMContentLoaded')), 10); }
  }

  async function openItem(item){
    if(item.type === 'writeup' && item.path){
      const text = await loadText(item.path);
      const parsed = splitFrontMatter(text);
      openReader(item, parsed.body);
      return;
    }
    openReader(item, item.documentation || '');
  }

  function card(item, index){
    const tags = (item.stack || item.tags || []).map(t => `<span class="tag">${safe(t)}</span>`).join('');
    const kicker = item.type === 'writeup' ? `${safe(item.sectionLabel)} • ${safe(item.platform)} • ${safe(item.category)}` : `Projet • ${safe(item.category)}`;
    const status = item.type === 'writeup' ? safe(item.difficulty || item.status || 'Publié') : safe(item.status || 'À documenter');
    return `<article class="real-card" data-index="${index}" data-type="${safe(item.type)}"><div class="real-card-head"><span class="card-kicker">${kicker}</span><div class="real-meta"><span>${status}</span></div></div><h3>${safe(item.title)}</h3><p>${safe(item.description)}</p><div class="tags">${tags}</div><div class="real-actions"><button class="btn primary real-open" type="button">Lire la documentation</button></div></article>`;
  }

  function branchButton(label, count, active, disabled, level, value){
    return `<button class="branch-card ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}" type="button" data-level="${level}" data-value="${safe(label)}" ${disabled ? 'disabled' : ''}><span>${safe(label)}</span><small>${countLabel(count)}</small></button>`;
  }

  function countBy(list, key){
    const map = new Map();
    list.forEach(item => map.set(item[key], (map.get(item[key]) || 0) + 1));
    return map;
  }

  function breadcrumb(){
    const parts = ['Writeups'];
    if(state.writeupSection) parts.push(state.writeupSection);
    if(state.writeupPlatform) parts.push(state.writeupPlatform);
    if(state.writeupCategory) parts.push(state.writeupCategory);
    return parts.map((p,i)=> i === 0 ? safe(p) : `<span>/</span> ${safe(p)}`).join(' ');
  }

  function refreshWriteupControls(){
    const controls = byId('writeup-controls');
    if(!controls) return;
    controls.hidden = state.mode !== 'writeup';
    if(state.mode !== 'writeup') return;

    const allSections = ['Challenges', 'Machine/Lab'];
    const sectionCounts = countBy(state.writeups, 'sectionLabel');
    const availableSections = allSections.filter(s => (sectionCounts.get(s) || 0) > 0);

    if(state.writeupSection && !availableSections.includes(state.writeupSection)){
      state.writeupSection = '';
      state.writeupPlatform = '';
      state.writeupCategory = '';
    }

    const platformSource = state.writeupSection ? state.writeups.filter(w => w.sectionLabel === state.writeupSection) : [];
    const platforms = uniq(platformSource.map(w => w.platform));
    if(state.writeupPlatform && !platforms.includes(state.writeupPlatform)){
      state.writeupPlatform = '';
      state.writeupCategory = '';
    }

    const categorySource = state.writeupPlatform ? platformSource.filter(w => w.platform === state.writeupPlatform) : [];
    const categories = uniq(categorySource.map(w => w.category));
    if(state.writeupCategory && !categories.includes(state.writeupCategory)){
      state.writeupCategory = '';
    }

    const platformCounts = countBy(platformSource, 'platform');
    const categoryCounts = countBy(categorySource, 'category');

    const sectionLevel = `
      <section class="browser-level browser-level-wide">
        <div class="level-title"><span>01</span><h3>D’abord : choisis le type</h3></div>
        <div class="branch-list branch-list-large">
          ${allSections.map(s => branchButton(s, sectionCounts.get(s) || 0, s === state.writeupSection, (sectionCounts.get(s) || 0) === 0, 'section', s)).join('')}
        </div>
      </section>`;

    const platformLevel = state.writeupSection ? `
      <section class="browser-level browser-level-wide">
        <div class="level-title"><span>02</span><h3>Ensuite : choisis la plateforme</h3></div>
        <div class="branch-list branch-list-large">
          ${platforms.length ? platforms.map(p => branchButton(p, platformCounts.get(p) || 0, p === state.writeupPlatform, false, 'platform', p)).join('') : '<p class="level-empty">Aucune plateforme publiée dans cette section.</p>'}
        </div>
      </section>` : '';

    const categoryLevel = state.writeupPlatform ? `
      <section class="browser-level browser-level-wide">
        <div class="level-title"><span>03</span><h3>Puis : choisis la catégorie</h3></div>
        <div class="branch-list branch-list-large">
          ${categories.length ? categories.map(c => branchButton(c, categoryCounts.get(c) || 0, c === state.writeupCategory, false, 'category', c)).join('') : '<p class="level-empty">Aucune catégorie publiée pour cette plateforme.</p>'}
        </div>
      </section>` : '';

    const finalLevel = state.writeupCategory ? `
      <section class="browser-level browser-level-wide ready-level">
        <div class="level-title"><span>04</span><h3>Enfin : les writeups disponibles s’affichent en bas</h3></div>
        <p class="level-empty">Tu es dans ${safe(state.writeupSection)} / ${safe(state.writeupPlatform)} / ${safe(state.writeupCategory)}.</p>
      </section>` : '';

    controls.innerHTML = `
      <div class="writeup-browser-head">
        <div>
          <p class="eyebrow">Navigation Writeups</p>
          <h2>Parcours étape par étape</h2>
        </div>
        <div class="writeup-breadcrumb">${breadcrumb()}</div>
      </div>
      <div class="writeup-step-stack">
        ${sectionLevel}
        ${platformLevel}
        ${categoryLevel}
        ${finalLevel}
      </div>
    `;

    controls.querySelectorAll('.branch-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        const value = btn.dataset.value;
        if(level === 'section'){
          state.writeupSection = value;
          state.writeupPlatform = '';
          state.writeupCategory = '';
        }
        if(level === 'platform'){
          state.writeupPlatform = value;
          state.writeupCategory = '';
        }
        if(level === 'category'){
          state.writeupCategory = value;
        }
        renderList();
      });
    });
  }

  function writeupStepMessage(){
    if(!state.writeupSection) return 'Choisis d’abord Challenges ou Machine/Lab.';
    if(!state.writeupPlatform) return 'Choisis maintenant une plateforme.';
    if(!state.writeupCategory) return 'Choisis maintenant une catégorie.';
    return 'Aucun writeup publié dans cette branche. Va dans Sveltia CMS > Publication Writeups Obsidian, puis coche les notes à publier.';
  }

  function currentItems(){
    if(state.mode === 'project') return state.projects;
    if(!state.writeupSection || !state.writeupPlatform || !state.writeupCategory) return [];
    return state.writeups.filter(w => w.sectionLabel === state.writeupSection && w.platform === state.writeupPlatform && w.category === state.writeupCategory);
  }

  function renderList(){
    const box = byId('realisations-list');
    if(!box) return;
    refreshWriteupControls();
    const data = currentItems();
    if(!data.length){
      box.innerHTML = `<div class="real-empty">${state.mode === 'writeup' ? writeupStepMessage() : 'Aucun projet disponible pour le moment.'}</div>`;
      return;
    }
    box.innerHTML = data.map(card).join('');
    box.querySelectorAll('.real-open').forEach(btn => btn.addEventListener('click', () => {
      const idx = Number(btn.closest('.real-card').dataset.index);
      openItem(data[idx]);
    }));
  }

  function initTabs(){
    document.querySelectorAll('.real-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.real-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mode = btn.dataset.filter === 'writeup' ? 'writeup' : 'project';
        if(state.mode === 'writeup'){
          state.writeupSection = '';
          state.writeupPlatform = '';
          state.writeupCategory = '';
        }
        renderList();
      });
    });
  }

  async function init(){
    const box = byId('realisations-list');
    if(!box) return;
    const [projects, writeups] = await Promise.all([loadMarkdownProjects(), loadWriteups()]);
    state.projects = projects;
    state.writeups = writeups;
    initTabs();
    renderList();
  }

  setTimeout(init, 350);
})();
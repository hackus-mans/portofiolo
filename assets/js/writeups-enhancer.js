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
  function titleize(v){ return safe(v).replace(/[-_]+/g,' ').trim(); }
  function escapeHtml(v){ return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

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

  function setButtons(container, values, current, onClick){
    if(!container) return;
    container.innerHTML = values.map(v => `<button class="sub-tab ${v === current ? 'active' : ''}" type="button" data-value="${safe(v)}">${safe(v)}</button>`).join('');
    container.querySelectorAll('.sub-tab').forEach(btn => btn.addEventListener('click', () => onClick(btn.dataset.value)));
  }

  function refreshWriteupControls(){
    const controls = byId('writeup-controls');
    if(controls) controls.hidden = state.mode !== 'writeup';
    if(state.mode !== 'writeup') return;

    const sections = uniq(state.writeups.map(w => w.sectionLabel));
    if(!state.writeupSection || !sections.includes(state.writeupSection)) state.writeupSection = sections[0] || '';

    const platforms = uniq(state.writeups.filter(w => w.sectionLabel === state.writeupSection).map(w => w.platform));
    if(!state.writeupPlatform || !platforms.includes(state.writeupPlatform)) state.writeupPlatform = platforms[0] || '';

    const categories = uniq(state.writeups.filter(w => w.sectionLabel === state.writeupSection && w.platform === state.writeupPlatform).map(w => w.category));
    if(!state.writeupCategory || !categories.includes(state.writeupCategory)) state.writeupCategory = categories[0] || '';

    setButtons(byId('writeup-section-tabs'), sections, state.writeupSection, v => { state.writeupSection = v; state.writeupPlatform = ''; state.writeupCategory = ''; renderList(); });
    setButtons(byId('writeup-platform-tabs'), platforms, state.writeupPlatform, v => { state.writeupPlatform = v; state.writeupCategory = ''; renderList(); });
    setButtons(byId('writeup-category-tabs'), categories, state.writeupCategory, v => { state.writeupCategory = v; renderList(); });
  }

  function currentItems(){
    if(state.mode === 'project') return state.projects;
    return state.writeups.filter(w => w.sectionLabel === state.writeupSection && w.platform === state.writeupPlatform && w.category === state.writeupCategory);
  }

  function renderList(){
    const box = byId('realisations-list');
    if(!box) return;
    refreshWriteupControls();
    const data = currentItems();
    if(!data.length){
      box.innerHTML = `<div class="real-empty">${state.mode === 'writeup' ? 'Aucun writeup publié dans cette sélection. Ajoute publish: true dans la note Obsidian pour l’afficher ici.' : 'Aucun projet disponible pour le moment.'}</div>`;
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
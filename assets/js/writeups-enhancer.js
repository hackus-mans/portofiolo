(function(){
  const state={mode:'project',writeupSection:'',writeupPlatform:'',writeupCategory:'',projects:[],writeups:[],catalog:[],search:''};
  const IS_GITHUB_PAGES=location.hostname.includes('github.io');

  function safe(v){return String(v||'')}
  function byId(id){return document.getElementById(id)}
  function assetPath(path){
    let p=safe(path).trim();
    if(!p) return p;
    if(/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p)) return p;
    if(IS_GITHUB_PAGES){
      if(p.startsWith('/portofiolo/')) return p;
      if(p.startsWith('/')) return '/portofiolo'+p;
      return p;
    }
    if(p.startsWith('/portofiolo/')) return p.replace('/portofiolo/','/');
    return p;
  }
  async function loadJSON(path){const r=await fetch(assetPath(path),{cache:'no-store'});if(!r.ok)throw new Error(path);return r.json()}
  async function loadText(path){const r=await fetch(assetPath(path),{cache:'no-store'});if(!r.ok)throw new Error(path);return r.text()}
  function esc(v){return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function normalize(v){return safe(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  function slugify(v){return normalize(v).replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'')||'file'}
  function asList(v){return Array.isArray(v)?v.filter(Boolean):safe(v)?[safe(v)]:[]}

  function parseYaml(yaml){const obj={};let cur=null;safe(yaml).split('\n').forEach(line=>{const s=line.trim();if(!s)return;if(s.startsWith('- ')&&cur){obj[cur]=obj[cur]||[];if(Array.isArray(obj[cur]))obj[cur].push(s.slice(2).trim().replace(/^['"]|['"]$/g,''));return}const m=s.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);if(m){cur=m[1];const v=m[2].trim().replace(/^['"]|['"]$/g,'');obj[cur]=v?v:[]}});return obj}
  function splitFM(md){const text=safe(md);if(!text.startsWith('---'))return{meta:{},body:text};const end=text.indexOf('\n---',3);if(end===-1)return{meta:{},body:text};return{meta:parseYaml(text.slice(3,end).trim()),body:text.slice(end+4).trim()}}
  function firstPara(body){const clean=safe(body).replace(/^#\s+.*$/m,'').trim();const parts=clean.split(/\n\s*\n/).map(p=>p.trim()).filter(p=>p&&!p.startsWith('#')&&!p.startsWith('```')&&!p.startsWith('!['));return parts[0]||'Documentation publiée depuis Obsidian.'}

  async function loadProjects(){
    try{
      const control=await loadJSON('content/projects/project-control.json');
      const items=Array.isArray(control.items)?control.items.filter(i=>i.publish):[];
      const docs=await Promise.all(items.map(async item=>{
        const title=safe(item.publicTitle||item.title);
        const path=`content/projects/${slugify(title)}.md`;
        let content='';
        try{content=await loadText(path)}catch(e){}
        const parsed=splitFM(content);
        return {type:'project',title:title,category:item.category||parsed.meta.category||'Projet',level:parsed.meta.level||'À définir',status:item.status||parsed.meta.status||'À documenter',description:firstPara(parsed.body),stack:asList(item.tools).length?asList(item.tools):asList(parsed.meta.tools),skills:asList(item.skills).length?asList(item.skills):asList(parsed.meta.skills),github:parsed.meta.github||'#',demo:parsed.meta.demo||'#',documentation:parsed.body,path:path};
      }));
      return docs;
    }catch(e){return []}
  }
  async function loadWriteups(){try{const d=await loadJSON('content/writeups/writeups.json');return Array.isArray(d.items)?d.items.map(i=>({...i,type:'writeup'})):[]}catch(e){return[]}}
  async function loadCatalog(){try{const d=await loadJSON('content/writeups/writeups-catalog.json');return Array.isArray(d.items)?d.items:[]}catch(e){return[]}}

  function itemText(item){return normalize([item.title,item.description,item.category,item.platform,item.sectionLabel,item.status,item.difficulty,...asList(item.skills),...asList(item.tags),...asList(item.stack)].join(' '))}
  function matchSearch(item){const q=normalize(state.search);return !q||itemText(item).includes(q)}

  function mediaHtml(alt,url){
    const src=assetPath(url);
    const clean=safe(src).split('?')[0].split('#')[0].toLowerCase();
    const caption=esc(alt||safe(url).split('/').pop()||'Pièce jointe');
    if(/\.(png|jpe?g|gif|webp|svg)$/i.test(clean)) return `<figure class="doc-media"><img src="${esc(src)}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;
    if(/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(clean)) return `<figure class="doc-media"><audio controls src="${esc(src)}"></audio><figcaption>${caption}</figcaption></figure>`;
    if(/\.(mp4|webm|mov|mkv)$/i.test(clean)) return `<figure class="doc-media"><video controls src="${esc(src)}"></video><figcaption>${caption}</figcaption></figure>`;
    if(/\.pdf$/i.test(clean)) return `<p><a class="doc-attachment" href="${esc(src)}" target="_blank" rel="noopener">Ouvrir le PDF : ${caption}</a></p>`;
    return `<p><a class="doc-attachment" href="${esc(src)}" target="_blank" rel="noopener">Ouvrir la pièce jointe : ${caption}</a></p>`;
  }
  function linkHref(url){return /^(https?:|mailto:|tel:|#)/i.test(safe(url))?safe(url):assetPath(url)}

  function mdToHtml(md){let text=safe(md);const codes=[];text=text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,(_,lang,code)=>{const token=`@@CODE${codes.length}@@`;codes.push(`<pre><code>${esc(code)}</code></pre>`);return token});text=esc(text);text=text.replace(/^### (.*)$/gm,'<h4>$1</h4>').replace(/^## (.*)$/gm,'<h3>$1</h3>').replace(/^# (.*)$/gm,'<h2>$1</h2>');text=text.replace(/!\[(.*?)\]\((.*?)\)/g,(_,alt,url)=>mediaHtml(alt,url));text=text.replace(/\[(.*?)\]\((.*?)\)/g,(_,label,url)=>`<a href="${esc(linkHref(url))}" target="_blank" rel="noopener">${label}</a>`);text=text.replace(/^\- (.*)$/gm,'<li>$1</li>');text=text.replace(/(<li>.*<\/li>\n?)+/g,m=>`<ul>${m}</ul>`);text=text.split(/\n\s*\n/).map(b=>b.trim()).filter(Boolean).map(b=>/^<(h\d|ul|pre|figure|p><a|img|video|audio)/.test(b)?b:`<p>${b.replace(/\n/g,'<br>')}</p>`).join('\n');codes.forEach((h,i)=>text=text.replace(`@@CODE${i}@@`,h));return text}
  function closeReader(){const m=byId('realisation-reader');if(m)m.remove();document.body.classList.remove('modal-open')}
  async function openItem(item){let body=item.documentation||'';try{if(item.type==='writeup'&&item.path){const text=await loadText(item.path);body=splitFM(text).body}if(item.type==='project'&&item.path&&!body){const text=await loadText(item.path);body=splitFM(text).body}}catch(e){body=`# ${safe(item.title)}\n\nImpossible de charger le fichier complet pour le moment. Vérifie le déploiement ou le chemin du fichier.\n\n${safe(item.description)}`}
    closeReader();const skills=asList(item.skills).map(t=>`<span class="tag">${safe(t)}</span>`).join('');const tags=asList(item.tags||item.stack).map(t=>`<span class="tag">${safe(t)}</span>`).join('');const modal=document.createElement('div');modal.className='realisation-reader';modal.id='realisation-reader';modal.innerHTML=`<div class="real-reader-backdrop" data-close-reader="true"></div><section class="real-reader-panel pro-reader" role="dialog" aria-modal="true"><header class="real-reader-header pro-reader-head"><div><span class="card-kicker">${safe(item.sectionLabel||item.type)} • ${safe(item.platform||item.category)}</span><h2>${safe(item.title)}</h2><p>${safe(item.description)}</p></div><button class="real-reader-close" type="button" data-close-reader="true">Fermer</button></header><div class="real-reader-layout"><aside class="real-reader-sidebar"><p class="sidebar-title">Informations</p><div class="real-meta"><span>${safe(item.sectionLabel||'Projet')}</span><span>${safe(item.platform||item.status||'Publié')}</span><span>${safe(item.category||item.difficulty||'À définir')}</span></div>${skills?`<h4>Compétences acquises</h4><div class="tags">${skills}</div>`:''}${tags?`<h4>Tags / outils</h4><div class="tags">${tags}</div>`:''}</aside><article class="real-reader-document markdown-body obsidian-doc pro-doc">${mdToHtml(body)}</article></div></section>`;document.body.appendChild(modal);document.body.classList.add('modal-open');modal.querySelectorAll('[data-close-reader="true"]').forEach(b=>b.addEventListener('click',closeReader));setTimeout(()=>document.dispatchEvent(new Event('DOMContentLoaded')),10)}

  function card(item,i){const skills=asList(item.skills).map(t=>`<span class="tag">${safe(t)}</span>`).join('');const tags=asList(item.stack||item.tags).map(t=>`<span class="tag">${safe(t)}</span>`).join('');const kicker=item.type==='writeup'?`${safe(item.sectionLabel)} • ${safe(item.platform)} • ${safe(item.category)}`:`Projet • ${safe(item.category)}`;const status=item.type==='writeup'?safe(item.difficulty||item.status||'Publié'):safe(item.status||'À documenter');const label=item.type==='writeup'?'Lire le writeup':'Lire le projet';return `<article class="real-card" data-index="${i}"><div class="real-card-head"><span class="card-kicker">${kicker}</span><div class="real-meta"><span>${status}</span></div></div><h3>${safe(item.title)}</h3><p>${safe(item.description)}</p>${skills?`<div class="tags">${skills}</div>`:''}${tags?`<div class="tags">${tags}</div>`:''}<div class="real-actions"><button class="btn primary real-open" type="button">${label}</button></div></article>`}
  function branch(label,active,level){return `<button class="branch-card ${active?'active':''}" type="button" data-level="${level}" data-value="${safe(label)}"><span>${safe(label)}</span></button>`}
  function aggregate(list,key,filterFn=()=>true){const set=new Set();list.filter(filterFn).forEach(x=>{if(x[key])set.add(x[key])});return [...set]}
  function breadcrumb(){const p=['Writeups'];if(state.writeupSection)p.push(state.writeupSection);if(state.writeupPlatform)p.push(state.writeupPlatform);if(state.writeupCategory)p.push(state.writeupCategory);return p.map((x,i)=>i?`<span>/</span> ${safe(x)}`:safe(x)).join(' ')}

  function refreshControls(){const controls=byId('writeup-controls');if(!controls)return;controls.hidden=state.mode!=='writeup'||!!state.search;if(state.mode!=='writeup'||state.search)return;const cat=state.catalog.length?state.catalog:state.writeups.map(w=>({sectionLabel:w.sectionLabel,platform:w.platform,category:w.category}));const sections=['Challenges','Machine/Lab'].filter(s=>cat.some(x=>x.sectionLabel===s));if(state.writeupSection&&!sections.includes(state.writeupSection)){state.writeupSection='';state.writeupPlatform='';state.writeupCategory=''}const platforms=state.writeupSection?aggregate(cat,'platform',x=>x.sectionLabel===state.writeupSection):[];if(state.writeupPlatform&&!platforms.includes(state.writeupPlatform)){state.writeupPlatform='';state.writeupCategory=''}const categories=state.writeupPlatform?aggregate(cat,'category',x=>x.sectionLabel===state.writeupSection&&x.platform===state.writeupPlatform):[];if(state.writeupCategory&&!categories.includes(state.writeupCategory))state.writeupCategory='';
    controls.innerHTML=`<div class="writeup-browser-head"><div><p class="eyebrow">Navigation Writeups</p><h2>Choisis progressivement</h2></div><div class="writeup-breadcrumb">${breadcrumb()}</div></div><div class="writeup-step-stack"><section class="browser-level browser-level-wide"><div class="level-title"><span>01</span><h3>Type</h3></div><div class="branch-list branch-list-large">${sections.map(s=>branch(s,s===state.writeupSection,'section')).join('')||'<p class="level-empty">Aucune section détectée.</p>'}</div></section>${state.writeupSection?`<section class="browser-level browser-level-wide"><div class="level-title"><span>02</span><h3>Plateforme</h3></div><div class="branch-list branch-list-large">${platforms.map(p=>branch(p,p===state.writeupPlatform,'platform')).join('')||'<p class="level-empty">Aucune plateforme détectée.</p>'}</div></section>`:''}${state.writeupPlatform?`<section class="browser-level browser-level-wide"><div class="level-title"><span>03</span><h3>Catégorie</h3></div><div class="branch-list branch-list-large">${categories.map(c=>branch(c,c===state.writeupCategory,'category')).join('')||'<p class="level-empty">Aucune catégorie détectée.</p>'}</div></section>`:''}${state.writeupCategory?`<section class="browser-level browser-level-wide ready-level"><div class="level-title"><span>04</span><h3>Writeups disponibles</h3></div><p class="level-empty">Les writeups validés de cette branche s’affichent en bas.</p></section>`:''}</div>`;
    controls.querySelectorAll('.branch-card').forEach(btn=>btn.addEventListener('click',()=>{const l=btn.dataset.level,v=btn.dataset.value;if(l==='section'){state.writeupSection=v;state.writeupPlatform='';state.writeupCategory=''}if(l==='platform'){state.writeupPlatform=v;state.writeupCategory=''}if(l==='category')state.writeupCategory=v;renderList()}))}
  function currentItems(){if(state.mode==='project')return state.projects.filter(matchSearch);if(state.search)return state.writeups.filter(matchSearch);if(!state.writeupSection||!state.writeupPlatform||!state.writeupCategory)return[];return state.writeups.filter(w=>w.sectionLabel===state.writeupSection&&w.platform===state.writeupPlatform&&w.category===state.writeupCategory&&matchSearch(w))}
  function stepMessage(){if(state.search)return 'Aucun résultat trouvé pour cette recherche.';if(!state.writeupSection)return 'Choisis d’abord Challenges ou Machine/Lab, ou utilise la barre de recherche.';if(!state.writeupPlatform)return 'Choisis maintenant une plateforme.';if(!state.writeupCategory)return 'Choisis maintenant une catégorie.';return 'Cette branche existe dans Obsidian, mais aucun writeup n’est validé pour publication dans Sveltia.'}
  function renderList(){const box=byId('realisations-list');if(!box)return;refreshControls();const data=currentItems();if(!data.length){box.innerHTML=`<div class="real-empty">${state.mode==='writeup'?stepMessage():'Aucun projet publié ou aucun résultat trouvé.'}</div>`;return}box.innerHTML=(state.search?`<div class="real-search-result">${data.length} résultat(s) trouvé(s)</div>`:'')+data.map(card).join('');box.querySelectorAll('.real-open').forEach(btn=>btn.addEventListener('click',()=>openItem(data[Number(btn.closest('.real-card').dataset.index)])))}
  function initTabs(){document.querySelectorAll('.real-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.real-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.mode=btn.dataset.filter==='writeup'?'writeup':'project';state.search='';const input=byId('realisation-search');if(input)input.value='';if(state.mode==='writeup'){state.writeupSection='';state.writeupPlatform='';state.writeupCategory=''}renderList()}))}
  function initSearch(){const input=byId('realisation-search');const clear=byId('realisation-search-clear');if(!input)return;input.addEventListener('input',()=>{state.search=input.value.trim();renderList()});if(clear)clear.addEventListener('click',()=>{input.value='';state.search='';renderList();input.focus()})}
  async function init(){const box=byId('realisations-list');if(!box)return;const [projects,writeups,catalog]=await Promise.all([loadProjects(),loadWriteups(),loadCatalog()]);state.projects=projects;state.writeups=writeups;state.catalog=catalog;initTabs();initSearch();renderList()}
  setTimeout(init,350);
})();
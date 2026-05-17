const pageMap={"#apropos":"apropos.html","#competences":"competences.html","#projets":"realisations.html","#realisations":"realisations.html","#articles":"articles.html","#certifications":"certifications.html","#contact":"contact.html"};
if(pageMap[location.hash]){location.replace(pageMap[location.hash]);}

const repoOwner='hackus-mans';
const repoName='portofiolo';
const repoBranch='main';

async function loadJSON(path){const res=await fetch(path,{cache:'no-store'});if(!res.ok){throw new Error('Chargement impossible: '+path)}return res.json()}
async function loadText(path){const res=await fetch(path,{cache:'no-store'});if(!res.ok){throw new Error('Chargement impossible: '+path)}return res.text()}
function byId(id){return document.getElementById(id)}
function setText(id,value){const n=byId(id);if(n)n.textContent=String(value||'')}
function setHref(id,value){const n=byId(id);if(n)n.href=String(value||'#')}
function make(tag,cls,html){const n=document.createElement(tag);if(cls)n.className=cls;if(html)n.innerHTML=html;return n}
function safe(v){return String(v||'')}
function items(data){return Array.isArray(data)?data:(data.items||[])}
function escapeHtml(v){return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function parseSimpleYaml(yaml){
  const obj={};
  const lines=safe(yaml).split('\n');
  let currentKey=null;
  lines.forEach(line=>{
    const trimmed=line.trim();
    if(!trimmed)return;
    if(trimmed.startsWith('- ')&&currentKey){obj[currentKey]=obj[currentKey]||[];obj[currentKey].push(trimmed.slice(2).trim().replace(/^['"]|['"]$/g,''));return;}
    const match=trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if(match){currentKey=match[1];const value=match[2].trim();obj[currentKey]=value?value.replace(/^['"]|['"]$/g,''):[];}
  });
  return obj;
}
function splitFrontMatter(md){
  const text=safe(md);
  if(!text.startsWith('---'))return {meta:{},body:text};
  const end=text.indexOf('\n---',3);
  if(end===-1)return {meta:{},body:text};
  const yaml=text.slice(3,end).trim();
  const body=text.slice(end+4).trim();
  return {meta:parseSimpleYaml(yaml),body};
}
function getMarkdownTitle(body,fallback){
  const match=safe(body).match(/^#\s+(.+)$/m);
  return match?match[1].trim():fallback;
}
function getFirstParagraph(body){
  const clean=safe(body).replace(/^---[\s\S]*?---/,'').replace(/^#\s+.*$/m,'').trim();
  const parts=clean.split(/\n\s*\n/).map(p=>p.trim()).filter(p=>p&&!p.startsWith('#')&&!p.startsWith('```'));
  return parts[0]||'Projet documenté en Markdown.';
}
function fileNameTitle(name){return safe(name).replace(/\.md$/,'').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
async function loadMarkdownProjects(){
  const apiUrl=`https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/projects?ref=${repoBranch}`;
  try{
    const list=await loadJSON(apiUrl);
    const files=Array.isArray(list)?list.filter(f=>f.type==='file'&&f.name.endsWith('.md')):[];
    const docs=await Promise.all(files.map(async f=>({name:f.name,content:await loadText(f.download_url)})));
    return docs.map(doc=>{
      const parsed=splitFrontMatter(doc.content);
      const title=getMarkdownTitle(parsed.body,fileNameTitle(doc.name));
      return {
        type:'project',
        title,
        category:parsed.meta.category||'Projet',
        level:parsed.meta.level||'À définir',
        status:parsed.meta.status||'À documenter',
        description:getFirstParagraph(parsed.body),
        objective:'Documentation complète disponible dans la fiche du projet.',
        stack:Array.isArray(parsed.meta.tools)?parsed.meta.tools:[],
        skills:Array.isArray(parsed.meta.skills)?parsed.meta.skills:[],
        github:parsed.meta.github||'#',
        demo:parsed.meta.demo||'#',
        documentation:parsed.body
      }
    });
  }catch(e){
    console.warn('Chargement des projets Markdown impossible, utilisation du fallback.',e);
    try{
      const content=await loadText('content/projects/portfolio-personnel.md');
      const parsed=splitFrontMatter(content);
      return [{type:'project',title:getMarkdownTitle(parsed.body,'Projet'),category:parsed.meta.category||'Projet',level:parsed.meta.level||'À définir',status:parsed.meta.status||'À documenter',description:getFirstParagraph(parsed.body),objective:'Documentation complète disponible dans la fiche du projet.',stack:Array.isArray(parsed.meta.tools)?parsed.meta.tools:[],skills:[],github:'#',demo:'#',documentation:parsed.body}];
    }catch(err){return []}
  }
}

function forceCloseCertModal(){const modal=document.getElementById('cert-modal');if(modal){modal.classList.remove('open');modal.setAttribute('hidden','hidden');modal.style.display='none';const img=document.getElementById('cert-modal-img');if(img){img.removeAttribute('src');img.removeAttribute('alt');}}document.body.classList.remove('modal-open');}
window.forceCloseCertModal=forceCloseCertModal;
function certCard(c){const type=safe(c.type)==='badge'?'Badge':'Certification';const skills=(c.skills||[]).map(s=>`<span class="tag">${safe(s)}</span>`).join('');const image=safe(c.image||'assets/uploads/certification-placeholder.svg');return `<article class="cert-card" data-type="${safe(c.type||'certification')}" data-title="${safe(c.title)}" data-image="${image}"><button class="cert-image cert-open" type="button" aria-label="Afficher la preuve : ${safe(c.title)}"><img src="${image}" alt="${safe(c.title)}"><span class="zoom-hint">Agrandir</span></button><div class="cert-content"><span class="card-kicker">${type} • ${safe(c.status)}</span><h3>${safe(c.title)}</h3><p class="cert-issuer">${safe(c.issuer)} ${c.date?'— '+safe(c.date):''}</p><p>${safe(c.description)}</p><div class="tags">${skills}</div><button class="btn secondary cert-open" type="button">Voir la preuve</button></div></article>`}
function buildCertModal(){let modal=byId('cert-modal');if(modal)return modal;modal=make('div','cert-modal',`<button class="cert-modal-fixed-close" type="button" aria-label="Fermer">×</button><div class="cert-modal-backdrop"></div><div class="cert-modal-box"><div class="cert-modal-head"><h3 id="cert-modal-title"></h3><button class="cert-modal-close" type="button">Fermer</button></div><img id="cert-modal-img" src="" alt=""></div>`);modal.setAttribute('hidden','hidden');document.body.appendChild(modal);modal.querySelector('.cert-modal-fixed-close').addEventListener('click',forceCloseCertModal);modal.querySelector('.cert-modal-close').addEventListener('click',forceCloseCertModal);modal.querySelector('.cert-modal-backdrop').addEventListener('click',forceCloseCertModal);return modal;}
function openCertModal(title,image){const modal=buildCertModal();setText('cert-modal-title',title);const img=byId('cert-modal-img');img.src=image;img.alt=title;modal.removeAttribute('hidden');modal.style.display='flex';modal.classList.add('open');document.body.classList.add('modal-open')}
document.addEventListener('click',e=>{const openTarget=e.target.closest('.cert-open');if(openTarget){e.preventDefault();const card=openTarget.closest('.cert-card');if(card)openCertModal(card.dataset.title,card.dataset.image);}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')forceCloseCertModal();});
function initCertPreview(){}
function initCertTabs(){const buttons=document.querySelectorAll('.tab-btn');const cards=()=>document.querySelectorAll('.cert-card');buttons.forEach(btn=>btn.addEventListener('click',()=>{const filter=btn.dataset.filter;buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');cards().forEach(card=>{card.style.display=(filter==='all'||card.dataset.type===filter)?'grid':'none';});}));}
function renderAutoCertSkills(certs){const box=byId('cert-skills-list');if(!box)return;const map=new Map();certs.forEach(cert=>{(cert.skills||[]).forEach(skill=>{const key=safe(skill).trim();if(!key)return;if(!map.has(key))map.set(key,[]);map.get(key).push(cert.title);});});box.innerHTML='';if(map.size===0){box.appendChild(make('article','content-panel',`<p>Aucune compétence issue des certifications n'est encore disponible.</p>`));return;}map.forEach((sources,skill)=>{const unique=[...new Set(sources.filter(Boolean))];box.appendChild(make('article','auto-skill-card',`<span class="card-kicker">Validée par ${unique.length} preuve(s)</span><h3>${safe(skill)}</h3><p>Compétence associée à : ${unique.map(safe).join(', ')}</p>`));});}
function realisationLabel(type){return type==='writeup'?'Writeup':type==='lab'?'Lab':'Projet'}
function shortText(text,max=150){const t=safe(text);return t.length>max?t.slice(0,max).trim()+'...':t}
function markdownToHtml(md){
  let text=safe(md);
  const codeBlocks=[];
  text=text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,(m,lang,code)=>{const token=`@@CODE${codeBlocks.length}@@`;codeBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);return token;});
  text=escapeHtml(text);
  text=text.replace(/^### (.*)$/gm,'<h4>$1</h4>').replace(/^## (.*)$/gm,'<h3>$1</h3>').replace(/^# (.*)$/gm,'<h2>$1</h2>');
  text=text.replace(/!\[(.*?)\]\((.*?)\)/g,'<img src="$2" alt="$1">');
  text=text.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2">$1</a>');
  text=text.replace(/^\- (.*)$/gm,'<li>$1</li>');
  text=text.replace(/(<li>.*<\/li>\n?)+/g,m=>`<ul>${m}</ul>`);
  text=text.split(/\n\s*\n/).map(block=>block.trim()).filter(Boolean).map(block=>/^<(h\d|ul|pre|img)/.test(block)?block:`<p>${block.replace(/\n/g,'<br>')}</p>`).join('\n');
  codeBlocks.forEach((html,i)=>{text=text.replace(`@@CODE${i}@@`,html)});
  return text;
}
function realisationCard(r,index){const stack=(r.stack||r.tools||[]).map(t=>`<span class="tag">${safe(t)}</span>`).join('');const skills=(r.skills||[]).map(s=>`<span class="tag">${safe(s)}</span>`).join('');return `<article class="real-card" data-index="${index}" data-type="${safe(r.type||'project')}"><div class="real-card-head"><span class="card-kicker">${realisationLabel(r.type)} • ${safe(r.category)}</span><div class="real-meta"><span>${safe(r.level||'Niveau à définir')}</span><span>${safe(r.status||'Statut à définir')}</span></div></div><h3>${safe(r.title)}</h3><p>${shortText(r.description,180)}</p><div class="tags">${stack}</div><div class="tags">${skills}</div><div class="real-actions"><button class="btn primary real-open" type="button">Lire la documentation</button>${r.github&&r.github!=='#'?`<a class="btn secondary" href="${safe(r.github)}">GitHub</a>`:''}${r.demo&&r.demo!=='#'?`<a class="btn secondary" href="${safe(r.demo)}">Démo / Rapport</a>`:''}</div></article>`}
function openRealisationDetail(r){const box=byId('realisation-detail');if(!box)return;const stack=(r.stack||r.tools||[]).map(t=>`<span class="tag">${safe(t)}</span>`).join('');const skills=(r.skills||[]).map(s=>`<span class="tag">${safe(s)}</span>`).join('');const features=(r.features||[]).map(x=>`<li>${safe(x)}</li>`).join('');const difficulties=(r.difficulties||[]).map(x=>`<li>${safe(x)}</li>`).join('');const results=(r.results||[]).map(x=>`<li>${safe(x)}</li>`).join('');const resources=(r.resources||[]).map(x=>`<a class="resource-link" href="${safe(x.url||'#')}">${safe(x.label)}${x.type?' — '+safe(x.type):''}</a>`).join('');const code=(r.codeSnippets||[]).map(c=>`<div class="code-block"><div class="code-title">${safe(c.title)} <span>${safe(c.language)}</span></div><pre><code>${escapeHtml(c.code)}</code></pre></div>`).join('');const screenshots=(r.screenshots||[]).map(img=>`<img src="${safe(img)}" alt="Capture du projet">`).join('');box.innerHTML=`<section class="detail-panel"><button class="detail-close" type="button">Fermer</button><span class="card-kicker">${realisationLabel(r.type)} • ${safe(r.category)}</span><h2>${safe(r.title)}</h2><p class="detail-lead">${safe(r.description)}</p><div class="real-meta"><span>${safe(r.level)}</span><span>${safe(r.status)}</span></div>${stack?`<h3>Outils utilisés</h3><div class="tags">${stack}</div>`:''}${skills?`<h3>Compétences</h3><div class="tags">${skills}</div>`:''}${features?`<h3>Fonctionnalités</h3><ul>${features}</ul>`:''}${difficulties?`<h3>Difficultés rencontrées</h3><ul>${difficulties}</ul>`:''}${results?`<h3>Résultats obtenus</h3><ul>${results}</ul>`:''}${screenshots?`<h3>Captures</h3><div class="screenshot-grid">${screenshots}</div>`:''}${resources?`<h3>Ressources</h3><div class="resource-grid">${resources}</div>`:''}${code?`<h3>Codes</h3>${code}`:''}<h3>Documentation</h3><div class="markdown-body">${markdownToHtml(r.documentation||'')}</div></section>`;box.hidden=false;box.scrollIntoView({behavior:'smooth'});box.querySelector('.detail-close').addEventListener('click',()=>{box.hidden=true;});}
function initRealisationTabs(data){const buttons=document.querySelectorAll('.real-tab');const cards=()=>document.querySelectorAll('.real-card');buttons.forEach(btn=>btn.addEventListener('click',()=>{const filter=btn.dataset.filter;buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');let count=0;cards().forEach(card=>{const visible=card.dataset.type===filter;card.style.display=visible?'block':'none';if(visible)count++;});const empty=byId('realisations-empty');if(empty)empty.style.display=count?'none':'block';}));document.querySelectorAll('.real-open').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.real-card');openRealisationDetail(data[Number(card.dataset.index)]);}));}
function showDefaultRealisationTab(){const active=document.querySelector('.real-tab.active')||document.querySelector('.real-tab');if(active)active.click();}

async function render(){setText('year',new Date().getFullYear());
try{const p=await loadJSON('assets/data/profile.json');setText('profile-name',p.name);setText('profile-title',p.title);setText('profile-bio',p.bio);setText('about-text',p.about);setHref('cv-link',p.cv);const box=byId('contact-links');if(box){box.innerHTML='';(p.contacts||[]).forEach(c=>{const a=make('a','contact-chip',safe(c.label));a.href=safe(c.url);box.appendChild(a)})}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/skills.json'));const box=byId('skills-list');if(box){box.innerHTML='';data.forEach(s=>box.appendChild(make('article','card cyber-card',`<span class="card-kicker">Domaine</span><h3>${safe(s.title)}</h3><p>${safe(s.description)}</p>`)))}}catch(e){console.warn(e)}
try{const mdProjects=await loadMarkdownProjects();const other=items(await loadJSON('assets/data/realisations.json'));const data=[...mdProjects,...other];const box=byId('realisations-list');if(box){box.innerHTML=data.map(realisationCard).join('')+`<div id="realisations-empty" class="real-empty" style="display:none">Aucun élément dans cette catégorie pour le moment.</div>`;initRealisationTabs(data);showDefaultRealisationTab();}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/projects.json'));const box=byId('projects-list');if(box){box.innerHTML='';data.forEach(p=>{const tags=(p.tools||[]).map(t=>`<span class="tag">${safe(t)}</span>`).join('');box.appendChild(make('article','project-card cyber-card',`<span class="card-kicker">${safe(p.category)}</span><h3>${safe(p.title)}</h3><p>${safe(p.description)}</p><div class="tags">${tags}</div><a class="btn secondary" href="${safe(p.url||'#')}">Voir le projet</a>`))})}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/articles.json'));const box=byId('articles-list');if(box){box.innerHTML='';data.forEach(a=>box.appendChild(make('article','card cyber-card',`<span class="card-kicker">${safe(a.date)}</span><h3>${safe(a.title)}</h3><p>${safe(a.summary)}</p><a class="inline-link" href="${safe(a.url||'#')}">Lire l'article</a>`)))}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/certifications.json'));const box=byId('certifications-list');if(box){box.innerHTML=data.map(certCard).join('');initCertTabs();initCertPreview();}renderAutoCertSkills(data);}catch(e){console.warn(e)}
}
render();
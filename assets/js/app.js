const pageMap={"#apropos":"apropos.html","#competences":"competences.html","#projets":"realisations.html","#realisations":"realisations.html","#articles":"articles.html","#certifications":"certifications.html","#contact":"contact.html"};
if(pageMap[location.hash]) location.replace(pageMap[location.hash]);

const IS_GITHUB_PAGES=location.hostname.includes('github.io');
const LEGACY_BASE='/portofiolo';
const SITE_BASE=(()=>{if(!IS_GITHUB_PAGES)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();

function safe(v){return String(v||'').trim()}
function byId(id){return document.getElementById(id)}
function esc(v){return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function items(data){return Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[])}
function normalizeUrl(value){
  const url=safe(value);
  if(!url)return'#';
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url))return'mailto:'+url;
  if(/^www\./i.test(url))return'https://'+url;
  return url;
}
function assetPath(path){
  const p=normalizeUrl(path);
  if(!p||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p))return p||'#';
  if(IS_GITHUB_PAGES){
    if(SITE_BASE&&p.startsWith(SITE_BASE+'/'))return p;
    if(SITE_BASE&&p.startsWith(LEGACY_BASE+'/')&&SITE_BASE!==LEGACY_BASE)return SITE_BASE+p.slice(LEGACY_BASE.length);
    if(p.startsWith(LEGACY_BASE+'/'))return p;
    if(p.startsWith('/'))return (SITE_BASE||'')+p;
    return p;
  }
  if(p.startsWith(LEGACY_BASE+'/'))return p.replace(LEGACY_BASE+'/','/');
  if(SITE_BASE&&p.startsWith(SITE_BASE+'/'))return p.slice(SITE_BASE.length)||'/';
  return p;
}
async function loadJSON(path){
  const res=await fetch(assetPath(path),{cache:'no-store'});
  if(!res.ok)throw new Error(`Impossible de charger ${path} (${res.status})`);
  return res.json();
}
function setText(id,value){const el=byId(id);if(el)el.textContent=safe(value)}
function setHref(id,value){const el=byId(id);if(el)el.href=assetPath(value||'#')}
function extAttrs(url){return /^https?:/i.test(safe(url))?' target="_blank" rel="noopener noreferrer"':''}
function showLoadError(containerId,message){
  const box=byId(containerId);
  if(box&&!box.children.length)box.innerHTML=`<p class="content-error" role="status">${esc(message)}</p>`;
}

function renderProfile(profile){
  setText('profile-name',profile.name||'Hackus Mans');
  setText('profile-title',profile.title||'Portfolio cybersécurité');
  setText('profile-bio',profile.bio||'');
  setText('about-text',profile.about||profile.bio||'');
  setHref('cv-link',profile.cv||'#');
  const contacts=byId('contact-links');
  if(contacts){
    contacts.innerHTML='';
    (profile.contacts||[]).forEach(c=>{
      const a=document.createElement('a');
      a.className='contact-chip';
      a.textContent=safe(c.label)||'Contact';
      a.href=assetPath(c.url||'#');
      if(/^https?:/i.test(a.href)){a.target='_blank';a.rel='noopener noreferrer'}
      contacts.appendChild(a);
    });
    if(!contacts.children.length)contacts.innerHTML='<p class="content-error">Aucun moyen de contact publié.</p>';
  }
}
function renderSkills(data){
  const box=byId('skills-list'); if(!box)return;
  const list=items(data);
  box.innerHTML=list.length?list.map(s=>`<article class="card cyber-card"><span class="card-kicker">Domaine</span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></article>`).join(''):'<p class="content-error">Aucune compétence publiée.</p>';
}
function certCard(c){
  const image=assetPath(c.image||'assets/uploads/certification-placeholder.svg');
  const skills=(c.skills||[]).map(s=>`<span class="tag">${esc(typeof s==='string'?s:s.skill)}</span>`).join('');
  const type=safe(c.type)==='badge'?'Badge':'Certification';
  const url=normalizeUrl(c.credentialUrl);
  const verify=url&&url!=='#'?`<a class="inline-link cert-verify" href="${esc(assetPath(url))}"${extAttrs(url)}>Vérifier la preuve</a>`:'';
  return `<article class="cert-card" data-type="${esc(c.type||'certification')}" data-title="${esc(c.title)}" data-image="${esc(image)}"><button class="cert-image cert-open" type="button" aria-label="Afficher la preuve : ${esc(c.title)}"><img src="${esc(image)}" alt="Preuve de ${esc(c.title)}" loading="lazy"><span class="zoom-hint">Agrandir</span></button><div class="cert-content"><span class="card-kicker">${type} • ${esc(c.status)}</span><h3>${esc(c.title)}</h3><p class="cert-issuer">${esc(c.issuer)} ${c.date?'— '+esc(c.date):''}</p><p>${esc(c.description)}</p><div class="tags">${skills}</div>${verify}</div></article>`;
}
function closeCertModal(){
  const modal=byId('cert-modal');
  if(modal){modal.classList.remove('open');modal.hidden=true;modal.style.display='none'}
  document.body.classList.remove('modal-open');
}
function openCertModal(title,image){
  let modal=byId('cert-modal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='cert-modal'; modal.className='cert-modal'; modal.hidden=true;
    modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-labelledby','cert-modal-title');
    modal.innerHTML='<button class="cert-modal-fixed-close" type="button" aria-label="Fermer la fenêtre">×</button><div class="cert-modal-backdrop"></div><div class="cert-modal-box"><div class="cert-modal-head"><h3 id="cert-modal-title"></h3><button class="cert-modal-close" type="button">Fermer</button></div><img id="cert-modal-img" src="" alt=""></div>';
    document.body.appendChild(modal);
    modal.querySelector('.cert-modal-fixed-close').onclick=closeCertModal;
    modal.querySelector('.cert-modal-close').onclick=closeCertModal;
    modal.querySelector('.cert-modal-backdrop').onclick=closeCertModal;
  }
  setText('cert-modal-title',title);
  const img=byId('cert-modal-img'); img.src=assetPath(image); img.alt=`Preuve de ${title}`;
  modal.hidden=false; modal.style.display='flex'; modal.classList.add('open'); document.body.classList.add('modal-open');
  modal.querySelector('.cert-modal-close').focus();
}
document.addEventListener('click',e=>{const trigger=e.target.closest('.cert-open');if(!trigger)return;e.preventDefault();const card=trigger.closest('.cert-card');if(card)openCertModal(card.dataset.title,card.dataset.image)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCertModal()});

function applyCertificationFilter(filter){
  document.querySelectorAll('.cert-card').forEach(card=>{
    const visible=filter==='all'||card.dataset.type===filter;
    card.hidden=!visible;
  });
}
function renderCertifications(data){
  const box=byId('certifications-list'); if(!box)return;
  const list=items(data);
  box.innerHTML=list.length?list.map(certCard).join(''):'<p class="content-error">Aucune certification publiée.</p>';
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.filter;
    document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});
    btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
    applyCertificationFilter(filter);
  }));
  const active=document.querySelector('.tab-btn.active');
  applyCertificationFilter(active?active.dataset.filter:'all');
}
function renderArticles(data){
  const box=byId('articles-list'); if(!box)return;
  const list=items(data);
  box.innerHTML=list.length?list.map(a=>{const href=assetPath(a.url||'#');return `<article class="card cyber-card"><span class="card-kicker">${esc(a.date)}</span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><a class="inline-link" href="${esc(href)}"${extAttrs(href)}>Lire l'article</a></article>`}).join(''):'<p class="content-error">Aucun article publié.</p>';
}
function setupMobileMenu(){
  document.querySelectorAll('.navbar').forEach(nav=>{
    if(nav.querySelector('.mobile-menu-toggle'))return;
    const links=nav.querySelector('.nav-links');
    if(!links)return;
    const btn=document.createElement('button');
    btn.className='mobile-menu-toggle'; btn.type='button';
    btn.setAttribute('aria-label','Ouvrir le menu'); btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<span></span>';
    nav.insertBefore(btn,links);
    btn.addEventListener('click',()=>{
      const open=nav.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('nav-open'); btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','Ouvrir le menu');
    }));
  });
}
function setupMobileToc(){
  document.querySelectorAll('.real-reader-panel').forEach(panel=>{
    if(panel.querySelector('.toc-mobile-toggle'))return;
    const sidebar=panel.querySelector('.real-reader-sidebar'); if(!sidebar)return;
    const btn=document.createElement('button');
    btn.className='toc-mobile-toggle'; btn.type='button'; btn.textContent='Sommaire'; btn.setAttribute('aria-expanded','false');
    panel.appendChild(btn);
    btn.addEventListener('click',()=>{const open=panel.classList.toggle('toc-open');btn.setAttribute('aria-expanded',open?'true':'false')});
    sidebar.addEventListener('click',event=>{if(event.target.closest('.toc-link')){panel.classList.remove('toc-open');btn.setAttribute('aria-expanded','false')}});
  });
}
function setupMobileUi(){setupMobileMenu();setupMobileToc()}
async function render(){
  setText('year',new Date().getFullYear()); setupMobileUi();
  try{renderProfile(await loadJSON('assets/data/profile.json'))}catch(e){console.error(e);showLoadError('contact-links','Les coordonnées sont temporairement indisponibles.')}
  try{renderSkills(await loadJSON('assets/data/skills.json'))}catch(e){console.error(e);showLoadError('skills-list','Les compétences sont temporairement indisponibles.')}
  try{renderCertifications(await loadJSON('assets/data/certifications.json'))}catch(e){console.error(e);showLoadError('certifications-list','Les certifications sont temporairement indisponibles.')}
  try{renderArticles(await loadJSON('assets/data/articles.json'))}catch(e){console.error(e);showLoadError('articles-list','Les articles sont temporairement indisponibles.')}
  setupMobileUi();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();

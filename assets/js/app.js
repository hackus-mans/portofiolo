const pageMap={"#apropos":"apropos.html","#competences":"competences.html","#projets":"realisations.html","#realisations":"realisations.html","#articles":"articles.html","#certifications":"certifications.html","#contact":"contact.html"};
if(pageMap[location.hash]) location.replace(pageMap[location.hash]);

(function injectFavicon(){
  if(document.querySelector('link[data-hackus-favicon]')) return;
  const icon=document.createElement('link');
  icon.rel='icon';
  icon.type='image/svg+xml';
  icon.href='assets/favicon.svg?v=349';
  icon.dataset.hackusFavicon='true';
  document.head.appendChild(icon);
})();

(function injectMobileFix(){
  if(document.querySelector('link[data-mobile-fix]')) return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='assets/css/mobile-fix.css?v=349';
  link.dataset.mobileFix='true';
  document.head.appendChild(link);
})();

(function injectRealisationsTabs(){
  if(!location.pathname.includes('realisations')) return;
  if(document.querySelector('link[data-realisations-tabs]')) return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='assets/css/realisations-scroll-tabs.css?v=349';
  link.dataset.realisationsTabs='true';
  document.head.appendChild(link);
})();

const IS_GITHUB_PAGES=location.hostname.includes('github.io');
function safe(v){return String(v||'').trim()}
function byId(id){return document.getElementById(id)}
function setText(id,value){const el=byId(id);if(el)el.textContent=safe(value)}
function setHref(id,value){const el=byId(id);if(el)el.href=assetPath(value||'#')}
function escapeHtml(v){return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function make(tag,cls,html){const el=document.createElement(tag);if(cls)el.className=cls;if(html!==undefined)el.innerHTML=html;return el}
function items(data){return Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[])}
function assetPath(path){
  const p=safe(path);
  if(!p||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p))return p||'#';
  if(IS_GITHUB_PAGES){
    if(p.startsWith('/portofiolo/'))return p;
    if(p.startsWith('/'))return '/portofiolo'+p;
    return p;
  }
  if(p.startsWith('/portofiolo/'))return p.replace('/portofiolo/','/');
  return p;
}
async function loadJSON(path){const res=await fetch(assetPath(path),{cache:'no-store'});if(!res.ok)throw new Error('Chargement impossible: '+path);return res.json()}

function renderContacts(profile){
  const box=byId('contact-links');
  if(!box)return;
  box.innerHTML='';
  (profile.contacts||[]).forEach(contact=>{const a=make('a','contact-chip',escapeHtml(contact.label));a.href=assetPath(contact.url);box.appendChild(a)});
}
function renderProfile(profile){
  setText('profile-name',profile.name||'Hackus Mans');
  setText('profile-title',profile.title||'Portfolio cybersécurité');
  setText('profile-bio',profile.bio||'');
  setText('about-text',profile.about||profile.bio||'');
  setHref('cv-link',profile.cv||'#');
  renderContacts(profile);
}
function renderSkills(data){
  const box=byId('skills-list');
  if(!box)return;
  box.innerHTML='';
  items(data).forEach(skill=>box.appendChild(make('article','card cyber-card',`<span class="card-kicker">Domaine</span><h3>${escapeHtml(skill.title)}</h3><p>${escapeHtml(skill.description)}</p>`)));
}
function certCard(c){
  const type=safe(c.type)==='badge'?'Badge':'Certification';
  const image=assetPath(c.image||'assets/uploads/certification-placeholder.svg');
  const skills=(c.skills||[]).map(s=>`<span class="tag">${escapeHtml(s)}</span>`).join('');
  return `<article class="cert-card" data-type="${escapeHtml(c.type||'certification')}" data-title="${escapeHtml(c.title)}" data-image="${escapeHtml(image)}"><button class="cert-image cert-open" type="button" aria-label="Afficher la preuve : ${escapeHtml(c.title)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(c.title)}"><span class="zoom-hint">Agrandir</span></button><div class="cert-content"><span class="card-kicker">${type} • ${escapeHtml(c.status)}</span><h3>${escapeHtml(c.title)}</h3><p class="cert-issuer">${escapeHtml(c.issuer)} ${c.date?'— '+escapeHtml(c.date):''}</p><p>${escapeHtml(c.description)}</p><div class="tags">${skills}</div><button class="btn secondary cert-open" type="button">Voir la preuve</button></div></article>`;
}
function forceCloseCertModal(){
  const modal=byId('cert-modal');
  if(modal){modal.classList.remove('open');modal.setAttribute('hidden','hidden');modal.style.display='none';const img=byId('cert-modal-img');if(img){img.removeAttribute('src');img.removeAttribute('alt')}}
  document.body.classList.remove('modal-open');
}
window.forceCloseCertModal=forceCloseCertModal;
function buildCertModal(){
  let modal=byId('cert-modal');
  if(modal)return modal;
  modal=make('div','cert-modal',`<button class="cert-modal-fixed-close" type="button" aria-label="Fermer">×</button><div class="cert-modal-backdrop"></div><div class="cert-modal-box"><div class="cert-modal-head"><h3 id="cert-modal-title"></h3><button class="cert-modal-close" type="button">Fermer</button></div><img id="cert-modal-img" src="" alt=""></div>`);
  modal.id='cert-modal';modal.setAttribute('hidden','hidden');document.body.appendChild(modal);
  modal.querySelector('.cert-modal-fixed-close').addEventListener('click',forceCloseCertModal);
  modal.querySelector('.cert-modal-close').addEventListener('click',forceCloseCertModal);
  modal.querySelector('.cert-modal-backdrop').addEventListener('click',forceCloseCertModal);
  return modal;
}
function openCertModal(title,image){const modal=buildCertModal();setText('cert-modal-title',title);const img=byId('cert-modal-img');img.src=assetPath(image);img.alt=title;modal.removeAttribute('hidden');modal.style.display='flex';modal.classList.add('open');document.body.classList.add('modal-open')}
document.addEventListener('click',event=>{const trigger=event.target.closest('.cert-open');if(!trigger)return;event.preventDefault();const card=trigger.closest('.cert-card');if(card)openCertModal(card.dataset.title,card.dataset.image)});
document.addEventListener('keydown',event=>{if(event.key==='Escape')forceCloseCertModal()});
function initCertTabs(){
  const buttons=document.querySelectorAll('.tab-btn');
  buttons.forEach(btn=>btn.addEventListener('click',()=>{const filter=btn.dataset.filter;buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.cert-card').forEach(card=>{card.style.display=(filter==='all'||card.dataset.type===filter)?'grid':'none'})}));
}
function renderCertifications(data){
  const box=byId('certifications-list');
  if(!box)return;
  const certs=items(data);
  box.innerHTML=certs.map(certCard).join('');
  initCertTabs();
}
function renderArticles(data){
  const box=byId('articles-list');
  if(!box)return;
  box.innerHTML='';
  items(data).forEach(article=>box.appendChild(make('article','card cyber-card',`<span class="card-kicker">${escapeHtml(article.date)}</span><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.summary)}</p><a class="inline-link" href="${escapeHtml(assetPath(article.url||'#'))}">Lire l'article</a>`)));
}
async function render(){
  setText('year',new Date().getFullYear());
  try{renderProfile(await loadJSON('assets/data/profile.json'))}catch(e){console.warn(e)}
  try{renderSkills(await loadJSON('assets/data/skills.json'))}catch(e){console.warn(e)}
  try{renderArticles(await loadJSON('assets/data/articles.json'))}catch(e){console.warn(e)}
  try{renderCertifications(await loadJSON('assets/data/certifications.json'))}catch(e){console.warn(e)}
}
render();
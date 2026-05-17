const pageMap={"#apropos":"apropos.html","#competences":"competences.html","#projets":"projets.html","#articles":"articles.html","#certifications":"certifications.html","#contact":"contact.html"};
if(pageMap[location.hash]){location.replace(pageMap[location.hash]);}
async function loadJSON(path){const res=await fetch(path,{cache:'no-store'});if(!res.ok){throw new Error('Chargement impossible: '+path)}return res.json()}
function byId(id){return document.getElementById(id)}
function setText(id,value){const n=byId(id);if(n)n.textContent=String(value||'')}
function setHref(id,value){const n=byId(id);if(n)n.href=String(value||'#')}
function make(tag,cls,html){const n=document.createElement(tag);if(cls)n.className=cls;if(html)n.innerHTML=html;return n}
function safe(v){return String(v||'')}
function items(data){return Array.isArray(data)?data:(data.items||[])}
async function render(){setText('year',new Date().getFullYear());
try{const p=await loadJSON('assets/data/profile.json');setText('profile-name',p.name);setText('profile-title',p.title);setText('profile-bio',p.bio);setText('about-text',p.about);setHref('cv-link',p.cv);const box=byId('contact-links');if(box){box.innerHTML='';(p.contacts||[]).forEach(c=>{const a=make('a','contact-chip',safe(c.label));a.href=safe(c.url);box.appendChild(a)})}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/skills.json'));const box=byId('skills-list');if(box){box.innerHTML='';data.forEach(s=>box.appendChild(make('article','card cyber-card',`<span class="card-kicker">Domaine</span><h3>${safe(s.title)}</h3><p>${safe(s.description)}</p>`)))}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/projects.json'));const box=byId('projects-list');if(box){box.innerHTML='';data.forEach(p=>{const tags=(p.tools||[]).map(t=>`<span class="tag">${safe(t)}</span>`).join('');box.appendChild(make('article','project-card cyber-card',`<span class="card-kicker">${safe(p.category)}</span><h3>${safe(p.title)}</h3><p>${safe(p.description)}</p><div class="tags">${tags}</div><a class="btn secondary" href="${safe(p.url||'#')}">Voir le projet</a>`))})}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/articles.json'));const box=byId('articles-list');if(box){box.innerHTML='';data.forEach(a=>box.appendChild(make('article','card cyber-card',`<span class="card-kicker">${safe(a.date)}</span><h3>${safe(a.title)}</h3><p>${safe(a.summary)}</p><a class="inline-link" href="${safe(a.url||'#')}">Lire l'article</a>`)))}}catch(e){console.warn(e)}
try{const data=items(await loadJSON('assets/data/certifications.json'));const box=byId('certifications-list');if(box){box.innerHTML='';data.forEach(c=>box.appendChild(make('span','badge',`${safe(c.title)} — ${safe(c.status)}`)))}}catch(e){console.warn(e)}
}
render();

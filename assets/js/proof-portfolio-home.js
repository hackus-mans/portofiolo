(function(){
  const body=document.body;
  if(!body||!body.classList.contains('proof-portfolio'))return;

  const LEGACY_BASE='/portofiolo';
  const IS_GITHUB_PAGES=location.hostname.includes('github.io');
  const SITE_BASE=(()=>{if(!IS_GITHUB_PAGES)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();
  const clean=value=>String(value||'').trim();
  const esc=value=>clean(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const asItems=data=>Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[]);
  const asList=value=>Array.isArray(value)?value.map(clean).filter(Boolean):(clean(value)?[clean(value)]:[]);
  const published=item=>item&&item.publish!==false&&String(item.publish).toLowerCase()!=='false';

  function assetPath(path){
    let p=clean(path);
    if(!p||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p))return p;
    if(IS_GITHUB_PAGES){
      if(SITE_BASE&&p.startsWith(SITE_BASE+'/'))return p;
      if(SITE_BASE&&p.startsWith(LEGACY_BASE+'/')&&SITE_BASE!==LEGACY_BASE)return SITE_BASE+p.slice(LEGACY_BASE.length);
      if(p.startsWith(LEGACY_BASE+'/'))return p;
      if(p.startsWith('/'))return(SITE_BASE||'')+p;
      return p;
    }
    if(p.startsWith(LEGACY_BASE+'/'))return p.replace(LEGACY_BASE+'/','/');
    if(SITE_BASE&&p.startsWith(SITE_BASE+'/'))return p.slice(SITE_BASE.length)||'/';
    return p;
  }

  async function loadJSON(path){const response=await fetch(assetPath(path),{cache:'no-store'});if(!response.ok)throw new Error(path);return response.json()}
  function slugify(value){return clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'')||'item'}
  function normalizeProject(item){const title=clean(item.publicTitle||item.title||item.name||'Projet documenté');return{type:'project',title,description:clean(item.description||item.summary||'Projet technique documenté avec contexte, méthode, résultats et enseignements.'),category:clean(item.category||'Projet'),platform:clean(item.platform||''),tags:[...asList(item.skills),...asList(item.tools)].slice(0,4),slug:slugify(item.slug||item.id||item.path||item.obsidianPath||title)}}
  function normalizeWriteup(item){const title=clean(item.publicTitle||item.title||item.name||'Writeup technique');return{type:'writeup',title,description:clean(item.description||item.summary||'Analyse technique structurée : reconnaissance, exploitation, validation et mesures de sécurité.'),category:clean(item.category||'Writeup'),platform:clean(item.platform||item.sectionLabel||''),tags:[...asList(item.skills),...asList(item.tags)].slice(0,4),slug:slugify(item.slug||item.id||item.path||item.obsidianPath||title)}}
  function workCard(item,index){
    const href=`realisations.html?type=${item.type}&item=${encodeURIComponent(item.slug)}`;
    const typeLabel=item.type==='writeup'?'Writeup':'Projet';
    const meta=[typeLabel,item.platform,item.category].filter(Boolean).join(' · ');
    const tags=item.tags.map(tag=>`<span>${esc(tag)}</span>`).join('');
    return `<article class="work-card"><div class="work-visual" data-kind="${item.type}"><span class="work-index">CASE / ${String(index+1).padStart(2,'0')}</span></div><div class="work-card-body"><p class="work-meta">${esc(meta)}</p><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${tags?`<div class="work-tags">${tags}</div>`:''}<a class="work-link" href="${esc(href)}">Ouvrir le dossier</a></div></article>`;
  }
  function setMetric(id,value){const node=document.getElementById(id);if(node)node.textContent=String(value).padStart(2,'0')}

  async function hydrate(){
    const featured=document.getElementById('featured-work');
    try{
      const [projectsData,writeupsData,certificationsData,skillsData]=await Promise.all([
        loadJSON('content/projects/project-control.json').catch(()=>({items:[]})),
        loadJSON('content/writeups/writeups.json').catch(()=>({items:[]})),
        loadJSON('assets/data/certifications.json').catch(()=>({items:[]})),
        loadJSON('assets/data/skills.json').catch(()=>({items:[]}))
      ]);
      const projects=asItems(projectsData).filter(published).map(normalizeProject);
      const writeups=asItems(writeupsData).filter(published).map(normalizeWriteup);
      const certifications=asItems(certificationsData);
      const skills=asItems(skillsData);
      [['metric-projects',projects.length],['metric-writeups',writeups.length],['metric-certifications',certifications.length],['metric-skills',skills.length],['hero-projects',projects.length],['hero-writeups',writeups.length],['hero-certs',certifications.length],['hero-skills',skills.length]].forEach(([id,value])=>setMetric(id,value));
      if(featured){
        const selection=[];
        if(projects[0])selection.push(projects[0]);
        writeups.slice(0,2).forEach(item=>selection.push(item));
        if(selection.length<3)projects.slice(1,4-selection.length).forEach(item=>selection.push(item));
        featured.innerHTML=selection.length?selection.slice(0,3).map(workCard).join(''):'<p class="work-empty">Les premières réalisations publiées apparaîtront ici automatiquement.</p>';
      }
    }catch(error){console.error(error);if(featured)featured.innerHTML='<p class="work-empty">Les réalisations sont temporairement indisponibles.</p>'}
  }

  function setupSpotlight(){
    const hero=document.querySelector('.cinematic-hero');
    if(!hero||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    hero.addEventListener('pointermove',event=>{
      const rect=hero.getBoundingClientRect();
      hero.style.setProperty('--mx',`${((event.clientX-rect.left)/rect.width)*100}%`);
      hero.style.setProperty('--my',`${((event.clientY-rect.top)/rect.height)*100}%`);
    });
  }
  function setupReveal(){
    if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:430,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});observer.unobserve(entry.target)}),{threshold:.08});
    document.querySelectorAll('.work-card,.method-card,.proof-band-copy,.proof-band-stats,.proof-cta').forEach(node=>observer.observe(node));
  }
  function init(){hydrate().then(setupReveal);setupSpotlight()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

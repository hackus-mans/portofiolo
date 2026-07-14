(function(){
  const body=document.body;
  if(!body||!body.classList.contains('project-first'))return;

  const clean=value=>String(value??'').trim();
  const items=data=>Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[]);
  const published=item=>item&&item.publish!==false&&String(item.publish).toLowerCase()!=='false';
  const escapeHtml=value=>clean(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function localPath(value){
    const path=clean(value);
    if(!path)return'';
    if(/^(https?:|mailto:|tel:|data:|blob:|#)/i.test(path))return path;
    return path.replace(/^\/portofiolo\//,'').replace(/^\//,'');
  }

  async function loadJSON(path){
    const response=await fetch(localPath(path),{cache:'no-store'});
    if(!response.ok)throw new Error(`Impossible de charger ${path}`);
    return response.json();
  }

  function setupNavigation(){
    const nav=document.querySelector('.pf-nav');
    const button=nav?.querySelector('.pf-menu');
    const links=nav?.querySelector('.pf-links');
    if(!nav||!button||!links)return;

    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    links.querySelectorAll('a').forEach(link=>{
      const target=(link.getAttribute('href')||'').split('?')[0].toLowerCase();
      const active=target===current;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });

    const close=()=>{
      nav.classList.remove('nav-open');
      body.classList.remove('nav-open');
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Ouvrir le menu');
    };

    button.addEventListener('click',()=>{
      const open=nav.classList.toggle('nav-open');
      body.classList.toggle('nav-open',open);
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    });
    links.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
    addEventListener('resize',()=>{if(innerWidth>900)close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
  }

  function setYear(){
    document.querySelectorAll('[data-year]').forEach(node=>node.textContent=new Date().getFullYear());
  }

  function hydrateProfile(profile){
    const text=(id,value)=>{const node=document.getElementById(id);if(node&&clean(value))node.textContent=clean(value)};
    text('profile-name',profile.name);
    text('profile-title',profile.title);
    text('profile-bio',profile.bio);
    text('about-text',profile.about||profile.bio);
    const cv=document.getElementById('cv-link');
    if(cv&&profile.cv)cv.href=localPath(profile.cv);
    document.querySelectorAll('#profile-photo').forEach(image=>{
      const placeholder=image.parentElement?.querySelector('#profile-photo-placeholder,.pf-photo-placeholder');
      if(profile.image){image.src=localPath(profile.image);image.hidden=false;if(placeholder)placeholder.hidden=true}
    });
  }

  function slugOf(item){
    const source=clean(item.slug||item.publicTitle||item.title||item.path);
    return source.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }

  function usefulDescription(item){
    const description=clean(item.description||item.summary);
    const weak=/^(publish:\s*true|documentation technique publiée depuis obsidian\.?|un challenge de root-me\.?)$/i;
    if(description&&!weak.test(description))return description.replace(/^>\s*/, '');
    const platform=clean(item.platform);
    const category=clean(item.category);
    if(platform||category)return [category,platform].filter(Boolean).join(' sur ')+' — démarche documentée étape par étape.';
    return 'Démarche technique documentée avec commandes, observations et enseignements.';
  }

  function renderHomeWork(writeups){
    const box=document.getElementById('home-work-list');
    if(!box)return;
    const selected=writeups.filter(published).slice(0,3);
    box.innerHTML=selected.length?selected.map((item,index)=>{
      const title=clean(item.publicTitle||item.title||'Writeup');
      const meta=[clean(item.platform),clean(item.category)].filter(Boolean).join(' · ')||'Writeup';
      const href=`realisations.html?type=writeup&item=${encodeURIComponent(slugOf(item))}`;
      return `<a class="pf-work-row" href="${href}"><span class="index">${String(index+1).padStart(2,'0')}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(meta)}</p><span class="arrow">↗</span></a>`;
    }).join(''):'<p>Les writeups seront affichés ici dès leur publication.</p>';
  }

  async function hydrate(){
    try{hydrateProfile(await loadJSON('assets/data/profile.json'))}catch(error){console.error(error)}
    try{
      const writeups=items(await loadJSON('content/writeups/writeups.json'));
      renderHomeWork(writeups);
    }catch(error){console.error(error)}
  }

  function setupReveal(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const nodes=document.querySelectorAll('.pf-section,.pf-page-hero,.pf-feature,.pf-about-grid,.pf-contact-inner');
    if(!('IntersectionObserver'in window))return;
    nodes.forEach(node=>node.classList.add('pf-reveal'));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.75,.2,1)',fill:'forwards'});
      observer.unobserve(entry.target);
    }),{threshold:.08});
    nodes.forEach(node=>observer.observe(node));
  }

  function watchDynamicContent(){
    const root=document.getElementById('realisations-list')||document.getElementById('certifications-list')||document.getElementById('skills-list');
    if(!root)return;
    const observer=new MutationObserver(()=>setupReveal());
    observer.observe(root,{childList:true,subtree:true});
  }

  function init(){
    setYear();
    setupNavigation();
    hydrate();
    setupReveal();
    watchDynamicContent();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

(function(){
  const body=document.body;
  if(!body||!body.classList.contains('minimal-site'))return;

  const clean=value=>String(value??'').trim();
  const items=data=>Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[]);
  const published=item=>item&&item.publish!==false&&String(item.publish).toLowerCase()!=='false';
  const esc=value=>clean(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

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

  function setText(id,value){const node=document.getElementById(id);if(node&&clean(value))node.textContent=clean(value)}
  function setHref(id,value){const node=document.getElementById(id);if(node&&clean(value))node.href=localPath(value)}

  function setupYear(){document.querySelectorAll('[data-current-year]').forEach(node=>node.textContent=new Date().getFullYear())}

  function setupNavigation(){
    const nav=document.querySelector('.navbar');
    const button=nav?.querySelector('.mobile-menu-toggle');
    const links=nav?.querySelector('.nav-links');
    if(!nav||!button||!links)return;

    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    links.querySelectorAll('a').forEach(link=>{
      const target=(link.getAttribute('href')||'').split('?')[0].toLowerCase();
      if(target===current){link.classList.add('active');link.setAttribute('aria-current','page')}
    });

    function close(){
      nav.classList.remove('nav-open');
      body.classList.remove('nav-open');
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Ouvrir le menu');
    }

    button.addEventListener('click',()=>{
      const open=nav.classList.toggle('nav-open');
      body.classList.toggle('nav-open',open);
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    });
    links.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
    addEventListener('resize',()=>{if(innerWidth>960)close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
  }

  function usefulDescription(item){
    const description=clean(item.description||item.summary);
    const unusable=/^(publish:\s*true|documentation technique publiée depuis obsidian\.?|un challenge de root-me\.?)$/i;
    if(description&&!unusable.test(description))return description.replace(/^>\s*/, '');
    if(clean(item.category)&&clean(item.platform))return `${clean(item.category)} réalisé sur ${clean(item.platform)} et documenté étape par étape.`;
    return 'Démarche technique documentée avec les commandes, observations et enseignements essentiels.';
  }

  function slugOf(item){
    const source=clean(item.slug||item.title||item.publicTitle||item.path);
    return source.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function workCard(item,type){
    const title=clean(item.publicTitle||item.title||'Réalisation');
    const meta=[clean(item.platform),clean(item.category)].filter(Boolean).join(' · ')|| (type==='project'?'Projet':'Writeup');
    const href=`realisations.html?type=${encodeURIComponent(type)}&item=${encodeURIComponent(slugOf(item))}`;
    return `<article class="work-card"><span class="meta">${esc(meta)}</span><h3>${esc(title)}</h3><p>${esc(usefulDescription(item))}</p><a href="${href}">Voir le dossier</a></article>`;
  }

  async function hydrateProfile(){
    try{
      const profile=await loadJSON('assets/data/profile.json');
      setText('profile-name',profile.name);
      setText('profile-title',profile.title);
      setText('profile-bio',profile.bio);
      setText('about-text',profile.about||profile.bio);
      setHref('cv-link',profile.cv);

      const image=document.getElementById('profile-photo');
      const placeholder=document.getElementById('profile-photo-placeholder');
      if(image&&profile.image){
        image.src=localPath(profile.image);
        image.hidden=false;
        if(placeholder)placeholder.hidden=true;
      }
    }catch(error){console.error(error)}
  }

  async function hydrateSelectedWork(){
    const container=document.getElementById('selected-work');
    if(!container)return;
    try{
      const [projectsData,writeupsData]=await Promise.all([
        loadJSON('content/projects/project-control.json').catch(()=>({items:[]})),
        loadJSON('content/writeups/writeups.json').catch(()=>({items:[]}))
      ]);
      const projects=items(projectsData).filter(published);
      const writeups=items(writeupsData).filter(published);
      const selected=[];
      if(writeups[0])selected.push({item:writeups[0],type:'writeup'});
      if(writeups[1])selected.push({item:writeups[1],type:'writeup'});
      if(selected.length<2&&projects[0])selected.push({item:projects[0],type:'project'});
      container.innerHTML=selected.slice(0,2).map(entry=>workCard(entry.item,entry.type)).join('')||'<p class="content-error">Les réalisations sont momentanément indisponibles.</p>';
    }catch(error){
      console.error(error);
      container.innerHTML='<p class="content-error">Les réalisations sont momentanément indisponibles.</p>';
    }
  }

  function watchResults(){
    const list=document.getElementById('realisations-list');
    const count=document.getElementById('results-count');
    if(!list||!count)return;
    const update=()=>{
      const visible=[...list.children].filter(node=>!node.hidden&&getComputedStyle(node).display!=='none');
      count.textContent=`${visible.length} résultat${visible.length>1?'s':''}`;
    };
    new MutationObserver(()=>requestAnimationFrame(update)).observe(list,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
    addEventListener('load',()=>setTimeout(update,250));
    update();
  }

  function init(){
    setupYear();
    setupNavigation();
    hydrateProfile();
    hydrateSelectedWork();
    watchResults();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

(function(){
  const body=document.body;
  if(!body||!body.classList.contains('recruiter-site'))return;

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
    if(!response.ok)throw new Error(`Unable to load ${path}`);
    return response.json();
  }

  function setText(id,value){const node=document.getElementById(id);if(node&&clean(value))node.textContent=clean(value)}
  function setHref(id,value){const node=document.getElementById(id);if(node&&clean(value))node.href=localPath(value)}

  function setupNavigation(){
    const nav=document.querySelector('.rf-nav');
    const button=nav?.querySelector('.rf-menu');
    const links=nav?.querySelector('.rf-links');
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
    addEventListener('resize',()=>{if(innerWidth>860)close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
  }

  function usefulDescription(item){
    const description=clean(item.description||item.summary);
    const unusable=/^(publish:\s*true|documentation technique publiée depuis obsidian\.?|un challenge de root-me\.?)$/i;
    if(description&&!unusable.test(description))return description.replace(/^>\s*/,'');
    if(clean(item.category)&&clean(item.platform))return `${clean(item.category)} sur ${clean(item.platform)}, documenté avec les étapes et observations essentielles.`;
    return 'Démarche technique documentée avec le contexte, les commandes utilisées et les enseignements.';
  }

  function slugOf(item){
    const source=clean(item.slug||item.title||item.publicTitle||item.path);
    return source.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }

  function workCard(item,type){
    const title=clean(item.publicTitle||item.title||'Réalisation');
    const meta=[clean(item.platform),clean(item.category)].filter(Boolean).join(' · ')||(type==='project'?'Projet':'Writeup');
    const href=`realisations.html?type=${encodeURIComponent(type)}&item=${encodeURIComponent(slugOf(item))}`;
    return `<article class="rf-work-card"><span class="meta">${esc(meta)}</span><h3>${esc(title)}</h3><p>${esc(usefulDescription(item))}</p><a href="${href}">Consulter la preuve →</a></article>`;
  }

  async function hydrateProfile(){
    try{
      const profile=await loadJSON('assets/data/profile.json');
      setText('profile-name',profile.name);
      setText('profile-title',profile.title);
      setText('profile-bio',profile.bio);
      setText('about-text',profile.about||profile.bio);
      setHref('cv-link',profile.cv);

      document.querySelectorAll('[data-profile-photo]').forEach(image=>{
        if(!profile.image)return;
        image.src=localPath(profile.image);
        image.hidden=false;
        const placeholder=image.parentElement?.querySelector('[data-photo-placeholder]');
        if(placeholder)placeholder.hidden=true;
      });
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
      if(writeups.find(item=>/local file inclusion/i.test(clean(item.title))))selected.push({item:writeups.find(item=>/local file inclusion/i.test(clean(item.title))),type:'writeup'});
      if(writeups.find(item=>/breaking rsa/i.test(clean(item.title))))selected.push({item:writeups.find(item=>/breaking rsa/i.test(clean(item.title))),type:'writeup'});
      writeups.forEach(item=>{if(selected.length<2&&!selected.some(entry=>entry.item===item))selected.push({item,type:'writeup'})});
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
    addEventListener('load',()=>setTimeout(update,260));
    update();
  }

  function reveal(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const nodes=document.querySelectorAll('.rf-section,.rf-feature,.rf-work-card,.rf-profile-grid,.rf-method article,.real-card,.cert-card,.card.cyber-card,.auto-skill-card');
    if(!('IntersectionObserver'in window))return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:440,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
      observer.unobserve(entry.target);
    }),{threshold:.06});
    nodes.forEach(node=>observer.observe(node));
  }

  function init(){
    document.querySelectorAll('[data-year]').forEach(node=>node.textContent=new Date().getFullYear());
    setupNavigation();
    hydrateProfile();
    hydrateSelectedWork();
    watchResults();
    reveal();
    new MutationObserver(()=>setTimeout(reveal,90)).observe(document.documentElement,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

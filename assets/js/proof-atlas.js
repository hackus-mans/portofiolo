(function(){
  const body=document.body;
  if(!body||!body.classList.contains('proof-atlas'))return;

  const clean=v=>String(v||'').trim();
  const esc=v=>clean(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const items=data=>Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[]);
  const published=item=>item&&item.publish!==false&&String(item.publish).toLowerCase()!=='false';

  async function loadJSON(path){
    const response=await fetch(path,{cache:'no-store'});
    if(!response.ok)throw new Error(path);
    return response.json();
  }
  function setText(id,value){const node=document.getElementById(id);if(node)node.textContent=String(value).padStart(2,'0')}

  function activeNav(){
    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('.atlas-links a').forEach(link=>{
      const target=(link.getAttribute('href')||'').split('?')[0].toLowerCase();
      const active=target===current;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
  }

  function setupMenu(){
    const nav=document.querySelector('.atlas-nav');
    const button=nav?.querySelector('.mobile-menu-toggle');
    if(!nav||!button)return;
    button.addEventListener('click',()=>{
      const open=nav.classList.toggle('nav-open');
      document.body.classList.toggle('nav-open',open);
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    });
    nav.querySelectorAll('.atlas-links a').forEach(link=>link.addEventListener('click',()=>{
      nav.classList.remove('nav-open');
      document.body.classList.remove('nav-open');
      button.setAttribute('aria-expanded','false');
    }));
  }

  function progress(){
    const bar=document.querySelector('.atlas-progress');
    if(!bar)return;
    const update=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      const ratio=max>0?scrollY/max:0;
      bar.style.width=`${Math.max(0,Math.min(1,ratio))*100}%`;
    };
    addEventListener('scroll',update,{passive:true});
    update();
  }

  function reveal(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const nodes=document.querySelectorAll('.atlas-section,.atlas-story-main,.atlas-story-side,.atlas-timeline article,.card.cyber-card,.auto-skill-card,.real-card,.cert-card,.atlas-contact-card,.atlas-evidence-card');
    if(!('IntersectionObserver'in window)){nodes.forEach(n=>n.classList.remove('atlas-reveal'));return}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
      observer.unobserve(entry.target);
    }),{threshold:.06});
    nodes.forEach(node=>observer.observe(node));
  }

  function normalizeWork(item,type){
    const title=clean(item.publicTitle||item.title||item.name||'Dossier technique');
    return{
      title,
      type,
      description:clean(item.description||item.summary||'Dossier documenté avec contexte, méthode, résultats et enseignements.'),
      category:clean(item.category||item.platform||type),
      slug:clean(item.slug||item.id||item.path||title).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''),
      tags:[...(Array.isArray(item.tools)?item.tools:[]),...(Array.isArray(item.skills)?item.skills:[])].slice(0,4)
    };
  }

  function evidenceCard(item,index){
    const href=`realisations.html?type=${item.type}&item=${encodeURIComponent(item.slug)}`;
    const tags=item.tags.map(tag=>`<span>${esc(tag)}</span>`).join('');
    return `<article class="atlas-evidence-card"><span class="index">${String(index+1).padStart(2,'0')} / ${esc(item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${tags?`<div class="atlas-case-tags">${tags}</div>`:''}<a href="${href}">Ouvrir le dossier</a></article>`;
  }

  async function hydrate(){
    try{
      const [profile,projectsData,writeupsData,certificationsData,skillsData]=await Promise.all([
        loadJSON('assets/data/profile.json').catch(()=>({})),
        loadJSON('content/projects/project-control.json').catch(()=>({items:[]})),
        loadJSON('content/writeups/writeups.json').catch(()=>({items:[]})),
        loadJSON('assets/data/certifications.json').catch(()=>({items:[]})),
        loadJSON('assets/data/skills.json').catch(()=>({items:[]}))
      ]);
      const projects=items(projectsData).filter(published).map(item=>normalizeWork(item,'project'));
      const writeups=items(writeupsData).filter(published).map(item=>normalizeWork(item,'writeup'));
      const certs=items(certificationsData);
      const skills=items(skillsData);
      ['metric-projects','page-projects','skill-projects'].forEach(id=>setText(id,projects.length));
      ['metric-writeups','page-writeups','skill-writeups'].forEach(id=>setText(id,writeups.length));
      ['metric-certifications','page-certifications','cert-total','skill-certs'].forEach(id=>setText(id,certs.length));
      ['metric-skills','page-skills','skill-total'].forEach(id=>setText(id,skills.length));

      const portrait=document.getElementById('profile-photo');
      const placeholder=document.getElementById('profile-photo-placeholder');
      if(portrait&&profile.image){portrait.src=profile.image;portrait.hidden=false;if(placeholder)placeholder.hidden=true}

      const home=document.getElementById('home-evidence');
      if(home){
        const selection=[];
        if(projects[0])selection.push(projects[0]);
        writeups.slice(0,2).forEach(item=>selection.push(item));
        if(selection.length<3)projects.slice(1,4-selection.length).forEach(item=>selection.push(item));
        home.innerHTML=selection.length?selection.slice(0,3).map(evidenceCard).join(''):'<p>Aucune réalisation publiée pour le moment.</p>';
      }
    }catch(error){console.error(error)}
  }

  function resultCount(){
    const node=document.getElementById('results-count');
    if(!node)return;
    const cards=[...document.querySelectorAll('#realisations-list .real-card')].filter(card=>!card.hidden&&getComputedStyle(card).display!=='none');
    node.textContent=`${String(cards.length).padStart(2,'0')} résultat${cards.length>1?'s':''}`;
  }

  function enhanceDynamic(){
    resultCount();
    document.querySelectorAll('.real-card,.cert-card,.card.cyber-card,.auto-skill-card').forEach(node=>{
      if(node.dataset.atlasReady)return;
      node.dataset.atlasReady='yes';
    });
    reveal();
  }

  function init(){
    activeNav();
    setupMenu();
    progress();
    hydrate().then(enhanceDynamic);
    enhanceDynamic();
    const observer=new MutationObserver(()=>setTimeout(enhanceDynamic,80));
    observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
    addEventListener('load',()=>setTimeout(enhanceDynamic,320));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

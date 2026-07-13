(function(){
  const body=document.body;
  if(!body||!body.classList.contains('lab-site'))return;

  const menuToggle=document.querySelector('.lab-menu-toggle');
  const menuBackdrop=document.querySelector('.lab-menu-backdrop');
  const rail=document.querySelector('.lab-rail');

  function setMenu(open){
    body.classList.toggle('lab-menu-open',open);
    if(menuToggle){
      menuToggle.setAttribute('aria-expanded',String(open));
      menuToggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    }
  }

  if(menuToggle)menuToggle.addEventListener('click',()=>setMenu(!body.classList.contains('lab-menu-open')));
  if(menuBackdrop)menuBackdrop.addEventListener('click',()=>setMenu(false));
  if(rail)rail.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false)});
  window.addEventListener('resize',()=>{if(innerWidth>820)setMenu(false)});

  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.lab-nav a').forEach(link=>{
    const target=(link.getAttribute('href')||'').split('?')[0].toLowerCase();
    const active=target===current||(current===''&&target==='index.html');
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });

  async function loadJSON(path){
    const response=await fetch(path,{cache:'no-store'});
    if(!response.ok)throw new Error(path);
    return response.json();
  }

  function countItems(value){return Array.isArray(value)?value.length:(value&&Array.isArray(value.items)?value.items.length:0)}
  async function hydrateMetrics(){
    const targets={projects:'metric-projects',writeups:'metric-writeups',certifications:'metric-certifications',skills:'metric-skills'};
    if(!Object.values(targets).some(id=>document.getElementById(id)))return;
    const jobs=[
      ['projects','content/projects/project-control.json'],
      ['writeups','content/writeups/writeups.json'],
      ['certifications','assets/data/certifications.json'],
      ['skills','assets/data/skills.json']
    ];
    await Promise.all(jobs.map(async([key,path])=>{
      const node=document.getElementById(targets[key]);
      if(!node)return;
      try{node.textContent=String(countItems(await loadJSON(path))).padStart(2,'0')}catch(e){node.textContent='—'}
    }));
  }

  function slugify(text){
    return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'section';
  }

  function scrollInside(doc,target){
    if(!doc||!target)return;
    const top=target.getBoundingClientRect().top-doc.getBoundingClientRect().top+doc.scrollTop-24;
    doc.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  }

  function readerHeadings(doc){
    return Array.from(doc.querySelectorAll('h1,h2,h3,h4')).filter(node=>node.textContent.trim()&&!node.closest('.reader-toc-section'));
  }

  function updateTocActive(panel){
    const doc=panel.querySelector('.real-reader-document');
    const toc=panel.querySelector('.reader-toc');
    if(!doc||!toc)return;
    const headings=readerHeadings(doc);
    if(!headings.length)return;
    const top=doc.getBoundingClientRect().top;
    let current=headings[0];
    headings.forEach(heading=>{if(heading.getBoundingClientRect().top-top<=82)current=heading});
    toc.querySelectorAll('.toc-link').forEach(link=>link.classList.toggle('active',link.dataset.target===current.id));
  }

  function buildToc(panel){
    const doc=panel.querySelector('.real-reader-document');
    const sidebar=panel.querySelector('.real-reader-sidebar');
    if(!doc||!sidebar)return;
    const headings=readerHeadings(doc);
    const signature=headings.map(node=>node.tagName+':'+node.textContent.trim()).join('|');
    if(panel.dataset.labTocSignature===signature&&sidebar.querySelector('.reader-toc-section'))return;

    sidebar.querySelector('.reader-toc-section')?.remove();
    const section=document.createElement('section');
    section.className='reader-toc-section';

    if(!headings.length){
      section.innerHTML='<p class="reader-toc-heading">Sommaire <span>0</span></p><p class="toc-empty">Les sections apparaîtront après le chargement du document.</p>';
      sidebar.insertBefore(section,sidebar.firstChild);
      panel.dataset.labTocSignature=signature;
      return;
    }

    const used=new Map();
    const links=headings.map(heading=>{
      const base=slugify(heading.textContent);
      const count=used.get(base)||0;
      used.set(base,count+1);
      heading.id=count?base+'-'+count:base;
      const level=heading.tagName.slice(1);
      return '<button class="toc-link toc-l'+level+'" type="button" data-target="'+heading.id+'">'+heading.textContent.trim()+'</button>';
    }).join('');

    section.innerHTML='<p class="reader-toc-heading">Sommaire <span>'+headings.length+'</span></p><nav class="reader-toc" aria-label="Sommaire du document">'+links+'</nav>';
    sidebar.insertBefore(section,sidebar.firstChild);
    section.querySelectorAll('.toc-link').forEach(link=>link.addEventListener('click',()=>{
      const target=headings.find(heading=>heading.id===link.dataset.target);
      section.querySelectorAll('.toc-link').forEach(item=>item.classList.remove('active'));
      link.classList.add('active');
      scrollInside(doc,target);
    }));

    if(doc.dataset.labTocScroll!=='yes'){
      doc.dataset.labTocScroll='yes';
      let ticking=false;
      doc.addEventListener('scroll',()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(()=>{updateTocActive(panel);ticking=false});
      },{passive:true});
    }
    panel.dataset.labTocSignature=signature;
    updateTocActive(panel);
  }

  function enhanceReader(){
    document.querySelectorAll('.real-reader-panel').forEach(panel=>{
      buildToc(panel);
      if(panel.querySelector('.toc-mobile-toggle'))return;
      const sidebar=panel.querySelector('.real-reader-sidebar');
      if(!sidebar)return;
      const button=document.createElement('button');
      button.type='button';
      button.className='toc-mobile-toggle';
      button.textContent='Sommaire';
      button.setAttribute('aria-expanded','false');
      button.addEventListener('click',()=>{
        const open=panel.classList.toggle('toc-open');
        button.setAttribute('aria-expanded',String(open));
      });
      sidebar.addEventListener('click',event=>{if(event.target.closest('.toc-link')){panel.classList.remove('toc-open');button.setAttribute('aria-expanded','false')}});
      panel.appendChild(button);
    });
  }

  function reveal(){
    const nodes=document.querySelectorAll('.lab-module,.card,.auto-skill-card,.real-card,.cert-card,.content-panel');
    if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'ease-out',fill:'both'});observer.unobserve(entry.target)}
    }),{threshold:.08});
    nodes.forEach(node=>observer.observe(node));
  }

  document.addEventListener('DOMContentLoaded',()=>{hydrateMetrics();reveal();enhanceReader()});
  window.addEventListener('load',()=>setTimeout(enhanceReader,350));
  new MutationObserver(()=>setTimeout(enhanceReader,70)).observe(document.documentElement,{childList:true,subtree:true});
})();

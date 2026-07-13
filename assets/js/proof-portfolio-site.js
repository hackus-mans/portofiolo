(function(){
  const body=document.body;
  if(!body||!body.classList.contains('proof-page'))return;

  const clean=value=>String(value||'').trim();
  const asItems=data=>Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[]);
  const published=item=>item&&item.publish!==false&&String(item.publish).toLowerCase()!=='false';

  async function loadJSON(path){
    const response=await fetch(path,{cache:'no-store'});
    if(!response.ok)throw new Error(path);
    return response.json();
  }

  function setText(id,value){
    const node=document.getElementById(id);
    if(node)node.textContent=String(value).padStart(2,'0');
  }

  async function hydrateMetrics(){
    try{
      const [projectsData,writeupsData,certificationsData,skillsData]=await Promise.all([
        loadJSON('content/projects/project-control.json').catch(()=>({items:[]})),
        loadJSON('content/writeups/writeups.json').catch(()=>({items:[]})),
        loadJSON('assets/data/certifications.json').catch(()=>({items:[]})),
        loadJSON('assets/data/skills.json').catch(()=>({items:[]}))
      ]);
      const projects=asItems(projectsData).filter(published);
      const writeups=asItems(writeupsData).filter(published);
      const certifications=asItems(certificationsData);
      const skills=asItems(skillsData);
      const badges=certifications.filter(item=>clean(item.type).toLowerCase()==='badge');
      const certs=certifications.filter(item=>clean(item.type).toLowerCase()!=='badge');

      setText('page-projects',projects.length);
      setText('page-writeups',writeups.length);
      setText('page-certifications',certifications.length);
      setText('page-skills',skills.length);
      setText('cert-total',certifications.length);
      setText('cert-certified',certs.length);
      setText('cert-badges',badges.length);
      setText('skill-total',skills.length);
      setText('skill-proof-total',projects.length+writeups.length+certifications.length);
      setText('skill-domains',new Set(skills.map(item=>clean(item.title)).filter(Boolean)).size);
    }catch(error){console.error(error)}
  }

  function setActiveNavigation(){
    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('.proof-header .nav-links a').forEach(link=>{
      const target=(link.getAttribute('href')||'').split('?')[0].toLowerCase();
      const active=target===current;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
  }

  function setupSpotlight(){
    const hero=document.querySelector('.proof-page-hero');
    if(!hero||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    hero.addEventListener('pointermove',event=>{
      const rect=hero.getBoundingClientRect();
      hero.style.setProperty('--mx',`${((event.clientX-rect.left)/rect.width)*100}%`);
      hero.style.setProperty('--my',`${((event.clientY-rect.top)/rect.height)*100}%`);
    });
  }

  function revealNodes(root=document){
    if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const nodes=root.querySelectorAll('.proof-story-lead,.proof-fact,.proof-principle,.proof-focus-main,.proof-focus-side,.card.cyber-card,.auto-skill-card,.real-card,.cert-card,.proof-contact-primary,.proof-contact-card');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
      observer.unobserve(entry.target);
    }),{threshold:.06});
    nodes.forEach(node=>{if(!node.dataset.proofReveal){node.dataset.proofReveal='yes';observer.observe(node)}});
  }

  function updateResultCount(){
    const counter=document.getElementById('results-count');
    if(!counter)return;
    const cards=[...document.querySelectorAll('#realisations-list .real-card')].filter(card=>!card.hidden&&getComputedStyle(card).display!=='none');
    counter.textContent=`${String(cards.length).padStart(2,'0')} résultat${cards.length>1?'s':''}`;
  }

  function slugify(value){
    return clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'section';
  }

  function cleanObsidianToc(doc){
    doc.querySelectorAll('pre').forEach(pre=>{
      const text=pre.textContent||'';
      if(text.includes('title: Table des matières')||text.includes('style: nestedList')||text.includes('minLevel:')||text.includes('maxLevel:'))pre.remove();
    });
    doc.querySelectorAll('p').forEach(p=>{if(p.textContent.trim()==='---')p.remove()});
  }

  function readerHeadings(doc){
    return [...doc.querySelectorAll('h1,h2,h3,h4')].filter(node=>clean(node.textContent));
  }

  function updateActiveToc(panel){
    const doc=panel.querySelector('.real-reader-document');
    const toc=panel.querySelector('.proof-reader-toc');
    if(!doc||!toc)return;
    const headings=readerHeadings(doc);
    if(!headings.length)return;
    const top=doc.getBoundingClientRect().top;
    let current=headings[0];
    headings.forEach(heading=>{if(heading.getBoundingClientRect().top-top<=84)current=heading});
    toc.querySelectorAll('.toc-link').forEach(link=>link.classList.toggle('active',link.dataset.target===current.id));
  }

  function ensureMobileToc(panel,sidebar){
    if(panel.querySelector('.toc-mobile-toggle'))return;
    const button=document.createElement('button');
    button.type='button';
    button.className='toc-mobile-toggle';
    button.textContent='Sommaire';
    button.setAttribute('aria-expanded','false');
    button.addEventListener('click',()=>{
      const open=panel.classList.toggle('toc-open');
      button.setAttribute('aria-expanded',String(open));
    });
    sidebar.addEventListener('click',event=>{
      if(event.target.closest('.toc-link')){
        panel.classList.remove('toc-open');
        button.setAttribute('aria-expanded','false');
      }
    });
    panel.appendChild(button);
  }

  function buildReaderToc(panel){
    const doc=panel.querySelector('.real-reader-document');
    const sidebar=panel.querySelector('.real-reader-sidebar');
    if(!doc||!sidebar)return;

    cleanObsidianToc(doc);
    const headings=readerHeadings(doc);
    const signature=headings.map(node=>`${node.tagName}:${clean(node.textContent)}`).join('|');
    const existing=sidebar.querySelector('.proof-reader-toc');
    if(existing&&panel.dataset.proofTocSignature===signature){updateActiveToc(panel);ensureMobileToc(panel,sidebar);return}
    if(existing)existing.remove();

    const section=document.createElement('section');
    section.className='proof-reader-toc';
    if(!headings.length){
      section.innerHTML='<p class="proof-reader-toc-head">Sommaire <span>0</span></p><p class="toc-empty">Les sections apparaîtront après le chargement du document.</p>';
      sidebar.insertBefore(section,sidebar.firstChild);
      panel.dataset.proofTocSignature=signature;
      ensureMobileToc(panel,sidebar);
      return;
    }

    const used=new Map();
    const links=headings.map(heading=>{
      const base=slugify(heading.textContent);
      const count=used.get(base)||0;
      used.set(base,count+1);
      heading.id=count?`${base}-${count}`:base;
      const level=heading.tagName.slice(1);
      return `<button class="toc-link toc-l${level}" type="button" data-target="${heading.id}">${clean(heading.textContent)}</button>`;
    }).join('');
    section.innerHTML=`<p class="proof-reader-toc-head">Sommaire <span>${headings.length}</span></p><nav aria-label="Sommaire du document">${links}</nav>`;
    sidebar.insertBefore(section,sidebar.firstChild);
    section.querySelectorAll('.toc-link').forEach(link=>link.addEventListener('click',()=>{
      const target=headings.find(heading=>heading.id===link.dataset.target);
      if(!target)return;
      const top=target.getBoundingClientRect().top-doc.getBoundingClientRect().top+doc.scrollTop-24;
      doc.scrollTo({top:Math.max(0,top),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      section.querySelectorAll('.toc-link').forEach(item=>item.classList.remove('active'));
      link.classList.add('active');
    }));

    if(doc.dataset.proofScrollReady!=='yes'){
      doc.dataset.proofScrollReady='yes';
      let ticking=false;
      doc.addEventListener('scroll',()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(()=>{updateActiveToc(panel);ticking=false});
      },{passive:true});
    }
    panel.dataset.proofTocSignature=signature;
    updateActiveToc(panel);
    ensureMobileToc(panel,sidebar);
  }

  function enhanceDynamicUi(){
    document.querySelectorAll('.real-reader-panel').forEach(buildReaderToc);
    updateResultCount();
    revealNodes();
  }

  function init(){
    setActiveNavigation();
    hydrateMetrics();
    setupSpotlight();
    revealNodes();
    enhanceDynamicUi();
    const observer=new MutationObserver(()=>setTimeout(enhanceDynamicUi,70));
    observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
    window.addEventListener('load',()=>setTimeout(enhanceDynamicUi,350));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

(function(){
  const body=document.body;
  if(!body||!body.classList.contains('atelier-home'))return;

  const clean=value=>String(value||'').trim();
  const asItems=data=>Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[]);
  const published=item=>item&&item.publish!==false&&String(item.publish).toLowerCase()!=='false';

  function setupMenu(){
    const button=document.querySelector('.atelier-menu');
    if(!button)return;
    button.addEventListener('click',()=>{
      const open=body.classList.toggle('nav-open');
      button.setAttribute('aria-expanded',String(open));
    });
    document.querySelectorAll('.atelier-links a').forEach(link=>link.addEventListener('click',()=>{
      body.classList.remove('nav-open');
      button.setAttribute('aria-expanded','false');
    }));
    window.addEventListener('resize',()=>{
      if(innerWidth>820){body.classList.remove('nav-open');button.setAttribute('aria-expanded','false')}
    });
  }

  function setupCaseStudy(){
    const steps=[...document.querySelectorAll('.case-step')];
    const images=[...document.querySelectorAll('.case-visual img')];
    if(!steps.length||!images.length)return;
    const activate=index=>{
      steps.forEach((step,i)=>step.classList.toggle('active',i===index));
      images.forEach((image,i)=>image.classList.toggle('active',i===index));
      const caption=document.getElementById('case-caption-text');
      if(caption)caption.textContent=steps[index]?.dataset.caption||'';
    };
    steps.forEach((step,index)=>{
      step.tabIndex=0;
      step.addEventListener('mouseenter',()=>activate(index));
      step.addEventListener('focus',()=>activate(index));
      step.addEventListener('click',()=>activate(index));
    });
    activate(0);
  }

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
      const [projectsData,writeupsData,certData,skillsData]=await Promise.all([
        loadJSON('content/projects/project-control.json').catch(()=>({items:[]})),
        loadJSON('content/writeups/writeups.json').catch(()=>({items:[]})),
        loadJSON('assets/data/certifications.json').catch(()=>({items:[]})),
        loadJSON('assets/data/skills.json').catch(()=>({items:[]}))
      ]);
      const projects=asItems(projectsData).filter(published);
      const writeups=asItems(writeupsData).filter(published);
      const certs=asItems(certData);
      const skills=asItems(skillsData);
      setText('count-projects',projects.length);
      setText('count-writeups',writeups.length);
      setText('count-certs',certs.length);
      setText('archive-projects',projects.length);
      setText('archive-writeups',writeups.length);
      setText('archive-certs',certs.length);
      setText('archive-skills',skills.length);
    }catch(error){console.error(error)}
  }

  function setupReveal(){
    if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const nodes=document.querySelectorAll('.case-step,.archive-link,.closing,.hero-collage');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.animate([
        {opacity:0,transform:'translateY(18px)'},
        {opacity:1,transform:'translateY(0)'}
      ],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
      observer.unobserve(entry.target);
    }),{threshold:.08});
    nodes.forEach(node=>observer.observe(node));
  }

  function setupYear(){
    const node=document.getElementById('year');
    if(node)node.textContent=new Date().getFullYear();
  }

  function init(){
    setupMenu();
    setupCaseStudy();
    hydrateMetrics();
    setupReveal();
    setupYear();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

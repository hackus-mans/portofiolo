(function(){
  const body=document.body;
  if(!body||!body.classList.contains('evidence-zine'))return;

  const clean=value=>String(value||'').trim();
  const asItems=data=>Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[]);
  const published=item=>item&&item.publish!==false&&String(item.publish).toLowerCase()!=='false';

  async function loadJSON(path){
    const response=await fetch(path,{cache:'no-store'});
    if(!response.ok)throw new Error(path);
    return response.json();
  }

  function text(id,value){const node=document.getElementById(id);if(node)node.textContent=value}
  function metric(id,value){text(id,String(value).padStart(2,'0'))}

  async function hydrate(){
    try{
      const [profile,projectsData,writeupsData,certificationsData,skillsData]=await Promise.all([
        loadJSON('assets/data/profile.json').catch(()=>({})),
        loadJSON('content/projects/project-control.json').catch(()=>({items:[]})),
        loadJSON('content/writeups/writeups.json').catch(()=>({items:[]})),
        loadJSON('assets/data/certifications.json').catch(()=>({items:[]})),
        loadJSON('assets/data/skills.json').catch(()=>({items:[]}))
      ]);
      const projects=asItems(projectsData).filter(published);
      const writeups=asItems(writeupsData).filter(published);
      const certifications=asItems(certificationsData);
      const skills=asItems(skillsData);

      text('profile-name',clean(profile.name)||'NAKORE Yendoubouame Joseph');
      text('profile-title',clean(profile.title)||'Cybersécurité offensive et défensive');
      text('profile-bio',clean(profile.bio)||'Je transforme mes projets, labs et writeups en preuves techniques compréhensibles.');
      const cv=document.getElementById('cv-link');
      if(cv&&profile.cv)cv.href=profile.cv;
      const email=(profile.contacts||[]).find(item=>clean(item.label).toLowerCase()==='email');
      const emailLink=document.getElementById('email-link');
      if(emailLink&&email&&email.url)emailLink.href=email.url;

      document.querySelectorAll('[data-profile-photo]').forEach(img=>{
        if(!profile.image)return;
        img.src=profile.image;
        img.hidden=false;
        const fallback=img.parentElement&&img.parentElement.querySelector('.portrait-fallback');
        if(fallback)fallback.hidden=true;
      });

      metric('count-projects',projects.length);
      metric('count-writeups',writeups.length);
      metric('count-certs',certifications.length);
      metric('count-skills',skills.length);
      metric('archive-projects',projects.length);
      metric('archive-writeups',writeups.length);
      metric('archive-certs',certifications.length);
      metric('archive-skills',skills.length);
    }catch(error){console.error(error)}
  }

  function setupCasefile(){
    const tabs=[...document.querySelectorAll('.case-tab')];
    const shots=[...document.querySelectorAll('.case-shot')];
    const caption=document.getElementById('case-caption-text');
    const label=document.getElementById('case-caption-label');
    function activate(index){
      tabs.forEach((tab,i)=>{
        const active=i===index;
        tab.classList.toggle('active',active);
        tab.setAttribute('aria-selected',String(active));
      });
      shots.forEach((shot,i)=>shot.classList.toggle('active',i===index));
      const tab=tabs[index];
      if(tab){
        if(caption)caption.textContent=tab.dataset.caption||'';
        if(label)label.textContent=tab.dataset.label||`Preuve ${String(index+1).padStart(2,'0')}`;
      }
    }
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>activate(index));
      tab.addEventListener('mouseenter',()=>activate(index));
    });
    activate(0);
  }

  function setupMenu(){
    const button=document.querySelector('.zine-menu');
    const links=document.querySelector('.zine-links');
    if(!button||!links)return;
    const close=()=>{body.classList.remove('menu-open');button.setAttribute('aria-expanded','false')};
    button.addEventListener('click',()=>{
      const open=body.classList.toggle('menu-open');
      button.setAttribute('aria-expanded',String(open));
    });
    links.addEventListener('click',event=>{if(event.target.closest('a'))close()});
    window.addEventListener('resize',()=>{if(innerWidth>980)close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
  }

  function setupProgress(){
    const bar=document.querySelector('.zine-progress');
    if(!bar)return;
    const update=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      const value=max>0?(scrollY/max)*100:0;
      bar.style.width=`${Math.min(100,Math.max(0,value))}%`;
    };
    update();
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update);
  }

  function setupDrag(){
    const reel=document.querySelector('.evidence-reel');
    if(!reel)return;
    let down=false,startX=0,startScroll=0;
    reel.addEventListener('pointerdown',event=>{down=true;startX=event.clientX;startScroll=reel.scrollLeft;reel.setPointerCapture(event.pointerId)});
    reel.addEventListener('pointermove',event=>{if(down)reel.scrollLeft=startScroll-(event.clientX-startX)});
    const stop=()=>{down=false};
    reel.addEventListener('pointerup',stop);reel.addEventListener('pointercancel',stop);reel.addEventListener('pointerleave',stop);
  }

  function init(){hydrate();setupCasefile();setupMenu();setupProgress();setupDrag();text('year',new Date().getFullYear())}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

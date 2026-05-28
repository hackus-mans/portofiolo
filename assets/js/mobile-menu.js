(function(){
  function setupMenu(){
    document.querySelectorAll('.navbar').forEach(nav=>{
      if(nav.querySelector('.mobile-menu-toggle'))return;
      const links=nav.querySelector('.nav-links');
      if(!links)return;
      const btn=document.createElement('button');
      btn.className='mobile-menu-toggle';
      btn.type='button';
      btn.setAttribute('aria-label','Ouvrir le menu');
      btn.setAttribute('aria-expanded','false');
      btn.innerHTML='<span></span>';
      nav.insertBefore(btn,links);
      btn.addEventListener('click',()=>{
        const open=nav.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded',open?'true':'false');
        btn.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
      });
      links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded','false');
        btn.setAttribute('aria-label','Ouvrir le menu');
      }));
    });
  }
  function closeToc(panel){panel&&panel.classList.remove('toc-open')}
  function setupReaderToc(){
    document.querySelectorAll('.real-reader-panel').forEach(panel=>{
      if(panel.querySelector('.toc-mobile-toggle'))return;
      const sidebar=panel.querySelector('.real-reader-sidebar');
      if(!sidebar)return;
      const btn=document.createElement('button');
      btn.className='toc-mobile-toggle';
      btn.type='button';
      btn.textContent='Sommaire';
      btn.setAttribute('aria-expanded','false');
      panel.appendChild(btn);
      btn.addEventListener('click',()=>{
        const open=panel.classList.toggle('toc-open');
        btn.setAttribute('aria-expanded',open?'true':'false');
      });
      sidebar.addEventListener('click',event=>{
        if(event.target.closest('.toc-link')){
          closeToc(panel);
          btn.setAttribute('aria-expanded','false');
        }
      });
      panel.addEventListener('click',event=>{
        if(panel.classList.contains('toc-open')&&!event.target.closest('.real-reader-sidebar')&&!event.target.closest('.toc-mobile-toggle')){
          closeToc(panel);
          btn.setAttribute('aria-expanded','false');
        }
      });
    });
  }
  function apply(){setupMenu();setupReaderToc()}
  document.addEventListener('DOMContentLoaded',apply);
  window.addEventListener('load',()=>setTimeout(apply,300));
  const observer=new MutationObserver(()=>setTimeout(apply,80));
  document.addEventListener('DOMContentLoaded',()=>observer.observe(document.body,{childList:true,subtree:true}));
})();

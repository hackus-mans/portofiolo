(function(){
  'use strict';

  function init(){
    const body=document.body;
    if(!body.classList.contains('site-v3'))return;

    const header=document.querySelector('.site-header');
    const nav=document.querySelector('.navbar');
    const links=document.querySelector('.nav-links');
    const toggle=document.querySelector('.mobile-menu-toggle');
    const navCta=document.querySelector('.nav-cta');

    let mobileContact=null;
    if(links&&navCta&&!links.querySelector('.mobile-contact')){
      mobileContact=navCta.cloneNode(true);
      mobileContact.classList.remove('nav-cta');
      mobileContact.classList.add('mobile-contact');
      links.appendChild(mobileContact);
    }else if(links){
      mobileContact=links.querySelector('.mobile-contact');
    }

    function updateMobileContact(){
      if(!mobileContact)return;
      mobileContact.style.setProperty('display',window.innerWidth<=920?'flex':'none','important');
    }
    updateMobileContact();
    window.addEventListener('resize',updateMobileContact,{passive:true});

    let progress=document.querySelector('.scroll-progress');
    if(!progress){
      progress=document.createElement('div');
      progress.className='scroll-progress';
      progress.setAttribute('aria-hidden','true');
      document.body.appendChild(progress);
    }

    function updateScroll(){
      if(header)header.classList.toggle('is-scrolled',window.scrollY>10);
      const max=document.documentElement.scrollHeight-window.innerHeight;
      const value=max>0?Math.min(100,(window.scrollY/max)*100):0;
      progress.style.width=value+'%';
    }
    updateScroll();
    window.addEventListener('scroll',updateScroll,{passive:true});
    window.addEventListener('resize',updateScroll,{passive:true});

    function closeMenu(){
      if(!nav||!toggle)return;
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Ouvrir le menu');
    }

    if(nav&&toggle&&links){
      toggle.addEventListener('click',function(){
        const open=nav.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded',open?'true':'false');
        toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
      });
      links.addEventListener('click',function(event){
        if(event.target.closest('a'))closeMenu();
      });
      document.addEventListener('click',function(event){
        if(!nav.contains(event.target))closeMenu();
      });
      document.addEventListener('keydown',function(event){
        if(event.key==='Escape')closeMenu();
      });
      window.addEventListener('resize',function(){
        if(window.innerWidth>920)closeMenu();
      },{passive:true});
    }

    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(function(link){
      const target=(link.getAttribute('href')||'').split('?')[0].split('#')[0].toLowerCase();
      if(target===current||(current===''&&target==='index.html')){
        link.classList.add('active');
        link.setAttribute('aria-current','page');
      }
    });

    const revealTargets=document.querySelectorAll('.feature-card,.content-panel,.card,.cert-card,.real-card,.contact-card,.contact-note,.section-heading,.signal-grid');
    revealTargets.forEach(function(node){node.setAttribute('data-reveal','')});

    if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },{threshold:.08,rootMargin:'0px 0px -30px'});
      revealTargets.forEach(function(node){observer.observe(node)});
    }else{
      revealTargets.forEach(function(node){node.classList.add('is-visible')});
    }

    const dynamicObserver=new MutationObserver(function(mutations){
      mutations.forEach(function(mutation){
        mutation.addedNodes.forEach(function(node){
          if(!(node instanceof Element))return;
          const candidates=[];
          if(node.matches('.card,.cert-card,.real-card'))candidates.push(node);
          node.querySelectorAll('.card,.cert-card,.real-card').forEach(function(child){candidates.push(child)});
          candidates.forEach(function(candidate){
            candidate.setAttribute('data-reveal','');
            requestAnimationFrame(function(){candidate.classList.add('is-visible')});
          });
        });
      });
    });
    dynamicObserver.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

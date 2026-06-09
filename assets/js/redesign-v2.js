(function(){
  function initNav(){
    const nav=document.querySelector('.navbar');
    const links=document.querySelector('.nav-links');
    if(!nav||!links||nav.querySelector('.nav-toggle-v2'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='nav-toggle-v2';
    btn.setAttribute('aria-label','Ouvrir le menu');
    btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<span></span>';
    nav.appendChild(btn);
    btn.addEventListener('click',function(){
      const open=nav.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
    links.addEventListener('click',function(e){
      if(e.target&&e.target.tagName==='A'){
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('click',function(e){
      if(!nav.contains(e.target)){
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded','false');
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initNav);else initNav();
})();

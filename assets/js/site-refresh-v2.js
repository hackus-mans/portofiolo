(function(){
  const body=document.body;
  if(!body||!body.classList.contains('site-refresh'))return;

  if(!document.querySelector('link[href*="heading-toc-fix.css"]')){
    const typography=document.createElement('link');
    typography.rel='stylesheet';
    typography.href='assets/css/heading-toc-fix.css?v=1';
    document.head.appendChild(typography);
  }

  const navbar=document.querySelector('.navbar');
  const links=document.querySelector('.nav-links');
  const brand=document.querySelector('.brand');
  if(!navbar||!links||!brand)return;

  let toggle=navbar.querySelector('.nav-toggle');
  if(!toggle){
    toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='nav-toggle';
    toggle.setAttribute('aria-label','Ouvrir le menu');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML='<span></span>';
    brand.insertAdjacentElement('afterend',toggle);
  }

  function closeMenu(){
    body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Ouvrir le menu');
  }

  toggle.addEventListener('click',function(){
    const open=!body.classList.contains('nav-open');
    body.classList.toggle('nav-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
  });

  links.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMenu)});
  window.addEventListener('resize',function(){if(window.innerWidth>820)closeMenu()});
  document.addEventListener('keydown',function(event){if(event.key==='Escape')closeMenu()});
  document.addEventListener('click',function(event){
    if(body.classList.contains('nav-open')&&!navbar.contains(event.target))closeMenu();
  });
})();

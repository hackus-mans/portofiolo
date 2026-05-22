(function(){
  const isGithubPages=location.hostname.includes('github.io');
  function fix(url){
    const u=String(url||'').trim();
    if(!u||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(u))return u;
    if(isGithubPages){
      if(u.startsWith('/portofiolo/'))return u;
      if(u.startsWith('/'))return '/portofiolo'+u;
      return u;
    }
    if(u.startsWith('/portofiolo/'))return u.replace('/portofiolo/','/');
    return u;
  }
  function apply(){
    document.querySelectorAll('img[src],source[src],video[src],audio[src],a[href]').forEach(el=>{
      const attr=el.hasAttribute('href')?'href':'src';
      const current=el.getAttribute(attr);
      const next=fix(current);
      if(next&&next!==current)el.setAttribute(attr,next);
    });
    document.querySelectorAll('[data-image]').forEach(el=>{
      const current=el.getAttribute('data-image');
      const next=fix(current);
      if(next&&next!==current)el.setAttribute('data-image',next);
    });
    if(!document.getElementById('public-clean-style')){
      const style=document.createElement('style');
      style.id='public-clean-style';
      style.textContent='.ready-level,.real-empty{display:none!important}';
      document.head.appendChild(style);
    }
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,900));
  window.addEventListener('load',()=>setTimeout(apply,1200));
})();
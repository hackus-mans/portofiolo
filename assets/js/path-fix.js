(function(){
  const isGithubPages=location.hostname.includes('github.io');
  const legacyBase='/portofiolo';
  const siteBase=(()=>{if(!isGithubPages)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();
  function fix(url){
    const u=String(url||'').trim();
    if(!u||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(u))return u;
    if(isGithubPages){
      if(siteBase&&u.startsWith(siteBase+'/'))return u;
      if(siteBase&&u.startsWith(legacyBase+'/')&&siteBase!==legacyBase)return siteBase+u.slice(legacyBase.length);
      if(u.startsWith(legacyBase+'/'))return u;
      if(u.startsWith('/'))return (siteBase||'')+u;
      return u;
    }
    if(u.startsWith(legacyBase+'/'))return u.replace(legacyBase+'/','/');
    if(siteBase&&u.startsWith(siteBase+'/'))return u.slice(siteBase.length)||'/';
    return u;
  }
  function injectCss(){
    if(document.getElementById('stable-public-fixes'))return;
    const style=document.createElement('style');
    style.id='stable-public-fixes';
    style.textContent='.cert-verify{display:inline-flex;margin-top:12px;font-weight:900;color:var(--accent)}.doc-highlight{font-weight:800;color:var(--accent)}';
    document.head.appendChild(style);
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
    injectCss();
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,300));
  window.addEventListener('load',()=>setTimeout(apply,600));
  const observer=new MutationObserver(()=>setTimeout(apply,100));
  document.addEventListener('DOMContentLoaded',()=>observer.observe(document.body,{childList:true,subtree:true}));
})();

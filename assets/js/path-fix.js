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
  function cleanCopy(){
    const swaps=[
      ['Documentation publiée depuis Obsidian.','Documentation technique en cours de présentation.'],
      ['Les writeups validés de cette branche s’affichent en bas.',''],
      ['Cette branche existe dans Obsidian, mais aucun writeup n’est validé pour publication dans Sveltia.','Aucun contenu disponible pour cette sélection.']
    ];
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{let text=node.nodeValue;swaps.forEach(pair=>{text=text.split(pair[0]).join(pair[1])});node.nodeValue=text});
    document.querySelectorAll('.ready-level').forEach(el=>el.remove());
  }
  function injectStableCss(){
    if(document.getElementById('stable-real-tabs'))return;
    const style=document.createElement('style');
    style.id='stable-real-tabs';
    style.textContent='.realisation-tabs{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;width:100%!important;overflow:visible!important;gap:10px!important;padding:0!important;background:transparent!important;border:0!important}.realisation-tabs .real-tab{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:48px!important;border-radius:16px!important}.realisation-tabs .real-tab.active{background:linear-gradient(135deg,#2dd4bf,#60a5fa)!important;color:#041018!important}.ready-level,.public-note,.technical-note{display:none!important}.cert-verify{display:inline-flex;margin-top:12px;font-weight:900;color:var(--accent)}.doc-highlight{font-weight:800;color:var(--accent)}@media(max-width:760px){.realisation-tabs{grid-template-columns:repeat(2,minmax(0,1fr))!important}.realisation-tabs .real-tab{min-height:44px!important;font-size:13px!important}.branch-list,.branch-list-large{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;gap:8px!important}.branch-card{flex:0 0 auto!important;min-width:145px!important;max-width:220px!important}}';
    document.head.appendChild(style);
  }
  function apply(){
    document.querySelectorAll('img[src],source[src],video[src],audio[src],a[href]').forEach(el=>{const attr=el.hasAttribute('href')?'href':'src';const current=el.getAttribute(attr);const next=fix(current);if(next&&next!==current)el.setAttribute(attr,next)});
    document.querySelectorAll('[data-image]').forEach(el=>{const current=el.getAttribute('data-image');const next=fix(current);if(next&&next!==current)el.setAttribute('data-image',next)});
    injectStableCss();
    cleanCopy();
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,300));
  window.addEventListener('load',()=>setTimeout(apply,600));
  const observer=new MutationObserver(()=>setTimeout(apply,80));
  document.addEventListener('DOMContentLoaded',()=>observer.observe(document.body,{childList:true,subtree:true,characterData:true}));
})();

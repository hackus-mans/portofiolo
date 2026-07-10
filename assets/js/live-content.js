(function(){
  const owner='hackus-mans';
  const repo='portofiolo';
  const branch='main';
  const isGithubPages=location.hostname.includes('github.io');
  const legacyBase='/portofiolo';
  const siteBase=(()=>{if(!isGithubPages)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();
  const rawBase='https://raw.githubusercontent.com/'+owner+'/'+repo+'/'+branch+'/';
  const originalFetch=window.fetch.bind(window);
  function clean(v){return String(v||'').trim()}
  function normalizeContentPath(path){
    let p=clean(path).replace(/\\/g,'/');
    if(!p)return'';
    let previous='';
    while(previous!==p){
      previous=p;
      p=p.replace(/^content\/(writeups|projects)\/(?:portofiolo\/)?content\/\1\//i,'content/$1/');
    }
    return p;
  }
  function stripBase(path){
    let p=clean(path);
    if(!p)return'';
    if(/^https?:\/\//i.test(p)){
      try{
        const u=new URL(p);
        if(u.hostname==='raw.githubusercontent.com')return'';
        if(u.hostname!==location.hostname)return'';
        p=u.pathname+u.search;
      }catch(e){return''}
    }
    p=p.split('#')[0].split('?')[0];
    if(siteBase&&p.startsWith(siteBase+'/'))p=p.slice(siteBase.length+1);
    else if(p.startsWith(legacyBase+'/'))p=p.slice(legacyBase.length+1);
    else if(p.startsWith('/'))p=p.slice(1);
    return normalizeContentPath(p);
  }
  function isLivePath(path){
    const p=stripBase(path);
    return p.startsWith('assets/data/')||p.startsWith('assets/uploads/')||p.startsWith('assets/cv/')||p.startsWith('content/');
  }
  function liveUrl(path){
    const p=stripBase(path);
    if(!p||!isLivePath(p))return'';
    return rawBase+p+'?cmsLive='+Date.now();
  }
  window.cmsLiveUrl=liveUrl;
  window.fetch=function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    const live=liveUrl(url);
    if(live){
      const nextInit=Object.assign({},init||{}, {cache:'no-store'});
      return originalFetch(live,nextInit);
    }
    return originalFetch(input,init);
  };
  function rewriteMedia(){
    document.querySelectorAll('img[src],source[src],video[src],audio[src]').forEach(el=>{
      const current=el.getAttribute('src');
      const live=liveUrl(current);
      if(live&&current!==live)el.setAttribute('src',live);
    });
    document.querySelectorAll('a[href]').forEach(a=>{
      const href=a.getAttribute('href');
      const p=stripBase(href);
      if(p&&(/\.pdf$/i.test(p)||p.startsWith('assets/cv/'))){
        const live=liveUrl(href);
        if(live&&href!==live)a.setAttribute('href',live);
      }
    });
    document.querySelectorAll('[data-image]').forEach(el=>{
      const current=el.getAttribute('data-image');
      const live=liveUrl(current);
      if(live&&current!==live)el.setAttribute('data-image',live);
    });
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(rewriteMedia,100));
  window.addEventListener('load',()=>setTimeout(rewriteMedia,400));
  const observer=new MutationObserver(()=>setTimeout(rewriteMedia,80));
  document.addEventListener('DOMContentLoaded',()=>observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','href','data-image']}));
})();
(function(){
  const isGithubPages=location.hostname.includes('github.io');
  const legacyBase='/portofiolo';
  const siteBase=(()=>{if(!isGithubPages)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();
  function clean(v){return String(v||'').trim()}
  function base(path){
    let p=clean(path);
    if(!p||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p))return p;
    if(isGithubPages){
      if(siteBase&&p.startsWith(siteBase+'/'))return p;
      if(siteBase&&p.startsWith(legacyBase+'/')&&siteBase!==legacyBase)return siteBase+p.slice(legacyBase.length);
      if(p.startsWith(legacyBase+'/'))return p;
      if(p.startsWith('/'))return (siteBase||'')+p;
      return p;
    }
    if(p.startsWith(legacyBase+'/'))return p.replace(legacyBase+'/','/');
    if(siteBase&&p.startsWith(siteBase+'/'))return p.slice(siteBase.length)||'/';
    return p;
  }
  function fileNameFromText(text){
    let value=clean(text).replace(/<[^>]+>/g,'').replace(/&lt;[^&]+&gt;/g,'').split('|')[0].trim();
    if(!value)return'';
    try{value=decodeURIComponent(value)}catch(e){}
    value=value.replace(/\\/g,'/').split('/').pop().trim();
    return value;
  }
  function encodePath(path){
    return path.split('/').map(part=>encodeURIComponent(part).replace(/%20/g,'%20')).join('/');
  }
  function normalizeName(name,separator){
    const extMatch=name.match(/\.[A-Za-z0-9]+$/);
    const ext=extMatch?extMatch[0].toLowerCase():'';
    const raw=ext?name.slice(0,-ext.length):name;
    return raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').replace(/\s+/g,separator).replace(/[^a-z0-9._-]+/g,separator).replace(new RegExp(separator+'+','g'),separator).replace(new RegExp('^'+separator+'|'+separator+'$','g'),'')+ext;
  }
  function add(list,value){
    value=clean(value);
    if(!value)return;
    const decoded=(()=>{try{return decodeURIComponent(value)}catch(e){return value}})();
    [value,decoded,encodePath(decoded)].forEach(v=>{v=clean(v);if(v&&!list.includes(v))list.push(v)});
  }
  function candidatesFromName(name){
    const n=fileNameFromText(name);
    if(!n)return[];
    const list=[];
    const extMatch=n.match(/\.[A-Za-z0-9]+$/);
    const ext=extMatch?extMatch[0]:'';
    const raw=ext?n.slice(0,-ext.length):n;
    const variants=[
      n,
      raw+ext.toLowerCase(),
      raw.toLowerCase()+ext.toLowerCase(),
      normalizeName(n,'-'),
      normalizeName(n,'_')
    ];
    variants.forEach(file=>{
      add(list,base('/content/writeups/media/'+file));
      add(list,base('/assets/uploads/'+file));
    });
    return list;
  }
  function candidatesFromCurrent(src){
    const list=[];
    const s=clean(src);
    if(!s)return list;
    add(list,base(s));
    const file=fileNameFromText(s.split('?')[0].split('#')[0]);
    candidatesFromName(file).forEach(x=>add(list,x));
    return list;
  }
  function markMissing(img){
    const figure=img.closest('figure');
    if(figure&&!figure.querySelector('.media-missing-note')){
      const note=document.createElement('figcaption');
      note.className='media-missing-note';
      note.textContent='Image introuvable dans le dépôt portfolio. Vérifie que le fichier média a bien été copié dans content/writeups/media.';
      figure.appendChild(note);
    }
  }
  function installFallback(img){
    if(!img||img.dataset.mediaFixed==='1')return;
    img.dataset.mediaFixed='1';
    const current=clean(img.getAttribute('src'));
    const alt=clean(img.getAttribute('alt'))||clean(img.closest('figure')?.querySelector('figcaption')?.textContent);
    const list=[];
    candidatesFromCurrent(current).forEach(x=>add(list,x));
    candidatesFromName(alt).forEach(x=>add(list,x));
    const unique=[...new Set(list.filter(Boolean))];
    img.dataset.fallbacks=JSON.stringify(unique);
    img.dataset.fallbackIndex='0';
    img.onerror=function(){
      let arr=[];
      try{arr=JSON.parse(this.dataset.fallbacks||'[]')}catch(e){}
      let index=Number(this.dataset.fallbackIndex||'0')+1;
      if(index<arr.length){
        this.dataset.fallbackIndex=String(index);
        this.src=arr[index];
      }else{
        this.onerror=null;
        markMissing(this);
      }
    };
    if(unique[0]&&unique[0]!==current)img.src=unique[0];
    setTimeout(function(){if(img.complete&&img.naturalWidth===0)img.onerror&&img.onerror()},400);
  }
  function apply(){
    document.querySelectorAll('.obsidian-doc img,.markdown-body img,.doc-media img').forEach(installFallback);
  }
  const observer=new MutationObserver(function(){setTimeout(apply,60)});
  document.addEventListener('DOMContentLoaded',function(){apply();observer.observe(document.body,{childList:true,subtree:true})});
  window.addEventListener('load',function(){setTimeout(apply,500);setTimeout(apply,1500)});
})();

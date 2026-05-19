(function(){
  const isGithubPages = location.hostname.includes('github.io');
  function clean(v){ return String(v || '').trim(); }
  function base(path){
    let p = clean(path);
    if(!p || /^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p)) return p;
    if(isGithubPages){
      if(p.startsWith('/portofiolo/')) return p;
      if(p.startsWith('/')) return '/portofiolo' + p;
      return p;
    }
    if(p.startsWith('/portofiolo/')) return p.replace('/portofiolo/', '/');
    return p;
  }
  function fileNameFromText(text){
    let value = clean(text)
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;[^&]+&gt;/g, '')
      .replace(/\s+/g, ' ')
      .split('|')[0]
      .trim();
    if(!value) return '';
    const match = value.match(/[A-Za-z0-9_ .()\-]+\.(png|jpg|jpeg|gif|webp|svg|mp3|wav|ogg|m4a|mp4|webm|mov|pdf)$/i);
    return match ? match[0].trim() : value;
  }
  function candidates(name){
    const n = fileNameFromText(name);
    if(!n) return [];
    const extMatch = n.match(/\.[A-Za-z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : '';
    const rawBase = ext ? n.slice(0, -ext.length) : n;
    const exact = rawBase + ext;
    const lower = rawBase.toLowerCase() + ext;
    const kebab = rawBase.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'') + ext;
    const underscore = rawBase.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9._-]+/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'') + ext;
    return [...new Set([exact, lower, kebab, underscore].filter(Boolean))].map(f => base('/content/writeups/media/' + f));
  }
  function installFallback(img){
    if(!img || img.dataset.mediaFixed === '1') return;
    img.dataset.mediaFixed = '1';
    const current = clean(img.getAttribute('src'));
    const alt = clean(img.getAttribute('alt')) || clean(img.closest('figure')?.querySelector('figcaption')?.textContent);
    const list = [];
    if(current) list.push(base(current));
    candidates(alt).forEach(x => list.push(x));
    const unique = [...new Set(list.filter(Boolean))];
    img.dataset.fallbacks = JSON.stringify(unique);
    img.dataset.fallbackIndex = '0';
    if(unique[0] && unique[0] !== current) img.src = unique[0];
    img.onerror = function(){
      let arr = [];
      try{ arr = JSON.parse(this.dataset.fallbacks || '[]'); }catch(e){}
      let index = Number(this.dataset.fallbackIndex || '0') + 1;
      if(index < arr.length){
        this.dataset.fallbackIndex = String(index);
        this.src = arr[index];
      }else{
        this.onerror = null;
      }
    };
  }
  function apply(){
    document.querySelectorAll('.obsidian-doc img, .markdown-body img').forEach(installFallback);
  }
  const observer = new MutationObserver(apply);
  document.addEventListener('DOMContentLoaded', function(){
    apply();
    observer.observe(document.body, { childList:true, subtree:true });
  });
  window.addEventListener('load', function(){ setTimeout(apply, 500); });
})();
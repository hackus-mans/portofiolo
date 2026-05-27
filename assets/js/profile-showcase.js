(function(){
  const isGithubPages=location.hostname.includes('github.io');
  const legacyBase='/portofiolo';
  const siteBase=(()=>{if(!isGithubPages)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();
  function safe(v){return String(v||'').trim()}
  function assetPath(path){
    let p=safe(path);
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
  async function loadJSON(path){const res=await fetch(assetPath(path),{cache:'no-store'});if(!res.ok)throw new Error(path);return res.json()}
  function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=safe(value)}
  function showPhoto(image){
    const img=document.getElementById('profile-photo');
    const ph=document.getElementById('profile-photo-placeholder');
    if(!img||!ph)return;
    if(!safe(image)){img.hidden=true;ph.hidden=false;return}
    img.src=assetPath(image);
    img.hidden=false;
    ph.hidden=true;
  }
  async function init(){
    try{const profile=await loadJSON('assets/data/profile.json');setText('profile-card-name',profile.name||'Hackus Mans');setText('profile-card-title',profile.title||'Network & Security Learner');showPhoto(profile.image)}catch(e){showPhoto('')}
  }
  document.addEventListener('DOMContentLoaded',init);
})();

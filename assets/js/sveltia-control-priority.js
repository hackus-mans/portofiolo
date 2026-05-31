(function(){
  const originalFetch=window.fetch.bind(window);
  const OWNER='hackus-mans',REPO='portofiolo',BRANCH='main';
  function clean(v){return String(v||'').trim()}
  function norm(v){return clean(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").replace(/^content\/(projects|writeups)\//,'').replace(/\.md$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}
  function keyOf(item){
    const path=clean(item.obsidianPath||item.path);
    if(path)return norm(path);
    return norm(item.title||item.publicTitle);
  }
  function aliases(item){
    const set=new Set();
    [item.obsidianPath,item.path,item.title,item.publicTitle].forEach(v=>{const k=norm(v);if(k)set.add(k)});
    return Array.from(set);
  }
  async function loadControlFolder(folder){
    try{
      const api='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+folder+'?ref='+BRANCH+'&cmsLive='+Date.now();
      const res=await originalFetch(api,{cache:'no-store'});
      if(!res.ok)return[];
      const files=await res.json();
      if(!Array.isArray(files))return[];
      const rows=[];
      for(const file of files.filter(f=>f.type==='file'&&String(f.name||'').toLowerCase().endsWith('.json'))){
        try{
          const r=await originalFetch(file.download_url+'?cmsLive='+Date.now(),{cache:'no-store'});
          if(r.ok)rows.push(await r.json());
        }catch(e){}
      }
      return rows;
    }catch(e){return[]}
  }
  function mergeItems(baseItems,controlItems){
    const map=new Map();
    const aliasToKey=new Map();
    (Array.isArray(baseItems)?baseItems:[]).forEach(item=>{
      const k=keyOf(item);
      if(!k)return;
      map.set(k,item);
      aliases(item).forEach(a=>aliasToKey.set(a,k));
    });
    (Array.isArray(controlItems)?controlItems:[]).forEach(item=>{
      const direct=keyOf(item);
      const match=aliases(item).map(a=>aliasToKey.get(a)).find(Boolean)||direct;
      if(!match)return;
      const merged={...(map.get(match)||{}),...item};
      map.set(match,merged);
      aliases(merged).forEach(a=>aliasToKey.set(a,match));
    });
    return Array.from(map.values());
  }
  async function mergedJsonResponse(input,init,folder){
    let base={items:[]};
    try{
      const res=await originalFetch(input,init);
      if(res.ok)base=await res.clone().json();
    }catch(e){}
    const controls=await loadControlFolder(folder);
    const merged={...base,items:mergeItems(base.items,controls)};
    return new Response(JSON.stringify(merged),{status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  }
  window.fetch=function(input,init){
    const url=typeof input==='string'?input:String(input&&input.url||'');
    if(url.includes('content/projects/project-control.json'))return mergedJsonResponse(input,init,'content/projects-control');
    if(url.includes('content/writeups/writeups.json'))return mergedJsonResponse(input,init,'content/writeups-control');
    return originalFetch(input,init);
  };
})();
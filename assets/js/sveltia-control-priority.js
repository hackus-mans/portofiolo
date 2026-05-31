(function(){
  const originalFetch=window.fetch.bind(window);
  const OWNER='hackus-mans',REPO='portofiolo',BRANCH='main';
  function clean(v){return String(v||'').trim()}
  function keyOf(item){return clean(item.publicTitle||item.title||item.obsidianPath||item.path).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
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
    (Array.isArray(baseItems)?baseItems:[]).forEach(item=>{const k=keyOf(item);if(k)map.set(k,item)});
    (Array.isArray(controlItems)?controlItems:[]).forEach(item=>{const k=keyOf(item);if(k)map.set(k,{...(map.get(k)||{}),...item})});
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
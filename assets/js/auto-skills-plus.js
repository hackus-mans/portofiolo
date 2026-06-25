(function(){
  const repoOwner='hackus-mans';
  const repoBranch='main';
  const legacyBase='/portofiolo';
  const IS_GITHUB_PAGES=location.hostname.includes('github.io');
  const siteBase=(()=>{if(!IS_GITHUB_PAGES)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();
  const repoName=(siteBase.replace('/','')||legacyBase.replace('/','')||'portofiolo');

  function safe(v){return String(v||'').trim()}
  function esc(v){return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function assetPath(path){
    let p=safe(path);
    if(!p||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p))return p;
    if(IS_GITHUB_PAGES){
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
  async function loadJSON(path){const r=await fetch(assetPath(path),{cache:'no-store'});if(!r.ok)throw new Error(path);return r.json()}
  async function loadText(path){const r=await fetch(assetPath(path),{cache:'no-store'});if(!r.ok)throw new Error(path);return r.text()}
  async function loadGithubFolder(folder){
    try{
      const api=`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}?ref=${repoBranch}&t=${Date.now()}`;
      const r=await fetch(api,{cache:'no-store'});
      if(!r.ok)return[];
      const files=await r.json();
      if(!Array.isArray(files))return[];
      const rows=[];
      for(const file of files){
        if(file.type!=='file'||!String(file.name||'').toLowerCase().endsWith('.json'))continue;
        try{
          const item=await fetch(file.download_url+'?t='+Date.now(),{cache:'no-store'});
          if(item.ok)rows.push(await item.json());
        }catch(e){}
      }
      return rows;
    }catch(e){return[]}
  }
  function asItems(data){return Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[])}
  function asList(v){return Array.isArray(v)?v.map(safe).filter(Boolean):(safe(v)?[safe(v)]:[])}
  function normalize(v){return safe(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  function slugify(v){return normalize(v).replace(/\.[a-z0-9]+$/i,'').replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'')||'file'}
  function titleFromName(name){return safe(name).replace(/\.md$/,'').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
  function parseYaml(yaml){const obj={};let key=null;safe(yaml).split('\n').forEach(line=>{const s=line.trim();if(!s)return;if(s.startsWith('- ')&&key){obj[key]=Array.isArray(obj[key])?obj[key]:[];obj[key].push(s.slice(2).trim().replace(/^["']|["']$/g,''));return}const m=s.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);if(m){key=m[1];const value=m[2].trim().replace(/^["']|["']$/g,'');obj[key]=value?value:[]}});return obj}
  function splitFM(md){const text=String(md||'');if(!text.startsWith('---'))return{meta:{},body:text};const end=text.indexOf('\n---',3);if(end===-1)return{meta:{},body:text};return{meta:parseYaml(text.slice(3,end).trim()),body:text.slice(end+4).trim()}}
  function projectPathCandidates(item){const candidates=[];const add=p=>{p=safe(p);if(!p)return;if(p.startsWith('/'))p=p.slice(1);if(!p.startsWith('content/projects/'))p='content/projects/'+p;if(!p.endsWith('.md'))p=p.replace(/\/$/,'')+'.md';if(!candidates.includes(p))candidates.push(p)};if(item.path)add(item.path);if(item.obsidianPath)add(item.obsidianPath);if(item.title)add(slugify(item.title)+'.md');if(item.publicTitle)add(slugify(item.publicTitle)+'.md');return candidates}
  function aliases(item){const set=new Set();[item.slug,item.path,item.obsidianPath,item.title,item.publicTitle].forEach(v=>{v=safe(v);if(!v)return;set.add(slugify(v));const base=v.split('/').pop().replace(/\.md$/i,'');if(base)set.add(slugify(base))});return[...set]}
  function mergeItems(base,controls){const rows=[];function put(item,override){const keys=aliases(item);const index=rows.findIndex(existing=>aliases(existing).some(k=>keys.includes(k)));if(index>=0)rows[index]=override?{...rows[index],...item}:{...item,...rows[index]};else rows.push(item)}base.forEach(item=>put(item,false));controls.forEach(item=>put(item,true));return rows}

  async function loadMarkdownProjects(){
    let base=[];
    try{base=asItems(await loadJSON('content/projects/project-control.json'))}catch(e){}
    const controls=await loadGithubFolder('content/projects-control');
    const merged=mergeItems(base,controls).filter(item=>item.publish===true||String(item.publish).toLowerCase()==='true');
    if(merged.length){
      return await Promise.all(merged.map(async item=>{
        let meta={};
        for(const path of projectPathCandidates(item)){try{meta=splitFM(await loadText(path)).meta;break}catch(e){}}
        return{title:safe(item.publicTitle||item.title||meta.title),skills:asList(item.skills).length?asList(item.skills):asList(meta.skills),sourceType:'Projet'};
      }));
    }
    try{
      const list=await loadJSON(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/projects?ref=${repoBranch}`);
      const files=Array.isArray(list)?list.filter(f=>f.type==='file'&&f.name.endsWith('.md')):[];
      const docs=await Promise.all(files.map(async f=>({name:f.name,content:await loadText(f.download_url)})));
      return docs.map(doc=>{const parsed=splitFM(doc.content);return{title:titleFromName(doc.name),skills:asList(parsed.meta.skills),sourceType:'Projet'}});
    }catch(err){return[]}
  }

  function addSkill(map,skill,sourceType,sourceTitle){const name=safe(skill);if(!name)return;const key=name.toLowerCase();if(!map.has(key))map.set(key,{name,sources:[]});const item=map.get(key);const label=`${sourceType} : ${sourceTitle}`;if(!item.sources.includes(label))item.sources.push(label)}
  async function renderAutoSkills(){
    const box=document.getElementById('cert-skills-list');if(!box)return;
    const map=new Map();
    try{asItems(await loadJSON('assets/data/certifications.json')).forEach(cert=>asList(cert.skills).forEach(skill=>addSkill(map,skill,'Certification',cert.title)))}catch(e){}
    try{(await loadMarkdownProjects()).forEach(project=>asList(project.skills).forEach(skill=>addSkill(map,skill,'Projet',project.title)))}catch(e){}
    try{asItems(await loadJSON('content/writeups/writeups.json')).forEach(item=>asList(item.skills).forEach(skill=>addSkill(map,skill,item.sectionLabel||'Writeup',item.title)))}catch(e){}
    box.innerHTML='';
    if(!map.size){box.innerHTML='<article class="content-panel"><p>Aucune compétence validée pour le moment.</p></article>';return}
    [...map.values()].sort((a,b)=>a.name.localeCompare(b.name)).forEach(item=>{const card=document.createElement('article');card.className='auto-skill-card';card.innerHTML=`<span class="card-kicker">Compétence validée</span><h3>${esc(item.name)}</h3><p>${item.sources.length} preuve(s) associée(s)</p>`;box.appendChild(card)});
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(renderAutoSkills,600));
})();
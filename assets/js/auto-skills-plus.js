(function(){
  const repoOwner='hackus-mans';
  const repoName='portofiolo';
  const repoBranch='main';
  const IS_GITHUB_PAGES=location.hostname.includes('github.io');

  function safe(v){return String(v||'').trim()}
  function esc(v){return safe(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function assetPath(path){
    let p=safe(path);
    if(!p||/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(p))return p;
    if(IS_GITHUB_PAGES){
      if(p.startsWith('/portofiolo/'))return p;
      if(p.startsWith('/'))return '/portofiolo'+p;
      return p;
    }
    if(p.startsWith('/portofiolo/'))return p.replace('/portofiolo/','/');
    return p;
  }
  async function loadJSON(path){const r=await fetch(assetPath(path),{cache:'no-store'});if(!r.ok)throw new Error(path);return r.json()}
  async function loadText(path){const r=await fetch(assetPath(path),{cache:'no-store'});if(!r.ok)throw new Error(path);return r.text()}
  function asItems(data){return Array.isArray(data)?data:(data&&Array.isArray(data.items)?data.items:[])}
  function asList(v){return Array.isArray(v)?v.map(safe).filter(Boolean):(safe(v)?[safe(v)]:[])}
  function titleFromName(name){return safe(name).replace(/\.md$/,'').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
  function parseYaml(yaml){
    const obj={};let key=null;
    safe(yaml).split('\n').forEach(line=>{
      const s=line.trim();
      if(!s)return;
      if(s.startsWith('- ')&&key){obj[key]=Array.isArray(obj[key])?obj[key]:[];obj[key].push(s.slice(2).trim().replace(/^['"]|['"]$/g,''));return;}
      const m=s.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if(m){key=m[1];const value=m[2].trim().replace(/^['"]|['"]$/g,'');obj[key]=value?value:[];}
    });
    return obj;
  }
  function splitFM(md){const text=String(md||'');if(!text.startsWith('---'))return {meta:{},body:text};const end=text.indexOf('\n---',3);if(end===-1)return {meta:{},body:text};return {meta:parseYaml(text.slice(3,end).trim()),body:text.slice(end+4).trim()};}

  async function loadMarkdownProjects(){
    try{
      const control=await loadJSON('content/projects/project-control.json');
      const items=asItems(control).filter(item=>item.publish);
      return items.map(item=>({title:safe(item.publicTitle||item.title),skills:asList(item.skills),sourceType:'Projet'}));
    }catch(e){
      try{
        const list=await loadJSON(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/projects?ref=${repoBranch}`);
        const files=Array.isArray(list)?list.filter(f=>f.type==='file'&&f.name.endsWith('.md')):[];
        const docs=await Promise.all(files.map(async f=>({name:f.name,content:await loadText(f.download_url)})));
        return docs.map(doc=>{const parsed=splitFM(doc.content);return {title:titleFromName(doc.name),skills:asList(parsed.meta.skills),sourceType:'Projet'}});
      }catch(err){return []}
    }
  }

  function addSkill(map, skill, sourceType, sourceTitle){
    const name=safe(skill);
    if(!name)return;
    const key=name.toLowerCase();
    if(!map.has(key))map.set(key,{name, sources:[]});
    const item=map.get(key);
    const label=`${sourceType} : ${sourceTitle}`;
    if(!item.sources.includes(label))item.sources.push(label);
  }

  async function renderAutoSkills(){
    const box=document.getElementById('cert-skills-list');
    if(!box)return;
    const map=new Map();
    try{const certs=asItems(await loadJSON('assets/data/certifications.json'));certs.forEach(cert=>asList(cert.skills).forEach(skill=>addSkill(map, skill, 'Certification', cert.title)));}catch(e){}
    try{const projects=await loadMarkdownProjects();projects.forEach(project=>asList(project.skills).forEach(skill=>addSkill(map, skill, 'Projet', project.title)));}catch(e){}
    try{const writeups=asItems(await loadJSON('content/writeups/writeups.json'));writeups.forEach(item=>asList(item.skills).forEach(skill=>addSkill(map, skill, item.sectionLabel||'Writeup', item.title)));}catch(e){}

    box.innerHTML='';
    if(!map.size){box.innerHTML='<article class="content-panel"><p>Aucune compétence validée pour le moment.</p></article>';return;}
    [...map.values()].sort((a,b)=>a.name.localeCompare(b.name)).forEach(item=>{
      const card=document.createElement('article');
      card.className='auto-skill-card';
      card.innerHTML=`<span class="card-kicker">Compétence validée</span><h3>${esc(item.name)}</h3><p>${item.sources.length} preuve(s) associée(s)</p>`;
      box.appendChild(card);
    });
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(renderAutoSkills,600));
})();
(function(){
  const isGithubPages=location.hostname.includes('github.io');
  const legacyBase='/portofiolo';
  const siteBase=(()=>{if(!isGithubPages)return'';const first=(location.pathname.split('/').filter(Boolean)[0]||'').trim();return first&&!first.includes('.')?'/'+first:''})();
  let cache=null;
  function clean(v){return String(v||'').trim()}
  function norm(v){return clean(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  function asset(path){
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
    return p;
  }
  async function loadJSON(path){const res=await fetch(asset(path),{cache:'no-store'});if(!res.ok)throw new Error(path);return res.json()}
  function isYes(v){if(typeof v==='boolean')return v;return ['true','1','oui','yes','on','public','autorise','autorisé','active','actif'].includes(norm(v))}
  function isPublic(v){return ['public','autorise','autorisé','download','telechargement','téléchargement','public-telechargeable'].includes(norm(v||'private'))}
  function closeReader(){
    const reader=document.getElementById('realisation-reader');
    if(reader)reader.remove();
    document.body.classList.remove('modal-open');
  }
  function readerTitle(reader){
    const h=reader.querySelector('.real-reader-header h2');
    if(h)return clean(h.textContent);
    const first=reader.querySelector('.real-reader-document h2,.real-reader-document h1');
    return clean(first&&first.textContent);
  }
  function removeHeader(reader){
    const panel=reader.querySelector('.real-reader-panel');
    if(panel)panel.classList.add('compact-reader');
    const title=readerTitle(reader);
    if(title)reader.dataset.readerTitle=title;
    const header=reader.querySelector('.real-reader-header');
    if(header)header.remove();
    if(!reader.querySelector('.reader-top-actions')){
      const actions=document.createElement('div');
      actions.className='reader-top-actions';
      actions.innerHTML='<button class="real-reader-close" type="button">Fermer</button>';
      reader.querySelector('.real-reader-panel')?.appendChild(actions);
      actions.querySelector('button').addEventListener('click',closeReader);
    }
    const sidebar=reader.querySelector('.real-reader-sidebar');
    if(sidebar){
      const titleNode=sidebar.querySelector('.sidebar-title');
      if(titleNode)titleNode.textContent='Table des matières';
    }
  }
  async function loadControls(){
    if(cache)return cache;
    const all=[];
    try{const p=await loadJSON('content/projects/project-control.json');(p.items||[]).forEach(x=>all.push({...x,_kind:'project'}))}catch(e){}
    try{const w=await loadJSON('content/writeups/writeups.json');(w.items||[]).forEach(x=>all.push({...x,_kind:'writeup'}))}catch(e){}
    cache=all;
    return all;
  }
  function findMeta(list,title){
    const t=norm(title);
    if(!t)return null;
    return list.find(x=>[x.publicTitle,x.title,x.name,x.obsidianPath].some(v=>norm(v).replace(/\.md$/,'')===t||t.includes(norm(v).replace(/\.md$/,''))));
  }
  function pdfFromMeta(meta){
    if(!meta)return null;
    const enabled=isYes(meta.pdfEnabled||meta.exportPdf||meta.allowPdf||meta.pdfExport);
    const access=meta.pdfAccess||meta.pdfPermission||'private';
    const file=clean(meta.pdfFile||meta.pdfUrl||meta.pdf);
    if(!(enabled&&file&&isPublic(access)))return null;
    return {href:asset(file),label:clean(meta.pdfLabel)||'Télécharger le PDF'};
  }
  function addPdfButton(reader,pdf){
    const sidebar=reader.querySelector('.real-reader-sidebar');
    if(!sidebar||!pdf||sidebar.querySelector('.reader-download-box'))return;
    const box=document.createElement('div');
    box.className='reader-download-box';
    box.innerHTML='<a class="reader-pdf-btn" href="'+pdf.href+'" download target="_blank" rel="noopener">'+pdf.label+'</a>';
    sidebar.insertBefore(box,sidebar.firstChild.nextSibling);
  }
  async function applyPdf(reader){
    const article=reader.querySelector('.real-reader-document');
    if(!article)return;
    const list=await loadControls();
    const meta=findMeta(list,reader.dataset.readerTitle||readerTitle(reader));
    const fromMeta=pdfFromMeta(meta);
    if(fromMeta){addPdfButton(reader,fromMeta);return;}
    const pdfLink=article.querySelector('a[href$=".pdf"],a[href*=".pdf?"]');
    if(!pdfLink)return;
    const allowed=pdfLink.dataset.pdfAllowed==='true'||pdfLink.textContent.toLowerCase().includes('pdf-public');
    if(allowed)addPdfButton(reader,{href:asset(pdfLink.getAttribute('href')),label:'Télécharger le PDF'});
  }
  function apply(){
    const reader=document.getElementById('realisation-reader');
    if(!reader)return;
    removeHeader(reader);
    applyPdf(reader);
  }
  document.addEventListener('DOMContentLoaded',apply);
  const observer=new MutationObserver(function(){setTimeout(apply,60)});
  document.addEventListener('DOMContentLoaded',function(){observer.observe(document.body,{childList:true,subtree:true})});
  window.addEventListener('load',function(){setTimeout(apply,400)});
})();

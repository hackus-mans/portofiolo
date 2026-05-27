(function(){
  const isGithubPages=location.hostname.includes('github.io');
  const owner='hackus-mans';
  const repo='portofiolo';
  const branch='main';
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
  async function loadGithubFolder(folder){
    const api='https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+folder+'?ref='+branch+'&cmsLive='+Date.now();
    const res=await fetch(api,{cache:'no-store'});
    if(!res.ok)return[];
    const files=await res.json();
    if(!Array.isArray(files))return[];
    const jsonFiles=files.filter(f=>f.type==='file'&&f.name.toLowerCase().endsWith('.json'));
    const rows=[];
    for(const file of jsonFiles){
      try{
        const r=await fetch(file.download_url+'?cmsLive='+Date.now(),{cache:'no-store'});
        if(r.ok)rows.push(await r.json());
      }catch(e){}
    }
    return rows;
  }
  function isYes(v){if(typeof v==='boolean')return v;return ['true','1','oui','yes','on','public','autorise','autorisé','active','actif'].includes(norm(v))}
  function isPublic(v){return ['public','autorise','autorisé','download','telechargement','téléchargement','public-telechargeable'].includes(norm(v||'private'))}
  function slug(v){return norm(v).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'document'}
  function closeReader(){
    const reader=document.getElementById('realisation-reader');
    if(reader)reader.remove();
    document.body.classList.remove('modal-open');
  }
  function readerTitle(reader){
    const h=reader.querySelector('.real-reader-header h2');
    if(h)return clean(h.textContent);
    const stored=reader.dataset.readerTitle;
    if(stored)return clean(stored);
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
    try{const p=await loadJSON('content/projects/project-control.json');(p.items||[]).forEach(x=>all.push({...x,_kind:'project-list'}))}catch(e){}
    try{const w=await loadJSON('content/writeups/writeups.json');(w.items||[]).forEach(x=>all.push({...x,_kind:'writeup-list'}))}catch(e){}
    try{(await loadGithubFolder('content/projects-control')).forEach(x=>all.push({...x,_kind:'project-control'}))}catch(e){}
    try{(await loadGithubFolder('content/writeups-control')).forEach(x=>all.push({...x,_kind:'writeup-control'}))}catch(e){}
    cache=all;
    return all;
  }
  function scoreMatch(meta,title){
    const t=norm(title).replace(/\.md$/,'');
    const values=[meta.publicTitle,meta.title,meta.name,meta.obsidianPath].map(v=>norm(v).replace(/\.md$/,'')).filter(Boolean);
    if(!t||!values.length)return 0;
    if(values.some(v=>v===t))return 100;
    if(values.some(v=>t.includes(v)||v.includes(t)))return 80;
    const words=t.split(/[^a-z0-9]+/).filter(w=>w.length>3);
    const hits=values.reduce((n,v)=>n+words.filter(w=>v.includes(w)).length,0);
    return hits;
  }
  function findMeta(list,title){
    let best=null,bestScore=0;
    list.forEach(item=>{
      const s=scoreMatch(item,title);
      const weight=item._kind&&item._kind.includes('control')?20:0;
      if(s+weight>bestScore){best=item;bestScore=s+weight;}
    });
    return bestScore>0?best:null;
  }
  function pdfAllowed(meta){
    if(!meta)return false;
    const enabled=isYes(meta.pdfEnabled||meta.exportPdf||meta.allowPdf||meta.pdfExport);
    const access=meta.pdfAccess||meta.pdfPermission||'private';
    return enabled&&isPublic(access);
  }
  async function ensurePdfLib(){
    if(window.html2pdf)return window.html2pdf;
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      s.onload=resolve;
      s.onerror=reject;
      document.head.appendChild(s);
    });
    return window.html2pdf;
  }
  async function generatePdf(reader,meta){
    const article=reader.querySelector('.real-reader-document');
    if(!article)return;
    const title=reader.dataset.readerTitle||readerTitle(reader)||'document';
    const clone=article.cloneNode(true);
    clone.querySelectorAll('button,.reader-top-actions,.reader-download-box,.reader-toc').forEach(x=>x.remove());
    const wrapper=document.createElement('div');
    wrapper.style.padding='28px';
    wrapper.style.background='#ffffff';
    wrapper.style.color='#111827';
    wrapper.style.fontFamily='Arial, sans-serif';
    wrapper.style.lineHeight='1.55';
    wrapper.innerHTML='<h1 style="font-size:24px;margin:0 0 18px;color:#111827">'+title+'</h1>';
    wrapper.appendChild(clone);
    wrapper.querySelectorAll('*').forEach(el=>{
      el.style.maxWidth='100%';
      if(['H1','H2','H3','H4'].includes(el.tagName))el.style.color='#111827';
      if(el.tagName==='IMG')el.style.maxWidth='100%';
      if(el.tagName==='PRE'){el.style.whiteSpace='pre-wrap';el.style.background='#f3f4f6';el.style.padding='12px';el.style.borderRadius='8px'}
      if(el.tagName==='A')el.style.color='#2563eb';
    });
    const opt={
      margin:10,
      filename:slug(title)+'.pdf',
      image:{type:'jpeg',quality:0.95},
      html2canvas:{scale:2,useCORS:true,allowTaint:true},
      jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
    };
    const lib=await ensurePdfLib();
    return lib().set(opt).from(wrapper).save();
  }
  function addPdfButton(reader,meta){
    const sidebar=reader.querySelector('.real-reader-sidebar');
    if(!sidebar||sidebar.querySelector('.reader-download-box'))return;
    if(!pdfAllowed(meta))return;
    const label=clean(meta.pdfLabel)||'Générer le PDF';
    const box=document.createElement('div');
    box.className='reader-download-box';
    box.innerHTML='<button class="reader-pdf-btn" type="button">'+label+'</button>';
    sidebar.insertBefore(box,sidebar.firstChild.nextSibling);
    box.querySelector('button').addEventListener('click',async()=>{
      const btn=box.querySelector('button');
      const old=btn.textContent;
      btn.disabled=true;
      btn.textContent='Génération...';
      try{await generatePdf(reader,meta)}catch(e){alert('Impossible de générer le PDF pour le moment. Réessaie après le chargement complet des images.')}finally{btn.disabled=false;btn.textContent=old}
    });
  }
  async function applyPdf(reader){
    const list=await loadControls();
    const meta=findMeta(list,reader.dataset.readerTitle||readerTitle(reader));
    addPdfButton(reader,meta);
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

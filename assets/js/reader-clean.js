(function(){
  function clean(v){return String(v||'').trim()}
  function closeReader(){
    const reader=document.getElementById('realisation-reader');
    if(reader)reader.remove();
    document.body.classList.remove('modal-open');
  }
  function removeHeader(reader){
    const panel=reader.querySelector('.real-reader-panel');
    if(panel)panel.classList.add('compact-reader');
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
      const title=sidebar.querySelector('.sidebar-title');
      if(title)title.textContent='Table des matières';
    }
  }
  function applyPdf(reader){
    const sidebar=reader.querySelector('.real-reader-sidebar');
    const article=reader.querySelector('.real-reader-document');
    if(!sidebar||!article||sidebar.querySelector('.reader-download-box'))return;
    const pdfLink=article.querySelector('a[href$=".pdf"], a[href*=".pdf?"]');
    if(!pdfLink)return;
    const href=clean(pdfLink.getAttribute('href'));
    const allowed=pdfLink.dataset.pdfAllowed==='true'||pdfLink.textContent.toLowerCase().includes('pdf-public');
    if(!allowed)return;
    const box=document.createElement('div');
    box.className='reader-download-box';
    box.innerHTML='<a class="reader-pdf-btn" href="'+href+'" download target="_blank" rel="noopener">Télécharger le PDF</a>';
    sidebar.insertBefore(box,sidebar.firstChild.nextSibling);
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

(function(){
  function closeViewer(){
    var viewer=document.getElementById('proof-viewer');
    if(viewer){viewer.classList.remove('is-open');viewer.setAttribute('hidden','hidden');}
    document.body.classList.remove('modal-open');
  }
  function ensureViewer(){
    var viewer=document.getElementById('proof-viewer');
    if(viewer){return viewer;}
    viewer=document.createElement('div');
    viewer.id='proof-viewer';
    viewer.className='proof-viewer';
    viewer.setAttribute('hidden','hidden');
    viewer.innerHTML='<div class="proof-viewer-bg" data-proof-close="true"></div><section class="proof-viewer-panel" role="dialog" aria-modal="true"><header class="proof-viewer-header"><h3 id="proof-viewer-title">Preuve</h3><button type="button" class="proof-viewer-close" data-proof-close="true">Fermer</button></header><div class="proof-viewer-body"><img id="proof-viewer-img" src="" alt=""></div></section>';
    document.body.appendChild(viewer);
    return viewer;
  }
  function openViewer(title,image){
    var viewer=ensureViewer();
    var titleNode=document.getElementById('proof-viewer-title');
    var img=document.getElementById('proof-viewer-img');
    titleNode.textContent=title||'Preuve';
    img.src=image||'';
    img.alt=title||'Preuve';
    viewer.removeAttribute('hidden');
    viewer.classList.add('is-open');
    document.body.classList.add('modal-open');
  }
  document.addEventListener('click',function(e){
    var closeBtn=e.target.closest('[data-proof-close="true"]');
    if(closeBtn){
      e.preventDefault();
      e.stopPropagation();
      closeViewer();
      return;
    }
    var openBtn=e.target.closest('.cert-open');
    if(openBtn){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation){e.stopImmediatePropagation();}
      var card=openBtn.closest('.cert-card');
      if(card){openViewer(card.dataset.title,card.dataset.image);}
      return;
    }
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){closeViewer();}
  });
  window.closeProofViewer=closeViewer;
})();
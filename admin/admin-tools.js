(function(){
  const PANEL_ID='hackus-admin-filter-panel';
  const STYLE_ID='hackus-admin-filter-style';

  function removeQuickFilter(){
    const panel=document.getElementById(PANEL_ID);
    if(panel) panel.remove();
    const style=document.getElementById(STYLE_ID);
    if(style) style.remove();
    document.querySelectorAll('.hackus-admin-hidden').forEach(node=>node.classList.remove('hackus-admin-hidden'));
  }

  function init(){
    removeQuickFilter();
    const obs=new MutationObserver(removeQuickFilter);
    obs.observe(document.body,{childList:true,subtree:true});
  }

  window.addEventListener('load',()=>setTimeout(init,500));
})();
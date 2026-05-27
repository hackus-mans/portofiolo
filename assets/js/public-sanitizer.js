(function(){
  const replacements = [
    ['Documentation publiée depuis Obsidian.', 'Documentation technique en cours de présentation.'],
    ['Impossible de charger le fichier complet pour le moment. Vérifie le déploiement ou le chemin du fichier.', 'Ce contenu est momentanément indisponible.'],
    ['Les writeups validés de cette branche s’affichent en bas.', ''],
    ['Cette branche existe dans Obsidian, mais aucun writeup n’est validé pour publication dans Sveltia.', 'Aucun writeup disponible pour cette sélection.'],
    ['Aucune section détectée.', 'Aucun contenu disponible.'],
    ['Aucune plateforme détectée.', 'Aucun contenu disponible.'],
    ['Aucune catégorie détectée.', 'Aucun contenu disponible.']
  ];

  function cleanText(root){
    if(!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let text = node.nodeValue;
      replacements.forEach(([from, to]) => {
        if(text.includes(from)) text = text.split(from).join(to);
      });
      node.nodeValue = text;
    });
  }

  function hideInternalBlocks(){
    document.querySelectorAll('.ready-level,.public-note,.technical-note').forEach(el => el.remove());
    document.querySelectorAll('.real-empty,.level-empty').forEach(el => {
      const text = (el.textContent || '').trim();
      if(text.includes('Obsidian') || text.includes('Sveltia') || text.includes('validés de cette branche')){
        el.textContent = 'Aucun contenu disponible pour cette sélection.';
      }
    });
  }

  function apply(){
    cleanText(document.body);
    hideInternalBlocks();
  }

  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', () => setTimeout(apply, 250));
  const observer = new MutationObserver(() => setTimeout(apply, 60));
  observer.observe(document.documentElement, {childList:true, subtree:true, characterData:true});
})();

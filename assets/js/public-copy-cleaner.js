(function(){
  const replacements = new Map([
    ['Les writeups validés de cette branche s’affichent en bas.', ''],
    ['Cette branche existe dans Obsidian, mais aucun writeup n’est validé pour publication dans Sveltia.', 'Aucun writeup disponible pour cette sélection.'],
    ['Documentation publiée depuis Obsidian.', 'Documentation technique en cours de présentation.'],
    ['Impossible de charger le fichier complet pour le moment. Vérifie le déploiement ou le chemin du fichier.', 'Ce contenu est momentanément indisponible.'],
    ['Aucune section détectée.', 'Aucun contenu disponible.'],
    ['Aucune plateforme détectée.', 'Aucun contenu disponible.'],
    ['Aucune catégorie détectée.', 'Aucun contenu disponible.'],
    ['Aucun projet publié ou aucun résultat trouvé.', 'Aucun projet disponible pour le moment.']
  ]);

  function cleanTextNodes(root){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let value = node.nodeValue;
      replacements.forEach((next, prev) => {
        if(value.includes(prev)) value = value.replaceAll(prev, next);
      });
      node.nodeValue = value;
    });
  }

  function clean(){
    document.querySelectorAll('.ready-level').forEach(el => el.remove());
    cleanTextNodes(document.body);
    document.querySelectorAll('.real-empty').forEach(el => {
      const text = (el.textContent || '').trim();
      if(!text || text === 'Aucun writeup disponible pour cette sélection.'){
        el.textContent = 'Aucun writeup disponible pour cette sélection.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', clean);
  window.addEventListener('load', () => setTimeout(clean, 400));
  const observer = new MutationObserver(clean);
  observer.observe(document.documentElement, { childList:true, subtree:true, characterData:true });
})();
(function(){
  function removeArticlesFromPublicNav(){
    document.querySelectorAll('a[href="articles.html"], a[href$="/articles.html"]').forEach(link => link.remove());
  }

  function slugify(text){
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  function cleanObsidianTocBlocks(doc){
    if(!doc) return;
    doc.querySelectorAll('pre').forEach(pre => {
      const text = pre.textContent || '';
      if(text.includes('title: Table des matières') || text.includes('style: nestedList') || text.includes('minLevel:') || text.includes('maxLevel:')){
        const prev = pre.previousElementSibling;
        const next = pre.nextElementSibling;
        if(prev && prev.textContent.trim() === '---') prev.remove();
        if(next && next.textContent.trim() === '---') next.remove();
        pre.remove();
      }
    });
    doc.querySelectorAll('p').forEach(p => {
      if(p.textContent.trim() === '---') p.remove();
    });
  }

  function buildReaderToc(panel){
    if(!panel || panel.dataset.tocReady === 'yes') return;
    const kicker = panel.querySelector('.real-reader-header .card-kicker');
    const isProject = kicker && kicker.textContent.toLowerCase().includes('projet');
    if(!isProject) return;

    const doc = panel.querySelector('.real-reader-document');
    const sidebar = panel.querySelector('.real-reader-sidebar');
    if(!doc || !sidebar) return;

    cleanObsidianTocBlocks(doc);

    const headings = Array.from(doc.querySelectorAll('h2,h3,h4')).filter(h => h.textContent.trim());
    if(!headings.length){
      sidebar.innerHTML = '<p class="sidebar-title">Navigation</p><p class="toc-empty">Aucune section détectée.</p>';
      panel.dataset.tocReady = 'yes';
      return;
    }

    const used = new Map();
    const links = headings.map((heading, index) => {
      const level = Number(heading.tagName.replace('H',''));
      const base = slugify(heading.textContent);
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      const id = count ? base + '-' + count : base;
      heading.id = heading.id || id;
      heading.classList.add('toc-target');
      return '<a class="toc-link toc-l' + level + '" href="#' + heading.id + '">' + heading.textContent.trim() + '</a>';
    }).join('');

    sidebar.innerHTML = '<p class="sidebar-title">Table des matières</p><nav class="reader-toc">' + links + '</nav>';
    sidebar.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const target = doc.querySelector(link.getAttribute('href'));
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
    panel.dataset.tocReady = 'yes';
  }

  function apply(){
    removeArticlesFromPublicNav();
    document.querySelectorAll('.real-reader-panel').forEach(buildReaderToc);
  }

  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', () => setTimeout(apply, 500));
  const observer = new MutationObserver(() => setTimeout(apply, 80));
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();

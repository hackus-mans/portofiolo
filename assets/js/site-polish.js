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

  function scrollInsideDocument(doc, target){
    if(!doc || !target) return;
    const docRect = doc.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = targetRect.top - docRect.top + doc.scrollTop - 18;
    doc.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    target.classList.add('toc-focus');
    setTimeout(() => target.classList.remove('toc-focus'), 1200);
  }

  function directSidebarTitle(sidebar){
    return Array.from(sidebar.children).find(child => child.classList && child.classList.contains('sidebar-title')) || null;
  }

  function collectHeadings(doc){
    return Array.from(doc.querySelectorAll('h1,h2,h3,h4'))
      .filter(heading => heading.textContent.trim() && !heading.closest('.reader-toc-section'));
  }

  function headingSignature(headings){
    return headings.map(heading => heading.tagName + ':' + heading.textContent.trim()).join('|') || 'empty';
  }

  function updateActiveToc(panel){
    const doc = panel.querySelector('.real-reader-document');
    const toc = panel.querySelector('.reader-toc');
    if(!doc || !toc) return;

    const headings = collectHeadings(doc);
    if(!headings.length) return;

    const docTop = doc.getBoundingClientRect().top;
    let current = headings[0];
    headings.forEach(heading => {
      if(heading.getBoundingClientRect().top - docTop <= 72) current = heading;
    });

    toc.querySelectorAll('.toc-link').forEach(link => {
      const active = link.dataset.target === current.id;
      link.classList.toggle('active', active);
      if(active) link.scrollIntoView({block:'nearest'});
    });
  }

  function ensureScrollTracking(panel, doc){
    if(doc.dataset.tocScrollReady === 'yes') return;
    doc.dataset.tocScrollReady = 'yes';
    let ticking = false;
    doc.addEventListener('scroll', () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveToc(panel);
        ticking = false;
      });
    }, {passive:true});
  }

  function buildReaderToc(panel){
    if(!panel) return;
    const doc = panel.querySelector('.real-reader-document');
    const sidebar = panel.querySelector('.real-reader-sidebar');
    if(!doc || !sidebar) return;

    cleanObsidianTocBlocks(doc);
    const headings = collectHeadings(doc);
    const signature = headingSignature(headings);
    const existing = sidebar.querySelector('.reader-toc-section');
    if(existing && panel.dataset.tocSignature === signature){
      updateActiveToc(panel);
      return;
    }

    if(existing) existing.remove();
    const infoTitle = directSidebarTitle(sidebar);
    if(infoTitle) infoTitle.textContent = 'Informations';

    const section = document.createElement('section');
    section.className = 'reader-toc-section';

    if(!headings.length){
      section.innerHTML = '<p class="reader-toc-heading">Sommaire <span>0 section</span></p><p class="toc-empty">Le sommaire apparaîtra dès que les titres du document seront chargés.</p>';
      sidebar.insertBefore(section, sidebar.firstChild);
      panel.dataset.tocSignature = signature;
      return;
    }

    const used = new Map();
    const links = headings.map(heading => {
      const level = Number(heading.tagName.replace('H',''));
      const base = slugify(heading.textContent);
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      const id = count ? base + '-' + count : base;
      heading.id = id;
      heading.dataset.tocId = id;
      heading.classList.add('toc-target');
      return '<button class="toc-link toc-l' + level + '" type="button" data-target="' + id + '">' + heading.textContent.trim() + '</button>';
    }).join('');

    section.innerHTML = '<p class="reader-toc-heading">Sommaire <span>' + headings.length + ' section' + (headings.length > 1 ? 's' : '') + '</span></p><nav class="reader-toc" aria-label="Sommaire du document">' + links + '</nav>';
    sidebar.insertBefore(section, sidebar.firstChild);

    section.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const target = headings.find(heading => heading.id === link.dataset.target);
        section.querySelectorAll('.toc-link').forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        scrollInsideDocument(doc, target);
      });
    });

    panel.dataset.tocSignature = signature;
    ensureScrollTracking(panel, doc);
    updateActiveToc(panel);
  }

  function apply(){
    removeArticlesFromPublicNav();
    document.querySelectorAll('.real-reader-panel').forEach(buildReaderToc);
  }

  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', () => setTimeout(apply, 500));
  const observer = new MutationObserver(() => setTimeout(apply, 90));
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();

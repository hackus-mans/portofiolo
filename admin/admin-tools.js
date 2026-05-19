(function(){
  const PANEL_ID='hackus-admin-filter-panel';
  const STYLE_ID='hackus-admin-filter-style';

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #${PANEL_ID}{position:fixed;right:18px;bottom:18px;z-index:999999;width:min(420px,calc(100vw - 36px));padding:14px;border:1px solid rgba(0,245,200,.28);border-radius:18px;background:#07111f;color:#eaf4ff;box-shadow:0 24px 80px rgba(0,0,0,.45);font-family:Inter,system-ui,Arial,sans-serif}
      #${PANEL_ID} .h-title{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px;font-weight:900;color:#00f5c8;letter-spacing:.08em;text-transform:uppercase;font-size:12px}
      #${PANEL_ID} .h-row{display:grid;grid-template-columns:1fr 135px;gap:8px}
      #${PANEL_ID} input,#${PANEL_ID} select{width:100%;border:1px solid rgba(130,210,255,.25);border-radius:12px;background:#020712;color:#eef7ff;padding:10px 11px;font-weight:700;outline:none}
      #${PANEL_ID} input:focus,#${PANEL_ID} select:focus{border-color:rgba(0,245,200,.6)}
      #${PANEL_ID} .h-actions{display:flex;gap:8px;margin-top:10px}
      #${PANEL_ID} button{cursor:pointer;border:1px solid rgba(130,210,255,.25);border-radius:999px;background:rgba(255,255,255,.06);color:#eef7ff;padding:8px 10px;font-weight:800}
      #${PANEL_ID} button:hover{border-color:rgba(0,245,200,.55);background:rgba(0,245,200,.09)}
      #${PANEL_ID} .h-help{margin-top:8px;color:#91a5bd;font-size:12px;line-height:1.45}
      .hackus-admin-hidden{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function candidateNodes(){
    const selectors=[
      '[role="listitem"]','li','article','tr',
      '[class*="entry"]','[class*="collection"] [class*="item"]',
      '[class*="ListItem"]','[class*="list-item"]'
    ];
    const nodes=[];
    selectors.forEach(sel=>document.querySelectorAll(sel).forEach(n=>nodes.push(n)));
    return [...new Set(nodes)].filter(n=>{
      if(!n || n.closest('#'+PANEL_ID)) return false;
      const text=(n.innerText||'').trim();
      if(text.length<3 || text.length>3000) return false;
      return /publish|publier|title|titre|obsidianPath|Challenges|Machine\/Lab|Projet|Root me|Tryhackme|Pico|true|false/i.test(text);
    });
  }

  function detectPublished(text){
    const t=text.toLowerCase();
    if(/publish\s*:\s*true|publier sur le site\s*true|true/.test(t)) return true;
    if(/publish\s*:\s*false|publier sur le site\s*false|false/.test(t)) return false;
    return null;
  }

  function applyFilter(){
    const q=(document.getElementById('hackus-admin-search')?.value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
    const status=document.getElementById('hackus-admin-status')?.value||'all';
    candidateNodes().forEach(node=>{
      const raw=node.innerText||'';
      const text=raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const pub=detectPublished(raw);
      let ok=true;
      if(q && !text.includes(q)) ok=false;
      if(status==='published' && pub!==true) ok=false;
      if(status==='unpublished' && pub!==false) ok=false;
      node.classList.toggle('hackus-admin-hidden', !ok);
    });
  }

  function clearFilter(){
    const s=document.getElementById('hackus-admin-search');
    const f=document.getElementById('hackus-admin-status');
    if(s) s.value='';
    if(f) f.value='all';
    document.querySelectorAll('.hackus-admin-hidden').forEach(n=>n.classList.remove('hackus-admin-hidden'));
  }

  function createPanel(){
    if(document.getElementById(PANEL_ID)) return;
    addStyle();
    const panel=document.createElement('div');
    panel.id=PANEL_ID;
    panel.innerHTML=`
      <div class="h-title"><span>Filtre rapide</span><button id="hackus-admin-min" type="button">Réduire</button></div>
      <div class="h-content">
        <div class="h-row">
          <input id="hackus-admin-search" type="search" placeholder="Rechercher une note, projet, plateforme...">
          <select id="hackus-admin-status">
            <option value="all">Tous</option>
            <option value="published">Publiés</option>
            <option value="unpublished">Non publiés</option>
          </select>
        </div>
        <div class="h-actions">
          <button id="hackus-admin-apply" type="button">Filtrer</button>
          <button id="hackus-admin-clear" type="button">Réinitialiser</button>
        </div>
        <div class="h-help">Ouvre d’abord “Publication Projets Obsidian” ou “Publication Writeups Obsidian”, puis utilise ce filtre.</div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('#hackus-admin-search').addEventListener('input',applyFilter);
    panel.querySelector('#hackus-admin-status').addEventListener('change',applyFilter);
    panel.querySelector('#hackus-admin-apply').addEventListener('click',applyFilter);
    panel.querySelector('#hackus-admin-clear').addEventListener('click',clearFilter);
    panel.querySelector('#hackus-admin-min').addEventListener('click',()=>{
      const content=panel.querySelector('.h-content');
      const btn=panel.querySelector('#hackus-admin-min');
      const hidden=content.style.display==='none';
      content.style.display=hidden?'block':'none';
      btn.textContent=hidden?'Réduire':'Afficher';
    });
  }

  function init(){
    createPanel();
    const obs=new MutationObserver(()=>{
      const q=document.getElementById('hackus-admin-search')?.value;
      const f=document.getElementById('hackus-admin-status')?.value;
      if(q || (f && f!=='all')) setTimeout(applyFilter,150);
    });
    obs.observe(document.body,{childList:true,subtree:true});
  }

  window.addEventListener('load',()=>setTimeout(init,1800));
})();
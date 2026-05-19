(function(){
  const ID='hm-admin-search-panel';
  const STYLE='hm-admin-search-style';
  const state={items:[],query:'',type:'all',status:'all'};
  function n(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
  function e(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  async function json(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(path);return r.json()}
  function style(){
    if(document.getElementById(STYLE))return;
    const s=document.createElement('style');s.id=STYLE;s.textContent=`
    #${ID}{position:fixed;top:86px;right:22px;z-index:999999;width:min(520px,calc(100vw - 44px));background:#07111d;color:#eef7ff;border:1px solid rgba(0,245,200,.32);border-radius:20px;box-shadow:0 22px 80px rgba(0,0,0,.45);font-family:Inter,system-ui,Arial,sans-serif;overflow:hidden}
    #${ID}.min{width:auto}#${ID}.min .body{display:none}.head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 14px;border-bottom:1px solid rgba(130,210,255,.16);background:rgba(255,255,255,.035)}
    .title{font-weight:950}.title small{display:block;color:#00f5c8;text-transform:uppercase;letter-spacing:.12em}.body{padding:14px}.grid{display:grid;grid-template-columns:1fr 120px 130px;gap:8px}.grid input,.grid select{border:1px solid rgba(130,210,255,.24);border-radius:13px;background:#020712;color:#eef7ff;padding:10px;font-weight:750;outline:none}.grid input:focus,.grid select:focus{border-color:#00f5c8}.results{display:grid;gap:8px;max-height:330px;overflow:auto;margin-top:12px}.item{border:1px solid rgba(130,210,255,.15);border-radius:15px;background:rgba(255,255,255,.035);padding:10px}.item:hover{border-color:rgba(0,245,200,.42)}.item strong{display:block}.path{color:#9fb0c6;font-size:12px;word-break:break-word;margin-top:4px}.badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.badge{border:1px solid rgba(130,210,255,.2);border-radius:999px;padding:4px 7px;font-size:11px;font-weight:850}.ok{color:#b7fff2;border-color:rgba(0,245,200,.35);background:rgba(0,245,200,.08)}.wait{color:#ffdba3;border-color:rgba(255,190,90,.35);background:rgba(255,190,90,.08)}.empty{padding:15px;border:1px dashed rgba(130,210,255,.22);border-radius:14px;color:#9fb0c6;text-align:center}.tools{display:flex;gap:7px}.tools button,.copy{cursor:pointer;border:1px solid rgba(130,210,255,.24);border-radius:999px;background:rgba(255,255,255,.06);color:#eef7ff;padding:7px 10px;font-weight:850}.tools button:hover,.copy:hover{border-color:#00f5c8;background:rgba(0,245,200,.09)}.hint{font-size:12px;color:#8ea0b7;margin-top:9px;line-height:1.45}@media(max-width:850px){#${ID}{top:auto;left:12px;right:12px;bottom:12px;width:auto}.grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }
  async function load(){
    const out=[];
    for(const src of [{t:'project',l:'Projet',p:'/portofiolo/content/projects/project-control.json'},{t:'writeup',l:'Writeup',p:'/portofiolo/content/writeups/publication-control.json'}]){
      try{const d=await json(src.p);(Array.isArray(d.items)?d.items:[]).forEach(x=>out.push({...x,_type:src.t,_label:src.l,_published:!!x.publish,_s:n([x.title,x.publicTitle,x.obsidianPath,x.sectionLabel,x.platform,x.category,x.status,x.note,(x.skills||[]).join(' '),(x.tools||[]).join(' ')].join(' '))}))}catch(err){}
    }
    state.items=out;
  }
  function filtered(){return state.items.filter(x=>{if(state.type!=='all'&&x._type!==state.type)return false;if(state.status==='published'&&!x._published)return false;if(state.status==='unpublished'&&x._published)return false;if(state.query&&!x._s.includes(n(state.query)))return false;return true})}
  function render(){
    const r=document.querySelector('#'+ID+' .results');const c=document.querySelector('#'+ID+' .count');if(!r)return;const data=filtered();if(c)c.textContent=data.length+' résultat(s)';
    if(!data.length){r.innerHTML='<div class="empty">Aucun résultat.</div>';return}
    r.innerHTML=data.slice(0,80).map((x,i)=>`<div class="item"><strong>${e(x.publicTitle||x.title||'Sans titre')}</strong><div class="path">${e(x.obsidianPath||'')}</div><div class="badges"><span class="badge">${e(x._label)}</span>${x._published?'<span class="badge ok">Publié</span>':'<span class="badge wait">Non publié</span>'}${x.platform?`<span class="badge">${e(x.platform)}</span>`:''}${x.category?`<span class="badge">${e(x.category)}</span>`:''}</div><button class="copy" data-i="${i}" type="button">Copier chemin</button></div>`).join('')+(data.length>80?'<div class="empty">Affiche 80 premiers résultats. Affine ta recherche.</div>':'');
    r.querySelectorAll('.copy').forEach(b=>b.onclick=async()=>{const x=data[Number(b.dataset.i)];try{await navigator.clipboard.writeText(x.obsidianPath||x.title||'');b.textContent='Copié'}catch(err){b.textContent=x.obsidianPath||x.title||''}})
  }
  function create(){
    style();if(document.getElementById(ID))return;const p=document.createElement('div');p.id=ID;p.innerHTML=`<div class="head"><div class="title"><small>Filtre publication</small>Projets & Writeups</div><div class="tools"><button id="hm-reload">Actualiser</button><button id="hm-min">Réduire</button></div></div><div class="body"><div class="grid"><input id="hm-q" type="search" placeholder="Nom, chemin, plateforme, compétence..."><select id="hm-type"><option value="all">Tout</option><option value="project">Projets</option><option value="writeup">Writeups</option></select><select id="hm-status"><option value="all">Tous</option><option value="published">Publiés</option><option value="unpublished">Non publiés</option></select></div><div class="hint"><span class="count">0 résultat</span>. Ouvre la section Sveltia puis utilise le chemin copié pour retrouver l’entrée.</div><div class="results"><div class="empty">Chargement...</div></div></div>`;document.body.appendChild(p);
    document.getElementById('hm-q').oninput=ev=>{state.query=ev.target.value;render()};document.getElementById('hm-type').onchange=ev=>{state.type=ev.target.value;render()};document.getElementById('hm-status').onchange=ev=>{state.status=ev.target.value;render()};document.getElementById('hm-reload').onclick=async()=>{await load();render()};document.getElementById('hm-min').onclick=()=>{p.classList.toggle('min');document.getElementById('hm-min').textContent=p.classList.contains('min')?'Afficher':'Réduire'};
  }
  window.addEventListener('load',async()=>{setTimeout(async()=>{create();await load();render()},1300)});
})();

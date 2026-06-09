(function(){
  function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function printableHtml(title,articleHtml){
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>'+esc(title)+'</title><style>'+css()+'</style></head><body><main class="pdf-doc"><h1 class="pdf-title">'+esc(title)+'</h1><p class="pdf-meta">Document généré depuis le portfolio Hackus Mans</p><article>'+articleHtml+'</article></main><script>window.addEventListener("load",function(){setTimeout(function(){window.print()},450)})<\/script></body></html>';
  }
  function css(){return `
    @page{size:A4;margin:16mm 14mm}
    *{box-sizing:border-box}
    body{margin:0;background:#fff;color:#111827;font-family:Arial,Helvetica,sans-serif;font-size:12.5px;line-height:1.55}
    .pdf-doc{max-width:190mm;margin:0 auto;padding:0;background:#fff;color:#111827}
    .pdf-title{font-size:24px;line-height:1.25;margin:0 0 8px;padding-bottom:10px;border-bottom:1px solid #d1d5db;color:#111827!important}
    .pdf-meta{font-size:10px;color:#6b7280;margin:0 0 18px}
    h1,h2,h3,h4,h5,h6{color:#111827!important;break-after:avoid;page-break-after:avoid;margin:18px 0 8px;line-height:1.25}
    h1{font-size:22px}h2{font-size:19px}h3{font-size:16px}h4{font-size:14px}h5{font-size:13px}h6{font-size:12px;text-transform:uppercase;letter-spacing:.04em}
    p,li,blockquote{color:#111827!important;font-size:12.5px;line-height:1.55}
    p{margin:0 0 9px}ul,ol{margin:8px 0 10px 20px;padding:0}li{margin:3px 0}
    a{color:#0f4c81;text-decoration:none}
    mark,span[style],font{color:inherit!important;background:transparent!important;padding:0!important;border-radius:0!important}
    table{width:100%;border-collapse:collapse;margin:12px 0;page-break-inside:auto;font-size:10.5px}
    th,td{border:1px solid #d1d5db;padding:6px;vertical-align:top;color:#111827!important}
    th{background:#f3f4f6;font-weight:bold}
    pre{white-space:pre-wrap;word-break:break-word;background:#0f172a!important;color:#e5e7eb!important;border-radius:8px;padding:10px;margin:12px 0;font-family:Consolas,Monaco,'Courier New',monospace;font-size:9.5px;line-height:1.45;page-break-inside:avoid}
    code{font-family:Consolas,Monaco,'Courier New',monospace;background:#f3f4f6;color:#111827;padding:1px 3px;border-radius:3px}
    pre code{background:transparent!important;color:#e5e7eb!important;padding:0}
    blockquote{border-left:4px solid #94a3b8;background:#f8fafc;margin:12px 0;padding:8px 10px}
    figure{margin:12px 0;text-align:center;page-break-inside:avoid}
    img,video{max-width:100%;height:auto;border:1px solid #e5e7eb;border-radius:6px}
    figcaption{font-size:10px;color:#6b7280;margin-top:4px}
    .real-reader-sidebar,.real-reader-header,.real-reader-top-actions,.obs-code-lang,.obs-copy-code,button{display:none!important}
    .obs-callout{border:1px solid #cbd5e1;border-left:4px solid #64748b;background:#f8fafc;border-radius:6px;margin:10px 0;padding:8px}
    .obs-callout-title{font-weight:bold;margin-bottom:4px;color:#111827!important}.obs-callout-title span{display:none}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.pdf-doc{max-width:none}}
  `}
  function openPrint(button){
    const modal=button.closest('.realisation-reader');
    const article=modal&&modal.querySelector('.obsidian-doc');
    const title=(modal&&modal.querySelector('.real-reader-header h2')?modal.querySelector('.real-reader-header h2').innerText:'Document');
    if(!article)return;
    const clone=article.cloneNode(true);
    clone.querySelectorAll('script,style,button,.obs-code-lang,.obs-copy-code').forEach(n=>n.remove());
    const win=window.open('','_blank');
    if(!win){alert('Autorise les popups pour générer le PDF.');return;}
    win.document.open();
    win.document.write(printableHtml(title,clone.innerHTML));
    win.document.close();
  }
  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest&&e.target.closest('[data-pdf-download]');
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    openPrint(btn);
  },true);
})();

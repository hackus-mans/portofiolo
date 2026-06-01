(function(){
  function clean(v){return String(v||'').replace(/\s+$/,'')}
  function slugify(v){return String(v||'document').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'document'}
  function loadScriptOnce(key,src){
    if(window[key])return Promise.resolve(window[key]);
    const loading='__'+key+'DirectLoading';
    if(window[loading])return window[loading];
    window[loading]=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(window[key]);s.onerror=reject;document.head.appendChild(s)});
    return window[loading];
  }
  function collectBlocks(root){
    const blocks=[];
    function push(type,text,level){text=clean(text||'').trim();if(text)blocks.push({type,text,level:level||0})}
    function walk(node){
      if(!node)return;
      if(node.nodeType===3)return;
      if(node.nodeType!==1)return;
      const tag=node.tagName.toLowerCase();
      if(['script','style','button'].includes(tag))return;
      if(/^h[1-6]$/.test(tag)){push('heading',node.innerText,Number(tag[1]));return}
      if(tag==='pre'){push('code',node.innerText);return}
      if(tag==='table'){
        const rows=Array.from(node.querySelectorAll('tr')).map(tr=>Array.from(tr.children).map(td=>clean(td.innerText).trim()).filter(Boolean).join(' | ')).filter(Boolean);
        if(rows.length)push('table',rows.join('\n'));
        return;
      }
      if(tag==='figure'){
        const cap=node.querySelector('figcaption');
        const img=node.querySelector('img');
        const label=cap?cap.innerText:(img?(img.alt||img.src.split('/').pop()):'Image');
        push('image','[Image] '+label);
        return;
      }
      if(['p','li','blockquote'].includes(tag)){push(tag==='li'?'list':'text',node.innerText);return}
      Array.from(node.children).forEach(walk);
    }
    Array.from(root.children).forEach(walk);
    if(!blocks.length&&root.innerText.trim())push('text',root.innerText.trim());
    return blocks;
  }
  function addWrapped(pdf,text,x,y,maxWidth,lineHeight,opts){
    const lines=pdf.splitTextToSize(text,maxWidth);
    for(const line of lines){
      if(y>280){pdf.addPage();y=18}
      pdf.text(line,x,y);
      y+=lineHeight;
    }
    return y;
  }
  async function directPdf(button){
    const modal=button.closest('.realisation-reader');
    const article=modal&&modal.querySelector('.obsidian-doc');
    if(!modal||!article)return;
    const old=button.textContent;
    button.disabled=true;
    button.textContent='Préparation...';
    try{
      await loadScriptOnce('jspdf','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const jsPDF=(window.jspdf&&window.jspdf.jsPDF)||window.jsPDF;
      const pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait'});
      const title=(modal.querySelector('.real-reader-header h2')||{}).innerText||'Document';
      const blocks=collectBlocks(article);
      let y=18;
      const left=15,max=180;
      pdf.setFont('helvetica','bold');pdf.setFontSize(15);
      y=addWrapped(pdf,title,left,y,max,7);
      pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.setTextColor(90);
      y+=2;pdf.text('Document généré depuis le portfolio Hackus Mans',left,y);y+=9;
      pdf.setTextColor(25);
      for(const b of blocks){
        if(y>276){pdf.addPage();y=18}
        if(b.type==='heading'){
          y+=b.level<=2?4:2;
          pdf.setFont('helvetica','bold');
          pdf.setFontSize(b.level===1?14:b.level===2?13:b.level===3?12:11);
          y=addWrapped(pdf,b.text,left,y,max,6.5);
          y+=2;
        }else if(b.type==='code'){
          pdf.setFont('courier','normal');pdf.setFontSize(8.5);
          y=addWrapped(pdf,b.text,left,y,max,4.4);
          y+=3;
        }else if(b.type==='table'){
          pdf.setFont('courier','normal');pdf.setFontSize(8);
          y=addWrapped(pdf,b.text,left,y,max,4.2);
          y+=3;
        }else if(b.type==='image'){
          pdf.setFont('helvetica','italic');pdf.setFontSize(9);pdf.setTextColor(95);
          y=addWrapped(pdf,b.text,left,y,max,5);
          pdf.setTextColor(25);y+=2;
        }else{
          pdf.setFont('helvetica','normal');pdf.setFontSize(10);
          const prefix=b.type==='list'?'• ':'';
          y=addWrapped(pdf,prefix+b.text,left,y,max,5.3);
          y+=2;
        }
      }
      const count=pdf.internal.getNumberOfPages();
      for(let i=1;i<=count;i++){pdf.setPage(i);pdf.setFont('helvetica','normal');pdf.setFontSize(8);pdf.setTextColor(120);pdf.text(String(i)+' / '+String(count),190,290,{align:'right'});}
      pdf.save(slugify(title)+'.pdf');
      button.textContent='PDF généré';
    }catch(e){
      console.error('PDF direct export failed',e);
      button.textContent='Erreur PDF';
    }finally{
      setTimeout(()=>{button.disabled=false;button.textContent=old},1600);
    }
  }
  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest&&e.target.closest('[data-pdf-download]');
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    directPdf(btn);
  },true);
})();

(function(){
  function clean(v){return String(v||'').trim()}
  function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function slug(v){return clean(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'section'}
  function isUrl(v){return /^(https?:|data:|blob:|mailto:|tel:|#)/i.test(clean(v))}
  function assetPath(path){
    let p=clean(path).split('|')[0].trim();
    if(!p)return'';
    if(isUrl(p))return p;
    if(p.startsWith('/portofiolo/'))return p;
    if(p.startsWith('/content/')||p.startsWith('content/')||p.startsWith('/assets/')||p.startsWith('assets/'))return p.replace(/^\//,'');
    return 'content/writeups/media/'+p.replace(/^.*[\\/]/,'');
  }
  function parseEmbedAttrs(raw){
    const attrs={};
    clean(raw).split('|').slice(1).forEach(part=>{
      part=part.trim();
      if(/^\d+$/.test(part))attrs.width=part;
      else if(part.includes('=')){const[k,...rest]=part.split('=');attrs[k.trim()]=rest.join('=').trim()}
      else if(part)attrs.caption=part;
    });
    return attrs;
  }
  function mediaHtml(label,raw){
    const attrs=parseEmbedAttrs(raw);
    const src=assetPath(raw);
    const caption=esc(attrs.caption||label||clean(raw).split('|')[0].split('/').pop()||'Média');
    const style=attrs.width?' style="max-width:'+esc(attrs.width)+'px"':'';
    const lower=src.split('?')[0].split('#')[0].toLowerCase();
    if(/\.(png|jpe?g|gif|webp|svg)$/i.test(lower))return '<figure class="obs-media"'+style+'><img src="'+esc(src)+'" alt="'+caption+'" loading="lazy"><figcaption>'+caption+'</figcaption></figure>';
    if(/\.(mp4|webm|mov|mkv)$/i.test(lower))return '<figure class="obs-media"><video controls src="'+esc(src)+'"></video><figcaption>'+caption+'</figcaption></figure>';
    if(/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(lower))return '<figure class="obs-media"><audio controls src="'+esc(src)+'"></audio><figcaption>'+caption+'</figcaption></figure>';
    if(/\.pdf$/i.test(lower))return '<p><a class="obs-attachment" href="'+esc(src)+'" target="_blank" rel="noopener">📄 '+caption+'</a></p>';
    return '<p><a class="obs-attachment" href="'+esc(src)+'" target="_blank" rel="noopener">📎 '+caption+'</a></p>';
  }
  function transformCallouts(text){
    const lines=String(text||'').split('\n');
    const out=[];
    let i=0;
    while(i<lines.length){
      const m=lines[i].match(/^>\s*\[!([A-Za-z0-9_-]+)\]([+-])?\s*(.*)$/);
      if(!m){out.push(lines[i]);i++;continue}
      const type=m[1].toLowerCase();
      const title=m[3]||type;
      const body=[];
      i++;
      while(i<lines.length&&/^>/.test(lines[i])){body.push(lines[i].replace(/^>\s?/,''));i++}
      out.push('<aside class="obs-callout obs-callout-'+esc(type)+'"><div class="obs-callout-title"><span>'+esc(type)+'</span>'+esc(title)+'</div><div class="obs-callout-body">');
      out.push(body.join('\n'));
      out.push('</div></aside>');
    }
    return out.join('\n');
  }
  function preprocess(md){
    let text=String(md||'').replace(/\r\n/g,'\n');
    text=text.replace(/%%[\s\S]*?%%/g,'');
    text=text.replace(/!\[\[([^\]]+)\]\]/g,function(_,ref){return '\n'+mediaHtml(ref,ref)+'\n'});
    text=text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,function(_,alt,url){return '\n'+mediaHtml(alt,url)+'\n'});
    text=text.replace(/==([^\n]+?)==/g,'<mark>$1</mark>');
    text=text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'<span class="obs-wikilink" data-target="$1">$2</span>');
    text=text.replace(/\[\[([^\]]+)\]\]/g,'<span class="obs-wikilink">$1</span>');
    return transformCallouts(text);
  }
  function codeBlock(code,language){
    const l=clean(language).toLowerCase().replace(/^language-/,'')||'text';
    return '<pre class="obs-code" data-lang="'+esc(l)+'"><code class="language-'+esc(l)+'">'+esc(code)+'</code></pre>';
  }
  function mermaidBlock(code){return '<div class="obs-mermaid-wrap"><div class="obs-mermaid mermaid">'+esc(code)+'</div></div>'}
  function buildEngine(){
    if(!window.markdownit)return null;
    const md=window.markdownit({html:true,linkify:true,typographer:true,breaks:false});
    const defaultHeadingOpen=md.renderer.rules.heading_open||function(tokens,idx,options,env,self){return self.renderToken(tokens,idx,options)};
    md.renderer.rules.heading_open=function(tokens,idx,options,env,self){
      const next=tokens[idx+1];
      if(next&&next.type==='inline')tokens[idx].attrSet('id',slug(next.content));
      tokens[idx].attrJoin('class','obs-heading obs-'+tokens[idx].tag);
      return defaultHeadingOpen(tokens,idx,options,env,self);
    };
    md.renderer.rules.fence=function(tokens,idx){
      const token=tokens[idx];
      const info=clean(token.info).split(/\s+/)[0];
      const l=info.toLowerCase();
      const code=token.content||'';
      if(['mermaid','flowchart','graph','sequence'].includes(l)||/^\s*(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap|timeline)\b/.test(code))return mermaidBlock(code);
      return codeBlock(code,info);
    };
    md.renderer.rules.code_block=function(tokens,idx){return codeBlock(tokens[idx].content,'text')};
    return md;
  }
  function postprocess(html){
    return String(html||'')
      .replace(/<li>\s*\[ \]\s*/g,'<li class="obs-task"><input type="checkbox" disabled> <span>')
      .replace(/<li>\s*\[[xX]\]\s*/g,'<li class="obs-task"><input type="checkbox" disabled checked> <span>')
      .replace(/(<li class="obs-task"><input[^>]+> <span>)([\s\S]*?)<\/li>/g,'$1$2</span></li>');
  }
  function fallback(md){return preprocess(md).split(/\n\s*\n/).map(p=>'<p>'+p+'</p>').join('\n')}
  function render(md){
    const text=preprocess(md);
    const engine=buildEngine();
    return postprocess(engine?engine.render(text):fallback(text));
  }
  function loadScriptOnce(key,src){
    if(window[key])return Promise.resolve(window[key]);
    const loading='__'+key+'Loading';
    if(window[loading])return window[loading];
    window[loading]=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(window[key]);s.onerror=reject;document.head.appendChild(s)});
    return window[loading];
  }
  function runHighlight(root){
    const nodes=Array.from((root||document).querySelectorAll('pre.obs-code code:not([data-highlighted="yes"])'));
    if(!nodes.length)return;
    loadScriptOnce('hljs','https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js').then(h=>{nodes.forEach(code=>{try{h.highlightElement(code)}catch(e){}code.dataset.highlighted='yes'})}).catch(()=>nodes.forEach(code=>code.dataset.highlighted='yes'));
  }
  function runMermaid(root){
    const nodes=Array.from((root||document).querySelectorAll('.obs-mermaid:not([data-processed="true"])'));
    if(!nodes.length)return;
    loadScriptOnce('mermaid','https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js').then(m=>{try{m.initialize({startOnLoad:false,theme:'dark',securityLevel:'loose',flowchart:{htmlLabels:true,curve:'basis'}});m.run({nodes})}catch(e){nodes.forEach(n=>n.classList.add('obs-mermaid-failed'))}}).catch(()=>nodes.forEach(n=>n.classList.add('obs-mermaid-failed')));
  }
  function enhance(root){runHighlight(root);runMermaid(root)}
  window.ObsidianFidelity={render,enhance,mediaHtml,assetPath};
})();

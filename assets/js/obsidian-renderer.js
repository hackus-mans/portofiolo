(function(){
  function clean(v){return String(v||'').trim()}
  function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
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
  function parseAttrs(raw){
    const attrs={};
    clean(raw).split('|').slice(1).forEach(part=>{
      part=part.trim();
      if(/^\d+$/.test(part))attrs.width=part;
      else if(part.includes('=')){const [k,...rest]=part.split('=');attrs[k.trim()]=rest.join('=').trim()}
      else if(part)attrs.caption=part;
    });
    return attrs;
  }
  function mediaHtml(label,raw){
    const attrs=parseAttrs(raw);
    const src=assetPath(raw);
    const caption=esc(attrs.caption||label||clean(raw).split('|')[0].split('/').pop());
    const style=attrs.width?' style="max-width:'+esc(attrs.width)+'px"':'';
    const lower=src.split('?')[0].split('#')[0].toLowerCase();
    if(/\.(png|jpe?g|gif|webp|svg)$/i.test(lower))return '<figure class="obs-media"'+style+'><img src="'+esc(src)+'" alt="'+caption+'" loading="lazy"><figcaption>'+caption+'</figcaption></figure>';
    if(/\.(mp4|webm|mov|mkv)$/i.test(lower))return '<figure class="obs-media"><video controls src="'+esc(src)+'"></video><figcaption>'+caption+'</figcaption></figure>';
    if(/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(lower))return '<figure class="obs-media"><audio controls src="'+esc(src)+'"></audio><figcaption>'+caption+'</figcaption></figure>';
    if(/\.pdf$/i.test(lower))return '<p><a class="obs-attachment" href="'+esc(src)+'" target="_blank" rel="noopener">📄 '+caption+'</a></p>';
    return '<p><a class="obs-attachment" href="'+esc(src)+'" target="_blank" rel="noopener">📎 '+caption+'</a></p>';
  }
  function inline(text){
    let s=esc(text);
    s=s.replace(/==(.+?)==/g,'<mark>$1</mark>');
    s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    s=s.replace(/__([^_]+)__/g,'<strong>$1</strong>');
    s=s.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g,'<em>$1</em>');
    s=s.replace(/~~(.+?)~~/g,'<del>$1</del>');
    s=s.replace(/`([^`]+)`/g,'<code>$1</code>');
    s=s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'<span class="obs-wikilink" data-target="$1">$2</span>');
    s=s.replace(/\[\[([^\]]+)\]\]/g,'<span class="obs-wikilink">$1</span>');
    s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,function(_,label,url){return '<a href="'+esc(assetPath(url))+'" target="_blank" rel="noopener">'+label+'</a>'});
    s=s.replace(/&lt;mark([^&]*)&gt;/gi,'<mark$1>').replace(/&lt;\/mark&gt;/gi,'</mark>');
    s=s.replace(/&lt;span([^&]*)&gt;/gi,'<span$1>').replace(/&lt;\/span&gt;/gi,'</span>');
    s=s.replace(/&lt;font([^&]*)&gt;/gi,'<span$1>').replace(/&lt;\/font&gt;/gi,'</span>');
    return s;
  }
  function renderTable(lines,start){
    const rows=[];let i=start;
    while(i<lines.length&&/^\s*\|.*\|\s*$/.test(lines[i])){rows.push(lines[i]);i++}
    if(rows.length<2)return null;
    const sep=rows[1].trim();
    if(!/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(sep))return null;
    const split=r=>r.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(c=>c.trim());
    const heads=split(rows[0]);
    const aligns=split(rows[1]).map(c=>c.startsWith(':')&&c.endsWith(':')?'center':c.endsWith(':')?'right':c.startsWith(':')?'left':'');
    const body=rows.slice(2).map(r=>split(r));
    let html='<div class="obs-table-wrap"><table class="obs-table"><thead><tr>'+heads.map((h,idx)=>'<th'+(aligns[idx]?' style="text-align:'+aligns[idx]+'"':'')+'>'+inline(h)+'</th>').join('')+'</tr></thead><tbody>';
    html+=body.map(row=>'<tr>'+heads.map((_,idx)=>'<td'+(aligns[idx]?' style="text-align:'+aligns[idx]+'"':'')+'>'+inline(row[idx]||'')+'</td>').join('')+'</tr>').join('');
    html+='</tbody></table></div>';
    return {html,next:i};
  }
  function renderCallout(lines,start){
    const first=lines[start];
    const m=first.match(/^>\s*\[!([A-Za-z0-9_-]+)\]([+-])?\s*(.*)$/);
    if(!m)return null;
    const type=m[1].toLowerCase();
    const title=m[3]||type;
    const body=[];let i=start+1;
    while(i<lines.length&&/^>/.test(lines[i])){body.push(lines[i].replace(/^>\s?/,''));i++}
    return {html:'<aside class="obs-callout obs-callout-'+esc(type)+'"><div class="obs-callout-title"><span>'+esc(type)+'</span>'+inline(title)+'</div><div class="obs-callout-body">'+renderBlocks(body.join('\n'))+'</div></aside>',next:i};
  }
  function renderList(lines,start){
    const ordered=/^\s*\d+\.\s+/.test(lines[start]);
    const tag=ordered?'ol':'ul';
    let html='<'+tag+' class="obs-list">';let i=start;
    while(i<lines.length&&(/^\s*([-*+] |\d+\. )/.test(lines[i]))){
      const line=lines[i];
      const task=line.match(/^\s*[-*+]\s+\[([ xX-])\]\s+(.*)$/);
      if(task){const checked=/[xX]/.test(task[1]);html+='<li class="obs-task"><input type="checkbox" disabled '+(checked?'checked':'')+'> <span>'+inline(task[2])+'</span></li>'}
      else html+='<li>'+inline(line.replace(/^\s*([-*+] |\d+\. )/,''))+'</li>';
      i++;
    }
    html+='</'+tag+'>';
    return {html,next:i};
  }
  function renderBlocks(md){
    let text=String(md||'').replace(/\r\n/g,'\n');
    const codeBlocks=[];
    text=text.replace(/```([\w-]*)\n([\s\S]*?)```/g,function(_,lang,code){const token='@@CODE'+codeBlocks.length+'@@';codeBlocks.push('<pre class="obs-code"><code class="language-'+esc(lang||'text')+'">'+esc(code)+'</code></pre>');return token});
    text=text.replace(/!\[\[([^\]]+)\]\]/g,function(_,ref){return '\n'+mediaHtml(ref,ref)+'\n'});
    text=text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,function(_,alt,url){return '\n'+mediaHtml(alt,url)+'\n'});
    const lines=text.split('\n');
    const out=[];let i=0;const paragraph=[];
    function flush(){if(paragraph.length){out.push('<p>'+inline(paragraph.join('\n')).replace(/\n/g,'<br>')+'</p>');paragraph.length=0}}
    while(i<lines.length){
      const line=lines[i];
      if(!line.trim()){flush();i++;continue}
      if(/^@@CODE\d+@@$/.test(line.trim())){flush();out.push(line.trim());i++;continue}
      if(/^<figure|^<p><a class="obs-attachment"/.test(line.trim())){flush();out.push(line.trim());i++;continue}
      const callout=renderCallout(lines,i);if(callout){flush();out.push(callout.html);i=callout.next;continue}
      const table=renderTable(lines,i);if(table){flush();out.push(table.html);i=table.next;continue}
      if(/^#{1,6}\s+/.test(line)){flush();const level=line.match(/^#+/)[0].length;const text=line.replace(/^#{1,6}\s+/,'').replace(/\s+#+$/,'');const id=slug(text);out.push('<h'+level+' id="'+id+'">'+inline(text)+'</h'+level+'>');i++;continue}
      if(/^\s*([-*+] |\d+\. )/.test(line)){flush();const list=renderList(lines,i);out.push(list.html);i=list.next;continue}
      if(/^>\s+/.test(line)){flush();const quotes=[];while(i<lines.length&&/^>/.test(lines[i])){quotes.push(lines[i].replace(/^>\s?/,''));i++}out.push('<blockquote>'+renderBlocks(quotes.join('\n'))+'</blockquote>');continue}
      if(/^---+$/.test(line.trim())){flush();out.push('<hr>');i++;continue}
      paragraph.push(line);i++;
    }
    flush();
    let html=out.join('\n');
    codeBlocks.forEach((block,idx)=>{html=html.replace('@@CODE'+idx+'@@',block)});
    return html;
  }
  window.ObsidianRenderer={render:renderBlocks};
})();

(function(){
  const colors = 'red|green|blue|yellow|cyan|purple|orange|gray';
  const colorRe = new RegExp('\\[color:(' + colors + ')\\]([\\s\\S]*?)\\[/color\\]', 'gi');
  const bgRe = new RegExp('\\[bg:(' + colors + ')\\]([\\s\\S]*?)\\[/bg\\]', 'gi');

  function cleanColor(value){
    value = String(value || '').trim();
    if(/^#[0-9a-f]{3,8}$/i.test(value)) return value;
    if(/^(red|green|blue|yellow|cyan|purple|orange|gray|white|black)$/i.test(value)) return value.toLowerCase();
    if(/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(\s*,\s*(0|1|0?\.\d+))?\s*\)$/i.test(value)) return value;
    return '';
  }

  function styleFromEscapedSpan(styleText){
    const styles = [];
    const colorMatch = styleText.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
    const bgMatch = styleText.match(/(?:^|;)\s*(?:background|background-color)\s*:\s*([^;]+)/i);
    if(colorMatch){
      const color = cleanColor(colorMatch[1]);
      if(color) styles.push('color:' + color);
    }
    if(bgMatch){
      const bg = cleanColor(bgMatch[1]);
      if(bg) styles.push('background-color:' + bg, 'padding:2px 6px', 'border-radius:7px');
    }
    return styles.join(';');
  }

  function convertObsidianHtml(html){
    html = html.replace(/&lt;font\s+color=["']([^"']+)["']\s*&gt;([\s\S]*?)&lt;\s*\/font\s*&gt;/gi, function(_, color, text){
      const safeColor = cleanColor(color);
      return safeColor ? '<span class="md-inline-style" style="color:' + safeColor + '">' + text + '</span>' : text;
    });

    html = html.replace(/&lt;span\s+style=["']([^"']+)["']\s*&gt;([\s\S]*?)&lt;\s*\/span\s*&gt;/gi, function(_, styleText, text){
      const style = styleFromEscapedSpan(styleText);
      return style ? '<span class="md-inline-style" style="' + style + '">' + text + '</span>' : text;
    });

    html = html.replace(/&lt;mark\s+style=["']([^"']+)["']\s*&gt;([\s\S]*?)&lt;\s*\/mark\s*&gt;/gi, function(_, styleText, text){
      const style = styleFromEscapedSpan(styleText) || 'background-color:rgba(255,230,109,.22);padding:2px 6px;border-radius:7px';
      return '<span class="md-inline-style md-highlight" style="' + style + '">' + text + '</span>';
    });

    html = html.replace(/&lt;mark\s*&gt;([\s\S]*?)&lt;\s*\/mark\s*&gt;/gi, '<span class="md-highlight">$1</span>');
    html = html.replace(/&lt;u\s*&gt;([\s\S]*?)&lt;\s*\/u\s*&gt;/gi, '<u>$1</u>');
    html = html.replace(/&lt;s\s*&gt;([\s\S]*?)&lt;\s*\/s\s*&gt;/gi, '<s>$1</s>');
    return html;
  }

  function convertBasicMarkdown(html){
    html = html.replace(/==([^=]+)==/g, '<span class="md-highlight">$1</span>');
    html = html.replace(/~~([^~]+)~~/g, '<s>$1</s>');
    html = html.replace(/`([^`\n]+)`/g, '<code class="md-inline-code">$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    return html;
  }

  function applyMarkdownColors(){
    document.querySelectorAll('.markdown-body').forEach(function(box){
      if(box.dataset.colorsApplied === 'yes') return;
      let html = box.innerHTML;
      html = html
        .replace(colorRe, function(_, color, text){
          return '<span class="md-color md-color-' + color.toLowerCase() + '">' + text + '</span>';
        })
        .replace(bgRe, function(_, color, text){
          return '<span class="md-bg md-bg-' + color.toLowerCase() + '">' + text + '</span>';
        });
      html = convertObsidianHtml(html);
      html = convertBasicMarkdown(html);
      box.innerHTML = html;
      box.dataset.colorsApplied = 'yes';
    });
  }

  document.addEventListener('DOMContentLoaded', applyMarkdownColors);
  const observer = new MutationObserver(applyMarkdownColors);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
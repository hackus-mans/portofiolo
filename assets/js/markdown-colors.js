(function(){
  const colors = 'red|green|blue|yellow|cyan|purple|orange|gray';
  const colorRe = new RegExp('\\[color:(' + colors + ')\\]([\\s\\S]*?)\\[/color\\]', 'gi');
  const bgRe = new RegExp('\\[bg:(' + colors + ')\\]([\\s\\S]*?)\\[/bg\\]', 'gi');

  function applyMarkdownColors(){
    document.querySelectorAll('.markdown-body').forEach(function(box){
      if(!box.innerHTML.includes('[color:') && !box.innerHTML.includes('[bg:')) return;
      box.innerHTML = box.innerHTML
        .replace(colorRe, function(_, color, text){
          return '<span class="md-color md-color-' + color.toLowerCase() + '">' + text + '</span>';
        })
        .replace(bgRe, function(_, color, text){
          return '<span class="md-bg md-bg-' + color.toLowerCase() + '">' + text + '</span>';
        });
    });
  }

  document.addEventListener('DOMContentLoaded', applyMarkdownColors);
  const observer = new MutationObserver(applyMarkdownColors);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
(function(){
  var root=document.documentElement,$=function(s){return document.querySelector(s)};
  var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  if(saved)root.setAttribute('data-theme',saved);
  var tb=$('#theme');
  function icon(){tb.textContent=root.getAttribute('data-theme')==='dark'?'☀':'◐'}
  icon();
  tb.addEventListener('click',function(){var n=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}icon()});
  var t,toast=$('#toast');
  function flash(m){toast.textContent=m;toast.hidden=false;clearTimeout(t);t=setTimeout(function(){toast.hidden=true},1800)}
  window.addEventListener('keydown',function(e){if(e.metaKey||e.ctrlKey||/INPUT|TEXTAREA/.test(e.target.tagName))return;
    if(e.key==='r')flash('⚡ Hot reloaded in 0.4s');if(e.key==='R')flash('🔄 Hot restarted')});
  $('#copy').addEventListener('click',function(){var m=$('#copy').dataset.email;
    (navigator.clipboard?navigator.clipboard.writeText(m):Promise.reject()).then(function(){flash('Email copied')},function(){flash(m)})});
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});els.forEach(function(e){io.observe(e)})}
  else els.forEach(function(e){e.classList.add('in')});
  $('#year').textContent=new Date().getFullYear();
  var tr=$('#track');tr.innerHTML+=tr.innerHTML;
})();

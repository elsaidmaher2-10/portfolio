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

  /* language toggle (EN / AR with RTL) */
  var lb=$('#lang'),lang='en';
  try{lang=localStorage.getItem('lang')||'en'}catch(e){}
  function applyLang(l){
    document.querySelectorAll('[data-ar]').forEach(function(el){
      if(el.dataset.en===undefined)el.dataset.en=el.innerHTML;
      el.innerHTML=l==='ar'?el.getAttribute('data-ar'):el.dataset.en;
    });
    root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    lb.textContent=l==='ar'?'EN':'ع';
    try{localStorage.setItem('lang',l)}catch(e){}
  }
  lb.addEventListener('click',function(){lang=lang==='ar'?'en':'ar';applyLang(lang)});
  if(lang==='ar')applyLang('ar');

  /* CV modal */
  var modal=$('#cvModal'),frame=$('#cvFrame');
function openCV(){frame.src=new URL('Elsaid-Maher-CV.pdf',document.baseURI).href;modal.hidden=false}  function closeCV(){modal.hidden=true;frame.src='about:blank'}
  $('#cvBtn').addEventListener('click',openCV);
  $('#cvClose').addEventListener('click',closeCV);
  modal.addEventListener('click',function(e){if(e.target===modal)closeCV()});
  window.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)closeCV()});

  /* 3D hero objects (three.js) */
  (function(){
    var cv=$('#three');
    if(!cv||!window.THREE||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
    var r;try{r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){return}
    r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100);cam.position.z=9;
    scene.add(new THREE.AmbientLight(0xffffff,.75));
    var dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(3,4,5);scene.add(dl);
    var defs=[
      [new THREE.IcosahedronGeometry(.62,0),0x0d9373,-2.7,2.5],
      [new THREE.TorusGeometry(.5,.18,16,40),0x2563eb,2.8,1.4],
      [new THREE.OctahedronGeometry(.6,0),0xe8590c,-2.9,-1.2],
      [new THREE.BoxGeometry(.8,.8,.8),0x7c3aed,2.6,-2.6],
      [new THREE.TetrahedronGeometry(.55,0),0x14b8a6,0,3.3]
    ];
    var objs=defs.map(function(d,i){
      var m=new THREE.Mesh(d[0],new THREE.MeshStandardMaterial({color:d[1],roughness:.35,metalness:.15}));
      m.position.set(d[2],d[3],i%2?.6:-.4);m.userData={bx:d[2],by:d[3],ph:i*1.3,spin:0,s:1};scene.add(m);return m;
    });
    var ray=new THREE.Raycaster(),mouse=new THREE.Vector2(9,9),hover=null;
    function size(){var w=cv.clientWidth||300,h=cv.clientHeight||300;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    size();window.addEventListener('resize',size);
    function pick(e){
      var b=cv.getBoundingClientRect();
      mouse.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);
      ray.setFromCamera(mouse,cam);
      var h=ray.intersectObjects(objs)[0];hover=h?h.object:null;
      document.body.style.cursor=hover?'pointer':'';
    }
    window.addEventListener('pointermove',pick);
    window.addEventListener('click',function(e){pick(e);if(hover){hover.userData.spin=.35;flash('✨ Flutter!')}});
    var clock=new THREE.Clock();
    (function loop(){
      requestAnimationFrame(loop);
      var t=clock.getElapsedTime();
      objs.forEach(function(o){
        var u=o.userData;
        o.position.y=u.by+Math.sin(t*.9+u.ph)*.18;
        o.rotation.x+=.006+u.spin;o.rotation.y+=.009+u.spin;
        u.spin*=.94;
        var target=o===hover?1.3:1;u.s+=(target-u.s)*.12;o.scale.setScalar(u.s);
      });
      r.render(scene,cam);
    })();
  })();
})();

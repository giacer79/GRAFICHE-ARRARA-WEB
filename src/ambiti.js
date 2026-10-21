const b=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-nav');
const set=o=>{b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'Chiudi il menu':'Apri il menu');nav.classList.toggle('open',o)};
b.addEventListener('click',()=>set(b.getAttribute('aria-expanded')!=='true'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});

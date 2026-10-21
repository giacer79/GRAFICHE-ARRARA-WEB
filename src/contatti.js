const f=document.getElementById('ct-form'),err=document.getElementById('ct-error');
f.addEventListener('submit',e=>{e.preventDefault();
  const bad=[...f.querySelectorAll('[required]')].filter(x=>x.type==='checkbox'?!x.checked:!x.value.trim()||(x.type==='email'&&!/^\S+@\S+\.\S+$/.test(x.value)));
  f.querySelectorAll('.invalid').forEach(x=>x.classList.remove('invalid'));
  if(bad.length){bad.forEach(x=>x.classList.add('invalid'));err.textContent='Controlla i campi evidenziati: nome, email valida, tipo di richiesta, messaggio e consenso sono obbligatori.';err.hidden=false;bad[0].focus();return}
  err.hidden=true;const d=new FormData(f);
  const body=['Nome: '+d.get('nome'),d.get('azienda')?'Azienda/ente: '+d.get('azienda'):'','Email: '+d.get('email'),d.get('tel')?'Telefono: '+d.get('tel'):'','Richiesta: '+d.get('tipo'),'','Messaggio:',d.get('msg')].filter((x,i)=>x!==''||i===5).join('\n');
  location.href='mailto:info@grafichearrara.com?subject='+encodeURIComponent('Richiesta dal sito: '+d.get('tipo'))+'&body='+encodeURIComponent(body);
});

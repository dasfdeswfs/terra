const characters = window.TERRA_CHARACTERS || [];
const grid=document.querySelector('#char-grid'), search=document.querySelector('#search');
let filter='todos';
const fallback='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="230" viewBox="0 0 160 230"><path fill="#2e3937" d="M48 18h64v60H48zM30 84h100v118H30z"/><path fill="#50665e" d="M51 21h58v55H51zM34 88h92v110H34z"/><path fill="#111d1a" d="M64 47h12v10H64zm24 0h12v10H88z"/><path fill="#788a80" d="M75 66h14v5H75z"/></svg>');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const skinUrl=c=>c.skin?'https://mc-heads.net/player/'+encodeURIComponent(c.skin)+'/250':fallback;
function imageError(img){img.onerror=null;img.src=fallback;}
window.imageError=imageError;
function render(){
  const q=search.value.trim().toLocaleLowerCase('pt-BR');
  const visible=characters.map((c,i)=>({...c,index:i})).filter(c=>(filter==='todos'||filter===c.status)&&(c.name.toLowerCase().includes(q)||c.role.toLowerCase().includes(q)));
  grid.innerHTML=visible.length?visible.map(c=>`<button class="char-card" type="button" data-index="${c.index}" aria-label="Detalhes de ${esc(c.name)}"><div class="char-top"><span class="char-role">${esc(c.role)}</span><span class="status ${c.status}"><i></i>${c.status==='vivo'?'VIVO':'MORTO'}</span></div><div class="char-art"><div class="char-art-glow"></div><img loading="lazy" src="${skinUrl(c)}" alt="Skin de ${esc(c.name)}" onerror="imageError(this)"></div><div class="char-bottom"><div><strong>${esc(c.name)}</strong><small>${esc(c.subtitle)}</small></div><span class="char-arrow">↗</span></div></button>`).join(''):'<div class="empty">Nenhum personagem encontrado.</div>';
  grid.querySelectorAll('[data-index]').forEach(b=>b.addEventListener('click',()=>openProfile(characters[Number(b.dataset.index)])));
}
const dialog=document.querySelector('#character-dialog');
function openProfile(c){document.querySelector('#dialog-content').innerHTML=`<div class="dialog-body"><div class="dialog-figure"><img src="${skinUrl(c)}" alt="Skin de ${esc(c.name)}" onerror="imageError(this)"></div><div class="dialog-description"><div class="section-kicker">ARQUIVO DE PERSONAGEM</div><span class="status ${c.status}"><i></i>${c.status==='vivo'?'VIVO':'MORTO'}</span><h2>${esc(c.name)}</h2><div class="dialog-role">${esc(c.role)}</div><p>${esc(c.bio)}</p><div class="dialog-nick">NICK DA SKIN <strong>${c.skin?esc(c.skin):'AGUARDANDO CONFIRMAÇÃO'}</strong></div></div></div>`;dialog.showModal();}
document.querySelector('#dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
search.addEventListener('input',render);
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;render();}));
document.querySelector('#hero-count').textContent=String(characters.length).padStart(2,'0');
render();

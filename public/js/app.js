function $(s, root=document){return root.querySelector(s)}
function $all(s, root=document){return [...root.querySelectorAll(s)]}

async function api(url, options={}){
  let user = null; try{ user = JSON.parse(localStorage.getItem('currentUser')||'null'); }catch{}
  const extra = { 'Content-Type':'application/json' };
  if(user && user._id) extra['x-user-id'] = user._id;
  const res = await fetch(url, { headers: { ...extra, ...(options.headers||{}) }, ...options });
  if (!res.ok) throw new Error((await res.text())||('HTTP '+res.status));
  try { return await res.json(); } catch { return null }
}

function toast(msg){
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const p = document.createElement('div');
  p.className = 'modal-body';
  p.textContent = msg;
  const btn = document.createElement('button');
  btn.className = 'btn primary';
  btn.textContent = 'OK';
  btn.addEventListener('click', ()=> overlay.remove());
  modal.appendChild(p);
  modal.appendChild(btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Reveal animations for elements with .fade-up
document.addEventListener('DOMContentLoaded', () => {
  const els = $all('.fade-up');
  if (!els.length) return;
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('reveal');
          io.unobserve(e.target);
        }
      })
    }, { threshold: 0.1 });
    els.forEach(el=> io.observe(el));
  } else {
    els.forEach(el=> el.classList.add('reveal'));
  }
});

// Global: user dropdown toggle if present
document.addEventListener('click', (e)=>{
  const btn = document.getElementById('userBtn');
  const menu = document.getElementById('userMenu');
  if (!btn || !menu) return;
  if (btn.contains(e.target)){
    e.preventDefault();
    menu.classList.toggle('show');
  } else if(!menu.contains(e.target)){
    menu.classList.remove('show');
  }
});

// Global: auth-aware menu (Login/Register vs Logged-in/Copy ID/Logout)
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('userMenu');
  if(!menu) return;
  let user = null;
  try{ user = JSON.parse(localStorage.getItem('currentUser')||'null'); }catch{}
  if(user && user._id){
    const roleLabel = (user.role || 'volunteer').toUpperCase();
    menu.innerHTML = `
      <div style="padding:8px 10px" class="h2">Signed in as<br><strong>${user.name||user.email||'User'}</strong> <span class="role-badge">${roleLabel}</span></div>
      <a href="#" id="copyUserId">Copy ID</a>
      <a href="#" id="logoutLink">Logout</a>
    `;
    const copyBtn = document.getElementById('copyUserId');
    const logoutLink = document.getElementById('logoutLink');
    copyBtn?.addEventListener('click', (ev)=>{
      ev.preventDefault();
      navigator.clipboard.writeText(user._id).then(()=> toast('User ID copied')).catch(()=> toast('Copy failed'));
    });
    logoutLink?.addEventListener('click', (ev)=>{
      ev.preventDefault();
      localStorage.removeItem('currentUser');
      toast('Logged out');
      location.href = '/index.html';
    });
  }
});

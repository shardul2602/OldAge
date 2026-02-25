function $(s, root=document){return root.querySelector(s)}
function $all(s, root=document){return [...root.querySelectorAll(s)]}

// API helper with auth header and optional home filter
async function api(url, options = {}) {
  const opts = { headers: {}, ...options };
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  console.log('API called:', url, 'User exists:', !!user); // Debug
  
  if (user && user._id) {
    opts.headers['x-user-id'] = user._id;
    
  }
  
  console.log('Final headers being sent:', opts.headers); // Debug
  
  if (opts.body && typeof opts.body === 'string') {
    opts.headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Request failed');
  }
  return await res.json();
}

function toast(msg) {
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
  const adminLink = document.getElementById('adminLink');
  
  console.log('DOM loaded, menu element:', menu); // Debug
  console.log('Admin link element:', adminLink); // Debug
  
  if(!menu) {
    console.error('User menu element not found!');
    return;
  }
  
  let user = null;
  try{ 
    user = JSON.parse(localStorage.getItem('currentUser')||'null'); 
    console.log('User from localStorage:', user); // Debug
  }catch(err){
    console.error('Error parsing user from localStorage:', err);
  }
  
  if(user && user._id){
    console.log('User logged in, proceeding with menu setup'); // Debug
    const roleLabel = (user.role || 'volunteer').toUpperCase();
    // Handle multiple homes
    let homeDisplay = 'Unknown';
    
    console.log('User data:', { role: user.role, homeId: user.homeId, isArray: Array.isArray(user.homeId) }); // Debug
    
    if (user.homeId) {
      if (Array.isArray(user.homeId)) {
        // Show count if homes aren't populated
        homeDisplay = `${user.homeId.length} home(s) assigned`;
        
        // Try to fetch home names for better display
        fetch('/api/homes')
          .then(res => res.json())
          .then(homes => {
            console.log('Fetched homes:', homes.length); // Debug
            const userHomes = homes.filter(h =>user.homeId.some(uh => {
  const id = typeof uh === 'object' ? uh._id : uh;
  return String(id) === String(h._id);
}));
            console.log('User homes matched:', userHomes.length); // Debug
            
            if (userHomes.length > 0) {
              const homeNames = userHomes.map(h => h.name);
              homeDisplay = homeNames.join(', ');
            }
          })
          .catch(err => {
            console.error('Failed to fetch homes:', err);
          }); // Log errors
          
      } else if (typeof user.homeId === 'object' && user.homeId.name) {
        homeDisplay = user.homeId.name;
      } else if (typeof user.homeId === 'string') {
        homeDisplay = user.homeId;
      }
    }
    menu.innerHTML = `
      <div style="padding:8px 10px" class="h2">Signed in as<br><strong>${user.name||user.email||'User'}</strong> <span class="role-badge">${roleLabel}</span><br><small>Home(s): ${homeDisplay}</small></div>
      <a href="#" id="copyUserId">Copy ID</a>
      <a href="#" id="logoutLink">Logout</a>
    `;
    
    // Show admin link only to admins
    if (adminLink && user.role === 'admin') {
      adminLink.style.display = 'block';
    }
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
  // Hide Admin Dashboard link for volunteers
  if(adminLink){
    if(!user || user.role !== 'admin'){
      adminLink.style.display = 'none';
    } else {
      adminLink.style.display = '';
    }
  }
});

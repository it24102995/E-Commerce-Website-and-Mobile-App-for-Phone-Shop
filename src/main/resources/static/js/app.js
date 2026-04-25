/* ════════════════════════════════════════════════
   app.js – MobileShop Frontend Logic
   ════════════════════════════════════════════════ */

const API_BASE = '/api';

/* ── Auth helpers ─────────────────────────────── */
function getUser()        { try { return JSON.parse(localStorage.getItem('ms_user')); } catch { return null; } }
function saveUser(u)      { localStorage.setItem('ms_user', JSON.stringify(u)); }
function logout() {
    localStorage.removeItem('ms_user');
    sessionStorage.removeItem('promoShown');
    showToastGlobal('Logged out', 'success');
    setTimeout(() => window.location.href = '/index.html', 800);
}

/* ── Cart helpers ─────────────────────────────── */
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('ms_cart')) || [];
        // Migrate old 'qty' field to 'quantity'
        let migrated = false;
        cart.forEach(item => { if (item.qty !== undefined && item.quantity === undefined) { item.quantity = item.qty; delete item.qty; migrated = true; } });
        if (migrated) localStorage.setItem('ms_cart', JSON.stringify(cart));
        return cart;
    } catch { return []; }
}
function saveCart(c)       { localStorage.setItem('ms_cart', JSON.stringify(c)); updateCartBadge(); }
function clearCart()       { localStorage.removeItem('ms_cart'); updateCartBadge(); }

async function addToCart(product) {
    try {
        // Send to Backend API so React can see it
        const res = await fetch(`${API_BASE}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: product.name,
                price: product.price,
                image: product.image || product.img, // Sync field names
                quantity: 1
            })
        });

        if (res.ok) {
            showToastGlobal(`${escHtml(product.name)} added to cart`, 'success');
            // Redirect to React Cart
            setTimeout(() => {
                window.location.href = 'shop.html#/cart';
            }, 500);
        } else {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToastGlobal(error.message, 'error');
    }
}

function updateCartBadge() {
    const cart  = getCart();
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll('#cartBadge').forEach(el => { el.textContent = total; el.style.display = total ? 'inline-flex' : 'none'; });
}

/* ── Toast ────────────────────────────────────── */
function showToastGlobal(msg, type = 'default', duration = 3000) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── XSS prevention ───────────────────────────── */
function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ── Password show/hide ───────────────────────── */
function togglePass(inputId, iconEl) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    if (inp.type === 'password') { inp.type = 'text';     iconEl.classList.replace('fa-eye','fa-eye-slash'); }
    else                         { inp.type = 'password'; iconEl.classList.replace('fa-eye-slash','fa-eye'); }
}

/* ── Navbar init ──────────────────────────────── */
function initNavbar() {
    updateCartBadge();
    const user          = getUser();
    const authButtons   = document.getElementById('authButtons');
    const userGreeting  = document.getElementById('userGreeting');
    const adminGreeting = document.getElementById('adminGreeting');

    if (user) {
        // Hide Login/Register buttons
        if (authButtons)  authButtons.style.display  = 'none';
        // Show greeting + logout
        if (userGreeting) {
            userGreeting.style.display = 'inline-flex';
            const greetSpan = userGreeting.querySelector('.greeting-text');
            if (greetSpan) greetSpan.textContent = `Hi, ${user.name || user.username}`;
        }
        // Admin panel greeting
        if (adminGreeting) adminGreeting.textContent = `Hi, ${user.username || user.name}`;
    } else {
        // Not logged in
        if (authButtons)  authButtons.style.display  = 'inline-flex';
        if (userGreeting) userGreeting.style.display  = 'none';
    }
}

function initAdminSidebar() {
    if (!document.body.classList.contains('admin-shell-page')) return;

    const nav = document.querySelector('.navbar');
    const brand = document.querySelector('.navbar .nav-brand');
    if (!nav || !brand) return;

    const storageKey = 'ms_admin_sidebar_collapsed';
    const collapsed = localStorage.getItem(storageKey) === '1';
    document.body.classList.toggle('admin-shell-collapsed', collapsed);

    let toggleBtn = document.querySelector('.sidebar-toggle-btn');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'sidebar-toggle-btn';
        toggleBtn.title = 'Toggle sidebar';
        toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
        brand.insertAdjacentElement('afterend', toggleBtn);
    }

    const syncIcon = () => {
        const isCollapsed = document.body.classList.contains('admin-shell-collapsed');
        toggleBtn.innerHTML = isCollapsed
            ? '<i class="fa-solid fa-angles-right"></i>'
            : '<i class="fa-solid fa-angles-left"></i>';
    };

    syncIcon();
    toggleBtn.onclick = () => {
        const nextState = !document.body.classList.contains('admin-shell-collapsed');
        document.body.classList.toggle('admin-shell-collapsed', nextState);
        localStorage.setItem(storageKey, nextState ? '1' : '0');
        syncIcon();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    initAdminSidebar();
});

/* ── Products ─────────────────────────────────── */
async function loadProducts(query = '', sort = '') {
    const grid = document.getElementById('productGrid');
    if (grid) grid.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</div>';

    try {
        const url = query ? `${API_BASE}/products/search?q=${encodeURIComponent(query)}` : `${API_BASE}/products`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        let products = await res.json();

        // Sort
        if (sort === 'price-asc')       products.sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
        else if (sort === 'name')       products.sort((a, b) => a.name.localeCompare(b.name));

        if (grid) renderProducts(products);
        const rc = document.getElementById('resultCount');
        if (rc) rc.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

        return products; // return so index.html .then() works
    } catch (e) {
        if (grid) grid.innerHTML = '<div class="loading-spinner">Failed to load products.</div>';
        return [];
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    if (!products.length) {
        grid.innerHTML = '<div class="loading-spinner">No products found.</div>';
        return;
    }

    grid.innerHTML = products.map((p, i) => {
        const oos      = p.stock < 1;
        const low      = p.stock > 0 && p.stock <= 5;
        const imgSrc   = p.image || 'https://placehold.co/400x300?text=No+Image';
        const disc     = Number(p.discount) || 0;
        const hasOffer = disc > 0;
        const salePrice = hasOffer ? Math.round(p.price * (1 - disc / 100)) : p.price;
        return `
        <div class="product-card" style="animation-delay:${i * 0.09}s">
            <div class="card-img-wrap">
                <img src="${escHtml(imgSrc)}" alt="${escHtml(p.name)}" loading="lazy" decoding="async" width="400" height="300" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                ${oos ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
                ${hasOffer ? `<div class="offer-badge">-${disc}% OFF</div>` : ''}
                ${p.isNewArrival ? '<div class="new-badge">NEW</div>' : ''}
            </div>
            <div class="card-body">
                <h3>${escHtml(p.name)}</h3>
                <div class="price-wrap">
                    ${hasOffer ? `<span class="price-original">LKR ${Number(p.price).toLocaleString()}</span>` : ''}
                    <span class="price${hasOffer ? ' price-sale' : ''}">LKR ${salePrice.toLocaleString()}</span>
                </div>
                ${renderCardStars(p.id)}
                <div class="stock-text ${low ? 'low' : ''}">${oos ? 'Out of stock' : low ? `Only ${p.stock} left!` : `${p.stock} in stock`}</div>
            </div>
            <div class="card-footer">
                <button class="btn-add" ${oos ? 'disabled' : ''} onclick='handleAddToCart(${JSON.stringify({ ...p, price: salePrice })})'>
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-review" onclick='openReviewModal(${JSON.stringify(p)})' style="width:100%;margin-top:.45rem;padding:.5rem;background:transparent;border:1.5px solid var(--border);border-radius:8px;font-size:.83rem;font-weight:600;color:var(--text-muted);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.35rem;" onmouseover="this.style.borderColor='#f59e0b';this.style.color='#d97706'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">
                    <i class="fa-solid fa-star" style="color:#f59e0b"></i> Reviews
                </button>
            </div>
        </div>`;
    }).join('');
}

async function handleAddToCart(product) {
    await addToCart(product);
}

/* ── Filter (client-side instant search) ────── */
function filterProducts() {
    const q    = (document.getElementById('searchInput')?.value  || '').toLowerCase();
    const sort = document.getElementById('sortSelect')?.value || 'name';
    loadProducts(q, sort);
}

/* ── Login form (Customer) ────────────────────── */
async function handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const msgDiv   = document.getElementById('loginMsg');

    clearMessages();
    if (!email || !password) { showMsg(msgDiv, 'All fields required', 'error'); return; }

    setLoading('loginBtn', true);
    try {
        const res  = await fetch(`${API_BASE}/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (data.success) {
            saveUser(data);
            showToastGlobal('Welcome back!', 'success');
            setTimeout(() => window.location.href = '/home.html', 700);
        } else {
            showMsg(msgDiv, data.message || 'Invalid credentials', 'error');
        }
    } catch { showMsg(msgDiv, 'Server error. Try again.', 'error'); }
    finally  { setLoading('loginBtn', false); }
}

/* ── Login form (Admin) ───────────────────────── */
async function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername')?.value.trim();
    const password = document.getElementById('adminPassword')?.value;
    const msgDiv   = document.getElementById('adminLoginMsg');

    clearMessages();
    if (!username || !password) { showMsg(msgDiv, 'All fields required', 'error'); return; }

    setLoading('adminLoginBtn', true);
    try {
        const res  = await fetch(`${API_BASE}/admin/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) });
        const data = await res.json();
        if (data.success) {
            saveUser(data);
            showToastGlobal('Admin access granted', 'success');
            setTimeout(() => window.location.href = '/admin.html', 700);
        } else {
            showMsg(msgDiv, data.message || 'Invalid admin credentials', 'error');
        }
    } catch { showMsg(msgDiv, 'Server error. Try again.', 'error'); }
    finally  { setLoading('adminLoginBtn', false); }
}

/* ── Register ─────────────────────────────────── */
async function handleRegister(e) {
    e.preventDefault();
    const name     = document.getElementById('regName')?.value.trim();
    const email    = document.getElementById('regEmail')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const confirm  = document.getElementById('regConfirm')?.value;
    const msgDiv   = document.getElementById('regMsg');

    clearMessages();

    let valid = true;
    if (!name || name.length < 2)  { setFieldError('nameError', 'Name must be at least 2 characters'); valid = false; }
    if (!email || !email.includes('@')) { setFieldError('emailError', 'Enter a valid email address'); valid = false; }
    if (!password || password.length < 8) {
        setFieldError('passError', 'Password must be at least 8 characters');
        valid = false;
    } else if (!(/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password))) {
        setFieldError('passError', 'Password must include uppercase, lowercase, and a number');
        valid = false;
    }
    if (password !== confirm)      { setFieldError('confirmError', 'Passwords do not match'); valid = false; }
    if (!valid) return;

    setLoading('registerBtn', true);
    try {
        const res  = await fetch(`${API_BASE}/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password }) });
        const data = await res.json();
        if (data.success) {
            saveUser(data);
            showToastGlobal('Account created!', 'success');
            setTimeout(() => window.location.href = '/home.html', 800);
        } else {
            showMsg(msgDiv, data.message || 'Registration failed', 'error');
        }
    } catch { showMsg(msgDiv, 'Server error. Try again.', 'error'); }
    finally  { setLoading('registerBtn', false); }
}

/* ── Password strength meter ─────────────────── */
function checkPasswordStrength(val, displayId) {
    const el = document.getElementById(displayId);
    if (!el) return;
    let strength = 0;
    if (val.length >= 8)            strength++;
    if (val.length >= 10)           strength++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
    if (/\d/.test(val))             strength++;
    if (/[^A-Za-z0-9]/.test(val))  strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'];
    const classes = ['', 'weak', 'fair', 'good', 'strong', 'strong'];
    el.textContent = val ? `Strength: ${labels[strength]}` : '';
    el.className = `password-strength ${classes[strength] || ''}`;
}

// Admin-specific functions removed as they are handled in admin.html

/* ── Cart page ───────────────────────────────── */
function renderCart() {
    const cart     = getCart();
    const wrap     = document.getElementById('cartItems');
    const emptyDiv = document.getElementById('emptyCart');
    const summary  = document.getElementById('cartSummary');
    if (!wrap) return;

    if (!cart.length) {
        wrap.innerHTML    = '';
        if (emptyDiv) emptyDiv.style.display = 'block';
        if (summary)  summary.style.display  = 'none';
        return;
    }
    if (emptyDiv) emptyDiv.style.display = 'none';
    if (summary)  summary.style.display  = 'block';

    wrap.innerHTML = cart.map((item, i) => `
        <div class="cart-item animate-in" style="animation-delay:${i*0.06}s">
            <img class="cart-item-img" src="${escHtml(item.image || 'https://placehold.co/80x80?text=?')}" alt="${escHtml(item.name)}" loading="lazy" decoding="async" width="80" height="80" onerror="this.src='https://placehold.co/80x80?text=?'">
            <div class="cart-item-info">
                <h4>${escHtml(item.name)}</h4>
                <div class="item-price">$${Number(item.price).toFixed(2)} each</div>
                <div class="qty-controls" style="margin-top:.5rem">
                    <button onclick="changeQty(${i}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${i}, 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
            <div class="item-sub">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${i})" title="Remove"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `).join('');

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const setEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    setEl('cartSubtotal',    `$${subtotal.toFixed(2)}`);
    setEl('cartTotal',       `$${subtotal.toFixed(2)}`);
    setEl('cartTotalItems',  cart.reduce((s, i) => s + i.quantity, 0));
    updateCartBadge();
}

function changeQty(idx, delta) {
    const cart = getCart();
    if (!cart[idx]) return;
    cart[idx].quantity += delta;
    if (cart[idx].quantity < 1) { cart.splice(idx, 1); }
    else if (cart[idx].quantity > cart[idx].stock) { showToastGlobal('Max stock reached', 'error'); cart[idx].quantity = cart[idx].stock; }
    saveCart(cart);
    renderCart();
}
function removeFromCart(idx) {
    const cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
    showToastGlobal('Item removed', 'default');
}

/* Legacy payment functions removed in favor of React frontend */

/* ── Admin guard ─────────────────────────────── */
function requireAdmin() {
    const user = getUser();
    if (!user || user.role !== 'ADMIN') {
        document.body.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:1.2rem;font-family:sans-serif;">
                <i class="fa-solid fa-shield-xmark" style="font-size:4rem;color:#ef4444;"></i>
                <h2>Access Denied</h2>
                <p>You must be an admin to view this page.</p>
                <a href="/index.html" style="background:#6c63ff;color:#fff;padding:.7rem 1.8rem;border-radius:10px;font-weight:600;">Go to Login</a>
            </div>`;
        return false;
    }
    return true;
}

/* ── Utilities ───────────────────────────────── */
function clearMessages() {
    document.querySelectorAll('.error-msg, .success-msg, .field-error').forEach(el => { el.textContent = ''; });
    document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
}
function showMsg(el, text, type) {
    if (!el) return;
    el.className = type === 'error' ? 'error-msg' : 'success-msg';
    el.textContent = text;
}
function setFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; }
    // Also mark the input red
    const inputId = id.replace('Error','');
    const inp = document.getElementById('reg' + inputId.charAt(0).toUpperCase() + inputId.slice(1));
    if (inp) inp.classList.add('error');
}
function showFormMsg(text, type) {
    const el = document.getElementById('productFormMsg');
    if (el) { el.className = `form-msg form-msg-${type}`; el.textContent = text; }
}
function clearFormMsg() {
    const el = document.getElementById('productFormMsg');
    if (el) { el.className = ''; el.textContent = ''; }
}
function setLoading(btnId, loading, loadingText = 'Loading…') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) {
        btn.dataset.origText = btn.textContent;
        btn.textContent  = loadingText;
        btn.disabled = true;
    } else {
        btn.textContent  = btn.dataset.origText || btn.textContent;
        btn.disabled = false;
    }
}

/* ════════════════════════════════════════════
   REVIEWS SYSTEM  (localStorage 'ms_reviews')
════════════════════════════════════════════ */
/* Storage structure: { "productId": [ {userId, userName, rating, comment, date} ] } */

function getAllReviews() {
    try { return JSON.parse(localStorage.getItem('ms_reviews')) || {}; } catch { return {}; }
}
function getProductReviews(productId) {
    return getAllReviews()[String(productId)] || [];
}
function saveProductReview(productId, review) {
    const all = getAllReviews();
    const key = String(productId);
    if (!all[key]) all[key] = [];
    const idx = all[key].findIndex(r => r.userId === review.userId);
    if (idx >= 0) all[key][idx] = review; else all[key].push(review);
    localStorage.setItem('ms_reviews', JSON.stringify(all));
}
function deleteProductReview(productId, userId) {
    const all = getAllReviews();
    const key = String(productId);
    if (!all[key]) return;
    all[key] = all[key].filter(r => r.userId !== userId);
    localStorage.setItem('ms_reviews', JSON.stringify(all));
}
function calcAvgRating(productId) {
    const rev = getProductReviews(productId);
    if (!rev.length) return 0;
    return rev.reduce((s, r) => s + r.rating, 0) / rev.length;
}
function renderStarIcons(rating, size = '') {
    const s = size ? `font-size:${size};` : '';
    let h = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i)          h += `<i class="fa-solid fa-star star-filled" style="${s}"></i>`;
        else if (rating >= i-.5) h += `<i class="fa-solid fa-star-half-stroke star-half" style="${s}"></i>`;
        else                      h += `<i class="fa-regular fa-star star-empty" style="${s}"></i>`;
    }
    return h;
}
function renderCardStars(productId) {
    const rev = getProductReviews(productId);
    if (!rev.length) return `<div class="card-stars"><div class="stars-row">${renderStarIcons(0)}</div><span class="review-count">No reviews yet</span></div>`;
    const avg = calcAvgRating(productId);
    return `<div class="card-stars"><div class="stars-row">${renderStarIcons(avg)}</div><span class="review-count">${avg.toFixed(1)} (${rev.length})</span></div>`;
}

/* ── Review Modal ─────────────────────────────────────── */
let _reviewProduct = null;
let _reviewRating  = 0;

function openReviewModal(product) {
    _reviewProduct = product;
    _reviewRating  = 0;
    const modal = document.getElementById('reviewModal');
    if (!modal) return;
    document.getElementById('reviewProductName').textContent = product.name;
    // Reset stars
    document.querySelectorAll('#starInput .star-btn').forEach(s => s.classList.remove('active'));
    document.getElementById('reviewComment').value   = '';
    document.getElementById('reviewRatingHint').style.display = 'none';
    renderReviewsList(product.id);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
function closeReviewModal(e) {
    if (e && e.target !== document.getElementById('reviewModal')) return;
    document.getElementById('reviewModal').style.display = 'none';
    document.body.style.overflow = '';
}
function closeReviewModalDirect() {
    document.getElementById('reviewModal').style.display = 'none';
    document.body.style.overflow = '';
}
function setReviewStar(val) {
    _reviewRating = val;
    document.querySelectorAll('#starInput .star-btn').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.v) <= val);
    });
}
function submitReview() {
    const user = getUser();
    if (!user || !user.userId) {
        showToastGlobal('Please login to leave a review', 'error');
        return;
    }
    if (!_reviewRating) {
        document.getElementById('reviewRatingHint').style.display = 'block';
        return;
    }
    const comment = document.getElementById('reviewComment').value.trim();
    saveProductReview(_reviewProduct.id, {
        userId:   user.userId,
        userName: user.name || user.email || 'Customer',
        rating:   _reviewRating,
        comment:  comment,
        date:     new Date().toISOString()
    });
    showToastGlobal('Review submitted! Thank you ❤️', 'success');
    renderReviewsList(_reviewProduct.id);
    // Reset form
    _reviewRating = 0;
    document.querySelectorAll('#starInput .star-btn').forEach(s => s.classList.remove('active'));
    document.getElementById('reviewComment').value = '';
    // Refresh card stars on product grid
    document.querySelectorAll('.product-card').forEach(card => {
        // Re-render the card stars live without full re-render
        const priceEl = card.querySelector('.price');
        if (priceEl) {
            const existingStars = card.querySelector('.card-stars');
            if (existingStars) {
                const pId = _reviewProduct.id;
                const match = card.querySelector('button.btn-add');
                if (match && match.getAttribute('onclick') && match.getAttribute('onclick').includes(`"id":${pId},`)) {
                    existingStars.outerHTML = renderCardStars(pId);
                }
            }
        }
    });
}
function renderReviewsList(productId) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    const reviews = getProductReviews(productId);
    const user    = getUser();
    if (!reviews.length) {
        container.innerHTML = '<p class="no-reviews"><i class="fa-regular fa-comment"></i> No reviews yet. Be the first!</p>';
        return;
    }
    container.innerHTML = `
        <hr class="reviews-divider">
        <div class="reviews-list-title"><i class="fa-solid fa-comments"></i> Customer Reviews (${reviews.length})</div>
        ${reviews.map((r, idx) => `
        <div class="review-item">
            <div class="review-avatar">${(r.userName||'?')[0].toUpperCase()}</div>
            <div class="review-meta">
                <div class="review-meta-top">
                    <span class="review-author">${escHtml(r.userName||'Customer')}</span>
                    <span class="review-date">${new Date(r.date).toLocaleDateString()}</span>
                    ${(user && (user.userId===r.userId||user.role==='ADMIN')) ?
                      `<button class="btn-del-review" title="Delete" onclick="deleteReview(${productId},'${r.userId}')">
                         <i class="fa-solid fa-trash"></i>
                       </button>` : ''}
                </div>
                <div class="review-stars">${renderStarIcons(r.rating)}</div>
                ${r.comment ? `<p class="review-text">${escHtml(r.comment)}</p>` : ''}
            </div>
        </div>`).join('')}`;
}
function deleteReview(productId, userId) {
    deleteProductReview(productId, userId);
    renderReviewsList(productId);
    showToastGlobal('Review deleted', 'success');
}

// ==========================================
// TECHHAVEN NEPAL - PREMIUM JAVASCRIPT
// Cart Logic, Animations, localStorage
// ==========================================

// --- PRODUCT DATA ---
const products = [
    {
        id: 1,
        name: 'Wireless Earbuds Pro',
        price: 2499,
        desc: 'Premium ANC • 30hr battery • Crystal clear calls',
        image: 'images/product1.jpg',
        category: 'Audio',
        badge: 'Best Seller'
    },
    {
        id: 2,
        name: 'Smart Watch Ultra',
        price: 8999,
        desc: 'AMOLED • Heart rate • GPS • 14-day battery',
        image: 'images/product2.jpg',
        category: 'Wearables',
        badge: 'New'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        price: 3499,
        desc: '360° sound • IPX7 waterproof • 20hr playtime',
        image: 'images/product3.jpg',
        category: 'Audio',
        badge: 'Popular'
    },
    {
        id: 4,
        name: 'Power Bank 20K',
        price: 2999,
        desc: 'Fast charge • USB-C • Slim metal body',
        image: 'images/product4.jpg',
        category: 'Accessories',
        badge: 'Value'
    }
];

// --- CART STATE ---
let cart = [];

// --- INITIALIZATION ---
function loadCart() {
    const saved = localStorage.getItem('techhaven_cart');
    if (saved) cart = JSON.parse(saved);
}

function saveCart() {
    localStorage.setItem('techhaven_cart', JSON.stringify(cart));
}

// --- RENDER PRODUCTS ---
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card" style="animation: fadeInUp 0.6s ease both; animation-delay: ${product.id * 0.1}s">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" 
                     class="product-image" loading="lazy"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22><rect fill=%22%23f4f4f5%22 width=%22400%22 height=%22400%22/><text fill=%22%23a1a1aa%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 font-family=%22sans-serif%22>Image Placeholder</text></svg>';">
                <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-bottom">
                    <span class="product-price">
                        <span class="currency">रू</span>${product.price.toLocaleString()}
                    </span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id}, this)">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `);
}

// --- ADD TO CART ---
function addToCart(productId, btn) {
    if (!btn) return;

    // Add to cart
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartUI();

    // Button animation
    btn.classList.add('added');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✓ Added';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalHTML;
    }, 1500);

    // Show toast
    showToast('Added to cart!');
}

// --- REMOVE FROM CART ---
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCartItems();
    showToast('Item removed');
}

// --- UPDATE QUANTITY ---
function updateQty(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartUI();
    renderCartItems();
}

// --- CART CALCULATIONS ---
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

function getItemCount() {
    return cart.reduce((total, item) => total + item.qty, 0);
}

// --- UPDATE ALL CART UI ---
function updateCartUI() {
    const count = getItemCount();

    // Update cart count badge
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        countEl.textContent = count;
        countEl.classList.add('bump');
        setTimeout(() => countEl.classList.remove('bump'), 300);
    }

    // Update header count
    const headerCount = document.getElementById('cartHeaderCount');
    if (headerCount) {
        headerCount.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    }

    // Update total
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) {
        totalEl.textContent = `रू ${getCartTotal().toLocaleString()}`;
    }

    // Toggle empty state
    const emptyEl = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    if (emptyEl && footerEl) {
        if (cart.length === 0) {
            emptyEl.classList.remove('hidden');
            footerEl.classList.add('hidden');
        } else {
            emptyEl.classList.add('hidden');
            footerEl.classList.remove('hidden');
        }
    }

    renderCartItems();
}

// --- RENDER CART ITEMS ---
function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy"
                 onerror="this.style.background='#f4f4f5'">
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">रू ${item.price.toLocaleString()}</p>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `);
}

// --- TOGGLE CART SIDEBAR ---
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    if (sidebar && overlay) {
        const isActive = sidebar.classList.contains('active');
        if (isActive) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

// --- TOAST NOTIFICATION ---
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// --- SCROLL TO PRODUCTS ---
function scrollToProducts() {
    const section = document.getElementById('products');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- GO TO CHECKOUT ---
function goToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    toggleCart();
    saveCart();
    window.location.href = 'checkout.html';
}

// --- RENDER CHECKOUT ---
function renderCheckout() {
    const summaryEl = document.getElementById('orderSummary');
    const totalEl = document.getElementById('checkoutTotal');
    if (!summaryEl || !totalEl) return;

    if (cart.length === 0) {
        summaryEl.innerHTML = '<p style="text-align:center;color:#a1a1aa;padding:20px;">Your cart is empty</p>';
        totalEl.textContent = 'रू 0';
        return;
    }

    summaryEl.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>
                <span class="summary-item-name">${item.name}</span>
                <span class="summary-item-qty">×${item.qty}</span>
            </span>
            <span>रू ${(item.price * item.qty).toLocaleString()}</span>
        </div>
    `).join('');

    totalEl.textContent = `रू ${getCartTotal().toLocaleString()}`;
}

// --- PLACE ORDER ---
function placeOrder() {
    const name = document.getElementById('custName');
    const email = document.getElementById('custEmail');
    const address = document.getElementById('custAddress');
    let isValid = true;

    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        isValid = false;
    }
    if (!email.value.trim() || !email.value.includes('@')) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
    }
    if (!address.value.trim()) {
        address.closest('.form-group').classList.add('error');
        isValid = false;
    }

    if (!isValid) return;
    if (cart.length === 0) {
        showToast('Cart is empty!');
        return;
    }

    // Show confirmation modal
    const modal = document.getElementById('confirmation');
    if (modal) modal.classList.add('active');

    // Clear cart
    cart = [];
    saveCart();
}

// --- GO HOME ---
function goHome() {
    window.location.href = 'index.html';
}

// --- NAVBAR SCROLL EFFECT ---
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// --- INIT ---
function init() {
    loadCart();

    if (document.getElementById('productsGrid')) renderProducts();
    if (document.getElementById('orderSummary')) renderCheckout();

    updateCartUI();
    handleNavbarScroll();
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar?.classList.contains('active')) toggleCart();
    }
});

// Add fadeInUp animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);
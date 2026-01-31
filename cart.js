// ─── PRODUCT DATA (single source of truth) ───
const PRODUCTS = [
  { id:1, name:"Aura Perfume",     cat:"Fragrance",   price:148, old:185, emoji:"🧴", featured:true  },
  { id:2, name:"Silk Scarf",       cat:"Accessories", price:95,  old:120, emoji:"🧣", featured:true  },
  { id:3, name:"Leather Wallet",   cat:"Accessories", price:72,  old:90,  emoji:"👛", featured:true  },
  { id:4, name:"Cashmere Sweater", cat:"Apparel",     price:220, old:280, emoji:"🧥", featured:false },
  { id:5, name:"Ceramic Candle",   cat:"Home",        price:58,  old:75,  emoji:"🕯️", featured:false },
  { id:6, name:"Gold Bracelet",    cat:"Jewelry",     price:310, old:390, emoji:"✨", featured:false },
  { id:7, name:"Travel Bag",       cat:"Bags",        price:185, old:230, emoji:"🎒", featured:false },
  { id:8, name:"Sunglasses",       cat:"Accessories", price:135, old:170, emoji:"🕶️", featured:false },
];

// ─── CART (localStorage-backed) ───
function getCart() {
  try { return JSON.parse(localStorage.getItem('luxora_cart')) || []; }
  catch(e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('luxora_cart', JSON.stringify(cart));
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  let cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ id: product.id, name: product.name, cat: product.cat, price: product.price, emoji: product.emoji, qty: 1 }); }
  saveCart(cart);
  updateBadge();
  showToast(`${product.name} added to cart ✓`);
}

function removeFromCart(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  updateBadge();
  if (typeof renderCart === 'function') renderCart();
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart(cart);
  updateBadge();
  if (typeof renderCart === 'function') renderCart();
}

function updateBadge() {
  const el = document.getElementById('cartCount');
  if (el) el.textContent = getCart().reduce((s, i) => s + i.qty, 0);
}

// ─── TOAST ───
let _toastTimeout;
function showToast(msg, isWarn) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (isWarn ? ' warn' : '');
  t.classList.add('show');
  clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(() => t.classList.remove('show'), 2600);
}

// ─── RENDER A PRODUCT CARD ───
function renderProductCard(product, container) {
  const div = document.createElement('div');
  div.className = 'product-card fade-in';
  div.innerHTML = `
    <div class="product-img">${product.emoji}</div>
    <div class="product-info">
      <div class="cat">${product.cat}</div>
      <h3>${product.name}</h3>
      <div class="price">$${product.price} <span class="old">$${product.old}</span></div>
      <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
    </div>`;
  container.appendChild(div);
}

// ─── ON DOM READY: update badge ───
document.addEventListener('DOMContentLoaded', () => { updateBadge(); });

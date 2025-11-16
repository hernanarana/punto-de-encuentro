// src/utils/whatsappCart.js
const STORAGE_KEY = "wspCart";

export function getWhatsappCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWhatsappCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addToWhatsappCart(product, qty = 1) {
  const cart = getWhatsappCart();
  const index = cart.findIndex((p) => p.id === product.id);

  if (index >= 0) {
    cart[index].qty += qty;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price || 0,
      qty,
    });
  }

  saveWhatsappCart(cart);
}

export function updateQty(id, qty) {
  const cart = getWhatsappCart().map((item) =>
    item.id === id ? { ...item, qty: Math.max(1, qty) } : item
  );
  saveWhatsappCart(cart);
}

export function removeFromWhatsappCart(id) {
  const cart = getWhatsappCart().filter((item) => item.id !== id);
  saveWhatsappCart(cart);
}

export function clearWhatsappCart() {
  saveWhatsappCart([]);
}

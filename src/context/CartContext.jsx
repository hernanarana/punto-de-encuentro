// src/context/CartContext.jsx
import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const ix = prev.findIndex(i => i.id === product.id);
      if (ix >= 0) {
        const clone = [...prev];
        clone[ix] = { ...clone[ix], qty: clone[ix].qty + qty };
        return clone;
      }
      return [...prev, { id: product.id, title: product.title, price: product.price ?? 0, qty, product }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((a,b)=>a + b.qty, 0), [items]);
  const total = useMemo(() => items.reduce((a,b)=>a + (Number(b.price||0) * b.qty), 0), [items]);

  const value = { items, addItem, removeItem, clear, count, total };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext) ?? {
    items: [], addItem: () => {}, removeItem: () => {}, clear: () => {}, count: 0, total: 0
  };
}

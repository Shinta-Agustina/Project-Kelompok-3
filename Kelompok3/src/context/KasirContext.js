import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  TOPPING_ITEMS,
} from '../data/mockData';

const KasirContext = createContext();

export function KasirProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(null);

  // Active navigation tab: 'Kasir', 'Pesanan Aktif', 'Riwayat Transaksi', 'Laporan'
  const [activeTab, setActiveTab] = useState('Kasir');

  // POS Order builder state
  const [cart, setCart] = useState([
    { ...TOPPING_ITEMS[0], qty: 1 }, // Kerupuk
    { ...TOPPING_ITEMS[1], qty: 1 }, // Makaroni
    { ...TOPPING_ITEMS[2], qty: 1 }, // Sosis
    { ...TOPPING_ITEMS[3], qty: 1 }, // Bakso
    { ...TOPPING_ITEMS[4], qty: 1 }, // Ceker
  ]);
  const [selectedKuah, setSelectedKuah] = useState('Original');
  const [selectedLevel, setSelectedLevel] = useState(3);
  const [selectedMeja, setSelectedMeja] = useState('Meja 2');
  const [catatan, setCatatan] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Orders and history state
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Auth actions
  const login = (username) => {
    setUser({
      name: username || 'Tata',
      role: 'Kasir',
    });
  };

  const logout = () => {
    setUser(null);
    resetCart();
  };

  // Cart actions
  const addToCart = (topping) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === topping.id);
      if (existing) {
        return prev.map((item) =>
          item.id === topping.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...topping, qty: 1 }];
    });
  };

  const updateCartQty = (toppingId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === toppingId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (toppingId) => {
    setCart((prev) => prev.filter((item) => item.id !== toppingId));
  };

  const resetCart = () => {
    setCart([]);
    setSelectedKuah('Original');
    setSelectedLevel(3);
    setCatatan('');
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
  };

  const getTotalItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  };

  // Create new order & transaction
  const checkoutOrder = (paymentMethod, cashAmount = 0) => {
    const total = getTotalPrice();
    const orderNum = `#00${orders.length + 1}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    const itemsSummary = cart
      .map((item) => `${item.qty}x ${item.nama}`)
      .join(', ');

    const newOrder = {
      id: orderNum,
      time: timeStr,
      date: dateStr,
      table: selectedMeja,
      items: itemsSummary,
      total: total,
      status: 'Selesai',
      details: [...cart],
      kuah: selectedKuah,
      pedas: selectedLevel,
      catatan: catatan,
      metode: paymentMethod,
      cashAmount: cashAmount,
      change: Math.max(0, cashAmount - total),
      kasir: user?.name || 'Tata',
    };

    setOrders((prev) => [newOrder, ...prev]);

    const newTrx = {
      id: `#TRX-${Date.now().toString().slice(-4)}`,
      no: orderNum,
      waktu: timeStr,
      date: dateStr,
      meja: selectedMeja,
      item: itemsSummary,
      total: total,
      metode: paymentMethod,
      kasir: user?.name || 'Tata',
      status: 'Lunas',
    };

    setTransactions((prev) => [newTrx, ...prev]);

    resetCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <KasirContext.Provider
      value={{
        user,
        login,
        logout,
        activeTab,
        setActiveTab,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        resetCart,
        getTotalPrice,
        getTotalItemsCount,
        selectedKuah,
        setSelectedKuah,
        selectedLevel,
        setSelectedLevel,
        selectedMeja,
        setSelectedMeja,
        catatan,
        setCatatan,
        activeCategory,
        setActiveCategory,
        orders,
        transactions,
        checkoutOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </KasirContext.Provider>
  );
}

export function useKasir() {
  const context = useContext(KasirContext);
  if (!context) {
    throw new Error('useKasir must be used within a KasirProvider');
  }
  return context;
}

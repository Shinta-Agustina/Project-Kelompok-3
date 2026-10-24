import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';
import {
  TOPPING_CATEGORIES, TOPPING_ITEMS,
  SPICE_LEVELS, BROTH_OPTIONS, TABLE_OPTIONS,
} from '../../data/mockData';
import formatCurrency from '../../utils/formatCurrency';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import ToppingCard from '../../components/ToppingCard';
import PaymentModal from '../../components/PaymentModal';
import ReceiptModal from '../../components/ReceiptModal';
import PesananAktifScreen from './PesananAktifScreen';
import RiwayatTransaksiScreen from './RiwayatTransaksiScreen';
import LaporanScreen from './LaporanScreen';

export default function DashboardKasirScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const {
    activeTab,
    cart, addToCart, updateCartQty, resetCart,
    getTotalPrice, getTotalItemsCount,
    selectedKuah, setSelectedKuah,
    selectedLevel, setSelectedLevel,
    selectedMeja, setSelectedMeja,
    catatan, setCatatan,
    activeCategory, setActiveCategory,
  } = useKasir();

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const filteredToppings = TOPPING_ITEMS.filter(
    (item) => activeCategory === 'Semua' || item.kategori === activeCategory
  );

  const total = getTotalPrice();

  const onCheckoutSuccess = (order) => {
    setPaymentVisible(false);
    setLastOrder(order);
    setReceiptVisible(true);
  };

  const onOpenReceipt = (order) => {
    setLastOrder(order);
    setReceiptVisible(true);
  };

  return (
    <View style={styles.root}>
      {/* Sidebar Desktop/Tablet */}
      {!isMobile && sidebarOpen && <Sidebar isMobile={false} />}

      {/* Sidebar Mobile Drawer */}
      {isMobile && sidebarOpen && (
        <View style={StyleSheet.absoluteFillObject}>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
          />
          <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
        </View>
      )}

      {/* Konten Utama */}
      <View style={styles.mainWrapper}>
        <TopHeader
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          isSidebarOpen={sidebarOpen}
        />

        {/* Routing Tab */}
        {activeTab === 'Pesanan Aktif' && (
          <PesananAktifScreen onOpenDetail={onOpenReceipt} />
        )}
        {activeTab === 'Riwayat Transaksi' && (
          <RiwayatTransaksiScreen onOpenReceipt={onOpenReceipt} />
        )}
        {activeTab === 'Laporan' && <LaporanScreen />}

        {/* Tab Kasir (POS Utama) */}
        {activeTab === 'Kasir' && (
          <View style={[styles.posWrap, !isMobile && !isTablet && styles.posRow]}>
            {/* ─── Kolom Kiri: Katalog ─── */}
            <ScrollView
              style={styles.catalogCol}
              contentContainerStyle={styles.catalogContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Pilih Topping */}
              <Text style={styles.sectionTitle}>Pilih Topping</Text>

              {/* Filter Kategori */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catScroll}
              >
                {TOPPING_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catPill, isActive && styles.catPillActive]}
                      onPress={() => setActiveCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.catText, isActive && styles.catTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Grid Kartu Topping */}
              <View style={styles.toppingGrid}>
                {filteredToppings.map((item) => {
                  const cartItem = cart.find((c) => c.id === item.id);
                  return (
                    <ToppingCard
                      key={item.id}
                      item={item}
                      quantity={cartItem ? cartItem.qty : 0}
                      onAdd={() => addToCart(item)}
                      onRemove={() => updateCartQty(item.id, -1)}
                    />
                  );
                })}
              </View>

              {/* Level Kepedasan & Pilihan Kuah */}
              <View style={styles.customCard}>
                {/* Level Pedas */}
                <Text style={styles.customTitle}>Level Kepedasan</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelsRow}>
                  {SPICE_LEVELS.map((sl) => {
                    const isActive = selectedLevel === sl.level;
                    return (
                      <TouchableOpacity
                        key={sl.level}
                        style={[styles.levelCard, isActive && styles.levelCardActive]}
                        onPress={() => setSelectedLevel(sl.level)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.levelNum}>{sl.level}</Text>
                        <View style={styles.chiliRow}>
                          {sl.chilis === 0
                            ? <Text style={{ fontSize: 12, opacity: 0.3 }}>🌶️</Text>
                            : Array.from({ length: sl.chilis }).map((_, i) => (
                                <Text key={i} style={{ fontSize: 11 }}>🌶️</Text>
                              ))}
                        </View>
                        <Text style={[styles.levelLabel, isActive && styles.levelLabelActive]}>
                          {sl.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Pilihan Kuah */}
                <Text style={[styles.customTitle, { marginTop: 16 }]}>Pilihan Kuah</Text>
                <View style={styles.brothWrap}>
                  {BROTH_OPTIONS.map((b) => {
                    const isActive = selectedKuah === b;
                    return (
                      <TouchableOpacity
                        key={b}
                        style={[styles.brothPill, isActive && styles.brothPillActive]}
                        onPress={() => setSelectedKuah(b)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.brothText, isActive && styles.brothTextActive]}>{b}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* ─── Kolom Kanan: Pesanan Saat Ini ─── */}
            <View style={styles.orderCol}>
              {/* Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderTitle}>Pesanan Saat Ini</Text>
                  <Text style={styles.orderSub}>{getTotalItemsCount()} item dipilih</Text>
                </View>
                <TouchableOpacity style={styles.resetBtn} onPress={resetCart}>
                  <Ionicons name="refresh" size={13} color="#C62828" />
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              </View>

              {/* Tabel Pesanan */}
              <View style={styles.tableHead}>
                <Text style={[styles.th, { width: 28 }]}>No</Text>
                <Text style={[styles.th, { flex: 1 }]}>Item</Text>
                <Text style={[styles.th, { width: 60, textAlign: 'center' }]}>Jml</Text>
                <Text style={[styles.th, { width: 70, textAlign: 'right' }]}>Harga</Text>
              </View>

              <ScrollView style={styles.orderScroll} showsVerticalScrollIndicator={false}>
                {cart.length === 0 ? (
                  <View style={styles.emptyCart}>
                    <Text style={styles.emptyEmoji}>🍜</Text>
                    <Text style={styles.emptyText}>Belum ada topping dipilih</Text>
                    <Text style={styles.emptySub}>Pilih topping dari menu di sebelah kiri</Text>
                  </View>
                ) : (
                  cart.map((item, idx) => (
                    <View key={item.id} style={styles.orderRow}>
                      <Text style={[styles.td, { width: 28, color: '#A69A90' }]}>{idx + 1}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tdName}>{item.nama}</Text>
                        <Text style={styles.tdWeight}>{item.berat}</Text>
                      </View>
                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateCartQty(item.id, -1)}
                        >
                          <Ionicons name="remove" size={11} color="#C62828" />
                        </TouchableOpacity>
                        <Text style={styles.qtyVal}>{item.qty}</Text>
                        <TouchableOpacity
                          style={[styles.qtyBtn, styles.qtyBtnAdd]}
                          onPress={() => updateCartQty(item.id, 1)}
                        >
                          <Ionicons name="add" size={11} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.tdPrice, { width: 70 }]}>
                        {formatCurrency(item.harga * item.qty)}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Settings Bawah */}
              <View style={styles.settingsWrap}>
                {/* Pilih Meja */}
                <Text style={styles.settingLabel}>No. Meja:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mejaRow}>
                  {TABLE_OPTIONS.map((m) => {
                    const isSel = selectedMeja === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[styles.mejaPill, isSel && styles.mejaPillActive]}
                        onPress={() => setSelectedMeja(m)}
                      >
                        <Text style={[styles.mejaText, isSel && styles.mejaTextActive]}>{m}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Ringkasan Rasa */}
                <View style={styles.specRow}>
                  <Text style={styles.specItem}>Kuah: <Text style={styles.specVal}>{selectedKuah}</Text></Text>
                  <Text style={styles.specItem}>
                    Pedas:{' '}
                    {Array.from({ length: Math.max(1, selectedLevel) }).map((_, i) => (
                      <Text key={i} style={{ fontSize: 12 }}>🌶️</Text>
                    ))}
                    <Text style={styles.specVal}> Lvl {selectedLevel}</Text>
                  </Text>
                </View>

                {/* Catatan */}
                <TextInput
                  style={styles.notesInput}
                  placeholder="Catatan (opsional) — contoh: tambah bawang, tanpa sayur"
                  placeholderTextColor="#B0A097"
                  value={catatan}
                  onChangeText={setCatatan}
                />
              </View>

              {/* Tombol Hitung Total */}
              <TouchableOpacity
                style={[styles.checkoutBar, cart.length === 0 && styles.checkoutDim]}
                onPress={() => cart.length > 0 && setPaymentVisible(true)}
                activeOpacity={0.85}
              >
                <View style={styles.checkoutLeft}>
                  <Ionicons name="calculator-outline" size={20} color="#FFF" />
                  <Text style={styles.checkoutText}>Hitung Total</Text>
                </View>
                <Text style={styles.checkoutAmt}>{formatCurrency(total)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Modal Pembayaran & Struk */}
      <PaymentModal
        visible={paymentVisible}
        onClose={() => setPaymentVisible(false)}
        onSuccess={onCheckoutSuccess}
      />
      <ReceiptModal
        visible={receiptVisible}
        order={lastOrder}
        onClose={() => setReceiptVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#F8F5F2' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 998 },
  mainWrapper: { flex: 1, flexDirection: 'column' },
  posWrap: { flex: 1 },
  posRow: { flexDirection: 'row' },
  // Katalog
  catalogCol: { flex: 1 },
  catalogContent: { padding: 18, paddingBottom: 40 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#2C1810', marginBottom: 10 },
  catScroll: { gap: 8, paddingBottom: 12 },
  catPill: {
    paddingVertical: 7, paddingHorizontal: 15,
    borderRadius: 20, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E8DCD4',
  },
  catPillActive: { backgroundColor: '#C62828', borderColor: '#C62828' },
  catText: { fontSize: 12, fontWeight: '700', color: '#7E6E67' },
  catTextActive: { color: '#FFFFFF' },
  toppingGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginBottom: 18 },
  customCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#EFE7E2', elevation: 2,
  },
  customTitle: { fontSize: 13, fontWeight: '800', color: '#2C1810', marginBottom: 10 },
  levelsRow: { gap: 8, paddingBottom: 4 },
  levelCard: {
    paddingVertical: 9, paddingHorizontal: 11,
    borderRadius: 12, backgroundColor: '#FAF5F1',
    borderWidth: 1.5, borderColor: '#EAE1D9',
    alignItems: 'center', minWidth: 82,
  },
  levelCardActive: { backgroundColor: '#FFF4F4', borderColor: '#C62828' },
  levelNum: { fontSize: 15, fontWeight: '900', color: '#2C1810' },
  chiliRow: { flexDirection: 'row', marginVertical: 3, height: 16, alignItems: 'center' },
  levelLabel: { fontSize: 9, fontWeight: '700', color: '#8D7B70', textAlign: 'center' },
  levelLabelActive: { color: '#C62828' },
  brothWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  brothPill: {
    paddingVertical: 8, paddingHorizontal: 15,
    borderRadius: 10, backgroundColor: '#FAF5F1',
    borderWidth: 1.5, borderColor: '#EAE1D9',
  },
  brothPillActive: { backgroundColor: '#C62828', borderColor: '#C62828' },
  brothText: { fontSize: 12, fontWeight: '700', color: '#7E6E67' },
  brothTextActive: { color: '#FFFFFF' },
  // Kolom Kanan
  orderCol: {
    width: 360,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#EDE5DF',
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  orderHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#F2EAE4',
  },
  orderTitle: { fontSize: 15, fontWeight: '800', color: '#2C1810' },
  orderSub: { fontSize: 11, color: '#8D7B70' },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 4, paddingHorizontal: 9,
    borderRadius: 8, backgroundColor: '#FFF0F0',
  },
  resetText: { fontSize: 11, fontWeight: '700', color: '#C62828' },
  tableHead: {
    flexDirection: 'row', paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: '#EDE5DF',
  },
  th: { fontSize: 10, fontWeight: '800', color: '#8D7B70', textTransform: 'uppercase' },
  orderScroll: { flex: 1, minHeight: 160 },
  orderRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8F2EE',
  },
  td: { fontSize: 11, color: '#8D7B70' },
  tdName: { fontSize: 12, fontWeight: '700', color: '#2C1810' },
  tdWeight: { fontSize: 10, color: '#8D7B70' },
  tdPrice: { fontSize: 11, fontWeight: '700', color: '#2C1810', textAlign: 'right' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60, justifyContent: 'center' },
  qtyBtn: {
    width: 19, height: 19, borderRadius: 5,
    backgroundColor: '#FDECEC', justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnAdd: { backgroundColor: '#C62828' },
  qtyVal: { fontSize: 12, fontWeight: 'bold', color: '#2C1810', minWidth: 14, textAlign: 'center' },
  emptyCart: { paddingVertical: 32, alignItems: 'center' },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 13, fontWeight: '700', color: '#4A3028' },
  emptySub: { fontSize: 11, color: '#A69A90', marginTop: 3, textAlign: 'center' },
  // Settings bawah
  settingsWrap: {
    borderTopWidth: 1, borderTopColor: '#EDE5DF',
    paddingTop: 10, marginTop: 6, gap: 8,
  },
  settingLabel: { fontSize: 10, fontWeight: '700', color: '#5C453C' },
  mejaRow: { gap: 5 },
  mejaPill: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 7, backgroundColor: '#F5ECE5' },
  mejaPillActive: { backgroundColor: '#C62828' },
  mejaText: { fontSize: 10, fontWeight: '700', color: '#5C453C' },
  mejaTextActive: { color: '#FFFFFF' },
  specRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#FAF5F1', padding: 7, borderRadius: 7,
  },
  specItem: { fontSize: 10, color: '#8D7B70', fontWeight: '600' },
  specVal: { fontSize: 10, fontWeight: '700', color: '#2C1810' },
  notesInput: {
    backgroundColor: '#FAF5F1', borderWidth: 1, borderColor: '#E8DCD4',
    borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6,
    fontSize: 11, color: '#2C1810',
  },
  // Checkout
  checkoutBar: {
    marginTop: 12, backgroundColor: '#C62828', borderRadius: 11,
    paddingVertical: 13, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 3,
  },
  checkoutDim: { opacity: 0.5 },
  checkoutLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  checkoutText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  checkoutAmt: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
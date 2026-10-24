import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';
import {
  TOPPING_CATEGORIES,
  TOPPING_ITEMS,
  SPICE_LEVELS,
  BROTH_OPTIONS,
  TABLE_OPTIONS,
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
  const isTablet = width >= 768 && width < 1024;

  const {
    activeTab,
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
    user,
  } = useKasir();

  // Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Modal states
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [currentOrderPayload, setCurrentOrderPayload] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);

  // Mobile cart sheet state
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Toggle sidebar via garis burger
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Filter toppings berdasarkan kategori aktif
  const filteredToppings = TOPPING_ITEMS.filter((item) => {
    if (activeCategory === 'Semua') return true;
    return item.kategori === activeCategory;
  });

  const total = getTotalPrice ? getTotalPrice() : 0;
  const totalItemsCount = getTotalItemsCount ? getTotalItemsCount() : 0;

  // Trigger Hitung Total -> Siapkan Data Pesanan & Buka Modal Pembayaran
  const handleOpenPayment = () => {
    if (cart.length === 0) {
      Alert.alert(
        'Keranjang Kosong',
        'Silakan pilih minimal 1 topping seblak terlebih dahulu dari daftar menu!'
      );
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;
    const orderNum = `#00${(orders?.length || 0) + 1}`;

    const payload = {
      orderNo: orderNum,
      tableNo: selectedMeja || 'Meja 2',
      time: timeStr,
      date: dateStr,
      kuah: selectedKuah,
      pedas: selectedLevel,
      catatan: catatan,
      items: cart.map((c) => ({
        name: c.nama,
        qty: c.qty,
        price: c.harga,
        berat: c.berat,
      })),
      total: total,
    };

    setCurrentOrderPayload(payload);
    setPaymentVisible(true);
  };

  // Callback saat pembayaran sukses di PaymentModal
  const handleCheckoutSuccess = (txData) => {
    setPaymentVisible(false);
    setMobileCartOpen(false);
    setLastTransaction(txData);
    setReceiptVisible(true);
  };

  // Callback saat klik tombol Detail dari layar Pesanan Aktif / Riwayat
  const handleOpenReceiptFromHistory = (txData) => {
    setLastTransaction(txData);
    setReceiptVisible(true);
  };

  // Render Panel "Pesanan Saat Ini"
  const renderOrderPanel = () => (
    <View style={styles.orderPanel}>
      {/* Panel Header */}
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderTitle}>Pesanan Saat Ini</Text>
          <Text style={styles.orderSubtitle}>
            {totalItemsCount} item dipilih ({selectedMeja})
          </Text>
        </View>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={resetCart}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={13} color="#C62828" />
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Pilih No. Meja */}
      <View style={styles.mejaSelectBox}>
        <Text style={styles.mejaSelectLabel}>Pilih No. Meja:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mejaPillsRow}
        >
          {TABLE_OPTIONS?.map((meja) => {
            const isSel = selectedMeja === meja;
            return (
              <TouchableOpacity
                key={meja}
                style={[styles.mejaPill, isSel && styles.mejaPillActive]}
                onPress={() => setSelectedMeja(meja)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.mejaPillText,
                    isSel && styles.mejaPillTextActive,
                  ]}
                >
                  {meja}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.thText, { width: 24 }]}>No</Text>
        <Text style={[styles.thText, { flex: 1.6 }]}>Item</Text>
        <Text style={[styles.thText, { width: 75, textAlign: 'center' }]}>
          Jml
        </Text>
        <Text style={[styles.thText, { width: 68, textAlign: 'right' }]}>
          Harga
        </Text>
      </View>

      {/* Order Items Table Body */}
      <ScrollView
        style={styles.orderItemsScroll}
        showsVerticalScrollIndicator={false}
      >
        {cart.length === 0 ? (
          <View style={styles.emptyCartBox}>
            <Text style={styles.emptyCartEmoji}>🍜</Text>
            <Text style={styles.emptyCartTitle}>Belum ada topping dipilih</Text>
            <Text style={styles.emptyCartSub}>
              Pilih topping bebas berapa saja dari katalog menu
            </Text>
          </View>
        ) : (
          cart.map((item, idx) => (
            <View key={item.id} style={styles.orderRow}>
              <Text style={[styles.tdText, { width: 24, color: '#A09088' }]}>
                {idx + 1}
              </Text>

              <View style={{ flex: 1.6 }}>
                <Text style={styles.itemNameText}>{item.nama}</Text>
                {item.berat && (
                  <Text style={styles.itemWeightText}>{item.berat}</Text>
                )}
              </View>

              {/* Tombol Kontrol Qty +/- */}
              <View style={styles.qtyControlRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCartQty(item.id, -1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={12} color="#C62828" />
                </TouchableOpacity>

                <Text style={styles.qtyNumberText}>{item.qty}</Text>

                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyBtnAdd]}
                  onPress={() => updateCartQty(item.id, 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.itemPriceText, { width: 68 }]}>
                {formatCurrency(item.harga * item.qty)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Rincian Kuah & Level Pedas */}
      <View style={styles.specsContainer}>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Kuah</Text>
          <Text style={styles.specValue}>{selectedKuah}</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Level Pedas</Text>
          <View style={styles.specChiliRow}>
            {selectedLevel === 0 ? (
              <Text style={styles.specChiliMuted}>0 Cabai</Text>
            ) : (
              Array.from({ length: selectedLevel }).map((_, i) => (
                <Text key={i} style={{ fontSize: 13 }}>
                  🌶️
                </Text>
              ))
            )}
          </View>
        </View>
      </View>

      {/* Catatan */}
      <View style={styles.notesContainer}>
        <Text style={styles.notesLabel}>Catatan (opsional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Contoh: tambah bawang, tanpa sayur"
          placeholderTextColor="#B0A097"
          value={catatan}
          onChangeText={setCatatan}
        />
      </View>

      {/* Tombol Hitung Total / Pembayaran */}
      <TouchableOpacity
        style={[
          styles.checkoutButton,
          cart.length === 0 && styles.checkoutButtonDisabled,
        ]}
        onPress={handleOpenPayment}
        activeOpacity={0.85}
        disabled={cart.length === 0}
      >
        <View style={styles.checkoutBtnLeft}>
          <Ionicons name="calculator-outline" size={19} color="#FFFFFF" />
          <Text style={styles.checkoutBtnText}>Hitung Total</Text>
        </View>
        <Text style={styles.checkoutBtnAmount}>{formatCurrency(total)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar Desktop/Tablet */}
      {!isMobile && sidebarOpen && <Sidebar isMobile={false} />}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <View style={styles.mobileBackdrop}>
          <TouchableOpacity
            style={styles.backdropTouch}
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
          />
          <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainWrapper}>
        <TopHeader
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen}
        />

        {/* Tab Routing */}
        {activeTab === 'Pesanan Aktif' && (
          <PesananAktifScreen onOpenDetail={handleOpenReceiptFromHistory} />
        )}
        {activeTab === 'Riwayat Transaksi' && (
          <RiwayatTransaksiScreen onOpenReceipt={handleOpenReceiptFromHistory} />
        )}
        {activeTab === 'Laporan' && <LaporanScreen />}

        {/* Tab Utama POS (Kasir) */}
        {activeTab === 'Kasir' && (
          <View style={styles.posContainer}>
            <View
              style={[
                styles.posInner,
                !isMobile && !isTablet && styles.posRowLayout,
              ]}
            >
              {/* Kolom Menu & Katalog Topping */}
              <ScrollView
                style={styles.catalogColumn}
                contentContainerStyle={styles.catalogScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Section Title */}
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Pilih Topping</Text>
                  <Text style={styles.sectionSubHint}>
                    Bisa pilih topping dan jumlahnya bebas berapa saja
                  </Text>
                </View>

                {/* Filter Kategori */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScroll}
                >
                  {TOPPING_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.catPill,
                          isActive && styles.catPillActive,
                        ]}
                        onPress={() => setActiveCategory(cat)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.catPillText,
                            isActive && styles.catPillTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Grid Topping Cards */}
                <View style={styles.toppingsGrid}>
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

                {/* Level Kepedasan */}
                <View style={styles.customSectionBox}>
                  <Text style={styles.customSectionTitle}>
                    Level Kepedasan
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.levelsRow}
                  >
                    {SPICE_LEVELS.map((sl) => {
                      const isSelected = selectedLevel === sl.level;
                      return (
                        <TouchableOpacity
                          key={sl.level}
                          style={[
                            styles.levelCard,
                            isSelected && styles.levelCardActive,
                          ]}
                          onPress={() => setSelectedLevel(sl.level)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.levelNumber,
                              isSelected && styles.levelNumberActive,
                            ]}
                          >
                            {sl.level}
                          </Text>
                          <View style={styles.chiliIconsRow}>
                            {sl.chilis === 0 ? (
                              <Text style={{ fontSize: 13, opacity: 0.35 }}>
                                🌶️
                              </Text>
                            ) : (
                              Array.from({ length: sl.chilis }).map((_, i) => (
                                <Text key={i} style={{ fontSize: 12 }}>
                                  🌶️
                                </Text>
                              ))
                            )}
                          </View>
                          <Text
                            style={[
                              styles.levelLabel,
                              isSelected && styles.levelLabelActive,
                            ]}
                          >
                            {sl.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Pilihan Kuah */}
                <View
                  style={[
                    styles.customSectionBox,
                    { marginTop: 14, marginBottom: 20 },
                  ]}
                >
                  <Text style={styles.customSectionTitle}>Pilihan Kuah</Text>
                  <View style={styles.brothPillsRow}>
                    {BROTH_OPTIONS.map((broth) => {
                      const isSelected = selectedKuah === broth;
                      return (
                        <TouchableOpacity
                          key={broth}
                          style={[
                            styles.brothPill,
                            isSelected && styles.brothPillActive,
                          ]}
                          onPress={() => setSelectedKuah(broth)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.brothPillText,
                              isSelected && styles.brothPillTextActive,
                            ]}
                          >
                            {broth}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              {/* Kolom Kanan (Desktop View): Order Panel */}
              {!isMobile && !isTablet && (
                <View style={styles.orderColumnContainer}>
                  {renderOrderPanel()}
                </View>
              )}
            </View>

            {/* Bottom Bar Keranjang (Tampilan Mobile) */}
            {isMobile && (
              <View style={styles.mobileBottomBar}>
                <View style={styles.mobileCartSummary}>
                  <Text style={styles.mobileCartCount}>
                    {totalItemsCount} Topping ({selectedMeja})
                  </Text>
                  <Text style={styles.mobileCartTotal}>
                    {formatCurrency(total)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.mobileViewCartBtn,
                    cart.length === 0 && { opacity: 0.6 },
                  ]}
                  onPress={() => {
                    if (cart.length > 0) {
                      setMobileCartOpen(true);
                    } else {
                      Alert.alert(
                        'Pilih Topping',
                        'Silakan pilih topping terlebih dahulu!'
                      );
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.mobileViewCartBtnText}>
                    Hitung Total ({totalItemsCount})
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom Sheet Cart Modal (Tampilan Mobile) */}
            {isMobile && (
              <Modal
                visible={mobileCartOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setMobileCartOpen(false)}
              >
                <View style={styles.mobileModalOverlay}>
                  <TouchableOpacity
                    style={styles.mobileModalBackdrop}
                    onPress={() => setMobileCartOpen(false)}
                    activeOpacity={1}
                  />
                  <View style={styles.mobileModalContent}>
                    <View style={styles.mobileSheetHeader}>
                      <View style={styles.sheetHandle} />
                      <TouchableOpacity
                        style={styles.sheetCloseBtn}
                        onPress={() => setMobileCartOpen(false)}
                      >
                        <Ionicons name="close" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>
                    {renderOrderPanel()}
                  </View>
                </View>
              </Modal>
            )}
          </View>
        )}
      </View>

      {/* Modal Pembayaran */}
      <PaymentModal
        visible={paymentVisible}
        onClose={() => setPaymentVisible(false)}
        transactionData={
          currentOrderPayload || {
            orderNo: `#00${(orders?.length || 0) + 1}`,
            tableNo: selectedMeja || 'Meja 2',
            time: '09:45',
            date: '16/10/2025',
            items: cart.map((c) => ({
              name: c.nama,
              qty: c.qty,
              price: c.harga,
              berat: c.berat,
            })),
            total: total,
            kuah: selectedKuah,
            pedas: selectedLevel,
            catatan: catatan,
          }
        }
        onSuccessPayment={handleCheckoutSuccess}
      />

      {/* Modal Struk Pembayaran */}
      <ReceiptModal
        visible={receiptVisible}
        transactionData={lastTransaction}
        onClose={() => setReceiptVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F5F2',
  },
  mobileBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: 'row',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  posContainer: {
    flex: 1,
    position: 'relative',
  },
  posInner: {
    flex: 1,
  },
  posRowLayout: {
    flexDirection: 'row',
  },
  catalogColumn: {
    flex: 1,
  },
  catalogScrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2C1810',
    letterSpacing: 0.2,
  },
  sectionSubHint: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '500',
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  catPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DCD4',
  },
  catPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7E6E67',
  },
  catPillTextActive: {
    color: '#FFFFFF',
  },
  toppingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  customSectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
  customSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 10,
  },
  levelsRow: {
    gap: 10,
    paddingBottom: 4,
  },
  levelCard: {
    width: 72,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#E8DCD4',
    alignItems: 'center',
  },
  levelCardActive: {
    backgroundColor: '#FFF5F5',
    borderColor: '#C62828',
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7E6E67',
  },
  levelNumberActive: {
    color: '#C62828',
  },
  chiliIconsRow: {
    flexDirection: 'row',
    marginVertical: 4,
    minHeight: 18,
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 10,
    color: '#8D7B70',
    fontWeight: '600',
    textAlign: 'center',
  },
  levelLabelActive: {
    color: '#C62828',
  },
  brothPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brothPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#E8DCD4',
  },
  brothPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  brothPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7E6E67',
  },
  brothPillTextActive: {
    color: '#FFFFFF',
  },
  orderColumnContainer: {
    width: 360,
    borderLeftWidth: 1,
    borderLeftColor: '#EFE7E2',
    backgroundColor: '#FFFFFF',
  },
  orderPanel: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2C1810',
  },
  orderSubtitle: {
    fontSize: 11,
    color: '#8D7B70',
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FFF0F0',
  },
  resetBtnText: {
    fontSize: 11,
    color: '#C62828',
    fontWeight: '700',
  },
  mejaSelectBox: {
    marginBottom: 12,
  },
  mejaSelectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5C4A42',
    marginBottom: 6,
  },
  mejaPillsRow: {
    gap: 6,
  },
  mejaPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#E8DCD4',
  },
  mejaPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  mejaPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E6E67',
  },
  mejaPillTextActive: {
    color: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE7E2',
    backgroundColor: '#FAF5F1',
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E6E67',
  },
  orderItemsScroll: {
    flex: 1,
    maxHeight: 280,
    marginVertical: 8,
  },
  emptyCartBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyCartEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  emptyCartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5C4A42',
  },
  emptyCartSub: {
    fontSize: 11,
    color: '#A09088',
    textAlign: 'center',
    marginTop: 2,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFEA',
    paddingHorizontal: 4,
  },
  tdText: {
    fontSize: 12,
  },
  itemNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C1810',
  },
  itemWeightText: {
    fontSize: 10,
    color: '#A09088',
  },
  qtyControlRow: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyBtnAdd: {
    backgroundColor: '#C62828',
  },
  qtyNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2C1810',
  },
  itemPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C62828',
    textAlign: 'right',
  },
  specsContainer: {
    backgroundColor: '#FAF5F1',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginVertical: 8,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 11,
    color: '#7E6E67',
    fontWeight: '600',
  },
  specValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2C1810',
  },
  specChiliRow: {
    flexDirection: 'row',
    gap: 2,
  },
  specChiliMuted: {
    fontSize: 11,
    color: '#A09088',
  },
  notesContainer: {
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 11,
    color: '#7E6E67',
    fontWeight: '600',
    marginBottom: 4,
  },
  notesInput: {
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#E8DCD4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    color: '#2C1810',
  },
  checkoutButton: {
    backgroundColor: '#C62828',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#D6A4A4',
  },
  checkoutBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  checkoutBtnAmount: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  mobileBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFE7E2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mobileCartSummary: {
    flex: 1,
  },
  mobileCartCount: {
    fontSize: 11,
    color: '#7E6E67',
  },
  mobileCartTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#C62828',
  },
  mobileViewCartBtn: {
    backgroundColor: '#C62828',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mobileViewCartBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  mobileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  mobileModalBackdrop: {
    flex: 1,
  },
  mobileModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  mobileSheetHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
  },
  sheetCloseBtn: {
    position: 'absolute',
    right: 14,
    top: 6,
    padding: 4,
  },
}); 
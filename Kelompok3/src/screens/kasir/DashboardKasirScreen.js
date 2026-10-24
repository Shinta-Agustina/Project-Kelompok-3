import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
<<<<<<< HEAD
  TextInput,
  useWindowDimensions,
  Modal,
  Alert,
=======
  useWindowDimensions,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';
import {
  TOPPING_CATEGORIES,
  TOPPING_ITEMS,
  SPICE_LEVELS,
  BROTH_OPTIONS,
<<<<<<< HEAD
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
=======
} from '../../data/mockData';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import ToppingCard from '../../components/ToppingCard';
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa

export default function DashboardKasirScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
<<<<<<< HEAD
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
=======

  const {
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    selectedKuah,
    setSelectedKuah,
    selectedLevel,
    setSelectedLevel,
<<<<<<< HEAD
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

=======
    activeCategory,
    setActiveCategory,
  } = useKasir();

  // Sidebar toggle state (default terbuka di desktop/tablet, tertutup di mobile)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Toggle sidebar via garis burger
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Filter toppings berdasarkan kategori aktif
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  const filteredToppings = TOPPING_ITEMS.filter((item) => {
    if (activeCategory === 'Semua') return true;
    return item.kategori === activeCategory;
  });

<<<<<<< HEAD
  const total = getTotalPrice();
  const totalItemsCount = getTotalItemsCount();

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
    const orderNum = `#00${orders.length + 1}`;

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

  // Render "Pesanan Saat Ini" Order Panel Component
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
          {TABLE_OPTIONS.map((meja) => {
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

              {/* Qty +/- Buttons */}
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

      {/* Specification Summary: Kuah & Level Pedas */}
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

      {/* Catatan (opsional) */}
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

      {/* Big Red Button: Hitung Total -> Buka Pembayaran */}
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
      {/* Sidebar Desktop/Laptop */}
      {!isMobile && sidebarOpen && <Sidebar isMobile={false} />}

      {/* Mobile Drawer Overlay */}
=======
  return (
    <View style={styles.container}>
      {/* Sidebar Kasir: Dikontrol oleh Garis Burger (≡) */}
      {!isMobile && sidebarOpen && (
        <Sidebar isMobile={false} />
      )}

      {/* Mobile Drawer Overlay saat Garis Burger ditekan di layar kecil */}
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
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

<<<<<<< HEAD
      {/* Main Content Area */}
      <View style={styles.mainWrapper}>
        <TopHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
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

        {/* Tab Kasir (Point of Sale Main) */}
        {activeTab === 'Kasir' && (
          <View style={styles.posContainer}>
            {/* Main POS Layout */}
            <View
              style={[
                styles.posInner,
                !isMobile && !isTablet && styles.posRowLayout,
              ]}
            >
              {/* Left / Middle Column: Menu Topping & Kustomisasi */}
              <ScrollView
                style={styles.catalogColumn}
                contentContainerStyle={styles.catalogScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Pilih Topping Title */}
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Pilih Topping</Text>
                  <Text style={styles.sectionSubHint}>
                    Bisa pilih topping dan jumlahnya bebas berapa saja
                  </Text>
                </View>

                {/* 2. Category Filter Pills */}
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

                {/* 3. Grid of Topping Cards */}
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

                {/* 4. Level Kepedasan Section */}
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

                {/* 5. Pilihan Kuah Section */}
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

              {/* Right Column (Laptop/Desktop): Pesanan Saat Ini */}
              {!isMobile && !isTablet && (
                <View style={styles.orderColumnContainer}>
                  {renderOrderPanel()}
                </View>
              )}
            </View>

            {/* Mobile Bottom Bar for Cart */}
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

            {/* Mobile Cart Sheet Modal */}
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

      {/* Payment Modal */}
      <PaymentModal
        visible={paymentVisible}
        onClose={() => setPaymentVisible(false)}
        transactionData={
          currentOrderPayload || {
            orderNo: `#00${orders.length + 1}`,
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

      {/* Receipt Modal (Cetak Struk) */}
      <ReceiptModal
        visible={receiptVisible}
        transactionData={lastTransaction}
        onClose={() => {
          setReceiptVisible(false);
        }}
      />
=======
      {/* Main Content Area: Menu Topping Seblak Prasmanan */}
      <View style={styles.mainWrapper}>
        {/* Top Header dengan Garis Burger */}
        <TopHeader
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen}
        />

        {/* Konten Menu Topping */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Banner Menu */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerInfo}>
              <View style={styles.badgeLabel}>
                <Text style={styles.badgeLabelText}>🌶️ PRASMANAN KASIR</Text>
              </View>
              <Text style={styles.bannerTitle}>Daftar Menu Topping</Text>
              <Text style={styles.bannerSubtitle}>
                Katalog varian topping seblak prasmanan segar beserta harga satuan resmi.
              </Text>
            </View>
            <View style={styles.statsChip}>
              <Text style={styles.statsNumber}>{filteredToppings.length}</Text>
              <Text style={styles.statsLabel}>Topping Tersedia</Text>
            </View>
          </View>

          {/* Filter Tab Kategori */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionHeading}>Pilih Kategori</Text>
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
                      styles.categoryPill,
                      isActive && styles.categoryPillActive,
                    ]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        isActive && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Grid Kartu Menu Topping */}
          <View style={styles.toppingsGrid}>
            {filteredToppings.map((item) => (
              <ToppingCard key={item.id} item={item} />
            ))}
          </View>

          {/* Bagian Kustomisasi: Level Kepedasan & Pilihan Kuah */}
          <View style={styles.customizationsSection}>
            {/* Level Kepedasan */}
            <View style={styles.customBox}>
              <View style={styles.customHeader}>
                <Ionicons name="flame" size={20} color="#C62828" />
                <Text style={styles.customTitle}>Level Kepedasan</Text>
              </View>
              <Text style={styles.customSubtitle}>
                Tersedia 6 level kepedasan khas Seblak Prasmanan:
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
                      <Text style={styles.levelNumber}>{sl.level}</Text>
                      <View style={styles.chiliIconsRow}>
                        {sl.chilis === 0 ? (
                          <Text style={styles.chiliGrey}>🌶️</Text>
                        ) : (
                          Array.from({ length: sl.chilis }).map((_, i) => (
                            <Text key={i} style={styles.chiliRed}>
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
            <View style={[styles.customBox, { marginTop: 16 }]}>
              <View style={styles.customHeader}>
                <Ionicons name="restaurant" size={18} color="#C62828" />
                <Text style={styles.customTitle}>Pilihan Kuah</Text>
              </View>
              <Text style={styles.customSubtitle}>
                Varian kuah rempah pilihan:
              </Text>

              <View style={styles.brothRow}>
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
          </View>
        </ScrollView>
      </View>
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
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
<<<<<<< HEAD
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
    paddingBottom: 50,
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
=======
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    elevation: 2,
    shadowColor: '#3D2922',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  bannerInfo: {
    flex: 1,
    minWidth: 260,
  },
  badgeLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEC',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeLabelText: {
    color: '#C62828',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2C1810',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#8D7B70',
    marginTop: 4,
    lineHeight: 18,
  },
  statsChip: {
    backgroundColor: '#FAF5F1',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DCD4',
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#C62828',
  },
  statsLabel: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '600',
    marginTop: 2,
  },
  filterSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 10,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8DCD4',
  },
  categoryPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
    shadowColor: '#C62828',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7E6E67',
  },
  categoryPillTextActive: {
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    color: '#FFFFFF',
  },
  toppingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
<<<<<<< HEAD
    marginHorizontal: -4,
    marginBottom: 16,
  },
  customSectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    elevation: 1,
    shadowColor: '#4A2A22',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  customSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 10,
  },
  levelsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  levelCard: {
    width: 82,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#EFE7E2',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelCardActive: {
    backgroundColor: '#FDECEC',
    borderColor: '#C62828',
  },
  levelNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#3D2820',
  },
  levelNumberActive: {
    color: '#C62828',
  },
  chiliIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    minHeight: 18,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '600',
=======
    marginHorizontal: -8,
    marginBottom: 24,
  },
  customizationsSection: {
    gap: 16,
  },
  customBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    elevation: 2,
    shadowColor: '#3D2922',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2C1810',
  },
  customSubtitle: {
    fontSize: 12,
    color: '#8D7B70',
    marginTop: 4,
    marginBottom: 14,
  },
  levelsRow: {
    gap: 10,
    paddingBottom: 4,
  },
  levelCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FAF5F1',
    borderWidth: 1.5,
    borderColor: '#EAE1D9',
    alignItems: 'center',
    minWidth: 92,
  },
  levelCardActive: {
    backgroundColor: '#FFF4F4',
    borderColor: '#C62828',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2C1810',
  },
  chiliIconsRow: {
    flexDirection: 'row',
    marginVertical: 4,
    height: 18,
    alignItems: 'center',
  },
  chiliGrey: {
    fontSize: 14,
    opacity: 0.35,
  },
  chiliRed: {
    fontSize: 14,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '700',
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    color: '#8D7B70',
    textAlign: 'center',
  },
  levelLabelActive: {
    color: '#C62828',
<<<<<<< HEAD
    fontWeight: '700',
  },
  brothPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brothPill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#EFE7E2',
=======
  },
  brothRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brothPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FAF5F1',
    borderWidth: 1.5,
    borderColor: '#EAE1D9',
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  },
  brothPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  brothPillText: {
<<<<<<< HEAD
    fontSize: 12,
    fontWeight: '700',
    color: '#6F5C53',
=======
    fontSize: 13,
    fontWeight: '700',
    color: '#7E6E67',
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  },
  brothPillTextActive: {
    color: '#FFFFFF',
  },
<<<<<<< HEAD
  // Order Panel (Right Column)
  orderColumnContainer: {
    width: 360,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#EDE5DF',
  },
  orderPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2C1810',
  },
  orderSubtitle: {
    fontSize: 11,
    color: '#8D7B70',
    marginTop: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C62828',
  },
  mejaSelectBox: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5ECE6',
  },
  mejaSelectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A3028',
    marginBottom: 4,
  },
  mejaPillsRow: {
    gap: 6,
  },
  mejaPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
  mejaPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  mejaPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6F5C53',
  },
  mejaPillTextActive: {
    color: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E5DF',
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8D7B70',
  },
  orderItemsScroll: {
    maxHeight: 220,
    minHeight: 120,
  },
  emptyCartBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyCartEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  emptyCartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6F5C53',
  },
  emptyCartSub: {
    fontSize: 11,
    color: '#A09088',
    marginTop: 2,
    textAlign: 'center',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EFEA',
  },
  tdText: {
    fontSize: 12,
    color: '#3D2820',
  },
  itemNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C1810',
  },
  itemWeightText: {
    fontSize: 10,
    color: '#8D7B70',
  },
  qtyControlRow: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  qtyBtnAdd: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  qtyNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2C1810',
  },
  itemPriceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C62828',
    textAlign: 'right',
  },
  specsContainer: {
    backgroundColor: '#FAF5F1',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    gap: 4,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '600',
  },
  specValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C62828',
  },
  specChiliRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  specChiliMuted: {
    fontSize: 11,
    color: '#8D7B70',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8D7B70',
    marginBottom: 4,
  },
  notesInput: {
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#EFE7E2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#2C1810',
    outlineStyle: 'none',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C62828',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    elevation: 3,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  checkoutBtnAmount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  // Mobile Bottom Bar
  mobileBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDE5DF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  mobileCartSummary: {
    justifyContent: 'center',
  },
  mobileCartCount: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '600',
  },
  mobileCartTotal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#C62828',
  },
  mobileViewCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C62828',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mobileViewCartBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  mobileModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mobileModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  mobileModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  mobileSheetHeader: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    position: 'relative',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD2CA',
    borderRadius: 2,
  },
  sheetCloseBtn: {
    position: 'absolute',
    right: 14,
    top: 6,
    padding: 6,
  },
});
=======
});
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa

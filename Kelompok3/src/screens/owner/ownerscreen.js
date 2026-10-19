```jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import SidebarOwner from '../../components/SidebarOwner';
import TopHeader from '../../components/TopHeader';

export default function DashboardOwnerScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Menyesuaikan sidebar ketika ukuran layar berubah
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Desktop */}
      {!isMobile && sidebarOpen && (
        <SidebarOwner
          activeTab={activeTab}
          setActiveTab={handleChangeTab}
          isMobile={false}
        />
      )}

      {/* Sidebar Mobile */}
      {isMobile && sidebarOpen && (
        <View style={styles.mobileBackdrop}>
          <TouchableOpacity
            style={styles.backdropTouch}
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
            accessibilityLabel="Tutup menu navigasi"
          />

          <SidebarOwner
            activeTab={activeTab}
            setActiveTab={handleChangeTab}
            isMobile={true}
            onClose={() => setSidebarOpen(false)}
          />
        </View>
      )}

      {/* Konten Utama */}
      <View style={styles.mainWrapper}>
        <TopHeader
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen}
          title="Owner Portal - Kedai Seblak"
        />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'dashboard' && <TabDashboard />}
          {activeTab === 'penjualan' && <TabPenjualan />}
          {activeTab === 'stok' && <TabStok />}
          {activeTab === 'menu' && <TabMenuHarga />}
          {activeTab === 'transaksi' && <TabTransaksi />}
          {activeTab === 'keuangan' && <TabKeuangan />}
        </ScrollView>
      </View>
    </View>
  );
}

// ======================================================
// TAB DASHBOARD
// ======================================================

function TabDashboard() {
  return (
    <View>
      <View style={styles.bannerCard}>
        <View style={styles.bannerInfo}>
          <Text style={styles.badgeText}>
            🌶️ DASHBOARD UTAMA
          </Text>

          <Text style={styles.bannerTitle}>
            Ringkasan Kedai Seblak Hari Ini
          </Text>

          <Text style={styles.bannerSubtitle}>
            Pantau omzet, pesanan, stok bahan baku, dan keuntungan kedai.
          </Text>
        </View>
      </View>

      <View style={styles.gridCards}>
        <View
          style={[
            styles.kpiCard,
            { borderLeftColor: '#10B981' },
          ]}
        >
          <Text style={styles.kpiLabel}>Omzet Hari Ini</Text>
          <Text style={styles.kpiValue}>Rp 1.250.000</Text>
          <Text style={[styles.kpiSub, styles.textGreen]}>
            ↑ 12% dari kemarin
          </Text>
        </View>

        <View
          style={[
            styles.kpiCard,
            { borderLeftColor: '#3B82F6' },
          ]}
        >
          <Text style={styles.kpiLabel}>Total Pesanan</Text>
          <Text style={styles.kpiValue}>50 Pesanan</Text>
          <Text style={styles.kpiSub}>
            Rata-rata: Rp 25.000
          </Text>
        </View>

        <View
          style={[
            styles.kpiCard,
            { borderLeftColor: '#EF4444' },
          ]}
        >
          <Text style={styles.kpiLabel}>Stok Kritis</Text>
          <Text
            style={[
              styles.kpiValue,
              { color: '#EF4444' },
            ]}
          >
            3 Bahan
          </Text>
          <Text style={[styles.kpiSub, styles.textRed]}>
            Perlu restock segera
          </Text>
        </View>

        <View
          style={[
            styles.kpiCard,
            { borderLeftColor: '#F59E0B' },
          ]}
        >
          <Text style={styles.kpiLabel}>Estimasi Laba</Text>
          <Text style={styles.kpiValue}>Rp 375.000</Text>
          <Text style={styles.kpiSub}>
            Margin sekitar 30%
          </Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.cardHeader}>
          🌶️ Informasi Kedai
        </Text>

        <View style={styles.listItem}>
          <Text style={styles.listText}>Menu terlaris</Text>
          <Text style={styles.listValue}>Seblak Ceker</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listText}>Level pedas favorit</Text>
          <Text style={styles.listValue}>Level 3</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listText}>Status operasional</Text>
          <Text style={styles.textGreen}>Buka</Text>
        </View>
      </View>
    </View>
  );
}

// ======================================================
// TAB PENJUALAN
// ======================================================

function TabPenjualan() {
  const menuTerlaris = [
    { nama: 'Seblak Original', jumlah: '120 Porsi' },
    { nama: 'Seblak Ceker', jumlah: '95 Porsi' },
    { nama: 'Seblak Seafood', jumlah: '78 Porsi' },
    { nama: 'Seblak Komplit', jumlah: '65 Porsi' },
    { nama: 'Seblak Tulang', jumlah: '42 Porsi' },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>
        📈 Laporan Penjualan
      </Text>

      <View style={styles.cardContainer}>
        <Text style={styles.cardHeader}>
          5 Menu Terlaris Bulan Ini
        </Text>

        {menuTerlaris.map((item, index) => (
          <View style={styles.listItem} key={item.nama}>
            <Text style={styles.listText}>
              {index + 1}. {item.nama}
            </Text>

            <Text style={styles.listValue}>
              {item.jumlah}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.cardHeader}>
          Ringkasan Penjualan
        </Text>

        <View style={styles.financeRow}>
          <Text style={styles.textGray}>
            Total porsi terjual
          </Text>
          <Text style={styles.fontBold}>400 Porsi</Text>
        </View>

        <View style={styles.financeRow}>
          <Text style={styles.textGray}>
            Total omzet
          </Text>
          <Text style={styles.textGreen}>
            Rp 12.500.000
          </Text>
        </View>
      </View>
    </View>
  );
}

// ======================================================
// TAB STOK
// ======================================================

function TabStok() {
  const bahanBaku = [
    {
      nama: 'Kerupuk Seblak',
      sisa: '2 kg',
      status: 'Menipis',
      tipe: 'warning',
    },
    {
      nama: 'Telur Ayam',
      sisa: '5 butir',
      status: 'Kritis',
      tipe: 'critical',
    },
    {
      nama: 'Ceker Ayam',
      sisa: '1 kg',
      status: 'Menipis',
      tipe: 'warning',
    },
    {
      nama: 'Sosis',
      sisa: '4 kg',
      status: 'Aman',
      tipe: 'safe',
    },
    {
      nama: 'Bakso',
      sisa: '3 kg',
      status: 'Aman',
      tipe: 'safe',
    },
    {
      nama: 'Mi Telur',
      sisa: '0,5 kg',
      status: 'Kritis',
      tipe: 'critical',
    },
  ];

  return (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>
          📦 Stok Bahan Baku
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            console.log('Tombol Tambah Bahan ditekan');
          }}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            + Tambah Bahan
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableTh, { flex: 2 }]}>
            Nama Bahan
          </Text>

          <Text style={[styles.tableTh, { flex: 1 }]}>
            Sisa
          </Text>

          <Text style={[styles.tableTh, { flex: 1 }]}>
            Status
          </Text>
        </View>

        {bahanBaku.map((item) => (
          <View style={styles.tableRow} key={item.nama}>
            <Text
              style={[
                styles.tableTd,
                { flex: 2, fontWeight: 'bold' },
              ]}
            >
              {item.nama}
            </Text>

            <Text
              style={[
                styles.tableTd,
                { flex: 1 },
                item.tipe === 'critical' && styles.textRed,
                item.tipe === 'warning' && styles.textAmber,
                item.tipe === 'safe' && styles.textGreen,
              ]}
            >
              {item.sisa}
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  item.tipe === 'critical'
                    ? styles.badgeCritical
                    : item.tipe === 'warning'
                    ? styles.badgeWarning
                    : styles.badgeSafe
                }
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ======================================================
// TAB MENU & HARGA
// ======================================================

function TabMenuHarga() {
  const daftarMenu = [
    {
      nama: 'Seblak Original',
      kategori: 'Seblak',
      harga: 'Rp 12.000',
      status: 'Tersedia',
    },
    {
      nama: 'Seblak Ceker',
      kategori: 'Seblak',
      harga: 'Rp 18.000',
      status: 'Tersedia',
    },
    {
      nama: 'Seblak Seafood',
      kategori: 'Seblak',
      harga: 'Rp 22.000',
      status: 'Tersedia',
    },
    {
      nama: 'Seblak Komplit',
      kategori: 'Seblak',
      harga: 'Rp 25.000',
      status: 'Tersedia',
    },
    {
      nama: 'Es Teh Manis',
      kategori: 'Minuman',
      harga: 'Rp 5.000',
      status: 'Tersedia',
    },
  ];

  return (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>
          🌶️ Kelola Menu & Harga
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            console.log('Tombol Tambah Menu ditekan');
          }}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            + Tambah Menu
          </Text>
        </TouchableOpacity>
      </View>

      {daftarMenu.map((item) => (
        <View style={styles.cardContainer} key={item.nama}>
          <View style={styles.menuHeader}>
            <Text style={styles.cardHeader}>
              {item.nama}
            </Text>

            <Text style={styles.textGreenMT}>
              ● {item.status}
            </Text>
          </View>

          <Text style={styles.textGray}>
            Kategori: {item.kategori}
          </Text>

          <Text style={styles.menuPrice}>
            {item.harga}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ======================================================
// TAB TRANSAKSI
// ======================================================

function TabTransaksi() {
  const transaksi = [
    {
      id: '#SBL-20261019-01',
      pelanggan: 'Pelanggan 1',
      menu: 'Seblak Ceker',
      pembayaran: 'QRIS',
      total: 'Rp 18.000',
    },
    {
      id: '#SBL-20261019-02',
      pelanggan: 'Pelanggan 2',
      menu: 'Seblak Komplit',
      pembayaran: 'Tunai',
      total: 'Rp 25.000',
    },
    {
      id: '#SBL-20261019-03',
      pelanggan: 'Pelanggan 3',
      menu: 'Seblak Original',
      pembayaran: 'Transfer',
      total: 'Rp 12.000',
    },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>
        💳 Riwayat Transaksi
      </Text>

      <View style={styles.cardContainer}>
        {transaksi.map((item) => (
          <View style={styles.transactionItem} key={item.id}>
            <View style={styles.transactionInfo}>
              <Text style={styles.listTextBold}>
                {item.id}
              </Text>

              <Text style={styles.textGray}>
                {item.pelanggan}
              </Text>

              <Text style={styles.textGray}>
                {item.menu}
              </Text>

              <Text style={styles.paymentLabel}>
                Pembayaran: {item.pembayaran}
              </Text>
            </View>

            <Text style={styles.listValue}>
              {item.total}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ======================================================
// TAB KEUANGAN
// ======================================================

function TabKeuangan() {
  return (
    <View>
      <Text style={styles.sectionTitle}>
        💰 Laporan Keuangan & Laba Rugi
      </Text>

      <View style={styles.cardContainer}>
        <Text style={styles.cardHeader}>
          Oktober 2026
        </Text>

        <View style={styles.financeRow}>
          <Text style={styles.textGray}>
            Total Pendapatan Kotor
          </Text>

          <Text style={styles.fontBold}>
            Rp 25.000.000
          </Text>
        </View>

        <View style={styles.financeRow}>
          <Text style={styles.textRed}>
            Biaya Bahan Baku
          </Text>

          <Text style={styles.textRed}>
            - Rp 10.000.000
          </Text>
        </View>

        <View style={styles.financeRow}>
          <Text style={styles.textRed}>
            Biaya Operasional
          </Text>

          <Text style={styles.textRed}>
            - Rp 5.000.000
          </Text>
        </View>

        <View style={[styles.financeRow, styles.borderTop]}>
          <Text style={styles.fontBold}>
            Estimasi Laba Bersih
          </Text>

          <Text style={styles.textGreen}>
            Rp 10.000.000
          </Text>
        </View>

        <Text style={styles.financeNote}>
          Laba bersih dihitung dari pendapatan dikurangi
          biaya bahan baku dan biaya operasional.
        </Text>
      </View>
    </View>
  );
}

// ======================================================
// STYLING
// ======================================================

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
    marginBottom: 20,
  },

  bannerInfo: {
    flexDirection: 'column',
  },

  badgeText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
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
  },

  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    flex: 1,
    minWidth: 220,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    borderLeftWidth: 5,
  },

  kpiLabel: {
    fontSize: 12,
    color: '#8D7B70',
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2C1810',
    marginTop: 6,
  },

  kpiSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },

  textGreen: {
    color: '#10B981',
  },

  textRed: {
    color: '#EF4444',
  },

  textAmber: {
    color: '#D97706',
    fontWeight: 'bold',
  },

  textGray: {
    color: '#8D7B70',
    fontSize: 13,
  },

  textGreenMT: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 14,
    flexShrink: 1,
  },

  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    marginBottom: 16,
  },

  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 12,
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EDE9',
    gap: 10,
  },

  listText: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '600',
    flexShrink: 1,
  },

  listTextBold: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: 'bold',
  },

  listValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D97706',
    flexShrink: 0,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },

  primaryButton: {
    backgroundColor: '#D97706',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F9F6F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  tableTh: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7E6E67',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EDE9',
    gap: 5,
  },

  tableTd: {
    fontSize: 13,
    color: '#2C1810',
  },

  badgeCritical: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: 11,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
    borderRadius: 6,
    overflow: 'hidden',
  },

  badgeWarning: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    fontSize: 11,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
    borderRadius: 6,
    overflow: 'hidden',
  },

  badgeSafe: {
    backgroundColor: '#D1FAE5',
    color: '#047857',
    fontSize: 11,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
    borderRadius: 6,
    overflow: 'hidden',
  },

  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },

  menuPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D97706',
    marginTop: 10,
  },

  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EDE9',
    gap: 12,
  },

  transactionInfo: {
    flex: 1,
    gap: 4,
  },

  paymentLabel: {
    fontSize: 12,
    color: '#7E6E67',
    marginTop: 2,
  },

  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },

  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#EFE7E2',
    marginTop: 6,
    paddingTop: 10,
  },

  fontBold: {
    fontWeight: 'bold',
    color: '#2C1810',
  },

  financeNote: {
    fontSize: 12,
    color: '#8D7B70',
    marginTop: 12,
    lineHeight: 18,
  },
});
```
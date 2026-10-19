
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';

const WARNA = {
  merah: '#C62828',
  merahTua: '#52141D',
  merahMuda: '#FBEAEC',
  latar: '#F8F5F2',
  putih: '#FFFFFF',
  teks: '#2C1810',
  abu: '#8D7B70',
  garis: '#EFE7E2',
  hijau: '#168653',
  kuning: '#F59E0B',
};

export default function DashboardOwnerScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleChangeTab = (tab) => {
    setActiveTab(tab);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isMobile && sidebarOpen && (
        <Sidebar
          role="owner"
          activeTab={activeTab}
          setActiveTab={handleChangeTab}
          isMobile={false}
        />
      )}

      {isMobile && sidebarOpen && (
        <View style={styles.mobileBackdrop}>
          <TouchableOpacity
            style={styles.backdropTouch}
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
            accessibilityLabel="Tutup menu navigasi"
          />

          <Sidebar
            role="owner"
            activeTab={activeTab}
            setActiveTab={handleChangeTab}
            isMobile={true}
            onClose={() => setSidebarOpen(false)}
          />
        </View>
      )}

      <View style={styles.mainWrapper}>
        <TopHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
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
// DASHBOARD UTAMA
// ======================================================

function TabDashboard() {
  const jamPenjualan = [
    { label: '09.00–11.00', jumlah: 52 },
    { label: '11.00–13.00', jumlah: 60 },
    { label: '13.00–15.00', jumlah: 42 },
    { label: '15.00–17.00', jumlah: 38 },
    { label: '17.00–19.00', jumlah: 6 },
  ];

  const dataOmzet = [
    { label: 'Sen 12', nilai: 1100000 },
    { label: 'Sel 13', nilai: 1450000 },
    { label: 'Rab 14', nilai: 1300000 },
    { label: 'Kam 15', nilai: 1605000 },
    { label: 'Jum 16', nilai: 1245000 },
  ];

  const topping = [
    { nama: 'Kerupuk', jumlah: 45 },
    { nama: 'Sosis', jumlah: 38 },
    { nama: 'Bakso', jumlah: 32 },
    { nama: 'Ceker', jumlah: 28 },
    { nama: 'Dimsum', jumlah: 24 },
  ];

  return (
    <View>
      <View style={styles.pageHeading}>
        <View style={styles.headingText}>
          <Text style={styles.welcomeTitle}>
            Selamat Datang, Owner!
          </Text>

          <Text style={styles.subtitle}>
            Ringkasan Penjualan dan Kondisi Stok
          </Text>

          <Text style={styles.dateText}>
            16 Oktober 2026
          </Text>
        </View>

        <View style={styles.notification}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge} />
        </View>
      </View>

      <View style={styles.revenueCard}>
        <View style={styles.revenueTop}>
          <View>
            <Text style={styles.revenueLabel}>
              Omzet Hari Ini
            </Text>

            <Text style={styles.revenueValue}>
              Rp 1.245.000
            </Text>

            <Text style={styles.revenueCaption}>
              Total pendapatan hari ini
            </Text>
          </View>

          <View style={styles.revenueIcon}>
            <Text style={styles.revenueIconText}>Rp</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Porsi Terjual Hari Ini
        </Text>

        <Text style={styles.cardSubtitle}>
          16 Oktober 2026 · 198 porsi
        </Text>

        <View style={styles.chartArea}>
          <View style={styles.yAxis}>
            {[60, 40, 20, 0].map((n) => (
              <Text key={n} style={styles.axisText}>
                {n}
              </Text>
            ))}
          </View>

          <View style={styles.barChart}>
            {jamPenjualan.map((item) => (
              <View key={item.label} style={styles.barGroup}>
                <Text style={styles.barValue}>
                  {item.jumlah}
                </Text>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(item.jumlah / 60) * 100}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.barLabel}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Grafik Omzet</Text>

        <Text style={styles.cardSubtitle}>
          Total Periode: Rp 6.700.000 · 12–16 Okt
        </Text>

        {dataOmzet.map((item) => (
          <View key={item.label} style={styles.revenueBarRow}>
            <Text style={styles.revenueDay}>
              {item.label}
            </Text>

            <View style={styles.revenueBarTrack}>
              <View
                style={[
                  styles.revenueBar,
                  {
                    width: `${(item.nilai / 2000000) * 100}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.revenueBarValue}>
              {(item.nilai / 1000000).toLocaleString('id-ID', {
                maximumFractionDigits: 2,
              })} jt
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Topping Terlaris</Text>

        <Text style={styles.cardSubtitle}>
          Berdasarkan jumlah porsi terjual
        </Text>

        {topping.map((item, index) => (
          <View key={item.nama} style={styles.toppingRow}>
            <View style={styles.rankCircle}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>

            <View style={styles.toppingInfo}>
              <View style={styles.toppingLabelRow}>
                <Text style={styles.toppingName}>
                  {item.nama}
                </Text>

                <Text style={styles.toppingQuantity}>
                  {item.jumlah} porsi
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${(item.jumlah / 45) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningIcon}>⚠️</Text>

        <View style={styles.warningInfo}>
          <Text style={styles.warningTitle}>
            Peringatan Stok
          </Text>

          <Text style={styles.warningText}>
            Stok ceker habis. Segera restok!
          </Text>
        </View>
      </View>
    </View>
  );
}

// ======================================================
// TAB PENJUALAN
// ======================================================

function TabPenjualan() {
  const data = [
    ['Kerupuk', '45 porsi'],
    ['Sosis', '38 porsi'],
    ['Bakso', '32 porsi'],
    ['Ceker', '28 porsi'],
    ['Dimsum', '24 porsi'],
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Laporan Penjualan</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Topping Terlaris</Text>

        {data.map(([nama, jumlah], index) => (
          <View style={styles.listItem} key={nama}>
            <Text style={styles.listText}>
              {index + 1}. {nama}
            </Text>

            <Text style={styles.listValue}>{jumlah}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ringkasan Penjualan</Text>
        <InfoRow label="Omzet hari ini" value="Rp 1.245.000" />
        <InfoRow label="Porsi terjual" value="198 porsi" />
        <InfoRow label="Periode laporan" value="12–16 Oktober" />
      </View>
    </View>
  );
}

// ======================================================
// TAB STOK
// ======================================================

function TabStok() {
  const bahan = [
    { nama: 'Kerupuk', sisa: '2 kg', status: 'Menipis' },
    { nama: 'Sosis', sisa: '4 kg', status: 'Aman' },
    { nama: 'Bakso', sisa: '3 kg', status: 'Aman' },
    { nama: 'Ceker', sisa: '0 kg', status: 'Habis' },
    { nama: 'Telur', sisa: '5 butir', status: 'Menipis' },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Stok Bahan Baku</Text>

      <View style={styles.card}>
        {bahan.map((item) => (
          <View style={styles.stockRow} key={item.nama}>
            <View style={styles.stockInfo}>
              <Text style={styles.listText}>{item.nama}</Text>
              <Text style={styles.cardSubtitle}>{item.sisa}</Text>
            </View>

            <Text
              style={[
                styles.stockStatus,
                item.status === 'Aman' && styles.statusSafe,
                item.status === 'Menipis' && styles.statusWarning,
                item.status === 'Habis' && styles.statusCritical,
              ]}
            >
              {item.status}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <View style={styles.warningInfo}>
          <Text style={styles.warningTitle}>Stok Habis</Text>
          <Text style={styles.warningText}>
            Ceker perlu segera direstok.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ======================================================
// TAB MENU & HARGA
// ======================================================

function TabMenuHarga() {
  const menu = [
    { nama: 'Seblak Original', harga: 'Rp 12.000' },
    { nama: 'Seblak Ceker', harga: 'Rp 18.000' },
    { nama: 'Seblak Seafood', harga: 'Rp 22.000' },
    { nama: 'Seblak Komplit', harga: 'Rp 25.000' },
    { nama: 'Es Teh Manis', harga: 'Rp 5.000' },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Menu & Harga</Text>

      <View style={styles.card}>
        {menu.map((item) => (
          <View style={styles.listItem} key={item.nama}>
            <Text style={styles.listText}>{item.nama}</Text>
            <Text style={styles.listValue}>{item.harga}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ======================================================
// TAB TRANSAKSI
// ======================================================

function TabTransaksi() {
  const transaksi = [
    { id: 'TRX-001', menu: 'Seblak Ceker', total: 'Rp 18.000' },
    { id: 'TRX-002', menu: 'Seblak Komplit', total: 'Rp 25.000' },
    { id: 'TRX-003', menu: 'Seblak Original', total: 'Rp 12.000' },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>

      <View style={styles.card}>
        {transaksi.map((item) => (
          <View style={styles.listItem} key={item.id}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listText}>{item.id}</Text>
              <Text style={styles.cardSubtitle}>{item.menu}</Text>
            </View>

            <Text style={styles.listValue}>{item.total}</Text>
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
      <Text style={styles.sectionTitle}>Laporan Keuangan</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Oktober 2026</Text>

        <InfoRow label="Pendapatan kotor" value="Rp 25.000.000" />
        <InfoRow label="Biaya bahan baku" value="Rp 10.000.000" />
        <InfoRow label="Biaya operasional" value="Rp 5.000.000" />

        <View style={styles.divider} />

        <InfoRow label="Estimasi laba bersih" value="Rp 10.000.000" />
      </View>
    </View>
  );
}

// ======================================================
// KOMPONEN BANTU
// ======================================================

function InfoRow({ label, value }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.listValue}>{value}</Text>
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
    backgroundColor: WARNA.latar,
  },

  mobileBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: 'row',
  },

  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  mainWrapper: {
    flex: 1,
    minWidth: 0,
    height: '100%',
  },

  scrollArea: {
    flex: 1,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 50,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },

  pageHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
    gap: 12,
  },

  headingText: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: WARNA.teks,
  },

  subtitle: {
    fontSize: 14,
    color: WARNA.abu,
    marginTop: 6,
  },

  dateText: {
    fontSize: 12,
    color: WARNA.abu,
    marginTop: 5,
  },

  notification: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: WARNA.putih,
    borderWidth: 1,
    borderColor: WARNA.garis,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationIcon: {
    fontSize: 20,
  },

  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WARNA.merah,
  },

  revenueCard: {
    backgroundColor: WARNA.merahTua,
    borderRadius: 16,
    padding: 24,
    marginBottom: 18,
  },

  revenueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  revenueLabel: {
    color: '#F5DADD',
    fontSize: 14,
    fontWeight: '600',
  },

  revenueValue: {
    color: WARNA.putih,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },

  revenueCaption: {
    color: '#E5C1C5',
    fontSize: 12,
    marginTop: 6,
  },

  revenueIcon: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  revenueIconText: {
    fontSize: 22,
    fontWeight: '900',
    color: WARNA.putih,
  },

  card: {
    backgroundColor: WARNA.putih,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: WARNA.garis,
    marginBottom: 18,
  },

  cardTitle: {
    color: WARNA.teks,
    fontSize: 17,
    fontWeight: '800',
  },

  cardSubtitle: {
    color: WARNA.abu,
    fontSize: 12,
    marginTop: 5,
  },

  chartArea: {
    flexDirection: 'row',
    height: 190,
    marginTop: 22,
  },

  yAxis: {
    height: 135,
    justifyContent: 'space-between',
    paddingRight: 12,
  },

  axisText: {
    fontSize: 11,
    color: WARNA.abu,
  },

  barChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: WARNA.garis,
  },

  barGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingHorizontal: 3,
  },

  barValue: {
    color: WARNA.teks,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
  },

  barTrack: {
    width: '65%',
    height: 125,
    justifyContent: 'flex-end',
    backgroundColor: '#F8F1F1',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },

  bar: {
    width: '100%',
    backgroundColor: WARNA.merah,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  barLabel: {
    color: WARNA.abu,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 8,
    minHeight: 24,
  },

  revenueBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },

  revenueDay: {
    width: 52,
    fontSize: 11,
    color: WARNA.abu,
  },

  revenueBarTrack: {
    flex: 1,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#F5E9EA',
    overflow: 'hidden',
  },

  revenueBar: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: WARNA.merah,
  },

  revenueBarValue: {
    width: 48,
    fontSize: 10,
    textAlign: 'right',
    color: WARNA.teks,
    fontWeight: '600',
  },

  toppingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },

  rankCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: WARNA.merahMuda,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rankText: {
    color: WARNA.merah,
    fontWeight: '800',
  },

  toppingInfo: {
    flex: 1,
  },

  toppingLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  toppingName: {
    color: WARNA.teks,
    fontSize: 14,
    fontWeight: '600',
  },

  toppingQuantity: {
    color: WARNA.abu,
    fontSize: 12,
  },

  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F5E9EA',
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: WARNA.merah,
    borderRadius: 4,
  },

  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 18,
    backgroundColor: '#FFF4D6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DEA1',
    marginBottom: 18,
  },

  warningIcon: {
    fontSize: 23,
  },

  warningInfo: {
    flex: 1,
  },

  warningTitle: {
    color: '#805600',
    fontWeight: '800',
    fontSize: 14,
  },

  warningText: {
    color: '#805600',
    fontSize: 13,
    marginTop: 5,
  },

  sectionTitle: {
    color: WARNA.teks,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 18,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EDE9',
    gap: 12,
  },

  listText: {
    color: WARNA.teks,
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },

  listValue: {
    color: WARNA.merah,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },

  infoLabel: {
    color: WARNA.abu,
    fontSize: 13,
    flexShrink: 1,
  },

  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: WARNA.garis,
    gap: 12,
  },

  stockInfo: {
    flex: 1,
    gap: 5,
  },

  stockStatus: {
    fontSize: 12,
    fontWeight: '800',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },

  statusSafe: {
    color: '#047857',
    backgroundColor: '#D1FAE5',
  },

  statusWarning: {
    color: '#B45309',
    backgroundColor: '#FEF3C7',
  },

  statusCritical: {
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
  },

  divider: {
    height: 1,
    backgroundColor: WARNA.garis,
    marginVertical: 8,
  },
});

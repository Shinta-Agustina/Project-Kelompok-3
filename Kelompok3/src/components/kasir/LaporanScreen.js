import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';
import formatCurrency from '../../utils/formatCurrency';

// Simple bar chart using View widths
function BarChart({ data, maxValue }) {
  return (
    <View style={chart.wrap}>
      {data.map((item, idx) => {
        const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <View key={idx} style={chart.row}>
            <Text style={chart.label} numberOfLines={1}>{item.label}</Text>
            <View style={chart.barBg}>
              <View style={[chart.bar, { width: `${pct}%` }]} />
            </View>
            <Text style={chart.val}>{item.display}</Text>
          </View>
        );
      })}
    </View>
  );
}

const chart = StyleSheet.create({
  wrap: { gap: 10, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { width: 90, fontSize: 11, color: '#4A3028', fontWeight: '600' },
  barBg: { flex: 1, height: 12, backgroundColor: '#F0E8E4', borderRadius: 6, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: '#C62828', borderRadius: 6 },
  val: { width: 70, fontSize: 10, fontWeight: '700', color: '#C62828', textAlign: 'right' },
});

export default function LaporanScreen() {
  const { transactions } = useKasir();

  // Compute totals
  const totalOmzet = transactions.reduce((s, t) => s + (t.total || 0), 0);
  const totalTunai = transactions.filter((t) => t.metode === 'Tunai').reduce((s, t) => s + (t.total || 0), 0);
  const totalQris = transactions.filter((t) => t.metode === 'QRIS').reduce((s, t) => s + (t.total || 0), 0);
  const totalEwallet = transactions.filter((t) => t.metode === 'E-Wallet').reduce((s, t) => s + (t.total || 0), 0);
  const avgTrx = transactions.length > 0 ? totalOmzet / transactions.length : 0;

  // Top toppings by name frequency in item strings
  const toppingCount = {};
  transactions.forEach((t) => {
    const parts = (t.item || '').split(',').map((s) => s.trim());
    parts.forEach((p) => {
      // parse "Nx Name"
      const match = p.match(/^(\d+)x (.+)/);
      if (match) {
        const name = match[2];
        const qty = parseInt(match[1], 10);
        toppingCount[name] = (toppingCount[name] || 0) + qty;
      }
    });
  });
  const topToppings = Object.entries(toppingCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ label: name, value: count, display: `${count}x` }));
  const maxTopping = topToppings[0]?.value || 1;

  // Payment breakdown bar data
  const paymentData = [
    { label: 'Tunai', value: totalTunai, display: formatCurrency(totalTunai) },
    { label: 'QRIS', value: totalQris, display: formatCurrency(totalQris) },
    { label: 'E-Wallet', value: totalEwallet, display: formatCurrency(totalEwallet) },
  ];
  const maxPayment = Math.max(totalTunai, totalQris, totalEwallet, 1);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Laporan Penjualan</Text>
        <Text style={styles.pageSub}>Ringkasan kinerja kasir hari ini</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderTopColor: '#C62828' }]}>
          <Ionicons name="trending-up-outline" size={22} color="#C62828" />
          <Text style={styles.summaryLabel}>Total Omzet</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalOmzet)}</Text>
          <Text style={styles.summarySub}>{transactions.length} transaksi</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: '#2E7D32' }]}>
          <Ionicons name="cash-outline" size={22} color="#2E7D32" />
          <Text style={styles.summaryLabel}>Rata-rata Transaksi</Text>
          <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>{formatCurrency(avgTrx)}</Text>
          <Text style={styles.summarySub}>per transaksi</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: '#1565C0' }]}>
          <Ionicons name="receipt-outline" size={22} color="#1565C0" />
          <Text style={styles.summaryLabel}>Total Transaksi</Text>
          <Text style={[styles.summaryValue, { color: '#1565C0' }]}>{transactions.length}</Text>
          <Text style={styles.summarySub}>transaksi selesai</Text>
        </View>
      </View>

      {/* Metode Pembayaran */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="pie-chart-outline" size={16} color="#C62828" />
          <Text style={styles.sectionTitle}>Breakdown Metode Pembayaran</Text>
        </View>
        <View style={styles.methodCards}>
          {[
            { label: 'Tunai', amount: totalTunai, color: '#2E7D32', icon: 'cash-outline' },
            { label: 'QRIS', amount: totalQris, color: '#1565C0', icon: 'qr-code-outline' },
            { label: 'E-Wallet', amount: totalEwallet, color: '#6A1B9A', icon: 'wallet-outline' },
          ].map((m) => {
            const pct = totalOmzet > 0 ? Math.round((m.amount / totalOmzet) * 100) : 0;
            return (
              <View key={m.label} style={[styles.methodCard, { borderLeftColor: m.color }]}>
                <Ionicons name={m.icon} size={18} color={m.color} />
                <Text style={styles.methodLabel}>{m.label}</Text>
                <Text style={[styles.methodAmount, { color: m.color }]}>{formatCurrency(m.amount)}</Text>
                <Text style={styles.methodPct}>{pct}%</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.cardInner}>
          <BarChart data={paymentData} maxValue={maxPayment} />
        </View>
      </View>

      {/* Top Toppings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="trophy-outline" size={16} color="#C62828" />
          <Text style={styles.sectionTitle}>Topping Terlaris</Text>
        </View>
        <View style={styles.cardInner}>
          {topToppings.length === 0 ? (
            <Text style={{ fontSize: 13, color: '#A69A90', textAlign: 'center', padding: 20 }}>
              Belum ada data topping
            </Text>
          ) : (
            <>
              {topToppings.map((t, idx) => (
                <View key={t.label} style={styles.toppingRow}>
                  <View style={[styles.rankBadge, idx < 3 && { backgroundColor: '#C62828' }]}>
                    <Text style={[styles.rankText, idx < 3 && { color: '#FFFFFF' }]}>#{idx + 1}</Text>
                  </View>
                  <Text style={styles.toppingName} numberOfLines={1}>{t.label}</Text>
                  <View style={styles.toppingBarBg}>
                    <View style={[styles.toppingBar, { width: `${(t.value / maxTopping) * 100}%` }]} />
                  </View>
                  <Text style={styles.toppingQty}>{t.value}x</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>

      {/* Catatan harian */}
      <View style={[styles.section, { backgroundColor: '#FFF8F0', borderColor: '#FFD9A8' }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={16} color="#E65100" />
          <Text style={[styles.sectionTitle, { color: '#E65100' }]}>Catatan</Text>
        </View>
        <Text style={styles.noteText}>
          Laporan ini menampilkan semua transaksi pada sesi aktif. Untuk laporan harian lengkap, ekspor data melalui menu admin.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F5F2' },
  content: { padding: 18, paddingBottom: 40 },
  pageHeader: { marginBottom: 18 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#2C1810' },
  pageSub: { fontSize: 12, color: '#8D7B70', marginTop: 3 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  summaryCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    borderTopWidth: 4, borderWidth: 1, borderColor: '#EDE5DF', gap: 4,
  },
  summaryLabel: { fontSize: 11, color: '#8D7B70', fontWeight: '600', marginTop: 6 },
  summaryValue: { fontSize: 16, fontWeight: '900', color: '#C62828' },
  summarySub: { fontSize: 10, color: '#A69A90' },
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1, borderColor: '#EDE5DF', padding: 16, marginBottom: 14,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#2C1810' },
  cardInner: {
    backgroundColor: '#FAF5F1', borderRadius: 10,
    padding: 14, borderWidth: 1, borderColor: '#EAE1D9',
  },
  methodCards: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  methodCard: {
    flex: 1, backgroundColor: '#FAF7F5',
    borderRadius: 10, padding: 12, borderLeftWidth: 3,
    borderWidth: 1, borderColor: '#EDE5DF', gap: 3,
  },
  methodLabel: { fontSize: 11, fontWeight: '600', color: '#5C453C', marginTop: 4 },
  methodAmount: { fontSize: 13, fontWeight: '800' },
  methodPct: { fontSize: 10, color: '#A69A90' },
  toppingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  rankBadge: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: '#FDECEA', justifyContent: 'center', alignItems: 'center',
  },
  rankText: { fontSize: 10, fontWeight: '800', color: '#C62828' },
  toppingName: { width: 100, fontSize: 12, fontWeight: '700', color: '#2C1810' },
  toppingBarBg: { flex: 1, height: 10, backgroundColor: '#EDE5DF', borderRadius: 5, overflow: 'hidden' },
  toppingBar: { height: '100%', backgroundColor: '#C62828', borderRadius: 5 },
  toppingQty: { width: 30, fontSize: 11, fontWeight: '700', color: '#C62828', textAlign: 'right' },
  noteText: { fontSize: 12, color: '#8D6540', lineHeight: 18 },
});

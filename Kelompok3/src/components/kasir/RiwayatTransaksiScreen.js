import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';
import formatCurrency from '../../utils/formatCurrency';

const METHOD_TABS = ['Semua', 'Tunai', 'Non Tunai'];

const METHOD_COLOR = {
  'Tunai':        { bg: '#E8F5E9', text: '#2E7D32' },
  'QRIS':         { bg: '#E3F2FD', text: '#1565C0' },
  'E-Wallet':     { bg: '#F3E5F5', text: '#6A1B9A' },
};

export default function RiwayatTransaksiScreen({ onOpenReceipt }) {
  const { transactions } = useKasir();
  const [methodTab, setMethodTab] = useState('Semua');

  const filtered = methodTab === 'Semua'
    ? transactions
    : methodTab === 'Tunai'
      ? transactions.filter((t) => t.metode === 'Tunai')
      : transactions.filter((t) => t.metode !== 'Tunai');

  const totalTunai    = transactions.filter((t) => t.metode === 'Tunai').reduce((s, t) => s + (t.total || 0), 0);
  const totalNonTunai = transactions.filter((t) => t.metode !== 'Tunai').reduce((s, t) => s + (t.total || 0), 0);
  const totalAll      = transactions.reduce((s, t) => s + (t.total || 0), 0);

  return (
    <View style={styles.root}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Riwayat Transaksi</Text>
          <Text style={styles.pageSub}>{transactions.length} transaksi tercatat</Text>
        </View>
      </View>

      {/* Metric Cards */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderLeftColor: '#C62828' }]}>
          <Ionicons name="stats-chart-outline" size={18} color="#C62828" />
          <Text style={styles.metricLabel}>Total Transaksi</Text>
          <Text style={styles.metricValue}>{formatCurrency(totalAll)}</Text>
          <Text style={styles.metricCount}>{transactions.length} transaksi</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: '#2E7D32' }]}>
          <Ionicons name="cash-outline" size={18} color="#2E7D32" />
          <Text style={styles.metricLabel}>Tunai</Text>
          <Text style={[styles.metricValue, { color: '#2E7D32' }]}>{formatCurrency(totalTunai)}</Text>
          <Text style={styles.metricCount}>{transactions.filter((t) => t.metode === 'Tunai').length} transaksi</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: '#1565C0' }]}>
          <Ionicons name="phone-portrait-outline" size={18} color="#1565C0" />
          <Text style={styles.metricLabel}>Non Tunai</Text>
          <Text style={[styles.metricValue, { color: '#1565C0' }]}>{formatCurrency(totalNonTunai)}</Text>
          <Text style={styles.metricCount}>{transactions.filter((t) => t.metode !== 'Tunai').length} transaksi</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {METHOD_TABS.map((tab) => {
          const isActive = methodTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setMethodTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Table */}
      <ScrollView style={styles.tableWrap} showsVerticalScrollIndicator={false}>
        <View style={styles.tableHead}>
          <Text style={[styles.th, { width: 36 }]}>No</Text>
          <Text style={[styles.th, { width: 55 }]}>Waktu</Text>
          <Text style={[styles.th, { width: 75 }]}>No. Meja</Text>
          <Text style={[styles.th, { flex: 1 }]}>Item</Text>
          <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>Total</Text>
          <Text style={[styles.th, { width: 90, textAlign: 'center' }]}>Metode</Text>
          <Text style={[styles.th, { width: 70, textAlign: 'center' }]}>Aksi</Text>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧾</Text>
            <Text style={styles.emptyText}>Belum ada transaksi {methodTab !== 'Semua' ? methodTab : ''}</Text>
          </View>
        ) : (
          filtered.map((trx, idx) => {
            const mc = METHOD_COLOR[trx.metode] || { bg: '#F5F5F5', text: '#757575' };
            return (
              <View key={trx.id || idx} style={[styles.tableRow, idx % 2 === 0 && styles.rowAlt]}>
                <Text style={[styles.td, { width: 36, color: '#A69A90' }]}>{idx + 1}</Text>
                <Text style={[styles.td, { width: 55 }]}>{trx.waktu}</Text>
                <Text style={[styles.td, { width: 75, fontWeight: '700', color: '#2C1810' }]}>{trx.meja}</Text>
                <Text style={[styles.td, { flex: 1 }]} numberOfLines={2}>{trx.item}</Text>
                <Text style={[styles.td, { width: 100, textAlign: 'right', fontWeight: '700', color: '#C62828' }]}>
                  {formatCurrency(trx.total)}
                </Text>
                {/* Metode badge */}
                <View style={[styles.methodBadge, { backgroundColor: mc.bg, width: 90 }]}>
                  <Text style={[styles.methodText, { color: mc.text }]}>{trx.metode}</Text>
                </View>
                {/* Detail */}
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => onOpenReceipt && onOpenReceipt(trx)}
                >
                  <Ionicons name="document-text-outline" size={13} color="#C62828" />
                  <Text style={styles.detailBtnText}>Struk</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Menampilkan <Text style={styles.footerBold}>{filtered.length}</Text> dari{' '}
          <Text style={styles.footerBold}>{transactions.length}</Text> transaksi
        </Text>
        <Text style={styles.footerText}>
          Subtotal: <Text style={styles.footerBold}>{formatCurrency(filtered.reduce((s, t) => s + (t.total || 0), 0))}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F5F2', padding: 18 },
  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  pageTitle: { fontSize: 18, fontWeight: '800', color: '#2C1810' },
  pageSub: { fontSize: 12, color: '#8D7B70', marginTop: 2 },
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  metricCard: {
    flex: 1, backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 14,
    borderLeftWidth: 4, borderWidth: 1, borderColor: '#EDE5DF',
    gap: 3,
  },
  metricLabel: { fontSize: 11, color: '#8D7B70', fontWeight: '600', marginTop: 4 },
  metricValue: { fontSize: 15, fontWeight: '900', color: '#C62828' },
  metricCount: { fontSize: 10, color: '#A69A90' },
  tabsRow: { gap: 8, paddingBottom: 14 },
  tab: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8DCD4',
  },
  tabActive: { backgroundColor: '#C62828', borderColor: '#C62828' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#7E6E67' },
  tabTextActive: { color: '#FFFFFF' },
  tableWrap: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EDE5DF' },
  tableHead: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#52141D', paddingVertical: 11, paddingHorizontal: 12,
    borderTopLeftRadius: 13, borderTopRightRadius: 13,
  },
  th: { fontSize: 10, fontWeight: '800', color: '#FFD9D9', textTransform: 'uppercase', letterSpacing: 0.4 },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5EDE8',
  },
  rowAlt: { backgroundColor: '#FDFAF8' },
  td: { fontSize: 12, color: '#4A3028' },
  methodBadge: {
    paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: 8, alignItems: 'center', marginHorizontal: 4,
  },
  methodText: { fontSize: 10, fontWeight: '700' },
  detailBtn: {
    width: 70, flexDirection: 'row', alignItems: 'center', gap: 4,
    justifyContent: 'center', paddingVertical: 5,
    backgroundColor: '#FDECEA', borderRadius: 7,
  },
  detailBtnText: { fontSize: 11, fontWeight: '700', color: '#C62828' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 14, fontWeight: '600', color: '#8D7B70' },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 2, marginTop: 8,
    borderTopWidth: 1, borderTopColor: '#EDE5DF',
  },
  footerText: { fontSize: 11, color: '#8D7B70' },
  footerBold: { fontWeight: '700', color: '#2C1810' },
});

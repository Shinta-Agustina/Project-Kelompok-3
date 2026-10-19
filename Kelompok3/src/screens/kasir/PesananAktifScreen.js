import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';
import formatCurrency from '../../utils/formatCurrency';

const STATUS_COLORS = {
  'Diproses':   { bg: '#FFF3E0', text: '#E65100' },
  'Siap Bayar': { bg: '#E8F5E9', text: '#2E7D32' },
  'Selesai':    { bg: '#EDE7F6', text: '#4527A0' },
};

const STATUS_CYCLE = ['Diproses', 'Siap Bayar', 'Selesai'];

const FILTER_TABS = ['Semua', 'Diproses', 'Siap Bayar', 'Selesai'];

export default function PesananAktifScreen({ onOpenDetail }) {
  const { orders, updateOrderStatus } = useKasir();
  const [filterTab, setFilterTab] = useState('Semua');

  const filtered = filterTab === 'Semua'
    ? orders
    : orders.filter((o) => o.status === filterTab);

  const handleCycleStatus = (order) => {
    const idx = STATUS_CYCLE.indexOf(order.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    updateOrderStatus(order.id, next);
  };

  const totalHariIni = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Pesanan Aktif</Text>
          <Text style={styles.pageSub}>{orders.length} pesanan hari ini</Text>
        </View>
        <View style={styles.totalBadge}>
          <Ionicons name="receipt-outline" size={14} color="#C62828" />
          <Text style={styles.totalBadgeText}>Total: {formatCurrency(totalHariIni)}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {FILTER_TABS.map((tab) => {
          const isActive = filterTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setFilterTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Table */}
      <ScrollView style={styles.tableWrap} showsVerticalScrollIndicator={false}>
        {/* Table Head */}
        <View style={styles.tableHead}>
          <Text style={[styles.th, { width: 40 }]}>No</Text>
          <Text style={[styles.th, { width: 60 }]}>Waktu</Text>
          <Text style={[styles.th, { width: 80 }]}>No. Meja</Text>
          <Text style={[styles.th, { flex: 1 }]}>Item</Text>
          <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>Total</Text>
          <Text style={[styles.th, { width: 100, textAlign: 'center' }]}>Status</Text>
          <Text style={[styles.th, { width: 70, textAlign: 'center' }]}>Aksi</Text>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>Tidak ada pesanan {filterTab !== 'Semua' ? filterTab : ''}</Text>
          </View>
        ) : (
          filtered.map((order, idx) => {
            const sc = STATUS_COLORS[order.status] || { bg: '#F5F5F5', text: '#757575' };
            return (
              <View key={order.id} style={[styles.tableRow, idx % 2 === 0 && styles.rowAlt]}>
                <Text style={[styles.td, { width: 40, color: '#A69A90' }]}>{idx + 1}</Text>
                <Text style={[styles.td, { width: 60 }]}>{order.time}</Text>
                <Text style={[styles.td, { width: 80, fontWeight: '700', color: '#2C1810' }]}>{order.table}</Text>
                <Text style={[styles.td, { flex: 1 }]} numberOfLines={2}>{order.items}</Text>
                <Text style={[styles.td, { width: 100, textAlign: 'right', fontWeight: '700', color: '#C62828' }]}>
                  {formatCurrency(order.total)}
                </Text>
                {/* Status badge – tap to cycle */}
                <TouchableOpacity
                  style={[styles.statusBadge, { backgroundColor: sc.bg, width: 100 }]}
                  onPress={() => handleCycleStatus(order)}
                >
                  <Text style={[styles.statusText, { color: sc.text }]}>{order.status}</Text>
                </TouchableOpacity>
                {/* Detail */}
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => onOpenDetail && onOpenDetail(order)}
                >
                  <Ionicons name="document-text-outline" size={14} color="#C62828" />
                  <Text style={styles.detailBtnText}>Detail</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Footer summary */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Menampilkan <Text style={styles.footerBold}>{filtered.length}</Text> dari{' '}
          <Text style={styles.footerBold}>{orders.length}</Text> pesanan
        </Text>
        <Text style={styles.footerText}>
          Total Pesanan Hari Ini:{' '}
          <Text style={styles.footerBold}>{formatCurrency(totalHariIni)}</Text>
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
  totalBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FDECEA', paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 1, borderColor: '#F8BBBA',
  },
  totalBadgeText: { fontSize: 13, fontWeight: '700', color: '#C62828' },
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
  statusBadge: {
    paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: 8, alignItems: 'center', marginHorizontal: 4,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
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

import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function ReceiptModal({ visible, onClose, transactionData, onPrint }) {
  // Data fallback sesuai desain jika data belum dikirim dari parent
  const orderNumber = transactionData?.orderNo || '#003';
  const tableNo = transactionData?.tableNo || '2';
  const dateStr = transactionData?.date || '16/10/2025';
  const timeStr = transactionData?.time || '09:45';
  const items = transactionData?.items || [
    { name: 'Topping Lengkap', qty: 1, price: 28000 },
    { name: 'Telur', qty: 1, price: 4000 },
  ];
  const paymentMethod = transactionData?.method || 'QRIS';

  // Hitung Total Otomatis
  const totalPrice = transactionData?.total || items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header Close Button */}
          <View style={styles.topBar}>
            <Text style={styles.modalHeaderTitle}>Struk Transaksi</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIconButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Area Struk Fisik (Kertas Struk) */}
          <ScrollView contentContainerStyle={styles.receiptContent} showsVerticalScrollIndicator={false}>
            <View style={styles.paperContainer}>
              {/* Logo / Title Struk */}
              <View style={styles.brandHeader}>
                <MaterialCommunityIcons name="bowl-mix" size={28} color="#222" />
                <Text style={styles.brandTitle}>Seblak Prasmanan</Text>
              </View>

              {/* Garis Putus-putus */}
              <View style={styles.dashedLine} />

              {/* Metadata Transaksi */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>No. Transaksi</Text>
                <Text style={styles.infoValue}>: {orderNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Meja</Text>
                <Text style={styles.infoValue}>: {tableNo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tanggal</Text>
                <Text style={styles.infoValue}>: {dateStr} {timeStr}</Text>
              </View>

              {/* Garis Putus-putus */}
              <View style={styles.dashedLine} />

              {/* Daftar Item Pesanan */}
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={[styles.itemText, { flex: 2 }]}>{item.name}</Text>
                  <Text style={[styles.itemText, { flex: 0.6, textAlign: 'center' }]}>{item.qty}</Text>
                  <Text style={[styles.itemText, { flex: 1.4, textAlign: 'right' }]}>
                    {(item.price * item.qty).toLocaleString('id-ID')}
                  </Text>
                </View>
              ))}

              {/* Garis Putus-putus */}
              <View style={styles.dashedLine} />

              {/* Total & Metode Pembayaran */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{totalPrice.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Metode</Text>
                <Text style={styles.totalValue}>: {paymentMethod}</Text>
              </View>

              {/* Ucapan Terima Kasih */}
              <View style={styles.footerSection}>
                <Text style={styles.thankYouText}>Terima kasih 😊</Text>
                <Text style={styles.subThankYouText}>Selamat menikmati!</Text>
              </View>
            </View>
          </ScrollView>

          {/* Tombol Aksi di Bawah Struk */}
          <View style={styles.actionRow}>
            {onPrint && (
              <TouchableOpacity style={styles.printBtn} onPress={onPrint}>
                <Ionicons name="print-outline" size={18} color="#333" style={{ marginRight: 6 }} />
                <Text style={styles.printBtnText}>Cetak Struk</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  closeIconButton: {
    padding: 4,
  },
  receiptContent: {
    padding: 20,
    alignItems: 'center',
  },
  paperContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    padding: 20,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    width: 95,
    fontSize: 13,
    color: '#555',
  },
  infoValue: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  itemText: {
    fontSize: 13,
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  footerSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  subThankYouText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 10,
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  printBtnText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  doneBtn: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
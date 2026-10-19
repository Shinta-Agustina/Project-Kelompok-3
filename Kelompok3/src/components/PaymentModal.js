import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function PaymentModal({ visible, onClose, transactionData, onSuccessPayment }) {
  // State Metode Pembayaran: 'Tunai' | 'QRIS' | 'E-Wallet'
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [cashInput, setCashInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Ambil data total dari transactionData
  const orderItems = transactionData?.items || [
    { name: 'Topping Lengkap', qty: 1, price: 28000 },
    { name: 'Telur', qty: 1, price: 4000 },
  ];
  const orderNumber = transactionData?.orderNo || '#003';
  const tableNo = transactionData?.tableNo || 'Meja 2';
  const orderTime = transactionData?.time || '09:45';

  // Hitung Total Otomatis
  const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    if (visible) {
      setCashInput(totalPrice.toString());
      setIsSuccess(false);
    }
  }, [visible, totalPrice]);

  // Handler Numpad Tombol Angka
  const handleNumpad = (value) => {
    if (value === 'DEL') {
      setCashInput((prev) => prev.slice(0, -1) || '0');
    } else if (value === '00') {
      if (cashInput !== '0' && cashInput !== '') {
        setCashInput((prev) => prev + '00');
      }
    } else {
      if (cashInput === '0') {
        setCashInput(value);
      } else {
        setCashInput((prev) => prev + value);
      }
    }
  };

  const handlePay = () => {
    setIsSuccess(true);
    if (onSuccessPayment) {
      onSuccessPayment({
        orderNo: orderNumber,
        tableNo,
        time: orderTime,
        items: orderItems,
        total: totalPrice,
        method: paymentMethod,
        cashPaid: parseInt(cashInput, 10) || totalPrice,
      });
    }
  };

  const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'DEL'];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Header bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.headerTitle}>Pembayaran</Text>
          </TouchableOpacity>
          <View style={styles.profileSection}>
            <Ionicons name="person-circle-outline" size={32} color="#333" />
            <View>
              <Text style={styles.profileName}>Siti Aisyah</Text>
              <Text style={styles.profileRole}>Kasir</Text>
            </View>
          </View>
        </View>

        {!isSuccess ? (
          /* TAMPILAN PROSES PEMBAYARAN */
          <View style={styles.contentLayout}>
            {/* Sisi Kiri: Ringkasan Pesanan & Metode Pembayaran */}
            <ScrollView style={styles.leftColumn} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
              
              <View style={styles.rowDetail}>
                <Text style={styles.labelDetail}>No. Pesanan</Text>
                <Text style={styles.valueDetail}>{orderNumber}</Text>
              </View>
              <View style={styles.rowDetail}>
                <Text style={styles.labelDetail}>Meja</Text>
                <Text style={styles.valueDetail}>{tableNo}</Text>
              </View>
              <View style={styles.rowDetail}>
                <Text style={styles.labelDetail}>Waktu</Text>
                <Text style={styles.valueDetail}>{orderTime}</Text>
              </View>

              {/* Table Item */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCol, { flex: 2 }]}>Item</Text>
                <Text style={[styles.tableCol, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                <Text style={[styles.tableCol, { flex: 1.5, textAlign: 'right' }]}>Harga</Text>
              </View>

              {orderItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableText, { flex: 2 }]}>{item.name}</Text>
                  <Text style={[styles.tableText, { flex: 1, textAlign: 'center' }]}>{item.qty}</Text>
                  <Text style={[styles.tableText, { flex: 1.5, textAlign: 'right' }]}>
                    Rp {item.price.toLocaleString('id-ID')}
                  </Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
              </View>

              {/* Pilih Metode Pembayaran */}
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Metode Pembayaran</Text>
              <View style={styles.methodGrid}>
                {/* Tunai */}
                <TouchableOpacity
                  style={[styles.methodCard, paymentMethod === 'Tunai' && styles.methodCardActive]}
                  onPress={() => setPaymentMethod('Tunai')}
                >
                  <MaterialCommunityIcons
                    name="wallet-outline"
                    size={28}
                    color={paymentMethod === 'Tunai' ? '#fff' : '#444'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'Tunai' && styles.methodTextActive]}>
                    Tunai
                  </Text>
                </TouchableOpacity>

                {/* QRIS */}
                <TouchableOpacity
                  style={[styles.methodCard, paymentMethod === 'QRIS' && styles.methodCardActive]}
                  onPress={() => setPaymentMethod('QRIS')}
                >
                  <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={24}
                    color={paymentMethod === 'QRIS' ? '#fff' : '#444'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'QRIS' && styles.methodTextActive]}>
                    QRIS
                  </Text>
                </TouchableOpacity>

                {/* E-Wallet */}
                <TouchableOpacity
                  style={[styles.methodCard, paymentMethod === 'E-Wallet' && styles.methodCardActive]}
                  onPress={() => setPaymentMethod('E-Wallet')}
                >
                  <MaterialCommunityIcons
                    name="cellphone-text"
                    size={26}
                    color={paymentMethod === 'E-Wallet' ? '#fff' : '#444'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'E-Wallet' && styles.methodTextActive]}>
                    E-Wallet
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Jumlah Bayar Input */}
              <Text style={styles.inputLabel}>Jumlah Bayar</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>Rp</Text>
                <TextInput
                  style={styles.textInput}
                  value={parseInt(cashInput || '0', 10).toLocaleString('id-ID')}
                  editable={false}
                />
              </View>
            </ScrollView>

            {/* Sisi Kanan: Keypad / Numpad Angka */}
            <View style={styles.rightColumn}>
              <View style={styles.numpadContainer}>
                {numpadKeys.map((key, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.numpadBtn}
                    onPress={() => handleNumpad(key)}
                  >
                    {key === 'DEL' ? (
                      <MaterialCommunityIcons name="backspace-outline" size={24} color="#333" />
                    ) : (
                      <Text style={styles.numpadText}>{key}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
                <Ionicons name="receipt-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.payBtnText}>Bayar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* TAMPILAN STRUK PEMBAYARAN / STRUK TRANSAKSI (SESUAI GAMBAR) */
          <ScrollView contentContainerStyle={styles.receiptContainer}>
            <View style={styles.receiptCard}>
              <View style={styles.receiptHeader}>
                <MaterialCommunityIcons name="bowl-mix" size={28} color="#222" />
                <Text style={styles.receiptTitle}>Seblak Prasmanan</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptInfoRow}>
                <Text style={styles.receiptInfoLabel}>No. Transaksi</Text>
                <Text style={styles.receiptInfoValue}>: {orderNumber}</Text>
              </View>
              <View style={styles.receiptInfoRow}>
                <Text style={styles.receiptInfoLabel}>Meja</Text>
                <Text style={styles.receiptInfoValue}>: {tableNo.replace('Meja ', '')}</Text>
              </View>
              <View style={styles.receiptInfoRow}>
                <Text style={styles.receiptInfoLabel}>Tanggal</Text>
                <Text style={styles.receiptInfoValue}>: 16/10/2025 {orderTime}</Text>
              </View>

              <View style={styles.receiptDivider} />

              {orderItems.map((item, idx) => (
                <View key={idx} style={styles.receiptItemRow}>
                  <Text style={[styles.receiptItemText, { flex: 2 }]}>{item.name}</Text>
                  <Text style={[styles.receiptItemText, { flex: 0.5, textAlign: 'center' }]}>
                    {item.qty}
                  </Text>
                  <Text style={[styles.receiptItemText, { flex: 1.5, textAlign: 'right' }]}>
                    {(item.price * item.qty).toLocaleString('id-ID')}
                  </Text>
                </View>
              ))}

              <View style={styles.receiptDivider} />

              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total</Text>
                <Text style={styles.receiptTotalValue}>{totalPrice.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Metode</Text>
                <Text style={styles.receiptTotalValue}>: {paymentMethod}</Text>
              </View>

              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={styles.thankYouText}>Terima kasih 😊</Text>
                <Text style={styles.thankYouSub}>Selamat menikmati!</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>Selesai & Transaksi Baru</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#222' },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  profileName: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  profileRole: { fontSize: 12, color: '#777' },

  contentLayout: { flex: 1, flexDirection: 'row', padding: 16 },
  leftColumn: { flex: 1.2, backgroundColor: '#fff', borderRadius: 12, padding: 16, marginRight: 16 },
  rightColumn: { flex: 0.8, justifyContent: 'space-between' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  rowDetail: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  labelDetail: { color: '#666', fontSize: 14 },
  valueDetail: { fontWeight: '600', fontSize: 14, color: '#222' },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    marginTop: 10,
  },
  tableCol: { color: '#888', fontSize: 13, fontWeight: '600' },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  tableText: { fontSize: 14, color: '#333' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#222' },

  methodGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 16 },
  methodCard: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  methodCardActive: { backgroundColor: '#d32f2f', borderColor: '#d32f2f' },
  methodText: { fontSize: 13, fontWeight: '600', color: '#444', marginTop: 4 },
  methodTextActive: { color: '#fff' },

  inputLabel: { fontSize: 14, color: '#666', marginBottom: 6 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  currencyPrefix: { fontSize: 16, fontWeight: '600', color: '#333', marginRight: 6 },
  textInput: { fontSize: 16, fontWeight: 'bold', color: '#222', flex: 1 },

  // Numpad Styles
  numpadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  numpadBtn: {
    width: '31%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  numpadText: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  payBtn: {
    backgroundColor: '#d32f2f',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Receipt Styles
  receiptContainer: { padding: 24, alignItems: 'center' },
  receiptCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  receiptHeader: { alignItems: 'center', marginBottom: 12 },
  receiptTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 4, color: '#222' },
  receiptDivider: { height: 1, backgroundColor: '#ddd', marginVertical: 12 },
  receiptInfoRow: { flexDirection: 'row', marginBottom: 4 },
  receiptInfoLabel: { width: 90, fontSize: 13, color: '#555' },
  receiptInfoValue: { fontSize: 13, color: '#222', fontWeight: '500' },
  receiptItemRow: { flexDirection: 'row', marginVertical: 4 },
  receiptItemText: { fontSize: 13, color: '#333' },
  receiptTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  receiptTotalLabel: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  receiptTotalValue: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  thankYouText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  thankYouSub: { fontSize: 12, color: '#666', marginTop: 2 },
  doneBtn: {
    marginTop: 20,
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  doneBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
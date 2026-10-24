import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
  Image,
  Alert,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useKasir } from '../context/KasirContext';
import formatCurrency from '../utils/formatCurrency';

export default function PaymentModal({
  visible,
  onClose,
  transactionData,
  onSuccessPayment,
}) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { user, checkoutOrder } = useKasir();

  // 1. Bayar Pake Apa (Metode Pembayaran)
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [selectedEwallet, setSelectedEwallet] = useState('GoPay');

  // 2. Bayarnya Berapa (Nominal Uang yang Dibayar)
  const [cashInput, setCashInput] = useState('');

  const orderNumber = transactionData?.orderNo || '#001';
  const tableNo = transactionData?.tableNo || 'Meja 2';
  const orderTime = transactionData?.time || '09:45';
  const dateStr = transactionData?.date || '16/10/2025';
  const kuah = transactionData?.kuah || 'Original';
  const pedas = transactionData?.pedas ?? 3;
  const catatan = transactionData?.catatan || '';

  const orderItems =
    transactionData?.items && transactionData.items.length > 0
      ? transactionData.items
      : [
          { name: 'Topping Lengkap', qty: 1, price: 28000 },
          { name: 'Telur', qty: 1, price: 4000 },
        ];

  // 3. Totalnya Berapa (Total Tagihan)
  const totalPrice =
    transactionData?.total !== undefined
      ? transactionData.total
      : orderItems.reduce(
          (acc, item) => acc + (item.price || 0) * (item.qty || 1),
          0
        );

  useEffect(() => {
    if (visible) {
      setCashInput(totalPrice.toString());
      setPaymentMethod('Tunai');
    }
  }, [visible, totalPrice]);

  const numericCash = parseInt(cashInput, 10) || 0;
  const change = Math.max(0, numericCash - totalPrice);

  const handleNumpad = (val) => {
    if (val === 'DEL') {
      setCashInput((prev) => {
        const next = prev.slice(0, -1);
        return next === '' ? '0' : next;
      });
    } else if (val === '00') {
      setCashInput((prev) => {
        if (prev === '0' || prev === '') return '0';
        return prev + '00';
      });
    } else {
      setCashInput((prev) => {
        if (prev === '0') return val;
        return prev + val;
      });
    }
  };

  const handleQuickAmount = (amt) => {
    setCashInput(amt.toString());
  };

  const handleProcessPayment = () => {
    if (paymentMethod === 'Tunai' && numericCash < totalPrice) {
      Alert.alert(
        'Uang Kurang',
        `Uang tunai ${formatCurrency(numericCash)} kurang dari total tagihan ${formatCurrency(totalPrice)}. Silakan masukkan jumlah uang yang sesuai.`
      );
      return;
    }

    const finalMethodName =
      paymentMethod === 'E-Wallet'
        ? `E-Wallet (${selectedEwallet})`
        : paymentMethod;

    const finalCashPaid =
      paymentMethod === 'Tunai' ? numericCash : totalPrice;
    const finalChange = paymentMethod === 'Tunai' ? change : 0;

    // Simpan pesanan & transaksi ke sistem
    checkoutOrder(finalMethodName, finalCashPaid, {
      orderNo: orderNumber,
      tableNo,
      time: orderTime,
      date: dateStr,
      items: orderItems,
      total: totalPrice,
      kuah,
      pedas,
      catatan,
    });

    // Kirim payload lengkap ke modal Struk
    const txPayload = {
      orderNo: orderNumber,
      tableNo: tableNo,
      date: dateStr,
      time: orderTime,
      kuah: kuah,
      pedas: pedas,
      catatan: catatan,
      items: orderItems,
      total: totalPrice,
      method: finalMethodName,
      cashPaid: finalCashPaid,
      change: finalChange,
      kasir: user?.name || 'Siti Aisyah',
    };

    if (onSuccessPayment) {
      onSuccessPayment(txPayload);
    }
  };

  const numpadKeys = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '00',
    '0',
    'DEL',
  ];

  const avatarSource =
    typeof user?.avatar === 'string'
      ? { uri: user.avatar }
      : user?.avatar || {
          uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeContainer}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#2C1810" />
            <Text style={styles.pageTitle}>Pembayaran Pesanan</Text>
          </TouchableOpacity>

          <View style={styles.profileChip}>
            <View style={styles.avatarCircle}>
              <Image source={avatarSource} style={styles.avatarImg} />
            </View>
            <View>
              <Text style={styles.profileName}>
                {user?.name || 'Siti Aisyah'}
              </Text>
              <Text style={styles.profileRole}>{user?.role || 'Kasir'}</Text>
            </View>
          </View>
        </View>

        {/* Responsive Content */}
        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={[
            styles.scrollInner,
            isLargeScreen && styles.rowContent,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* SISI KIRI: Ringkasan Pesanan, Totalnya Berapa, & Bayar Pake Apa */}
          <View
            style={[
              styles.leftColumn,
              isLargeScreen && { flex: 1.15, marginRight: 20 },
            ]}
          >
            {/* 1. KOTAK TOTAL TAGIHAN (TOTALNYA BERAPA) */}
            <View style={styles.totalHighlightCard}>
              <View style={styles.totalHeaderRow}>
                <View>
                  <Text style={styles.totalBadgeLabel}>TOTAL TAGIHAN</Text>
                  <Text style={styles.totalAmountBig}>
                    {formatCurrency(totalPrice)}
                  </Text>
                </View>
                <View style={styles.orderMetaBadge}>
                  <Text style={styles.orderMetaText}>{orderNumber}</Text>
                  <Text style={styles.orderMetaTable}>{tableNo}</Text>
                </View>
              </View>

              <View style={styles.orderDetailSubRow}>
                <Text style={styles.orderDetailSubText}>
                  Waktu: {orderTime} | Kuah: {kuah} | Level: {pedas}
                </Text>
                {catatan ? (
                  <Text style={styles.orderNotesText} numberOfLines={1}>
                    Catatan: {catatan}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* RINCIAN ITEM TOPPING */}
            <View style={[styles.cardBox, { marginTop: 14 }]}>
              <Text style={styles.boxTitle}>Rincian Topping Terpilih</Text>

              <View style={styles.tableHeader}>
                <Text style={[styles.thText, { flex: 2 }]}>Nama Topping</Text>
                <Text style={[styles.thText, { width: 50, textAlign: 'center' }]}>
                  Qty
                </Text>
                <Text style={[styles.thText, { width: 85, textAlign: 'right' }]}>
                  Harga
                </Text>
              </View>

              {orderItems.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text
                    style={[styles.tdText, { flex: 2, fontWeight: '700' }]}
                    numberOfLines={1}
                  >
                    {item.name || item.nama}
                  </Text>
                  <Text
                    style={[
                      styles.tdText,
                      { width: 50, textAlign: 'center', color: '#6F5C53' },
                    ]}
                  >
                    {item.qty || 1}
                  </Text>
                  <Text
                    style={[
                      styles.tdText,
                      {
                        width: 85,
                        textAlign: 'right',
                        fontWeight: '800',
                        color: '#2C1810',
                      },
                    ]}
                  >
                    {formatCurrency(
                      (item.price || item.harga || 0) * (item.qty || 1)
                    )}
                  </Text>
                </View>
              ))}
            </View>

            {/* 2. KOTAK METODE PEMBAYARAN (BAYAR PAKE APA) */}
            <View style={[styles.cardBox, { marginTop: 14 }]}>
              <View style={styles.sectionHeadingRow}>
                <Text style={styles.boxTitle}>
                  Metode Pembayaran (Bayar Pake Apa)
                </Text>
                <Text style={styles.activeMethodIndicator}>
                  {paymentMethod === 'Tunai'
                    ? '💵 Tunai (Cash)'
                    : paymentMethod === 'QRIS'
                    ? '📱 QRIS Digital'
                    : `💳 E-Wallet (${selectedEwallet})`}
                </Text>
              </View>

              <View style={styles.methodsRow}>
                {/* Tunai */}
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'Tunai' && styles.methodButtonActive,
                  ]}
                  onPress={() => setPaymentMethod('Tunai')}
                  activeOpacity={0.75}
                >
                  <MaterialIcons
                    name="payments"
                    size={24}
                    color={paymentMethod === 'Tunai' ? '#FFFFFF' : '#8D7B70'}
                  />
                  <Text
                    style={[
                      styles.methodButtonText,
                      paymentMethod === 'Tunai' &&
                        styles.methodButtonTextActive,
                    ]}
                  >
                    Tunai (Cash)
                  </Text>
                </TouchableOpacity>

                {/* QRIS */}
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'QRIS' && styles.methodButtonActive,
                  ]}
                  onPress={() => {
                    setPaymentMethod('QRIS');
                    setCashInput(totalPrice.toString());
                  }}
                  activeOpacity={0.75}
                >
                  <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={24}
                    color={paymentMethod === 'QRIS' ? '#FFFFFF' : '#8D7B70'}
                  />
                  <Text
                    style={[
                      styles.methodButtonText,
                      paymentMethod === 'QRIS' &&
                        styles.methodButtonTextActive,
                    ]}
                  >
                    QRIS
                  </Text>
                </TouchableOpacity>

                {/* E-Wallet */}
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'E-Wallet' && styles.methodButtonActive,
                  ]}
                  onPress={() => {
                    setPaymentMethod('E-Wallet');
                    setCashInput(totalPrice.toString());
                  }}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={24}
                    color={paymentMethod === 'E-Wallet' ? '#FFFFFF' : '#8D7B70'}
                  />
                  <Text
                    style={[
                      styles.methodButtonText,
                      paymentMethod === 'E-Wallet' &&
                        styles.methodButtonTextActive,
                    ]}
                  >
                    E-Wallet
                  </Text>
                </TouchableOpacity>
              </View>

              {/* TAMPILAN DINAMIS PILIHAN METODE */}
              {paymentMethod === 'Tunai' ? (
                <View style={styles.cashSummaryBanner}>
                  <Text style={styles.cashBannerHint}>
                    Masukkan jumlah uang tunai pelanggan di numpad sebelah kanan:
                  </Text>
                </View>
              ) : paymentMethod === 'QRIS' ? (
                <View style={styles.qrisContainer}>
                  <View style={styles.qrisQrBox}>
                    <Ionicons name="qr-code" size={80} color="#2C1810" />
                  </View>
                  <Text style={styles.qrisPromptTitle}>
                    Pindai Kode QRIS di Meja Kasir
                  </Text>
                  <Text style={styles.qrisPromptSub}>
                    Mendukung BCA, Mandiri, GoPay, OVO, ShopeePay, DANA
                  </Text>
                </View>
              ) : (
                <View style={styles.ewalletContainer}>
                  <Text style={styles.ewalletHeading}>
                    Pilih Layanan E-Wallet Pelanggan:
                  </Text>
                  <View style={styles.ewalletPillsRow}>
                    {['GoPay', 'OVO', 'DANA', 'ShopeePay'].map((ew) => {
                      const isSel = selectedEwallet === ew;
                      return (
                        <TouchableOpacity
                          key={ew}
                          style={[
                            styles.ewalletPill,
                            isSel && styles.ewalletPillActive,
                          ]}
                          onPress={() => setSelectedEwallet(ew)}
                        >
                          <Text
                            style={[
                              styles.ewalletPillText,
                              isSel && styles.ewalletPillTextActive,
                            ]}
                          >
                            {ew}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* SISI KANAN: 3. BAYARNYA BERAPA (INPUT / KEYPAD) & TOMBOL BAYAR */}
          <View
            style={[
              styles.rightColumn,
              isLargeScreen && { flex: 0.85 },
              !isLargeScreen && { marginTop: 16 },
            ]}
          >
            <View style={styles.keypadCard}>
              {/* STATUS JUMLAH BAYAR */}
              <View style={styles.amountDisplayBox}>
                <Text style={styles.amountDisplayLabel}>
                  {paymentMethod === 'Tunai'
                    ? 'Uang Tunai yang Dibayarkan:'
                    : 'Nominal Tagihan Pas:'}
                </Text>
                <Text style={styles.amountDisplayText}>
                  {formatCurrency(paymentMethod === 'Tunai' ? numericCash : totalPrice)}
                </Text>
              </View>

              {/* BAR KEMBALIAN OTOMATIS */}
              {paymentMethod === 'Tunai' ? (
                <View
                  style={[
                    styles.changeBox,
                    numericCash < totalPrice
                      ? styles.changeBoxShort
                      : styles.changeBoxSuccess,
                  ]}
                >
                  <Text style={styles.changeBoxLabel}>
                    {numericCash >= totalPrice
                      ? 'Uang Kembalian:'
                      : 'Kekurangan Uang:'}
                  </Text>
                  <Text
                    style={[
                      styles.changeBoxValue,
                      numericCash < totalPrice && { color: '#C62828' },
                    ]}
                  >
                    {numericCash >= totalPrice
                      ? formatCurrency(change)
                      : formatCurrency(totalPrice - numericCash)}
                  </Text>
                </View>
              ) : (
                <View style={styles.changeBoxDigital}>
                  <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                  <Text style={styles.changeBoxDigitalText}>
                    Pembayaran Pas Tanpa Kembalian (Lunas)
                  </Text>
                </View>
              )}

              {/* NUMPAD HANYA UNTUK TUNAI */}
              {paymentMethod === 'Tunai' ? (
                <>
                  <View style={styles.quickCashRow}>
                    <TouchableOpacity
                      style={styles.quickCashPill}
                      onPress={() => handleQuickAmount(totalPrice)}
                    >
                      <Text style={styles.quickCashText}>Uang Pas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickCashPill}
                      onPress={() => handleQuickAmount(20000)}
                    >
                      <Text style={styles.quickCashText}>20k</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickCashPill}
                      onPress={() => handleQuickAmount(50000)}
                    >
                      <Text style={styles.quickCashText}>50k</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickCashPill}
                      onPress={() => handleQuickAmount(100000)}
                    >
                      <Text style={styles.quickCashText}>100k</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.numpadGrid}>
                    {numpadKeys.map((key) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.numKey}
                        onPress={() => handleNumpad(key)}
                        activeOpacity={0.7}
                      >
                        {key === 'DEL' ? (
                          <Ionicons
                            name="backspace-outline"
                            size={22}
                            color="#C62828"
                          />
                        ) : (
                          <Text style={styles.numKeyText}>{key}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : (
                <View style={styles.digitalInstructionBox}>
                  <Text style={styles.digitalInstructionTitle}>
                    Konfirmasi Pembayaran Digital
                  </Text>
                  <Text style={styles.digitalInstructionDesc}>
                    Pastikan pelanggan telah menyelesaikan transfer sebesar{' '}
                    <Text style={{ fontWeight: '800', color: '#2C1810' }}>
                      {formatCurrency(totalPrice)}
                    </Text>
                    . Lalu tekan tombol Konfirmasi di bawah.
                  </Text>
                </View>
              )}

              {/* TOMBOL BAYAR */}
              <TouchableOpacity
                style={styles.payButton}
                onPress={handleProcessPayment}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name="cash-register"
                  size={22}
                  color="#FFFFFF"
                />
                <Text style={styles.payButtonText}>
                  Konfirmasi Bayar {formatCurrency(totalPrice)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  topBar: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5DF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2C1810',
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE5DF',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C1810',
  },
  profileRole: {
    fontSize: 11,
    color: '#8D7B70',
  },
  mainScrollView: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 40,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  totalHighlightCard: {
    backgroundColor: '#2C1810',
    borderRadius: 16,
    padding: 16,
  },
  totalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  totalBadgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D7CCC8',
    letterSpacing: 1,
  },
  totalAmountBig: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  orderMetaBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  orderMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderMetaTable: {
    fontSize: 11,
    color: '#D7CCC8',
  },
  orderDetailSubRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 8,
  },
  orderDetailSubText: {
    fontSize: 12,
    color: '#D7CCC8',
  },
  orderNotesText: {
    fontSize: 12,
    color: '#FFCC80',
    marginTop: 2,
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E9E4',
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8D7B70',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F5F2',
  },
  tdText: {
    fontSize: 13,
    color: '#2C1810',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeMethodIndicator: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8D7B70',
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  methodButton: {
    flex: 1,
    backgroundColor: '#F8F5F2',
    borderWidth: 1,
    borderColor: '#EDE5DF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  methodButtonActive: {
    backgroundColor: '#2C1810',
    borderColor: '#2C1810',
  },
  methodButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8D7B70',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  cashSummaryBanner: {
    marginTop: 12,
    backgroundColor: '#F8F5F2',
    padding: 10,
    borderRadius: 8,
  },
  cashBannerHint: {
    fontSize: 12,
    color: '#6F5C53',
    textAlign: 'center',
  },
  qrisContainer: {
    marginTop: 14,
    alignItems: 'center',
    padding: 10,
  },
  qrisQrBox: {
    backgroundColor: '#F8F5F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  qrisPromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2C1810',
  },
  qrisPromptSub: {
    fontSize: 11,
    color: '#8D7B70',
    textAlign: 'center',
    marginTop: 2,
  },
  ewalletContainer: {
    marginTop: 14,
  },
  ewalletHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F5C53',
    marginBottom: 8,
  },
  ewalletPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ewalletPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F8F5F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  ewalletPillActive: {
    backgroundColor: '#D7CCC8',
    borderColor: '#8D7B70',
  },
  ewalletPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F5C53',
  },
  ewalletPillTextActive: {
    color: '#2C1810',
  },
  keypadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  amountDisplayBox: {
    backgroundColor: '#F8F5F2',
    padding: 12,
    borderRadius: 10,
  },
  amountDisplayLabel: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '600',
  },
  amountDisplayText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2C1810',
    marginTop: 2,
  },
  changeBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeBoxSuccess: {
    backgroundColor: '#E8F5E9',
  },
  changeBoxShort: {
    backgroundColor: '#FFEBEE',
  },
  changeBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C1810',
  },
  changeBoxValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2E7D32',
  },
  changeBoxDigital: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeBoxDigitalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  quickCashRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickCashPill: {
    flex: 1,
    backgroundColor: '#F8F5F2',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  quickCashText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2C1810',
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  numKey: {
    width: '31.5%',
    backgroundColor: '#F8F5F2',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  numKeyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1810',
  },
  digitalInstructionBox: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F8F5F2',
    borderRadius: 10,
  },
  digitalInstructionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 4,
  },
  digitalInstructionDesc: {
    fontSize: 12,
    color: '#6F5C53',
    lineHeight: 18,
  },
  payButton: {
    backgroundColor: '#2C1810',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
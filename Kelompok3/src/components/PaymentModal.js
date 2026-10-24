import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
<<<<<<< HEAD
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
=======
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
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa

  useEffect(() => {
    if (visible) {
      setCashInput(totalPrice.toString());
<<<<<<< HEAD
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
=======
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
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
      });
    }
  };

<<<<<<< HEAD
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
=======
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
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
            </View>
          </View>
        </View>

<<<<<<< HEAD
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
                  Waktu: {orderTime} • Kuah: {kuah} • Level Pedas: Lvl {pedas}
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
=======
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
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
                  </Text>
                </TouchableOpacity>

                {/* QRIS */}
                <TouchableOpacity
<<<<<<< HEAD
                  style={[
                    styles.methodButton,
                    paymentMethod === 'QRIS' && styles.methodButtonActive,
                  ]}
                  onPress={() => {
                    setPaymentMethod('QRIS');
                    setCashInput(totalPrice.toString());
                  }}
                  activeOpacity={0.75}
=======
                  style={[styles.methodCard, paymentMethod === 'QRIS' && styles.methodCardActive]}
                  onPress={() => setPaymentMethod('QRIS')}
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
                >
                  <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={24}
<<<<<<< HEAD
                    color={paymentMethod === 'QRIS' ? '#FFFFFF' : '#8D7B70'}
                  />
                  <Text
                    style={[
                      styles.methodButtonText,
                      paymentMethod === 'QRIS' &&
                        styles.methodButtonTextActive,
                    ]}
                  >
=======
                    color={paymentMethod === 'QRIS' ? '#fff' : '#444'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'QRIS' && styles.methodTextActive]}>
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
                    QRIS
                  </Text>
                </TouchableOpacity>

                {/* E-Wallet */}
                <TouchableOpacity
<<<<<<< HEAD
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
=======
                  style={[styles.methodCard, paymentMethod === 'E-Wallet' && styles.methodCardActive]}
                  onPress={() => setPaymentMethod('E-Wallet')}
                >
                  <MaterialCommunityIcons
                    name="cellphone-text"
                    size={26}
                    color={paymentMethod === 'E-Wallet' ? '#fff' : '#444'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'E-Wallet' && styles.methodTextActive]}>
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
                    E-Wallet
                  </Text>
                </TouchableOpacity>
              </View>

<<<<<<< HEAD
              {/* TAMPILAN DINAMIS PILIHAN METODE */}
              {paymentMethod === 'Tunai' ? (
                <View style={styles.cashSummaryBanner}>
                  <Text style={styles.cashBannerHint}>
                    Masukkan jumlah uang tunai yang diberikan pelanggan di numpad sebelah kanan:
                  </Text>
                </View>
              ) : paymentMethod === 'QRIS' ? (
                <View style={styles.qrisContainer}>
                  <View style={styles.qrisQrBox}>
                    <Ionicons name="qr-code" size={100} color="#2C1810" />
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
              {/* STATUS JUMLAH BAYAR (BAYARNYA BERAPA) */}
              <View style={styles.amountDisplayBox}>
                <Text style={styles.amountDisplayLabel}>
                  {paymentMethod === 'Tunai'
                    ? 'Uang Tunai yang Dibayarkan (Bayarnya Berapa):'
                    : 'Nominal Tagihan Pas (Bayarnya Berapa):'}
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
                  {/* Quick Cash Suggestions */}
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

                  {/* 3x4 Numpad Keypad */}
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
                    Pastikan pelanggan telah menyelesaikan scan/transfer sebesar{' '}
                    <Text style={{ fontWeight: '800', color: '#C62828' }}>
                      {formatCurrency(totalPrice)}
                    </Text>
                    . Lalu tekan tombol Bayar di bawah untuk menerbitkan Struk Transaksi.
                  </Text>
                </View>
              )}

              {/* TOMBOL BAYAR -> LANGSUNG CETAK STRUK */}
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
=======
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
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFE0B2',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C1810',
  },
  profileRole: {
    fontSize: 10,
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
    width: '100%',
  },
  rightColumn: {
    width: '100%',
  },
  totalHighlightCard: {
    backgroundColor: '#52141D',
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: '#52141D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  totalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalBadgeLabel: {
    color: '#FFD9D9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  totalAmountBig: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  orderMetaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  orderMetaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  orderMetaTable: {
    color: '#F4C2C6',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  orderDetailSubRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  orderDetailSubText: {
    color: '#F4D4D8',
    fontSize: 11,
    fontWeight: '500',
  },
  orderNotesText: {
    color: '#FFE0B2',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE5DF',
    elevation: 2,
    shadowColor: '#4A2A22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C1810',
  },
  activeMethodIndicator: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C62828',
    backgroundColor: '#FDECEC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE7E2',
    backgroundColor: '#FCFAF8',
    paddingHorizontal: 8,
    borderRadius: 6,
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
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5ECE6',
  },
  tdText: {
    fontSize: 12,
    color: '#3D2820',
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#EDE5DF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  methodButtonActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
    elevation: 2,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  methodButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E6E67',
    textAlign: 'center',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  cashSummaryBanner: {
    backgroundColor: '#FAF5F1',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
  cashBannerHint: {
    fontSize: 11,
    color: '#6F5C53',
    lineHeight: 16,
  },
  qrisContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FAF5F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
  qrisQrBox: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  qrisPromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2C1810',
  },
  qrisPromptSub: {
    fontSize: 11,
    color: '#8D7B70',
    marginTop: 2,
    textAlign: 'center',
  },
  ewalletContainer: {
    paddingVertical: 12,
    backgroundColor: '#FAF5F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    paddingHorizontal: 10,
  },
  ewalletHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A3028',
    marginBottom: 8,
  },
  ewalletPillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  ewalletPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  ewalletPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  ewalletPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6F5C53',
  },
  ewalletPillTextActive: {
    color: '#FFFFFF',
  },
  keypadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE5DF',
    elevation: 2,
    shadowColor: '#4A2A22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  amountDisplayBox: {
    backgroundColor: '#FAF5F1',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    marginBottom: 8,
  },
  amountDisplayLabel: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '600',
    marginBottom: 2,
  },
  amountDisplayText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2C1810',
  },
  changeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  changeBoxSuccess: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  changeBoxShort: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  changeBoxLabel: {
    fontSize: 12,
    color: '#4A3028',
    fontWeight: '700',
  },
  changeBoxValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2E7D32',
  },
  changeBoxDigital: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 12,
  },
  changeBoxDigitalText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  quickCashRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  quickCashPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F8B4B4',
    alignItems: 'center',
  },
  quickCashText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C62828',
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  numKey: {
    width: '31%',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#EDE5DF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numKeyText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C1810',
  },
  digitalInstructionBox: {
    backgroundColor: '#FAF5F1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
  digitalInstructionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 4,
  },
  digitalInstructionDesc: {
    fontSize: 11,
    color: '#6F5C53',
    lineHeight: 16,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C62828',
    borderRadius: 10,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
=======
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
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa

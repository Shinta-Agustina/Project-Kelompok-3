import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useKasir } from '../context/KasirContext';

export default function TopHeader({ onToggleSidebar, isSidebarOpen }) {
<<<<<<< HEAD
  const { user, activeTab } = useKasir();
  const isOwner = user?.role === 'Owner';

  const getPageTitle = () => {
    switch (activeTab) {
      case 'Kasir':
        return isOwner ? 'Simulasi Kasir - POS' : 'Kasir - Point of Sale';
      case 'Pesanan Aktif':
        return isOwner ? 'Monitoring Pesanan Aktif' : 'Pesanan Aktif';
      case 'Riwayat Transaksi':
        return 'Riwayat Transaksi';
      case 'Laporan':
        return isOwner ? 'Dashboard Owner - Laporan Penjualan' : 'Laporan Penjualan';
      default:
        return 'Kasir - Point of Sale';
    }
  };
=======
  const { user } = useKasir();
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa

  const avatarSource =
    typeof user?.avatar === 'string'
      ? { uri: user.avatar }
<<<<<<< HEAD
      : user?.avatar || (isOwner
          ? { uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' }
          : require('../../assets/images/avatar-kasir.png'));

  return (
    <View style={styles.container}>
      {/* Left Section: Hamburger & Title */}
=======
      : user?.avatar || {
          uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        };

  return (
    <View style={styles.container}>
      {/* Left Section: Garis Burger (Hamburger) & Title */}
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
      <View style={styles.leftGroup}>
        <TouchableOpacity
          onPress={onToggleSidebar}
          style={[styles.burgerBtn, isSidebarOpen && styles.burgerBtnActive]}
          activeOpacity={0.7}
<<<<<<< HEAD
          accessibilityLabel="Toggle Menu Navigasi"
        >
=======
          accessibilityLabel="Toggle Menu Navigasi (Garis Burger)"
        >
          {/* 3 Garis Burger Horizontal Khas POS */}
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
          <View style={styles.burgerIcon}>
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
          </View>
        </TouchableOpacity>

<<<<<<< HEAD
        <Text style={styles.pageTitle} numberOfLines={1}>
          {getPageTitle()}
        </Text>
      </View>

      {/* Right Section: Profil Pengguna (Kasir / Owner) */}
      <View style={[styles.profileChip, isOwner && styles.profileChipOwner]}>
        <View style={[styles.avatarContainer, isOwner && styles.avatarOwner]}>
          <Image
            source={avatarSource}
            style={styles.avatarImg}
            resizeMode="cover"
          />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.userName}>{user?.name || (isOwner ? 'Dewi' : 'Siti Aisyah')}</Text>
          <View style={styles.roleBadgeRow}>
            {isOwner && <Text style={styles.roleIcon}>👑</Text>}
            <Text style={[styles.userRole, isOwner && styles.userRoleOwner]}>
              {user?.role || 'Kasir'}
            </Text>
          </View>
=======
        <Text style={styles.pageTitle}>Kasir - Point of Sale</Text>
      </View>

      {/* Right Section: Profil Kasir (Siti Aisyah) */}
      <View style={styles.profileChip}>
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource}
            style={styles.avatarImg}
          />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.userName}>{user?.name || 'Siti Aisyah'}</Text>
          <Text style={styles.userRole}>{user?.role || 'Kasir'}</Text>
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    height: 60,
=======
    height: 62,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
<<<<<<< HEAD
    paddingHorizontal: 16,
=======
    paddingHorizontal: 20,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    zIndex: 10,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    gap: 12,
    flex: 1,
=======
    gap: 14,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  },
  burgerBtn: {
    padding: 8,
    borderRadius: 8,
<<<<<<< HEAD
    backgroundColor: '#F8F4F0',
    borderWidth: 1,
    borderColor: '#ECE3DE',
=======
    backgroundColor: '#F7F2EE',
    borderWidth: 1,
    borderColor: '#EFE7E2',
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    justifyContent: 'center',
    alignItems: 'center',
  },
  burgerBtnActive: {
    backgroundColor: '#FDECEC',
    borderColor: '#F8B4B4',
  },
  burgerIcon: {
<<<<<<< HEAD
    width: 18,
    height: 14,
=======
    width: 20,
    height: 15,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  burgerLine: {
<<<<<<< HEAD
    width: 18,
    height: 2.2,
=======
    width: 20,
    height: 2.4,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    backgroundColor: '#3D2922',
    borderRadius: 2,
  },
  pageTitle: {
<<<<<<< HEAD
    fontSize: 16,
=======
    fontSize: 18,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    fontWeight: '800',
    color: '#2C1810',
    letterSpacing: 0.2,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#FAF5F1',
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
  profileChipOwner: {
    backgroundColor: '#FFF8F0',
    borderColor: '#FFDEC2',
  },
=======
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 24,
    backgroundColor: '#FBF8F6',
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFE0B2',
  },
<<<<<<< HEAD
  avatarOwner: {
    borderWidth: 1.5,
    borderColor: '#E65100',
  },
=======
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  profileText: {
    justifyContent: 'center',
  },
  userName: {
<<<<<<< HEAD
    fontSize: 12,
    fontWeight: '700',
    color: '#2C1810',
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  roleIcon: {
    fontSize: 10,
  },
  userRole: {
    fontSize: 10,
    color: '#8D7B70',
    fontWeight: '600',
  },
  userRoleOwner: {
    color: '#E65100',
    fontWeight: '800',
=======
    fontSize: 13,
    fontWeight: '700',
    color: '#2C1810',
  },
  userRole: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '500',
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  },
});

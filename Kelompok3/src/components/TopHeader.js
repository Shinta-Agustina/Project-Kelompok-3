import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useKasir } from '../context/KasirContext';

export default function TopHeader({ onToggleSidebar, isSidebarOpen }) {
  const { user } = useKasir();

  const avatarSource =
    typeof user?.avatar === 'string'
      ? { uri: user.avatar }
      : user?.avatar || {
          uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        };

  return (
    <View style={styles.container}>
      {/* Left Section: Garis Burger (Hamburger) & Title */}
      <View style={styles.leftGroup}>
        <TouchableOpacity
          onPress={onToggleSidebar}
          style={[styles.burgerBtn, isSidebarOpen && styles.burgerBtnActive]}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Menu Navigasi (Garis Burger)"
        >
          {/* 3 Garis Burger Horizontal Khas POS */}
          <View style={styles.burgerIcon}>
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
          </View>
        </TouchableOpacity>

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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 62,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  burgerBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F7F2EE',
    borderWidth: 1,
    borderColor: '#EFE7E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  burgerBtnActive: {
    backgroundColor: '#FDECEC',
    borderColor: '#F8B4B4',
  },
  burgerIcon: {
    width: 20,
    height: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  burgerLine: {
    width: 20,
    height: 2.4,
    backgroundColor: '#3D2922',
    borderRadius: 2,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C1810',
    letterSpacing: 0.2,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 24,
    backgroundColor: '#FBF8F6',
    borderWidth: 1,
    borderColor: '#EFE7E2',
  },
  avatarContainer: {
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
  profileText: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C1810',
  },
  userRole: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '500',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';
import {
  TOPPING_CATEGORIES,
  TOPPING_ITEMS,
  SPICE_LEVELS,
  BROTH_OPTIONS,
} from '../../data/mockData';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import ToppingCard from '../../components/ToppingCard';

export default function DashboardKasirScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const {
    selectedKuah,
    setSelectedKuah,
    selectedLevel,
    setSelectedLevel,
    activeCategory,
    setActiveCategory,
  } = useKasir();

  // Sidebar toggle state (default terbuka di desktop/tablet, tertutup di mobile)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Toggle sidebar via garis burger
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Filter toppings berdasarkan kategori aktif
  const filteredToppings = TOPPING_ITEMS.filter((item) => {
    if (activeCategory === 'Semua') return true;
    return item.kategori === activeCategory;
  });

  return (
    <View style={styles.container}>
      {/* Sidebar Kasir: Dikontrol oleh Garis Burger (≡) */}
      {!isMobile && sidebarOpen && (
        <Sidebar isMobile={false} />
      )}

      {/* Mobile Drawer Overlay saat Garis Burger ditekan di layar kecil */}
      {isMobile && sidebarOpen && (
        <View style={styles.mobileBackdrop}>
          <TouchableOpacity
            style={styles.backdropTouch}
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
          />
          <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
        </View>
      )}

      {/* Main Content Area: Menu Topping Seblak Prasmanan */}
      <View style={styles.mainWrapper}>
        {/* Top Header dengan Garis Burger */}
        <TopHeader
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen}
        />

        {/* Konten Menu Topping */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Banner Menu */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerInfo}>
              <View style={styles.badgeLabel}>
                <Text style={styles.badgeLabelText}>🌶️ PRASMANAN KASIR</Text>
              </View>
              <Text style={styles.bannerTitle}>Daftar Menu Topping</Text>
              <Text style={styles.bannerSubtitle}>
                Katalog varian topping seblak prasmanan segar beserta harga satuan resmi.
              </Text>
            </View>
            <View style={styles.statsChip}>
              <Text style={styles.statsNumber}>{filteredToppings.length}</Text>
              <Text style={styles.statsLabel}>Topping Tersedia</Text>
            </View>
          </View>

          {/* Filter Tab Kategori */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionHeading}>Pilih Kategori</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {TOPPING_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      isActive && styles.categoryPillActive,
                    ]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        isActive && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Grid Kartu Menu Topping */}
          <View style={styles.toppingsGrid}>
            {filteredToppings.map((item) => (
              <ToppingCard key={item.id} item={item} />
            ))}
          </View>

          {/* Bagian Kustomisasi: Level Kepedasan & Pilihan Kuah */}
          <View style={styles.customizationsSection}>
            {/* Level Kepedasan */}
            <View style={styles.customBox}>
              <View style={styles.customHeader}>
                <Ionicons name="flame" size={20} color="#C62828" />
                <Text style={styles.customTitle}>Level Kepedasan</Text>
              </View>
              <Text style={styles.customSubtitle}>
                Tersedia 6 level kepedasan khas Seblak Prasmanan:
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.levelsRow}
              >
                {SPICE_LEVELS.map((sl) => {
                  const isSelected = selectedLevel === sl.level;
                  return (
                    <TouchableOpacity
                      key={sl.level}
                      style={[
                        styles.levelCard,
                        isSelected && styles.levelCardActive,
                      ]}
                      onPress={() => setSelectedLevel(sl.level)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.levelNumber}>{sl.level}</Text>
                      <View style={styles.chiliIconsRow}>
                        {sl.chilis === 0 ? (
                          <Text style={styles.chiliGrey}>🌶️</Text>
                        ) : (
                          Array.from({ length: sl.chilis }).map((_, i) => (
                            <Text key={i} style={styles.chiliRed}>
                              🌶️
                            </Text>
                          ))
                        )}
                      </View>
                      <Text
                        style={[
                          styles.levelLabel,
                          isSelected && styles.levelLabelActive,
                        ]}
                      >
                        {sl.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Pilihan Kuah */}
            <View style={[styles.customBox, { marginTop: 16 }]}>
              <View style={styles.customHeader}>
                <Ionicons name="restaurant" size={18} color="#C62828" />
                <Text style={styles.customTitle}>Pilihan Kuah</Text>
              </View>
              <Text style={styles.customSubtitle}>
                Varian kuah rempah pilihan:
              </Text>

              <View style={styles.brothRow}>
                {BROTH_OPTIONS.map((broth) => {
                  const isSelected = selectedKuah === broth;
                  return (
                    <TouchableOpacity
                      key={broth}
                      style={[
                        styles.brothPill,
                        isSelected && styles.brothPillActive,
                      ]}
                      onPress={() => setSelectedKuah(broth)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.brothPillText,
                          isSelected && styles.brothPillTextActive,
                        ]}
                      >
                        {broth}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F5F2',
  },
  mobileBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: 'row',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    elevation: 2,
    shadowColor: '#3D2922',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  bannerInfo: {
    flex: 1,
    minWidth: 260,
  },
  badgeLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEC',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeLabelText: {
    color: '#C62828',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2C1810',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#8D7B70',
    marginTop: 4,
    lineHeight: 18,
  },
  statsChip: {
    backgroundColor: '#FAF5F1',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DCD4',
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#C62828',
  },
  statsLabel: {
    fontSize: 11,
    color: '#8D7B70',
    fontWeight: '600',
    marginTop: 2,
  },
  filterSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 10,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8DCD4',
  },
  categoryPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
    shadowColor: '#C62828',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7E6E67',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  toppingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  customizationsSection: {
    gap: 16,
  },
  customBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    elevation: 2,
    shadowColor: '#3D2922',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2C1810',
  },
  customSubtitle: {
    fontSize: 12,
    color: '#8D7B70',
    marginTop: 4,
    marginBottom: 14,
  },
  levelsRow: {
    gap: 10,
    paddingBottom: 4,
  },
  levelCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FAF5F1',
    borderWidth: 1.5,
    borderColor: '#EAE1D9',
    alignItems: 'center',
    minWidth: 92,
  },
  levelCardActive: {
    backgroundColor: '#FFF4F4',
    borderColor: '#C62828',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2C1810',
  },
  chiliIconsRow: {
    flexDirection: 'row',
    marginVertical: 4,
    height: 18,
    alignItems: 'center',
  },
  chiliGrey: {
    fontSize: 14,
    opacity: 0.35,
  },
  chiliRed: {
    fontSize: 14,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8D7B70',
    textAlign: 'center',
  },
  levelLabelActive: {
    color: '#C62828',
  },
  brothRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brothPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FAF5F1',
    borderWidth: 1.5,
    borderColor: '#EAE1D9',
  },
  brothPillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  brothPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7E6E67',
  },
  brothPillTextActive: {
    color: '#FFFFFF',
  },
});
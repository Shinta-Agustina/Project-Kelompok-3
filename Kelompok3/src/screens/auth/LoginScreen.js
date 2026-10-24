import React, { useState } from 'react';
import {
  View,
  Text,
<<<<<<< HEAD
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useKasir } from '../../context/KasirContext';

export default function LoginScreen({ onLogin }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { login } = useKasir();

  // 2 Roles: 'Kasir' atau 'Owner'
  const [role, setRole] = useState('Kasir');
  const [username, setUsername] = useState('Siti Aisyah');
  const [password, setPassword] = useState('kasir123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Switch role handler
  const handleSelectRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'Kasir') {
      setUsername('Siti Aisyah');
      setPassword('kasir123');
    } else {
      setUsername('Dewi');
      setPassword('owner123');
    }
  };

  const handleLogin = (customUser = null, customRole = null) => {
    const userToLogin = customUser || username.trim();
    const roleToLogin = customRole || role;

    if (!userToLogin) {
      Alert.alert(
        'Perhatian',
        `Silakan masukkan username ${roleToLogin.toLowerCase()}.`
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(userToLogin, roleToLogin);
      if (onLogin) {
        onLogin(userToLogin, roleToLogin);
      }
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.mainLayout, isLargeScreen && styles.rowLayout]}>
        {/* Left Side (or Top Banner on Mobile): Hero Seblak Image */}
        <View
          style={[
            styles.heroSection,
            isLargeScreen ? styles.heroLarge : styles.heroSmall,
          ]}
        >
          <Image
            source={require('../../../assets/images/hero-seblak.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroTopBrand}>
              <View style={styles.heroLogoRow}>
                <View style={styles.heroLogoCircle}>
                  <Text style={styles.heroLogoEmoji}>🍲</Text>
                </View>
                <View>
                  <Text style={styles.heroBrandName}>Seblak Prasmanan</Text>
                  <Text style={styles.heroBrandSub}>Sistem Kasir & Owner</Text>
                </View>
              </View>
            </View>

            <View style={styles.heroTaglineBox}>
              <Text style={styles.heroTagline}>
                Rasa pedas,{"\n"}selalu jadi cerita! ❤️
              </Text>
            </View>

            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterText}>🍲 Seblak Prasmanan</Text>
            </View>
          </View>
        </View>

        {/* Right Side: Login Card */}
        <View
          style={[
            styles.formSection,
            isLargeScreen ? styles.formLarge : styles.formSmall,
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.loginCard}>
              {/* Header Card */}
              <View style={styles.cardHeader}>
                <Text style={styles.title}>
                  {role === 'Kasir' ? 'Login Kasir' : 'Login Owner'}
                </Text>
                <Text style={styles.subtitle}>
                  {role === 'Kasir'
                    ? 'Masuk untuk memulai sesi kerja kasir'
                    : 'Masuk untuk memantau omzet & laporan'}
                </Text>
              </View>

              {/* 2-Role Tab Selector: Kasir & Owner */}
              <View style={styles.roleToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleTab,
                    role === 'Kasir' && styles.roleTabActive,
                  ]}
                  onPress={() => handleSelectRole('Kasir')}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="point-of-sale"
                    size={17}
                    color={role === 'Kasir' ? '#FFFFFF' : '#8D7B70'}
                  />
                  <Text
                    style={[
                      styles.roleTabText,
                      role === 'Kasir' && styles.roleTabTextActive,
                    ]}
                  >
                    Kasir
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleTab,
                    role === 'Owner' && styles.roleTabActive,
                  ]}
                  onPress={() => handleSelectRole('Owner')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={17}
                    color={role === 'Owner' ? '#FFFFFF' : '#8D7B70'}
                  />
                  <Text
                    style={[
                      styles.roleTabText,
                      role === 'Owner' && styles.roleTabTextActive,
                    ]}
                  >
                    Owner
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Input Group */}
              <View style={styles.formGroup}>
                {/* Username Input */}
                <Text style={styles.inputLabel}>
                  {role === 'Kasir' ? 'Username Kasir' : 'Username Owner'}
                </Text>
                <View style={styles.inputBox}>
                  <Ionicons
                    name={role === 'Kasir' ? 'person-outline' : 'shield-outline'}
                    size={19}
                    color="#8D7B70"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      role === 'Kasir'
                        ? 'Masukkan username kasir'
                        : 'Masukkan username owner'
                    }
                    placeholderTextColor="#B0A097"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <Text style={[styles.inputLabel, { marginTop: 14 }]}>
                  Password
                </Text>
                <View style={styles.inputBox}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color="#8D7B70"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan password"
                    placeholderTextColor="#B0A097"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={19}
                      color="#8D7B70"
                    />
                  </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    loading && styles.submitButtonDisabled,
                  ]}
                  onPress={() => handleLogin()}
                  activeOpacity={0.85}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading
                      ? 'Memproses...'
                      : role === 'Kasir'
                      ? 'Masuk'
                      : 'Masuk sebagai Owner'}
                  </Text>
                </TouchableOpacity>

                {/* Bottom Notice: Hanya untuk kasir / Akses Owner */}
                <View style={styles.noticeBox}>
                  <Ionicons
                    name={role === 'Kasir' ? 'lock-closed' : 'shield-checkmark'}
                    size={13}
                    color="#8D7B70"
                  />
                  <Text style={styles.noticeText}>
                    {role === 'Kasir'
                      ? 'Hanya untuk kasir'
                      : 'Akses Owner: Pemilik & Laporan'}
                  </Text>
                </View>

                {/* Quick 1-Click Access for Presentation Testing */}
                <View style={styles.quickAccessSection}>
                  <Text style={styles.quickAccessTitle}>
                    Pilih Cepat untuk Pengujian:
                  </Text>
                  <View style={styles.quickBtnRow}>
                    <TouchableOpacity
                      style={[
                        styles.quickBtn,
                        role === 'Kasir' && styles.quickBtnSelected,
                      ]}
                      onPress={() => {
                        setRole('Kasir');
                        setUsername('Siti Aisyah');
                        setPassword('kasir123');
                        handleLogin('Siti Aisyah', 'Kasir');
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickBtnText}>
                        🏪 Kasir: Siti Aisyah
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.quickBtn,
                        styles.quickBtnOwner,
                        role === 'Owner' && styles.quickBtnOwnerSelected,
                      ]}
                      onPress={() => {
                        setRole('Owner');
                        setUsername('Dewi');
                        setPassword('owner123');
                        handleLogin('Dewi', 'Owner');
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.quickBtnText,
                          styles.quickBtnTextOwner,
                        ]}
                      >
                        👑 Owner: Dewi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
=======
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  // State untuk Role: 'Kasir' atau 'Owner'
  const [role, setRole] = useState('Kasir');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handler Proses Login
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Peringatan', 'Silakan isi username dan password terlebih dahulu!');
      return;
    }

    // Simulasi Logika Verifikasi Akses
    if (role === 'Owner') {
      // Direct ke Dashboard Owner
      Alert.alert('Berhasil Login', 'Selamat datang Owner!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('DashboardOwnerScreen'),
        },
      ]);
    } else {
      // Direct ke Dashboard Kasir
      Alert.alert('Berhasil Login', 'Selamat datang Kasir!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('DashboardKasirScreen'),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* SISI KIRI / ATAS: Hero Branding Seblak Prasmanan */}
          <View style={styles.brandSection}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
              }}
              style={styles.backgroundImage}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.brandOverlay}>
                <View style={styles.logoRow}>
                  <MaterialCommunityIcons name="bowl-mix" size={40} color="#fff" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.brandTitle}>Seblak Prasmanan</Text>
                    <Text style={styles.brandSubtitle}>Sistem Kasir & POS</Text>
                  </View>
                </View>

                <View style={styles.quoteBox}>
                  <Text style={styles.quoteText}>
                    "Rasa pedas, selalu jadi cerita! 🌶️"
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* SISI KANAN / BAWAH: Form Login */}
          <View style={styles.formSection}>
            <View style={styles.cardHeader}>
              <Text style={styles.loginTitle}>Login {role}</Text>
              <Text style={styles.loginSubtitle}>Masuk untuk memulai sesi kerja</Text>
            </View>

            {/* Switcher Role (Kasir / Owner) */}
            <View style={styles.roleToggleContainer}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'Kasir' && styles.roleTabActive]}
                onPress={() => setRole('Kasir')}
              >
                <Ionicons
                  name="calculator-outline"
                  size={18}
                  color={role === 'Kasir' ? '#fff' : '#666'}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'Kasir' && styles.roleTabTextActive,
                  ]}
                >
                  Kasir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleTab, role === 'Owner' && styles.roleTabActive]}
                onPress={() => setRole('Owner')}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={role === 'Owner' ? '#fff' : '#666'}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'Owner' && styles.roleTabTextActive,
                  ]}
                >
                  Owner
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Username */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={`Masukkan username ${role.toLowerCase()}`}
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Input Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            {/* Tombol Masuk */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
              <Text style={styles.submitBtnText}>Masuk</Text>
            </TouchableOpacity>

            {/* Badge Info Tambahan */}
            <View style={styles.footerNote}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#888" />
              <Text style={styles.footerNoteText}>
                {role === 'Owner'
                  ? 'Akses khusus Pemilik Toko'
                  : 'Hanya untuk Kasir bertugas'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#1E0F0A',
  },
  mainLayout: {
    flex: 1,
  },
  rowLayout: {
    flexDirection: 'row',
  },
  heroSection: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1E0F0A',
  },
  heroLarge: {
    flex: 1.1,
    height: '100%',
  },
  heroSmall: {
    height: 200,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 10, 8, 0.65)',
    padding: 28,
    justifyContent: 'space-between',
  },
  heroTopBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  heroLogoEmoji: {
    fontSize: 24,
  },
  heroBrandName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroBrandSub: {
    fontSize: 13,
    color: '#F4C2C6',
    fontWeight: '600',
  },
  heroTaglineBox: {
    maxWidth: 380,
  },
  heroTagline: {
    fontSize: 26,
    lineHeight: 36,
    color: '#FFFFFF',
    fontWeight: '800',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroFooterText: {
    color: '#ECC4C8',
    fontSize: 13,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: '#F8F5F2',
    justifyContent: 'center',
  },
  formLarge: {
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: 40,
  },
  formSmall: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#EFE7E2',
    elevation: 4,
    shadowColor: '#4A2A22',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2C1810',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#8D7B70',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3ECE7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
=======
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Responsif untuk tampilan Tablet/Desktop/POS
    flexWrap: 'wrap',
  },
  brandSection: {
    flex: 1,
    minWidth: 320,
    height: 420,
    marginRight: 16,
    marginBottom: 16,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  brandOverlay: {
    backgroundColor: 'rgba(180, 20, 20, 0.82)',
    padding: 24,
    height: '100%',
    justifyContent: 'space-between',
    borderRadius: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#fce4e4',
  },
  quoteBox: {
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 28,
  },

  formSection: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Toggle Tab Kasir/Owner
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
<<<<<<< HEAD
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 9,
  },
  roleTabActive: {
    backgroundColor: '#C62828',
    elevation: 2,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7E6E67',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  formGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A3028',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D5CC',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
=======
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    gap: 6,
  },
  roleTabActive: {
    backgroundColor: '#d32f2f',
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleTabTextActive: {
    color: '#fff',
  },

  // Form Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
    backgroundColor: '#fafafa',
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
<<<<<<< HEAD
    color: '#2C1810',
    outlineStyle: 'none',
  },
  eyeBtn: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: '#C62828',
=======
    color: '#222',
  },

  submitBtn: {
    backgroundColor: '#d32f2f',
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    marginTop: 20,
    elevation: 3,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  noticeText: {
    fontSize: 12,
    color: '#8D7B70',
    fontWeight: '600',
  },
  quickAccessSection: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0E5DF',
  },
  quickAccessTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8D7B70',
    marginBottom: 8,
    textAlign: 'center',
  },
  quickBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: '#FDECEC',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  quickBtnSelected: {
    borderColor: '#C62828',
    borderWidth: 1.5,
  },
  quickBtnOwner: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FFD199',
  },
  quickBtnOwnerSelected: {
    borderColor: '#E65100',
    borderWidth: 1.5,
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C62828',
  },
  quickBtnTextOwner: {
    color: '#E65100',
  },
});
=======
    marginTop: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footerNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#888',
  },
});
>>>>>>> 794bfd04fcae9c8b675ab857522e038b692438aa

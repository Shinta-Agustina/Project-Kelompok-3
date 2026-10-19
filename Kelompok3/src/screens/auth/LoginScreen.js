import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useKasir } from '../../context/KasirContext';

export default function LoginScreen({ onLogin }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { login } = useKasir();

  const [username, setUsername] = useState('Tata');
  const [password, setPassword] = useState('kasir123');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Silakan masukkan username dan password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(username.trim());
      if (onLogin) {
        onLogin(username.trim());
      }
    }, 400);
  };

  const handleQuickLogin = () => {
    setUsername('Tata');
    setPassword('kasir123');
    login('Tata');
    if (onLogin) {
      onLogin('Tata');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.mainLayout, isLargeScreen && styles.rowLayout]}>
        {/* Left Side: Hero Section with Seblak Image */}
        <View style={[styles.heroSection, isLargeScreen ? styles.heroLarge : styles.heroSmall]}>
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
                  <Text style={styles.heroBrandSub}>Sistem Kasir</Text>
                </View>
              </View>
            </View>

            <View style={styles.heroTaglineBox}>
              <Text style={styles.heroTagline}>
                Rasa pedas,{"\n"}selalu jadi cerita! ❤️
              </Text>
            </View>

            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterText}>🌶️ Seblak Prasmanan</Text>
            </View>
          </View>
        </View>

        {/* Right Side: Login Form Card */}
        <View style={[styles.formSection, isLargeScreen ? styles.formLarge : styles.formSmall]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.loginCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>Login Kasir</Text>
                <Text style={styles.subtitle}>
                  Masuk untuk memulai sesi kerja
                </Text>
              </View>

              <View style={styles.formGroup}>
                <CustomInput
                  label="Username"
                  placeholder="Masukkan username kasir"
                  value={username}
                  onChangeText={setUsername}
                  iconName="person-outline"
                />

                <CustomInput
                  label="Password"
                  placeholder="Masukkan password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  isPassword
                  iconName="lock-closed-outline"
                />

                <CustomButton
                  title="Masuk"
                  onPress={handleLogin}
                  loading={loading}
                  style={styles.submitButton}
                />
              </View>

              <View style={styles.noticeBox}>
                <Ionicons name="lock-closed" size={14} color="#8D7B70" />
                <Text style={styles.noticeText}>Hanya untuk kasir</Text>
              </View>

              {/* Demo quick login chip */}
              <TouchableOpacity
                style={styles.demoLoginBtn}
                onPress={handleQuickLogin}
                activeOpacity={0.7}
              >
                <Text style={styles.demoLoginText}>
                  ⚡ Masuk Cepat sebagai Tata
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
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
    backgroundColor: '#240C10',
  },
  heroLarge: {
    flex: 1.1,
    minHeight: '100%',
  },
  heroSmall: {
    height: 240,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.88,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 8, 12, 0.42)',
    padding: 32,
    justifyContent: 'space-between',
  },
  heroTopBrand: {
    flexDirection: 'row',
  },
  heroLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    textShadowColor: 'rgba(0,0,0,0.4)',
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
    backgroundColor: '#FBF8F6',
    justifyContent: 'center',
  },
  formLarge: {
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: 40,
  },
  formSmall: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
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
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2C1810',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#8D7B70',
    marginTop: 6,
    fontWeight: '500',
  },
  formGroup: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 22,
  },
  noticeText: {
    fontSize: 12,
    color: '#8D7B70',
    fontWeight: '600',
  },
  demoLoginBtn: {
    marginTop: 18,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFF4E8',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    alignItems: 'center',
  },
  demoLoginText: {
    color: '#C62828',
    fontSize: 12,
    fontWeight: '700',
  },
});
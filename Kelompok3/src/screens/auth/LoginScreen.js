import React, { useState } from 'react';
import {
  View,
  Text,
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
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
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },

  submitBtn: {
    backgroundColor: '#d32f2f',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
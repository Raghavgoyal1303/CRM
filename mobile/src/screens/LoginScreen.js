import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Mail, Lock, LogIn, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.topSection}>
        <View style={styles.logoRing}>
          <ShieldCheck size={40} color="#fff" strokeWidth={2.5} />
        </View>
        <Text style={styles.appName}>Tricity Verified CRM</Text>
        <Text style={styles.appTagline}>Enterprise Intelligence Protocol</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formTitle}>Authentication</Text>
        <Text style={styles.formSubtitle}>Initiate secure operative session</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Operative Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Security Protocol"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color={theme.colors.textSecondary} /> : <Eye size={20} color={theme.colors.textSecondary} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.disabledBtn]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.loginBtnText}>Execute Protocol</Text>
              <Zap size={18} color="#fff" fill="#fff" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Lost credentials?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure Terminal v44.0.2</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  topSection: { flex: 0.4, justifyContent: 'center', alignItems: 'center' },
  logoRing: { width: 80, height: 80, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  appName: { fontSize: 28, fontWeight: '900', color: '#fff', tracking: 1 },
  appTagline: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginTop: 8 },

  formSection: {
    flex: 0.6,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 32,
    ...theme.shadows.premium
  },
  formTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text },
  formSubtitle: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, marginTop: 4, marginBottom: 32 },

  errorBox: { backgroundColor: theme.colors.error + '10', padding: 12, borderRadius: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: theme.colors.error },
  errorText: { color: theme.colors.error, fontSize: 13, fontWeight: '700' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, paddingHorizontal: 16, ...theme.shadows.card, height: 56, borderWidth: 1, borderColor: theme.colors.border },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 14, fontWeight: '700', color: theme.colors.text },

  loginBtn: { backgroundColor: theme.colors.primary, height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 12, ...theme.shadows.premium },
  disabledBtn: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  forgotBtn: { marginTop: 24, alignItems: 'center' },
  forgotText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },

  footer: { position: 'absolute', bottom: 32, width: '100%', alignItems: 'center' },
  footerText: { color: theme.colors.textSecondary, fontSize: 10, fontWeight: '800' }
});

export default LoginScreen;


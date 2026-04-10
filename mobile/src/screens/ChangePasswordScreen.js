import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'New passwords do not match');
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Security protocol updated successfully.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Change Password" navigation={navigation} leftIcon="back" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconCircle}>
             <Lock size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Update Security</Text>
          <Text style={styles.subtitle}>Ensure your Tricity Verified access remains secure by updating your credentials periodically.</Text>

          <View style={styles.form}>
             <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.inputWrapper}>
                   <TextInput 
                     style={styles.input}
                     secureTextEntry={!showPass}
                     value={currentPassword}
                     onChangeText={setCurrentPassword}
                     placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                   />
                   <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={18} color={theme.colors.textMuted} /> : <Eye size={18} color={theme.colors.textMuted} />}
                   </TouchableOpacity>
                </View>
             </View>

             <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputWrapper}>
                   <TextInput 
                     style={styles.input}
                     secureTextEntry={!showPass}
                     value={newPassword}
                     onChangeText={setNewPassword}
                     placeholder="Min. 8 characters"
                   />
                </View>
             </View>

             <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                   <TextInput 
                     style={styles.input}
                     secureTextEntry={!showPass}
                     value={confirmPassword}
                     onChangeText={setConfirmPassword}
                     placeholder="Repeat new password"
                   />
                </View>
             </View>

             <TouchableOpacity 
               style={styles.updateBtn} 
               onPress={handleUpdate}
               disabled={loading}
             >
                {loading ? <ActivityIndicator color="#fff" /> : (
                   <>
                      <ShieldCheck size={20} color="#fff" />
                      <Text style={styles.updateText}>Update Credentials</Text>
                   </>
                )}
             </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 32, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary + '10', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: 8, fontFamily: theme.fonts.heading },
  subtitle: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 8 },
  inputWrapper: { height: 56, backgroundColor: '#fff', borderRadius: 12, borderWeight: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: theme.colors.text },
  
  updateBtn: { height: 56, backgroundColor: theme.colors.primary, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 12, ...theme.shadows.premium },
  updateText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});

export default ChangePasswordScreen;


import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import { Lock, Bell, PieChart, Users, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

const SettingItem = ({ icon: Icon, label, onPress, isLast = false }) => (
  <TouchableOpacity 
    style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]} 
    onPress={onPress}
  >
    <View style={styles.iconBox}>
      <Icon size={20} color={theme.colors.primary} />
    </View>
    <Text style={styles.settingLabel}>{label}</Text>
    <ChevronRight size={18} color={theme.colors.textMuted} />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to exit Tricity Verified?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Logout', onPress: logout }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Profile" navigation={navigation} leftIcon="back" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
             <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'P'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Operative'}</Text>
          <Text style={styles.userRole}>{user?.role?.toUpperCase() || 'SALES REPRESENTATIVE'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'authenticated@leadflow.com'}</Text>
        </View>

        <View style={styles.settingsEnclosure}>
           <SettingItem 
             icon={Lock} 
             label="Change Password" 
             onPress={() => navigation.navigate('ChangePassword')} 
           />
           <SettingItem 
             icon={Bell} 
             label="Notifications" 
             onPress={() => navigation.navigate('Activity')} 
           />
           <SettingItem 
             icon={PieChart} 
             label="My Performance" 
             onPress={() => navigation.navigate('Performance')} 
           />
           <SettingItem 
             icon={Users} 
             label="My Leads" 
             onPress={() => navigation.navigate('Leads')} 
           />
           <SettingItem 
             icon={HelpCircle} 
             label="Help & Support" 
             onPress={() => Alert.alert('Tricity Verified Support', 'Dedicated line: +91 90000 00000')}
           />
           <SettingItem 
             icon={LogOut} 
             label="Logout" 
             onPress={handleLogout} 
             isLast={true} 
           />
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>Tricity Verified CRM v47.0.1</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 24, ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#fff' },
  userName: { fontSize: 18, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading },
  userRole: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary, marginTop: 4, tracking: 1 },
  userEmail: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },
  
  settingsEnclosure: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: theme.colors.primary + '10', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: theme.colors.text },
  
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { fontSize: 10, fontWeight: '800', color: theme.colors.textMuted, textTransform: 'uppercase' }
});

export default ProfileScreen;

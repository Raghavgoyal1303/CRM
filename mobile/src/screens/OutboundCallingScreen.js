import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar
} from 'react-native';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import { Phone, CheckCircle, XCircle, Clock, Zap, PhoneOff, BluetoothOff } from 'lucide-react-native';

const ResultBtn = ({ label, icon: Icon, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.resultBtn, { borderColor: color + '30', backgroundColor: color + '05' }]} 
    onPress={onPress}
  >
    <Icon size={18} color={color} />
    <Text style={[styles.resultLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const OutboundCallingScreen = ({ navigation }) => {
  const [currentCall, setCurrentCall] = useState('+91 98765 43210');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Outbound Calls" navigation={navigation} leftIcon="back" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>My Progress Today</Text>
          <View style={styles.statusBar}>
             <View style={[styles.statusFill, { width: '67%' }]} />
          </View>
          <View style={styles.progressLabels}>
             <Text style={styles.progressCount}>67 / 100 calls</Text>
             <Text style={styles.progressDetail}>Interested: 8 · Rejected: 31 · Queue: 28</Text>
          </View>
        </View>

        <View style={styles.dialerCard}>
          <Text style={styles.dialerHeader}>CALLING NOW</Text>
          <Text style={styles.dialerSub}>Call #68</Text>
          
          <View style={styles.numberBox}>
             <Text style={styles.phoneNumber}>{currentCall}</Text>
             <Text style={styles.dialingText}>Dialing...</Text>
          </View>

          <View style={styles.resultsGrid}>
             <ResultBtn label="Interested" icon={CheckCircle} color={theme.colors.success} />
             <ResultBtn label="Not Interested" icon={XCircle} color={theme.colors.danger} />
             <ResultBtn label="Busy" icon={Clock} color={theme.colors.warning} />
             <ResultBtn label="Switched Off" icon={PhoneOff} color={theme.colors.textSecondary} />
             <ResultBtn label="Not Reachable" icon={BluetoothOff} color={theme.colors.textMuted} />
          </View>
        </View>

        <TouchableOpacity style={styles.pauseBtn}>
           <Zap size={20} color={theme.colors.primary} />
           <Text style={styles.pauseText}>Pause Automated Queue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  progressCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  progressTitle: { fontSize: 13, fontWeight: '800', color: theme.colors.textSecondary, textTransform: 'uppercase', marginBottom: 12 },
  statusBar: { height: 10, backgroundColor: theme.colors.background, borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  statusFill: { height: '100%', backgroundColor: theme.colors.primary },
  progressLabels: { gap: 4 },
  progressCount: { fontSize: 15, fontWeight: '800', color: theme.colors.text },
  progressDetail: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary },
  
  dialerCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', ...theme.shadows.card, borderWidth: 2, borderColor: theme.colors.primary + '15' },
  dialerHeader: { fontSize: 11, fontWeight: '900', color: theme.colors.primary, textTransform: 'uppercase', tracking: 1 },
  dialerSub: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted, marginTop: 4 },
  
  numberBox: { marginVertical: 40, alignItems: 'center' },
  phoneNumber: { fontSize: 28, fontWeight: '900', color: theme.colors.text, fontFamily: theme.fonts.mono },
  dialingText: { fontSize: 14, fontWeight: '700', color: theme.colors.primary, marginTop: 8 },
  
  resultsGrid: { width: '100%', gap: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 24 },
  resultBtn: { height: 50, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  resultLabel: { fontSize: 14, fontWeight: '800' },
  
  pauseBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 32 },
  pauseText: { fontSize: 13, fontWeight: '800', color: theme.colors.primary, textTransform: 'uppercase' }
});

export default OutboundCallingScreen;

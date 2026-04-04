import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  StatusBar
} from 'react-native';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import StatTile from '../components/shared/StatTile';
import { Phone, CheckCircle, XCircle, Clock, Play, Trash2, Edit } from 'lucide-react-native';

const CallLogCard = ({ log }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
       <Text style={styles.phoneText}>{log.phone_number}</Text>
       <View style={[styles.statusBadge, { backgroundColor: log.status === 'answered' ? theme.colors.success + '15' : theme.colors.danger + '15' }]}>
         <Text style={[styles.statusText, { color: log.status === 'answered' ? theme.colors.success : theme.colors.danger }]}>
            {log.status === 'answered' ? 'Answered ✅' : 'Missed ❌'}
         </Text>
       </View>
       <TouchableOpacity style={styles.trashBtn}><Trash2 size={16} color={theme.colors.textMuted} /></TouchableOpacity>
    </View>

    <View style={styles.recordingBox}>
       <View style={styles.recHeader}>
          <Text style={styles.recTitle}>🎙 Recording available</Text>
       </View>
       <View style={styles.playerRow}>
          <TouchableOpacity style={styles.playBtn}><Play size={16} color="#fff" fill="#fff" /></TouchableOpacity>
          <View style={styles.waveform}><View style={styles.waveFill} /></View>
          <Text style={styles.duration}>02:34</Text>
       </View>
    </View>

    <View style={styles.metaInfo}>
       <Text style={styles.metaLabel}>👤 Agent: {log.agent_name || 'System'}</Text>
       <Text style={styles.metaLabel}># App: Exotel</Text>
       <Text style={styles.metaLabel}>🏢 Transferred: —</Text>
       <Text style={styles.metaLabel}>📅 {new Date(log.created_at).toLocaleString()}</Text>
    </View>
  </View>
);

const CallLogsScreen = ({ navigation }) => {
  const [logs, setLogs] = useState([
    { id: 1, phone_number: '+91 98765 43210', status: 'answered', agent_name: 'Priya Singh', created_at: new Date().toISOString() },
    { id: 2, phone_number: '+91 98765 00002', status: 'missed', agent_name: 'Priya Singh', created_at: new Date().toISOString() }
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Call Logs" navigation={navigation} leftIcon="back" rightActions={['menu']} />
      
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
           <View style={styles.tileGrid}>
              <StatTile title="Total" value="47" icon={Phone} color={theme.colors.primary} />
              <StatTile title="Answered" value="38" icon={CheckCircle} color={theme.colors.success} />
              <StatTile title="Missed" value="9" icon={XCircle} color={theme.colors.danger} />
              <StatTile title="Avg Dur" value="2:34" icon={Clock} color={theme.colors.warning} />
           </View>
        )}
        renderItem={({ item }) => <CallLogCard log={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {}} tintColor={theme.colors.primary} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: 20, paddingBottom: 100 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  phoneText: { fontSize: 16, fontWeight: '800', color: theme.colors.text, flex: 1, fontFamily: theme.fonts.mono },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800' },
  trashBtn: { padding: 4 },
  
  recordingBox: { backgroundColor: theme.colors.background, borderRadius: 12, padding: 16, marginBottom: 16 },
  recHeader: { marginBottom: 12 },
  recTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary, textTransform: 'uppercase' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  waveform: { flex: 1, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, overflow: 'hidden' },
  waveFill: { width: '40%', height: '100%', backgroundColor: theme.colors.primary },
  duration: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  
  metaInfo: { gap: 6 },
  metaLabel: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600' }
});

export default CallLogsScreen;

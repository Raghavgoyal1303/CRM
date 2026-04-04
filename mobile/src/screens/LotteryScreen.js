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
import { Wallet, Ticket, CircleDollarSign, Clock, Trash2 } from 'lucide-react-native';

const ParticipantCard = ({ participant }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
       <Text style={styles.tokenText}>{participant.token || 'ERT-000001'}</Text>
       <View style={[styles.statusBadge, { backgroundColor: theme.colors.success + '15' }]}>
         <Text style={[styles.statusText, { color: theme.colors.success }]}>Paid ✅</Text>
       </View>
       <TouchableOpacity style={styles.trashBtn}><Trash2 size={16} color={theme.colors.textMuted} /></TouchableOpacity>
    </View>

    <View style={styles.amountBox}>
       <Text style={styles.amountText}>Rs. {participant.amount || '1,100.00'}</Text>
    </View>

    <View style={styles.metaInfo}>
       <Text style={styles.metaLabel}>👤 Name: {participant.name || 'Arjun Mehta'}</Text>
       <Text style={styles.metaLabel}># Token: {participant.token || 'ERT-000001'}</Text>
       <Text style={styles.metaLabel}>🏢 Aadhar: XXXX XXXX 1234</Text>
       <Text style={styles.metaLabel}>📅 Paid: Mar 15, 2026 via UPI</Text>
    </View>
  </View>
);

const LotteryScreen = ({ navigation }) => {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Arjun Mehta', token: 'ERT-000001', amount: '1,100.00' },
    { id: 2, name: 'Sonia Sharma', token: 'ERT-000042', amount: '1,100.00' }
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Lottery" navigation={navigation} leftIcon="back" />
      
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
           <View style={styles.headerArea}>
              <View style={styles.banner}>
                 <Text style={styles.bannerTitle}>Elite Realty Lucky Plot Scheme 2026</Text>
                 <View style={styles.activePill}><Text style={styles.activeText}>Active ●</Text></View>
                 <Text style={styles.bannerMeta}>247 / 1,00,000 tokens · Rs.2,71,700</Text>
                 <Text style={styles.bannerMeta}>Draw: March 15, 2027</Text>
              </View>

              <View style={styles.tileGrid}>
                 <StatTile title="Tokens Sold" value="247" icon={Ticket} color={theme.colors.primary} />
                 <StatTile title="Revenue" value="2.7L" icon={Wallet} color={theme.colors.success} />
                 <StatTile title="Paid" value="239" icon={CircleDollarSign} color={theme.colors.success} />
                 <StatTile title="Pending" value="8" icon={Clock} color={theme.colors.warning} />
              </View>
           </View>
        )}
        renderItem={({ item }) => <ParticipantCard participant={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: 20, paddingBottom: 100 },
  headerArea: { marginBottom: 24 },
  banner: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: theme.colors.primary, ...theme.shadows.card },
  bannerTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  activePill: { backgroundColor: theme.colors.success + '15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  activeText: { fontSize: 10, fontWeight: '900', color: theme.colors.success },
  bannerMeta: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600', marginTop: 4 },
  
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  tokenText: { fontSize: 14, fontWeight: '800', color: theme.colors.text, flex: 1, fontFamily: theme.fonts.mono },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800' },
  trashBtn: { padding: 4 },
  
  amountBox: { backgroundColor: theme.colors.background, borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' },
  amountText: { fontSize: 20, fontWeight: '900', color: theme.colors.text },
  
  metaInfo: { gap: 6 },
  metaLabel: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600' }
});

export default LotteryScreen;

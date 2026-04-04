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
import { Megaphone, Play, Calendar, Star, ChevronRight } from 'lucide-react-native';

const CampaignCard = ({ campaign }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
       <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: theme.colors.success + '15' }]}>
             <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
             <Text style={[styles.tagText, { color: theme.colors.success }]}>Running</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: theme.colors.primary + '15' }]}>
             <Text style={[styles.tagText, { color: theme.colors.primary }]}>High Priority</Text>
          </View>
       </View>
       <ChevronRight size={18} color={theme.colors.textMuted} />
    </View>

    <Text style={styles.campaignTitle}>{campaign.name}</Text>

    <View style={styles.avatarStack}>
       {[1, 2, 3].map(i => (
         <View key={i} style={[styles.avatar, { marginLeft: i === 1 ? 0 : -10 }]}>
            <Text style={styles.avatarText}>A{i}</Text>
         </View>
       ))}
       <View style={[styles.avatar, { marginLeft: -10, backgroundColor: theme.colors.background }]}>
          <Text style={[styles.avatarText, { color: theme.colors.textMuted }]}>+2</Text>
       </View>
    </View>

    <View style={styles.dateRow}>
       <Calendar size={14} color={theme.colors.textMuted} />
       <Text style={styles.dateText}>Mar 01, 2026 → Mar 31, 2026</Text>
    </View>

    <View style={styles.progressSection}>
       <View style={styles.progressBar}><View style={[styles.progressFill, { width: '45%' }]} /></View>
       <View style={styles.progressLabels}>
          <Text style={styles.progressCount}>45,230 / 1,00,000</Text>
          <Text style={styles.percentage}>45%</Text>
       </View>
    </View>
  </TouchableOpacity>
);

const CampaignsScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Diwali Outreach Campaign' },
    { id: 2, name: 'Summer Real Estate Expo' }
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Campaigns" navigation={navigation} leftIcon="back" />
      
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
           <View style={styles.tileGrid}>
              <StatTile title="Total" value="3" icon={Megaphone} color={theme.colors.primary} />
              <StatTile title="Running" value="1" icon={Play} color={theme.colors.success} />
              <StatTile title="Today" value="847" icon={Calendar} color={theme.colors.warning} />
              <StatTile title="Interested" value="43" icon={Star} color={theme.colors.success} />
           </View>
        )}
        renderItem={({ item }) => <CampaignCard campaign={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: 20, paddingBottom: 100 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  tags: { flexDirection: 'row', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  
  campaignTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading, marginBottom: 16 },
  
  avatarStack: { flexDirection: 'row', marginBottom: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.primary, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  dateText: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600' },
  
  progressSection: { gap: 8 },
  progressBar: { height: 10, backgroundColor: theme.colors.background, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: theme.colors.primary },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressCount: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary },
  percentage: { fontSize: 11, fontWeight: '800', color: theme.colors.primary }
});

export default CampaignsScreen;

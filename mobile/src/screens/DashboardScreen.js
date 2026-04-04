import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, leadsApi, followUpsApi } from '../api';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import { Users, UserCheck, CalendarCheck, ChevronRight } from 'lucide-react-native';

const SmallOrb = ({ title, value, icon: Icon, color }) => (
  <View style={styles.orbCard}>
    <View style={[styles.orbIconBox, { backgroundColor: color + '15' }]}>
      <Icon size={18} color={color} />
    </View>
    <Text style={styles.orbValue}>{value}</Text>
    <Text style={styles.orbTitle}>{title}</Text>
  </View>
);

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes, followRes] = await Promise.all([
        analyticsApi.getDashboard(),
        leadsApi.getRecent(),
        followUpsApi.getFollowUps()
      ]);
      setStats(statsRes.data);
      setRecentLeads(leadsRes.data);
      setFollowups(followRes.data.filter(f => f.status !== 'completed').slice(0, 3));
    } catch (error) {
      console.error('[Home] Fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader 
        title="Home Screen" 
        navigation={navigation} 
        rightActions={['notif', 'avatar', 'menu']}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.hiText}>Hi, {user?.name || 'Operative'}</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        <View style={styles.orbRow}>
          <SmallOrb title="Leads" value={stats?.total_leads || '0'} icon={Users} color={theme.colors.primary} />
          <SmallOrb title="Clients" value={stats?.conversion_rate || '0'} icon={UserCheck} color={theme.colors.success} />
          <SmallOrb title="Tasks" value={stats?.pending_tasks || '0'} icon={CalendarCheck} color={theme.colors.warning} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Leads</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Leads')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          
          {recentLeads.map(lead => (
            <TouchableOpacity 
              key={lead.id} 
              style={styles.previewCard}
              onPress={() => navigation.navigate('LeadDetail', { leadId: lead.id })}
            >
               <View style={styles.previewHeader}>
                  <View style={styles.badgeRow}>
                     <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>NEW</Text></View>
                  </View>
                  <ChevronRight size={16} color={theme.colors.textMuted} />
               </View>
               <Text style={styles.previewName}>{lead.name}</Text>
               <Text style={styles.previewMeta}>📅 Called: {new Date(lead.created_at).toLocaleDateString()}</Text>
               <View style={styles.progressRow}>
                  <View style={styles.progressBar}><View style={[styles.progressFill, { width: '70%' }]} /></View>
                  <Text style={styles.progressText}>Follow-up in 2 hrs</Text>
               </View>
            </TouchableOpacity>
          )) || <Text style={styles.emptyText}>Zero matching captures.</Text>}
        </View>

        <View style={styles.section}>
           <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Follow-ups</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {followups.map(f => (
             <View key={f.id} style={[styles.previewCard, { borderLeftWidth: 4, borderLeftColor: theme.colors.warning }]}>
                <Text style={styles.previewName}>{f.lead_name}</Text>
                <Text style={styles.previewMeta}>⏰ {new Date(f.next_followup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
             </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  welcomeSection: { marginBottom: 24 },
  hiText: { fontSize: 14, color: theme.colors.textSecondary, fontFamily: theme.fonts.body },
  welcomeText: { fontSize: 24, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading, marginTop: 4 },
  
  orbRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  orbCard: { width: '31%', backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', ...theme.shadows.card },
  orbIconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  orbValue: { fontSize: 22, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading },
  orbTitle: { fontSize: 11, color: theme.colors.textSecondary, fontWeight: '600' },
  
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading },
  seeAll: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },
  
  previewCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, ...theme.shadows.card },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  miniBadge: { backgroundColor: theme.colors.accentLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  miniBadgeText: { fontSize: 9, fontWeight: '900', color: theme.colors.primary },
  previewName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  previewMeta: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: theme.colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: theme.colors.primary },
  progressText: { fontSize: 11, fontWeight: '600', color: theme.colors.textSecondary },
  emptyText: { textAlign: 'center', color: theme.colors.textMuted, fontSize: 14 }
});

export default DashboardScreen;

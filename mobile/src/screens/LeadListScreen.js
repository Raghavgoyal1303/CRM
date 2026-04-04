import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { leadsApi } from '../api';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import StatTile from '../components/shared/StatTile';
import LeadCard from '../components/cards/LeadCard';
import { Users, UserPlus, Star, CheckCircle, Search, Filter } from 'lucide-react-native';

const LeadListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  const statuses = ['All', 'New', 'Contacted', 'Interested', 'Site Visit', 'Closed', 'Lost'];

  const fetchLeads = async () => {
    try {
      const response = await leadsApi.getLeads();
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error('[Leads] Fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let result = leads;
    if (search) {
      result = result.filter(l => 
        l.name?.toLowerCase().includes(search.toLowerCase()) || 
        l.phone_number?.includes(search)
      );
    }
    if (activeStatus !== 'All') {
      result = result.filter(l => l.status?.toLowerCase() === activeStatus.toLowerCase());
    }
    setFilteredLeads(result);
  }, [search, activeStatus, leads]);

  const HeaderComponent = () => (
    <View style={styles.headerArea}>
      <View style={styles.tileGrid}>
        <StatTile title="Total" value={leads.length} icon={Users} color={theme.colors.primary} />
        <StatTile title="New Today" value={leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length} icon={UserPlus} color={theme.colors.success} />
        <StatTile title="Interested" value={leads.filter(l => l.status === 'Interested').length} icon={Star} color={theme.colors.warning} />
        <StatTile title="Closed" value={leads.filter(l => l.status === 'Closed').length} icon={CheckCircle} color={theme.colors.success} />
      </View>

      <View style={styles.filterRow}>
        <View style={styles.searchBar}>
          <Search size={18} color={theme.colors.textMuted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by name or phone..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {statuses.map(s => (
          <TouchableOpacity 
            key={s} 
            style={[styles.statusTab, activeStatus === s && styles.activeTab]}
            onPress={() => setActiveStatus(s)}
          >
            <Text style={[styles.tabText, activeStatus === s && styles.activeTabText]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Leads" navigation={navigation} leftIcon="back" rightActions={['menu']} />
      
      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={HeaderComponent}
        renderItem={({ item }) => (
          <LeadCard 
            lead={item} 
            onPress={() => navigation.navigate('LeadDetail', { leadId: item.id })} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchLeads(); }} tintColor={theme.colors.primary} />}
        ListEmptyComponent={
          !loading && <View style={styles.empty}><Text style={styles.emptyText}>Zero matching captures found.</Text></View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: 20, paddingBottom: 100 },
  headerArea: { marginBottom: 20 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  
  filterRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  searchBar: { flex: 1, height: 48, backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWeight: 1, borderColor: theme.colors.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 13, fontWeight: '600', color: theme.colors.text },
  filterBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWeight: 1, borderColor: theme.colors.border },
  
  tabScroll: { marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 4 },
  statusTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: 'transparent' },
  activeTab: { backgroundColor: theme.colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary },
  activeTabText: { color: '#fff' },
  
  empty: { padding: 80, alignItems: 'center' },
  emptyText: { color: theme.colors.textMuted, fontSize: 14, fontWeight: '600' }
});

export default LeadListScreen;

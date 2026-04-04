import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, TrendingUp, ShieldCheck } from 'lucide-react-native';
import { analyticsApi } from '../api';
import { theme } from '../theme';

const StaffScreen = () => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await analyticsApi.getDashboard();
      // The dashboard for owner usually returns performance array
      setData(response.data?.performance || []);
    } catch (error) {
      console.error('[Staff] Fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const renderStaff = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.employee_name?.charAt(0) || '?'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.employee_name || 'Operative'}</Text>
        <Text style={styles.leads}>{item.total_leads || 0} Leads Managed</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.rate}>{item.conversion_rate || 0}%</Text>
        <Text style={styles.label}>Conversion</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Team Management</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderStaff}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Users size={48} color={theme.colors.border} />
            <Text style={styles.emptyText}>No performance data found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 15 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: theme.colors.primary, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  leads: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  stats: { alignItems: 'flex-end' },
  rate: { fontSize: 16, fontWeight: '800', color: theme.colors.primary },
  label: { fontSize: 10, color: theme.colors.textSecondary, textTransform: 'uppercase' },
  emptyContainer: { paddingTop: 100, alignItems: 'center' },
  emptyText: { marginTop: 15, color: theme.colors.textSecondary, fontSize: 16 }
});

export default StaffScreen;

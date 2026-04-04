import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { History, UserPlus, PhoneCall, FileText, CheckCircle2, Zap } from 'lucide-react-native';
import { activityApi } from '../api';
import { theme } from '../theme';

const ActivityScreen = () => {
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      const response = await activityApi.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('[Activity] Fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const getActivityIcon = (action) => {
    const actionLower = (action || '').toLowerCase();
    if (actionLower.includes('captured') || actionLower.includes('created')) {
      return <UserPlus size={18} color={theme.colors.success} />;
    }
    if (actionLower.includes('call')) {
      return <PhoneCall size={18} color={theme.colors.primary} />;
    }
    if (actionLower.includes('note')) {
      return <FileText size={18} color={theme.colors.warning} />;
    }
    if (actionLower.includes('won') || actionLower.includes('qualified')) {
      return <CheckCircle2 size={18} color={theme.colors.success} />;
    }
    return <Zap size={18} color={theme.colors.textSecondary} />;
  };

  const renderItem = ({ item }) => (
    <View style={styles.logEnclosure}>
      <View style={styles.iconRing}>
        {getActivityIcon(item.action)}
      </View>
      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <Text style={styles.actionText}>{item.action}</Text>
          <Text style={styles.timeText}>
             {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
          </Text>
        </View>
        <Text style={styles.userName}>Operative: {item.user_name || 'System'}</Text>
        {item.details && (
          <View style={styles.detailBox}>
             <Text style={styles.detailsText} numberOfLines={2}>
               {typeof item.details === 'string' ? item.details : JSON.stringify(item.details)}
             </Text>
          </View>
        )}
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>Company Audit</Text>
      </View>
      <FlatList
        data={logs}
        keyExtractor={(item) => (item.id || Math.random()).toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyEnclosure}>
            <History size={48} color={theme.colors.border} />
            <Text style={styles.emptyText}>Zero activity recorded.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    backgroundColor: '#fff', 
    padding: 24, 
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32, 
    ...theme.shadows.card 
  },
  title: { fontSize: 24, fontWeight: '900', color: theme.colors.text },
  
  list: { padding: 24 },
  logEnclosure: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logContent: { flex: 1 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
  timeText: { fontSize: 10, fontWeight: '800', color: theme.colors.textSecondary, textTransform: 'uppercase' },
  userName: { fontSize: 11, fontWeight: '600', color: theme.colors.textSecondary, marginTop: 2 },
  detailBox: { backgroundColor: theme.colors.background, padding: 12, borderRadius: 12, marginTop: 8 },
  detailsText: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 },
  
  emptyEnclosure: { paddingTop: 100, alignItems: 'center' },
  emptyText: { marginTop: 16, color: theme.colors.textSecondary, fontSize: 14, fontWeight: '700' }
});

export default ActivityScreen;

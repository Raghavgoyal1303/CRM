import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { employeesApi, analyticsApi } from '../api';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import StatTile from '../components/shared/StatTile';
import { Users, UserCheck, UserX, Phone } from 'lucide-react-native';

const EmployeesScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await employeesApi.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('[Employees] Fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const HeaderComponent = () => (
    <View style={styles.tileGrid}>
      <StatTile title="Total" value={employees.length} icon={Users} color={theme.colors.primary} />
      <StatTile title="Active" value={employees.filter(e => e.status === 'active').length} icon={UserCheck} color={theme.colors.success} />
      <StatTile title="Inactive" value={employees.filter(e => e.status === 'inactive').length} icon={UserX} color={theme.colors.danger} />
      <StatTile title="Leads" value="284" icon={Phone} color={theme.colors.warning} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Employees" navigation={navigation} leftIcon="back" rightActions={['menu']} />
      
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={HeaderComponent}
        renderItem={({ item }) => (
          <View style={styles.employeeCard}>
             <View style={[styles.avatar, { backgroundColor: item.status === 'active' ? theme.colors.success + '15' : theme.colors.border }]}>
                <Text style={[styles.avatarText, { color: item.status === 'active' ? theme.colors.success : theme.colors.textSecondary }]}>
                   {item.name?.charAt(0) || '?'}
                </Text>
             </View>
             
             <View style={styles.infoArea}>
                <View style={styles.nameRow}>
                   <Text style={styles.name}>{item.name}</Text>
                   <Text style={styles.activeDot}>{item.status === 'active' ? '✅' : '❌'}</Text>
                </View>
                <Text style={styles.meta}>📞 {item.phone_number}</Text>
                <Text style={styles.meta}>✉ {item.email}</Text>
             </View>

             <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View Details</Text>
             </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={theme.colors.primary} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: 20, paddingBottom: 100 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  
  employeeCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: '800' },
  infoArea: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', color: theme.colors.text, fontFamily: theme.fonts.heading },
  activeDot: { fontSize: 14 },
  meta: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2, fontFamily: theme.fonts.body },
  
  viewBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWeight: 1, borderColor: theme.colors.primary, backgroundColor: '#fff' },
  viewBtnText: { fontSize: 11, fontWeight: '800', color: theme.colors.primary, textTransform: 'uppercase' }
});

export default EmployeesScreen;

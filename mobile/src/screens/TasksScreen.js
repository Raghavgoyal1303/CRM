import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  StatusBar,
  Linking
} from 'react-native';
import { followUpsApi } from '../api';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import { Calendar, Phone, CheckCircle2, ChevronRight, Clock } from 'lucide-react-native';

const FollowUpCard = ({ task, status }) => (
  <View style={[
    styles.card, 
    status === 'overdue' && styles.overdue, 
    status === 'today' && styles.today,
    status === 'upcoming' && styles.upcoming
  ]}>
    <View style={styles.cardHeader}>
       <Text style={styles.idText}>FU-{task.id}</Text>
       <View style={[styles.statusPill, { 
         backgroundColor: status === 'overdue' ? theme.colors.danger + '15' : 
                          status === 'today' ? theme.colors.warning + '15' : 
                          theme.colors.primary + '15' 
       }]}>
         <Text style={[styles.statusPillText, { 
           color: status === 'overdue' ? theme.colors.danger : 
                  status === 'today' ? theme.colors.warning : 
                  theme.colors.primary 
         }]}>{status.toUpperCase()}</Text>
       </View>
    </View>

    <Text style={styles.timeText}>{new Date(task.next_followup_date).toLocaleDateString()} · {new Date(task.next_followup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

    <View style={styles.leadInfo}>
       <Text style={styles.infoLabel}>Lead:</Text>
       <Text style={styles.infoValue}>{task.lead_name}</Text>
    </View>
    <View style={styles.leadInfo}>
       <Text style={styles.infoLabel}>Agent:</Text>
       <Text style={styles.infoValue}>{task.assigned_employee_name || 'Unassigned'}</Text>
    </View>

    <View style={styles.metaGrid}>
       <View style={styles.metaBox}><Text style={styles.metaLabel}>Type</Text><Text style={styles.metaValue}>Call</Text></View>
       <View style={styles.metaBox}><Text style={styles.metaLabel}>Reminder</Text><Text style={styles.metaValue}>30 min before</Text></View>
    </View>

    {task.notes && <Text style={styles.notes}>Notes: {task.notes}</Text>}

    <View style={styles.actions}>
       <TouchableOpacity 
         style={styles.callBtn}
         onPress={() => task.phone_number && Linking.openURL(`tel:${task.phone_number}`)}
       >
          <Phone size={16} color="#fff" />
          <Text style={styles.callText}>Call Now</Text>
       </TouchableOpacity>
       <TouchableOpacity style={styles.doneBtn}>
          <CheckCircle2 size={16} color={theme.colors.success} />
          <Text style={styles.doneText}>Mark Done</Text>
       </TouchableOpacity>
    </View>
  </View>
);

const TasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await followUpsApi.getFollowUps();
      setTasks(response.data.filter(t => t.status !== 'completed'));
    } catch (error) {
      console.error('[Followups] Fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const categorize = () => {
    const now = new Date();
    const overdue = tasks.filter(t => new Date(t.next_followup_date) < now);
    const today = tasks.filter(t => {
      const d = new Date(t.next_followup_date);
      return d.toDateString() === now.toDateString() && d >= now;
    });
    const upcoming = tasks.filter(t => new Date(t.next_followup_date) > now && new Date(t.next_followup_date).toDateString() !== now.toDateString());
    return { overdue, today, upcoming };
  };

  const { overdue, today, upcoming } = categorize();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Follow-ups" navigation={navigation} leftIcon="back" />
      
      <ScrollView 
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTasks(); }} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
           <Text style={styles.listTitle}>Follow-ups</Text>
           <View style={[styles.totalChip, overdue.length > 0 && styles.overdueChip]}>
              <Text style={[styles.totalChipText, overdue.length > 0 && styles.overdueText]}>Total: {tasks.length}</Text>
           </View>
        </View>

        {overdue.length > 0 && (
          <View style={styles.section}>
             <Text style={styles.sectionHeading}>🔴 Overdue ({overdue.length})</Text>
             {overdue.map(t => <FollowUpCard key={t.id} task={t} status="overdue" />)}
          </View>
        )}

        {today.length > 0 && (
          <View style={styles.section}>
             <Text style={styles.sectionHeading}>🟡 Due Today ({today.length})</Text>
             {today.map(t => <FollowUpCard key={t.id} task={t} status="today" />)}
          </View>
        )}

        <View style={styles.section}>
           <Text style={styles.sectionHeading}>🟢 Upcoming ({upcoming.length})</Text>
           {upcoming.map(t => <FollowUpCard key={t.id} task={t} status="upcoming" />)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: 20, paddingBottom: 100 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  listTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading },
  totalChip: { backgroundColor: theme.colors.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  totalChipText: { fontSize: 12, fontWeight: '800', color: theme.colors.primary },
  overdueChip: { backgroundColor: theme.colors.danger + '15' },
  overdueText: { color: theme.colors.danger },
  
  section: { marginBottom: 24 },
  sectionHeading: { fontSize: 13, fontWeight: '900', color: theme.colors.text, textTransform: 'uppercase', marginBottom: 16, tracking: 1 },
  
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  overdue: { borderLeftWidth: 4, borderLeftColor: theme.colors.danger, backgroundColor: '#FFF1F2' },
  today: { borderLeftWidth: 4, borderLeftColor: theme.colors.warning, backgroundColor: '#FFFBEB' },
  upcoming: { borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  idText: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted, textTransform: 'uppercase' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusPillText: { fontSize: 9, fontWeight: '900' },
  
  timeText: { fontSize: 15, fontWeight: '800', color: theme.colors.text, marginBottom: 12 },
  leadInfo: { flexDirection: 'row', marginBottom: 6, gap: 8 },
  infoLabel: { fontSize: 13, color: theme.colors.textSecondary, width: 50 },
  infoValue: { fontSize: 13, fontWeight: '700', color: theme.colors.text, flex: 1 },
  
  metaGrid: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  metaBox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  metaLabel: { fontSize: 9, color: theme.colors.textMuted, textTransform: 'uppercase', marginBottom: 2 },
  metaValue: { fontSize: 12, fontWeight: '700', color: theme.colors.text },
  
  notes: { fontSize: 12, color: theme.colors.textSecondary, fontStyle: 'italic', marginTop: 4 },
  
  actions: { flexDirection: 'row', gap: 12, marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 16 },
  callBtn: { flex: 1, height: 44, backgroundColor: theme.colors.primary, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  callText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  doneBtn: { flex: 1, height: 44, backgroundColor: 'transparent', borderRadius: 10, borderWidth: 1, borderColor: theme.colors.success, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  doneText: { color: theme.colors.success, fontSize: 13, fontWeight: '800' }
});

export default TasksScreen;

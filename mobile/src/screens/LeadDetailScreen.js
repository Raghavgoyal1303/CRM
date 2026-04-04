import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  StatusBar,
  Linking
} from 'react-native';
import { leadsApi } from '../api';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import { Phone, Mail, MapPin, User, Calendar, Send, Play } from 'lucide-react-native';

const LeadDetailScreen = ({ route, navigation }) => {
  const { leadId } = route.params;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  const statuses = ['New', 'Contacted', 'Interested', 'Site Visit', 'Closed', 'Lost'];

  const fetchLead = async () => {
    try {
      const response = await leadsApi.getLead(leadId);
      setLead(response.data);
    } catch (error) {
      console.error('[Detail] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  if (loading || !lead) {
    return <View style={styles.loading}><ActivityIndicator color={theme.colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Lead Detail" navigation={navigation} leftIcon="back" rightActions={['menu']} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.countRow}>
           <Text style={styles.countTitle}>Leads</Text>
           <View style={styles.countChip}><Text style={styles.countChipText}>Total: 24</Text></View>
        </View>

        <View style={styles.profileCard}>
           <View style={styles.profileHeader}>
              <View style={styles.titleArea}>
                 <Text style={styles.profileName}>{lead.name}</Text>
                 <Text style={styles.profilePhone}>{lead.phone_number}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: theme.colors.status[lead.status?.toLowerCase()]?.bg || theme.colors.border }]}>
                 <Text style={[styles.statusText, { color: theme.colors.status[lead.status?.toLowerCase()]?.text || theme.colors.textSecondary }]}>{lead.status}</Text>
              </View>
           </View>

           <View style={styles.assignedBox}>
              <User size={14} color={theme.colors.primary} />
              <Text style={styles.assignedText}>{lead.assigned_employee_name || 'No Agent'} (assigned)</Text>
           </View>

           <View style={styles.infoLines}>
              <View style={styles.infoLine}><Text style={styles.label}>Type:</Text><Text style={styles.value}>Residential</Text></View>
              <View style={styles.infoLine}><Text style={styles.label}>Source:</Text><Text style={styles.value}>{lead.source || 'YouTube'}</Text></View>
              <View style={styles.infoLine}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{new Date(lead.created_at).toLocaleDateString()}</Text></View>
              <View style={styles.infoLine}><Text style={styles.label}>Follow-up:</Text><Text style={styles.value}>3:00 PM</Text></View>
              <View style={[styles.infoLine, { alignItems: 'flex-start', marginTop: 8 }]}>
                 <MapPin size={14} color={theme.colors.textMuted} style={{ marginTop: 2 }} />
                 <Text style={styles.address}>Sector 62, Noida, UP - 201301</Text>
              </View>
           </View>

           <View style={styles.contactRow}>
              <TouchableOpacity 
                style={styles.contactBtn}
                onPress={() => lead.phone_number && Linking.openURL(`tel:${lead.phone_number}`)}
              >
                 <Phone size={14} color={theme.colors.primary} />
                 <Text style={styles.contactText}>{lead.phone_number}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn}>
                 <Mail size={14} color={theme.colors.primary} />
                 <Text style={styles.contactText}>email@link.com</Text>
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusStrip}>
           {statuses.map(s => (
             <TouchableOpacity 
               key={s} 
               style={[styles.statusItem, lead.status === s ? styles.activeStatus : styles.inactiveStatus]}
             >
                <Text style={[styles.statusItemText, lead.status === s ? styles.activeStatusText : styles.inactiveStatusText]}>{s}</Text>
             </TouchableOpacity>
           ))}
        </ScrollView>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Notes</Text>
           <View style={styles.notesContainer}>
              <View style={styles.noteLine}>
                 <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>PS</Text></View>
                 <View style={styles.noteContent}>
                    <Text style={styles.noteUser}>Priya Singh · 2 hrs ago</Text>
                    <Text style={styles.noteBody}>"Client interested in 3BHK. Budget 80L."</Text>
                 </View>
              </View>
              <View style={styles.noteLine}>
                 <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>PS</Text></View>
                 <View style={styles.noteContent}>
                    <Text style={styles.noteUser}>Priya Singh · 1 hr ago</Text>
                    <Text style={styles.noteBody}>"Site visit confirmed for Saturday 11AM"</Text>
                 </View>
              </View>
           </View>
           <View style={styles.noteInputRow}>
              <TextInput 
                style={styles.noteInput} 
                placeholder="Add a note..." 
                value={note}
                onChangeText={setNote}
              />
              <TouchableOpacity style={styles.sendBtn}><Send size={18} color="#fff" /></TouchableOpacity>
           </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Call History</Text>
           <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                 <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
                 <Text style={styles.timelineText}>Answered · Mar 28 · 02:34</Text>
                 <TouchableOpacity style={styles.miniPlay}><Play size={10} color={theme.colors.primary} fill={theme.colors.primary} /></TouchableOpacity>
              </View>
              <View style={styles.timelineItem}>
                 <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
                 <Text style={styles.timelineText}>Missed · Mar 27</Text>
              </View>
           </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  countTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading },
  countChip: { backgroundColor: theme.colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  countChipText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  profileName: { fontSize: 18, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading },
  profilePhone: { fontSize: 13, color: theme.colors.textSecondary, fontFamily: theme.fonts.mono, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  
  assignedBox: { backgroundColor: theme.colors.background, padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  assignedText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },
  
  infoLines: { gap: 6, marginBottom: 20 },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 13, color: theme.colors.textSecondary, width: 70 },
  value: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  address: { fontSize: 13, color: theme.colors.textSecondary, flex: 1, fontWeight: '600' },
  
  contactRow: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 16 },
  contactBtn: { flex: 1, height: 40, borderRadius: 10, backgroundColor: theme.colors.background, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  contactText: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary },
  
  statusStrip: { marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 32 },
  statusItem: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  activeStatus: { backgroundColor: theme.colors.primary },
  inactiveStatus: { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#fff' },
  statusItemText: { fontSize: 12, fontWeight: '800' },
  activeStatusText: { color: '#fff' },
  inactiveStatusText: { color: theme.colors.textSecondary },
  
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 16 },
  notesContainer: { gap: 16, marginBottom: 16 },
  noteLine: { flexDirection: 'row', gap: 12 },
  miniAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.primary + '15', justifyContent: 'center', alignItems: 'center' },
  miniAvatarText: { fontSize: 10, fontWeight: '900', color: theme.colors.primary },
  noteContent: { flex: 1 },
  noteUser: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary },
  noteBody: { fontSize: 14, color: theme.colors.text, marginTop: 4, lineHeight: 20 },
  noteInputRow: { flexDirection: 'row', gap: 10 },
  noteInput: { flex: 1, height: 48, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: theme.colors.border, fontWeight: '600' },
  sendBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  
  timeline: { gap: 12 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  timelineText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '600' },
  miniPlay: { padding: 4, backgroundColor: theme.colors.primary + '10', borderRadius: 4 }
});

export default LeadDetailScreen;

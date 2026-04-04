import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { theme } from '../../theme';
import { Phone, MessageSquare, Mail, Calendar, User, ChevronRight } from 'lucide-react-native';

const LeadCard = ({ lead, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.accent} />
    
    <View style={styles.header}>
      <View style={styles.titleArea}>
        <Text style={styles.name}>{lead.name || 'Unnamed Lead'}</Text>
        <Text style={styles.subtext}>{lead.source || 'Direct Source'}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: theme.colors.status[lead.status?.toLowerCase()]?.bg || '#f3f4f6' }]}>
        <Text style={[styles.statusText, { color: theme.colors.status[lead.status?.toLowerCase()]?.text || '#374151' }]}>
          {lead.status}
        </Text>
      </View>
    </View>

    <View style={styles.assignmentBox}>
      <User size={14} color={theme.colors.primary} />
      <Text style={styles.assignmentText}>
        Assigned: {lead.assigned_employee_name || 'Unassigned'}
      </Text>
      <View style={styles.avatarMini}>
        <Text style={styles.avatarInitial}>{lead.assigned_employee_name?.charAt(0) || '?'}</Text>
      </View>
    </View>

    <View style={styles.detailsGrid}>
      <View style={styles.detailItem}>
         <Phone size={12} color={theme.colors.textMuted} />
         <Text style={styles.detailText}>{lead.phone_number}</Text>
      </View>
      <View style={styles.detailItem}>
         <Calendar size={12} color={theme.colors.textMuted} />
         <Text style={styles.detailText}>Follow-up: {lead.next_followup_date ? new Date(lead.next_followup_date).toLocaleDateString() : 'Not set'}</Text>
      </View>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity 
        style={[styles.btn, styles.callBtn]}
        onPress={() => lead.phone_number && Linking.openURL(`tel:${lead.phone_number}`)}
      >
        <Phone size={16} color={theme.colors.primary} />
        <Text style={styles.btnText}>Call</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.btn, styles.waBtn]}
        onPress={() => lead.phone_number && Linking.openURL(`whatsapp://send?phone=${lead.phone_number}`)}
      >
        <MessageSquare size={16} color={theme.colors.success} />
        <Text style={[styles.btnText, { color: theme.colors.success }]}>WhatsApp</Text>
      </TouchableOpacity>
      
      <View style={styles.moreBtn}>
        <ChevronRight size={18} color={theme.colors.textMuted} />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleArea: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  subtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  assignmentBox: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  assignmentText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  avatarMini: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  detailsGrid: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.mono,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
  },
  btn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtn: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '05',
  },
  waBtn: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '05',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  moreBtn: {
    paddingLeft: 4,
  }
});

export default LeadCard;

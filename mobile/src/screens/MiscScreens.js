import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { History, Users } from 'lucide-react-native';
import { theme } from '../theme';

export const ActivityScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Feed</Text>
      </View>
      <View style={styles.content}>
        <History size={48} color={theme.colors.border} />
        <Text style={styles.text}>Coming soon: Real-time company activity</Text>
      </View>
    </View>
  );
};

export const StaffScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Team Management</Text>
      </View>
      <View style={styles.content}>
        <Users size={48} color={theme.colors.border} />
        <Text style={styles.text}>Coming soon: Employee performance & conversion stats</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  text: { marginTop: 15, textAlign: 'center', color: theme.colors.textSecondary, fontSize: 16 }
});

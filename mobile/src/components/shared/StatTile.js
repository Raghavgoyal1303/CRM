import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { MousePointer2 } from 'lucide-react-native';

const StatTile = ({ title, value, icon: Icon, color, halfWidth = true, onPress }) => (
  <TouchableOpacity 
    style={[
      styles.tile, 
      halfWidth ? styles.halfWidth : styles.fullWidth,
      { backgroundColor: color + '05' } // Very light tint
    ]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.header}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
    <View style={styles.footer}>
      <MousePointer2 size={14} color={theme.colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0,
    borderColor: 'transparent',
    marginBottom: 12,
    ...theme.shadows.card,
  },
  halfWidth: {
    width: '48%',
  },
  fullWidth: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.heading,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    fontFamily: theme.fonts.heading,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 4,
  }
});

export default StatTile;

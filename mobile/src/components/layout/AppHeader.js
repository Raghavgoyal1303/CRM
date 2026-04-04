import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { Menu, Bell, User, ChevronLeft, MoreVertical } from 'lucide-react-native';

const AppHeader = ({ title, leftIcon = 'menu', rightActions = ['notif', 'avatar'], navigation }) => {
  const insets = useSafeAreaInsets();
  
  const handleMenuPress = () => {
    Alert.alert(
      'Quick Actions',
      'What would you like to do?',
      [
        { text: 'Add New Lead', onPress: () => navigation.navigate('AddLead') },
        { text: 'View Employees', onPress: () => navigation.navigate('Employees') },
        { text: 'Call Logs', onPress: () => navigation.navigate('CallLogs') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };
  
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => leftIcon === 'back' ? navigation.goBack() : Alert.alert('Menu', 'Side drawer coming soon!')}
        >
          {leftIcon === 'back' ? (
            <ChevronLeft size={24} color="#fff" />
          ) : (
            <Menu size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.actions}>
          {rightActions.includes('notif') && (
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Activity')}>
              <Bell size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {rightActions.includes('avatar') && (
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <User size={20} color="#fff" />
            </TouchableOpacity>
          )}
          {rightActions.includes('menu') && (
            <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
              <MoreVertical size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
    ...theme.shadows.premium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconBtn: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: theme.fonts.heading,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});

export default AppHeader;

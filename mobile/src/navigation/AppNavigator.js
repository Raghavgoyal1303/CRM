import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LeadListScreen from '../screens/LeadListScreen';
import LeadDetailScreen from '../screens/LeadDetailScreen';
import AddLeadScreen from '../screens/AddLeadScreen';
import TasksScreen from '../screens/TasksScreen';
import ActivityScreen from '../screens/ActivityScreen';
import StaffScreen from '../screens/StaffScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import CallLogsScreen from '../screens/CallLogsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen'; // NEW
import PerformanceScreen from '../screens/PerformanceScreen'; // NEW

import { 
  Home, 
  Users, 
  Calendar, 
  User, 
  Plus,
  Clock
} from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === 'FAB') {
                navigation.navigate('AddLead'); 
                return;
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const IconProvider = () => {
             const color = isFocused ? theme.colors.primary : theme.colors.textMuted;
             const size = 24;
             
             if (route.name === 'Home') return <Home size={size} color={color} />;
             if (route.name === 'Leads') return <Users size={size} color={color} />;
             if (route.name === 'FAB') return null; 
             if (route.name === 'Attendance') return <Clock size={size} color={color} />;
             if (route.name === 'Profile') return <User size={size} color={color} />;
             return null;
          };

          if (route.name === 'FAB') {
             return (
               <TouchableOpacity 
                 key="fab" 
                 onPress={onPress} 
                 style={styles.fabItem}
                 activeOpacity={0.9}
               >
                 <View style={styles.fabCircle}>
                    <Plus size={28} color="#fff" strokeWidth={3} />
                 </View>
               </TouchableOpacity>
             );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <IconProvider />
              <Text style={[styles.tabLabel, { color: isFocused ? theme.colors.primary : theme.colors.textMuted }]}>
                {route.name === 'Attendance' ? 'Attendance' : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Leads" component={LeadListScreen} />
      <Tab.Screen name="FAB" component={View} /> 
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background }
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="LeadDetail" component={LeadDetailScreen} />
            <Stack.Screen name="AddLead" component={AddLeadScreen} />
            <Stack.Screen name="Employees" component={EmployeesScreen} />
            <Stack.Screen name="CallLogs" component={CallLogsScreen} />
            <Stack.Screen name="Activity" component={ActivityScreen} />
            <Stack.Screen name="Tasks" component={TasksScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="Performance" component={PerformanceScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: { position: 'absolute', bottom: 0, width: width, paddingHorizontal: 0 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', height: 70, width: '100%', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.border, paddingHorizontal: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, fontWeight: '600', marginTop: 4, fontFamily: theme.fonts.body },
  fabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', top: -20 },
  fabCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 }
});

export default AppNavigator;

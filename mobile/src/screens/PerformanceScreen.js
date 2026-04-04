import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import StatTile from '../components/shared/StatTile';
import { Target, TrendingUp, Users, CheckCircle, BarChart3, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PerformanceScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="My Performance" navigation={navigation} leftIcon="back" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
           <View style={styles.heroHeader}>
              <View style={styles.zapBox}><Zap size={20} color="#fff" fill="#fff" /></View>
              <Text style={styles.heroTitle}>Top Operative Week 12</Text>
           </View>
           <Text style={styles.convLabel}>Conversion Rate</Text>
           <Text style={styles.convValue}>34%</Text>
           <View style={styles.chartBar}><View style={[styles.chartFill, { width: '34%' }]} /></View>
        </View>

        <View style={styles.tileGrid}>
           <StatTile title="Leads Handled" value="284" icon={Users} color={theme.colors.primary} />
           <StatTile title="Conversions" value="96" icon={CheckCircle} color={theme.colors.success} />
           <StatTile title="Target Met" value="88%" icon={Target} color={theme.colors.warning} />
           <StatTile title="Efficiency" value="High" icon={TrendingUp} color={theme.colors.primary} />
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Monthly Strategy</Text>
           <View style={styles.insightCard}>
              <BarChart3 size={24} color={theme.colors.primary} />
              <View style={styles.insightText}>
                 <Text style={styles.insightTitle}>Upsell Opportunity</Text>
                 <Text style={styles.insightDesc}>Review 'Site Visit' leads from last month. 12 potential conversion detected.</Text>
              </View>
           </View>
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>Updated: Today, 10:45 AM</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  heroCard: { backgroundColor: theme.colors.primary, borderRadius: 24, padding: 24, marginBottom: 24, ...theme.shadows.premium },
  heroHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  zapBox: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  heroTitle: { fontSize: 13, fontWeight: '900', color: '#fff', textTransform: 'uppercase' },
  convLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  convValue: { fontSize: 48, fontWeight: '900', color: '#fff', fontFamily: theme.fonts.heading, marginVertical: 4 },
  chartBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  chartFill: { height: '100%', backgroundColor: '#fff' },
  
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 16 },
  insightCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, flexDirection: 'row', gap: 16, borderWeight: 1, borderColor: theme.colors.border },
  insightText: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  insightDesc: { fontSize: 12, color: theme.colors.textSecondary, lineHeight: 18 },
  
  footer: { alignItems: 'center' },
  footerText: { fontSize: 11, fontWeight: '700', color: theme.colors.textMuted }
});

export default PerformanceScreen;

import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { leadsApi } from '../api';
import { theme } from '../theme';
import { X, User, Phone, Mail, MapPin, Briefcase, FileText } from 'lucide-react-native';

const FormInput = ({ icon: Icon, label, value, onChangeText, placeholder, keyboardType, multiline }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
      <Icon size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor={theme.colors.textSecondary}
      />
    </View>
  </View>
);

const AddLeadScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert('Error', 'Please enter at least the lead name.');
      return;
    }

    setLoading(true);
    try {
      await leadsApi.createLead(formData);
      Alert.alert('Success', 'Lead created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error creating lead:', error);
      Alert.alert('Error', 'Failed to create lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Lead</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.saveButton}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <FormInput 
              icon={User} 
              label="Full Name *" 
              value={formData.name} 
              onChangeText={(text) => setFormData({...formData, name: text})} 
              placeholder="e.g. John Doe" 
            />
            
            <FormInput 
              icon={Mail} 
              label="Email Address" 
              value={formData.email} 
              onChangeText={(text) => setFormData({...formData, email: text})} 
              placeholder="john@company.com" 
              keyboardType="email-address" 
            />

            <FormInput 
              icon={Phone} 
              label="Phone Number" 
              value={formData.phone} 
              onChangeText={(text) => setFormData({...formData, phone: text})} 
              placeholder="+1 (555) 000-0000" 
              keyboardType="phone-pad" 
            />

            <FormInput 
              icon={Briefcase} 
              label="Lead Source" 
              value={formData.source} 
              onChangeText={(text) => setFormData({...formData, source: text})} 
              placeholder="e.g. Website, LinkedIn, Referral" 
            />

            <FormInput 
              icon={FileText} 
              label="Notes" 
              value={formData.notes} 
              onChangeText={(text) => setFormData({...formData, notes: text})} 
              placeholder="Add any specific details about this lead..." 
              multiline 
            />
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Quick Tip</Text>
            <Text style={styles.tipsText}>
              Providing an email and phone number makes it easier to contact the lead directly from the app.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingTop: 15,
    minHeight: 120,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: theme.colors.text,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  tipsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  tipsText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  }
});

export default AddLeadScreen;

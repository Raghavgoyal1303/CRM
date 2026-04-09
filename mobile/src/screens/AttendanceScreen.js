import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Modal, 
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import AppHeader from '../components/layout/AppHeader';
import { Clock, Camera as CameraIcon, CheckCircle, XCircle, RefreshCcw } from 'lucide-react-native';
import api from '../api';
import { API_BASE_URL } from '../api/config';

const { width, height } = Dimensions.get('window');

const AttendanceScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (status?.clock_in && !status?.clock_out) {
      interval = setInterval(() => {
        const start = new Date(status.clock_in).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, now - start); // Safety: Prevent negative time
        
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      setElapsedTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [status]);

  const fetchStatus = async () => {
    try {
      const response = await api.get(`/attendance/status?userId=${user.id}`);
      if (response.data?.clock_in) {
        console.log('[Attendance] Active session found. Clock-in (UTC):', response.data.clock_in);
      }
      setStatus(response.data);
    } catch (error) {
      console.error('[Attendance] Status error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleClockPress = () => {
    if (!status || status.clock_out) {
      setShowCamera(true);
    } else {
      Alert.alert(
        'Clock Out',
        'Are you sure you want to clock out for today?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes, Clock Out', onPress: clockOut }
        ]
      );
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
        try {
            const photoData = await cameraRef.current.takePictureAsync({ quality: 0.5 });
            setPhoto(photoData.uri);
            setShowCamera(false);
            clockIn(photoData.uri);
        } catch (e) {
            console.error('Photo error:', e);
            Alert.alert('Error', 'Failed to capture photo');
        }
    }
  };

  const clockIn = async (uri) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('photo', {
      uri: uri,
      name: 'attendance.jpg',
      type: 'image/jpeg'
    });

    try {
      const response = await api.post(`/attendance/clock-in`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('[Attendance] Clock-in response:', response.data);
      Alert.alert('Success', 'Clock-in recorded!');
      fetchStatus();
    } catch (error) {
      console.error('Clock-in error:', error.response?.data || error.message);
      const msg = error.response?.data?.message || error.message;
      Alert.alert('Error', `Clock-in failed: ${msg}`);
    } finally {
      setUploading(false);
      setPhoto(null);
    }
  };

  const clockOut = async () => {
    setUploading(true);
    try {
      const response = await api.post(`/attendance/clock-out`, { userId: user.id });
      console.log('[Attendance] Clock-out response:', response.data);
      Alert.alert('Success', 'Clock-out recorded! See you tomorrow.');
      fetchStatus();
    } catch (error) {
      console.error('Clock-out error:', error.response?.data || error.message);
      const msg = error.response?.data?.message || error.message;
      Alert.alert('Error', `Clock-out failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={theme.colors.primary} /></View>;
  }

  const isClockedIn = status && !status.clock_out;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Attendance Home" navigation={navigation} />
      
      <View style={styles.content}>
        <View style={styles.timeSection}>
           <Text style={styles.liveClock}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
           <Text style={styles.dateText}>{currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: '2-digit' })}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.clockCircle, isClockedIn && styles.clockedOutCircle]} 
          onPress={handleClockPress}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <View style={styles.fingerprintBox}>
                 <Clock size={40} color="#fff" strokeWidth={1.5} />
              </View>
              <Text style={styles.clockLabel}>{isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.timerText}>{elapsedTime}</Text>

        <View style={styles.historyRow}>
           <View style={styles.historyItem}>
              <RefreshCcw size={24} color={theme.colors.success} />
              <Text style={styles.historyTime}>{status?.clock_in ? new Date(status.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Text>
              <Text style={styles.historyLabel}>CLOCK IN</Text>
           </View>
           <View style={styles.historyItem}>
              <Clock size={24} color={theme.colors.danger} />
              <Text style={styles.historyTime}>{status?.clock_out ? new Date(status.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Text>
              <Text style={styles.historyLabel}>CLOCK OUT</Text>
           </View>
        </View>
      </View>

      {/* Camera Modal - REFACTORED to fix Children warning */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          {permission?.granted ? (
            <>
              <CameraView 
                 style={styles.camera} 
                 facing="front"
                 ref={cameraRef}
              />
              {/* Overlay elements as siblings with Absolute Positioning */}
              <View style={styles.absoluteOverlay}>
                 <View style={styles.overlayTop}>
                    <Text style={styles.overlayText}>Center your face for verification</Text>
                 </View>
                 
                 <View style={styles.faceGuide} />
                 
                 <View style={styles.overlayBottom}>
                    <TouchableOpacity style={styles.snapBtn} onPress={takePicture}>
                       <View style={styles.snapOuter}>
                          <View style={styles.snapInner} />
                       </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelCam} onPress={() => setShowCamera(false)}>
                       <Text style={styles.cancelCamText}>Cancel</Text>
                    </TouchableOpacity>
                 </View>
              </View>
            </>
          ) : (
            <View style={styles.center}>
              <Text style={styles.errorText}>Camera permission needed</Text>
              <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                <Text style={styles.permissionText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-around', paddingVertical: 40 },
  timeSection: { alignItems: 'center' },
  liveClock: { fontSize: 32, fontWeight: '800', color: theme.colors.text, fontFamily: theme.fonts.heading },
  dateText: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 8 },
  clockCircle: { width: 220, height: 220, borderRadius: 110, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', ...theme.shadows.premium, borderWeight: 6, borderColor: '#fff' },
  clockedOutCircle: { backgroundColor: theme.colors.danger },
  fingerprintBox: { marginBottom: 10 },
  clockLabel: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  timerText: { fontSize: 40, fontWeight: '800', color: theme.colors.textSecondary, fontFamily: theme.fonts.mono },
  historyRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', paddingHorizontal: 40 },
  historyItem: { alignItems: 'center' },
  historyTime: { fontSize: 20, fontWeight: '800', color: theme.colors.text, marginTop: 12 },
  historyLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.textMuted, marginTop: 4 },
  
  // Camera Refactor Styles
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  absoluteOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 60 
  },
  overlayTop: { width: '100%', alignItems: 'center' },
  overlayBottom: { width: '100%', alignItems: 'center', gap: 20 },
  overlayText: { color: '#fff', fontSize: 16, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 },
  faceGuide: { width: 250, height: 250, borderRadius: 125, borderWidth: 2, borderColor: '#fff', borderStyle: 'dashed' },
  snapBtn: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  snapOuter: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  snapInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff' },
  cancelCam: { padding: 10 },
  cancelCamText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  errorText: { fontSize: 16, color: theme.colors.text, marginBottom: 20 },
  permissionBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  permissionText: { color: '#fff', fontWeight: '700' }
});

export default AttendanceScreen;

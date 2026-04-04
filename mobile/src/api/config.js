import Constants from 'expo-constants';

/**
 * LeadFlow Mobile API Configuration
 * 
 * Update: Hardcoded verified LAN IP 192.168.1.104 for industrial connectivity.
 */

const getBaseUrl = () => {
  // 1. Prioritize verified LAN IP (Hardcoded for stability)
  const LAN_IP = '192.168.1.104';
  
  // 2. Check if hostUri is available (Expo Go detection)
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    // console.log('[Mobile API] Detected Expo Host:', ip);
  }

  // Use the verified IP to resolve 'Network Error' on physical devices
  return `http://${LAN_IP}:5000/api`;
};

export const API_BASE_URL = getBaseUrl();
console.log('[Mobile API] Connected to Platform at:', API_BASE_URL);

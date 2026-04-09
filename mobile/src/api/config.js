import Constants from 'expo-constants';

/**
 * Tricity Verified Mobile API Configuration
 * 
 * Update: Hardcoded verified LAN IP 192.168.1.104 for industrial connectivity.
 */

const getBaseUrl = () => {
  // 1. Dynamic Local IP Detection (Expo Go / Development)
  const debuggerHost = Constants.expoConfig?.hostUri;
  const devIp = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

  // 2. Production URL (Fallback)
  // Replace with your real production domain when ready (e.g., https://api.tricityverified.com/api)
  const PROD_URL = 'https://api.tricityverified.com/api';

  // 3. Logic: If we have a dev host, use it. Otherwise, assume production.
  // Note: For physical devices in dev, the hostUri is essential.
  if (__DEV__) {
    return `http://${devIp}:5000/api`;
  }

  return PROD_URL;
};

export const API_BASE_URL = getBaseUrl();
console.log('[Mobile API] Connected to Platform at:', API_BASE_URL);

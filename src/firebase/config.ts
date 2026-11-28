// Firebase setup. No authentication is used: players are identified by their unique name.
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyClSHc1ooOz0OFjJAv4-5vocVhSeqYiR-I',
  authDomain: 'rang-9934a.firebaseapp.com',
  projectId: 'rang-9934a',
  storageBucket: 'rang-9934a.firebasestorage.app',
  messagingSenderId: '507064572151',
  appId: '1:507064572151:web:a31106ec73c5b4b456dbf2',
  measurementId: 'G-QGWCPGBHG2',
};

// Reuse the app if it was already created (fast refresh re-runs this file)
const isFirstInit = getApps().length === 0;
export const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// Long-polling auto-detection keeps Firestore working on React Native networks.
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

// Analytics only works in a browser (not on iOS/Android with the JS SDK), so it is turned on only where supported.
if (isFirstInit) {
  isSupported()
    .then((ok) => {
      if (ok) getAnalytics(app);
    })
    .catch(() => {});
}

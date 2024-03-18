import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'abuja-59217.firebaseapp.com',
  projectId: 'abuja-59217',
  storageBucket: 'abuja-59217.appspot.com',
  messagingSenderId: '954143033949',
  appId: '1:954143033949:web:3d1032e31c025a5c32dbb4',
};

export const app = initializeApp(firebaseConfig);

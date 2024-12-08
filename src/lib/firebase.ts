/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-11-28 17:42:02
 * @LastEditTime: 2024-12-08 02:08:14
 * @Description:
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBQatbifI3kwpiY9x7WDMPC0J7JhytAtoM',
  authDomain: 'jobapplicationtracker-50866.firebaseapp.com',
  projectId: 'jobapplicationtracker-50866',
  storageBucket: 'jobapplicationtracker-50866.firebasestorage.app',
  messagingSenderId: '502738928381',
  appId: '1:502738928381:web:60ede34e1b04d78e4a7494',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firebase: Import the functions you need from the SDKs you need
// import { auth } from '../lib/firebase';

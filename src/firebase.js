import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDt4a-eL5ycgyv-p3vZYzespcB3GfHizXA",
  authDomain: "prompt-organizer-v2.firebaseapp.com",
  projectId: "prompt-organizer-v2",
  storageBucket: "prompt-organizer-v2.firebasestorage.app",
  messagingSenderId: "383110405834",
  appId: "1:383110405834:web:23a67b60a6ff0e77e09e33",
  measurementId: "G-T79BLYTBWK"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
export const db = getFirestore(app)
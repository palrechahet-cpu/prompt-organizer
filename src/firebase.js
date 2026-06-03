import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBf0GyxNOHNYNtGlNdiaR6Eur2X1xUY4iQ",
  authDomain: "prompt-organizer-f8a53.firebaseapp.com",
  projectId: "prompt-organizer-f8a53",
  storageBucket: "prompt-organizer-f8a53.firebasestorage.app",
  messagingSenderId: "1070410455166",
  appId: "1:1070410455166:web:f7febb19a98f5ddc63e02f"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

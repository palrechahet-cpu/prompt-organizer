import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Login error code:', error.code)
      console.error('Login error message:', error.message)
      alert('Sign-in failed: ' + error.code)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl p-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">🎯</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Organizer</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Sign in to access your AI prompt library</p>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-zinc-800" />
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-semibold text-gray-700 dark:text-white transition-all duration-200 shadow-sm active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
            Continue with Google
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            By signing in, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  )
}